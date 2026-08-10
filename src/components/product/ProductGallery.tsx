"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import type { ProductImage } from "./productData";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  if (!images || images.length === 0) return null;
  const activeImage = images[activeImageIndex] || images[0];

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: index * width,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const width = container.clientWidth;
    if (width > 0) {
      const index = Math.round(container.scrollLeft / width);
      if (index !== activeImageIndex && index >= 0 && index < images.length) {
        setActiveImageIndex(index);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = Math.abs(touchStartY.current - e.changedTouches[0].clientY);

    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 30) {
      if (deltaX > 0) {
        const nextIndex = (activeImageIndex + 1) % images.length;
        handleThumbnailClick(nextIndex);
      } else {
        const prevIndex = (activeImageIndex - 1 + images.length) % images.length;
        handleThumbnailClick(prevIndex);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 items-start">
      {/* DESKTOP VIEW: Left Vertical Thumbnails */}
      <div className="hidden lg:flex flex-col gap-2.5 w-[76px] shrink-0 self-start">
        {images.map((image, index) => {
          const isSelected = index === activeImageIndex;
          return (
            <button
              key={`${image.src}-thumb-desk-${index}`}
              type="button"
              onClick={() => handleThumbnailClick(index)}
              className={`relative w-full aspect-square overflow-hidden rounded-xl bg-white transition-all duration-200 cursor-pointer border-2 ${
                isSelected
                  ? "border-black opacity-100 scale-[1.02] shadow-xs"
                  : "border-neutral-200/80 opacity-60 hover:opacity-100 hover:border-neutral-400"
              }`}
            >
              <Image
                src={image.src}
                alt={`View thumbnail ${index + 1}`}
                fill
                sizes="76px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* DESKTOP VIEW: Main Product Image Card */}
      <figure className="hidden lg:block relative w-full flex-1 aspect-[4/5] max-h-[calc(100vh-120px)] overflow-hidden rounded-2xl bg-white border border-neutral-200/80 m-0 self-start">
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
        />
      </figure>

      {/* MOBILE VIEW: Main Product Image + Gallery Thumbnails Below in Columns */}
      <div className="block lg:hidden w-full" style={{ paddingTop: "12px", marginBottom: "28px" }}>
        {/* Main Product Image Card */}
        <div
          className="relative w-full aspect-[4/5] max-h-[60vh] overflow-hidden rounded-2xl bg-white border border-neutral-200/80 shadow-xs touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory w-full h-full scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            {images.map((image, index) => (
              <div
                key={`${image.src}-main-mob-${index}`}
                className="relative w-full h-full shrink-0 snap-start bg-white"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Mobile Overlay Pagination Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeImageIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile Gallery Thumbnails Strip UNDER Product Image in Columns Format */}
        <div style={{ marginTop: "24px", width: "100%" }}>
          <div
            className="w-full grid"
            style={{
              gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, minmax(0, 1fr))`,
              gap: "12px",
            }}
          >
            {images.map((image, index) => {
              const isSelected = index === activeImageIndex;
              return (
                <button
                  key={`${image.src}-thumb-mob-${index}`}
                  type="button"
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative w-full aspect-square overflow-hidden rounded-xl bg-white transition-all duration-200 cursor-pointer border-2 ${
                    isSelected
                      ? "border-black ring-2 ring-black/10 opacity-100 shadow-xs"
                      : "border-neutral-200/80 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

