"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, ChevronDown, ChevronRight, ExternalLink, Flame, ImagePlus, Sparkles } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { uploadProductImage } from "@/lib/client/upload-product-image";

type DealProduct = {
  id: string;
  name: string;
  slug: string;
  price: string;
  oldPrice: string | null;
  description: string;
  image: string;
};

type EditableDeal = {
  productId: string;
  title: string;
  description: string;
  image: string | null;
  dealPrice: string | null;
  compareAtPrice: string | null;
  badge: string | null;
  features: string[];
  unitsLeft: number;
  totalUnits: number;
  endsAt: string;
  isActive: boolean;
};

const inputClass = "h-9 w-full rounded-lg border border-black/25 bg-white px-3 text-sm outline-none transition focus:border-black/55 focus:ring-2 focus:ring-black/5";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{"position":"relative","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
      <div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
        <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>{title}</h2>
      </div>
      <div style={{"borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem","paddingTop":"1rem"}}>{children}</div>
    </section>
  );
}

function toDateTimeLocal(value?: string) {
  const date = value ? new Date(value) : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function formatShortTitle(name: string, maxLen = 42) {
  if (name.length <= maxLen) return name;
  return `${name.slice(0, maxLen - 1)}…`;
}

function ProductSelectDropdown({
  products,
  selectedProductId,
  onSelectProduct,
}: {
  products: DealProduct[];
  selectedProductId: string;
  onSelectProduct: (productId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{"position":"relative","width":"100%"}}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{"display":"flex","minHeight":"46px","width":"100%","maxWidth":"100%","cursor":"pointer","alignItems":"center","justifyContent":"space-between","gap":"0.625rem","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.4)","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.375rem","paddingBottom":"0.375rem","textAlign":"left","fontSize":"0.875rem","lineHeight":"1.25rem","outline":"2px solid transparent","outlineOffset":"2px","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}}
      >
        {selectedProduct ? (
          <div style={{"display":"flex","minWidth":"0px","flex":"1 1 0%","alignItems":"center","gap":"0.625rem"}}>
            <div style={{"position":"relative","flexShrink":"0","overflow":"hidden","borderRadius":"0.25rem","borderWidth":"1px","borderColor":"rgb(226,232,240)","backgroundColor":"rgb(255,255,255)","padding":"0.125rem"}}>
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                style={{"objectFit":"contain"}}
                sizes="32px"
              />
            </div>
            <span style={{"minWidth":"0px","flex":"1 1 0%","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontWeight":"500","color":"rgb(15,23,42)"}} title={selectedProduct.name}>
              {formatShortTitle(selectedProduct.name)}
            </span>
            <span style={{"flexShrink":"0","fontWeight":"600","color":"rgb(100,116,139)"}}>— {selectedProduct.price}</span>
          </div>
        ) : (
          <span style={{"color":"rgb(0,0,0,0.5)"}}>Select a product</span>
        )}
        <ChevronDown className={`size-4 shrink-0 text-black/45 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <div
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          style={{"position":"absolute","left":"0px","right":"0px","top":"100%","zIndex":"50","marginTop":"0.25rem","maxHeight":"16rem","width":"100%","maxWidth":"100%","overflowY":"auto","overflowX":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(226,232,240)","backgroundColor":"rgb(255,255,255)","paddingTop":"0.25rem","paddingBottom":"0.25rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 20px 25px -5px rgb(0,0,0,0.1), 0 8px 10px -6px rgb(0,0,0,0.1)"}}
        >
          {products.map((product) => {
            const isSelected = product.id === selectedProductId;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  onSelectProduct(product.id);
                  setIsOpen(false);
                }}
                className={`flex w-full max-w-full items-center justify-between gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50/80 cursor-pointer ${
                  isSelected ? "bg-blue-50 font-semibold text-[#0a7ae6]" : "text-slate-900"
                }`}
              >
                <div style={{"display":"flex","minWidth":"0px","flex":"1 1 0%","alignItems":"center","gap":"0.625rem"}}>
                  <div style={{"position":"relative","flexShrink":"0","overflow":"hidden","borderRadius":"0.25rem","borderWidth":"1px","borderColor":"rgb(226,232,240)","backgroundColor":"rgb(255,255,255)","padding":"0.125rem"}}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{"objectFit":"contain"}}
                      sizes="32px"
                    />
                  </div>
                  <span style={{"minWidth":"0px","flex":"1 1 0%","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontWeight":"500","color":"rgb(15,23,42)"}} title={product.name}>
                    {formatShortTitle(product.name)}
                  </span>
                </div>
                <span style={{"flexShrink":"0","fontWeight":"600","color":"rgb(10,122,230)"}}>{product.price}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function DealOfTheDayEditor({ deal, products }: { deal: EditableDeal | null; products: DealProduct[] }) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const initiallySelectedProduct = products.find((product) => product.id === deal?.productId);
  const [productId, setProductId] = useState(deal?.productId ?? "");
  const [title, setTitle] = useState(deal?.title ?? "");
  const [description, setDescription] = useState(deal?.description ?? "");
  const [image, setImage] = useState(deal?.image ?? "");
  const [dealPrice, setDealPrice] = useState(deal?.dealPrice ?? initiallySelectedProduct?.price ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(deal?.compareAtPrice ?? initiallySelectedProduct?.oldPrice ?? "");
  const [badge, setBadge] = useState(deal?.badge ?? "FLASH OFFER");
  const [featuresText, setFeaturesText] = useState(deal?.features.join(", ") ?? "");
  const [unitsLeft, setUnitsLeft] = useState(String(deal?.unitsLeft ?? ""));
  const [totalUnits, setTotalUnits] = useState(String(deal?.totalUnits ?? ""));
  const [endsAt, setEndsAt] = useState(toDateTimeLocal(deal?.endsAt));
  const [isActive, setIsActive] = useState(deal?.isActive ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const selectedProduct = useMemo(() => products.find((product) => product.id === productId), [productId, products]);
  const unitsLeftValue = Number(unitsLeft);
  const totalUnitsValue = Number(totalUnits);
  const hasValidInventory = Number.isSafeInteger(unitsLeftValue) && Number.isSafeInteger(totalUnitsValue) && unitsLeftValue >= 0 && totalUnitsValue > 0 && unitsLeftValue <= totalUnitsValue;
  const hasValidEndDate = !Number.isNaN(new Date(endsAt).getTime());
  const previewImage = image || selectedProduct?.image || "";
  const previewFeatures = featuresText.split(",").map((feature) => feature.trim()).filter(Boolean);
  const claimedPercent = hasValidInventory ? Math.round(((totalUnitsValue - unitsLeftValue) / totalUnitsValue) * 100) : 0;
  const currentFormState = { productId, title, description, image, dealPrice, compareAtPrice, badge, featuresText, unitsLeft, totalUnits, endsAt, isActive };
  const [initialFormState, setInitialFormState] = useState(currentFormState);
  const isDirty =
    currentFormState.productId !== initialFormState.productId ||
    currentFormState.title !== initialFormState.title ||
    currentFormState.description !== initialFormState.description ||
    currentFormState.image !== initialFormState.image ||
    currentFormState.dealPrice !== initialFormState.dealPrice ||
    currentFormState.compareAtPrice !== initialFormState.compareAtPrice ||
    currentFormState.badge !== initialFormState.badge ||
    currentFormState.featuresText !== initialFormState.featuresText ||
    currentFormState.unitsLeft !== initialFormState.unitsLeft ||
    currentFormState.totalUnits !== initialFormState.totalUnits ||
    currentFormState.endsAt !== initialFormState.endsAt ||
    currentFormState.isActive !== initialFormState.isActive;
  const canSave = Boolean(productId && title.trim() && description.trim() && hasValidInventory && hasValidEndDate && isDirty && !isSaving && !isUploading);

  function chooseProduct(nextProductId: string) {
    const nextProduct = products.find((product) => product.id === nextProductId);
    setProductId(nextProductId);
    if (!nextProduct) return;
    if (!title.trim()) setTitle(nextProduct.name);
    if (!description.trim()) setDescription(nextProduct.description);
    if (!dealPrice.trim()) setDealPrice(nextProduct.price);
    if (!compareAtPrice.trim() && nextProduct.oldPrice) setCompareAtPrice(nextProduct.oldPrice);
  }

  async function uploadDealImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setIsUploading(true);
    setError("");
    try {
      const uploaded = await uploadProductImage(file);
      setImage(uploaded.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload the deal image");
    } finally {
      setIsUploading(false);
    }
  }

  async function saveDeal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/deal-of-the-day", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          title: title.trim(),
          description: description.trim(),
          image: image || null,
          dealPrice: dealPrice.trim() || null,
          compareAtPrice: compareAtPrice.trim() || null,
          badge: badge.trim() || null,
          features: featuresText.split(",").map((feature) => feature.trim()).filter(Boolean),
          unitsLeft: unitsLeftValue,
          totalUnits: totalUnitsValue,
          endsAt: new Date(endsAt).toISOString(),
          isActive,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not save the deal");
      setInitialFormState(currentFormState);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the deal");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main style={{"minHeight":"100%","flex":"1 1 0%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
      <form style={{"marginLeft":"auto","marginRight":"auto","maxWidth":"1050px"}} onSubmit={saveDeal}>
        <header style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}>
          <div>
            <h1 style={{"display":"flex","alignItems":"center","gap":"0.375rem","fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600"}}><Flame className="size-4" /><ChevronRight className="size-4 text-black/45" /> Deal of the day</h1>
            <p style={{"marginTop":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>Choose the product and limited-time offer customers see on the home page.</p>
          </div>
          <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}><Link href="/dashboard" style={{"display":"inline-flex","height":"2rem","alignItems":"center","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}>Discard</Link><button type="submit" disabled={!canSave} style={{"display":"inline-flex","height":"2rem","alignItems":"center","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","cursor":"not-allowed"}}>{isSaving ? "Saving…" : "Save deal"}</button></div>
        </header>

        <div style={{"marginTop":"1rem","display":"grid","gap":"1rem"}}>
          <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
            <SectionCard title="Deal details">
              <div style={{"display":"grid","gap":"1rem"}}>
                <div style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>
                  <span>Product</span>
                  <ProductSelectDropdown
                    products={products}
                    selectedProductId={productId}
                    onSelectProduct={chooseProduct}
                  />
                </div>
                <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>Deal title <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. BLAZE B2000" className={inputClass} /></label>
                <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>Deal description <textarea required rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe why this limited-time offer is special" style={{"width":"100%","resize":"none","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.25)","backgroundColor":"rgb(255,255,255)","padding":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","outline":"2px solid transparent","outlineOffset":"2px","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}} /></label>
                <div style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}><span>Deal image</span><input ref={imageInputRef} type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/webp" style={{"position":"absolute","width":"1px","height":"1px","padding":"0","margin":"-1px","overflow":"hidden","clip":"rect(0, 0, 0, 0)","whiteSpace":"nowrap","borderWidth":"0"}} onChange={(event) => void uploadDealImage(event)} /><button type="button" disabled={isUploading} onClick={() => imageInputRef.current?.click()} style={{"position":"relative","display":"flex","height":"13rem","alignItems":"center","justifyContent":"center","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px","borderStyle":"dashed","borderColor":"rgb(0,0,0,0.3)","backgroundColor":"rgb(0,0,0,0.04)","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.6)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","cursor":"wait"}}>{previewImage ? <><Image src={previewImage} alt="Deal preview" fill sizes="650px" style={{"objectFit":"cover"}} /><span style={{"position":"relative","borderRadius":"0.25rem","backgroundColor":"rgb(255,255,255,0.9)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.375rem","paddingBottom":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)"}}>{isUploading ? "Uploading…" : "Replace image"}</span></> : <span style={{"display":"flex","flexDirection":"column","alignItems":"center","gap":"0.5rem"}}><ImagePlus className="size-5" />{isUploading ? "Uploading…" : "Upload image"}</span>}</button>{image ? <button type="button" onClick={() => setImage("")} style={{"justifySelf":"start","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(220,38,38)","textDecorationLine":"underline"}}>Use the product image instead</button> : <p style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"400"}}>If no custom image is uploaded, the selected product image is used.</p>}</div>
              </div>
            </SectionCard>

            <SectionCard title="Offer messaging">
              <div style={{"display":"grid","gap":"1rem"}}><label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>Offer label <input value={badge} onChange={(event) => setBadge(event.target.value)} placeholder="FLASH OFFER" className={inputClass} /></label><label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>Highlights <input value={featuresText} onChange={(event) => setFeaturesText(event.target.value)} placeholder="Dolby Audio, 900W, 3D surround" className={inputClass} /></label></div><p style={{"marginTop":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Separate highlights with commas. They appear as labels below the deal description.</p>
            </SectionCard>

            <SectionCard title="Deal pricing">
              <div style={{"display":"grid","gap":"1rem"}}>
                <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>Deal price <input value={dealPrice} onChange={(event) => setDealPrice(event.target.value)} placeholder={selectedProduct?.price || "₹ 14,999"} className={inputClass} /></label>
                <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>Compare-at price <input value={compareAtPrice} onChange={(event) => setCompareAtPrice(event.target.value)} placeholder={selectedProduct?.oldPrice || "₹ 32,999"} className={inputClass} /></label>
              </div>
              <p style={{"marginTop":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Deal price is shown prominently on the home page. Compare-at price appears crossed out. Leave a field empty to use the selected product&apos;s price.</p>
            </SectionCard>

            {error ? <p role="alert" style={{"borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(254,202,202)","backgroundColor":"rgb(254,242,242)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(153,27,27)"}}>{error}</p> : null}
          </div>

          <aside style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
            <SectionCard title="Schedule and stock">
              <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}><label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>End date and time <span style={{"position":"relative"}}><CalendarClock style={{"pointerEvents":"none","position":"absolute","left":"0.75rem","top":"0.625rem"}} /><input required type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className={`${inputClass} pl-9`} /></span></label><div style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","gap":"0.75rem"}}><label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>Units left <input required min="0" inputMode="numeric" value={unitsLeft} onChange={(event) => setUnitsLeft(event.target.value)} placeholder="16" className={inputClass} /></label><label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>Total units <input required min="1" inputMode="numeric" value={totalUnits} onChange={(event) => setTotalUnits(event.target.value)} placeholder="100" className={inputClass} /></label></div>{unitsLeft && totalUnits && !hasValidInventory ? <p style={{"fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(185,28,28)"}}>Units left must be from 0 to the total units.</p> : null}<label style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}><span><span style={{"display":"block","fontWeight":"500"}}>Show on storefront</span><span style={{"marginTop":"0.125rem","display":"block","fontSize":"0.75rem","lineHeight":"1rem"}}>Save the deal to apply this visibility change on the home page.</span></span><Switch checked={isActive} onCheckedChange={setIsActive} aria-label="Show deal on storefront" /></label></div>
            </SectionCard>
            <SectionCard title="Storefront preview">
              <p style={{"marginBottom":"0.75rem","fontSize":"0.75rem","lineHeight":"1.25rem"}}>This is the information customers will see in the Deal of the day section on the home page.</p>
              {selectedProduct ? <div style={{"overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","backgroundColor":"rgb(247,251,255)"}}>
                <div style={{"position":"relative","height":"8rem","backgroundColor":"rgb(2,6,23)"}}>
                  {previewImage ? <Image src={previewImage} alt={title || selectedProduct.name} fill sizes="300px" style={{"objectFit":"cover"}} /> : <div style={{"display":"flex","height":"100%","alignItems":"center","justifyContent":"center","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(255,255,255,0.6)"}}>No product image</div>}
                  <span style={{"position":"absolute","bottom":"0.5rem","right":"0.5rem","borderRadius":"0.375rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontSize":"9px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(255,255,255)"}}>{badge.trim() || "Deal of the day"}</span>
                </div>
                <div style={{"padding":"0.875rem"}}>
                  <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem","fontSize":"10px","fontWeight":"600","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(0,91,211)"}}><span style={{"display":"flex","alignItems":"center","gap":"0.25rem"}}><Flame style={{"fill":"currentColor"}} /> {unitsLeft || "0"} units left</span><span>{hasValidEndDate ? "Limited time" : "Set an end time"}</span></div>
                  <h2 style={{"marginTop":"0.5rem","overflow":"hidden","display":"-webkit-box","WebkitBoxOrient":"vertical","WebkitLineClamp":"2","fontSize":"1rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(2,6,23)"}}>{title || selectedProduct.name}</h2>
                  <p style={{"marginTop":"0.25rem","overflow":"hidden","display":"-webkit-box","WebkitBoxOrient":"vertical","WebkitLineClamp":"3","fontSize":"0.75rem","lineHeight":"1.25rem","color":"rgb(71,85,105)"}}>{description || selectedProduct.description}</p>
                  {previewFeatures.length > 0 ? <div style={{"marginTop":"0.75rem","display":"flex","flexWrap":"wrap","gap":"0.375rem"}}>{previewFeatures.slice(0, 4).map((feature) => <span key={feature} style={{"borderRadius":"9999px","borderWidth":"1px","borderColor":"rgb(0,91,211,0.25)","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"9px","fontWeight":"600","textTransform":"uppercase","letterSpacing":"0.025em","color":"rgb(0,91,211)"}}>{feature}</span>)}</div> : null}
                  <div style={{"marginTop":"0.75rem","borderTopWidth":"1px","borderColor":"rgb(226,232,240)","paddingTop":"0.75rem"}}><div style={{"display":"flex","alignItems":"baseline","gap":"0.5rem"}}><span style={{"fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600","color":"rgb(2,6,23)"}}>{dealPrice || selectedProduct.price}</span>{compareAtPrice || selectedProduct.oldPrice ? <span style={{"fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(148,163,184)","textDecorationLine":"line-through"}}>{compareAtPrice || selectedProduct.oldPrice}</span> : null}</div><div style={{"marginTop":"0.5rem","display":"flex","alignItems":"center","justifyContent":"space-between","fontSize":"10px","fontWeight":"600","textTransform":"uppercase","letterSpacing":"0.025em"}}><span style={{"color":"rgb(0,91,211)"}}>Selling fast</span><span style={{"color":"rgb(100,116,139)"}}>{claimedPercent}% claimed</span></div><div style={{"marginTop":"0.375rem","height":"0.375rem","overflow":"hidden","borderRadius":"9999px","backgroundColor":"rgb(226,232,240)"}}><div style={{"height":"100%","borderRadius":"9999px","backgroundColor":"rgb(0,91,211)","transitionProperty":"all","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms", width: `${claimedPercent}%`}} /></div></div>
                </div>
              </div> : <div style={{"borderRadius":"0.75rem","borderWidth":"1px","borderStyle":"dashed","borderColor":"rgb(0,0,0,0.2)","backgroundColor":"rgb(0,0,0,0.02)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"2rem","paddingBottom":"2rem","textAlign":"center"}}><div style={{"marginLeft":"auto","marginRight":"auto","display":"flex","alignItems":"center","justifyContent":"center","borderRadius":"0.5rem","backgroundColor":"rgb(0,91,211,0.1)","color":"rgb(0,91,211)"}}><Sparkles className="size-5" /></div><p style={{"marginTop":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>Select a product to preview the deal</p><p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1.25rem"}}>The product image, price, and compare-at price will appear here automatically.</p></div>}
              <div style={{"marginTop":"1rem","display":"flex","alignItems":"center","justifyContent":"space-between","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingTop":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem"}}><span className={isActive ? "font-medium text-emerald-700" : "font-medium text-black/50"}>{isActive ? "Will show on storefront" : "Hidden from storefront"}</span><Link href="/" style={{"display":"inline-flex","alignItems":"center","gap":"0.25rem","fontWeight":"500","color":"rgb(0,91,211)","textDecorationLine":"underline"}}>Open home page <ExternalLink className="size-3" /></Link></div>
            </SectionCard>
          </aside>
        </div>
      </form>
    </main>
  );
}
