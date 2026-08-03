"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const heroSlides = [
  {
    name: "Black",
    image: "/IMG_5576.PNG",
    alt: "Favior Black Collection - Shaker, Gym Bag, Towel, and Deodorant",
  },
  {
    name: "Beige",
    image: "/ChatGPT Image Aug 3, 2026, 03_43_32 PM.png",
    alt: "Favior Beige Collection - Shaker, Gym Bag, Towel, and Deodorant",
  },
] as const;

/* Left Mini Trust Badges Icons (Exact Reference Spec) */
const ShieldCheckIcon = ({ className = "hero-mini-badge-icon" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const DumbbellIcon = ({ className = "hero-mini-badge-icon" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="6" y1="12" x2="18" y2="12" strokeWidth={2.2} />
    <rect x="4" y="8" width="2" height="8" rx="0.6" />
    <rect x="2" y="9.5" width="1.5" height="5" rx="0.4" />
    <rect x="18" y="8" width="2" height="8" rx="0.6" />
    <rect x="20.5" y="9.5" width="1.5" height="5" rx="0.4" />
  </svg>
);

const LeafIcon = ({ className = "hero-mini-badge-icon" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 12 12" />
  </svg>
);

const CheckCircleIcon = ({ className = "hero-mini-badge-icon" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const leftMiniFeatures = [
  {
    icon: ShieldCheckIcon,
    line1: "PREMIUM",
    line2: "QUALITY",
  },
  {
    icon: DumbbellIcon,
    line1: "BUILT TO",
    line2: "PERFORM",
  },
  {
    icon: LeafIcon,
    line1: "DESIGNED",
    line2: "FOR YOU",
  },
  {
    icon: CheckCircleIcon,
    line1: "TRUSTED BY",
    line2: "ATHLETES",
  },
];

/* Bottom Feature Bar Icons */
const AwardBadgeIcon = ({ className = "hero-feature-icon" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    <path d="m9 15.5-2 5.5 5-2.5 5 2.5-2-5.5" />
    <polygon points="12 6.8 13.1 9 15.5 9.3 13.7 11 14.1 13.4 12 12.3 9.9 13.4 10.3 11 8.5 9.3 10.9 9 12 6.8" />
  </svg>
);

const DumbbellIconFeature = ({ className = "hero-feature-icon" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="6.5" y1="12" x2="17.5" y2="12" strokeWidth={2} />
    <rect x="4.5" y="7" width="2" height="10" rx="0.8" />
    <rect x="2" y="9" width="1.5" height="6" rx="0.6" />
    <rect x="17.5" y="7" width="2" height="10" rx="0.8" />
    <rect x="20.5" y="9" width="1.5" height="6" rx="0.6" />
  </svg>
);

const BagIcon = ({ className = "hero-feature-icon" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 8V5.5a3.5 3.5 0 0 1 7 0V8" />
    <rect x="3" y="8" width="18" height="12.5" rx="2.5" />
    <path d="M3 13.5h7" />
    <path d="M14 13.5h7" />
    <rect x="10" y="12" width="4" height="3" rx="0.8" />
  </svg>
);

const StarIcon = ({ className = "hero-feature-icon" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2.5 15.09 8.8 22 9.8 17 14.6 18.18 21.5 12 18.2 5.82 21.5 7 14.6 2 9.8 8.91 8.8 12 2.5" />
  </svg>
);

const heroFeatures = [
  {
    icon: AwardBadgeIcon,
    title: "PREMIUM QUALITY",
    desc: "Crafted with care",
  },
  {
    icon: DumbbellIconFeature,
    title: "HIGH PERFORMANCE",
    desc: "For every workout",
  },
  {
    icon: BagIcon,
    title: "EVERYDAY ESSENTIALS",
    desc: "Built for your lifestyle",
  },
  {
    icon: StarIcon,
    title: "TRENDY & RELIABLE",
    desc: "Style meets function",
  },
];

export default function HeroVideo() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-main-container" aria-label="Favior Hero Showcase">
      {/* ── Main Stage Canvas: Full Product Composition & Left Content ── */}
      <div className="hero-main-stage">
        
        {/* Left Hero Content: Brand Heading, Taglines, Micro Badges & CTA */}
        <div className="hero-left-content">
          {/* Brand Heading & Text Intro */}
          <div className="hero-header-group">
            <div className="hero-brand-row">
              <h1 className="hero-brand-title">favior</h1>
              <span className="hero-brand-dot" />
            </div>

            {/* Tagline */}
            <p className="hero-tagline">PREMIUM FITNESS ESSENTIALS</p>

            {/* Subheadline */}
            <p className="hero-subheadline">
              Crafted for performance. Designed for you.
            </p>
          </div>

          {/* Mini 4-Feature Trust Badges */}
          <div className="hero-mini-badges">
            {leftMiniFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <React.Fragment key={item.line1}>
                  <div className="hero-mini-badge">
                    <Icon className="hero-mini-badge-icon" />
                    <span className="hero-mini-badge-text">
                      {item.line1}
                      <br />
                      {item.line2}
                    </span>
                  </div>
                  {idx < leftMiniFeatures.length - 1 && (
                    <div className="hero-mini-badge-divider" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* CTA Action Buttons */}
          <div className="hero-cta-group">
            <a
              href="/all-products"
              className="hero-btn-explore"
            >
              EXPLORE COLLECTION
            </a>
            <a
              href="#section-3d-model"
              className="hero-btn-shop"
            >
              SHOP NOW
            </a>
          </div>
        </div>

        {/* Backdrop 3D Product Image Slides */}
        <div className="hero-stage-backdrop">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.name}
              className={`hero-stage-slide ${activeSlide === index ? "active" : ""}`}
              aria-hidden={activeSlide !== index}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="hero-product-img"
              />
            </div>
          ))}
        </div>

      </div>

      {/* ── Bottom Floating Feature Bar ── */}
      <div className="hero-features-wrapper">
        <div className="hero-features-bar">
          {heroFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.title}>
                <div className="hero-feature-item">
                  <Icon className="hero-feature-icon" />
                  <div className="hero-feature-text">
                    <h3 className="hero-feature-title">{item.title}</h3>
                    <p className="hero-feature-subtitle">{item.desc}</p>
                  </div>
                </div>
                {idx < heroFeatures.length - 1 && (
                  <div className="hero-feature-divider" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
