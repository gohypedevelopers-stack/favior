import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { CollectionPage } from "@/components/collection/CollectionPage";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import { collectionsRegistry } from "@/components/collection/collectionData";
import { db } from "@/lib/db";
import type { CatalogItem } from "@/components/collection/collectionData";

export const metadata: Metadata = {
  title: "Atelier Bundles & Kits — Favior",
  description: "Curated performance bundles including shakers, wraps, and chalk sets.",
};

export default async function BundlesPage() {
  const dbProducts = await db.product.findMany({ orderBy: { createdAt: "desc" } });
  const products: CatalogItem[] = dbProducts.map((p: any) => ({ id: p.id, name: p.name, desc: p.description, price: `RS. ${p.price}`, originalPrice: p.oldPrice ? `RS. ${p.oldPrice}` : undefined, numericPrice: parseFloat(p.price.replace(/,/g, "")), rating: p.rating, reviews: parseInt(p.reviewsCount, 10) || 0, img: p.mainImage, gallery: [p.mainImage], category: "bundles", inStock: p.quantity > 0 }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />
      <div className="pt-14 sm:pt-16 flex-1 flex flex-col">
        <CollectionPage
          initialCollection={collectionsRegistry.bundles}
          initialCategory="bundles"
          products={products}
        />
      </div>
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
