"use client";

import React, { useState, useEffect } from "react";
import { Star, Check, X, ThumbsUp } from "lucide-react";
import type { Review } from "@/types/product";

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Arjun M.",
    rating: 5,
    title: "Masterpiece In Design",
    body: "The tortoiseshell color is beautiful in person. The quality of this frame is unlike anything else—lightweight but holds its structure nicely. The fit is perfect and comfortable.",
    date: "July 12, 2026",
    verified: true,
    helpfulCount: 14,
  },
  {
    id: "rev-2",
    name: "Priya S.",
    rating: 5,
    title: "Immaculate Craftsmanship",
    body: "Immaculate craftsmanship. The frame profile is really clean and fits nicely without putting pressure behind the ears. Perfect for styling with formal or casual looks.",
    date: "July 08, 2026",
    verified: true,
    helpfulCount: 9,
  },
  {
    id: "rev-3",
    name: "Rahul K.",
    rating: 4,
    title: "Very Premium Feel",
    body: "Hands down the best piece of gear I own. The materials feel extremely premium and polished, perfectly engineered and durable. Highly recommend Favior.",
    date: "June 28, 2026",
    verified: true,
    helpfulCount: 5,
  },
  {
    id: "rev-4",
    name: "Devina K.",
    rating: 5,
    title: "Unmatched Longevity & Style",
    body: "Exceeded all expectations. The finish is stunning, lightweight yet rock solid. It holds temperature all day and feels incredible to use.",
    date: "June 15, 2026",
    verified: true,
    helpfulCount: 8,
  },
  {
    id: "rev-5",
    name: "Vikram R.",
    rating: 5,
    title: "Worth Every Rupee",
    body: "The tactile grip and precision feel are outstanding. It has completely replaced all my previous shaker bottles and wraps.",
    date: "June 02, 2026",
    verified: true,
    helpfulCount: 4,
  },
];

export function ProductReviews({
  productSlug,
  className,
}: {
  productSlug: string;
  className?: string;
}) {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Submit Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formError, setFormError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const key = `reviews_${productSlug}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setReviews([...parsed, ...INITIAL_REVIEWS]);
        }
      } catch {
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
    }
  }, [productSlug]);

  const saveReviewsToStorage = (updatedReviews: Review[]) => {
    const key = `reviews_${productSlug}`;
    const userReviews = updatedReviews.filter((r) => r.id.startsWith("user-"));
    localStorage.setItem(key, JSON.stringify(userReviews));
  };

  const totalCount = reviews.length;
  const averageRating =
    totalCount > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1))
      : 4.8;

  const ratingDistribution = [
    { stars: 5, percentage: 80 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 0 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ];

  const handleHelpfulClick = (id: string) => {
    const nextReviews = reviews.map((r) => {
      if (r.id === id) {
        return r.hasVoted
          ? { ...r, helpfulCount: r.helpfulCount - 1, hasVoted: false }
          : { ...r, helpfulCount: r.helpfulCount + 1, hasVoted: true };
      }
      return r;
    });
    setReviews(nextReviews);
    saveReviewsToStorage(nextReviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !title.trim() || !body.trim()) {
      setFormError("Please fill out all required fields.");
      return;
    }

    const newReview: Review = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      rating,
      title: title.trim(),
      body: body.trim(),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      verified: true,
      helpfulCount: 0,
    };

    const nextReviews = [newReview, ...reviews];
    setReviews(nextReviews);
    saveReviewsToStorage(nextReviews);

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
      setName("");
      setEmail("");
      setRating(5);
      setTitle("");
      setBody("");
      setFormError("");
    }, 1600);
  };

  return (
    <section
      id="reviews"
      className={className}
      style={{
        width: "100%",
        backgroundColor: "transparent",
        color: "#111111",
        padding: "80px 0",
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Contained Centered Wrapper with Generous Margins */}
      <div
        style={{
          width: "100%",
          maxWidth: "1160px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "32px",
          paddingRight: "32px",
          boxSizing: "border-box",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                color: "#111111",
                margin: "0 0 10px 0",
                lineHeight: "1.1",
              }}
            >
              CUSTOMER REVIEWS
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                {[1, 2, 3, 4].map((star) => (
                  <Star
                    key={star}
                    style={{
                      width: "16px",
                      height: "16px",
                      fill: "#111111",
                      color: "#111111",
                    }}
                  />
                ))}
                {/* 5th partial star */}
                <div
                  style={{
                    position: "relative",
                    width: "16px",
                    height: "16px",
                  }}
                >
                  <Star
                    style={{
                      width: "16px",
                      height: "16px",
                      color: "rgba(0,0,0,0.2)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "80%",
                      overflow: "hidden",
                    }}
                  >
                    <Star
                      style={{
                        width: "16px",
                        height: "16px",
                        fill: "#111111",
                        color: "#111111",
                      }}
                    />
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  letterSpacing: "0.08em",
                  color: "#333333",
                  textTransform: "uppercase",
                }}
              >
                {averageRating} OUT OF 5 ({totalCount} REVIEWS)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: "#000000",
              color: "#FFFFFF",
              border: "none",
              padding: "13px 30px",
              fontSize: "11px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              cursor: "pointer",
              borderRadius: "0px",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            WRITE A REVIEW
          </button>
        </div>

        {/* Divider Line */}
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            margin: "36px 0 54px 0",
          }}
        />

        {/* 2-Column Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "54px",
            alignItems: "start",
          }}
          className="clarte-reviews-grid"
        >
          {/* Left Column: Rating Breakdown & Fit Profile */}
          <div
            style={{
              maxWidth: "300px",
              width: "100%",
            }}
          >
            <h3
              style={{
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#111111",
                margin: "0 0 20px 0",
              }}
            >
              RATING BREAKDOWN
            </h3>

            {/* Stars Breakdown Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {ratingDistribution.map((dist) => (
                <div
                  key={dist.stars}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      width: "36px",
                      fontWeight: "500",
                      color: "#111111",
                    }}
                  >
                    <span>{dist.stars}</span>
                    <Star
                      style={{
                        width: "12px",
                        height: "12px",
                        fill: "#111111",
                        color: "#111111",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: "6px",
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                      borderRadius: "999px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        width: `${dist.percentage}%`,
                        backgroundColor: "#000000",
                        borderRadius: "999px",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      width: "36px",
                      textAlign: "right",
                      fontSize: "11px",
                      fontWeight: "500",
                      color: "rgba(0,0,0,0.55)",
                    }}
                  >
                    {dist.percentage}%
                  </span>
                </div>
              ))}
            </div>

            {/* Fit Profile Box */}
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.035)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                padding: "24px",
                marginTop: "36px",
                borderRadius: "2px",
              }}
            >
              <h4
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#111111",
                  margin: "0 0 10px 0",
                }}
              >
                FIT PROFILE
              </h4>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: "400",
                  lineHeight: "1.7",
                  color: "rgba(0,0,0,0.6)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  margin: 0,
                }}
              >
                BASED ON CUSTOMER FEEDBACK, THIS PRODUCT FITS TRUE TO SIZE. 94%
                RECOMMEND GOING WITH YOUR USUAL SIZE.
              </p>
            </div>
          </div>

          {/* Right Column: Reviews List */}
          <div style={{ flex: 1, minWidth: "0" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              {reviews.slice(0, showAll ? reviews.length : 3).map((review, idx) => (
                <div
                  key={review.id}
                  style={{
                    paddingTop: idx > 0 ? "40px" : "0",
                    borderTop: idx > 0 ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
                  }}
                >
                  {/* Header Row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            style={{
                              width: "14px",
                              height: "14px",
                              fill: star <= review.rating ? "#111111" : "none",
                              color:
                                star <= review.rating
                                  ? "#111111"
                                  : "rgba(0,0,0,0.18)",
                            }}
                          />
                        ))}
                      </div>
                      {review.verified && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#4B6F44",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          <Check
                            style={{ width: "12px", height: "12px", strokeWidth: 3 }}
                          />
                          VERIFIED BUYER
                        </span>
                      )}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#111111",
                          margin: 0,
                          textTransform: "none",
                        }}
                      >
                        {review.name}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "rgba(0,0,0,0.45)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          margin: "2px 0 0 0",
                        }}
                      >
                        {review.date}
                      </p>
                    </div>
                  </div>

                  {/* Review Title */}
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                      color: "#111111",
                      margin: "12px 0 8px 0",
                    }}
                  >
                    {review.title}
                  </h4>

                  {/* Review Body */}
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "1.75",
                      color: "rgba(0,0,0,0.72)",
                      textTransform: "none",
                      letterSpacing: "normal",
                      margin: "0 0 14px 0",
                      maxWidth: "680px",
                    }}
                  >
                    {review.body}
                  </p>

                  {/* Helpful Button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => handleHelpfulClick(review.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        borderRadius: "9999px",
                        border: review.hasVoted
                          ? "1px solid #000000"
                          : "1px solid rgba(0,0,0,0.18)",
                        backgroundColor: review.hasVoted ? "#000000" : "transparent",
                        color: review.hasVoted ? "#FFFFFF" : "rgba(0,0,0,0.65)",
                        fontSize: "11px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <ThumbsUp style={{ width: "12px", height: "12px" }} />
                      <span>HELPFUL ({review.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              ))}

              {reviews.length > 3 && (
                <div style={{ paddingTop: "20px" }}>
                  <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    style={{
                      border: "1px solid rgba(0,0,0,0.3)",
                      backgroundColor: "transparent",
                      padding: "10px 24px",
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      cursor: "pointer",
                      color: "#111111",
                      transition: "border-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#000000")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(0,0,0,0.3)")
                    }
                  >
                    {showAll ? "SHOW LESS" : `VIEW ALL REVIEWS (${reviews.length})`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            padding: "16px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "520px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #111111",
              padding: "32px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "absolute",
                right: "16px",
                top: "16px",
                background: "none",
                border: "none",
                color: "rgba(0,0,0,0.5)",
                cursor: "pointer",
                padding: "8px",
              }}
            >
              <X style={{ width: "20px", height: "20px" }} />
            </button>

            {isSubmitted ? (
              <div style={{ padding: "48px 0", textAlign: "center" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "999px",
                    backgroundColor: "#000000",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto",
                  }}
                >
                  <Check style={{ width: "24px", height: "24px", strokeWidth: 3 }} />
                </div>
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    margin: "0 0 8px 0",
                  }}
                >
                  Thank You
                </h3>
                <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.6)", margin: 0 }}>
                  Your review has been submitted and verified.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "18px" }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      margin: "0 0 4px 0",
                    }}
                  >
                    Write A Review
                  </h3>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "rgba(0,0,0,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: 0,
                    }}
                  >
                    Share your experience with this product
                  </p>
                </div>

                {formError && (
                  <div
                    style={{
                      backgroundColor: "#FEF2F2",
                      border: "1px solid #FECACA",
                      color: "#B91C1C",
                      fontSize: "12px",
                      padding: "10px",
                    }}
                  >
                    {formError}
                  </div>
                )}

                {/* Rating Input */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#333333",
                      marginBottom: "6px",
                    }}
                  >
                    Your Rating *
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px",
                        }}
                      >
                        <Star
                          style={{
                            width: "24px",
                            height: "24px",
                            fill:
                              (hoverRating !== null
                                ? hoverRating >= star
                                : rating >= star)
                                ? "#000000"
                                : "none",
                            color:
                              (hoverRating !== null
                                ? hoverRating >= star
                                : rating >= star)
                                ? "#000000"
                                : "rgba(0,0,0,0.2)",
                            transition: "all 0.15s ease",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#333333",
                      marginBottom: "6px",
                    }}
                  >
                    Review Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masterpiece in design"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1px solid rgba(0,0,0,0.2)",
                      padding: "10px 14px",
                      fontSize: "13px",
                      boxSizing: "border-box",
                      outline: "none",
                      textTransform: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#333333",
                      marginBottom: "6px",
                    }}
                  >
                    Review Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the build quality, materials, and overall utility..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1px solid rgba(0,0,0,0.2)",
                      padding: "10px 14px",
                      fontSize: "13px",
                      boxSizing: "border-box",
                      outline: "none",
                      textTransform: "none",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#333333",
                        marginBottom: "6px",
                      }}
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arjun M."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: "100%",
                        border: "1px solid rgba(0,0,0,0.2)",
                        padding: "10px 14px",
                        fontSize: "13px",
                        boxSizing: "border-box",
                        outline: "none",
                        textTransform: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#333333",
                        marginBottom: "6px",
                      }}
                    >
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. arjun@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        border: "1px solid rgba(0,0,0,0.2)",
                        padding: "10px 14px",
                        fontSize: "13px",
                        boxSizing: "border-box",
                        outline: "none",
                        textTransform: "none",
                      }}
                    />
                  </div>
                </div>

                <div style={{ paddingTop: "6px" }}>
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      backgroundColor: "#000000",
                      color: "#FFFFFF",
                      border: "none",
                      padding: "14px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      cursor: "pointer",
                    }}
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Media Query for Large Screen 2-Column Lock */}
      <style jsx>{`
        @media (min-width: 860px) {
          .clarte-reviews-grid {
            grid-template-columns: 270px 1fr !important;
            gap: 72px !important;
          }
        }
      `}</style>
    </section>
  );
}
