"use client";

import React from "react";
import Link from "next/link";
import { ProductCard, type Product } from "@/components/ProductCard";
import { catalogProducts } from "@/components/collection/collectionData";

interface ProductRecommendationsProps {
  currentSlug?: string;
  currentId?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export function ProductRecommendations({
  currentSlug = "",
  currentId = "",
  title = "You May Also Like",
  subtitle = "Complete Your Setup",
  limit = 4,
}: ProductRecommendationsProps) {
  // Normalize current identifier
  const normalizedSlug = currentSlug.toLowerCase().trim();
  const normalizedId = currentId.toLowerCase().trim();

  // Filter out the active product from the catalog
  const filtered = catalogProducts.filter((item) => {
    const itemSlug = item.href ? item.href.split("/").pop() || "" : "";
    return (
      item.id.toLowerCase() !== normalizedId &&
      item.id.toLowerCase() !== normalizedSlug &&
      itemSlug.toLowerCase() !== normalizedSlug
    );
  });

  const displayProducts: Product[] = filtered.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section
      className="w-full relative block overflow-hidden"
      style={{
        backgroundColor: "transparent",
        paddingTop: "56px",
        paddingBottom: "72px",
        paddingLeft: "16px",
        paddingRight: "16px",
        width: "100%",
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Section Header */}
        <div
          className="flex w-full flex-col items-center gap-1 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left"
          style={{ marginBottom: "28px" }}
        >
          <div className="flex flex-col items-center sm:items-start">
            {subtitle && (
              <p
                className="uppercase tracking-[0.22em] font-semibold"
                style={{
                  fontSize: "11px",
                  color: "rgba(0, 0, 0, 0.5)",
                  marginBottom: "4px",
                }}
              >
                {subtitle}
              </p>
            )}
            <h2
              className="font-bold uppercase tracking-tight"
              style={{
                fontSize: "26px",
                lineHeight: "1.15",
                color: "#111111",
                margin: 0,
              }}
            >
              {title}
            </h2>
          </div>

          <Link
            href="/collection/all"
            className="hidden sm:inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.14em] text-neutral-800 hover:text-black transition-colors"
            style={{ textDecoration: "none" }}
          >
            Explore Catalog &rarr;
          </Link>
        </div>

        {/* 4-Column Product Grid (2 on mobile, 4 on desktop) */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 w-full"
          style={{
            gap: "14px",
            width: "100%",
          }}
        >
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Center Outlined CTA Button on Mobile */}
        <div
          className="flex justify-center w-full sm:hidden"
          style={{
            marginTop: "32px",
          }}
        >
          <Link
            href="/collection/all"
            className="inline-flex items-center justify-center bg-transparent text-[11px] font-semibold uppercase tracking-[0.18em] leading-none transition-all"
            style={{
              padding: "14px 28px",
              lineHeight: 1,
              border: "1px solid #111111",
              color: "#111111",
              textDecoration: "none",
            }}
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProductRecommendations;
