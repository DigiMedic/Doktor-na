/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SearchResult } from "@/schema/chat";

export const SearchResultsSkeleton = () => {
  return (
    <>
      <div className="flex flex-wrap w-full">
        {[...Array(4)].map((_, index) => (
          <div className="w-1/2 md:w-1/4 p-1" key={`skeleton-${index}`}>
            <Skeleton className="rounded-md shadow-none border-none h-[70px] bg-card " />
          </div>
        ))}
      </div>
    </>
  );
};

export const Logo = ({ url }: { url: string }) => {
  return (
    <div className="rounded-full overflow-hidden relative">
      <img
        className="block relative"
        src={`https://www.google.com/s2/favicons?sz=128&domain=${url}`}
        alt="favicon"
        width={16}
        height={16}
      />
    </div>
  );
};

export function SearchResults({ results }: { results: SearchResult[] }) {
  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div key={index} className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold">{result.title}</h3>
          <p className="text-sm text-gray-600">{result.description}</p>
          <p className="text-sm">{result.address}</p>
          <p className="text-sm">
            Telefon: {result.contact.phone}, Email: {result.contact.email}
          </p>
          <p className="text-sm">
            Forma péče: {result.specialization.FormaPece}, Druh péče: {result.specialization.DruhPece}
          </p>
          <p className="text-sm">
            Odborný zástupce: {result.specialization.OdbornyZastupce}
          </p>
          <p className="text-sm">
            Kraj: {result.region.Kraj}, Okres: {result.region.Okres}
          </p>
          <p className="text-sm">IČO: {result.Ico}</p>
          {result.url && (
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Webové stránky
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
