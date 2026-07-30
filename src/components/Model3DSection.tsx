"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Model3D from "@/components/Model3D";
import { Check } from "lucide-react";

const SHAKER_VARIANTS = [
  { name: "300ml", price: "599", desc: "Pro Series • 300ml" },
  { name: "750ml", price: "1,499", desc: "Pro Series • 750ml" }
];

export default function Model3DSection() {
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

  // Position X: Starts at 50% (Dead Center of viewport), shifts to 0% (Left Column) on scroll
  const modelX = useTransform(
    scrollYProgress,
    [0.1, 0.50],
    [isDesktop ? "50%" : "0%", "0%"]
  );

  // Model Scale
  const modelScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6],
    [1.10, 1.20, 0.90]
  );

  // Specifications Panel Opacity: Starts at 0 (hidden), fades in to 1 on scroll
  const detailsOpacity = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);
  const detailsY = useTransform(scrollYProgress, [0.35, 0.65], [40, 0]);

  // Camera Orbit Rotation: 360° Rotation on scroll
  const [cameraOrbit, setCameraOrbit] = useState("0deg 20deg 105%");

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const rotDeg = Math.round(progress * 360);
      const startPhi = 20;
      const endPhi = 75;
      const currentPhi = Math.round(startPhi + (endPhi - startPhi) * Math.min(progress / 0.6, 1));
      setCameraOrbit(`${rotDeg}deg ${currentPhi}deg 105%`);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section ref={containerRef} className="relative w-full h-[250vh] bg-zinc-50 text-zinc-900">
      {/* 100vh Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden px-6">

        {/* Clean Light Studio Ambient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-100/80 via-zinc-50 to-white z-0 pointer-events-none" />

        {/* Pinned Hero Grid Content */}
        <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center justify-center h-full z-10">

          {/* 3D Shaker Model: Dead-Centered on load (50%), shifts left (0%) on scroll */}
          <motion.div
            style={{
              x: modelX,
              scale: modelScale,
            }}
            className="col-span-1 flex flex-col items-center justify-center h-full w-full relative z-20"
          >
            <div className="w-full h-[520px] max-w-[520px] relative flex items-center justify-center">
              <Model3D
                src="/gym_shaker_bottle.glb"
                alt="Favior 3D Shaker"
                cameraOrbit={cameraOrbit}
              />
            </div>
          </motion.div>

          {/* Right Column: Specifications Panel */}
          <motion.div
            style={{ opacity: detailsOpacity, y: detailsY }}
            className="col-span-1 hero-specs-panel"
          >
            <div>
              <h2 className="hero-spec-title">
                Favior Shaker
              </h2>
              <p className="hero-spec-subtitle">
                Pro Series • {localVariant.name}
              </p>
            </div>

            <div className="hero-spec-price">
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

            {/* Capacity Pill Selector */}
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
          </motion.div>

        </div>

      </div>
    </section>
  );
}
