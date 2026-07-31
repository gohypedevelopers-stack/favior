"use client";

import React, { useState, useEffect, useRef } from "react";

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-[16px] h-[16px] sm:w-[17px] sm:h-[17px]"
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
    className="w-[16px] h-[16px] sm:w-[17px] sm:h-[17px]"
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
    className="w-[16px] h-[16px] sm:w-[17px] sm:h-[17px]"
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
        <div className="aesop-nav-top">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-toggle flex items-center justify-center p-1 sm:p-2 text-zinc-900 lg:hidden cursor-pointer"
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

          {/* Left: Category Links (Desktop only) */}
          <div className="nav-left nav-desktop-left hidden lg:flex">
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
              className="h-4 sm:h-6 md:h-7 max-w-[95px] sm:max-w-none w-auto object-contain"
            />
          </a>

          {/* Right Section: Search Icon, Account Icon, Cart Icon */}
          <div className="nav-right flex items-center justify-end gap-1.5 sm:gap-4">
            {/* Search Icon & Expandable Bar */}
            <div className="relative flex items-center justify-center">
              {searchOpen ? (
                <div className="flex items-center gap-1 bg-zinc-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-zinc-200 text-xs">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Search..."
                    autoFocus
                    className="w-20 sm:w-36 bg-transparent outline-none text-zinc-900 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-zinc-400 hover:text-zinc-900 ml-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                  className="nav-icon-link flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 cursor-pointer text-zinc-900 hover:opacity-60 transition-opacity"
                  title="Search"
                >
                  <SearchIcon />
                </button>
              )}
            </div>

            <a
              href="/account"
              className="nav-icon-link flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-zinc-900 hover:opacity-60 transition-opacity"
              aria-label="Account"
              title="Account"
            >
              <UserIcon />
            </a>

            {/* Cart Icon: Only show count badge when cartCount > 0 */}
            <a
              href="/cart"
              className="nav-cart-badge flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-zinc-900 hover:opacity-60 transition-opacity relative"
              aria-label="View Cart"
              title="View Cart"
            >
              <BagIcon />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer - Matches exact evrydae.com inspect specs (24px 20px 32px) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <nav
            className="absolute left-0 top-0 flex h-full w-[85vw] max-w-[380px] flex-col justify-between gap-0 bg-white shadow-2xl overflow-y-auto"
            style={{
              paddingTop: "24px",
              paddingBottom: "32px",
              paddingLeft: "20px",
              paddingRight: "20px",
              boxSizing: "border-box"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Row 1: MENU Header with Close Button */}
              <div className="flex items-center justify-between h-[54px] border-b border-zinc-100">
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-zinc-600">
                  MENU
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-zinc-500 hover:text-black cursor-pointer transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Row 2: SEARCH Row */}
              <div className="border-b border-zinc-100">
                {searchOpen ? (
                  <div className="flex items-center justify-between h-[54px]">
                    <input
                      type="text"
                      placeholder="SEARCH..."
                      autoFocus
                      className="w-full bg-transparent text-[13px] font-medium uppercase tracking-[0.08em] text-zinc-900 outline-none placeholder:text-zinc-400"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="text-zinc-400 hover:text-black text-xs font-bold p-1 ml-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="w-full flex items-center justify-between h-[54px] text-[13px] font-medium uppercase tracking-[0.08em] text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                  >
                    <span>SEARCH</span>
                    <SearchIcon />
                  </button>
                )}
              </div>

              {/* Category Rows matching evrydae.com layout */}
              <div className="flex flex-col">
                <a
                  href="/shakers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between h-[54px] border-b border-zinc-100 text-[13px] font-medium uppercase tracking-[0.08em] text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  <span>SHAKERS</span>
                  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </a>
                <a
                  href="/wristbands"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between h-[54px] border-b border-zinc-100 text-[13px] font-medium uppercase tracking-[0.08em] text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  <span>WRIST WRAPS</span>
                  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </a>
                <a
                  href="/accessories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between h-[54px] border-b border-zinc-100 text-[13px] font-medium uppercase tracking-[0.08em] text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  <span>ACCESSORIES</span>
                  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </a>
                <a
                  href="/bundles"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between h-[54px] border-b border-zinc-100 text-[13px] font-medium uppercase tracking-[0.08em] text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  <span>BUNDLES</span>
                  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </a>
                <a
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between h-[54px] border-b border-zinc-100 text-[13px] font-medium uppercase tracking-[0.08em] text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  <span>MY ACCOUNT</span>
                  <UserIcon />
                </a>
              </div>
            </div>

            {/* Footer Brand Note */}
            <div className="py-4 border-t border-zinc-100 mt-auto">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 text-center">
                FAVIOR
              </p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
