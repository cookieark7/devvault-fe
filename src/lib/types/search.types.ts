import { Tag } from "./tag.types";

export interface SearchResult {
  id: string;
  type: "snippet" | "bookmark" | "command" | "prompt";
  title: string;
  preview: string;
  language?: string;
  url?: string;
  tags: Tag[];
  similarity?: number; // 0-1
  createdAt: Date;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  total: number;
  searchType: "semantic" | "keyword" | "hybrid";
}
