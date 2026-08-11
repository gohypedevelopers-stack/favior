"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Model3D from "@/components/Model3D";
import { Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

const SHAKER_VARIANTS = [
  { name: "300ml", price: "599", desc: "Pro Series • 300ml" },
  { name: "750ml", price: "1,499", desc: "Pro Series • 750ml" }
];

export default function Model3DSection() {
  const { addToCart } = useCart();
  const [localVariant, setLocalVariant] = useState(SHAKER_VARIANTS[0]); // Default 300ml
  const [added, setAdded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Track scroll progress within the pinned container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Position X: 3D model stays anchored in left column on desktop
  const modelX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "0%"]
  );

  // Model Scale
  const modelScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.0, 1.0]
  );

  // Camera Orbit Rotation: Top-down lid view (20deg) tilting down to eye-level (75deg) while rotating 360deg
  const [cameraOrbit, setCameraOrbit] = useState("0deg 20deg 220%");

  useEffect(() => {
    const zoomLevel = isDesktop ? "220%" : "170%";
    const currentProgress = scrollYProgress.get() || 0;
    const currentPitch = Math.round(20 + currentProgress * 55);
    const currentRot = Math.round(currentProgress * 360);
    setCameraOrbit(`${currentRot}deg ${currentPitch}deg ${zoomLevel}`);

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const pitchDeg = Math.round(20 + progress * 55); // 20deg (top-down) -> 75deg (eye-level)
      const rotDeg = Math.round(progress * 360);
      setCameraOrbit(`${rotDeg}deg ${pitchDeg}deg ${zoomLevel}`);
    });
    return () => unsubscribe();
  }, [scrollYProgress, isDesktop]);

  const handleAddToCart = () => {
    addToCart({
      id: `favior-pro-shaker-${localVariant.name}`,
      name: `Favior Pro Shaker (${localVariant.name})`,
      price: `₹${localVariant.price}`,
      image: "/favior_shaker_white.png",
      color: "Gloss White",
      size: localVariant.name,
      slug: "the-havane",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section ref={containerRef} className="relative w-full h-[400vh] bg-white text-zinc-900 z-10">
      {/* 100vh Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 py-4 bg-white">

        {/* Clean Light Studio Ambient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-100 via-zinc-50 to-white z-0 pointer-events-none" />

        {/* Top Black Marquee Bar (Moving Left - Seamless Infinite Loop) */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none z-20 select-none bg-black py-6 sm:py-7 flex items-center border-b border-zinc-800 shadow-md">
          <div className="animate-marquee-left flex gap-8 whitespace-nowrap text-xs sm:text-xs font-bold uppercase tracking-[0.25em] text-white py-2.5 leading-relaxed">
            <span>FAVIOR PRO SERIES &nbsp;•&nbsp; LEAK-PROOF GUARANTEE &nbsp;•&nbsp; FOOD-GRADE STAINLESS STEEL &nbsp;•&nbsp; DOUBLE-WALL VACUUM &nbsp;•&nbsp;</span>
            <span>FAVIOR PRO SERIES &nbsp;•&nbsp; LEAK-PROOF GUARANTEE &nbsp;•&nbsp; FOOD-GRADE STAINLESS STEEL &nbsp;•&nbsp; DOUBLE-WALL VACUUM &nbsp;•&nbsp;</span>
            <span>FAVIOR PRO SERIES &nbsp;•&nbsp; LEAK-PROOF GUARANTEE &nbsp;•&nbsp; FOOD-GRADE STAINLESS STEEL &nbsp;•&nbsp; DOUBLE-WALL VACUUM &nbsp;•&nbsp;</span>
            <span>FAVIOR PRO SERIES &nbsp;•&nbsp; LEAK-PROOF GUARANTEE &nbsp;•&nbsp; FOOD-GRADE STAINLESS STEEL &nbsp;•&nbsp; DOUBLE-WALL VACUUM &nbsp;•&nbsp;</span>
          </div>
        </div>

        {/* Faded Giant FAVIOR Watermark Text for Desktop (Fixed Background) */}
        <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none z-0 select-none overflow-hidden">
          <span className="font-heading font-extrabold text-[21vw] leading-none uppercase tracking-tighter text-zinc-900/[0.035] whitespace-nowrap">
            FAVIOR
          </span>
        </div>

        {/* Bottom Black Marquee Bar (Moving Right - Seamless Infinite Loop) */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none z-20 select-none bg-black py-6 sm:py-7 flex items-center border-t border-zinc-800 shadow-md">
          <div className="animate-marquee-right flex gap-8 whitespace-nowrap text-xs sm:text-xs font-bold uppercase tracking-[0.25em] text-white py-2.5 leading-relaxed">
            <span>PREMIUM PERFORMANCE &nbsp;•&nbsp; ENGINEERED FOR ATHLETES &nbsp;•&nbsp; MATTE BLACK FINISH &nbsp;•&nbsp; 300ML / 750ML &nbsp;•&nbsp;</span>
            <span>PREMIUM PERFORMANCE &nbsp;•&nbsp; ENGINEERED FOR ATHLETES &nbsp;•&nbsp; MATTE BLACK FINISH &nbsp;•&nbsp; 300ML / 750ML &nbsp;•&nbsp;</span>
            <span>PREMIUM PERFORMANCE &nbsp;•&nbsp; ENGINEERED FOR ATHLETES &nbsp;•&nbsp; MATTE BLACK FINISH &nbsp;•&nbsp; 300ML / 750ML &nbsp;•&nbsp;</span>
            <span>PREMIUM PERFORMANCE &nbsp;•&nbsp; ENGINEERED FOR ATHLETES &nbsp;•&nbsp; MATTE BLACK FINISH &nbsp;•&nbsp; 300ML / 750ML &nbsp;•&nbsp;</span>
          </div>
        </div>

        {/* Pinned Hero Grid Content */}
        <div className="relative w-full max-w-6xl mx-auto flex flex-col lg:grid lg:grid-cols-2 items-center justify-center gap-1 sm:gap-2 lg:gap-0 h-full z-10 py-2">

          {/* 3D Shaker Model */}
          <motion.div
            style={{
              x: modelX,
              scale: modelScale,
            }}
            className="col-span-1 flex flex-col items-center justify-center w-full relative z-20"
          >
            {/* Faded Giant FAVIOR Watermark Text for Mobile (Anchored Behind Model) */}
            <div className="lg:hidden absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden">
              <span className="font-heading font-extrabold text-[30vw] leading-none uppercase tracking-tighter text-zinc-900/[0.04] whitespace-nowrap">
                FAVIOR
              </span>
            </div>

            <div className="w-full h-[250px] sm:h-[340px] lg:h-[520px] max-w-[250px] sm:max-w-[340px] lg:max-w-[520px] relative flex items-center justify-center z-10">
              <Model3D
                src="/3d model/favior.glb"
                alt="Favior 3D Shaker"
                cameraOrbit={cameraOrbit}
              />
            </div>
          </motion.div>

          {/* Right Column: Specifications Panel */}
          <div className="col-span-1 hero-specs-panel">
            <div>
              <h2 className="hero-spec-title">
                Favior Shaker
              </h2>
              <p className="hero-spec-subtitle">
                Pro Series • {localVariant.name}
              </p>
            </div>

            {/* Desktop Price */}
            <div className="hero-spec-price hero-price-desktop">
              ₹{localVariant.price}
            </div>

            <div>
              <p className="hero-spec-desc">
                Engineered for the dedicated athlete. Leak-proof guarantee with a premium matte finish.
              </p>
              <ul className="hero-spec-bullets">
                <li className="hero-spec-bullet-item">
                  <span className="hero-spec-bullet-dot" />
                  <span>Premium Food-Grade Stainless Steel</span>
                </li>
                <li className="hero-spec-bullet-item">
                  <span className="hero-spec-bullet-dot" />
                  <span>Double-wall vacuum insulation</span>
                </li>
              </ul>
            </div>

            {/* Capacity / Quantity & Mobile Price Row */}
            <div className="hero-capacity-price-row">
              {/* Capacity / Quantity Pill Selector (Left) */}
              <div className="hero-capacity-container">
                {SHAKER_VARIANTS.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => setLocalVariant(variant)}
                    className={`hero-capacity-btn ${
                      localVariant.name === variant.name ? "active" : ""
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>

              {/* Mobile Price (Right, above Add to Cart) */}
              <div className="hero-spec-price hero-price-mobile">
                ₹{localVariant.price}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hero-action-row">
              <button
                onClick={() => alert("Proceeding to checkout...")}
                className="hero-btn-buy"
              >
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                className="hero-btn-cart"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
