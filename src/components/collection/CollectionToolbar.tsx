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
    <div style={{ width: "100%", backgroundColor: "#ffffff", fontFamily: "sans-serif" }}>
      {/* ========================================================================= */}
      {/* 1. MOBILE VIEW (< 768px): Clean scrollable sub-nav & padded mobile toolbar */}
      {/* ========================================================================= */}
      <div className="block md:hidden w-full">
        {/* Category Sub-Navigation Bar */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#ffffff",
            borderTop: "1px solid #f0f0f0",
            borderBottom: "1px solid #f0f0f0",
            paddingTop: "16px",
            paddingBottom: "16px",
            paddingLeft: "20px",
            paddingRight: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              maxWidth: "1240px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "24px",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              boxSizing: "border-box",
              paddingBottom: "2px",
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
                  style={{
                    fontSize: "11px",
                    fontWeight: isActive ? 800 : 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: isActive ? "#000000" : "#737373",
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: isActive ? "2px solid #000000" : "2px solid transparent",
                    paddingBottom: "4px",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "all 0.15s ease",
                  }}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gray Filter & Sort Mobile Bar */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#f4f4f4",
            borderTop: "1px solid rgba(0, 0, 0, 0.1)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            paddingTop: "14px",
            paddingBottom: "14px",
            paddingLeft: "20px",
            paddingRight: "20px",
            marginBottom: "24px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Top Row: FILTER, CATEGORY, AVAILABILITY */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", width: "100%", boxSizing: "border-box" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#111111" }}>
                FILTER:
              </span>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", paddingLeft: "14px", paddingRight: "12px", paddingTop: "7px", paddingBottom: "7px", borderRadius: "6px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#111111", cursor: "pointer", boxSizing: "border-box" }}
              >
                <span>CATEGORY</span>
                <ChevronDown className={cn("h-3.5 w-3.5 stroke-[2] transition-transform duration-200", filterDrawerOpen && "rotate-180")} />
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ inStockOnly: !filterState.inStockOnly })}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", paddingLeft: "14px", paddingRight: "12px", paddingTop: "7px", paddingBottom: "7px", borderRadius: "6px", backgroundColor: filterState.inStockOnly ? "#111111" : "#ffffff", border: filterState.inStockOnly ? "1px solid #111111" : "1px solid #d1d5db", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: filterState.inStockOnly ? "#ffffff" : "#111111", cursor: "pointer", boxSizing: "border-box" }}
              >
                <span>AVAILABILITY</span>
                <ChevronDown className="h-3.5 w-3.5 stroke-[2]" />
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#dc2626", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", marginLeft: "4px" }}
                >
                  RESET
                </button>
              )}
            </div>

            {/* Bottom Row: SORT BY & STYLES */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", paddingTop: "8px", borderTop: "1px solid rgba(0, 0, 0, 0.08)", boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "10.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#666666" }}>
                  SORT BY:
                </span>
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <select
                    aria-label="Sort products by"
                    value={filterState.sortBy}
                    onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
                    style={{ appearance: "none", WebkitAppearance: "none", backgroundColor: "#ffffff", border: "1px solid #d1d5db", paddingLeft: "12px", paddingRight: "28px", paddingTop: "6px", paddingBottom: "6px", borderRadius: "6px", fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#111111", outline: "none", cursor: "pointer", boxSizing: "border-box" }}
                  >
                    <option value="featured">FEATURED</option>
                    <option value="price-asc">PRICE: LOW TO HIGH</option>
                    <option value="price-desc">PRICE: HIGH TO LOW</option>
                    <option value="rating">HIGHEST RATED</option>
                    <option value="name-asc">ALPHABETICAL</option>
                  </select>
                  <ChevronDown style={{ position: "absolute", right: "8px", width: "14px", height: "14px", color: "#111111", pointerEvents: "none", strokeWidth: 2 }} />
                </div>
              </div>
              <span style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#666666", whiteSpace: "nowrap" }}>
                {filteredCount} {filteredCount === 1 ? "STYLE" : "STYLES"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP VIEW (>= 768px): Original desktop toolbar layout               */}
      {/* ========================================================================= */}
      <div className="hidden md:block w-full">
        {/* Centered Sub-Navigation Links */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#ffffff",
            borderTop: "1px solid #f0f0f0",
            borderBottom: "1px solid #f0f0f0",
            paddingTop: "24px",
            paddingBottom: "24px",
            paddingLeft: "32px",
            paddingRight: "32px",
            boxSizing: "border-box",
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
                    "text-[12px] uppercase tracking-[0.18em] transition-all cursor-pointer whitespace-nowrap pb-1 border-b-2",
                    isActive
                      ? "border-black text-black font-semibold"
                      : "border-transparent text-neutral-500 hover:text-black font-medium"
                  )}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Full-Width Gray Filter Toolbar Bar */}
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
            }}
          >
            {/* Left: FILTER, CATEGORY, AVAILABILITY */}
            <div className="flex items-center gap-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-800">
                FILTER:
              </span>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  paddingLeft: "16px",
                  paddingRight: "12px",
                  paddingTop: "7px",
                  paddingBottom: "7px",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#111111",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <span>CATEGORY</span>
                <ChevronDown className={cn("h-3.5 w-3.5 stroke-[2] transition-transform duration-200", filterDrawerOpen && "rotate-180")} />
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ inStockOnly: !filterState.inStockOnly })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  paddingLeft: "16px",
                  paddingRight: "12px",
                  paddingTop: "7px",
                  paddingBottom: "7px",
                  borderRadius: "6px",
                  backgroundColor: filterState.inStockOnly ? "#f3f4f6" : "#ffffff",
                  border: filterState.inStockOnly ? "1px solid #111111" : "1px solid #d1d5db",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#111111",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <span>AVAILABILITY</span>
                <ChevronDown className="h-3.5 w-3.5 stroke-[2]" />
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-[10px] font-semibold uppercase tracking-wider text-red-600 underline cursor-pointer ml-1"
                >
                  RESET FILTERS
                </button>
              )}
            </div>

            {/* Right: SORT BY & STYLES COUNT */}
            <div className="flex items-center gap-6 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
                  SORT BY:
                </span>
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <select
                    aria-label="Sort products by"
                    value={filterState.sortBy}
                    onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
                    style={{
                      appearance: "none",
                      WebkitAppearance: "none",
                      backgroundColor: "#ffffff",
                      border: "1px solid #d1d5db",
                      paddingLeft: "16px",
                      paddingRight: "34px",
                      paddingTop: "7px",
                      paddingBottom: "7px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "#111111",
                      outline: "none",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="featured">FEATURED</option>
                    <option value="price-asc">PRICE: LOW TO HIGH</option>
                    <option value="price-desc">PRICE: HIGH TO LOW</option>
                    <option value="rating">HIGHEST RATED</option>
                    <option value="name-asc">ALPHABETICAL</option>
                  </select>
                  <ChevronDown style={{ position: "absolute", right: "12px", width: "14px", height: "14px", color: "#111111", pointerEvents: "none", strokeWidth: 2 }} />
                </div>
              </div>
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                {filteredCount} {filteredCount === 1 ? "STYLE" : "STYLES"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Expandable Filter Drawer Panel */}
      {filterDrawerOpen && (
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto 24px auto",
            paddingTop: "20px",
            paddingBottom: "20px",
            paddingLeft: "24px",
            paddingRight: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            border: "1px solid #e5e5e5",
            boxSizing: "border-box",
          }}
        >
          {/* Price Filter Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#111111" }}>
              Max Price: ₹{filterState.maxPrice.toLocaleString()}
            </span>
            <input
              type="range"
              min={500}
              max={10000}
              step={250}
              value={filterState.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              style={{ width: "100%", accentColor: "#000000", cursor: "pointer", marginTop: "4px" }}
            />
          </div>

          {/* Availability Checkbox */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>
            <span style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#111111" }}>
              Stock Status
            </span>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "10.5px", fontWeight: 700, color: "#111111", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={filterState.inStockOnly}
                onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
                style={{ width: "16px", height: "16px", accentColor: "#000000", cursor: "pointer" }}
              />
              <span>In Stock Items Only</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectionToolbar;
