"use client";

import React, { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import type { SortOption, FilterState, CollectionCategoryKey } from "@/types/collection";
import { collectionCategories } from "./collectionData";
import { cn } from "@/lib/utils";

interface CollectionToolbarProps {
  totalCount: number;
  filteredCount: number;
  activeCategory: CollectionCategoryKey;
  onSelectCategory: (key: CollectionCategoryKey) => void;
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  gridCols?: 2 | 3 | 4;
  onGridColsChange?: (cols: 2 | 3 | 4) => void;
}

const CATEGORY_SHORT_NAMES: Record<CollectionCategoryKey, string> = {
  all: "ALL PRODUCTS",
  shakers: "SHAKERS",
  wristbands: "WRIST WRAPS",
  accessories: "ACCESSORIES",
  bundles: "BUNDLES",
};

export function CollectionToolbar({
  filteredCount,
  activeCategory,
  onSelectCategory,
  filterState,
  onFilterChange,
  onResetFilters,
}: CollectionToolbarProps) {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const hasActiveFilters =
    filterState.searchQuery.trim() !== "" ||
    filterState.inStockOnly ||
    filterState.maxPrice < 10000 ||
    filterState.minPrice > 0 ||
    Boolean(filterState.selectedColor);

  return (
    <div style={{ width: "100%", backgroundColor: "#ffffff" }}>
      {/* 1. Category Sub-Navigation Links (Centered) matching Reference Image */}
      <div
        style={{
          width: "100%",
          borderTop: "1px solid #f0f0f0",
          paddingTop: "20px",
          paddingBottom: "20px",
          paddingLeft: "16px",
          paddingRight: "16px",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "36px",
            overflowX: "auto",
          }}
        >
          {collectionCategories.map((cat) => {
            const isActive = activeCategory === cat.key;
            const displayName = CATEGORY_SHORT_NAMES[cat.key] || cat.name;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => onSelectCategory(cat.key)}
                className={cn(
                  "text-[11px] sm:text-[12px] uppercase tracking-[0.18em] transition-all cursor-pointer whitespace-nowrap pb-1 border-b-2 font-semibold",
                  isActive
                    ? "border-black text-black font-bold"
                    : "border-transparent text-neutral-500 hover:text-black"
                )}
              >
                {displayName}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Full-Width Filter & Sort Toolbar Bar matching Reference Image */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#f4f4f4",
          borderTop: "1px solid rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          paddingTop: "16px",
          paddingBottom: "16px",
          paddingLeft: "32px",
          paddingRight: "32px",
          marginBottom: "28px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {/* Left Side: FILTER & Dropdown Triggers */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-black">
              FILTER:
            </span>

            {/* Category Dropdown Filter */}
            <div className="relative inline-flex items-center">
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black hover:text-neutral-600 cursor-pointer"
              >
                <span>CATEGORY</span>
                <ChevronDown className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Availability Filter Toggle */}
            <div className="relative inline-flex items-center">
              <button
                type="button"
                onClick={() =>
                  onFilterChange({ inStockOnly: !filterState.inStockOnly })
                }
                className={cn(
                  "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] cursor-pointer transition-colors",
                  filterState.inStockOnly ? "text-black underline" : "text-black hover:text-neutral-600"
                )}
              >
                <span>AVAILABILITY</span>
                <ChevronDown className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-[10px] font-bold uppercase tracking-wider text-red-600 underline cursor-pointer ml-2"
              >
                RESET FILTERS
              </button>
            )}
          </div>

          {/* Right Side: SORT BY Dropdown & Styles Count */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
                SORT BY:
              </span>
              <div className="relative inline-flex items-center">
                <select
                  aria-label="Sort products by"
                  value={filterState.sortBy}
                  onChange={(e) =>
                    onFilterChange({ sortBy: e.target.value as SortOption })
                  }
                  className="appearance-none bg-transparent pr-4 text-[11px] font-bold uppercase tracking-[0.14em] text-black focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-white text-black">FEATURED</option>
                  <option value="price-asc" className="bg-white text-black">PRICE: LOW TO HIGH</option>
                  <option value="price-desc" className="bg-white text-black">PRICE: HIGH TO LOW</option>
                  <option value="rating" className="bg-white text-black">HIGHEST RATED</option>
                  <option value="name-asc" className="bg-white text-black">ALPHABETICAL</option>
                </select>
                <ChevronDown className="absolute right-0 h-3.5 w-3.5 text-black pointer-events-none stroke-[2.5]" />
              </div>
            </div>

            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
              {filteredCount} {filteredCount === 1 ? "STYLE" : "STYLES"}
            </span>
          </div>
        </div>

        {/* Expandable Filter Drawer Panel */}
        {filterDrawerOpen && (
          <div className="max-w-[1400px] mx-auto mt-4 pt-4 border-t border-neutral-300/70 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white p-5 rounded-xl shadow-xs">
            {/* Search Input */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">
                Search Keyword
              </span>
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="SEARCH PRODUCTS..."
                  value={filterState.searchQuery}
                  onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                  className="pl-8 pr-7 py-1.5 text-[11px] uppercase border border-neutral-300 rounded-md bg-white focus:border-black focus:outline-none w-full font-sans"
                />
                {filterState.searchQuery && (
                  <button
                    type="button"
                    onClick={() => onFilterChange({ searchQuery: "" })}
                    className="absolute right-2 text-neutral-400 hover:text-black cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">
                Max Price: ₹{filterState.maxPrice.toLocaleString()}
              </span>
              <input
                type="range"
                min={500}
                max={10000}
                step={250}
                value={filterState.maxPrice}
                onChange={(e) =>
                  onFilterChange({ maxPrice: Number(e.target.value) })
                }
                className="w-full accent-black cursor-pointer"
              />
            </div>

            {/* Availability */}
            <div className="space-y-1.5 flex flex-col justify-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">
                Stock Status
              </span>
              <label className="flex items-center gap-2 text-[11px] font-semibold text-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterState.inStockOnly}
                  onChange={(e) =>
                    onFilterChange({ inStockOnly: e.target.checked })
                  }
                  className="rounded border-neutral-300 accent-black cursor-pointer"
                />
                <span>In Stock Items Only</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollectionToolbar;

