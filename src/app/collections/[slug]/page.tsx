import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { CollectionPage } from "@/components/collection/CollectionPage";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import {
  getCollectionBySlug,
  collectionCategories,
} from "@/components/collection/collectionData";
import type { CollectionCategoryKey } from "@/types/collection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return collectionCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  return {
    title: `${collection.title} — Favior Atelier`,
    description: collection.description,
    openGraph: {
      title: `${collection.title} | Favior`,
      description: collection.description,
    },
  };
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  const categoryKey = (collection.categoryKey || "all") as CollectionCategoryKey;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />
      <div className="pt-20 sm:pt-24 flex-1 flex flex-col">
        <CollectionPage
          initialCollection={collection}
          initialCategory={categoryKey}
        />
      </div>
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
