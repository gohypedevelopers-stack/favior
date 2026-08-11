"use client";

import React from "react";
import Link from "next/link";
import type { CollectionDetail, CollectionCategoryKey } from "@/types/collection";

interface CollectionHeaderProps {
  collection: CollectionDetail;
  activeCategory: CollectionCategoryKey;
  onSelectCategory: (key: CollectionCategoryKey) => void;
  totalProductsCount: number;
}

export function CollectionHeader({
  collection,
}: CollectionHeaderProps) {
  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        paddingTop: "32px",
        paddingBottom: "28px",
        paddingLeft: "24px",
        paddingRight: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Centered Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            marginBottom: "8px",
          }}
        >
          <div className="flex flex-wrap items-center justify-center gap-[6px] text-[9.5px] sm:text-[11px] uppercase tracking-[0.22em] text-[#767676] font-medium">
            {collection.breadcrumb.map((crumb, idx) => {
              const isLast = idx === collection.breadcrumb.length - 1;
              return (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      style={{ color: "#767676", textDecoration: "none" }}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span style={{ color: isLast ? "#111111" : "#767676", fontWeight: isLast ? 600 : 500 }}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <span style={{ color: "#cccccc", margin: "0 4px" }}>/</span>}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Hero Title */}
        <h1
          className="text-[22px] sm:text-[28px] md:text-[36px]"
          style={{
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "#111111",
            maxWidth: "900px",
            marginTop: "8px",
            marginBottom: "12px",
            lineHeight: "1.15",
            textAlign: "center",
          }}
        >
          {collection.title}
        </h1>

        {/* Hero Description */}
        <p
          className="text-[11px] sm:text-[12px]"
          style={{
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#767676",
            lineHeight: "1.6",
            maxWidth: "650px",
            marginTop: "6px",
            marginBottom: "0px",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
        >
          {collection.description}
        </p>
      </div>
    </header>
  );
}

export default CollectionHeader;
