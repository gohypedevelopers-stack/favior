"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
    <div className="w-full bg-white pt-8 pb-4 sm:pt-12 sm:pb-6 text-black font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
        {/* Centered Breadcrumb Navigation matching Reference Image */}
        <nav aria-label="Breadcrumb" className="text-[11px] text-neutral-400 font-medium">
          <ol className="flex flex-wrap items-center justify-center gap-1.5 uppercase tracking-[0.2em]">
            {collection.breadcrumb.map((crumb, idx) => {
              const isLast = idx === collection.breadcrumb.length - 1;
              return (
                <li key={idx} className="flex items-center gap-1.5">
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-black transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-neutral-500 font-semibold" : ""}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <ChevronRight className="h-3 w-3 text-neutral-300 shrink-0" />}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Hero Title & Description matching Reference Image 2 */}
        <div className="space-y-3 pt-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-neutral-900 leading-tight">
            {collection.title}
          </h1>
          <p className="text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.18em] text-neutral-500 leading-relaxed max-w-2xl mx-auto">
            {collection.description}
          </p>
        </div>
      </div>
    </div>
  );
}
