"use client";

import React, { useRef } from "react";
import ProductCard, { Product } from "./ProductCard";

interface ProductSliderProps {
  products: Product[];
}

export default function ProductSlider({ products }: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      {/* Left Arrow Button */}
      <button
        onClick={scrollLeft}
        className="absolute -left-3 top-[45%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-md flex items-center justify-center text-zinc-800 hover:bg-black hover:text-white transition-all hover:scale-105"
        aria-label="Previous Products"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Slider Row */}
      <div ref={sliderRef} className="product-slider-row">
        {products.map((p) => (
          <div key={p.id} className="product-slider-item">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {/* Right Arrow Button */}
      <button
        onClick={scrollRight}
        className="absolute -right-3 top-[45%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-md flex items-center justify-center text-zinc-800 hover:bg-black hover:text-white transition-all hover:scale-105"
        aria-label="Next Products"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
