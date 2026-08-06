import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { CollectionPage } from "@/components/collection/CollectionPage";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import { collectionsRegistry } from "@/components/collection/collectionData";

export const metadata: Metadata = {
  title: "Collections — Favior Atelier",
  description:
    "Explore our complete range of precision stainless steel shakers, heavy-duty wrist wraps, and curated fitness training essentials.",
};

export default function CollectionsIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />
      <div className="pt-20 sm:pt-24 flex-1 flex flex-col">
        <CollectionPage
          initialCollection={collectionsRegistry.all}
          initialCategory="all"
        />
      </div>
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
