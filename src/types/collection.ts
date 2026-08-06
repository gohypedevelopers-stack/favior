import { Product } from "@/components/ProductCard";

export type CollectionCategoryKey =
  | "all"
  | "shakers"
  | "wristbands"
  | "accessories"
  | "bundles";

export interface CollectionCategory {
  key: CollectionCategoryKey;
  slug: string;
  name: string;
  count: number;
}

export interface CollectionDetail {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  heroImage?: string;
  categoryKey: CollectionCategoryKey;
  breadcrumb: Array<{
    label: string;
    href?: string;
  }>;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "name-asc";

export interface FilterState {
  searchQuery: string;
  inStockOnly: boolean;
  minPrice: number;
  maxPrice: number;
  selectedColor?: string;
  sortBy: SortOption;
}
