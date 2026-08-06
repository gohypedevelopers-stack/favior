"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Star, Heart, Check, ArrowRight } from "lucide-react";
import type { CatalogItem } from "./collectionData";
import { cn } from "@/lib/utils";

interface QuickViewModalProps {
  product: CatalogItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: CatalogItem) => void;
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("Standard");
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedColor(product.colorName || "");
      setAdded(false);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const defaultImg = product.img || "/favior_shaker_white.png";
  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [defaultImg];
  const activeImgSrc = gallery[activeImageIndex] || defaultImg;

  const productUrl =
    product.id === "p1"
      ? "/products/the-havane"
      : product.id === "p2"
      ? "/products/the-aube"
      : product.id === "p3"
      ? "/products/the-lumen"
      : product.id === "p4"
      ? "/products/the-brume"
      : `/products/${product.id}`;

  const handleAdd = () => {
    onAddToCart?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-white border border-black/20 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close Quick View"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black border border-black/10 hover:bg-black hover:text-white transition-colors cursor-pointer shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="bg-[#f8f8f8] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-black/10">
            <div className="relative aspect-square w-full max-w-[280px] overflow-hidden bg-white border border-black/10 shadow-xs">
              <Image
                src={activeImgSrc}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-contain p-4 transition-all duration-300"
              />
              {product.badge && (
                <span className="absolute left-2.5 top-2.5 bg-black text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 leading-none">
                  {product.badge}
                </span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1 max-w-full">
                {gallery.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "relative h-12 w-12 shrink-0 border overflow-hidden bg-white cursor-pointer transition-all",
                      idx === activeImageIndex
                        ? "border-black ring-1 ring-black"
                        : "border-black/15 opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={src}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-black/60 uppercase">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-3 w-3",
                        star <= Math.round(product.rating || 5)
                          ? "fill-black text-black"
                          : "text-black/20"
                      )}
                    />
                  ))}
                </div>
                <span>{product.rating} ({product.reviews} Reviews)</span>
              </div>

              <h3 className="font-heading text-[20px] sm:text-[24px] font-bold uppercase leading-tight text-black">
                {product.name}
              </h3>

              <div className="flex items-center gap-3">
                {product.originalPrice && (
                  <span className="text-[13px] text-black/40 line-through">
                    {product.originalPrice}
                  </span>
                )}
                <span className="text-[18px] font-bold text-black font-heading">
                  {product.price}
                </span>
                <span className="text-[9px] font-bold uppercase bg-black/5 text-black/80 px-2 py-0.5 border border-black/10">
                  In Stock
                </span>
              </div>

              <p className="text-[12px] sm:text-[13px] text-black/70 font-sans leading-relaxed">
                {product.desc}
              </p>

              {/* Swatches */}
              {product.swatches && product.swatches.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black/70">
                    Finish / Color
                  </span>
                  <div className="flex items-center gap-2">
                    {product.swatches.map((swatch, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(`Option ${idx + 1}`)}
                        className="h-6 w-6 rounded-full border border-black/20 p-0.5 cursor-pointer hover:scale-110 transition-transform"
                      >
                        <span
                          className="block h-full w-full rounded-full border border-black/10"
                          style={{ backgroundColor: swatch }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-black/10">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={cn(
                    "flex-1 h-11 flex items-center justify-center font-medium text-[11px] sm:text-[12px] uppercase tracking-[0.14em] transition-all cursor-pointer",
                    added
                      ? "bg-[#5b8c38] text-white"
                      : "bg-black text-white hover:bg-black/85"
                  )}
                >
                  {added ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" /> Added To Bag
                    </span>
                  ) : (
                    "Add To Bag"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Wishlist"
                  className={cn(
                    "h-11 w-11 flex items-center justify-center border transition-colors cursor-pointer",
                    isWishlisted
                      ? "border-black bg-black text-white"
                      : "border-black/20 bg-white text-black hover:border-black"
                  )}
                >
                  <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              <Link
                href={productUrl}
                onClick={onClose}
                className="inline-flex items-center justify-center w-full gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-black hover:text-black/60 transition-colors py-1"
              >
                <span>View Full Product Details</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
