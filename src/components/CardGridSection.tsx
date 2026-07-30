"use client";

import React from "react";
import Link from "next/link";
import { ProductCard, type Product } from "./ProductCard";

interface CardGridSectionProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  onAddToCart?: (product: Product) => void;
  onWishlistToggle?: (product: Product, isWishlisted: boolean) => void;
  onQuickView?: (product: Product) => void;
}

export function CardGridSection({
  title = "Bestsellers",
  subtitle = "Curated Selection",
  products,
  viewAllHref = "/all-products",
  onAddToCart,
  onWishlistToggle,
  onQuickView,
}: CardGridSectionProps) {
  // Ensure exactly the first 4 products remain in the grid
  const displayProducts = products.slice(0, 4);

  return (
    <section
      className="w-full relative block overflow-hidden"
      style={{
        backgroundColor: "#f5f5f5",
        paddingTop: "40px",
        paddingBottom: "60px",
        paddingLeft: "16px",
        paddingRight: "16px",
        width: "100%",
        borderTop: "1px solid #e5e5e5",
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          width: "100%",
          paddingLeft: "0px",
          paddingRight: "0px",
          boxSizing: "border-box",
        }}
      >
        {/* Section Header with 20px bottom spacing matching reference */}
        <div
          className="flex w-full flex-col items-center gap-1 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left"
          style={{ marginBottom: "24px" }}
        >
          <div className="flex flex-col items-center sm:items-start">
            {subtitle && (
              <p
                className="uppercase tracking-[0.22em] font-semibold"
                style={{
                  fontSize: "11px",
                  color: "#71717a",
                  marginBottom: "4px",
                }}
              >
                {subtitle}
              </p>
            )}
            <h2
              className="font-heading font-bold uppercase tracking-tight"
              style={{
                fontSize: "28px",
                lineHeight: "1.1",
                color: "#111111",
              }}
            >
              {title}
            </h2>
          </div>
        </div>

        {/* 4-Column Grid with crisp 10px gap matching reference inspect */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full"
          style={{
            gap: "14px",
            width: "100%",
          }}
        >
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onWishlistToggle={onWishlistToggle}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Center Outlined CTA Button */}
        {viewAllHref && (
          <div
            className="flex justify-center w-full"
            style={{
              marginTop: "40px",
              marginBottom: "8px",
            }}
          >
            <Link
              href={viewAllHref}
              className="inline-flex items-center justify-center bg-transparent text-[11px] font-semibold uppercase tracking-[0.18em] leading-none transition-all"
              style={{
                padding: "16px 36px",
                lineHeight: 1,
                border: "1px solid #111111",
                color: "#111111",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#111111'; (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = '#111111'; }}
            >
              View All Drops
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default CardGridSection;
