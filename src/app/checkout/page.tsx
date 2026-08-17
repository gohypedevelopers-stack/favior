"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useCart, formatPrice } from "@/context/CartContext";
import Image from "next/image";
import { Lock, ArrowRight, ShieldCheck, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

// A custom hook to track mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Check initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

export default function CheckoutPage() {
  const { cart, subtotal, currencySymbol, freeShippingThreshold, updateQuantity } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const { data: sessionData, isPending } = authClient.useSession();

  useEffect(() => {
    if (sessionData?.user?.name) {
      const parts = sessionData.user.name.split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
      }));
    }
  }, [sessionData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionData?.user) {
      setError("Please log in to complete your purchase.");
      setTimeout(() => {
        window.location.href = `/login?redirect=/checkout`;
      }, 1500);
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          total: subtotal,
          shippingAddress: fullAddress,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = `/checkout/success?orderId=${data.order.id}`;
      } else {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          setTimeout(() => {
            window.location.href = `/login?redirect=/checkout`;
          }, 1500);
        } else {
          setError(data.error || "Failed to place order.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 500; // Flat 500 if under threshold
  const total = subtotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#fafafa", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
        <Navbar />
        <main style={{ flex: 1, maxWidth: "896px", margin: isMobile ? "48px auto 0" : "64px auto 0", width: "100%", padding: isMobile ? "32px 16px" : "96px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#18181b", marginBottom: "16px" }}>Checkout</h1>
          <p style={{ color: "#71717a", marginBottom: "32px" }}>Your shopping bag is empty.</p>
          <Link href="/all-products" style={{ backgroundColor: "#000", color: "#fff", padding: "16px 32px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none" }}>
            Return to Shop
          </Link>
        </main>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    backgroundColor: "#fff",
    border: "1px solid #e4e4e7",
    padding: "12px 16px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as "border-box"
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase" as "uppercase",
    letterSpacing: "0.05em",
    color: "#71717a",
    marginBottom: "8px"
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafa", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      <Navbar />
      
      <main style={{ flex: 1, maxWidth: "1152px", margin: isMobile ? "48px auto 0" : "64px auto 0", width: "100%", padding: isMobile ? "8px 16px 24px" : "48px 24px" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "32px" }}>
          
          {/* Left Column - Form */}
          <div style={{ flex: "1 1 60%", width: "100%" }}>
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{ fontSize: isMobile ? "24px" : "30px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "-0.025em", color: "#18181b", marginBottom: "8px", marginTop: "0" }}>Secure Checkout</h1>
              <p style={{ fontSize: "14px", color: "#71717a", margin: 0 }}>Please fill out your shipping and payment details below.</p>
            </div>

            {error && (
              <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "6px", marginBottom: "32px", fontSize: "14px", fontWeight: "500" }}>
                {error}
              </div>
            )}

            <form onSubmit={handlePlaceOrder} style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              {/* Shipping Section */}
              <section>
                <h2 style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#18181b", marginBottom: "24px", paddingBottom: "8px", borderBottom: "1px solid #e4e4e7" }}>1. Shipping Information</h2>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Address</label>
                    <input required type="text" name="address" value={formData.address} onChange={handleChange} style={inputStyle} placeholder="Street address, apartment, suite, etc." />
                  </div>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", gridColumn: isMobile ? "auto" : "2 / 3" }}>
                    <div>
                      <label style={labelStyle}>State</label>
                      <input required type="text" name="state" value={formData.state} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>ZIP Code</label>
                      <input required type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ gridColumn: "1 / -1", marginTop: isMobile ? "0" : "8px" }}>
                    <label style={labelStyle}>Phone Number</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>
              </section>

              {/* Payment Section */}
              <section>
                <h2 style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#18181b", marginBottom: "24px", paddingBottom: "8px", borderBottom: "1px solid #e4e4e7" }}>2. Payment Method</h2>
                <div style={{ backgroundColor: "#fff", border: "1px solid #000", padding: "16px", borderRadius: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input type="radio" id="cod" name="payment" checked readOnly style={{ width: "16px", height: "16px", accentColor: "#000" }} />
                    <label htmlFor="cod" style={{ fontSize: "14px", fontWeight: "bold", color: "#18181b", textTransform: "uppercase", letterSpacing: "0.025em", margin: 0 }}>Cash on Delivery (COD)</label>
                  </div>
                  <p style={{ fontSize: "12px", color: "#71717a", marginTop: "8px", marginLeft: "28px", marginBottom: 0 }}>Pay with cash upon delivery.</p>
                </div>
                <div style={{ backgroundColor: "#fafafa", border: "1px solid #e4e4e7", padding: "16px", borderRadius: "4px", marginTop: "12px", opacity: 0.6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input type="radio" id="card" name="payment" disabled style={{ width: "16px", height: "16px" }} />
                    <label htmlFor="card" style={{ fontSize: "14px", fontWeight: "bold", color: "#18181b", textTransform: "uppercase", letterSpacing: "0.025em", margin: 0 }}>Credit / Debit Card</label>
                  </div>
                  <p style={{ fontSize: "12px", color: "#71717a", marginTop: "8px", marginLeft: "28px", marginBottom: 0 }}>Online payments are coming soon.</p>
                </div>
              </section>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    backgroundColor: "#000",
                    color: "#fff",
                    padding: "20px 32px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      Place Order <ArrowRight size={18} />
                    </>
                  )}
                </button>
                

              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div style={{ flex: "1 1 35%", width: "100%" }}>
            <div style={{ backgroundColor: "#fff", border: "1px solid #e4e4e7", padding: isMobile ? "16px" : "24px", position: isMobile ? "static" : "sticky", top: "112px", marginTop: isMobile ? "32px" : "0" }}>
              <h2 style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#18181b", marginBottom: "24px", marginTop: "0" }}>Order Summary</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid #e4e4e7" }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "16px" }}>
                    <div style={{ position: "relative", width: "64px", height: "64px", backgroundColor: "#fafafa", border: "1px solid #f4f4f5", flexShrink: 0 }}>
                      <Image src={item.image} alt={item.name} fill sizes="64px" style={{ objectFit: "contain", padding: "8px" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <p style={{ fontSize: "12px", fontWeight: "bold", color: "#18181b", textTransform: "uppercase", letterSpacing: "0.025em", margin: "0 0 4px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                      {item.color && <p style={{ fontSize: "10px", color: "#71717a", textTransform: "uppercase", margin: "0 0 8px 0" }}>{item.color}</p>}
                      
                      {/* Quantity Controls */}
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #e4e4e7", borderRadius: "2px", width: "fit-content" }}>
                         <button type="button" onClick={() => updateQuantity(item.id, -1)} style={{ background: "none", border: "none", padding: "4px 8px", cursor: "pointer", color: "#71717a", display: "flex", alignItems: "center" }}><Minus size={12} /></button>
                         <span style={{ fontSize: "12px", fontWeight: "bold", padding: "0 4px", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                         <button type="button" onClick={() => updateQuantity(item.id, 1)} style={{ background: "none", border: "none", padding: "4px 8px", cursor: "pointer", color: "#71717a", display: "flex", alignItems: "center" }}><Plus size={12} /></button>
                      </div>

                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", textAlign: "right" }}>
                      <p style={{ fontSize: "12px", fontWeight: "bold", color: "#18181b", margin: 0 }}>{formatPrice(item.numericPrice * item.quantity, currencySymbol)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "#52525b", marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid #e4e4e7" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: "500", color: "#18181b" }}>{formatPrice(subtotal, currencySymbol)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Shipping</span>
                  <span style={{ fontWeight: "500", color: "#18181b" }}>{shippingCost === 0 ? "Free" : formatPrice(shippingCost, currencySymbol)}</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#18181b" }}>
                <span style={{ fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total</span>
                <span style={{ fontSize: "20px", fontWeight: "800" }}>{formatPrice(total, currencySymbol)}</span>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
