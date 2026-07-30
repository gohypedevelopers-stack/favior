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

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    style={{ width: 18, height: 18 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
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
        setIsVisible(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);

        if (diff > 8 && currentScrollY > 100) {
          setIsVisible(false);
        } else if (diff < -8) {
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
      <div className="aesop-nav-top">
        {/* Left: Category Links */}
        <div className="nav-left">
          <ul className="nav-category-links">
            <li><a href="/shakers">Shakers</a></li>
            <li><a href="/wristbands">Wrist Wraps</a></li>
            <li><a href="/accessories">Accessories</a></li>
            <li><a href="/bundles">Bundles</a></li>
          </ul>
        </div>

        <a
          href="/"
          className="nav-logo-centered flex items-center justify-center"
        >
          <img
            src="/FAVIOR BLACK LOGO.png"
            alt="Favior Logo"
            className="h-7 w-auto object-contain"
          />
        </a>

        {/* Right: Search, Account Icon, Cart Icon */}
        <div className="nav-right">
          <div className="nav-search-wrap">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search..."
              className="nav-search-input"
            />
          </div>
          <span className="nav-divider" />
          <a href="/account" className="nav-icon-link" aria-label="Account" title="Account">
            <UserIcon />
          </a>
          <a href="/cart" className="nav-cart-badge" aria-label="View Cart" title="View Cart">
            <BagIcon />
            <span className="cart-count">0</span>
          </a>
        </div>
      </div>
    </header>
  );
}
