"use client";

import Link from "next/link";
import Model3D from "@/components/Model3D";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      {/* ── Main Grid ── */}
      <div className="sf-grid">

        {/* Col 1 — Brand */}
        <div className="sf-brand">
          <img
            src="/FAVIOR BLACK LOGO.png"
            alt="Favior Logo"
            className="sf-logo-img"
          />
          <p className="sf-tagline">
            ELEVATED ESSENTIALS,<br />
            THOUGHTFULLY DESIGNED FOR<br />
            FAVIOR.
          </p>
        </div>

        {/* Col 2 — Follow Us */}
        <div className="sf-col">
          <h4 className="sf-col-heading">FOLLOW US</h4>
          <ul className="sf-col-list">
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">INSTAGRAM</a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FACEBOOK</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YOUTUBE</a></li>
          </ul>
        </div>

        {/* Col 3 — Support */}
        <div className="sf-col">
          <h4 className="sf-col-heading">SUPPORT</h4>
          <ul className="sf-col-list">
            <li><Link href="/shipping">SHIPPING &amp; DELIVERY</Link></li>
            <li><Link href="/returns">EXCHANGE &amp; RETURNS</Link></li>
            <li><Link href="/faq">FREQUENTLY ASKED QUESTIONS</Link></li>
            <li><Link href="/contact">CONTACT US</Link></li>
          </ul>
        </div>

        {/* Col 4 — Company */}
        <div className="sf-col">
          <h4 className="sf-col-heading">COMPANY</h4>
          <ul className="sf-col-list">
            <li><Link href="/about">OUR STORY</Link></li>
            <li><Link href="/sustainability">MATERIALS &amp; CRAFT</Link></li>
            <li><Link href="/faq">SIZE GUIDE</Link></li>
          </ul>
        </div>

        {/* Col 5 — 3D Model */}
        <div className="sf-model-wrap">
          <Model3D
            src="/3d model/Untitled.glb"
            alt="Favior shopping bag 3D model"
            loading="lazy"
          />
        </div>

      </div>

      {/* ── Bottom Bar ── */}
      <div className="sf-bottom">
        <p>© 2026 FAVIOR. ALL RIGHTS RESERVED.</p>
        <p className="sf-bottom-tagline">MODERN UTILITY · MADE FOR FAVIOR</p>
      </div>
    </footer>
  );
}
