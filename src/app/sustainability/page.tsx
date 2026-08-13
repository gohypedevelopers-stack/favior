import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

export default function MaterialsCraftPage() {
  return (
    <div className="bg-white text-zinc-900 font-sans overflow-x-hidden min-h-screen">
      {/* Navigation */}
      <Navbar />

      <main className="pt-20 md:pt-28 pb-12 md:pb-16">
        {/* Hero Section */}
        <section className="relative px-6 md:px-12 py-16 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden min-h-[50vh] bg-black text-white">
          {/* Subtle background image/texture overlay */}
          <div className="absolute inset-0 opacity-40 bg-[url('/favior_kit_white.png')] bg-cover bg-center grayscale"></div>
          <div className="absolute inset-0 bg-black/70"></div>

          <div className="max-w-4xl mx-auto flex flex-col gap-4 md:gap-6 relative z-10">
            <span className="inline-block mx-auto px-4 py-1.5 md:px-6 md:py-2 border border-white/20 rounded-full text-xs md:text-sm font-semibold tracking-widest uppercase text-zinc-200">
              Materials & Craft
            </span>
            <h1 className="m-0 text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase leading-none tracking-tight">
              Engineered <br className="hidden sm:block" />
              To Endure
            </h1>
            <p className="max-w-2xl mx-auto m-0 text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed font-light">
              We source only the highest grade materials to build training tools that withstand the test of time, intensity, and relentless pursuit.
            </p>
          </div>
        </section>

        {/* The Details Section */}
        <section className="px-6 md:px-12 py-12 md:py-24">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16">
            
            {/* Text Box */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6 md:gap-8 order-2 lg:order-1">
              <h2 className="m-0 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Uncompromising Quality
              </h2>
              <div className="flex flex-col gap-6 md:gap-8 text-zinc-600 text-base md:text-lg leading-relaxed">
                <div>
                  <h3 className="text-zinc-900 text-lg md:text-xl font-bold m-0 mb-2 uppercase tracking-wide">
                    Premium Stainless Steel
                  </h3>
                  <p className="m-0">
                    Our shakers are forged from 18/8 food-grade stainless steel. This double-wall vacuum insulation not only keeps your supplements perfectly chilled for up to 24 hours but also ensures zero odor retention and maximum durability against drops.
                  </p>
                </div>
                <div>
                  <h3 className="text-zinc-900 text-lg md:text-xl font-bold m-0 mb-2 uppercase tracking-wide">
                    Heavy-Duty Elasticity
                  </h3>
                  <p className="m-0">
                    Our wrist wraps and lifting straps utilize a proprietary blend of heavy-duty cotton and industrial-grade elastic. Reinforced with double-stitched seams, they provide unbreakable support during your heaviest PR attempts.
                  </p>
                </div>
                <div>
                  <h3 className="text-zinc-900 text-lg md:text-xl font-bold m-0 mb-2 uppercase tracking-wide">
                    Precision Manufacturing
                  </h3>
                  <p className="m-0">
                    Every Favior product undergoes rigorous stress testing. From the leak-proof seals on our lids to the velcro longevity on our wraps, we examine every micro-detail before it reaches your gym bag.
                  </p>
                </div>
              </div>
            </div>

            {/* Image Grid Box */}
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3 md:gap-4 order-1 lg:order-2">
              <div className="flex flex-col gap-3 md:gap-4 pt-6 md:pt-12">
                <div className="relative h-40 sm:h-56 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden group">
                  <Image src="/favior_shaker_white.png" alt="Stainless Steel Shaker" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="relative h-40 sm:h-56 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-100 group">
                   <Image src="/favior_wristwrap_white.png" alt="Wrist Wraps Material" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Sustainability Banner */}
        <section className="bg-zinc-50 px-6 md:px-12 py-16 md:py-24 mt-8 md:mt-12">
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-6 md:gap-8">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto text-zinc-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <h2 className="m-0 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Built to Last. Built to Lessen.
            </h2>
            <p className="m-0 text-base sm:text-lg md:text-xl text-zinc-600 leading-relaxed">
              The most sustainable product is the one you don't have to replace. By engineering gear that survives years of heavy use, we're reducing the cycle of disposable plastic and cheap accessories ending up in landfills. Quality is our commitment to you and the environment.
            </p>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
