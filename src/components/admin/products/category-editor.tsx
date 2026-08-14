"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, CirclePlus, FolderTree, ImagePlus, Search } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { uploadProductImage } from "@/lib/client/upload-product-image";

const inputClass = "h-9 w-full rounded-lg border border-black/25 bg-white px-3 text-sm outline-none focus:border-black/50";

export type CategoryProduct = {
  id: string;
  title: string;
  slug: string;
  price: string;
  image: string;
};

export type EditableCategory = {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  visible: boolean;
  description: string | null;
  image: string | null;
  productIds: string[];
};

export type CategoryOption = { id: string; title: string };

function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <section style={{"overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}><div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem"}}><h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0,0.75)"}}>{title}</h2>{action}</div>{children}</section>;
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function CategoryEditor({
  category,
  products,
  categories,
}: {
  category?: EditableCategory;
  products: CategoryProduct[];
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const isNew = !category;
  const [title, setTitle] = useState(category?.title ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [image, setImage] = useState(category?.image ?? "");
  const [parentId, setParentId] = useState(category?.parentId ?? "");
  const [visible, setVisible] = useState(category?.visible ?? true);
  const [status, setStatus] = useState(category?.visible === false ? "draft" : "active");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [productQuery, setProductQuery] = useState("");
  const [assignedProductIds, setAssignedProductIds] = useState(category?.productIds ?? []);
  const [draftProductIds, setDraftProductIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [error, setError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const assignedProducts = useMemo(() => products.filter((product) => assignedProductIds.includes(product.id)), [assignedProductIds, products]);
  const pickerProducts = useMemo(() => {
    const query = productQuery.trim().toLowerCase();
    return !query ? products : products.filter((product) => product.title.toLowerCase().includes(query));
  }, [productQuery, products]);

  function openPicker() {
    setDraftProductIds(assignedProductIds);
    setProductQuery("");
    setPickerOpen(true);
  }

  function toggleDraftProduct(productId: string) {
    setDraftProductIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
  }

  async function uploadCategoryImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsImageUploading(true);
    setError("");
    try {
      const uploadedImage = await uploadProductImage(file);
      setImage(uploadedImage.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload the category image");
    } finally {
      setIsImageUploading(false);
    }
  }

  async function saveCategory() {
    if (!title.trim() || isSaving) return;
    setIsSaving(true);
    setError("");

    try {
      const requestBody = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        description: description.trim() || null,
        image: image || null,
        parentId: parentId || null,
        visible: status === "active" && visible,
      };
      const response = await fetch(isNew ? "/api/categories" : `/api/categories/${category.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not save the category");

      const savedCategoryId = payload.data.id as string;
      const initialIds = new Set(category?.productIds ?? []);
      const productsToAdd = assignedProductIds.filter((productId) => !initialIds.has(productId));
      const assignments = await Promise.all(productsToAdd.map((productId) => fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: savedCategoryId }),
      })));
      if (assignments.some((assignment) => !assignment.ok)) throw new Error("The category was saved, but one or more products could not be assigned");

      router.push(`/dashboard/products/categories/${payload.data.slug}`);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the category");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main style={{"minHeight":"100%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
      <div style={{"marginLeft":"auto","marginRight":"auto","maxWidth":"968px"}}>
        <header style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}>
          <h1 style={{"display":"flex","alignItems":"center","gap":"0.375rem","fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600"}}><FolderTree className="size-4" /><ChevronRight className="size-4 text-black/45" />{isNew ? "Add category" : "Edit category"}</h1>
          <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}><Link href="/dashboard/products/categories" style={{"display":"inline-flex","height":"2rem","alignItems":"center","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}>Discard</Link><button type="button" disabled={!title.trim() || isSaving || isImageUploading} onClick={saveCategory} style={{"display":"inline-flex","height":"2rem","alignItems":"center","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","cursor":"not-allowed"}}>{isSaving ? "Saving…" : isNew ? "Create category" : "Save changes"}</button></div>
        </header>

        <div style={{"marginTop":"1rem","display":"grid","gap":"1rem"}}>
          <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
            <SectionCard title="Category information"><div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}><label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Projectors" className={inputClass} /></label><label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}><span>Description</span><textarea rows={6} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe this category for customers and search engines" style={{"width":"100%","resize":"none","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.5)","backgroundColor":"rgb(255,255,255)","padding":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","outline":"2px solid transparent","outlineOffset":"2px"}} /></label><div style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}><span>Category image</span><input ref={imageInputRef} type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/webp" onChange={(event) => void uploadCategoryImage(event)} style={{"position":"absolute","width":"1px","height":"1px","padding":"0","margin":"-1px","overflow":"hidden","clip":"rect(0, 0, 0, 0)","whiteSpace":"nowrap","borderWidth":"0"}} /><button type="button" onClick={() => imageInputRef.current?.click()} disabled={isImageUploading} style={{"position":"relative","display":"flex","height":"7rem","flexDirection":"column","alignItems":"center","justifyContent":"center","gap":"0.5rem","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px","borderStyle":"dashed","fontSize":"0.875rem","lineHeight":"1.25rem","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.02)","cursor":"wait"}}>{image ? <><Image src={image} alt="Category preview" fill sizes="400px" style={{"objectFit":"contain","padding":"0.5rem"}} /><span style={{"position":"relative","borderRadius":"0.25rem","backgroundColor":"rgb(255,255,255,0.9)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,0,0)"}}>Replace image</span></> : <><ImagePlus className="size-4" /><span>{isImageUploading ? "Uploading…" : "Upload image"}</span></>}</button>{image ? <button type="button" onClick={() => setImage("")} style={{"justifySelf":"start","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(220,38,38)","textDecorationLine":"underline"}}>Remove image</button> : null}<span style={{"fontSize":"0.75rem","lineHeight":"1rem"}}>Shown in category cards and storefront navigation.</span></div></div></SectionCard>

            <SectionCard title="Products" action={<button type="button" onClick={openPicker} style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}><CirclePlus className="size-3.5" />Add products</button>}><div style={{"borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)"}}><div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.6)"}}><span>{assignedProducts.length} products in this category</span><span>{products.length} products available</span></div>{assignedProducts.length ? <div style={{"borderTopWidth":"calc(1px * calc(1 - 0))","borderBottomWidth":"calc(1px * 0)","borderColor":"rgb(0,0,0,0.1)"}}>{assignedProducts.map((product) => <Link key={product.id} href={`/dashboard/products/${product.slug || product.id}`} style={{"display":"flex","alignItems":"center","gap":"0.75rem","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,91,211)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.02)"}}><Image src={product.image || "/category-smartphone.png"} alt="" width={40} height={40} style={{"flexShrink":"0","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","objectFit":"contain","padding":"0.25rem"}} /><span style={{"minWidth":"0px","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap"}}>{product.title}</span></Link>)}</div> : <div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"2.5rem","paddingBottom":"2.5rem","textAlign":"center"}}><p style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>No products in this category</p><p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Use Add products to assign products to this category.</p></div>}</div></SectionCard>

            <SectionCard title="Search engine listing"><div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}><label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}><span>URL handle</span><span style={{"display":"flex","height":"2.25rem","alignItems":"center","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.5)","backgroundColor":"rgb(255,255,255)"}}><span style={{"borderRightWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>/categories/</span><input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder={slugify(title) || "projectors"} style={{"minWidth":"0px","flex":"1 1 0%","backgroundColor":"transparent","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","outline":"2px solid transparent","outlineOffset":"2px"}} /></span></label><p style={{"fontSize":"0.75rem","lineHeight":"1rem"}}>A clear handle makes the category easier to find and share.</p></div></SectionCard>
            {error ? <p role="alert" style={{"borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(254,202,202)","backgroundColor":"rgb(254,242,242)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(153,27,27)"}}>{error}</p> : null}
          </div>

          <aside style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
            <SectionCard title="Status"><div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}><Select value={status} onValueChange={(value) => { if (value) setStatus(value); }}><SelectTrigger style={{"width":"100%","borderRadius":"0.5rem","borderColor":"rgb(0,0,0,0.25)","backgroundColor":"rgb(255,255,255) !important","color":"rgb(0,0,0)","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}><SelectValue /></SelectTrigger><SelectContent style={{"backgroundColor":"rgb(255,255,255)","color":"rgb(0,0,0)"}}><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent></Select></div></SectionCard>
            <SectionCard title="Category organization"><div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}><div style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}><span>Parent category</span><Select value={parentId || "root"} onValueChange={(value) => setParentId(value === "root" ? "" : value || "")}><SelectTrigger style={{"width":"100%","borderRadius":"0.5rem","borderColor":"rgb(0,0,0,0.25)","backgroundColor":"rgb(255,255,255) !important","color":"rgb(0,0,0)","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}><SelectValue /></SelectTrigger><SelectContent style={{"backgroundColor":"rgb(255,255,255)","color":"rgb(0,0,0)"}}><SelectItem value="root">No parent category</SelectItem>{categories.filter((option) => option.id !== category?.id).map((option) => <SelectItem key={option.id} value={option.id}>{option.title}</SelectItem>)}</SelectContent></Select></div><label style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}><span><span style={{"display":"block","fontWeight":"500"}}>Store visibility</span><span style={{"marginTop":"0.125rem","display":"block","fontSize":"0.75rem","lineHeight":"1rem"}}>Customers can browse this category.</span></span><Switch checked={visible} onCheckedChange={setVisible} aria-label="Toggle store visibility" /></label></div></SectionCard>
            <SectionCard title="Category summary"><div style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)","paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}><div style={{"display":"flex","alignItems":"center","justifyContent":"space-between"}}><span style={{"color":"rgb(0,0,0,0.6)"}}>Products added</span><span style={{"fontWeight":"600"}}>{assignedProducts.length}</span></div><div style={{"display":"flex","alignItems":"center","justifyContent":"space-between"}}><span style={{"color":"rgb(0,0,0,0.6)"}}>Storefront</span><span style={{"fontWeight":"500"}}>{visible ? "Visible" : "Hidden"}</span></div><div style={{"display":"flex","alignItems":"center","justifyContent":"space-between"}}><span style={{"color":"rgb(0,0,0,0.6)"}}>Status</span><span style={{"fontWeight":"500","textTransform":"capitalize"}}>{status}</span></div></div></SectionCard>
          </aside>
        </div>
      </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}><DialogContent showCloseButton={false} style={{"gap":"0px","overflow":"hidden","padding":"0px"}} overlayClassName="bg-black/45 supports-backdrop-filter:backdrop-blur-[1px]"><DialogHeader style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1.25rem","paddingRight":"1.25rem","paddingTop":"1rem","paddingBottom":"1rem"}}><DialogTitle style={{"fontSize":"1rem","lineHeight":"1.5rem","fontWeight":"600"}}>Add products</DialogTitle><DialogDescription>Select the products that belong to this category.</DialogDescription></DialogHeader><div style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","padding":"1rem"}}><label style={{"display":"flex","height":"2.25rem","alignItems":"center","gap":"0.5rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.5)","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}><Search className="size-4" /><input autoFocus value={productQuery} onChange={(event) => setProductQuery(event.target.value)} placeholder="Search products" style={{"minWidth":"0px","flex":"1 1 0%","backgroundColor":"transparent","outline":"2px solid transparent","outlineOffset":"2px","color":"rgb(0,0,0,0.4)"}} /></label></div><div style={{"maxHeight":"380px","overflowY":"auto"}}>{pickerProducts.map((product) => <label key={product.id} style={{"display":"flex","cursor":"pointer","alignItems":"center","gap":"0.75rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.08)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.025)"}}><input type="checkbox" checked={draftProductIds.includes(product.id)} onChange={() => toggleDraftProduct(product.id)} style={{"borderRadius":"0.25rem","accentColor":"#000"}} /><Image src={product.image || "/category-smartphone.png"} alt="" width={40} height={40} style={{"borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","objectFit":"contain","padding":"0.25rem"}} /><span style={{"minWidth":"0px","flex":"1 1 0%"}}><span style={{"display":"block","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>{product.title}</span><span style={{"marginTop":"0.125rem","display":"block","fontSize":"0.75rem","lineHeight":"1rem"}}>{product.slug} · {product.price}</span></span></label>)}{pickerProducts.length === 0 ? <p style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"2.5rem","paddingBottom":"2.5rem","textAlign":"center","fontSize":"0.875rem","lineHeight":"1.25rem"}}>No products match your search.</p> : null}</div><DialogFooter style={{"flexDirection":"row","alignItems":"center","justifyContent":"space-between","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><span style={{"fontSize":"0.75rem","lineHeight":"1rem"}}>{draftProductIds.length} selected</span><div style={{"display":"flex","gap":"0.5rem"}}><button type="button" onClick={() => setPickerOpen(false)} style={{"height":"2rem","borderRadius":"0.5rem","borderWidth":"1px","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","backgroundColor":"rgb(0,0,0,0.03)"}}>Cancel</button><button type="button" onClick={() => { setAssignedProductIds(draftProductIds); setPickerOpen(false); }} style={{"height":"2rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(255,255,255)"}}>Add products</button></div></DialogFooter></DialogContent></Dialog>
    </main>
  );
}
