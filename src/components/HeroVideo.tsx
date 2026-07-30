"use client";

import React from "react";

export default function HeroVideo() {
  const scrollTo3D = () => {
    const el = document.getElementById("section-3d-model");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-[90vh] min-h-[550px] max-h-[900px] overflow-hidden bg-black text-white flex items-center justify-center">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center opacity-100 brightness-125 contrast-105"
      >
        <source src="/Veo_Hero_Video_Prompt_Use_th.mp4" type="video/mp4" />
      </video>

      {/* Subtle Top & Bottom Gradient Edge Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-10 pointer-events-none" />



      {/* Scroll Down Cue */}
      <button
        onClick={scrollTo3D}
        aria-label="Scroll to 3D Model"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-zinc-400 hover:text-white transition-colors duration-200 flex flex-col items-center gap-1 cursor-pointer"
      >
        <span className="text-[10px] tracking-widest uppercase opacity-70">Scroll</span>
        <svg
          className="w-4 h-4 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
    </section>
  );
}
