"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface WishlistItem {
  id: string; // Unique item ID
  productId: string;
  name: string;
  price: string;
  originalPrice?: string;
  numericPrice: number;
  image: string;
  color?: string;
  size?: string;
  slug?: string;
}

export interface AddToWishlistPayload {
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
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: () => void;
  addToWishlist: (payload: AddToWishlistPayload) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const STORAGE_KEY = "favior_wishlist";

export function parseNumericPrice(price?: string | number): number {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const str = price.toString();
  const noCommas = str.replace(/,/g, "");
  const cleaned = noCommas.replace(/[^0-9.]/g, "");
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

export function formatPrice(amount: number, symbol = "₹"): string {
  const rounded = Math.round(amount);
  return `${symbol}${rounded.toLocaleString("en-IN")}`;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load wishlist from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist, isLoaded]);

  const openWishlist = useCallback(() => setIsOpen(true), []);
  const closeWishlist = useCallback(() => setIsOpen(false), []);
  const toggleWishlist = useCallback(() => setIsOpen((prev) => !prev), []);

  const addToWishlist = useCallback((payload: AddToWishlistPayload) => {
    const rawId = payload.id || payload.productId || payload.slug || "item-" + Date.now();
    const color = payload.color || payload.colorName || "";
    const size = payload.size || "";
    const uniqueId = `${rawId}${color ? `-${color}` : ""}${size ? `-${size}` : ""}`;
    const name = payload.name || payload.title || "Favior Product";
    const image = payload.image || payload.img || "/favior_shaker_white.png";
    const numericPrice = parseNumericPrice(payload.price);
    const rawPriceStr = typeof payload.price === "string" ? payload.price : formatPrice(numericPrice);

    setWishlist((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === uniqueId);
      if (existingIndex > -1) {
        return prev; // Already in wishlist
      }
      return [
        ...prev,
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
          slug: payload.slug || rawId,
        },
      ];
    });

    setIsOpen(true); // Optionally slide open when added, similar to cart
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id && item.productId !== id));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some((item) => item.productId === productId || item.id === productId);
    },
    [wishlist]
  );

  const totalItems = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isOpen,
        openWishlist,
        closeWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
