"use client";

import React, { useState, useEffect, useRef } from "react";

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    style={{ width: 16, height: 16 }}
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
    style={{ width: 16, height: 16 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
    />
  </svg>
);

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 20) {
        // At top of page: reset to full double-tier navbar
        setIsVisible(true);
        setIsScrolled(false);
      } else if (currentScrollY > 140) {
        // Scrolled down past header height: compact state
        setIsScrolled(true);

        if (diff > 8) {
          // Scrolling down with threshold -> hide navbar
          setIsVisible(false);
        } else if (diff < -8) {
          // Scrolling up with threshold -> reveal compact navbar
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScroll);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`aesop-header ${
        isScrolled ? "is-scrolled" : ""
      } ${isVisible ? "nav-visible" : "nav-hidden"}`}
    >
        {!isScrolled ? (
          /* ── Full Double-Tier Header (Top of Page) ── */
          <>
            {/* Top Tier */}
            <div className="aesop-nav-top">
              <div className="nav-left">
                <a href="/stores">Stores</a>
                <a href="/support">Customer service</a>
              </div>

              <a
                href="/"
                className="nav-logo-centered"
                style={{ fontSize: "40px", fontWeight: 500, letterSpacing: "0.14em" }}
              >
                Favior.
              </a>

              <div className="nav-right">
                <a href="/newsletter">Email sign up</a>
                <a href="/account">Account</a>
                <a href="/cart" className="nav-cart-link">
                  My cart (0)
                </a>
              </div>
            </div>

            {/* Bottom Tier */}
            <div className="aesop-nav-bottom">
              <ul className="nav-category-links">
                <li><a href="/shakers">Shakers</a></li>
                <li><a href="/wristbands">Wrist Wraps</a></li>
                <li><a href="/accessories">Accessories</a></li>
                <li><a href="/bundles">Bundles</a></li>
                <li><a href="/about">About</a></li>
              </ul>

              <div className="nav-search-wrap">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search..."
                  className="nav-search-input"
                />
              </div>
            </div>
          </>
        ) : (
          /* ── Compact Single-Line Bar (Scrolled Up State) ── */
          <div className="aesop-nav-compact">
            {/* Left: Logo */}
            <a href="/" className="nav-logo-compact">
              Favior.
            </a>

            {/* Middle: Category Links */}
            <ul className="nav-category-links-compact">
              <li><a href="/shakers">Shakers</a></li>
              <li><a href="/wristbands">Wrist Wraps</a></li>
              <li><a href="/accessories">Accessories</a></li>
              <li><a href="/bundles">Bundles</a></li>
              <li><a href="/about">About</a></li>
            </ul>

            {/* Right: Search Icon + Cart Icon Badge (0) */}
            <div className="nav-compact-right">
              <button className="nav-icon-btn" aria-label="Search">
                <SearchIcon />
              </button>
              <a href="/cart" className="nav-cart-badge" aria-label="View Cart">
                <BagIcon />
                <span className="cart-count">0</span>
              </a>
            </div>
          </div>
        )}
      </header>
  );
}
