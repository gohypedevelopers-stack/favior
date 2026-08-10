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
        paddingTop: "20px",
        paddingBottom: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto",
          paddingLeft: "24px",
          paddingRight: "24px",
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
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "#767676",
              fontWeight: 500,
            }}
          >
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
          style={{
            fontSize: "38px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "#111111",
            maxWidth: "900px",
            marginTop: "6px",
            marginBottom: "10px",
            lineHeight: "1.1",
            textAlign: "center",
          }}
        >
          {collection.title}
        </h1>

        {/* Hero Description */}
        <p
          style={{
            fontSize: "12px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#767676",
            lineHeight: "1.6",
            maxWidth: "650px",
            margin: "4px auto 0 auto",
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
