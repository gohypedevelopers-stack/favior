"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight, ShoppingBag, Check } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: string;
  image?: string;
  img?: string;
  alt?: string;
  badge?: string;
  gallery?: string[];
  href?: string;
  desc?: string;
  originalPrice?: string;
  rating?: number;
  reviews?: number;
  swatches?: string[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onWishlistToggle?: (product: Product, isWishlisted: boolean) => void;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onWishlistToggle,
  onQuickView,
}: ProductCardProps) {
  const mainImage = product.image || product.img || "/og_shaker.png";
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [mainImage];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  // Touch Swipe Gesture State
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const activeImage = gallery[activeImageIndex] ?? mainImage;
  const hasGalleryControls = gallery.length > 1;

  const handlePreviousImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setActiveImageIndex((currentIndex) => (currentIndex - 1 + gallery.length) % gallery.length);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % gallery.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = Math.abs(touchStartY.current - e.changedTouches[0].clientY);

    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 20) {
      if (deltaX > 0) handleNextImage();
      else handlePreviousImage();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    onWishlistToggle?.(product, nextState);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onAddToCart?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const productHref = product.href || `/product/${product.id}`;

  return (
    <article className="group relative flex w-full min-w-0 flex-col cursor-pointer select-none transition-all duration-300">
      {/* Image Container with subtle border, soft shadow & hover lift */}
      <div
        className="relative aspect-[1/1.32] w-full overflow-hidden rounded-xl bg-white border border-zinc-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] group-hover:-translate-y-1 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Link href={productHref} className="absolute inset-0 z-0 cursor-pointer">
          <Image
            src={activeImage}
            alt={product.alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Exclusive Badge */}
        {product.badge && (
          <span
            className="absolute left-3 top-3 z-10 inline-flex items-center justify-center rounded-md bg-black text-[9px] font-bold uppercase tracking-widest text-white shadow-xs leading-none"
            style={{
              padding: "5px 10px",
              lineHeight: 1,
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Circular Wishlist Button with Heart Fill animation */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={toggleWishlist}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-zinc-900 shadow-sm border border-zinc-200/60 transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95 cursor-pointer"
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-200 ${
              isWishlisted ? "fill-black text-black" : "text-zinc-700 stroke-[1.6]"
            }`}
          />
        </button>

        {/* Hover Navigation Arrows */}
        {hasGalleryControls && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={handlePreviousImage}
              className="absolute left-2.5 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-md opacity-0 transition-all duration-200 ease-out group-hover:opacity-100 hover:scale-110 active:scale-95 sm:flex border border-zinc-200/50"
            >
              <ChevronLeft className="h-4 w-4 stroke-[2]" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={handleNextImage}
              className="absolute right-2.5 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-md opacity-0 transition-all duration-200 ease-out group-hover:opacity-100 hover:scale-110 active:scale-95 sm:flex border border-zinc-200/50"
            >
              <ChevronRight className="h-4 w-4 stroke-[2]" />
            </button>
          </>
        )}

        {/* Slide-Up Quick View Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (onQuickView) onQuickView(product);
          }}
          className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 translate-y-2 items-center justify-center rounded-full bg-black text-[10px] font-semibold tracking-widest text-white shadow-lg opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 hover:bg-zinc-800 sm:inline-flex uppercase leading-none"
          style={{
            padding: "10px 22px",
            lineHeight: 1,
          }}
        >
          Quick View
        </button>

        {/* Clean Subtle Dots */}
        {hasGalleryControls && (
          <div className="absolute bottom-2.5 inset-x-0 z-10 flex items-center justify-center">
            <div className="flex items-center gap-1 rounded-full bg-black/15 px-2 py-1 backdrop-blur-xs">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to image ${idx + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setActiveImageIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeImageIndex
                      ? "w-3 bg-black"
                      : "w-1.5 bg-black/30 hover:bg-black/60"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Details Below Image */}
      <div className="mt-4 flex items-center justify-between gap-2 px-1">
        <div className="min-w-0 flex-1">
          <Link href={productHref} className="block group/title">
            <h3 className="truncate text-[11px] font-semibold uppercase tracking-wide text-zinc-900 transition-colors group-hover/title:text-zinc-600">
              {product.name}
            </h3>
          </Link>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] font-normal uppercase line-through text-zinc-400">
                {product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Circular Add to Cart Button */}
        <button
          type="button"
          aria-label="Add to cart"
          onClick={handleAddToCart}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-2xs transition-all duration-200 hover:bg-black hover:text-white hover:border-black active:scale-95 cursor-pointer ${
            added ? "bg-black text-white border-black" : ""
          }`}
        >
          {added ? (
            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-3.5 w-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
              />
            </svg>
          )}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
