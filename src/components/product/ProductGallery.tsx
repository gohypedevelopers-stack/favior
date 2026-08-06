"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import type { ProductImage } from "./productData";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        alignItems: "flex-start",
        width: "100%",
        backgroundColor: "transparent",
      }}
      className="clarte-gallery-container"
    >
      {/* Desktop Vertical Thumbnails */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "68px",
          flexShrink: 0,
          alignSelf: "flex-start",
        }}
        className="hidden lg:flex"
      >
        {images.map((image, index) => {
          const isSelected = index === activeImageIndex;
          return (
            <button
              key={`${image.src}-thumb-desk-${index}`}
              type="button"
              onClick={() => handleThumbnailClick(index)}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "3 / 4",
                overflow: "hidden",
                backgroundColor: "transparent",
                border: isSelected
                  ? "1.5px solid #111111"
                  : "1px solid rgba(0, 0, 0, 0.12)",
                opacity: isSelected ? 1 : 0.6,
                cursor: "pointer",
                padding: 0,
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.opacity = "0.6";
              }}
            >
              <Image
                src={image.src}
                alt={`View thumbnail ${index + 1}`}
                fill
                sizes="70px"
                style={{ objectFit: "contain", objectPosition: "top center" }}
              />
            </button>
          );
        })}
      </div>

      {/* Main Featured Image (Desktop) - Flush Top Aligned */}
      <figure
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4",
          maxHeight: "calc(100vh - 120px)",
          overflow: "hidden",
          backgroundColor: "transparent",
          margin: 0,
          flex: 1,
          alignSelf: "flex-start",
        }}
        className="hidden lg:block"
      >
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          style={{
            objectFit: "contain",
            objectPosition: "top center",
            transition: "transform 0.4s ease-out",
          }}
          className="hover:scale-[1.02]"
        />
      </figure>

      {/* Mobile Swipeable Gallery */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 5",
          maxHeight: "65vh",
          overflow: "hidden",
          backgroundColor: "transparent",
        }}
        className="lg:hidden"
      >
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            width: "100%",
            height: "100%",
            scrollbarWidth: "none",
          }}
        >
          {images.map((image, index) => (
            <div
              key={`${image.src}-main-mob-${index}`}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                flexShrink: 0,
                scrollSnapAlign: "start",
                backgroundColor: "transparent",
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                style={{
                  objectFit: "contain",
                  objectPosition: "top center",
                }}
              />
            </div>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 10,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            padding: "4px 8px",
            borderRadius: "999px",
            backdropFilter: "blur(4px)",
          }}
        >
          {images.map((_, index) => (
            <div
              key={index}
              style={{
                height: "5px",
                borderRadius: "999px",
                backgroundColor:
                  index === activeImageIndex ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)",
                width: index === activeImageIndex ? "14px" : "5px",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
