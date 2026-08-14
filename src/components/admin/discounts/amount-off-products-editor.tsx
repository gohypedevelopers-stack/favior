"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgePercent, ChevronRight, Sparkles, Tag } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type DiscountMethod = "code" | "automatic";
type ValueType = "percentage" | "fixed";

function SectionCard({ children }: { children: React.ReactNode }) {
  return <section style={{"borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>{children}</section>;
}

const inputClass = "h-9 w-full rounded-lg border border-black/25 bg-white px-3 text-sm outline-none transition focus:border-black/55 focus:ring-2 focus:ring-black/5";

type DiscountProduct = { id: string; name: string };

export function TargetPickerDialog({
  open,
  onOpenChange,
  selectedIds,
  onAdd,
}: {
  kind: "products";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onAdd: (ids: string[]) => void;
}) {
  const [products, setProducts] = useState<DiscountProduct[]>([]);
  const [draftIds, setDraftIds] = useState(selectedIds);

  useEffect(() => {
    if (!open) return;
    fetch("/api/products")
      .then((response) => response.json())
      .then((payload) => setProducts(Array.isArray(payload.data) ? payload.data : []))
      .catch(() => setProducts([]));
  }, [open, selectedIds]);

  function toggle(id: string) {
    setDraftIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{"width":"min(560px,calc(100vw - 2rem))","gap":"0px","overflow":"hidden","borderRadius":"1rem","padding":"0px"}}>
        <DialogHeader style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1.25rem","paddingBottom":"1.25rem"}}><DialogTitle>Select products</DialogTitle><DialogDescription>Choose products for this discount.</DialogDescription></DialogHeader>
        <div style={{"maxHeight":"360px","overflowY":"auto"}}>
          {products.map((product) => <label key={product.id} style={{"display":"flex","cursor":"pointer","alignItems":"center","gap":"0.75rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.08)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","backgroundColor":"rgb(0,0,0,0.02)"}}><input type="checkbox" checked={draftIds.includes(product.id)} onChange={() => toggle(product.id)} style={{"accentColor":"#000"}} /><span style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>{product.name}</span></label>)}
          {products.length === 0 ? <p style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"2.5rem","paddingBottom":"2.5rem","textAlign":"center","fontSize":"0.875rem","lineHeight":"1.25rem"}}>No products are available.</p> : null}
        </div>
        <DialogFooter style={{"flexDirection":"row","justifyContent":"flex-end","gap":"0.5rem","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><button type="button" onClick={() => onOpenChange(false)} style={{"height":"2rem","borderRadius":"0.5rem","borderWidth":"1px","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","backgroundColor":"rgb(0,0,0,0.03)"}}>Cancel</button><button type="button" onClick={() => { onAdd(draftIds); onOpenChange(false); }} style={{"height":"2rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(255,255,255)"}}>Add products</button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AmountOffProductsEditor() {
  const router = useRouter();
  const [method, setMethod] = useState<DiscountMethod>("code");
  const [valueType, setValueType] = useState<ValueType>("percentage");
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const numericValue = Number(value);
  const isValueValid = Number.isFinite(numericValue) && numericValue > 0 && (valueType !== "percentage" || numericValue <= 100);
  const canSave = isValueValid && (method === "automatic" || code.trim().length > 0) && !isSaving;

  function generateCode() {
    setCode(`FAVIOR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
  }

  async function saveDiscount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;

    setIsSaving(true);
    setError("");
    try {
      const response = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: method === "code" ? code : null,
          type: valueType === "percentage" ? "PERCENTAGE" : "FIXED_AMOUNT",
          value: numericValue,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not create the discount");

      router.push("/dashboard/discounts");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not create the discount");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main style={{"minHeight":"100%","flex":"1 1 0%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
      <form style={{"marginLeft":"auto","marginRight":"auto","maxWidth":"970px"}} onSubmit={saveDiscount}>
        <header style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}>
          <div>
            <h1 style={{"display":"flex","alignItems":"center","gap":"0.375rem","fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600"}}><Tag className="size-4" /><ChevronRight className="size-4 text-black/45" /> Create discount</h1>
            <p style={{"marginTop":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>Create a product discount for every customer in your online store.</p>
          </div>
          <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
            <Link href="/dashboard/discounts" style={{"display":"inline-flex","height":"2rem","alignItems":"center","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}>Discard</Link>
            <button type="submit" disabled={!canSave} style={{"display":"inline-flex","height":"2rem","alignItems":"center","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","cursor":"not-allowed"}}>{isSaving ? "Creating…" : "Create discount"}</button>
          </div>
        </header>

        <div style={{"marginTop":"1rem","display":"grid","gap":"1rem"}}>
          <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
            <SectionCard>
              <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Discount method</h2>
              <div style={{"marginTop":"1rem","display":"inline-flex","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px"}}>
                <button type="button" onClick={() => setMethod("code")} className={`h-9 px-3 text-sm font-medium ${method === "code" ? "bg-black/[0.12]" : "bg-white hover:bg-black/[0.03]"}`}>Discount code</button>
                <button type="button" onClick={() => setMethod("automatic")} className={`h-9 border-l border-black/15 px-3 text-sm font-medium ${method === "automatic" ? "bg-black/[0.12]" : "bg-white hover:bg-black/[0.03]"}`}>Automatic discount</button>
              </div>
              {method === "code" ? (
                <div style={{"marginTop":"1.25rem"}}>
                  <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}>
                    <label htmlFor="discount-code" style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>Discount code</label>
                    <button type="button" onClick={generateCode} style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,91,211)","textDecorationLine":"underline"}}>Generate code</button>
                  </div>
                  <input id="discount-code" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="SAVE10" className={`${inputClass} mt-1.5 uppercase`} />
                  <p style={{"marginTop":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Customers enter this code at checkout.</p>
                </div>
              ) : <p style={{"marginTop":"1rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.6)"}}>This discount is applied automatically when a customer qualifies.</p>}
            </SectionCard>

            <SectionCard>
              <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Discount value</h2>
              <div style={{"marginTop":"1rem","display":"grid","gap":"0.75rem"}}>
                <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>Type
                  <select value={valueType} onChange={(event) => setValueType(event.target.value as ValueType)} className={inputClass}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </label>
                <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>Value
                  <div style={{"position":"relative"}}><input aria-label="Discount value" inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} placeholder={valueType === "percentage" ? "10" : "500"} className={`${inputClass} pr-9`} /><span style={{"pointerEvents":"none","position":"absolute","right":"0.75rem","top":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.5)"}}>{valueType === "percentage" ? "%" : "₹"}</span></div>
                </label>
              </div>
              {value && !isValueValid ? <p style={{"marginTop":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(185,28,28)"}}>Enter a valid {valueType === "percentage" ? "percentage from 1 to 100" : "amount"}.</p> : null}
            </SectionCard>

            <SectionCard>
              <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Eligibility</h2>
              <div style={{"marginTop":"1rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(0,0,0,0.025)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.7)"}}>All customers, on all products</div>
              <p style={{"marginTop":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem"}}>The discount starts active as soon as you create it.</p>
            </SectionCard>

            {error ? <p role="alert" style={{"borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(254,202,202)","backgroundColor":"rgb(254,242,242)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(153,27,27)"}}>{error}</p> : null}
          </div>

          <aside style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
            <SectionCard>
              <div style={{"display":"flex","alignItems":"center","justifyContent":"center","borderRadius":"0.5rem","backgroundColor":"rgb(0,91,211,0.1)","color":"rgb(0,91,211)"}}><BadgePercent className="size-5" /></div>
              <h2 style={{"marginTop":"1rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>{method === "code" ? code || "Your discount code" : "Automatic discount"}</h2>
              <p style={{"marginTop":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.6)"}}>{value ? `${value}${valueType === "percentage" ? "%" : " ₹"} off` : "Set a discount value"}</p>
              <dl style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingTop":"1rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>
                <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}><dt className="text-black/55">Method</dt><dd style={{"fontWeight":"500"}}>{method === "code" ? "Code" : "Automatic"}</dd></div>
                <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}><dt className="text-black/55">Applies to</dt><dd style={{"fontWeight":"500"}}>All products</dd></div>
                <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}><dt className="text-black/55">Status</dt><dd style={{"fontWeight":"500","color":"rgb(4,120,87)"}}>Active</dd></div>
              </dl>
            </SectionCard>
            <SectionCard>
              <div style={{"display":"flex","alignItems":"flex-start","gap":"0.625rem"}}><Sparkles style={{"marginTop":"0.125rem","flexShrink":"0","color":"rgb(0,91,211)"}} /><p style={{"fontSize":"0.875rem","lineHeight":"1.25rem"}}>Use a short code that is easy for customers to remember and share.</p></div>
            </SectionCard>
          </aside>
        </div>
      </form>
    </main>
  );
}
