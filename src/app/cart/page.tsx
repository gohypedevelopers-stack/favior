"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { useCart, formatPrice } from "@/context/CartContext";

export default function CartPage() {
  const { cart, openCart, totalItems, subtotal, currencySymbol } = useCart();

  useEffect(() => {
    // Open the side cart drawer automatically when visiting /cart
    openCart();
  }, [openCart]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 font-sans">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-32 pb-16 px-4 sm:px-6 max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-800 mb-4">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-zinc-900">
          Your Shopping Bag
        </h1>
        <p className="mt-2 text-sm text-zinc-500 max-w-md">
          {totalItems > 0
            ? `You have ${totalItems} item${totalItems > 1 ? "s" : ""} in your bag with subtotal of ${formatPrice(subtotal, currencySymbol)}.`
            : "Your shopping bag is currently empty."}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            type="button"
            onClick={openCart}
            className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            Open Side Cart Drawer <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            href="/all-products"
            className="w-full sm:w-auto px-8 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
