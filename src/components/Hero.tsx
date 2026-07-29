"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Model3D from "@/components/Model3D";
import { Hand, Check } from "lucide-react";

const SHAKER_VARIANTS = [
  { name: "300ml", price: "599", desc: "Pro Series • 300ml Compact Shaker" },
  { name: "600ml", price: "1,499", desc: "Pro Series • 600ml Double-wall vacuum insulated" },
  { name: "750ml", price: "1,799", desc: "Pro Series • 750ml Extended capacity with mixing grid" },
  { name: "1000ml", price: "2,199", desc: "Pro Series • 1000ml Heavy Duty Shaker" }
];

export default function Hero() {
  const [localVariant, setLocalVariant] = useState(SHAKER_VARIANTS[1]); // Default 600ml
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
    [0.1, 0.55],
    [isDesktop ? "50%" : "0%", "0%"]
  );

  // Model Scale
  const modelScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6],
    [1.15, 1.25, 0.95]
  );
  
  // Specifications Panel Opacity: Starts at 0 (hidden), fades in to 1 on scroll
  const detailsOpacity = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);
  const detailsY = useTransform(scrollYProgress, [0.35, 0.65], [40, 0]);

  // Hint Opacity: Fades out early on scroll
  const hintOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

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

            {/* Scroll / Drag Hint */}
            <motion.div
              style={{ opacity: hintOpacity }}
              className="flex items-center gap-2 text-zinc-400 text-xs tracking-widest uppercase mt-3 pointer-events-none"
            >
              <Hand className="w-4 h-4 animate-pulse text-zinc-600" />
              <span>Scroll down to inspect specifications</span>
            </motion.div>
          </motion.div>

          {/* Right Column: Specifications Panel (Exact layout & color theme matching reference image) */}
          <motion.div
            style={{ opacity: detailsOpacity, y: detailsY }}
            className="col-span-1 flex flex-col justify-center pl-0 lg:pl-10 z-20 space-y-6"
          >
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-zinc-900">
                Favior Shaker
              </h2>
              <p className="text-zinc-500 text-base font-medium mt-1">
                Pro Series • {localVariant.name}
              </p>
            </div>

            <div className="text-3xl font-bold text-zinc-900">
              ₹{localVariant.price}
            </div>

            <div className="space-y-3">
              <p className="text-zinc-600 leading-relaxed text-sm font-normal">
                Engineered for the dedicated athlete. Leak-proof guarantee with a premium matte finish.
              </p>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-black rounded-full shrink-0" />
                  <span>Premium Food-Grade Stainless Steel</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-black rounded-full shrink-0" />
                  <span>Double-wall vacuum insulation</span>
                </li>
              </ul>
            </div>

            {/* Capacity Pill Selector */}
            <div className="bg-zinc-100/90 p-1.5 rounded-2xl flex gap-1 border border-zinc-200/80 max-w-xs">
              {SHAKER_VARIANTS.map((variant) => (
                <button
                  key={variant.name}
                  onClick={() => setLocalVariant(variant)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    localVariant.name === variant.name
                      ? "bg-white shadow-sm text-black"
                      : "text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>

            {/* Action Buttons (Solid Black Buy Now + White Outline Add to Cart) */}
            <div className="flex gap-4 pt-2 w-full max-w-md">
              <button
                onClick={() => alert("Proceeding to checkout...")}
                className="flex-1 h-12 rounded-full bg-black text-white hover:bg-zinc-800 text-sm font-semibold transition-all shadow-md flex items-center justify-center"
              >
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                className="flex-1 h-12 rounded-full bg-white border border-black text-black hover:bg-zinc-100 text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
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
