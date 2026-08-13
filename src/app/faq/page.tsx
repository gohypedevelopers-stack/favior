"use client";

import React, { useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { Plus, Minus, Search, ChevronRight } from "lucide-react";

const faqCategories = [
  "All",
  "Orders & Shipping",
  "Returns & Exchanges",
  "Product & Sizing",
  "Account & Payment"
];

const faqs = [
  {
    category: "Orders & Shipping",
    q: "How long does shipping take?",
    a: "Standard shipping typically takes 3-5 business days within India. Express shipping is available at checkout for 1-2 day delivery. International shipping times vary between 7-14 business days depending on the destination."
  },
  {
    category: "Orders & Shipping",
    q: "How can I track my order?",
    a: "Once your order has been dispatched, you will receive an email containing your tracking number and a link to track the progress of your shipment."
  },
  {
    category: "Orders & Shipping",
    q: "Do you ship internationally?",
    a: "Yes, we ship to most countries worldwide. International shipping rates and delivery times will be calculated at checkout based on your location."
  },
  {
    category: "Returns & Exchanges",
    q: "What is your return policy?",
    a: "We offer a 7-day hassle-free return or exchange on all unused items in their original packaging. Please ensure tags are intact. Contact our support team to initiate a return."
  },
  {
    category: "Returns & Exchanges",
    q: "How do I start a return or exchange?",
    a: "To start a return or exchange, navigate to our Returns Portal, enter your order number and email address, and follow the instructions to generate a shipping label."
  },
  {
    category: "Product & Sizing",
    q: "How do I choose the right size?",
    a: "We provide detailed sizing charts on every product page. We recommend taking your measurements and comparing them to our size guide for the best fit."
  },
  {
    category: "Product & Sizing",
    q: "What materials are your products made from?",
    a: "Our products are crafted using premium materials, including heavy-duty cotton-elastic blends for accessories and specialized performance fabrics for apparel. Specific material compositions are listed on each product page."
  },
  {
    category: "Account & Payment",
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards, UPI, Net Banking, and select digital wallets. All transactions are securely encrypted."
  }
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="faq-page-container" style={{ minHeight: '100vh', backgroundColor: '#FDFDFC', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans, sans-serif)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        #faq-page-container .aesop-header {
          background-color: #ffffff !important;
          border-bottom: 1px solid #e5e5e5 !important;
        }
        .faq-layout {
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding: 32px 16px;
          flex: 1;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .faq-sidebar {
          width: 100%;
          flex-shrink: 0;
        }
        .faq-sidebar-inner {
          position: relative;
        }
        .faq-sidebar-list {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
          white-space: nowrap;
          padding-bottom: 8px;
          gap: 8px;
          /* Hide scrollbar for a cleaner look */
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .faq-sidebar-list::-webkit-scrollbar {
          display: none;
        }
        .faq-sidebar-list li {
          flex: 0 0 auto;
        }
        .faq-content-area {
          width: 100%;
        }
        @media (min-width: 768px) {
          .faq-layout {
            flex-direction: row;
            gap: 64px;
            padding: 64px 24px;
            align-items: flex-start;
          }
          .faq-sidebar {
            width: 100%;
            max-width: 280px;
          }
          .faq-sidebar-inner {
            position: sticky;
            top: 100px;
          }
          .faq-sidebar-list {
            flex-direction: column;
            overflow-x: visible;
            white-space: normal;
          }
          .faq-sidebar-list li {
            flex: 1 1 auto;
          }
          .faq-content-area {
            flex: 1;
            min-width: 300px;
          }
        }
      `}} />
      <AnnouncementBar />
      <Navbar />
      
      {/* ── Main Content Wrapper ── */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 1 }}>
        
        {/* ── Page Header ── */}
        <div style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', letterSpacing: '-0.02em', marginBottom: '24px', fontFamily: 'var(--font-heading, sans-serif)' }}>
          HOW CAN WE HELP?
        </h1>
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search for answers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.2)', 
              color: '#fff', 
              padding: '16px 24px 16px 56px', 
              borderRadius: '9999px', 
              outline: 'none',
              fontSize: '1rem'
            }}
          />
          <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)' }}>
            <Search size={20} />
          </div>
        </div>
      </div>

      {/* ── FAQ Content ── */}
      <div className="faq-layout">
        
        {/* Sidebar / Categories */}
        <div className="faq-sidebar">
          <div className="faq-sidebar-inner">
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '16px' }}>
              Categories
            </h3>
            <ul className="faq-sidebar-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {faqCategories.map(category => {
                const isActive = activeCategory === category;
                return (
                  <li key={category}>
                    <button
                      onClick={() => {
                        setActiveCategory(category);
                        setOpenIndex(null);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderLeft: isActive ? '2px solid #000' : '2px solid transparent',
                        backgroundColor: isActive ? '#f9fafb' : 'transparent',
                        color: isActive ? '#000' : '#4b5563',
                        fontWeight: isActive ? 600 : 400,
                        cursor: 'pointer',
                        borderTop: 'none',
                        borderRight: 'none',
                        borderBottom: 'none'
                      }}
                    >
                      {category}
                      {isActive && <ChevronRight size={16} />}
                    </button>
                  </li>
                );
              })}
            </ul>
            
            <div style={{ marginTop: '48px', padding: '24px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px' }}>Still have questions?</h4>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '16px', lineHeight: 1.5 }}>
                Can't find the answer you're looking for? Our team is here to help.
              </p>
              <a href="/contact" style={{ display: 'inline-block', fontSize: '0.875rem', fontWeight: 600, color: '#000', textDecoration: 'none', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="faq-content-area">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '32px', fontFamily: 'var(--font-heading, sans-serif)' }}>
            {activeCategory === "All" ? "Frequently Asked Questions" : activeCategory}
          </h2>
          
          {filteredFaqs.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: '#6b7280' }}>
              <p>No results found for "{searchQuery}".</p>
              <button 
                onClick={() => setSearchQuery("")}
                style={{ marginTop: '16px', color: '#000', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {filteredFaqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <div 
                    key={i} 
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#fff',
                      transition: 'all 0.3s',
                      boxShadow: isOpen ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none'
                    }}
                  >
                    <button
                      style={{
                        width: '100%',
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: isOpen ? '#000' : '#1f2937'
                      }}
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                    >
                      <span style={{ fontWeight: 600, fontSize: '1rem', paddingRight: '32px' }}>
                        {faq.q}
                      </span>
                      <span style={{ 
                        flexShrink: 0, 
                        width: '32px', 
                        height: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        borderRadius: '50%', 
                        backgroundColor: '#f9fafb', 
                        color: '#000' 
                      }}>
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
                    </button>
                    <div 
                      style={{
                        padding: isOpen ? '0 24px 24px 24px' : '0 24px',
                        maxHeight: isOpen ? '500px' : '0',
                        opacity: isOpen ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      <p style={{ color: '#4b5563', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      </div>
      <SiteFooter />
    </div>
  );
}
