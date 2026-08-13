import React from "react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

export default function ReturnsPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", color: "#18181b", fontFamily: "var(--font-sans), sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="text-center md:text-left" style={{ flexGrow: 1, paddingTop: "4rem", paddingBottom: "6rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
          
          <div className="text-center md:text-left" style={{ marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "1rem", margin: "0 0 1rem 0" }}>
              Exchange & Returns
            </h1>
            <p style={{ color: "#52525b", fontSize: "1.125rem", margin: 0 }}>
              We stand behind our gear. If you're not completely satisfied, we're here to help.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            
            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.025em", borderBottom: "1px solid #e4e4e7", paddingBottom: "0.5rem", margin: "0 0 1rem 0" }}>
                Our 30-Day Guarantee
              </h2>
              <div style={{ color: "#52525b", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ margin: 0 }}>
                  We accept returns up to 30 days after delivery, if the item is unused, unwashed, and in its original condition with all tags attached. We will refund the full order amount minus the shipping costs for the return.
                </p>
                <p style={{ margin: 0 }}>
                  If 30 days have gone by since your purchase, unfortunately, we can't offer you a refund or exchange.
                </p>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.025em", borderBottom: "1px solid #e4e4e7", paddingBottom: "0.5rem", margin: "0 0 1rem 0" }}>
                How to Start a Return
              </h2>
              <div style={{ color: "#52525b", lineHeight: 1.6 }}>
                <ol style={{ listStyleType: "decimal", paddingLeft: "1.5rem", margin: "0.5rem 0 0 0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <li style={{ paddingLeft: "0.5rem" }}>Ensure your items meet our return criteria mentioned above.</li>
                  <li style={{ paddingLeft: "0.5rem" }}>Email our support team at <strong style={{ color: "#18181b" }}>returns@favior.com</strong> with your order number and reason for return.</li>
                  <li style={{ paddingLeft: "0.5rem" }}>Our team will respond within 24 hours with a return authorization and a prepaid shipping label (if applicable).</li>
                  <li style={{ paddingLeft: "0.5rem" }}>Securely pack the items in their original packaging and attach the provided label.</li>
                  <li style={{ paddingLeft: "0.5rem" }}>Drop off the package at the designated courier location.</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.025em", borderBottom: "1px solid #e4e4e7", paddingBottom: "0.5rem", margin: "0 0 1rem 0" }}>
                Exchanges
              </h2>
              <div style={{ color: "#52525b", lineHeight: 1.6 }}>
                <p style={{ margin: 0 }}>
                  We only replace items if they are defective or damaged upon arrival. If you need to exchange an item for a different size or color, the fastest way is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
                </p>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.025em", borderBottom: "1px solid #e4e4e7", paddingBottom: "0.5rem", margin: "0 0 1rem 0" }}>
                Refunds
              </h2>
              <div style={{ color: "#52525b", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ margin: 0 }}>
                  Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                </p>
                <p style={{ margin: 0 }}>
                  If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
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
