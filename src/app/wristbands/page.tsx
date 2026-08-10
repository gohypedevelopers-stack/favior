import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { CollectionPage } from "@/components/collection/CollectionPage";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import { collectionsRegistry } from "@/components/collection/collectionData";

export const metadata: Metadata = {
  title: "Wrist Wraps & Lifting Straps — Favior",
  description: "Heavy-duty 18-inch wrist wraps and padded cotton lifting straps.",
};

export default function WristbandsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />
      <div className="pt-14 sm:pt-16 flex-1 flex flex-col">
        <CollectionPage
          initialCollection={collectionsRegistry.wristbands}
          initialCategory="wristbands"
        />
      </div>
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
