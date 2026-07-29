"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  desc: string;
  price: string;
  originalPrice?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  img: string;
  swatches?: string[];
}

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState(0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  // Generate star display
  const rating = product.rating || 4.9;
  const reviewsCount = product.reviews || 84;

  return (
    <div className="product-card-favior">
      {/* Top Bar: Badge & Bookmark */}
      <div className="product-card-top-bar">
        {product.badge ? (
          <span className="badge-online">{product.badge}</span>
        ) : (
          <span className="badge-online">Online exclusive</span>
        )}

        <button
          className={`btn-bookmark ${isBookmarked ? "active" : ""}`}
          onClick={handleBookmarkToggle}
          aria-label={isBookmarked ? "Remove from wishlist" : "Add to wishlist"}
          title={isBookmarked ? "Saved to wishlist" : "Save to wishlist"}
        >
          <svg
            width="14"
            height="18"
            viewBox="0 0 14 18"
            fill={isBookmarked ? "var(--theme-color)" : "none"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1V17L7 12L13 17V1H1Z"
              stroke={isBookmarked ? "var(--theme-color)" : "currentColor"}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Image Container with Quick View Hover Overlay */}
      <div className="product-img-wrap-favior">
        <Image
          src={product.img}
          alt={product.name}
          width={600}
          height={800}
          className="product-img"
          priority={product.id === "p1"}
        />
        <div className="product-img-overlay">
          <button
            className="btn-quick-view"
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Quick View
          </button>
        </div>
      </div>

      {/* Product Content / Details */}
      <div className="product-info-favior">
        {/* Rating Stars */}
        <div className="product-rating">
          <div className="stars">
            {"★".repeat(Math.floor(rating))}
            {rating % 1 !== 0 && "★"}
          </div>
          <span className="rating-text">
            {rating.toFixed(1)} <span className="review-count">({reviewsCount})</span>
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="product-title-favior">{product.name}</h3>
        <p className="product-desc-favior">{product.desc}</p>

        {/* Swatches preview if available */}
        {product.swatches && product.swatches.length > 0 && (
          <div className="product-swatches-favior">
            {product.swatches.map((color, idx) => (
              <button
                key={idx}
                className={`swatch-dot ${activeSwatch === idx ? "active" : ""}`}
                style={{ backgroundColor: color }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSwatch(idx);
                }}
                aria-label={`Select swatch ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Price Row */}
        <div className="product-price-row">
          <span className="product-price-favior">{product.price}</span>
          {product.originalPrice && (
            <span className="product-price-original">{product.originalPrice}</span>
          )}
        </div>

        {/* Add to Cart CTA */}
        <button
          className={`btn-add-cart-favior ${isAdded ? "added" : ""}`}
          onClick={handleAddToCart}
        >
          {isAdded ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
