"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BadgePlus, FilePenLine, ShoppingBag, Trash2 } from "lucide-react";

import {
  deleteDraftOrder,
  readDraftOrders,
  type DraftOrder,
} from "@/lib/draft-orders";
import { formatINR } from "@/lib/format-price";

function DraftIllustration() {
  return (
    <div style={{"position":"relative","marginLeft":"auto","marginRight":"auto"}} aria-hidden="true">
      <div style={{"position":"absolute","inset":"0.75rem","borderRadius":"9999px","backgroundColor":"rgb(0,0,0,0.04)"}} />
      <div style={{"position":"absolute","left":"50%","top":"50%","transform":"translate(0, -50%) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)","borderRadius":"9999px","backgroundColor":"rgb(244,244,244)"}} />
      <div style={{"position":"absolute","left":"50%","top":"52%","height":"3rem","width":"9rem","transform":"translate(-50%, 0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)","borderBottomRightRadius":"999px","borderBottomLeftRadius":"999px","backgroundColor":"rgb(58,166,161)"}} />
      <div style={{"position":"absolute","left":"50%","top":"14%","height":"8rem","width":"6rem","transform":"translate(-50%, 0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)","borderTopLeftRadius":"0.375rem","borderTopRightRadius":"0.375rem","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 10px 30px rgba(0,0,0,0.12)"}}>
        <div style={{"position":"absolute","right":"0px","top":"0px","height":"1.75rem","width":"1.75rem","transform":"translate(0, 0) rotate(45deg) skewX(0) skewY(0) scaleX(1) scaleY(1)","backgroundColor":"rgb(236,236,236)"}} />
        <div style={{"position":"absolute","left":"0.5rem","top":"0.75rem","height":"3rem","width":"3rem","borderRadius":"0.125rem","backgroundColor":"rgb(0,0,0,0.05)"}}><div style={{"position":"absolute","left":"0.375rem","top":"0.375rem","height":"1.75rem","width":"2.25rem","borderRadius":"0.125rem","backgroundColor":"rgb(234,106,87)"}} /><div style={{"position":"absolute","left":"10px","top":"0.375rem","height":"0.5rem","width":"1rem","borderBottomRightRadius":"0.125rem","borderBottomLeftRadius":"0.125rem","backgroundColor":"rgb(217,77,59)"}} /></div>
        <div style={{"position":"absolute","right":"0.5rem","top":"2.25rem","height":"0.375rem","width":"2.25rem","borderRadius":"9999px"}} />
        <div style={{"position":"absolute","right":"0.5rem","top":"3rem","display":"flex","gap":"0.375rem"}}><span style={{"borderRadius":"9999px","backgroundColor":"rgb(217,77,59)"}} /><span style={{"borderRadius":"9999px","backgroundColor":"rgb(0,0,0,0.1)"}} /><span style={{"borderRadius":"9999px","backgroundColor":"rgb(0,0,0,0.1)"}} /></div>
        <div style={{"position":"absolute","left":"0.5rem","top":"5rem","height":"0.375rem","width":"1.25rem","borderRadius":"9999px","backgroundColor":"rgb(0,0,0,0.1)"}} /><div style={{"position":"absolute","left":"2rem","top":"5rem","height":"0.375rem","width":"1.25rem","borderRadius":"9999px","backgroundColor":"rgb(0,0,0,0.1)"}} /><div style={{"position":"absolute","left":"0.5rem","top":"6rem","height":"0.375rem","width":"2.5rem","borderRadius":"9999px","backgroundColor":"rgb(0,0,0,0.1)"}} /><div style={{"position":"absolute","right":"0.5rem","top":"5rem","height":"0.375rem","width":"1.25rem","borderRadius":"9999px","backgroundColor":"rgb(0,0,0,0.1)"}} /><div style={{"position":"absolute","right":"0.5rem","top":"6rem","height":"0.375rem","width":"1.75rem","borderRadius":"9999px","backgroundColor":"rgb(0,0,0,0.1)"}} />
      </div>
    </div>
  );
}

function draftTotal(draft: DraftOrder) {
  return draft.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
}

export function DraftOrdersManager() {
  const [drafts, setDrafts] = useState<DraftOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setDrafts(readDraftOrders());
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const sortedDrafts = useMemo(
    () => [...drafts].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt)),
    [drafts]
  );

  function removeDraft(id: string) {
    if (!window.confirm("Delete this draft order?")) return;
    deleteDraftOrder(id);
    setDrafts((current) => current.filter((draft) => draft.id !== id));
  }

  return (
    <main style={{"minHeight":"100%","flex":"1 1 0%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
      <div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}>
        <div>
          <h1 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600"}}><BadgePlus className="size-4" />Drafts</h1>
          <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Saved draft orders on this device.</p>
        </div>
        <Link href="/dashboard/orders/create-order" style={{"display":"inline-flex","height":"2.25rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(255,255,255)"}}><ShoppingBag className="size-3.5" />Create draft order</Link>
      </div>

      {!ready ? <section style={{"marginTop":"1rem","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"2.5rem","paddingBottom":"2.5rem","textAlign":"center","fontSize":"0.875rem","lineHeight":"1.25rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>Loading drafts…</section> : null}

      {ready && sortedDrafts.length === 0 ? (
        <section style={{"marginTop":"1rem","display":"flex","minHeight":"calc(100vh - 12rem)","alignItems":"center","justifyContent":"center","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
          <div style={{"maxWidth":"28rem","paddingLeft":"1.5rem","paddingRight":"1.5rem","paddingTop":"4rem","paddingBottom":"4rem","textAlign":"center"}}><DraftIllustration /><h2 style={{"marginTop":"2rem","fontSize":"1rem","lineHeight":"1.5rem","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>Manually create orders and invoices</h2><p style={{"marginTop":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>Use draft orders to take orders over the phone, email invoices to customers, and collect payments.</p><Link href="/dashboard/orders/create-order" style={{"marginTop":"1.25rem","display":"inline-flex","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(255,255,255)"}}><ShoppingBag className="size-3.5" />Create draft order</Link></div>
        </section>
      ) : null}

      {ready && sortedDrafts.length > 0 ? (
        <section style={{"marginTop":"1rem","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
          <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Draft orders</h2><span style={{"fontSize":"0.75rem","lineHeight":"1rem"}}>{sortedDrafts.length} saved</span></div>
          <div style={{"overflowX":"auto"}}><table style={{"width":"100%","minWidth":"740px","borderCollapse":"collapse","textAlign":"left","fontSize":"0.875rem","lineHeight":"1.25rem"}}><thead style={{"backgroundColor":"rgb(0,0,0,0.025)","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.6)"}}><tr><th style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500"}}>Draft</th><th style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500"}}>Customer</th><th style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500"}}>Items</th><th style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","textAlign":"right","fontWeight":"500"}}>Total</th><th style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500"}}>Last updated</th><th style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","textAlign":"right","fontWeight":"500"}}>Actions</th></tr></thead><tbody>{sortedDrafts.map((draft) => <tr key={draft.id} style={{"backgroundColor":"rgb(0,0,0,0.02)"}}><td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><span style={{"fontWeight":"500"}}>#{draft.id.slice(-6).toUpperCase()}</span><span style={{"marginTop":"0.25rem","display":"block","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.5)"}}>Draft</span></td><td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>{draft.customerName || "No customer"}<span style={{"marginTop":"0.25rem","display":"block","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.5)"}}>{draft.customerEmail || "—"}</span></td><td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>{draft.items.reduce((sum, item) => sum + item.quantity, 0)} {draft.items.length === 1 ? "item" : "items"}</td><td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","textAlign":"right","fontWeight":"500"}}>{formatINR(draftTotal(draft))}</td><td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(draft.updatedAt))}</td><td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><div style={{"display":"flex","justifyContent":"flex-end","gap":"0.5rem"}}><Link href={`/dashboard/orders/create-order?draft=${encodeURIComponent(draft.id)}`} style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","borderWidth":"1px","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","backgroundColor":"rgb(0,0,0,0.03)"}}><FilePenLine className="size-3.5" />Edit</Link><button type="button" onClick={() => removeDraft(draft.id)} aria-label={`Delete draft ${draft.id}`} style={{"display":"inline-flex","alignItems":"center","justifyContent":"center","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(254,202,202)","color":"rgb(220,38,38)","backgroundColor":"rgb(254,242,242)"}}><Trash2 className="size-3.5" /></button></div></td></tr>)}</tbody></table></div>
        </section>
      ) : null}
    </main>
  );
}
