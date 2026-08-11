import type { Metadata } from "next";
import { Geist, Montserrat } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { CartProvider } from "@/context/CartContext";
import { SideCartDrawer } from "@/components/cart/SideCartDrawer";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Favior — Luxury Skincare & Body Care",
  description:
    "Discover Favior's curated collection of premium skincare, body care and home fragrance. Crafted with purpose-led botanical ingredients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${montserrat.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
          <SideCartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

