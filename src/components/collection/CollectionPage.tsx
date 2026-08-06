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

      {/* Main Grid Container matching Reference Image 2 */}
      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 w-full">
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
              "grid gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8",
              "grid-cols-2",
              gridCols === 2 && "lg:grid-cols-2",
              gridCols === 3 && "lg:grid-cols-3",
              gridCols === 4 && "lg:grid-cols-4"
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
      <section className="w-full bg-[#f9f9f8] border-t border-neutral-200/80 py-14 mt-12 text-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-black text-white">
                <Truck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold uppercase tracking-tight">Fast Delivery</h4>
                <p className="text-[12px] text-neutral-500 font-sans leading-relaxed">
                  Complimentary express shipping on all orders across India above ₹999.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-black text-white">
                <RefreshCcw className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold uppercase tracking-tight">14-Day Easy Exchanges</h4>
                <p className="text-[12px] text-neutral-500 font-sans leading-relaxed">
                  Hassle-free replacement guarantee on size, color, or fit adjustments.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-black text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold uppercase tracking-tight">Genuine Materials</h4>
                <p className="text-[12px] text-neutral-500 font-sans leading-relaxed">
                  Kitchen-grade 18/8 stainless steel and heavy-gauge reinforced stitching.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-black text-white">
                <Award className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold uppercase tracking-tight">Lifetime Build Guarantee</h4>
                <p className="text-[12px] text-neutral-500 font-sans leading-relaxed">
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
