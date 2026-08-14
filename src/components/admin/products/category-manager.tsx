"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  ChevronsUpDown,
  Columns3,
  FolderTree,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"

import { Switch } from "@/components/ui/switch"

export type ManagedCategory = {
  id: string
  title: string
  slug: string
  parentId: string | null
  productCount: number
  visible: boolean
  image: string | null
}

export function CategoryManager({ initialCategories = [] }: { initialCategories?: ManagedCategory[] }) {
  const [categories, setCategories] = useState<ManagedCategory[]>(() => initialCategories ?? [])
  const [query, setQuery] = useState("")
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const selectAllRef = useRef<HTMLInputElement>(null)
  const categoryList = categories ?? []
  const visibleCategories = categoryList.filter((category) =>
    category.title.toLowerCase().includes(query.trim().toLowerCase())
  )
  const allVisibleSelected = visibleCategories.length > 0 && visibleCategories.every((category) => selectedCategoryIds.includes(category.id))
  const someVisibleSelected = visibleCategories.some((category) => selectedCategoryIds.includes(category.id))
  const parentTitle = (parentId: string | null) =>
    categoryList.find((category) => category.id === parentId)?.title ?? "—"

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someVisibleSelected && !allVisibleSelected
    }
  }, [allVisibleSelected, someVisibleSelected])

  function toggleCategorySelection(categoryId: string, selected: boolean) {
    setSelectedCategoryIds((current) => selected
      ? current.includes(categoryId) ? current : [...current, categoryId]
      : current.filter((id) => id !== categoryId)
    )
  }

  function toggleVisibleCategorySelection(selected: boolean) {
    const visibleIds = new Set(visibleCategories.map((category) => category.id))
    setSelectedCategoryIds((current) => selected
      ? Array.from(new Set([...current, ...visibleIds]))
      : current.filter((id) => !visibleIds.has(id))
    )
  }

  async function toggleVisibility(category: ManagedCategory, visible: boolean) {
    const previousCategories = categories
    setCategories((current) => current.map((item) => item.id === category.id ? { ...item, visible } : item))

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible }),
      })
      if (!response.ok) throw new Error("Could not update category visibility")
    } catch {
      setCategories(previousCategories)
    }
  }

  async function deleteCategory(category: ManagedCategory) {
    if (!window.confirm(`Delete ${category.title}?`)) return

    try {
      const response = await fetch(`/api/categories/${category.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Could not delete category")
      setCategories((current) => current.filter((item) => item.id !== category.id))
    } catch {
      window.alert("This category could not be deleted. Remove or reassign its products first.")
    }
  }

  return (
    <main style={{"minHeight":"100%","flex":"1 1 0%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
      <div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}>
        <h1 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600"}}>
          <FolderTree className="size-4" />
          Categories
        </h1>
        <Link
          href="/dashboard/products/categories/new"
          style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
        >
          <Plus className="size-3.5" />
          Add category
        </Link>
      </div>

      <section style={{"marginTop":"0.75rem","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
        <div style={{"display":"flex","alignItems":"center","gap":"0.75rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
          <button type="button" style={{"display":"inline-flex","alignItems":"center","gap":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}>
            All
            <ChevronsUpDown className="size-3.5" />
          </button>
          <label style={{"display":"flex","flex":"1 1 0%","alignItems":"center","gap":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.5)"}}>
            <Search className="size-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search and filter categories"
              placeholder="Search and filter"
              style={{"width":"100%","backgroundColor":"transparent","outline":"2px solid transparent","outlineOffset":"2px"}}
            />
          </label>
          <button
            type="button"
            aria-label="Choose category columns"
            style={{"borderRadius":"0.375rem","borderLeftWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","color":"rgb(0,0,0)"}}
          >
            <Columns3 className="size-4" />
          </button>
        </div>

        <div style={{"overflowX":"auto"}}>
          <table style={{"width":"100%","minWidth":"800px","borderCollapse":"collapse","textAlign":"left","fontSize":"0.75rem","lineHeight":"1rem"}}>
            <thead style={{"backgroundColor":"rgb(0,0,0,0.025)"}}>
              <tr>
                <th style={{"width":"3rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500"}}><input ref={selectAllRef} type="checkbox" checked={allVisibleSelected} onChange={(event) => toggleVisibleCategorySelection(event.target.checked)} aria-label="Select all visible categories" /></th>
                <th style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500"}}>Category</th>
                <th style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500"}}>Parent</th>
                <th style={{"width":"5rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500"}}>Products</th>
                <th style={{"width":"10rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500"}}>Store visibility</th>
                <th style={{"width":"6rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500"}} />
              </tr>
            </thead>
            <tbody>
              {visibleCategories.map((category) => (
                <tr key={category.id} style={{"backgroundColor":"rgb(0,0,0,0.02)"}}>
                  <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem"}}><input type="checkbox" checked={selectedCategoryIds.includes(category.id)} onChange={(event) => toggleCategorySelection(category.id, event.target.checked)} aria-label={`Select ${category.title}`} /></td>
                  <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem"}}>
                    <Link href={`/dashboard/products/categories/${category.id}`} style={{"display":"flex","alignItems":"center","gap":"0.75rem","fontWeight":"500","color":"rgb(12,49,82)","textDecorationLine":"underline"}}>
                      <span style={{"position":"relative","display":"flex","flexShrink":"0","alignItems":"center","justifyContent":"center","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(0,0,0,0.04)","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0,0.6)"}}>{category.image ? <Image src={category.image} alt="" fill sizes="40px" style={{"objectFit":"contain","padding":"0.25rem"}} /> : category.title.slice(0, 1)}</span>
                      <span><span style={{"display":"block"}}>{category.title}</span><span style={{"marginTop":"0.25rem","display":"block","fontSize":"11px","fontWeight":"400"}}>/categories/{category.slug}</span></span>
                    </Link>
                  </td>
                  <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem"}}>{parentTitle(category.parentId)}</td>
                  <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem"}}>{category.productCount}</td>
                  <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem"}}>
                    <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}><Switch checked={category.visible} onCheckedChange={(checked) => void toggleVisibility(category, checked)} aria-label={`Toggle ${category.title} visibility`} /><span style={{"color":"rgb(0,0,0,0.6)"}}>{category.visible ? "Visible" : "Hidden"}</span></div>
                  </td>
                  <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem"}}>
                    <div style={{"display":"flex","alignItems":"center","gap":"0.25rem"}}><Link href={`/dashboard/products/categories/${category.id}`} aria-label={`Edit ${category.title}`} style={{"borderRadius":"0.375rem","padding":"0.375rem","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.06)"}}><Pencil className="size-3.5" /></Link><button type="button" onClick={() => void deleteCategory(category)} aria-label={`Delete ${category.title}`} style={{"borderRadius":"0.375rem","padding":"0.375rem","color":"rgb(220,38,38)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(254,242,242)"}}><Trash2 className="size-3.5" /></button></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visibleCategories.length === 0 ? <p style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"3rem","paddingBottom":"3rem","textAlign":"center","fontSize":"0.875rem","lineHeight":"1.25rem"}}>No categories match your search.</p> : null}
      </section>
    </main>
  )
}
