"use client";

import { useWishlist } from "@/context/WishlistContext";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";

export default function WishlistDisplay() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <>
      <h2 style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#a1a1aa", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
        <Heart size={14} /> My Wishlist
      </h2>
      
      {wishlist.length === 0 ? (
        <div style={{ backgroundColor: "#fafafa", border: "1px solid #f4f4f5", padding: "48px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#71717a", marginBottom: "24px" }}>Your wishlist is currently empty.</p>
          <Link href="/all-products" style={{ display: "inline-block", backgroundColor: "#000", color: "#fff", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", padding: "16px 32px", textDecoration: "none" }}>
            Explore Products
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {wishlist.map((item) => (
            <div key={item.id} style={{ border: "1px solid #f4f4f5", padding: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
              <img src={item.image} alt={item.name} style={{ width: "64px", height: "64px", objectFit: "cover", backgroundColor: "#fafafa" }} />
              <div style={{ flex: 1 }}>
                <Link href={`/product/${item.slug || item.productId}`} style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", color: "#18181b", textDecoration: "none", display: "block", marginBottom: "4px" }}>
                  {item.name}
                </Link>
                <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>{item.price}</p>
                {(item.color || item.size) && (
                  <p style={{ fontSize: "11px", color: "#a1a1aa", margin: "4px 0 0 0" }}>
                    {item.color} {item.size ? `/ ${item.size}` : ""}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeFromWishlist(item.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#a1a1aa", padding: "8px" }}
                aria-label="Remove from Wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
