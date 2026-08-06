"use client";

import React, { useState, useEffect } from "react";
import { Heart, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import type { ProductDetail } from "./productData";

export function ProductSummary({ product }: { product: ProductDetail }) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : product.colorName
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Standard"
  );
  const [reviewsCount, setReviewsCount] = useState(128);
  const [averageRating, setAverageRating] = useState(Number(product.rating) || 4.8);
  const [cartState, setCartState] = useState<"idle" | "adding" | "added">("idle");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<"care" | "shipping" | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  useEffect(() => {
    const key = `reviews_${product.slug}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const baseCount = 5;
          const baseSum = 24;
          const userSum = parsed.reduce(
            (sum: number, r: { rating?: number }) => sum + Number(r.rating || 5),
            0
          );
          const totalCount = parsed.length + baseCount;
          setReviewsCount(totalCount);
          setAverageRating(Number(((baseSum + userSum) / totalCount).toFixed(1)));
        }
      } catch {
        // use default
      }
    }
  }, [product.slug]);

  const handleAddToCart = () => {
    if (cartState !== "idle") return;
    setCartState("adding");
    setTimeout(() => {
      setCartState("added");
      setTimeout(() => {
        setCartState("idle");
      }, 2000);
    }, 600);
  };

  const handleApplyCoupon = (code: string) => {
    setAppliedCoupon(appliedCoupon === code ? null : code);
  };

  return (
    <aside
      style={{
        width: "100%",
        color: "#111111",
        backgroundColor: "transparent",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
      className="self-start"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
        {/* Rating Overview & Brand Label */}
        <div>
          <button
            type="button"
            onClick={() =>
              document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              margin: "0 0 6px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: "13px",
                    lineHeight: "1",
                    color: star <= Math.round(averageRating) ? "#111111" : "rgba(0,0,0,0.18)",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "0.08em",
                color: "#666666",
                textTransform: "uppercase",
              }}
            >
              {averageRating} ({reviewsCount} REVIEWS)
            </span>
          </button>

          {/* Subtitle / Brand Tag (Theme Neutral) */}
          <p
            style={{
              fontSize: "11px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "#767676",
              margin: "0 0 6px 0",
            }}
          >
            {product.editLabel || "FAVIOR CORE"}
          </p>

          {/* Main Product Title */}
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: "1.2",
              color: "#111111",
              margin: 0,
            }}
          >
            {product.title}
          </h1>
        </div>

        {/* Pricing Block & Sold Pill */}
        <div
          style={{
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            paddingBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {product.originalPrice && (
              <span
                style={{
                  fontSize: "15px",
                  color: "rgba(0, 0, 0, 0.35)",
                  textDecoration: "line-through",
                  fontWeight: "400",
                }}
              >
                {product.originalPrice}
              </span>
            )}
            <span
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#111111",
                letterSpacing: "-0.01em",
              }}
            >
              {product.price}
            </span>

            {/* Sold Pill Badge */}
            <span
              style={{
                backgroundColor: "#000000",
                color: "#FFFFFF",
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "3px 8px",
                borderRadius: "2px",
                lineHeight: "1.2",
              }}
            >
              {product.sold || "1,238 SOLD TODAY"}
            </span>
          </div>

          <p
            style={{
              fontSize: "10px",
              fontWeight: "500",
              color: "#888888",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: "6px 0 0 0",
            }}
          >
            INCL. OF ALL TAXES • FREE SHIPPING ABOVE ₹999
          </p>
        </div>

        {/* Short Description */}
        <div>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#111111",
              margin: "0 0 8px 0",
            }}
          >
            DESCRIPTION:
          </h2>
          <p
            style={{
              fontSize: "13.5px",
              fontWeight: "400",
              lineHeight: "1.75",
              color: "#4A4A4A",
              letterSpacing: "0.01em",
              margin: 0,
            }}
          >
            {isDescExpanded || product.description.length <= 150
              ? product.description
              : `${product.description.slice(0, 150)}...`}
            {product.description.length > 150 && (
              <button
                type="button"
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                style={{
                  fontWeight: "600",
                  color: "#111111",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: "6px",
                  padding: 0,
                  fontSize: "13px",
                }}
              >
                {isDescExpanded ? "See Less" : "See More..."}
              </button>
            )}
          </p>
        </div>

        {/* Colors Swatches (If provided) */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <div style={{ marginBottom: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#333333",
                }}
              >
                COLOR:{" "}
                <span style={{ fontWeight: "500", color: "#111111" }}>{selectedColor}</span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {product.colors.map((color) => {
                const isSelected = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "999px",
                      border: isSelected ? "1.5px solid #111111" : "1px solid rgba(0,0,0,0.15)",
                      padding: "2px",
                      background: "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "999px",
                        backgroundColor: color.value,
                        display: "block",
                        border: "1px solid rgba(0,0,0,0.08)",
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Size Selection (If provided) */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <div style={{ marginBottom: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#333333",
                }}
              >
                SELECT OPTION:{" "}
                <span style={{ fontWeight: "500", color: "#111111" }}>{selectedSize}</span>
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    style={{
                      minWidth: "60px",
                      height: "38px",
                      padding: "0 14px",
                      border: isSelected ? "1.5px solid #111111" : "1px solid rgba(0,0,0,0.18)",
                      backgroundColor: isSelected ? "#000000" : "transparent",
                      color: isSelected ? "#FFFFFF" : "#111111",
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Coupons Module (Theme Neutral Background - No Cream) */}
        <div style={{ paddingTop: "6px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <h3
              style={{
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#111111",
                margin: 0,
              }}
            >
              AVAILABLE COUPONS
            </h3>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#888888",
                cursor: "pointer",
              }}
            >
              VIEW ALL
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            {/* Coupon 1 */}
            <div
              onClick={() => handleApplyCoupon("SAVE300")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                backgroundColor: "transparent",
                border:
                  appliedCoupon === "SAVE300"
                    ? "1.5px solid #111111"
                    : "1px solid rgba(0, 0, 0, 0.12)",
                cursor: "pointer",
                userSelect: "none",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "999px",
                  backgroundColor: "#000000",
                  color: "#FFFFFF",
                  fontSize: "8.5px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  letterSpacing: "0.04em",
                }}
              >
                FLAT
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p
                  style={{
                    fontSize: "10.5px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    margin: 0,
                    color: "#111111",
                  }}
                >
                  FLAT ₹300 OFF
                </p>
                <p
                  style={{
                    fontSize: "9px",
                    color: "#666666",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    margin: "2px 0 0 0",
                  }}
                >
                  {appliedCoupon === "SAVE300" ? (
                    <span style={{ color: "#111111", fontWeight: "700" }}>APPLIED ✓</span>
                  ) : (
                    "CODE: SAVE300"
                  )}
                </p>
              </div>
            </div>

            {/* Coupon 2 */}
            <div
              onClick={() => handleApplyCoupon("FREEBELT")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                backgroundColor: "transparent",
                border:
                  appliedCoupon === "FREEBELT"
                    ? "1.5px solid #111111"
                    : "1px solid rgba(0, 0, 0, 0.12)",
                cursor: "pointer",
                userSelect: "none",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "999px",
                  backgroundColor: "#000000",
                  color: "#FFFFFF",
                  fontSize: "8.5px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  letterSpacing: "0.04em",
                }}
              >
                GET
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p
                  style={{
                    fontSize: "10.5px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    margin: 0,
                    color: "#111111",
                  }}
                >
                  FREE ACCESSORY
                </p>
                <p
                  style={{
                    fontSize: "9px",
                    color: "#666666",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    margin: "2px 0 0 0",
                  }}
                >
                  {appliedCoupon === "FREEBELT" ? (
                    <span style={{ color: "#111111", fontWeight: "700" }}>APPLIED ✓</span>
                  ) : (
                    "CODE: FREEBELT"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Add To Cart & Wishlist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={cartState !== "idle"}
              style={{
                flex: 1,
                height: "48px",
                border: "1.5px solid #111111",
                backgroundColor:
                  cartState === "added" ? "#111111" : "transparent",
                color: cartState === "added" ? "#FFFFFF" : "#111111",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                cursor: cartState === "adding" ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (cartState === "idle") {
                  e.currentTarget.style.backgroundColor = "#111111";
                  e.currentTarget.style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (cartState === "idle") {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#111111";
                }
              }}
            >
              {cartState === "idle" && "ADD TO CART"}
              {cartState === "adding" && "ADDING..."}
              {cartState === "added" && "ADDED TO BAG ✓"}
            </button>

            <button
              type="button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              style={{
                width: "48px",
                height: "48px",
                border: "1.5px solid #111111",
                backgroundColor: isWishlisted ? "#111111" : "transparent",
                color: isWishlisted ? "#FFFFFF" : "#111111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
            >
              <Heart
                style={{
                  width: "18px",
                  height: "18px",
                  fill: isWishlisted ? "currentColor" : "none",
                }}
              />
            </button>
          </div>

          {/* Social Proof Sold Today Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "4px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&auto=format&fit=crop&q=80",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Customer"
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "999px",
                    border: "1.5px solid #FFFFFF",
                    marginLeft: i > 0 ? "-6px" : "0",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
            <p
              style={{
                fontSize: "10.5px",
                fontWeight: "600",
                color: "#111111",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              1,238+ SOLD TODAY{" "}
              <span
                style={{
                  fontWeight: "400",
                  color: "#888888",
                  letterSpacing: "0.06em",
                }}
              >
                • LOVED BY THE COMMUNITY
              </span>
            </p>
          </div>
        </div>

        {/* Product Details Section */}
        <div
          style={{
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            paddingTop: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#111111",
              margin: "0 0 10px 0",
            }}
          >
            PRODUCT DETAILS
          </h2>
          <p
            style={{
              fontSize: "13px",
              lineHeight: "1.75",
              color: "#4A4A4A",
              margin: "0 0 12px 0",
            }}
          >
            {product.detailsBody}
          </p>

          {/* Bullet points */}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {(product.specifications || [
              "Precision engineered aerospace grade build",
              "Custom ergonomic balance & reinforced structure",
              "Laser-etched insignia with matte satin finish",
              "Lab tested & verified for heavy duty daily use",
            ]).map((spec, i) => (
              <li
                key={i}
                style={{
                  fontSize: "12.5px",
                  color: "#4A4A4A",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  lineHeight: "1.5",
                }}
              >
                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "999px",
                    backgroundColor: "#111111",
                    flexShrink: 0,
                  }}
                />
                {spec}
              </li>
            ))}
          </ul>
        </div>

        {/* Secondary Accordions */}
        <div style={{ borderTop: "1px solid rgba(0, 0, 0, 0.08)" }}>
          {/* Details & Care */}
          <div style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === "care" ? null : "care")}
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#111111",
                }}
              >
                DETAILS &amp; CARE
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "300",
                  color: "#111111",
                  lineHeight: "1",
                }}
              >
                {activeAccordion === "care" ? "−" : "+"}
              </span>
            </button>
            {activeAccordion === "care" && (
              <div style={{ paddingBottom: "14px" }}>
                <ul
                  style={{
                    paddingLeft: "18px",
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "12.5px",
                    color: "#4A4A4A",
                    lineHeight: "1.6",
                  }}
                >
                  {product.careNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Shipping & Payment */}
          <div style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
            <button
              type="button"
              onClick={() =>
                setActiveAccordion(activeAccordion === "shipping" ? null : "shipping")
              }
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#111111",
                }}
              >
                SHIPPING &amp; PAYMENT
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "300",
                  color: "#111111",
                  lineHeight: "1",
                }}
              >
                {activeAccordion === "shipping" ? "−" : "+"}
              </span>
            </button>
            {activeAccordion === "shipping" && (
              <div style={{ paddingBottom: "14px" }}>
                <ul
                  style={{
                    paddingLeft: "18px",
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "12.5px",
                    color: "#4A4A4A",
                    lineHeight: "1.6",
                  }}
                >
                  {product.shippingNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Secure Checkout Badges */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            paddingTop: "14px",
            textAlign: "center",
          }}
        >
          {[
            { icon: Truck, label: "FREE SHIPPING", sub: "ON ORDERS ABOVE ₹999" },
            { icon: RefreshCcw, label: "EASY EXCHANGE", sub: "7-DAY POLICY" },
            { icon: ShieldCheck, label: "SECURE PAY", sub: "100% SAFE CHECKOUT" },
          ].map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  padding: "0 6px",
                  borderRight: idx < 2 ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
                }}
              >
                <Icon style={{ width: "16px", height: "16px", color: "rgba(0,0,0,0.6)" }} />
                <div>
                  <p
                    style={{
                      fontSize: "9px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: 0,
                      color: "#111111",
                    }}
                  >
                    {badge.label}
                  </p>
                  <p
                    style={{
                      fontSize: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "rgba(0,0,0,0.5)",
                      margin: "2px 0 0 0",
                    }}
                  >
                    {badge.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
