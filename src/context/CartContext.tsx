"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string; // Unique cart item ID (productId + variant)
  productId: string;
  name: string;
  price: string;
  originalPrice?: string;
  numericPrice: number;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  slug?: string;
}

export interface AddToCartPayload {
  id?: string;
  productId?: string;
  slug?: string;
  name?: string;
  title?: string;
  price?: string | number;
  originalPrice?: string;
  image?: string;
  img?: string;
  color?: string;
  colorName?: string;
  size?: string;
  quantity?: number;
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (payload: AddToCartPayload) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, deltaOrQuantity: number, isDirectSet?: boolean) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  freeShippingThreshold: number;
  shippingRemaining: number;
  freeShippingProgress: number;
  currencySymbol: string;
}

const STORAGE_KEY = "favior_shopping_cart";
const FREE_SHIPPING_THRESHOLD = 5000; // ₹5,000 threshold for free shipping

export function parseNumericPrice(price?: string | number): number {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const str = price.toString();
  // Strip commas (thousands separators)
  const noCommas = str.replace(/,/g, "");
  const cleaned = noCommas.replace(/[^0-9.]/g, "");
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

export function formatPrice(amount: number, symbol = "₹"): string {
  const rounded = Math.round(amount);
  return `${symbol}${rounded.toLocaleString("en-IN")}`;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial cart from localStorage safely on client
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage on cart change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart, isLoaded]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addToCart = useCallback((payload: AddToCartPayload) => {
    const rawId = payload.id || payload.productId || payload.slug || "item-" + Date.now();
    const color = payload.color || payload.colorName || "";
    const size = payload.size || "";
    const uniqueId = `${rawId}${color ? `-${color}` : ""}${size ? `-${size}` : ""}`;
    const name = payload.name || payload.title || "Favior Product";
    const image = payload.image || payload.img || "/favior_shaker_white.png";
    const numericPrice = parseNumericPrice(payload.price);
    const rawPriceStr = typeof payload.price === "string" ? payload.price : formatPrice(numericPrice);
    const addQty = payload.quantity && payload.quantity > 0 ? payload.quantity : 1;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === uniqueId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + addQty,
        };
        return updated;
      }
      return [
        ...prevCart,
        {
          id: uniqueId,
          productId: rawId,
          name,
          price: rawPriceStr,
          originalPrice: payload.originalPrice,
          numericPrice,
          image,
          color,
          size,
          quantity: addQty,
          slug: payload.slug || rawId,
        },
      ];
    });

    // Automatically slide open the side cart drawer on item add
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, deltaOrQuantity: number, isDirectSet = false) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = isDirectSet ? deltaOrQuantity : item.quantity + deltaOrQuantity;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Computed values
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.numericPrice * item.quantity, 0);
  const freeShippingThreshold = FREE_SHIPPING_THRESHOLD;
  const shippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Infer currency symbol from stored item price if available
  const currencySymbol = cart[0]?.price?.includes("RS.") ? "RS. " : "₹";

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        freeShippingThreshold,
        shippingRemaining,
        freeShippingProgress,
        currencySymbol,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
