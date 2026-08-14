"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, GripVertical, Save, Tag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { ProductDescriptionEditor } from "@/components/admin/products/product-description-editor";
import { HomeShowcaseToggle } from "@/components/admin/products/home-showcase-toggle";
import { ProductMediaUploader } from "@/components/admin/products/product-media-uploader";
import { uploadProductImage } from "@/lib/client/upload-product-image";
import { parsePriceNumber } from "@/lib/format-price";
import { ProductFeaturesSection } from "@/components/admin/products/product-features-section";

type CategoryOption = {
  id: string;
  title: string;
};

type EditableProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string;
  oldPrice: string | null;
  mainImage: string;
  categoryId: string;
  quantity: number;
  showInBestSellers: boolean;
  category: { title: string } | null;
  media: { id: string; url: string; sortOrder: number }[];
  features?: { featureText: string }[];
};

type ExistingMediaItem = {
  id?: string;
  url: string;
};

const inputStyle = { height: '2.5rem', width: '100%', borderRadius: '0.5rem', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(0,0,0,0.25)', backgroundColor: 'white', paddingLeft: '0.75rem', paddingRight: '0.75rem', fontSize: '0.875rem', outline: 'none' };

function inputValueForPrice(value: string | null) {
  return value?.replace(/[^0-9.]/g, "") ?? "";
}

function formatPrice(value: string) {
  return `₹${Number(value).toFixed(2)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getExistingMedia(product: EditableProduct): ExistingMediaItem[] {
  const mediaByUrl = new Map(product.media.map((media) => [media.url, media]));
  const seenUrls = new Set<string>();

  return [product.mainImage, ...product.media.map((media) => media.url)].flatMap((url) => {
    if (!url || seenUrls.has(url)) return [];

    seenUrls.add(url);
    return [{ id: mediaByUrl.get(url)?.id, url }];
  });
}

function confirmDiscardChanges() {
  return window.confirm(
    "You have unsaved changes. Press Cancel to stay and save them, or OK to discard your changes."
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{"overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
      <h2 style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0,0.75)"}}>{title}</h2>
      <div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}>{children}</div>
    </section>
  );
}

export function EditProductForm({ product, categories }: { product: EditableProduct; categories: CategoryOption[] }) {
  const router = useRouter();
  const [title, setTitle] = useState(product.name);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(inputValueForPrice(product.price));
  const [compareAtPrice, setCompareAtPrice] = useState(inputValueForPrice(product.oldPrice));
  const [quantity, setQuantity] = useState(String(product.quantity));
  const [showInBestSellers, setShowInBestSellers] = useState(product.showInBestSellers);
  const [orderedMedia, setOrderedMedia] = useState<ExistingMediaItem[]>(() => getExistingMedia(product));
  const [draggedMediaIndex, setDraggedMediaIndex] = useState<number | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>(() => product.features?.map(f => f.featureText) || []);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const isRestoringHistoryRef = useRef(false);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId),
    [categories, categoryId]
  );
  const isDirty = useMemo(() => {
    const initialMedia = getExistingMedia(product);
    const mediaChanged =
      initialMedia.length !== orderedMedia.length ||
      initialMedia.some((media, index) => {
        const currentMedia = orderedMedia[index];
        return currentMedia?.url !== media.url || currentMedia?.id !== media.id;
      });
    const featuresChanged = 
      features.length !== (product.features?.length || 0) ||
      features.some((f, i) => f !== product.features?.[i]?.featureText);

    return (
      title !== product.name ||
      categoryId !== product.categoryId ||
      description !== product.description ||
      price !== inputValueForPrice(product.price) ||
      compareAtPrice !== inputValueForPrice(product.oldPrice) ||
      quantity !== String(product.quantity) ||
      showInBestSellers !== product.showInBestSellers ||
      mediaChanged ||
      featuresChanged ||
      mediaFiles.length > 0
    );
  }, [categoryId, compareAtPrice, description, features, mediaFiles.length, orderedMedia, price, product, quantity, showInBestSellers, title]);

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return;

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href === window.location.pathname) return;

      if (!confirmDiscardChanges()) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return;

    const handlePopState = () => {
      if (isRestoringHistoryRef.current) {
        isRestoringHistoryRef.current = false;
        return;
      }

      if (!confirmDiscardChanges()) {
        isRestoringHistoryRef.current = true;
        window.history.forward();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDirty]);

  function moveMedia(fromIndex: number, toIndex: number) {
    setOrderedMedia((current) => {
      if (fromIndex === toIndex || toIndex < 0 || toIndex >= current.length) return current;

      const next = [...current];
      const [movedMedia] = next.splice(fromIndex, 1);
      if (!movedMedia) return current;

      next.splice(toIndex, 0, movedMedia);
      return next;
    });
  }

  function removeMedia(index: number) {
    setOrderedMedia((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericPrice = Number(price);
    const numericCompareAtPrice = compareAtPrice.trim() ? Number(compareAtPrice) : undefined;
    const numericQuantity = Number(quantity);
    const slug = slugify(title);

    if (!title.trim() || !description.trim() || !categoryId || !slug || !Number.isFinite(numericPrice) || numericPrice < 0 || !Number.isSafeInteger(numericQuantity) || numericQuantity < 0) {
      setMessage("Add a title, category, description, valid price, and whole-number quantity before saving.");
      return;
    }
    if (numericCompareAtPrice !== undefined && (!Number.isFinite(numericCompareAtPrice) || numericCompareAtPrice < 0)) {
      setMessage("Enter a valid compare-at price or leave it blank.");
      return;
    }

    setIsSaving(true);
    setMessage("");
    try {
      const nextMediaSortOrder = Math.max(
        orderedMedia.length,
        ...product.media.map((media) => media.sortOrder + 1)
      );
      const uploadedMedia = await Promise.all(
        mediaFiles.map(async (file, index) => ({
          ...(await uploadProductImage(file)),
          mimeType: file.type,
          sortOrder: nextMediaSortOrder + index,
        }))
      );
      const removedMediaIds = product.media
        .filter((media) => !orderedMedia.some((currentMedia) => currentMedia.id === media.id))
        .map((media) => media.id);
      const response = await fetch(`/api/products/${encodeURIComponent(product.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title.trim(),
          slug,
          categoryId,
          description: description.trim(),
          price: formatPrice(price),
          oldPrice: numericCompareAtPrice === undefined ? null : formatPrice(compareAtPrice),
          quantity: numericQuantity,
          showInBestSellers,
          mainImage: orderedMedia[0]?.url ?? uploadedMedia[0]?.url ?? "",
          newMedia: uploadedMedia,
          removeMediaIds: removedMediaIds,
          mediaOrder: orderedMedia.flatMap((media, sortOrder) =>
            media.id ? [{ id: media.id, sortOrder }] : []
          ),
          features: features.map(f => f.trim()).filter(f => f !== ""),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to save changes");
      }

      router.push("/dashboard/products");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save changes");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}>
        <div>
          <h1 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600"}}><Tag className="size-4" /> Edit product</h1>
          <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Editing {product.name}</p>
        </div>
        <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
          <Link href={`/product/${product.slug}`} target="_blank" style={{"display":"inline-flex","height":"2.25rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}><ExternalLink className="size-3.5" /> Store</Link>
          {isDirty ? <span aria-live="polite" style={{"display":"none","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(180,83,9)"}}>Unsaved changes</span> : null}
          <button type="submit" disabled={isSaving || !isDirty} style={{"display":"inline-flex","height":"2.25rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"1rem","paddingRight":"1rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(255,255,255)","cursor":"not-allowed"}}><Save className="size-3.5" /> {isSaving ? "Saving…" : "Save changes"}</button>
        </div>
      </div>

      {message ? <p role="alert" style={{"marginTop":"0.75rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(254,202,202)","backgroundColor":"rgb(254,242,242)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(153,27,27)"}}>{message}</p> : null}

      <div style={{"marginTop":"1rem","display":"grid","gap":"1rem"}}>
        <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
          <Card title="Product details">
            <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} style={inputStyle} /></label>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}><span>Category</span><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} style={inputStyle}>{categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}</select></label>
            </div>
          </Card>
          <Card title="Description"><ProductDescriptionEditor value={description} onChange={setDescription} /></Card>
          <ProductFeaturesSection features={features} onChange={setFeatures} />
          <Card title="Media">
            <div style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","gap":"0.75rem"}}>
              {orderedMedia.map((media, index) => (
                <div
                  key={media.url}
                  draggable
                  onDragStart={(event) => {
                    setDraggedMediaIndex(index);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", media.url);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (draggedMediaIndex !== null) moveMedia(draggedMediaIndex, index);
                    setDraggedMediaIndex(null);
                  }}
                  onDragEnd={() => setDraggedMediaIndex(null)}
                  className={`group relative aspect-square cursor-grab overflow-hidden rounded-lg border bg-[#fafafa] transition ${
                    draggedMediaIndex === index
                      ? "border-black/30 opacity-45"
                      : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <Image src={media.url || "/category-smartphone.png"} alt={`${title} image ${index + 1}`} fill style={{"objectFit":"contain","padding":"0.25rem"}} />
                  {index === 0 ? <span style={{"position":"absolute","bottom":"0.25rem","left":"0.25rem","borderRadius":"0.25rem","backgroundColor":"rgb(0,0,0,0.7)","paddingLeft":"0.375rem","paddingRight":"0.375rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"10px","fontWeight":"500","color":"rgb(255,255,255)"}}>Primary</span> : null}
                  <div style={{"position":"absolute","right":"0.25rem","top":"0.25rem","display":"flex","alignItems":"center","borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255,0.95)","padding":"0.125rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
                    <GripVertical aria-hidden="true" className="size-3.5 text-black/45" />
                    <button type="button" aria-label={`Move image ${index + 1} earlier`} disabled={index === 0} onClick={() => moveMedia(index, index - 1)} style={{"borderRadius":"0.25rem","padding":"0.125rem","color":"rgb(0,0,0,0.6)","backgroundColor":"rgb(0,0,0,0.06)","cursor":"not-allowed","opacity":"0.25"}}><ArrowLeft className="size-3.5" /></button>
                    <button type="button" aria-label={`Move image ${index + 1} later`} disabled={index === orderedMedia.length - 1} onClick={() => moveMedia(index, index + 1)} style={{"borderRadius":"0.25rem","padding":"0.125rem","color":"rgb(0,0,0,0.6)","backgroundColor":"rgb(0,0,0,0.06)","cursor":"not-allowed","opacity":"0.25"}}><ArrowRight className="size-3.5" /></button>
                    <button type="button" aria-label={`Delete image ${index + 1}`} title="Delete image" onPointerDown={(event) => event.stopPropagation()} onClick={() => removeMedia(index)} style={{"borderRadius":"0.25rem","padding":"0.125rem","color":"rgb(220,38,38)","backgroundColor":"rgb(254,242,242)"}}><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
            <p style={{"marginTop":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.6)"}}>Drag images to reorder them or use the arrows. The first image is the primary product image.</p>
            <div style={{"marginTop":"1rem"}}><ProductMediaUploader onFilesChange={setMediaFiles} /></div>
          </Card>
          <Card title="Price">
            <div style={{"display":"grid","gap":"1rem"}}>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}><span>Price</span><span style={{"position":"relative"}}><span style={{"position":"absolute","left":"0.75rem","top":"50%","transform":"translate(0, -50%) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)","fontSize":"0.875rem","lineHeight":"1.25rem"}}>₹</span><input value={price} onChange={(event) => setPrice(event.target.value)} inputMode="decimal" style={{...inputStyle, paddingLeft: '1.75rem'}} /></span></label>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}><span>Compare-at price</span><span style={{"position":"relative"}}><span style={{"position":"absolute","left":"0.75rem","top":"50%","transform":"translate(0, -50%) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)","fontSize":"0.875rem","lineHeight":"1.25rem"}}>₹</span><input value={compareAtPrice} onChange={(event) => setCompareAtPrice(event.target.value)} inputMode="decimal" placeholder="0.00" style={{...inputStyle, paddingLeft: '1.75rem'}} /></span></label>
            </div>
            {parsePriceNumber(price) > parsePriceNumber(compareAtPrice) && parsePriceNumber(compareAtPrice) > 0 && (
              <p style={{"marginTop":"0.75rem","borderRadius":"0.25rem","borderWidth":"1px","borderColor":"rgb(253,230,138)","backgroundColor":"rgb(255,251,235)","padding":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(217,119,6)"}}>
                Warning: The selling price is higher than the compare-at price. Typically, the compare-at price should be the higher, original MRP.
              </p>
            )}
          </Card>
          <Card title="Inventory">
            <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}>
              <span>Quantity</span>
              <input aria-label="Quantity" type="number" min="0" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} inputMode="numeric" style={{...inputStyle, ...(Number(quantity) <= 5 ? {borderColor: 'rgb(248,113,113)', backgroundColor: 'rgb(254,242,242)', color: 'rgb(185,28,28)'} : {})}} />
            </label>
            <p style={{marginTop: '0.5rem', fontSize: '0.75rem', ...(Number(quantity) <= 5 ? {color: 'rgb(220,38,38)', fontWeight: '500'} : {color: 'rgba(0,0,0,0.55)'})}}>
              {Number(quantity) <= 5 ? (Number(quantity) === 0 ? "Out of stock!" : "Low stock warning.") : "Number of units currently available for sale."}
            </p>
          </Card>
        </div>

        <aside style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
          <Card title="Home page">
            <HomeShowcaseToggle checked={showInBestSellers} onCheckedChange={setShowInBestSellers} />
          </Card>
          <Card title="Product organization">
            <dl style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)","fontSize":"0.875rem","lineHeight":"1.25rem"}}><div><dt className="text-black/55">Category</dt><dd style={{"marginTop":"0.25rem","fontWeight":"500"}}>{selectedCategory?.title || product.category?.title || "Uncategorized"}</dd></div><div><dt className="text-black/55">Handle</dt><dd style={{"marginTop":"0.25rem","wordBreak":"break-all","fontWeight":"500"}}>{slugify(title) || product.slug}</dd></div></dl>
          </Card>
        </aside>
      </div>
    </form>
  );
}
