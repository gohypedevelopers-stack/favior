"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Truck, ShieldCheck, RefreshCcw, Award } from "lucide-react";
import { ProductCard, type Product } from "@/components/ProductCard";
import { CollectionHeader } from "./CollectionHeader";
import { CollectionToolbar } from "./CollectionToolbar";
import { QuickViewModal } from "./QuickViewModal";
import {
  catalogProducts,
  collectionsRegistry,
  type CatalogItem,
} from "./collectionData";
import type {
  CollectionDetail,
  CollectionCategoryKey,
  FilterState,
} from "@/types/collection";
import { cn } from "@/lib/utils";

interface CollectionPageProps {
  initialCollection?: CollectionDetail;
  initialCategory?: CollectionCategoryKey;
}

const DEFAULT_FILTER_STATE: FilterState = {
  searchQuery: "",
  inStockOnly: false,
  minPrice: 0,
  maxPrice: 10000,
  selectedColor: undefined,
  sortBy: "featured",
};

export function CollectionPage({
  initialCollection,
  initialCategory = "all",
}: CollectionPageProps) {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<CollectionCategoryKey>(
    initialCategory || initialCollection?.categoryKey || "all"
  );
  const [filterState, setFilterState] =
    useState<FilterState>(DEFAULT_FILTER_STATE);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<CatalogItem | null>(
    null
  );
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentCollection = useMemo(() => {
    if (activeCategory === "all") {
      return initialCollection || collectionsRegistry.all;
    }
    return collectionsRegistry[activeCategory] || collectionsRegistry.all;
  }, [activeCategory, initialCollection]);

  const handleCategoryChange = (key: CollectionCategoryKey) => {
    setActiveCategory(key);
    if (key === "all") {
      router.push("/collections");
    } else {
      router.push(`/collections/${key}`);
    }
  };

  const handleFilterUpdate = (updates: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilterState(DEFAULT_FILTER_STATE);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = catalogProducts.slice();

    // 1. Category Filter
    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }

    // 2. Search Filter
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.desc && item.desc.toLowerCase().includes(q)) ||
          (item.badge && item.badge.toLowerCase().includes(q))
      );
    }

    // 3. In Stock Only
    if (filterState.inStockOnly) {
      result = result.filter((item) => item.inStock);
    }

    // 4. Max Price Filter
    if (filterState.maxPrice < 10000) {
      result = result.filter((item) => item.numericPrice <= filterState.maxPrice);
    }

    // 5. Selected Color
    if (filterState.selectedColor) {
      result = result.filter(
        (item) =>
          item.colorName &&
          item.colorName.toLowerCase().includes(filterState.selectedColor!.toLowerCase())
      );
    }

    // 6. Sorting
    if (filterState.sortBy === "price-asc") {
      result.sort((a, b) => a.numericPrice - b.numericPrice);
    } else if (filterState.sortBy === "price-desc") {
      result.sort((a, b) => b.numericPrice - a.numericPrice);
    } else if (filterState.sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filterState.sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [activeCategory, filterState]);

  const handleAddToCart = (product: Product) => {
    setToastMessage(`Added "${product.name}" to cart.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleWishlistToggle = (product: Product, isWishlisted: boolean) => {
    setToastMessage(
      isWishlisted
        ? `Added "${product.name}" to wishlist.`
        : `Removed "${product.name}" from wishlist.`
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickView = (product: Product) => {
    const found = catalogProducts.find((p) => p.id === product.id) || (product as CatalogItem);
    setQuickViewProduct(found);
    setIsQuickViewOpen(true);
  };

  return (
    <main className="w-full bg-white text-black min-h-screen flex flex-col font-sans">
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10001] bg-black text-white px-5 py-3 text-[12px] font-medium uppercase tracking-wider shadow-2xl border border-white/20 animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Collection Header Banner */}
      <CollectionHeader
        collection={currentCollection}
        activeCategory={activeCategory}
        onSelectCategory={handleCategoryChange}
        totalProductsCount={catalogProducts.length}
      />

      {/* Floating Filter, Search & Category Switcher Toolbar */}
      <CollectionToolbar
        totalCount={catalogProducts.length}
        filteredCount={filteredAndSortedProducts.length}
        activeCategory={activeCategory}
        onSelectCategory={handleCategoryChange}
        filterState={filterState}
        onFilterChange={handleFilterUpdate}
        onResetFilters={handleResetFilters}
        gridCols={gridCols}
        onGridColsChange={setGridCols}
      />

      {/* Main Grid Container matching Reference Image */}
      <div
        style={{
          flex: 1,
          maxWidth: "1400px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "24px",
          paddingBottom: "64px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20 border border-neutral-200 bg-neutral-50 rounded-2xl p-8 space-y-4">
            <h3 className="text-2xl font-bold uppercase tracking-tight">No Products Found</h3>
            <p className="text-[13px] text-neutral-500 font-normal max-w-md mx-auto">
              We couldn’t find any items matching your active search or filter criteria. Try resetting your filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-block px-6 py-2.5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-neutral-800 transition-colors cursor-pointer rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-5 sm:gap-6 lg:gap-8",
              "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            )}
          >
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onWishlistToggle={handleWishlistToggle}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Atelier Craftsmanship & Trust Banner */}
      <section
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          borderTop: "1px solid #e5e5e5",
          borderBottom: "1px solid #e5e5e5",
          paddingTop: "52px",
          paddingBottom: "52px",
          marginTop: "40px",
          color: "#111111",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            paddingLeft: "24px",
            paddingRight: "24px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "32px",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                }}
              >
                <Truck style={{ width: "20px", height: "20px" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <h4
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#111111",
                    margin: 0,
                  }}
                >
                  Fast Delivery
                </h4>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#767676",
                    lineHeight: "1.6",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  Complimentary express shipping on all orders across India above ₹999.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                }}
              >
                <RefreshCcw style={{ width: "20px", height: "20px" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <h4
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#111111",
                    margin: 0,
                  }}
                >
                  14-Day Easy Exchanges
                </h4>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#767676",
                    lineHeight: "1.6",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  Hassle-free replacement guarantee on size, color, or fit adjustments.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                }}
              >
                <ShieldCheck style={{ width: "20px", height: "20px" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <h4
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#111111",
                    margin: 0,
                  }}
                >
                  Genuine Materials
                </h4>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#767676",
                    lineHeight: "1.6",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  Kitchen-grade 18/8 stainless steel and heavy-gauge reinforced stitching.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                }}
              >
                <Award style={{ width: "20px", height: "20px" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <h4
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#111111",
                    margin: 0,
                  }}
                >
                  Lifetime Build Guarantee
                </h4>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#767676",
                    lineHeight: "1.6",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  Every piece is built to withstand maximum loads and rigorous training.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal Dialog */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
}

export default CollectionPage;
