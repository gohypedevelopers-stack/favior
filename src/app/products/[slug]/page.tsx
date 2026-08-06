import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { ProductPage } from "@/components/product/ProductPage";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import { getProductBySlug, getAllProductDetails } from "@/components/product/productData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = getAllProductDetails();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return {
    title: `${product.title} — Favior Atelier`,
    description: product.description,
    openGraph: {
      title: `${product.title} | Favior`,
      description: product.description,
      images: product.gallery.map((img) => img.src),
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />
      <div className="pt-20 sm:pt-24 flex-1 flex flex-col">
        <ProductPage product={product} />
      </div>
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
