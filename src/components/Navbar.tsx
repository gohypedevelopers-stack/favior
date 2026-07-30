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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <>
      <header
        className={`aesop-header ${
          isScrolled ? "is-scrolled" : ""
        } ${isVisible ? "nav-visible" : "nav-hidden"}`}
      >
        <div className="aesop-nav-top px-4 sm:px-10">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center p-1.5 text-zinc-900 lg:hidden cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>

          {/* Left: Category Links (Desktop) */}
          <div className="nav-left hidden lg:flex">
            <ul className="nav-category-links">
              <li><a href="/shakers">Shakers</a></li>
              <li><a href="/wristbands">Wrist Wraps</a></li>
              <li><a href="/accessories">Accessories</a></li>
              <li><a href="/bundles">Bundles</a></li>
            </ul>
          </div>

          {/* Logo Centered */}
          <a
            href="/"
            className="nav-logo-centered flex items-center justify-center"
          >
            <img
              src="/FAVIOR BLACK LOGO.png"
              alt="Favior Logo"
              className="h-5 sm:h-7 w-auto object-contain"
            />
          </a>

          {/* Right: Search, Account Icon, Cart Icon */}
          <div className="nav-right">
            <div className="nav-search-wrap hidden md:flex">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search..."
                className="nav-search-input"
              />
            </div>
            <span className="nav-divider hidden md:block" />
            <a href="/account" className="nav-icon-link hidden sm:flex" aria-label="Account" title="Account">
              <UserIcon />
            </a>
            <a href="/cart" className="nav-cart-badge" aria-label="View Cart" title="View Cart">
              <BagIcon />
              <span className="cart-count">0</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="relative w-[280px] max-w-[80vw] h-full bg-white p-6 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-zinc-200">
                <img
                  src="/FAVIOR BLACK LOGO.png"
                  alt="Favior Logo"
                  className="h-5 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-zinc-600 hover:text-black cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-4">
                <a href="/shakers" className="text-sm font-semibold uppercase tracking-wider text-zinc-900 hover:text-zinc-500">Shakers</a>
                <a href="/wristbands" className="text-sm font-semibold uppercase tracking-wider text-zinc-900 hover:text-zinc-500">Wrist Wraps</a>
                <a href="/accessories" className="text-sm font-semibold uppercase tracking-wider text-zinc-900 hover:text-zinc-500">Accessories</a>
                <a href="/bundles" className="text-sm font-semibold uppercase tracking-wider text-zinc-900 hover:text-zinc-500">Bundles</a>
                <a href="/account" className="text-sm font-semibold uppercase tracking-wider text-zinc-900 hover:text-zinc-500 pt-4 border-t border-zinc-100">Account</a>
              </nav>
            </div>

            <div className="pt-6 border-t border-zinc-200">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400">FAVIOR. ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
