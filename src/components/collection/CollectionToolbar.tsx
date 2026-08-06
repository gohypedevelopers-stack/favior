"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
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
  gridCols: 2 | 3 | 4;
  onGridColsChange: (cols: 2 | 3 | 4) => void;
}

export function CollectionToolbar({
  filteredCount,
  activeCategory,
  onSelectCategory,
  filterState,
  onFilterChange,
  onResetFilters,
}: CollectionToolbarProps) {
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const hasActiveFilters =
    filterState.searchQuery.trim() !== "" ||
    filterState.inStockOnly ||
    filterState.maxPrice < 10000 ||
    filterState.minPrice > 0 ||
    Boolean(filterState.selectedColor);

  return (
    <div className="w-full bg-white text-black font-sans pt-2 pb-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Floating Rounded Bar Container matching Reference Image 2 */}
        <div className="w-full rounded-xl sm:rounded-2xl border border-neutral-200/90 bg-white p-3 sm:px-6 sm:py-3.5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              SORT BY:
            </span>
            <div className="relative inline-flex items-center">
              <select
                aria-label="Sort products by"
                value={filterState.sortBy}
                onChange={(e) =>
                  onFilterChange({ sortBy: e.target.value as SortOption })
                }
                className="appearance-none bg-transparent pr-6 text-[11px] font-bold uppercase tracking-wider text-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value="featured">BESTSELLER</option>
                <option value="price-asc">PRICE: LOW TO HIGH</option>
                <option value="price-desc">PRICE: HIGH TO LOW</option>
                <option value="rating">HIGHEST RATED</option>
                <option value="name-asc">ALPHABETICAL</option>
              </select>
              <ChevronDown className="absolute right-0 h-3.5 w-3.5 text-neutral-600 pointer-events-none" />
            </div>
          </div>

          {/* Center: Category Tabs with Bottom Underline Indicator */}
          <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto py-1 scrollbar-none">
            {collectionCategories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => onSelectCategory(cat.key)}
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-[0.14em] transition-all cursor-pointer whitespace-nowrap pb-1 border-b-2",
                    isActive
                      ? "border-black text-black font-extrabold"
                      : "border-transparent text-neutral-400 hover:text-black"
                  )}
                >
                  {cat.name.replace(/ & STRAPS| & BANDS| & FLASKS| & KITS/g, "")}
                </button>
              );
            })}
          </div>

          {/* Right: Search & Type Filter Toggle */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={filterState.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                className="pl-7 pr-6 py-1 text-[11px] uppercase border border-neutral-200 rounded-lg bg-neutral-50/80 focus:bg-white focus:border-black focus:outline-none w-32 lg:w-40 font-sans"
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

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer",
                filterPanelOpen || hasActiveFilters
                  ? "border-black bg-black text-white"
                  : "border-neutral-200 bg-neutral-50/80 text-neutral-800 hover:border-black hover:bg-white"
              )}
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>TYPE: {filterState.inStockOnly ? "IN STOCK" : "ALL"}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Product Count Indicator below Card on Right */}
        <div className="w-full text-right mt-2 mb-4 pr-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            ({filteredCount} {filteredCount === 1 ? "PRODUCT" : "PRODUCTS"} AVAILABLE)
          </span>
        </div>

        {/* Expandable Filter Drawer Panel */}
        {filterPanelOpen && (
          <div className="mb-6 pt-4 pb-4 border border-neutral-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-neutral-50 p-4 sm:p-5">
            {/* Price Filter */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800">
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
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>₹500</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800">
                Availability
              </span>
              <label className="flex items-center gap-2 text-[12px] font-medium text-black cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterState.inStockOnly}
                  onChange={(e) =>
                    onFilterChange({ inStockOnly: e.target.checked })
                  }
                  className="rounded border-neutral-300 accent-black cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Color Swatch Filter */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800">
                Finish Palette
              </span>
              <div className="flex items-center gap-2">
                {[
                  { name: "Black", color: "#000000" },
                  { name: "White", color: "#ffffff" },
                  { name: "Steel", color: "#4a4a4a" },
                ].map((c) => {
                  const isSelected = filterState.selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() =>
                        onFilterChange({
                          selectedColor: isSelected ? undefined : c.name,
                        })
                      }
                      title={c.name}
                      className={cn(
                        "h-6 w-6 rounded-full border p-0.5 transition-all cursor-pointer",
                        isSelected
                          ? "border-black scale-110 ring-1 ring-black"
                          : "border-neutral-300 opacity-70 hover:opacity-100"
                      )}
                    >
                      <span
                        className="block h-full w-full rounded-full border border-black/10"
                        style={{ backgroundColor: c.color }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Action */}
            <div className="flex items-end justify-start sm:justify-end">
              <button
                type="button"
                onClick={onResetFilters}
                className="text-[11px] font-bold uppercase tracking-[0.14em] text-black hover:text-neutral-600 underline underline-offset-4 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
