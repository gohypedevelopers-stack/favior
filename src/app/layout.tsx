import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SideCartDrawer } from "@/components/cart/SideCartDrawer";
import { SideWishlistDrawer } from "@/components/wishlist/SideWishlistDrawer";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Favior — Luxury Gym Gear & Fitness Accessories",
  description:
    "Discover Favior's curated collection of premium gym gear, wrist wraps, shakers, and fitness accessories designed for peak performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <WishlistProvider>
          <CartProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
            <SideCartDrawer />
            <SideWishlistDrawer />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}

