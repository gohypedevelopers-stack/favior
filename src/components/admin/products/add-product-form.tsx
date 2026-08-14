"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Pencil, Tag } from "lucide-react";

import { ProductAdditionalDetailsSection } from "@/components/admin/products/product-additional-details-section";
import { ProductDescriptionEditor } from "@/components/admin/products/product-description-editor";
import { HomeShowcaseToggle } from "@/components/admin/products/home-showcase-toggle";
import { ProductMediaUploader } from "@/components/admin/products/product-media-uploader";
import { ProductVariantsSection } from "@/components/admin/products/product-variants-section";
import { uploadProductImage } from "@/lib/client/upload-product-image";
import { parsePriceNumber } from "@/lib/format-price";
import { ProductFeaturesSection } from "@/components/admin/products/product-features-section";

export type ProductCategoryOption = {
  id: string;
  title: string;
};

type CardProps = {
  title: string;
  children: React.ReactNode;
  className?: string; style?: React.CSSProperties;
  actions?: React.ReactNode;
};

const inputStyle = { height: '2.5rem', width: '100%', borderRadius: '0.5rem', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(0,0,0,0.25)', backgroundColor: 'white', paddingLeft: '0.75rem', paddingRight: '0.75rem', fontSize: '0.875rem', outline: 'none' };

function Card({ title, children, className = "", actions }: CardProps) {
  return (
    <section className={`overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm ${className}`}>
      <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
        <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0,0.75)"}}>{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AddProductForm({ categories }: { categories: ProductCategoryOption[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.00");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [showInBestSellers, setShowInBestSellers] = useState(false);
  const [status, setStatus] = useState("active");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId),
    [categories, categoryId]
  );

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericPrice = Number(price);
    const numericCompareAtPrice = compareAtPrice.trim() ? Number(compareAtPrice) : undefined;
    const numericQuantity = Number(quantity);

    if (!title.trim() || !description.trim() || !categoryId || !Number.isFinite(numericPrice) || numericPrice < 0 || !Number.isSafeInteger(numericQuantity) || numericQuantity < 0) {
      setMessage("Add a title, category, description, valid price, and whole-number quantity before saving.");
      return;
    }

    if (numericCompareAtPrice !== undefined && (!Number.isFinite(numericCompareAtPrice) || numericCompareAtPrice < 0)) {
      setMessage("Enter a valid compare-at price or leave it blank.");
      return;
    }

    const slug = slugify(title);
    if (!slug) {
      setMessage("Use letters or numbers in the product title.");
      return;
    }

    setIsSaving(true);
    setMessage("");
    try {
      const uploadedMedia = await Promise.all(
        mediaFiles.map(async (file, sortOrder) => ({
          ...(await uploadProductImage(file)),
          mimeType: file.type,
          sortOrder,
        }))
      );
      const mainImage = uploadedMedia[0]?.url || "/category-smartphone.png";
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title.trim(),
          slug,
          categoryId,
          price: `₹${numericPrice.toFixed(2)}`,
          oldPrice: numericCompareAtPrice !== undefined ? `₹${numericCompareAtPrice.toFixed(2)}` : undefined,
          description: description.trim(),
          mainImage,
          shippingNotice: "Shipping details will be provided at checkout.",
          quantity: numericQuantity,
          showInBestSellers,
          media: uploadedMedia,
          features: features.map(f => f.trim()).filter(f => f !== ""),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to save the product");
      }

      router.push("/dashboard/products");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save the product");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}>
        <h1 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600"}}><Tag className="size-4" /><ChevronRight className="size-4 text-black/45" />Add product</h1>
        <button type="submit" disabled={isSaving} style={{"borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"1.25rem","paddingRight":"1.25rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","cursor":"not-allowed"}}>
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>
      {message ? <p role="alert" style={{"marginTop":"0.75rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(254,202,202)","backgroundColor":"rgb(254,242,242)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(153,27,27)"}}>{message}</p> : null}

      <div style={{"marginTop":"1rem","display":"grid","gap":"1rem"}}>
        <div>
          <Card title="Product details">
            <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}>
                <span>Title</span>
                <input value={title} onChange={(event) => setTitle(event.target.value)} style={inputStyle} placeholder="Short sleeve t-shirt" />
              </label>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}>
                <span>Category</span>
                <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} style={inputStyle}>
                  <option value="">Choose a product category</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}
                </select>
                <span style={{"fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.6)"}}>Determines tax rates and helps customers find the product.</span>
              </label>
            </div>
          </Card>

          <Card title="Description" style={{"marginTop":"1rem"}}>
            <div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}><ProductDescriptionEditor value={description} onChange={setDescription} /></div>
          </Card>
          
          <ProductFeaturesSection features={features} onChange={setFeatures} />

          <Card title="Media" style={{"marginTop":"1rem"}}>
            <div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}><ProductMediaUploader onFilesChange={setMediaFiles} /></div>
          </Card>

          <Card title="Price" style={{"marginTop":"1rem"}}>
            <div style={{"display":"grid","gap":"1rem","paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}><span>Price</span><span style={{"position":"relative","display":"block"}}><span style={{"position":"absolute","left":"0.75rem","top":"50%","transform":"translate(0, -50%) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)","fontSize":"0.875rem","lineHeight":"1.25rem"}}>₹</span><input aria-label="Price" value={price} onChange={(event) => setPrice(event.target.value)} inputMode="decimal" style={{...inputStyle, paddingLeft: '1.75rem'}} /></span></label>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}><span>Compare-at price</span><span style={{"position":"relative","display":"block"}}><span style={{"position":"absolute","left":"0.75rem","top":"50%","transform":"translate(0, -50%) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)","fontSize":"0.875rem","lineHeight":"1.25rem"}}>₹</span><input aria-label="Compare-at price" value={compareAtPrice} onChange={(event) => setCompareAtPrice(event.target.value)} inputMode="decimal" placeholder="0.00" style={{...inputStyle, paddingLeft: '1.75rem'}} /></span></label>
            </div>
            {parsePriceNumber(price) > parsePriceNumber(compareAtPrice) && parsePriceNumber(compareAtPrice) > 0 && (
              <div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}>
                <p style={{"borderRadius":"0.25rem","borderWidth":"1px","borderColor":"rgb(253,230,138)","backgroundColor":"rgb(255,251,235)","padding":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(217,119,6)"}}>
                  Warning: The selling price is higher than the compare-at price. Typically, the compare-at price should be the higher, original MRP.
                </p>
              </div>
            )}
          </Card>

          <Card title="Inventory" style={{"marginTop":"1rem"}}>
            <div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}>
                <span>Quantity</span>
                <input aria-label="Quantity" type="number" min="0" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} inputMode="numeric" style={{...inputStyle, ...(Number(quantity) <= 5 ? {borderColor: 'rgb(248,113,113)', backgroundColor: 'rgb(254,242,242)', color: 'rgb(185,28,28)'} : {})}} />
              </label>
              <p style={{marginTop: '0.5rem', fontSize: '0.75rem', ...(Number(quantity) <= 5 ? {color: 'rgb(220,38,38)', fontWeight: '500'} : {color: 'rgba(0,0,0,0.55)'})}}>
                {Number(quantity) <= 5 ? (Number(quantity) === 0 ? "Out of stock!" : "Low stock warning.") : "Number of units currently available for sale."}
              </p>
            </div>
          </Card>

          <ProductVariantsSection />
          <ProductAdditionalDetailsSection />
          <Card title="Search engine listing" style={{"marginTop":"1rem"}} actions={<Pencil className="size-4 text-black/55" />}><p style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1.25rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>{title ? `${title} · ${selectedCategory?.title || "Choose a category"}` : "Add a title and description to see how this product might appear in a search engine listing."}</p></Card>
        </div>

        <aside style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
          <Card title="Status"><div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}><select value={status} onChange={(event) => setStatus(event.target.value)} style={inputStyle}><option value="active">Active</option><option value="draft">Draft</option></select><p style={{"marginTop":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Status will be stored when product publishing is added.</p></div></Card>
          <Card title="Home page"><div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}><HomeShowcaseToggle checked={showInBestSellers} onCheckedChange={setShowInBestSellers} /></div></Card>
          <Card title="Product organization"><div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}><div><p style={{"color":"rgb(0,0,0,0.75)"}}>Category</p><p style={{"marginTop":"0.25rem"}}>{selectedCategory?.title || "Choose a category in Product details."}</p></div><div><p style={{"color":"rgb(0,0,0,0.75)"}}>Collections and tags</p><p style={{"marginTop":"0.25rem"}}>Available when those records are added to the database.</p></div></div></Card>
        </aside>
      </div>
    </form>
  );
}
