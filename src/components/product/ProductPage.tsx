"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductGallery } from "./ProductGallery";
import { ProductSummary } from "./ProductSummary";
import { ProductHighlights } from "./ProductHighlights";
import { ProductReviews } from "./ProductReviews";
import { ProductRecommendations } from "./ProductRecommendations";
import type { ProductDetail } from "./productData";

export function ProductPage({ product }: { product: ProductDetail }) {
  return (
    <main
      style={{
        width: "100%",
        backgroundColor: "transparent",
        color: "#111111",
        overflowX: "clip",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
      className="flex-1 min-w-0"
    >
      <section
        style={{
          width: "100%",
          maxWidth: "1280px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "24px 20px 56px 20px",
          boxSizing: "border-box",
        }}
      >
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            marginBottom: "20px",
          }}
        >
          <ol
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "6px",
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#767676",
              fontWeight: "500",
            }}
          >
            {product.breadcrumb.map((crumb, index) => {
              const isLast = index === product.breadcrumb.length - 1;
              return (
                <li
                  key={`${crumb.label}-${index}`}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      style={{
                        color: "#767676",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#111111")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#767676")}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      style={{
                        color: isLast ? "#111111" : "#767676",
                        fontWeight: isLast ? "600" : "500",
                      }}
                    >
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <ChevronRight
                      style={{ width: "12px", height: "12px", color: "rgba(0,0,0,0.25)" }}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Grid Layout: Sticky Gallery (Left) & Summary (Right) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "48px",
            alignItems: "start",
            width: "100%",
          }}
          className="clarte-product-main-grid"
        >
          {/* Sticky Gallery Column on Desktop (Fits within 100vh Viewport) */}
          <div
            className="clarte-sticky-gallery"
            style={{
              width: "100%",
              minWidth: 0,
            }}
          >
            <ProductGallery images={product.gallery} />
          </div>

          {/* Product Summary Column */}
          <div style={{ width: "100%", minWidth: 0 }}>
            <ProductSummary product={product} />
          </div>
        </div>
      </section>

      {/* Craftsmanship Highlights */}
      <ProductHighlights highlights={product.highlights} />

      {/* Customer Reviews Section */}
      <ProductReviews productSlug={product.slug} />

      {/* Recommended / You May Also Like Product Grid */}
      <ProductRecommendations
        currentSlug={product.slug}
        currentId={product.id}
        title="You May Also Like"
        subtitle="Curated Recommendations"
      />

      {/* Responsive Grid & Sticky Gallery Styles */}
      <style jsx>{`
        @media (min-width: 980px) {
          .clarte-product-main-grid {
            grid-template-columns: 1.15fr 1fr !important;
            gap: 56px !important;
          }
          .clarte-sticky-gallery {
            position: sticky !important;
            top: 76px !important;
            align-self: start !important;
            z-index: 10;
          }
        }
        @media (min-width: 1200px) {
          .clarte-product-main-grid {
            grid-template-columns: 1.2fr 1fr !important;
            gap: 64px !important;
          }
        }
      `}</style>
    </main>
  );
}
