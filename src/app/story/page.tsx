import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

export default function StoryPage() {
  return (
    <div className="bg-white text-zinc-900 font-sans overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      <main style={{ paddingTop: "6rem", paddingBottom: "4rem" }}>
        {/* Hero Section */}
        <section 
          style={{ 
            position: "relative", 
            padding: "4rem 1.5rem", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            textAlign: "center", 
            overflow: "hidden",
            minHeight: "40vh"
          }}
        >
          {/* We keep the basic Tailwind classes for purely visual gradients/colors if they work, 
              but layout is purely inline CSS. */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-100 via-white to-white opacity-80"></div>
          
          <div style={{ maxWidth: "56rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h1 style={{ margin: 0, fontSize: "clamp(2.5rem, 5vw + 1rem, 4.5rem)", fontWeight: 800, textTransform: "uppercase", lineHeight: 1 }}>
              Crafted for <br style={{ display: "block" }} />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500">
                The Dedicated
              </span>
            </h1>
            <p style={{ maxWidth: "42rem", margin: "0 auto", fontSize: "clamp(1rem, 2vw + 0.5rem, 1.25rem)", color: "#52525b", lineHeight: 1.6 }}>
              Favior isn't just about premium gym accessories. It's a testament to the relentless pursuit of excellence, born out of a simple need for gear that works as hard as you do.
            </p>
          </div>
        </section>

        {/* The Beginning */}
        <section style={{ padding: "4rem 1.5rem" }}>
          <div style={{ 
            maxWidth: "80rem", 
            margin: "0 auto", 
            display: "flex", 
            flexWrap: "wrap", 
            alignItems: "center", 
            gap: "3rem" 
          }}>
            {/* Image Box - Intrinsic Responsive Flex */}
            <div style={{ 
              flex: "1 1 400px", 
              minWidth: 0, 
              position: "relative", 
              height: "clamp(300px, 40vw, 500px)", 
              borderRadius: "1.5rem", 
              overflow: "hidden" 
            }}>
              <div className="absolute inset-0 bg-black/5 z-10 transition-colors hover:bg-transparent"></div>
              <Image 
                src="/favior_shaker_white.png" 
                alt="Favior Shaker" 
                fill 
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            
            {/* Text Box - Intrinsic Responsive Flex */}
            <div style={{ 
              flex: "1 1 400px", 
              minWidth: 0, 
              display: "flex", 
              flexDirection: "column", 
              gap: "1.5rem" 
            }}>
              <div>
                <span style={{ 
                  display: "inline-block", 
                  padding: "0.375rem 1rem", 
                  borderRadius: "9999px", 
                  backgroundColor: "#f4f4f5", 
                  fontSize: "0.75rem", 
                  fontWeight: 600, 
                  letterSpacing: "0.05em", 
                  textTransform: "uppercase", 
                  color: "#52525b" 
                }}>
                  Our Genesis
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Born From Frustration
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", color: "#52525b", fontSize: "clamp(1rem, 1.5vw, 1.125rem)", lineHeight: 1.6 }}>
                <p style={{ margin: 0 }}>
                  It started with a cracked shaker and a torn wrist wrap. Like many of you, we were tired of replacing our gym essentials every few months. The market was flooded with cheap, unreliable products that couldn't withstand the rigors of serious training.
                </p>
                <p style={{ margin: 0 }}>
                  So, we decided to change that. We spent over a year sourcing the best materials, testing countless prototypes, and working with professional athletes to create the ultimate training tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission (Dark Section) */}
        <section style={{ 
          marginTop: "2rem", 
          backgroundColor: "#000", 
          color: "#fff", 
          padding: "5rem 1.5rem", 
          position: "relative", 
          overflow: "hidden" 
        }}>
          {/* Subtle background glow */}
          <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "300px", backgroundColor: "#27272a", borderRadius: "9999px", filter: "blur(100px)", opacity: 0.3, transform: "translate(50%, -50%)" }}></div>
          
          <div style={{ maxWidth: "56rem", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: "2rem" }}>
            <h2 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
              Our Mission
            </h2>
            <p style={{ margin: 0, fontSize: "clamp(1.125rem, 2vw, 1.5rem)", color: "#d4d4d8", lineHeight: 1.5, fontWeight: 300 }}>
              "To engineer uncompromising, premium training equipment that empowers athletes to push beyond their limits."
            </p>
            
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "2rem", 
              paddingTop: "2rem", 
              justifyContent: "center" 
            }}>
              {/* Mission Item 1 */}
              <div style={{ flex: "1 1 250px", minWidth: 0, display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: "3rem", height: "3rem", borderRadius: "9999px", backgroundColor: "#27272a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "1.5rem", height: "1.5rem" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655 9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457 3 3m5.457 5.457 7.086 7.086m0 0L21 21" />
                  </svg>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.125rem", margin: 0 }}>Performance</h3>
                <p style={{ color: "#a1a1aa", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>Engineered for maximum utility and durability in high-intensity environments.</p>
              </div>
              
              {/* Mission Item 2 */}
              <div style={{ flex: "1 1 250px", minWidth: 0, display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: "3rem", height: "3rem", borderRadius: "9999px", backgroundColor: "#27272a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "1.5rem", height: "1.5rem" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.125rem", margin: 0 }}>Design</h3>
                <p style={{ color: "#a1a1aa", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>Minimalist, aesthetic, and functional. We believe your gear should look as good as it performs.</p>
              </div>
              
              {/* Mission Item 3 */}
              <div style={{ flex: "1 1 250px", minWidth: 0, display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: "3rem", height: "3rem", borderRadius: "9999px", backgroundColor: "#27272a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "1.5rem", height: "1.5rem" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                  </svg>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.125rem", margin: 0 }}>Community</h3>
                <p style={{ color: "#a1a1aa", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>Building a collective of dedicated individuals who demand the best from themselves and their equipment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Future */}
        <section style={{ padding: "5rem 1.5rem" }}>
          <div style={{ 
            maxWidth: "80rem", 
            margin: "0 auto", 
            display: "flex", 
            flexWrap: "wrap", 
            alignItems: "center", 
            gap: "3rem" 
          }}>
            {/* Text Box */}
            <div style={{ flex: "1 1 400px", minWidth: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Looking Ahead
              </h2>
              <p style={{ margin: 0, color: "#52525b", fontSize: "clamp(1rem, 1.5vw, 1.125rem)", lineHeight: 1.6 }}>
                We're just getting started. Favior is constantly evolving, exploring new materials, and designing new products to complete your training arsenal. We listen to our community, refine our designs, and never settle for "good enough".
              </p>
              <div style={{ marginTop: "1rem" }}>
                <Link 
                  href="/products" 
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "1rem 2rem", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", backgroundColor: "#000", borderRadius: "9999px", textDecoration: "none" }}
                >
                  Explore The Collection
                </Link>
              </div>
            </div>
            
            {/* Images Box */}
            <div style={{ flex: "1 1 400px", minWidth: 0, display: "flex", gap: "1rem" }}>
              <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ position: "relative", height: "clamp(150px, 25vw, 250px)", borderRadius: "1rem", overflow: "hidden" }}>
                  <Image src="/favior_wristwrap_white.png" alt="Wrist Wrap" fill style={{ objectFit: "cover" }} />
                </div>
                <div style={{ position: "relative", height: "clamp(100px, 15vw, 150px)", borderRadius: "1rem", overflow: "hidden", backgroundColor: "#f4f4f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#a1a1aa", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.75rem" }}>
                    Premium
                  </span>
                </div>
              </div>
              <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "2rem" }}>
                <div style={{ position: "relative", height: "clamp(100px, 15vw, 150px)", borderRadius: "1rem", overflow: "hidden", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.75rem" }}>
                    Crafted
                  </span>
                </div>
                <div style={{ position: "relative", height: "clamp(150px, 25vw, 250px)", borderRadius: "1rem", overflow: "hidden" }}>
                  <Image src="/favior_kit_white.png" alt="Kit" fill style={{ objectFit: "cover" }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
