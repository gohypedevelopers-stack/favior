"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart once they land on the success page
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-24 flex flex-col items-center justify-center mt-16 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 size={40} />
        </div>
        
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-zinc-900 mb-4">
          Order Confirmed!
        </h1>
        
        <p className="text-zinc-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Thank you for your purchase. We've received your order and are getting it ready to ship. You will receive an email confirmation shortly.
        </p>

        {orderId && (
          <div className="bg-white border border-zinc-200 px-8 py-4 mb-8 rounded-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Order Number</p>
            <p className="text-sm font-mono font-bold text-zinc-900">#{orderId.slice(-8).toUpperCase()}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/profile" 
            className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
          >
            View Order Status
          </Link>
          <Link 
            href="/all-products" 
            className="bg-white text-zinc-900 border border-zinc-200 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
