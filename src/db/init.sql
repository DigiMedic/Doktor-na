CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- content table
CREATE TABLE healthcare_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  contact_info TEXT,
  DruhZarizeni TEXT,
  OborPece TEXT,
  FormaPece TEXT,
  DruhPece TEXT,
  OdbornyZastupce TEXT,
  address TEXT,
  services TEXT,
  ext_info JSONB
);

-- chunk table
CREATE TABLE healthcare_providers_chunk (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  chunk_text TEXT,
  metadata JSONB,
  provider_id UUID NOT NULL,
  embedding vector(768),
  FOREIGN KEY (provider_id) REFERENCES healthcare_providers(id)
);

--  hnsw index for query performance
create index on healthcare_providers_chunk using hnsw (embedding vector_l2_ops);

-- rpc function for supabase client
create or replace function match_embeddings (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id UUID,
  metadata JSONB,
  provider_id UUID,
  chunk_text TEXT,
  similarity float,
  name TEXT,
  url TEXT,
  description TEXT,
  contact_info TEXT,
  DruhZarizeni TEXT,
  OborPece TEXT,
  FormaPece TEXT,
  DruhPece TEXT,
  OdbornyZastupce TEXT,
  address TEXT,
  services TEXT
)
language plpgsql
as $$
begin
  return query
  select
    healthcare_providers_chunk.id,
    healthcare_providers_chunk.metadata,
    healthcare_providers_chunk.provider_id,
    healthcare_providers_chunk.chunk_text,
    1 - (healthcare_providers_chunk.embedding <=> query_embedding) as similarity,
    healthcare_providers.name,
    healthcare_providers.url,
    healthcare_providers.description,
    healthcare_providers.contact_info,
    healthcare_providers.DruhZarizeni,
    healthcare_providers.OborPece,
    healthcare_providers.FormaPece,
    healthcare_providers.DruhPece,
    healthcare_providers.OdbornyZastupce,
    healthcare_providers.address,
    healthcare_providers.services
  from healthcare_providers_chunk
  join healthcare_providers on healthcare_providers_chunk.provider_id = healthcare_providers.id
  where 1 - (healthcare_providers_chunk.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;

