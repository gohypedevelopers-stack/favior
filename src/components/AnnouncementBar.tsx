"use client";

import React, { useState, useEffect } from "react";

const announcements = [
  "FREE SHIPPING ON ORDERS OVER ₹1,999",
  "NEW ARRIVALS: SHAKER & WRIST WRAP COLLECTION NOW LIVE",
  "100% PREMIUM QUALITY · EASY 7-DAY REPLACEMENTS",
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div
      className="announcement-bar"
      role="region"
      aria-label="Announcement"
      onClick={handleNext}
      style={{ cursor: "pointer" }}
    >
      <div className="announcement-container">
        <div className="announcement-content-wrap">
          {announcements.map((text, idx) => (
            <p
              key={text}
              className={`announcement-text ${idx === currentIndex ? "active" : ""}`}
              aria-hidden={idx !== currentIndex}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
