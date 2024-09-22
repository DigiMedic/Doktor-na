// app/api/stream/route.ts

import { embeddingVectorCacheKey, llmResultCacheKey, redis } from "@/db/redis";
import { supabase } from "@/db/supabase";
import { generateQueyEmbedding } from "@/lib/chat/embedding";
import { genLLMTextChunk, translate } from "@/lib/chat/llm";
import { addRefToUrl, genStream, sleep } from "@/lib/utils";
import { StreamEvent } from "@/schema/chat";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { query } = body;

  const customReadable = new ReadableStream({
    async start(controller) {
      try {
        const beginData = {
          event: StreamEvent.BEGIN_STREAM,
          data: { event_type: StreamEvent.BEGIN_STREAM, query: query },
        };
        controller.enqueue(genStream(beginData));
        const cacheResult: null | any = await redis.get(
          embeddingVectorCacheKey(query)
        );

        let documents: any[], queryEmbeddingError: PostgrestError | null = null;

        if (cacheResult) {
          documents = JSON.parse(cacheResult);
          console.log("search result", "cached");
        } else {
          // match documents
          const embedding = await generateQueyEmbedding(
            await translate({ query })
          );

          let result = await supabase.rpc("match_embeddings", {
            query_embedding: embedding,
            match_threshold: 0.78,
            match_count: 15,
          });
          
          if (result.error) {
            queryEmbeddingError = result.error;
          } else {
            documents = result.data || [];
          }
        }

        if (queryEmbeddingError) {
          console.error(queryEmbeddingError);
          controller.enqueue(
            genStream({
              event: StreamEvent.ERROR,
              data: {
                event_type: StreamEvent.ERROR,
                detail: "Error on query embeddings: " + queryEmbeddingError.message,
              },
            })
          );
          return; // Don't close the controller here
        }

        // Pokračujte se zbytkem kódu...