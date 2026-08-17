"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useCart, formatPrice } from "@/context/CartContext";

const QUICK_ADD_ITEMS = [
  {
    id: "quick-p1",
    slug: "the-havane",
    name: "The Havane Shaker",
    price: "RS. 16,500",
    image: "/favior_shaker_white.png",
    color: "Gloss White",
    size: "600ml",
  },
  {
    id: "quick-p2",
    slug: "the-aube",
    name: "The Aube Wrist Wraps",
    price: "RS. 15,900",
    image: "/favior_wristwrap_white.png",
    color: "Stealth Black",
    size: "18-Inch",
  },
];

export function SideCartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
    freeShippingThreshold,
    shippingRemaining,
    freeShippingProgress,
    addToCart,
    currencySymbol,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    window.location.href = "/checkout";
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
            onClick={closeCart}
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
            aria-label="Shopping Cart"
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
                  <ShoppingBag style={{ width: "20px", height: "20px", color: "#111111" }} />
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
                    YOUR SHOPPING BAG ({totalItems})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
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
                  aria-label="Close cart drawer"
                >
                  <X style={{ width: "20px", height: "20px" }} />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div
                style={{
                  backgroundColor: "#f8f8f8",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: "1px solid #eaeaea",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    fontWeight: 500,
                    marginBottom: "8px",
                  }}
                >
                  {subtotal >= freeShippingThreshold ? (
                    <span
                      style={{
                        color: "#047857",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle2 style={{ width: "14px", height: "14px" }} /> You qualify for FREE Express Shipping! 🎉
                    </span>
                  ) : (
                    <span style={{ color: "#444444" }}>
                      Add{" "}
                      <strong style={{ color: "#111111", fontWeight: 700 }}>
                        {formatPrice(shippingRemaining, currencySymbol)}
                      </strong>{" "}
                      more to unlock <strong style={{ color: "#111111", fontWeight: 700 }}>FREE Shipping</strong>
                    </span>
                  )}
                  <span style={{ fontSize: "11px", color: "#666666" }}>
                    {Math.round(freeShippingProgress)}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#e2e2e2",
                    height: "6px",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      borderRadius: "999px",
                      backgroundColor:
                        subtotal >= freeShippingThreshold ? "#059669" : "#111111",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShippingProgress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
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
              {cart.length === 0 ? (
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
                    <ShoppingBag style={{ width: "32px", height: "32px" }} />
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
                    Your bag is empty
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
                    Discover our precision-engineered shakers and performance gear.
                  </p>
                  <Link
                    href="/all-products"
                    onClick={closeCart}
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
                    Start Shopping <ArrowRight style={{ width: "14px", height: "14px" }} />
                  </Link>

                  {/* Empty state Quick Add recommendations */}
                  <div
                    style={{
                      width: "100%",
                      paddingTop: "24px",
                      marginTop: "32px",
                      borderTop: "1px solid #eeeeee",
                      textAlign: "left",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#666666",
                        marginBottom: "12px",
                      }}
                    >
                      Popular Selections
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {QUICK_ADD_ITEMS.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #eeeeee",
                            backgroundColor: "#fafafa",
                          }}
                        >
                          <div
                            style={{
                              position: "relative",
                              width: "48px",
                              height: "48px",
                              backgroundColor: "#ffffff",
                              borderRadius: "6px",
                              border: "1px solid #e5e5e5",
                              flexShrink: 0,
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              style={{ objectFit: "contain", padding: "4px" }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h5
                              style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#111111",
                                margin: 0,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.name}
                            </h5>
                            <p style={{ fontSize: "11px", color: "#666666", margin: "2px 0 0 0" }}>
                              {item.price}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#111111",
                              color: "#ffffff",
                              fontSize: "10px",
                              fontWeight: 600,
                              letterSpacing: "0.05em",
                              borderRadius: "4px",
                              border: "none",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
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
                          onClick={closeCart}
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
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "2px",
                            color: "#aaaaaa",
                          }}
                          title="Remove item"
                          aria-label={`Remove ${item.name}`}
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

                      {/* Pricing & Stepper Controls */}
                      <div style={{ marginTop: "6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {/* Quantity Stepper */}
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            border: "1px solid #dcdcdc",
                            borderRadius: "4px",
                            backgroundColor: "#fafafa",
                            overflow: "hidden",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            style={{
                              width: "28px",
                              height: "28px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#444444",
                            }}
                            aria-label="Decrease quantity"
                          >
                            <Minus style={{ width: "12px", height: "12px" }} />
                          </button>
                          <span
                            style={{
                              width: "32px",
                              textAlign: "center",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#111111",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            style={{
                              width: "28px",
                              height: "28px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#444444",
                            }}
                            aria-label="Increase quantity"
                          >
                            <Plus style={{ width: "12px", height: "12px" }} />
                          </button>
                        </div>

                        {/* Total Item Price */}
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#111111" }}>
                            {formatPrice(item.numericPrice * item.quantity, currencySymbol)}
                          </span>
                          {item.originalPrice && (
                            <div style={{ fontSize: "11px", color: "#999999", textDecoration: "line-through" }}>
                              {item.originalPrice}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer (Sticky at Bottom) */}
            {cart.length > 0 && (
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
                {/* Calculation Summary */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#111111" }}>Subtotal</span>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: "#111111" }}>
                      {formatPrice(subtotal, currencySymbol)}
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#666666", margin: 0, lineHeight: "1.4" }}>
                    Taxes and shipping calculated at checkout.
                  </p>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    style={{
                      width: "100%",
                      padding: "14px",
                      backgroundColor: "#111111",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    <Lock style={{ width: "14px", height: "14px" }} />
                    {isCheckingOut ? "REDIRECTING..." : "PROCEED TO CHECKOUT"}
                  </button>

                  <button
                    type="button"
                    onClick={closeCart}
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
                    Continue Shopping
                  </button>
                </div>

                {/* Trust Badges */}
                <div
                  style={{
                    paddingTop: "10px",
                    borderTop: "1px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    fontSize: "10px",
                    color: "#666666",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <ShieldCheck style={{ width: "14px", height: "14px", color: "#333333" }} /> 256-Bit SSL
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Truck style={{ width: "14px", height: "14px", color: "#333333" }} /> Fast Shipping
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <RotateCcw style={{ width: "14px", height: "14px", color: "#333333" }} /> Easy Returns
                  </span>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
