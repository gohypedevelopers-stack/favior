import Image from "next/image";
import ProductCard, { Product } from "@/components/ProductCard";
import ProductSlider from "@/components/ProductSlider";
import CardGridSection from "@/components/CardGridSection";
import Model3DSection from "@/components/Model3DSection";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroVideo from "@/components/HeroVideo";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import { db } from "@/lib/db";
import { listActiveBanners } from "@/lib/server/controllers/banners.controller";

export const dynamic = 'force-dynamic';

/* ─────────────────────────────────────
   SVG Icon Helpers
───────────────────────────────────── */
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const BagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    style={{ width: 14, height: 14, display: "inline-block", marginLeft: 6 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
    />
  </svg>
);

/* ─────────────────────────────────────
   Page Component
───────────────────────────────────── */
export default async function Home() {
  const [dbProducts, activeBanners] = await Promise.all([
    db.product.findMany({
      take: 12,
      orderBy: { createdAt: "desc" }
    }),
    listActiveBanners()
  ]);

  const allProducts: Product[] = dbProducts.map((p: any) => ({
    id: p.id,
    name: p.name,
    desc: p.description,
    price: `RS. ${p.price}`,
    originalPrice: p.oldPrice ? `RS. ${p.oldPrice}` : undefined,
    rating: p.rating,
    reviews: parseInt(p.reviewsCount, 10) || 0,
    img: p.mainImage,
    gallery: [p.mainImage]
  }));

  const products = allProducts.slice(0, 4);
  const curateItems = allProducts.slice(4, 8);

  return (
    <>
      {/* ── Announcement Bar ── */}
      <AnnouncementBar />

      {/* ── Smart Aesop Navigation (Scroll-Up Reveal) ── */}
      <Navbar />

      {/* ── Hero Video Section ── */}
      <HeroVideo banners={activeBanners} />

      {/* ── 3D Interactive Model Section ── */}
      <div id="section-3d-model">
        <Model3DSection />
      </div>

      {/* ── Featured Products Grid ── */}
      <CardGridSection
        title="Bestsellers"
        subtitle="Curated Selection"
        products={products.slice(0, 4)}
        viewAllHref="/all-products"
      />






      {/* ── Split: Shaker / Text ── */}
      <section className="split-section">
        <Image
          src="/og_shaker.png"
          alt="Favior Pro Stainless Shaker"
          width={800}
          height={600}
          className="split-img"
        />
        <div className="split-content dark">
          <p className="split-eyebrow">Hydration Series</p>
          <h2 className="serif">Never miss a rep. Never miss a sip.</h2>
          <p>
            Our Pro Stainless Shakers are built with double-wall insulation to
            keep your pre-workout ice cold and your protein shake perfectly
            blended — from the first set to the final rep.
          </p>
          <a href="/shakers" className="btn btn-light" style={{ alignSelf: "flex-start" }}>
            Shop Shakers
          </a>
        </div>
      </section>

      {/* ── Split: Wristband / Text ── */}
      <section className="split-section">
        <div className="split-content" style={{ background: "var(--bg-cream)" }}>
          <p className="split-eyebrow">Support Series</p>
          <h2 className="serif" style={{ color: "var(--text-dark)" }}>
            Protect your joints. <em>Maximise</em> your lifts.
          </h2>
          <p>
            Our Elite Wrist Wraps deliver competition-grade joint support for
            every pressing movement. Crafted from heavy-duty cotton-elastic
            blend with a secure thumb loop for perfect, repeatable placement.
          </p>
          <a href="/wristbands" className="btn btn-dark" style={{ alignSelf: "flex-start" }}>
            Shop Wrist Wraps
          </a>
        </div>
        <Image
          src="/og_wristband.png"
          alt="Elite Wrist Wraps"
          width={800}
          height={600}
          className="split-img"
        />
      </section>

      {/* ── Curate / Build Your Kit ── */}
      <CardGridSection
        title="Build Your Kit"
        subtitle="Exclusive Performance Bundles"
        products={curateItems.slice(0, 4)}
        viewAllHref="/all-products"
      />



      {/* ── Journal Section Marquee Banner ── */}
      <div className="w-full bg-black py-14 sm:py-16 flex items-center overflow-hidden select-none border-y border-zinc-800">
        <div className="animate-marquee-left flex gap-10 whitespace-nowrap text-xs sm:text-xs font-bold uppercase tracking-[0.3em] text-white py-1 leading-relaxed">
          <span>ATHLETE STORIES &nbsp;•&nbsp; TRAINING SCIENCE &nbsp;•&nbsp; RECOVERY STRATEGIES &nbsp;•&nbsp; NUTRITION GUIDES &nbsp;•&nbsp; FAVIOR JOURNAL &nbsp;•&nbsp;</span>
          <span>ATHLETE STORIES &nbsp;•&nbsp; TRAINING SCIENCE &nbsp;•&nbsp; RECOVERY STRATEGIES &nbsp;•&nbsp; NUTRITION GUIDES &nbsp;•&nbsp; FAVIOR JOURNAL &nbsp;•&nbsp;</span>
          <span>ATHLETE STORIES &nbsp;•&nbsp; TRAINING SCIENCE &nbsp;•&nbsp; RECOVERY STRATEGIES &nbsp;•&nbsp; NUTRITION GUIDES &nbsp;•&nbsp; FAVIOR JOURNAL &nbsp;•&nbsp;</span>
          <span>ATHLETE STORIES &nbsp;•&nbsp; TRAINING SCIENCE &nbsp;•&nbsp; RECOVERY STRATEGIES &nbsp;•&nbsp; NUTRITION GUIDES &nbsp;•&nbsp; FAVIOR JOURNAL &nbsp;•&nbsp;</span>
        </div>
      </div>

      {/* ── Camera / Editorial Pair ── */}
      <section className="section camera-section">
        <div className="container" style={{ marginBottom: "28px" }}>
          <p className="uppercase tracking-[0.22em] font-semibold text-zinc-500 text-[11px] mb-1">
            INSIGHTS & STORIES
          </p>
          <h2 className="text-[28px] sm:text-[34px] font-bold uppercase tracking-tight text-zinc-900 leading-none">
            JOURNAL
          </h2>
        </div>
        <div className="camera-grid" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="camera-content">
            <p className="eyebrow">Latest from the Journal</p>
            <h2 className="serif">Train Hard. Recover Smart.</h2>
            <p>
              Our journal dives into training science, recovery strategies, and
              athlete stories — everything you need to fuel your next PR.
            </p>
            <a href="/journal" className="btn btn-dark" style={{ alignSelf: "flex-start" }}>
              Read the Journal
            </a>
          </div>
          <div className="camera-img-wrap">
            <Image
              src="/og_shaker.png"
              alt="Fitness journal editorial"
              width={800}
              height={600}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>


      {/* ── FAQ Section ── */}
      <FaqSection />

      {/* ── Footer ── */}
      <SiteFooter />
    </>
  );
}
