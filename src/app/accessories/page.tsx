import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { CollectionPage } from "@/components/collection/CollectionPage";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import { collectionsRegistry } from "@/components/collection/collectionData";

export const metadata: Metadata = {
  title: "Training Accessories & Bands — Favior",
  description: "Natural latex resistance bands, pure chalk grip sets, and workout accessories.",
};

export default function AccessoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />
      <div className="pt-14 sm:pt-16 flex-1 flex flex-col">
        <CollectionPage
          initialCollection={collectionsRegistry.accessories}
          initialCategory="accessories"
        />
      </div>
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
