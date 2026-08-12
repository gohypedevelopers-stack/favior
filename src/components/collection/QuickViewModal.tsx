"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Star, Heart, Check, ArrowRight } from "lucide-react";
import type { CatalogItem } from "./collectionData";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

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
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("Standard");
  const [added, setAdded] = useState(false);

  // Dynamic size options based on product category & name
  const getProductSizes = (item: CatalogItem): string[] => {
    const cat = item.category?.toLowerCase() || "";
    const name = item.name?.toLowerCase() || "";
    if (cat === "shakers" || name.includes("shaker") || name.includes("flask")) {
      return ["600ML", "750ML", "1000ML"];
    }
    if (cat === "wristbands" || name.includes("wrist") || name.includes("strap")) {
      return ["18-INCH", "24-INCH"];
    }
    if (cat === "bundles" || name.includes("kit") || name.includes("pack")) {
      return ["STANDARD", "PRO KIT"];
    }
    return ["STANDARD"];
  };

  // Dynamic color names based on product colorName & swatches
  const getProductColorNames = (item: CatalogItem): string[] => {
    const baseColor = item.colorName?.toUpperCase() || "STEALTH BLACK";
    if (item.swatches && item.swatches.length > 1) {
      if (item.swatches.length === 2) return [baseColor, "STEALTH BLACK"];
      return [baseColor, "STEALTH BLACK", "MATTE SILVER"];
    }
    return [baseColor];
  };

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      const colors = getProductColorNames(product);
      setSelectedColor(colors[0] || "STEALTH BLACK");
      const sizes = getProductSizes(product);
      setSelectedSize(sizes[0] || "STANDARD");
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

  const productSizes = getProductSizes(product);
  const colorNames = getProductColorNames(product);

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
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        color: selectedColor,
        size: selectedSize,
        slug: product.id,
      });
      onAddToCart?.(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        padding: "16px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "760px",
          maxHeight: "88vh",
          backgroundColor: "#ffffff",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #e5e5e5",
          overflow: "hidden",
          margin: "auto",
          display: "flex",
          flexDirection: "row",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            width: "100%",
            minWidth: 0,
          }}
        >
          {/* Left Column: Full-Bleed Media Gallery (Full Image Ratio) */}
          <div
            style={{
              position: "relative",
              backgroundColor: "#ffffff",
              width: "100%",
              minHeight: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRight: "1px solid #f0f0f0",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: "340px",
                flex: 1,
              }}
            >
              <Image
                src={activeImgSrc}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                style={{ objectFit: "cover" }}
              />
              {product.badge && (
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "12px",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    fontSize: "8.5px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    padding: "4px 10px",
                    lineHeight: 1,
                    zIndex: 10,
                  }}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {/* Bottom Thumbnails Strip */}
            {gallery.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  padding: "8px 12px",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderTop: "1px solid #f0f0f0",
                  overflowX: "auto",
                  width: "100%",
                  zIndex: 10,
                  boxSizing: "border-box",
                }}
              >
                {gallery.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      position: "relative",
                      width: "44px",
                      height: "44px",
                      flexShrink: 0,
                      border: idx === activeImageIndex ? "1px solid #000" : "1px solid #e5e5e5",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      padding: 0,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={src}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="44px"
                      style={{ objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Compact Details Section with explicit inline CSS */}
          <div
            style={{
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "#ffffff",
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",
              position: "relative",
              overflowY: "auto",
            }}
          >
            {/* Minimal Close Button */}
            <button
              type="button"
              aria-label="Close Quick View"
              onClick={onClose}
              style={{
                position: "absolute",
                right: "16px",
                top: "16px",
                zIndex: 20,
                background: "transparent",
                border: 0,
                color: "#000000",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X className="h-5 w-5 stroke-[1.8]" />
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", minWidth: 0 }}>
              {/* Category and Wishlist Icon */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#a3a3a3",
                    display: "block",
                  }}
                >
                  FAVIOR ATELIER
                </span>
                
                <button
                  type="button"
                  aria-label="Toggle wishlist"
                  onClick={(e) => {
                    e.stopPropagation();
                    const isWishlisted = isInWishlist(product.id);
                    if (isWishlisted) {
                      removeFromWishlist(product.id);
                    } else {
                      addToWishlist({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        color: selectedColor,
                        size: selectedSize,
                        slug: product.id,
                      });
                    }
                  }}
                  style={{
                    background: "transparent",
                    border: 0,
                    cursor: "pointer",
                    padding: "2px",
                    color: isInWishlist(product?.id || "") ? "#000000" : "#a3a3a3",
                  }}
                >
                  <Heart
                    className="h-5 w-5"
                    style={{
                      fill: isInWishlist(product?.id || "") ? "currentColor" : "none",
                    }}
                  />
                </button>
              </div>

              {/* Product Title */}
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                  color: "#000000",
                  lineHeight: "1.25",
                  margin: 0,
                  paddingRight: "28px",
                  wordBreak: "break-word",
                }}
              >
                {product.name}
              </h2>

              {/* Price & Rating / Sold Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: "10px",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {product.originalPrice && (
                    <span style={{ fontSize: "12px", color: "#a3a3a3", textDecoration: "line-through", fontWeight: 500 }}>
                      {product.originalPrice}
                    </span>
                  )}
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#000000" }}>
                    {product.price}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#737373", fontWeight: 500 }}>
                  <span>1,238 SOLD</span>
                  <span style={{ color: "#d4d4d4" }}>•</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span style={{ fontWeight: 700, color: "#000" }}>{product.rating || "4.8"}</span>
                </div>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  color: "#525252",
                  lineHeight: "1.55",
                  margin: 0,
                  wordBreak: "break-word",
                }}
              >
                {product.desc}{" "}
                <Link
                  href={productUrl}
                  onClick={onClose}
                  style={{ fontWeight: 700, color: "#000000", textDecoration: "underline", marginLeft: "4px" }}
                >
                  SEE MORE...
                </Link>
              </p>

              {/* Color Swatches */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "4px", width: "100%" }}>
                <div style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#737373" }}>
                  COLOR <span style={{ fontWeight: 700, color: "#000" }}>{selectedColor}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  {(product.swatches && product.swatches.length > 0
                    ? product.swatches
                    : ["#111111", "#444444"]
                  ).map((swatch, idx) => {
                    const name = colorNames[idx % colorNames.length] || `OPTION ${idx + 1}`;
                    const isSelected = selectedColor === name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(name)}
                        style={{
                          width: "44px",
                          height: "28px",
                          border: isSelected ? "2px solid #000" : "1px solid #d4d4d4",
                          cursor: "pointer",
                          padding: "2px",
                          backgroundColor: "transparent",
                          boxSizing: "border-box",
                        }}
                        title={name}
                      >
                        <span
                          style={{
                            display: "block",
                            width: "100%",
                            height: "100%",
                            backgroundColor: swatch,
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "4px", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  <span style={{ color: "#737373" }}>
                    SIZE <span style={{ fontWeight: 700, color: "#000" }}>{selectedSize}</span>
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", width: "100%" }}>
                  {productSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        style={{
                          height: "32px",
                          padding: "0 12px",
                          border: isSelected ? "1px solid #000" : "1px solid #e5e5e5",
                          backgroundColor: isSelected ? "#f5f5f5" : "#ffffff",
                          fontSize: "10.5px",
                          fontWeight: isSelected ? 700 : 600,
                          color: "#000000",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          cursor: "pointer",
                          minWidth: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxSizing: "border-box",
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions: ADD TO CART & VIEW FULL DETAILS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "14px", marginTop: "12px", width: "100%" }}>
              <button
                type="button"
                onClick={handleAdd}
                style={{
                  width: "100%",
                  height: "42px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  backgroundColor: added ? "#5b8c38" : "#000000",
                  color: "#ffffff",
                  border: 0,
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  boxSizing: "border-box",
                }}
              >
                {added ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <Check className="h-4 w-4 stroke-[2.5]" /> ADDED TO CART
                  </span>
                ) : (
                  "ADD TO CART"
                )}
              </button>

              <Link
                href={productUrl}
                onClick={onClose}
                style={{
                  display: "block",
                  textAlign: "center",
                  width: "100%",
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#737373",
                  textDecoration: "none",
                  padding: "4px 0",
                  cursor: "pointer",
                }}
              >
                VIEW FULL DETAILS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
