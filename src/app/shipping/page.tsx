import React from "react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

export default function ShippingPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", color: "#18181b", fontFamily: "var(--font-sans), sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="text-center md:text-left" style={{ flexGrow: 1, paddingTop: "4rem", paddingBottom: "6rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
          
          <div className="text-center md:text-left" style={{ marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "1rem" }}>
              Shipping & Delivery
            </h1>
            <p style={{ color: "#52525b", fontSize: "1.125rem", margin: 0 }}>
              Everything you need to know about getting your Favior gear delivered to your door.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            
            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.025em", marginBottom: "1rem", borderBottom: "1px solid #e4e4e7", paddingBottom: "0.5rem", margin: "0 0 1rem 0" }}>
                Order Processing
              </h2>
              <div style={{ color: "#52525b", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ margin: 0 }}>
                  All orders are processed and shipped from our warehouse within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email.
                </p>
                <p style={{ margin: 0 }}>
                  You will receive another notification when your order has shipped, which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
                </p>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.025em", marginBottom: "1rem", borderBottom: "1px solid #e4e4e7", paddingBottom: "0.5rem", margin: "0 0 1rem 0" }}>
                Domestic Shipping Rates
              </h2>
              <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                <table style={{ width: "100%", textAlign: "left", color: "#52525b", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e4e4e7" }}>
                      <th style={{ padding: "0.75rem 0", fontWeight: 600, color: "#18181b" }}>Shipping Method</th>
                      <th style={{ padding: "0.75rem 0", fontWeight: 600, color: "#18181b" }}>Estimated Delivery</th>
                      <th style={{ padding: "0.75rem 0", fontWeight: 600, color: "#18181b", textAlign: "right" }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #f4f4f5" }}>
                      <td style={{ padding: "1rem 0" }}>Standard Shipping</td>
                      <td style={{ padding: "1rem 0" }}>3 to 5 business days</td>
                      <td style={{ padding: "1rem 0", textAlign: "right" }}>Free over Rs. 5000 (Else Rs. 200)</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f4f4f5" }}>
                      <td style={{ padding: "1rem 0" }}>Express Shipping</td>
                      <td style={{ padding: "1rem 0" }}>1 to 2 business days</td>
                      <td style={{ padding: "1rem 0", textAlign: "right" }}>Rs. 500</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.025em", marginBottom: "1rem", borderBottom: "1px solid #e4e4e7", paddingBottom: "0.5rem", margin: "0 0 1rem 0" }}>
                International Shipping
              </h2>
              <div style={{ color: "#52525b", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ margin: 0 }}>
                  We currently offer international shipping to select countries worldwide. Shipping charges for your order will be calculated and displayed at checkout.
                </p>
                <p style={{ margin: 0 }}>
                  Your order may be subject to import duties and taxes (including VAT), which are incurred once a shipment reaches your destination country. Favior is not responsible for these charges if they are applied and are your responsibility as the customer.
                </p>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.025em", marginBottom: "1rem", borderBottom: "1px solid #e4e4e7", paddingBottom: "0.5rem", margin: "0 0 1rem 0" }}>
                Missing or Lost Packages
              </h2>
              <div style={{ color: "#52525b", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ margin: 0 }}>
                  If your tracking information shows that your package was delivered, but you can't find it, please wait 48 hours before reaching out. Sometimes carriers mark packages as delivered prematurely.
                </p>
                <p style={{ margin: 0 }}>
                  If you still haven't received your order after 48 hours, please contact us at support@favior.com with your name and order number, and we will look into it for you.
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
