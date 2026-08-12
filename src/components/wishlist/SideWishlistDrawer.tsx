"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist, formatPrice } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export function SideWishlistDrawer() {
  const { wishlist, isOpen, closeWishlist, removeFromWishlist, totalItems } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeWishlist();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeWishlist]);

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.productId || item.id,
      name: item.name,
      price: item.numericPrice,
      originalPrice: item.originalPrice,
      image: item.image,
      color: item.color,
      size: item.size,
      slug: item.slug,
      quantity: 1,
    });
    // Optional: could remove from wishlist after adding to cart
    // removeFromWishlist(item.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 99998,
            }}
            onClick={closeWishlist}
            aria-hidden="true"
          />

          {/* Side Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: "460px",
              backgroundColor: "#ffffff",
              color: "#111111",
              zIndex: 99999,
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              boxShadow: "-10px 0 40px rgba(0,0,0,0.2)",
              borderLeft: "1px solid #e5e5e5",
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Wishlist"
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: "20px 24px 16px 24px",
                borderBottom: "1px solid #eeeeee",
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Heart style={{ width: "20px", height: "20px", color: "#111111", fill: "#111111" }} />
                  <h2
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#111111",
                      margin: 0,
                    }}
                  >
                    YOUR WISHLIST ({totalItems})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeWishlist}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "6px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666666",
                  }}
                  aria-label="Close wishlist drawer"
                >
                  <X style={{ width: "20px", height: "20px" }} />
                </button>
              </div>
            </div>

            {/* Drawer Body - Items List or Empty State */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {wishlist.length === 0 ? (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "40px 16px",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      backgroundColor: "#f4f4f4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#888888",
                      marginBottom: "16px",
                    }}
                  >
                    <Heart style={{ width: "32px", height: "32px" }} />
                  </div>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#111111",
                      marginBottom: "6px",
                    }}
                  >
                    Your wishlist is empty
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#666666",
                      marginBottom: "20px",
                      maxWidth: "260px",
                      lineHeight: "1.5",
                    }}
                  >
                    Save items you love here to easily find and purchase them later.
                  </p>
                  <Link
                    href="/all-products"
                    onClick={closeWishlist}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 24px",
                      backgroundColor: "#111111",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      borderRadius: "4px",
                      textDecoration: "none",
                    }}
                  >
                    Start Browsing
                  </Link>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: "14px",
                      alignItems: "flex-start",
                      paddingBottom: "16px",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    {/* Item Thumbnail */}
                    <div
                      style={{
                        position: "relative",
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        border: "1px solid #e5e5e5",
                        flexShrink: 0,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        style={{ objectFit: "contain", padding: "6px" }}
                      />
                    </div>

                    {/* Item Info */}
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                        <Link
                          href={`/products/${item.slug || item.productId}`}
                          onClick={closeWishlist}
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#111111",
                            textDecoration: "none",
                            lineHeight: "1.4",
                            flex: 1,
                          }}
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "2px",
                            color: "#aaaaaa",
                          }}
                          title="Remove from wishlist"
                          aria-label={`Remove ${item.name} from wishlist`}
                        >
                          <Trash2 style={{ width: "14px", height: "14px" }} />
                        </button>
                      </div>

                      {/* Variant Tags */}
                      {(item.color || item.size) && (
                        <div style={{ display: "flex", gap: "6px", fontSize: "11px", color: "#666666" }}>
                          {item.color && (
                            <span style={{ backgroundColor: "#f0f0f0", padding: "2px 6px", borderRadius: "4px" }}>
                              {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span style={{ backgroundColor: "#f0f0f0", padding: "2px 6px", borderRadius: "4px" }}>
                              {item.size}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Pricing & Add to Cart */}
                      <div style={{ marginTop: "6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ textAlign: "left" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#111111" }}>
                            {item.price}
                          </span>
                          {item.originalPrice && (
                            <div style={{ fontSize: "11px", color: "#999999", textDecoration: "line-through" }}>
                              {item.originalPrice}
                            </div>
                          )}
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 10px",
                            backgroundColor: "#111111",
                            color: "#ffffff",
                            fontSize: "10px",
                            fontWeight: 600,
                            letterSpacing: "0.05em",
                            borderRadius: "4px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <ShoppingBag style={{ width: "12px", height: "12px" }} />
                          ADD
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {wishlist.length > 0 && (
              <div
                style={{
                  borderTop: "1px solid #eeeeee",
                  padding: "20px 24px",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <button
                  type="button"
                  onClick={closeWishlist}
                  style={{
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "transparent",
                    color: "#666666",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Continue Browsing
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
