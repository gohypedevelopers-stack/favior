"use client";

import React, { useState } from "react";

const faqs = [
  {
    q: "What materials are Favior wrist wraps made from?",
    a: "Our wrist wraps are crafted from a premium heavy-duty cotton-elastic blend with reinforced stitching and a secure thumb loop — engineered for competition-grade joint support across all pressing movements.",
  },
  {
    q: "Can I order a product that is currently out of stock?",
    a: "Yes — you can join the waitlist on any sold-out product page and we'll notify you the moment it's back. We restock in limited drops so signing up early is the best way to secure yours.",
  },
  {
    q: "What is the return & exchange policy?",
    a: "We offer a 7-day hassle-free return or exchange on all unused items in original packaging. Simply contact our support team and we'll arrange a pickup at no extra cost.",
  },
  {
    q: "Do you ship across India and internationally?",
    a: "We ship pan-India with free delivery on orders over ₹1,999. International shipping is currently available to select countries — check our shipping page for the full list and estimated delivery times.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="faq-section">
      {/* Giant Centered Background Watermark */}
      <div className="faq-bg-watermark" aria-hidden="true">
        FAQS
      </div>

      <div className="faq-inner">
        <h2 className="faq-main-heading">NEED HELP?</h2>

        <div className="faq-list">
          {faqs.map((item, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? "open" : ""}`}>
              <button
                className="faq-question"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span>{item.q}</span>
                <span className="faq-icon-box">{openIndex === i ? "−" : "+"}</span>
              </button>
              <div className="faq-answer-wrap">
                <p className="faq-answer">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
