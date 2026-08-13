import React from "react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", color: "#18181b", fontFamily: "var(--font-sans), sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="text-center md:text-left" style={{ flexGrow: 1, paddingTop: "4rem", paddingBottom: "6rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div style={{ 
          maxWidth: "80rem", 
          margin: "0 auto", 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "clamp(3rem, 6vw, 6rem)" 
        }}>
          
          {/* Left Column: Contact Info */}
          <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div className="text-center md:text-left">
              <h1 style={{ margin: "0 0 1rem 0", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
                Contact Us
              </h1>
              <p style={{ margin: 0, color: "#52525b", fontSize: "1.125rem", lineHeight: 1.6 }}>
                Questions about our products? Need help with an order? We're here to assist you. Fill out the form or reach out directly via email.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b" }}>
                  Customer Support
                </h3>
                <a href="mailto:support@favior.com" style={{ color: "#52525b", textDecoration: "none" }}>
                  support@favior.com
                </a>
              </div>
              
              <div>
                <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b" }}>
                  Wholesale & Partnerships
                </h3>
                <a href="mailto:partners@favior.com" style={{ color: "#52525b", textDecoration: "none" }}>
                  partners@favior.com
                </a>
              </div>
              
              <div>
                <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b" }}>
                  Business Hours
                </h3>
                <p style={{ margin: 0, color: "#52525b", lineHeight: 1.5 }}>
                  Monday - Friday <br />
                  9:00 AM - 6:00 PM (EST)
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="text-left" style={{ 
            flex: "2 1 450px", 
            minWidth: 0, 
            backgroundColor: "#fafafa", 
            padding: "clamp(2rem, 4vw, 3rem)", 
            borderRadius: "1.5rem" 
          }}>
            <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} action="#" method="POST">
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label htmlFor="first-name" style={{ fontSize: "0.875rem", fontWeight: 700, color: "#18181b", textTransform: "uppercase", letterSpacing: "0.025em" }}>First Name</label>
                  <input type="text" id="first-name" name="first-name" required style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#fff", border: "1px solid #e4e4e7", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "1rem", outline: "none" }} />
                </div>
                <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label htmlFor="last-name" style={{ fontSize: "0.875rem", fontWeight: 700, color: "#18181b", textTransform: "uppercase", letterSpacing: "0.025em" }}>Last Name</label>
                  <input type="text" id="last-name" name="last-name" required style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#fff", border: "1px solid #e4e4e7", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "1rem", outline: "none" }} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label htmlFor="email" style={{ fontSize: "0.875rem", fontWeight: 700, color: "#18181b", textTransform: "uppercase", letterSpacing: "0.025em" }}>Email Address</label>
                <input type="email" id="email" name="email" required style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#fff", border: "1px solid #e4e4e7", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "1rem", outline: "none" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label htmlFor="subject" style={{ fontSize: "0.875rem", fontWeight: 700, color: "#18181b", textTransform: "uppercase", letterSpacing: "0.025em" }}>Subject</label>
                <select id="subject" name="subject" style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#fff", border: "1px solid #e4e4e7", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "1rem", outline: "none", appearance: "none" }}>
                  <option>Order Inquiry</option>
                  <option>Product Question</option>
                  <option>Returns & Exchanges</option>
                  <option>Other</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label htmlFor="message" style={{ fontSize: "0.875rem", fontWeight: 700, color: "#18181b", textTransform: "uppercase", letterSpacing: "0.025em" }}>Message</label>
                <textarea id="message" name="message" rows={5} required style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#fff", border: "1px solid #e4e4e7", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "1rem", outline: "none", resize: "none" }}></textarea>
              </div>

              <button type="submit" style={{ marginTop: "1rem", alignSelf: "flex-start", padding: "1rem 2rem", backgroundColor: "#000", color: "#fff", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.875rem", borderRadius: "9999px", border: "none", cursor: "pointer" }}>
                Send Message
              </button>
            </form>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
