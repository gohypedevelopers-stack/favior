import Image from "next/image";

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
   Data
───────────────────────────────────── */
const products = [
  {
    id: "p1",
    name: "Pro Stainless Shaker — Onyx",
    desc: "600ml double-wall insulated shaker with leak-proof lid and precision mixing grid.",
    price: "₹1,499",
    img: "/og_shaker.png",
  },
  {
    id: "p2",
    name: "Elite Wrist Wraps — Black/Gold",
    desc: "Heavy-duty 18\" wrist wraps with thumb loop, built for maximum support during heavy lifts.",
    price: "₹999",
    img: "/og_wristband.png",
  },
  {
    id: "p3",
    name: "Performance Gym Kit",
    desc: "Complete training essentials bundle: shaker, wraps, resistance bands & chalk bag.",
    price: "₹2,999",
    img: "/og_wristband.png",
  },
];

const curateItems = [
  { id: "c1", name: "Pro Shaker — Onyx", price: "₹1,499", img: "/og_shaker.png", swatches: ["#1a1a1a", "#c9a84c"] },
  { id: "c2", name: "Elite Wrist Wraps", price: "₹999", img: "/og_wristband.png", swatches: ["#111111", "#d4a843"] },
  { id: "c3", name: "Gym Kit Bundle", price: "₹2,999", img: "/og_wristband.png", swatches: ["#222222", "#c8a050"] },
  { id: "c4", name: "Resistance Band Set", price: "₹1,199", img: "/og_shaker.png", swatches: ["#333333", "#b8902a"] },
];

/* ─────────────────────────────────────
   Page Component
───────────────────────────────────── */
export default function Home() {
  return (
    <>
      {/* ── Announcement Bar ── */}
      <div className="announcement-bar">
        Free shipping on orders over ₹1,999 &nbsp;|&nbsp; New arrivals:
        Shaker &amp; Wrist Wrap Collection now live
      </div>

      {/* ── Navigation ── */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          Favior
        </a>
        <ul className="nav-links">
          <li>
            <a href="/shakers">Shakers</a>
          </li>
          <li>
            <a href="/wristbands">Wrist Wraps</a>
          </li>
          <li>
            <a href="/accessories">Accessories</a>
          </li>
          <li>
            <a href="/bundles">Bundles</a>
          </li>
          <li>
            <a href="/apparel">Apparel</a>
          </li>
          <li>
            <a href="/nutrition">Nutrition</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
        <div className="nav-icons">
          <SearchIcon />
          <UserIcon />
          <BagIcon />
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        >
          <source src="/Veo_Hero_Video_Prompt_Use_th.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">New Collection</p>
          <h1 className="hero-title serif">
            Built for the <em>relentless</em> athlete
          </h1>
          <a href="/collections" className="btn btn-light">
            Shop the Collection
          </a>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section">
        <div className="container">
          <p className="section-label">Bestsellers</p>
          <div className="product-grid">
            {products.map((p) => (
              <div className="product-card-aesop" key={p.id}>
                <div className="product-card-top-bar">
                  <span className="badge-online">{p.badge || "Online exclusive"}</span>
                  <button className="btn-bookmark" aria-label="Bookmark item">
                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1V17L7 12L13 17V1H1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="product-img-wrap-aesop">
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={600}
                    height={800}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                <div className="product-info-aesop">
                  <h3 className="product-title-aesop">{p.name}</h3>
                  <p className="product-desc-aesop">{p.desc}</p>
                  <p className="product-price-aesop">{p.price}</p>
                  <button className="btn-add-cart">
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── Editorial Banner — Fitness ── */}
      <section className="editorial-banner">
        <Image
          src="/og_wristband.png"
          alt="Premium fitness gear editorial"
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="editorial-banner-overlay">
          <div className="editorial-banner-content">
            <p className="eyebrow">Performance Engineering</p>
            <h2 className="serif">
              Engineered for strength, designed for obsession
            </h2>
            <p>
              Every Favior product is stress-tested by elite athletes and refined
              through relentless iteration. We build gear that survives the
              grind — and inspires you to keep going.
            </p>
            <a href="/about/engineering" className="btn btn-light">
              Our Process
            </a>
          </div>
        </div>
      </section>

      {/* ── What's New ── */}
      <section className="section">
        <div className="container">
          <p className="section-label">What&apos;s New</p>
        </div>
        <div className="whats-new-grid" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", gap: 8 }}>
          <div className="wn-large" style={{ minHeight: 480 }}>
            <Image
              src="/og_wristband.png"
              alt="Premium gym accessories flatlay"
              width={600}
              height={900}
              className="wn-img"
              style={{ height: "100%", minHeight: 480 }}
            />
          </div>
          <div className="wn-top-right">
            <Image
              src="/og_shaker.png"
              alt="Pro Stainless Shaker"
              width={900}
              height={280}
              className="wn-img"
              style={{ height: 234 }}
            />
          </div>
          <div className="wn-bottom-right">
            <Image
              src="/og_wristband.png"
              alt="Elite Wrist Wraps"
              width={900}
              height={280}
              className="wn-img"
              style={{ height: 234 }}
            />
          </div>
        </div>
        <div className="container" style={{ marginTop: 40 }}>
          <a href="/new-arrivals" className="btn btn-outline">
            View All New Arrivals <ArrowRightIcon />
          </a>
        </div>
      </section>

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

      {/* ── Curate Your ── */}
      <section className="curate-section">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="curate-header">
            <h2 className="serif">Build Your Kit</h2>
            <a href="/all-products" className="btn btn-outline" style={{ fontSize: 10 }}>
              View All
            </a>
          </div>
          <div className="product-row">
            {curateItems.map((item) => (
              <div className="product-row-item" key={item.id}>
                <Image
                  src={item.img}
                  alt={item.name}
                  width={240}
                  height={320}
                  className="product-row-img"
                  style={{ height: 240 }}
                />
                <div className="swatch-row">
                  {item.swatches.map((s, i) => (
                    <div key={i} className="swatch" style={{ background: s }} />
                  ))}
                </div>
                <p className="product-row-name">{item.name}</p>
                <p className="product-row-price">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Storefront / In-Store ── */}
      <section className="storefront-section">
        <Image
          src="/og_wristband.png"
          alt="Favior fitness gear collection"
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="storefront-overlay">
          <div className="storefront-content">
            <p className="eyebrow">Find Us</p>
            <h2 className="serif">Train. Perform. Repeat.</h2>
            <p>
              Visit one of our premium retail flagship locations where our
              specialists can fit you with the perfect training kit.
            </p>
            <a href="/stores" className="btn btn-light">
              Locate a Store
            </a>
          </div>
        </div>
      </section>

      {/* ── Camera / Editorial Pair ── */}
      <section className="section camera-section">
        <div className="container">
          <p className="section-label">Journal</p>
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


      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-grid" style={{ maxWidth: 1280, margin: "0 auto 0" }}>
          <div className="footer-brand">
            <div className="logo">Favior</div>
            <p>
              We engineer premium fitness gear of uncommon quality — shakers,
              wrist wraps, resistance bands and athlete accessories — built for
              those who refuse to compromise.
            </p>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><a href="/shakers">Shakers</a></li>
              <li><a href="/wristbands">Wrist Wraps</a></li>
              <li><a href="/accessories">Accessories</a></li>
              <li><a href="/bundles">Bundles</a></li>
              <li><a href="/apparel">Apparel</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>About</h4>
            <ul>
              <li><a href="/about">Our Story</a></li>
              <li><a href="/sustainability">Sustainability</a></li>
              <li><a href="/ingredients">Ingredients</a></li>
              <li><a href="/stores">Store Locator</a></li>
              <li><a href="/journal">Journal</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/shipping">Shipping</a></li>
              <li><a href="/returns">Returns</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>Newsletter</h4>
            <p>
              Subscribe to receive updates on new products, journal entries and
              exclusive offers.
            </p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                id="newsletter-email"
              />
              <button type="submit">Subscribe</button>
            </div>
          </div>
        </div>

        <div
          className="footer-bottom"
          style={{ maxWidth: 1280, margin: "0 auto" }}
        >
          <p>© 2026 Favior. All rights reserved.</p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
          </div>
        </div>
      </footer>
    </>
  );
}
