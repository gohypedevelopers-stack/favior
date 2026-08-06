import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { CollectionPage } from "@/components/collection/CollectionPage";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import { collectionsRegistry } from "@/components/collection/collectionData";

export const metadata: Metadata = {
  title: "Bundles & Training Kits — Favior",
  description: "Curated performance combinations and all-inclusive athlete training suites.",
};

export default function BundlesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />
      <div className="pt-20 sm:pt-24 flex-1 flex flex-col">
        <CollectionPage
          initialCollection={collectionsRegistry.bundles}
          initialCategory="bundles"
        />
      </div>
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
