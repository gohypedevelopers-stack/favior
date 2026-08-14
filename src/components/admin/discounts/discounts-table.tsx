"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export type DiscountTableItem = {
  id: string;
  code: string | null;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
};

function discountValue(discount: DiscountTableItem) {
  return discount.type === "PERCENTAGE" ? `${discount.value}% off` : `₹${discount.value.toLocaleString("en-IN")} off`;
}

export function DiscountsTable({ discounts }: { discounts: DiscountTableItem[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function deleteDiscount(discount: DiscountTableItem) {
    if (!window.confirm(`Delete ${discount.code || "this automatic discount"}? This cannot be undone.`)) return;
    setDeletingId(discount.id);
    setError("");
    try {
      const response = await fetch(`/api/discounts/${discount.id}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not delete the discount");
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete the discount");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section style={{"marginTop":"1rem","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
      {error ? <p role="alert" style={{"borderBottomWidth":"1px","borderColor":"rgb(254,202,202)","backgroundColor":"rgb(254,242,242)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(153,27,27)"}}>{error}</p> : null}
      <div style={{"overflowX":"auto"}}>
        <table style={{"width":"100%","minWidth":"680px","borderCollapse":"collapse","textAlign":"left","fontSize":"0.875rem","lineHeight":"1.25rem"}}>
          <thead style={{"backgroundColor":"rgb(0,0,0,0.025)","fontSize":"0.75rem","lineHeight":"1rem"}}><tr>{["Discount", "Status", "Value", "Usage", "Created", ""].map((heading) => <th key={heading || "actions"} style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","fontWeight":"500"}}>{heading}</th>)}</tr></thead>
          <tbody>{discounts.map((discount) => <tr key={discount.id} style={{"transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.02)"}}>
            <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><p style={{"fontWeight":"500","color":"rgb(0,0,0)"}}>{discount.code || "Automatic discount"}</p><p style={{"marginTop":"0.125rem","fontSize":"0.75rem","lineHeight":"1rem"}}>All products</p></td>
            <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${discount.isActive ? "bg-emerald-100 text-emerald-800" : "bg-black/[0.07] text-black/65"}`}>{discount.isActive ? "Active" : "Inactive"}</span></td>
            <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","fontWeight":"500"}}>{discountValue(discount)}</td>
            <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>{discount.usageCount} used</td>
            <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(discount.createdAt))}</td>
            <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","textAlign":"right"}}><button type="button" disabled={deletingId === discount.id} onClick={() => deleteDiscount(discount)} style={{"display":"inline-flex","alignItems":"center","justifyContent":"center","borderRadius":"0.375rem","color":"rgb(252,165,165)","backgroundColor":"rgb(254,242,242)","cursor":"not-allowed"}} aria-label={`Delete ${discount.code || "automatic discount"}`}><Trash2 className="size-4" /></button></td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
