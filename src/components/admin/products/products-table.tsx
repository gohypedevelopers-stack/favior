"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";

export type ProductTableItem = {
  id: string;
  slug: string;
  name: string;
  price: string;
  mainImage: string;
  quantity: number;
  category: { title: string } | null;
};

export function ProductsTable({ products }: { products: ProductTableItem[] }) {
  const router = useRouter();
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category?.title || "Electronics"))].sort(),
    [products]
  );
  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const category = product.category?.title || "Electronics";
      const matchesCategory = categoryFilter === "all" || category === categoryFilter;
      const matchesQuery = !normalizedQuery || [product.name, category, product.price, "Favior"]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [categoryFilter, products, searchQuery]);

  const selectedVisibleCount = filteredProducts.filter((product) => selectedIds.has(product.id)).length;
  const isAllVisibleSelected = filteredProducts.length > 0 && selectedVisibleCount === filteredProducts.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectedVisibleCount > 0 && !isAllVisibleSelected;
    }
  }, [isAllVisibleSelected, selectedVisibleCount]);

  function toggleProduct(productId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }

  function selectVisibleProducts() {
    setSelectedIds((current) => {
      const next = new Set(current);
      filteredProducts.forEach((product) => next.add(product.id));
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((current) => {
      const next = new Set(current);
      filteredProducts.forEach((product) => {
        if (isAllVisibleSelected) next.delete(product.id);
        else next.add(product.id);
      });
      return next;
    });
  }

  async function deleteSelectedProducts() {
    const productIds = Array.from(selectedIds);
    if (productIds.length === 0) return;

    const productLabel = productIds.length === 1 ? "this product" : `${productIds.length} products`;
    if (!window.confirm(`Delete ${productLabel}? This cannot be undone.`)) return;

    setIsDeleting(true);
    setDeleteError("");
    try {
      const results = await Promise.all(
        productIds.map(async (productId) => {
          try {
            const response = await fetch(`/api/products/${encodeURIComponent(productId)}`, { method: "DELETE" });
            return { productId, success: response.ok };
          } catch {
            return { productId, success: false };
          }
        })
      );
      const failedIds = results.filter((result) => !result.success).map((result) => result.productId);

      setSelectedIds(new Set(failedIds));
      if (failedIds.length > 0) {
        setDeleteError(`${failedIds.length} product${failedIds.length === 1 ? "" : "s"} could not be deleted. Please try again.`);
      }
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section style={{"marginTop":"1rem","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
      <div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","gap":"0.75rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
        <span style={{"display":"inline-flex","alignItems":"center","gap":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}>All products</span>
        <div style={{"display":"flex","flex":"1 1 0%","alignItems":"center","gap":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.5)"}}>
          <Search className="size-4" />
          <input
            aria-label="Search and filter products"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search and filter"
            style={{"width":"100%","backgroundColor":"transparent","outline":"2px solid transparent","outlineOffset":"2px"}}
          />
        </div>
        {selectedIds.size > 0 ? (
          <>
            <div style={{"display":"inline-flex","alignItems":"center","gap":"0.5rem","borderRadius":"0.375rem","backgroundColor":"rgb(0,0,0,0.05)","paddingLeft":"0.625rem","paddingRight":"0.625rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}>
              {selectedIds.size} selected
              <button type="button" onClick={() => setSelectedIds(new Set())} style={{"borderRadius":"0.25rem","padding":"0.125rem","backgroundColor":"rgb(0,0,0,0.1)"}} aria-label="Clear selected products"><X className="size-3.5" /></button>
            </div>
            <button type="button" onClick={deleteSelectedProducts} disabled={isDeleting} style={{"display":"inline-flex","height":"1.75rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.375rem","backgroundColor":"rgb(252,165,165)","paddingLeft":"0.625rem","paddingRight":"0.625rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","cursor":"not-allowed"}}><Trash2 className="size-3.5" /> {isDeleting ? "Deleting…" : "Delete"}</button>
          </>
        ) : null}
        <div style={{"position":"relative"}}>
          <button
            type="button"
            aria-label="Filter products"
            aria-expanded={isFilterOpen}
            onClick={() => {
              setIsFilterOpen((open) => !open);
              setIsMoreOpen(false);
            }}
            style={{"borderRadius":"0.375rem","padding":"0.375rem","backgroundColor":"rgb(0,0,0,0.05)"}}
          >
            <SlidersHorizontal className="size-4" />
          </button>
          {isFilterOpen ? (
            <div style={{"position":"absolute","right":"0px","top":"100%","zIndex":"10","marginTop":"0.5rem","width":"14rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"0.75rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0,0,0,0.1), 0 4px 6px -4px rgb(0,0,0,0.1)"}}>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,0,0,0.7)"}}>
                Category
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} style={{"height":"2rem","borderRadius":"0.375rem","borderWidth":"1px","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.5rem","paddingRight":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","outline":"2px solid transparent","outlineOffset":"2px","borderColor":"rgb(0,0,0,0.4)"}}>
                  <option value="all">All categories</option>
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>
              <button type="button" onClick={() => { setCategoryFilter("all"); setIsFilterOpen(false); }} style={{"marginTop":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,0,0)"}}>Clear filter</button>
            </div>
          ) : null}
        </div>
        <div style={{"position":"relative"}}>
          <button
            type="button"
            aria-label="More product options"
            aria-expanded={isMoreOpen}
            onClick={() => {
              setIsMoreOpen((open) => !open);
              setIsFilterOpen(false);
            }}
            style={{"borderRadius":"0.375rem","padding":"0.375rem","backgroundColor":"rgb(0,0,0,0.05)"}}
          >
            <MoreHorizontal className="size-4" />
          </button>
          {isMoreOpen ? (
            <div style={{"position":"absolute","right":"0px","top":"100%","zIndex":"10","marginTop":"0.5rem","width":"11rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"0.25rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0,0,0,0.1), 0 4px 6px -4px rgb(0,0,0,0.1)"}}>
              <button type="button" onClick={() => { selectVisibleProducts(); setIsMoreOpen(false); }} style={{"width":"100%","borderRadius":"0.375rem","paddingLeft":"0.625rem","paddingRight":"0.625rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","textAlign":"left","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","backgroundColor":"rgb(0,0,0,0.05)"}}>Select all shown</button>
              <button type="button" onClick={() => { setSelectedIds(new Set()); setIsMoreOpen(false); }} style={{"width":"100%","borderRadius":"0.375rem","paddingLeft":"0.625rem","paddingRight":"0.625rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","textAlign":"left","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","backgroundColor":"rgb(0,0,0,0.05)"}}>Clear selection</button>
            </div>
          ) : null}
        </div>
      </div>
      {deleteError ? <p role="alert" style={{"borderBottomWidth":"1px","borderColor":"rgb(254,202,202)","backgroundColor":"rgb(254,242,242)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(153,27,27)"}}>{deleteError}</p> : null}
      <div style={{"overflowX":"auto"}}>
        <table style={{"width":"100%","minWidth":"1100px","borderCollapse":"collapse","textAlign":"left","fontSize":"0.75rem","lineHeight":"1rem"}}>
          <thead style={{"backgroundColor":"rgb(0,0,0,0.025)"}}>
            <tr>
              {["", "Product", "Status", "Price", "Category", "Stock", "Actions"].map(
                (heading, index) => (
                  <th key={`${heading}-${index}`} style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500"}}>
                    {index === 0 ? <input ref={selectAllRef} type="checkbox" checked={isAllVisibleSelected} onChange={toggleSelectAll} aria-label="Select all products" /> : heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const itemSlugOrId = product.slug || product.id;
              const isSelected = selectedIds.has(product.id);
              return (
                <tr key={product.id} className={`transition-colors hover:bg-black/[0.02] ${isSelected ? "bg-[#0a7ae6]/[0.04]" : ""}`}>
                  <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem"}}><input type="checkbox" checked={isSelected} onChange={() => toggleProduct(product.id)} aria-label={`Select ${product.name}`} /></td>
                  <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem"}}>
                    <Link href={`/dashboard/products/${itemSlugOrId}`} style={{"display":"flex","alignItems":"center","gap":"0.75rem","fontWeight":"500","color":"rgb(10,122,230)","textDecorationLine":"underline"}}>
                      <div style={{"position":"relative","flexShrink":"0","overflow":"hidden","borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(250,250,250)"}}><Image src={product.mainImage || "/category-smartphone.png"} alt={product.name} fill style={{"objectFit":"contain","padding":"0.25rem"}} /></div>
                      <span style={{"maxWidth":"220px","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap"}}>{product.name}</span>
                    </Link>
                  </td>
                  <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem"}}><span style={{"borderRadius":"9999px","backgroundColor":"rgb(209,250,229)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"11px","fontWeight":"500","color":"rgb(6,95,70)"}}>Active</span></td>
                  <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontWeight":"500"}}>{product.price}</td>
                  <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem"}}>{product.category?.title || "Electronics"}</td>
                  <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem"}}>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        product.quantity === 0
                          ? "bg-red-100 text-red-800"
                          : product.quantity <= 5
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {product.quantity === 0 ? "Out of stock" : `${product.quantity} in stock`}
                    </span>
                  </td>
                  <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem"}}><Link href={`/product/${itemSlugOrId}`} target="_blank" style={{"borderRadius":"0.25rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(0,0,0,0.05)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontSize":"11px","fontWeight":"500","color":"rgb(0,0,0,0.7)"}}>Store</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredProducts.length === 0 ? <p style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"2rem","paddingBottom":"2rem","textAlign":"center","fontSize":"0.875rem","lineHeight":"1.25rem"}}>No products match your search or filter.</p> : null}
      <div style={{"display":"flex","alignItems":"center","gap":"0.25rem","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.6)"}}>
        <button type="button" disabled aria-label="Previous page" style={{"borderRadius":"0.375rem","backgroundColor":"rgb(0,0,0,0.05)","padding":"0.25rem","opacity":"0.4"}}><ChevronLeft className="size-4" /></button>
        <button type="button" disabled aria-label="Next page" style={{"borderRadius":"0.375rem","backgroundColor":"rgb(0,0,0,0.05)","padding":"0.25rem","opacity":"0.4"}}><ChevronRight className="size-4" /></button>
        <span style={{"marginLeft":"0.25rem"}}>1–{filteredProducts.length} of {products.length}</span>
      </div>
    </section>
  );
}
