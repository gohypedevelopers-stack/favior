"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronDown,
  ChevronRight,
  Check,
  CirclePlus,
  Grid2X2,
  ImageUp,
  LayoutList,
  Link2,
  Pencil,
  Search,
  SlidersHorizontal,
  Tag,
  X,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const availableProducts = [
  ["FAVIOR BAMBOO CREW TEE 1.0", "product9.png"],
  ["FAVIOR BAMBOO TEE 1.0", "product8.png"],
  ["FAVIOR PIN TUCK PANTS", "product7.png"],
  ["FAVIOR RIBBED MUSCLE TANK", "product6.png"],
  ["FAVIOR EASE PANTS", "product5.png"],
  ["FAVIOR ALDEN SUEDE SLIDES", "product4.png"],
  ["FAVIOR BLACK RESERVE DENIM", "product3.png"],
  ["FAVIOR INDIGO RESERVE DENIM", "product2.png"],
  ["FAVIOR STUDIO SNEAKERS", "product1.png"],
] as const

type Product = (typeof availableProducts)[number]

type CollectionSource = {
  id: string
  title: string
  image: string
  products: Product[]
}

const collectionSources: CollectionSource[] = [
  { id: "best-sellers", title: "BEST SELLERS", image: "product1.png", products: [availableProducts[0], availableProducts[1], availableProducts[3], availableProducts[8]] },
  { id: "clothing", title: "CLOTHING", image: "product7.png", products: [availableProducts[0], availableProducts[2], availableProducts[3], availableProducts[4]] },
  { id: "new-drop", title: "NEW DROP", image: "product8.png", products: [availableProducts[1], availableProducts[6], availableProducts[7]] },
  { id: "denim", title: "DENIM", image: "product3.png", products: [availableProducts[6], availableProducts[7]] },
  { id: "footwear", title: "FOOTWEAR", image: "product4.png", products: [availableProducts[5], availableProducts[8]] },
  { id: "everyday-essentials", title: "EVERYDAY ESSENTIALS", image: "product9.png", products: [availableProducts[0], availableProducts[1], availableProducts[4]] },
]

const sortOptions = [
  "Most relevant",
  "Best selling",
  "Product title A-Z",
  "Product title Z-A",
  "Highest price",
  "Lowest price",
  "Newest",
  "Oldest",
  "Manually",
] as const

type SortOption = (typeof sortOptions)[number]

const productSortMetrics: Record<string, { sales: number; price: number; created: number }> = {
  "FAVIOR BAMBOO CREW TEE 1.0": { sales: 43, price: 1499, created: 2 },
  "FAVIOR BAMBOO TEE 1.0": { sales: 84, price: 1299, created: 7 },
  "FAVIOR PIN TUCK PANTS": { sales: 37, price: 2599, created: 3 },
  "FAVIOR RIBBED MUSCLE TANK": { sales: 66, price: 999, created: 8 },
  "FAVIOR EASE PANTS": { sales: 29, price: 2899, created: 4 },
  "FAVIOR ALDEN SUEDE SLIDES": { sales: 51, price: 2199, created: 5 },
  "FAVIOR BLACK RESERVE DENIM": { sales: 72, price: 3499, created: 1 },
  "FAVIOR INDIGO RESERVE DENIM": { sales: 58, price: 3299, created: 6 },
  "FAVIOR STUDIO SNEAKERS": { sales: 91, price: 3999, created: 9 },
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm ${className}`}>{children}</section>
}

function ProductSkeletons() {
  return (
    <div style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","gap":"0.75rem","padding":"1rem"}}>
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} style={{"overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.07)"}}>
          <div style={{"aspectRatio":"1 / 1","animation":"pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite","backgroundColor":"rgb(0,0,0,0.025)"}} />
          <div style={{"marginTop":"calc(0.5rem * calc(1 - 0))","marginBottom":"calc(0.5rem * 0)","padding":"0.625rem"}}><div style={{"height":"0.625rem","width":"100%","animation":"pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite","borderRadius":"0.25rem","backgroundColor":"rgb(0,0,0,0.025)"}} /><div style={{"height":"0.625rem","width":"66.666667%","animation":"pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite","borderRadius":"0.25rem","backgroundColor":"rgb(0,0,0,0.025)"}} /></div>
        </div>
      ))}
    </div>
  )
}

function ProductPicker({
  open,
  onOpenChange,
  picked,
  onDone,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  picked: Product[]
  onDone: (products: Product[]) => void
}) {
  const [search, setSearch] = React.useState("")
  const [draft, setDraft] = React.useState<Product[]>(picked)

  const visibleProducts = availableProducts.filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
  const toggleProduct = (product: Product) => {
    setDraft((current) => current.some(([name]) => name === product[0]) ? current.filter(([name]) => name !== product[0]) : [...current, product])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{"maxWidth":"calc(100% - 2rem)","gap":"0px","overflow":"hidden","padding":"0px"}} showCloseButton={false} overlayClassName="bg-black/45 supports-backdrop-filter:backdrop-blur-[1px]">
        <DialogHeader style={{"flexDirection":"row","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1.25rem","paddingRight":"1.25rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
          <div><DialogTitle style={{"fontSize":"1rem","lineHeight":"1.5rem","fontWeight":"600"}}>Select products to include</DialogTitle><DialogDescription style={{"position":"absolute","width":"1px","height":"1px","padding":"0","margin":"-1px","overflow":"hidden","clip":"rect(0, 0, 0, 0)","whiteSpace":"nowrap","borderWidth":"0"}}>Choose the products that belong to this collection.</DialogDescription></div>
          <button type="button" onClick={() => { setDraft(picked); onOpenChange(false) }} aria-label="Close product picker" style={{"borderRadius":"0.375rem","padding":"0.25rem","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)","color":"rgb(0,0,0)"}}><X className="size-5" /></button>
        </DialogHeader>
        <div style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
          <div style={{"display":"flex","gap":"0.5rem"}}>
            <label style={{"display":"flex","height":"2.25rem","minWidth":"0px","flex":"1 1 0%","alignItems":"center","gap":"0.5rem","borderRadius":"0.5rem","borderWidth":"1px","paddingLeft":"0.75rem","paddingRight":"0.75rem","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000","borderColor":"rgb(0,0,0)"}}><Search className="size-4 text-black/55" /><input value={search} onChange={(event) => setSearch(event.target.value)} autoFocus placeholder="Search products" style={{"minWidth":"0px","flex":"1 1 0%","backgroundColor":"transparent","fontSize":"0.875rem","lineHeight":"1.25rem","outline":"2px solid transparent","outlineOffset":"2px"}} /></label>
            <button type="button" style={{"display":"none","height":"2.25rem","alignItems":"center","gap":"0.25rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.25)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>Search by All <ChevronDown className="size-3.5" /></button>
          </div>
          <button type="button" style={{"display":"inline-flex","height":"1.75rem","alignItems":"center","gap":"0.25rem","borderRadius":"0.375rem","borderWidth":"1px","paddingLeft":"0.5rem","paddingRight":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","backgroundColor":"rgb(0,0,0,0.03)"}}><SlidersHorizontal className="size-3" /> Add filter</button>
        </div>
        <div style={{"maxHeight":"440px","overflowY":"auto"}}>
          {visibleProducts.map((product) => {
            const checked = draft.some(([name]) => name === product[0])
            return <label key={product[0]} style={{"display":"flex","cursor":"pointer","alignItems":"center","gap":"0.75rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.08)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.02)"}}><input type="checkbox" checked={checked} onChange={() => toggleProduct(product)} style={{"borderRadius":"0.25rem","accentColor":"#000"}} /><Image src={`/images/products/${product[1]}`} alt="" width={42} height={42} style={{"borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","objectFit":"cover"}} /><span style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.8)"}}>{product[0]}</span></label>
          })}
          {visibleProducts.length === 0 && <p style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"2.5rem","paddingBottom":"2.5rem","textAlign":"center","fontSize":"0.875rem","lineHeight":"1.25rem"}}>No products match your search.</p>}
        </div>
        <DialogFooter style={{"flexDirection":"row","alignItems":"center","justifyContent":"space-between","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><span style={{"fontSize":"0.75rem","lineHeight":"1rem"}}>{draft.length} selected</span><div style={{"display":"flex","gap":"0.5rem"}}><button type="button" onClick={() => { setDraft(picked); onOpenChange(false) }} style={{"height":"2rem","borderRadius":"0.5rem","borderWidth":"1px","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","backgroundColor":"rgb(0,0,0,0.03)"}}>Cancel</button><button type="button" onClick={() => { onDone(draft); onOpenChange(false) }} style={{"height":"2rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(255,255,255)"}}>Done</button></div></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CollectionPicker({
  open,
  onOpenChange,
  selectedIds,
  onDone,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedIds: string[]
  onDone: (collections: CollectionSource[]) => void
}) {
  const [search, setSearch] = React.useState("")
  const [draftIds, setDraftIds] = React.useState<string[]>(selectedIds)
  const visibleCollections = collectionSources.filter((collection) => collection.title.toLowerCase().includes(search.toLowerCase()))

  const toggleCollection = (id: string) => {
    setDraftIds((current) => current.includes(id) ? current.filter((currentId) => currentId !== id) : [...current, id])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{"maxWidth":"calc(100% - 2rem)","gap":"0px","overflow":"hidden","padding":"0px"}} showCloseButton={false} overlayClassName="bg-black/45 supports-backdrop-filter:backdrop-blur-[1px]">
        <DialogHeader style={{"flexDirection":"row","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1.25rem","paddingRight":"1.25rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
          <div><DialogTitle style={{"fontSize":"1rem","lineHeight":"1.5rem","fontWeight":"600"}}>Add collections</DialogTitle><DialogDescription style={{"position":"absolute","width":"1px","height":"1px","padding":"0","margin":"-1px","overflow":"hidden","clip":"rect(0, 0, 0, 0)","whiteSpace":"nowrap","borderWidth":"0"}}>Choose collections whose products should be added to this collection.</DialogDescription></div>
          <button type="button" onClick={() => { setDraftIds(selectedIds); onOpenChange(false) }} aria-label="Close collection picker" style={{"borderRadius":"0.375rem","padding":"0.25rem","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)","color":"rgb(0,0,0)"}}><X className="size-5" /></button>
        </DialogHeader>
        <div style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><label style={{"display":"flex","height":"2.25rem","alignItems":"center","gap":"0.5rem","borderRadius":"0.5rem","borderWidth":"1px","paddingLeft":"0.75rem","paddingRight":"0.75rem","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000","borderColor":"rgb(0,0,0)"}}><Search className="size-4 text-black/55" /><input value={search} onChange={(event) => setSearch(event.target.value)} autoFocus placeholder="Search collections" style={{"minWidth":"0px","flex":"1 1 0%","backgroundColor":"transparent","fontSize":"0.875rem","lineHeight":"1.25rem","outline":"2px solid transparent","outlineOffset":"2px"}} /></label></div>
        <div style={{"maxHeight":"420px","overflowY":"auto"}}><div style={{"position":"sticky","top":"0px","zIndex":"10","display":"flex","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(0,0,0,0.025)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}><span>Collection</span><span>Products</span></div>{visibleCollections.map((collection) => { const checked = draftIds.includes(collection.id); return <label key={collection.id} style={{"display":"flex","cursor":"pointer","alignItems":"center","gap":"0.75rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.08)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.02)"}}><input type="checkbox" checked={checked} onChange={() => toggleCollection(collection.id)} style={{"borderRadius":"0.25rem","accentColor":"#000"}} /><Image src={`/images/products/${collection.image}`} alt="" width={42} height={42} style={{"borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","objectFit":"cover"}} /><span style={{"minWidth":"0px","flex":"1 1 0%","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.8)"}}>{collection.title}</span><span style={{"fontSize":"0.875rem","lineHeight":"1.25rem"}}>{collection.products.length}</span></label> })}{visibleCollections.length === 0 && <p style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"2.5rem","paddingBottom":"2.5rem","textAlign":"center","fontSize":"0.875rem","lineHeight":"1.25rem"}}>No collections match your search.</p>}</div>
        <DialogFooter style={{"flexDirection":"row","alignItems":"center","justifyContent":"space-between","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><span style={{"fontSize":"0.75rem","lineHeight":"1rem"}}>{draftIds.length} collections selected</span><div style={{"display":"flex","gap":"0.5rem"}}><button type="button" onClick={() => { setDraftIds(selectedIds); onOpenChange(false) }} style={{"height":"2rem","borderRadius":"0.5rem","borderWidth":"1px","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","backgroundColor":"rgb(0,0,0,0.03)"}}>Cancel</button><button type="button" disabled={draftIds.length === 0} onClick={() => { onDone(collectionSources.filter((collection) => draftIds.includes(collection.id))); onOpenChange(false) }} style={{"height":"2rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(255,255,255)","cursor":"not-allowed"}}>Add</button></div></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function CollectionEditor() {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [products, setProducts] = React.useState<Product[]>([])
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [collectionPickerOpen, setCollectionPickerOpen] = React.useState(false)
  const [sourceMenuOpen, setSourceMenuOpen] = React.useState(false)
  const [sourceMode, setSourceMode] = React.useState<"products" | "collections">("products")
  const [selectedCollectionIds, setSelectedCollectionIds] = React.useState<string[]>([])
  const [saved, setSaved] = React.useState(false)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [view, setView] = React.useState<"grid" | "list">("grid")
  const [sort, setSort] = React.useState<SortOption>("Most relevant")

  const canSave = title.trim().length > 0
  const sortedProducts = React.useMemo(() => {
    const ordered = [...products]
    const byName = (direction: 1 | -1) => ordered.sort(([left], [right]) => direction * left.localeCompare(right))
    const byMetric = (metric: "sales" | "price" | "created", direction: 1 | -1) => ordered.sort(([left], [right]) => direction * (productSortMetrics[left][metric] - productSortMetrics[right][metric]))

    switch (sort) {
      case "Best selling": return byMetric("sales", -1)
      case "Product title A-Z": return byName(1)
      case "Product title Z-A": return byName(-1)
      case "Highest price": return byMetric("price", -1)
      case "Lowest price": return byMetric("price", 1)
      case "Newest": return byMetric("created", -1)
      case "Oldest": return byMetric("created", 1)
      default: return ordered
    }
  }, [products, sort])
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(event.target.files ?? [])
    if (file) setImagePreview(URL.createObjectURL(file))
  }
  const selectedCollections = collectionSources.filter((collection) => selectedCollectionIds.includes(collection.id))
  const addCollectionProducts = (collections: CollectionSource[]) => {
    setSelectedCollectionIds(collections.map((collection) => collection.id))
    setProducts((current) => {
      const productsByName = new Map(current.map((product) => [product[0], product]))
      collections.flatMap((collection) => collection.products).forEach((product) => productsByName.set(product[0], product))
      return Array.from(productsByName.values())
    })
    setSaved(false)
  }

  return (
    <main style={{"minHeight":"100%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
      <div style={{"marginLeft":"auto","marginRight":"auto","maxWidth":"968px"}}>
        <header style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}>
          <h1 style={{"display":"flex","alignItems":"center","gap":"0.375rem","fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600"}}><Tag className="size-4" /><ChevronRight className="size-4 text-black/45" /> Add collection</h1>
          <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}><Link href="/dashboard/products/collections" style={{"display":"inline-flex","height":"2rem","alignItems":"center","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}>Discard</Link><button type="button" disabled={!canSave} onClick={() => setSaved(true)} style={{"display":"inline-flex","height":"2rem","alignItems":"center","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(255,255,255)","cursor":"not-allowed"}}>{saved ? "Saved" : "Save"}</button></div>
        </header>

        <div style={{"marginTop":"1rem","display":"grid","gap":"1rem"}}>
          <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
            <SectionCard>
              <div style={{"display":"flex","gap":"1.25rem","padding":"1rem"}}>
                <label style={{"position":"relative","display":"flex","aspectRatio":"1 / 1","width":"9rem","flexShrink":"0","cursor":"pointer","alignItems":"center","justifyContent":"center","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderStyle":"dashed","backgroundColor":"rgb(0,0,0,0.03)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","borderColor":"rgb(0,0,0,0.6)"}}>
                  {imagePreview ? <Image src={imagePreview} alt="Collection cover preview" fill unoptimized style={{"objectFit":"cover"}} /> : <ImageUp className="size-5" />}
                  <input type="file" accept="image/*" onChange={handleUpload} style={{"position":"absolute","width":"1px","height":"1px","padding":"0","margin":"-1px","overflow":"hidden","clip":"rect(0, 0, 0, 0)","whiteSpace":"nowrap","borderWidth":"0"}} />
                </label>
                <div style={{"minWidth":"0px","flex":"1 1 0%","paddingTop":"0.25rem"}}><label style={{"position":"absolute","width":"1px","height":"1px","padding":"0","margin":"-1px","overflow":"hidden","clip":"rect(0, 0, 0, 0)","whiteSpace":"nowrap","borderWidth":"0"}} htmlFor="collection-title">Collection title</label><input id="collection-title" value={title} onChange={(event) => { setTitle(event.target.value); setSaved(false) }} placeholder="Add title" style={{"width":"100%","backgroundColor":"transparent","fontSize":"1.25rem","lineHeight":"1.75rem","fontWeight":"600","color":"rgb(0,0,0)","outline":"2px solid transparent","outlineOffset":"2px"}} /><label style={{"position":"absolute","width":"1px","height":"1px","padding":"0","margin":"-1px","overflow":"hidden","clip":"rect(0, 0, 0, 0)","whiteSpace":"nowrap","borderWidth":"0"}} htmlFor="collection-description">Collection description</label><textarea id="collection-description" value={description} onChange={(event) => { setDescription(event.target.value); setSaved(false) }} placeholder="Add description" rows={3} style={{"marginTop":"0.75rem","width":"100%","resize":"none","backgroundColor":"transparent","fontSize":"0.875rem","lineHeight":"1.5rem","color":"rgb(0,0,0,0.5)","outline":"2px solid transparent","outlineOffset":"2px"}} /></div>
              </div>
            </SectionCard>

            <SectionCard>
              <div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"0.5rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Collection items <span style={{"marginLeft":"0.25rem","borderRadius":"0.375rem","backgroundColor":"rgb(0,0,0,0.07)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.6)"}}>{products.length}</span></h2>{products.length > 0 ? <Popover><PopoverTrigger asChild><button type="button" aria-label="Choose collection sort order" style={{"display":"inline-flex","alignItems":"center","gap":"0.25rem","borderRadius":"0.375rem","paddingLeft":"0.375rem","paddingRight":"0.375rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.04)"}}><span>Default sort:</span><strong style={{"fontWeight":"600","color":"rgb(0,0,0,0.75)"}}>{sort}</strong><ChevronDown style={{"marginLeft":"0.125rem"}} /></button></PopoverTrigger><PopoverContent align="end" sideOffset={6} style={{"width":"168px","gap":"0.25rem","borderRadius":"0.75rem","padding":"0.375rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0,0,0,0.1), 0 4px 6px -4px rgb(0,0,0,0.1)"}}><div role="menu" aria-label="Collection sort options">{sortOptions.map((option) => <button key={option} type="button" role="menuitemradio" aria-checked={sort === option} onClick={() => setSort(option)} className={`flex h-8 w-full items-center rounded-lg px-2 text-left text-sm transition ${sort === option ? "bg-black/[0.05] font-medium text-black" : "text-black/75 hover:bg-black/[0.04]"}`}><Check className={`mr-2 size-3.5 ${sort === option ? "opacity-100" : "opacity-0"}`} />{option}</button>)}</div></PopoverContent></Popover> : <p style={{"fontSize":"0.75rem","lineHeight":"1rem"}}>Add products to populate your collection</p>}</div>
              <div style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}><button type="button" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={`rounded-md p-1.5 transition ${view === "grid" ? "bg-black/[0.06] text-black/65" : "text-black/35 hover:bg-black/[0.04]"}`}><Grid2X2 className="size-4" /></button><button type="button" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")} className={`rounded-md p-1.5 transition ${view === "list" ? "bg-black/[0.06] text-black/65 shadow-sm" : "text-black/35 hover:bg-black/[0.04]"}`}><LayoutList className="size-4" /></button></div></div>
              {products.length === 0 ? <ProductSkeletons /> : view === "grid" ? <div style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","gap":"0.75rem","padding":"1rem"}}>{sortedProducts.map(([name, image]) => <article key={name} style={{"overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(0,0,0,0.1), 0 2px 4px -2px rgb(0,0,0,0.1)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","transform":"translate(0, -0.125rem) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)"}}><div style={{"position":"relative","aspectRatio":"1 / 1","backgroundColor":"rgb(250,250,250)"}}><Image src={`/images/products/${image}`} alt={name} fill sizes="(max-width: 640px) 50vw, 150px" style={{"objectFit":"cover"}} /></div><p style={{"borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.06)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"11px","fontWeight":"500","lineHeight":"1rem","color":"rgb(0,0,0,0.75)"}}>{name}</p></article>)}</div> : <div style={{"borderTopWidth":"calc(1px * calc(1 - 0))","borderBottomWidth":"calc(1px * 0)","borderColor":"rgb(0,0,0,0.1)"}}>{sortedProducts.map(([name, image]) => <article key={name} style={{"display":"flex","alignItems":"center","gap":"0.75rem","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.02)"}}><Image src={`/images/products/${image}`} alt="" width={40} height={40} style={{"borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","objectFit":"cover"}} /><p style={{"minWidth":"0px","flex":"1 1 0%","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>{name}</p><button type="button" onClick={() => { setProducts((current) => current.filter(([productName]) => productName !== name)); setSaved(false) }} aria-label={`Remove ${name} from collection`} style={{"borderRadius":"0.375rem","padding":"0.375rem","color":"rgb(0,0,0,0.25)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)"}}><X className="size-4" /></button></article>)}</div>}
            </SectionCard>

            <SectionCard><div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem"}}><h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0,0.75)"}}>Search engine listing</h2><button type="button" aria-label="Edit search engine listing" style={{"borderRadius":"0.25rem","padding":"0.25rem","color":"rgb(0,0,0,0.5)","backgroundColor":"rgb(0,0,0,0.04)"}}><Pencil className="size-4" /></button></div><div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1.25rem","paddingTop":"1rem"}}><p style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>{title || "Favior"}</p><p style={{"marginTop":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>https://favior.com › collections › {title ? title.toLowerCase().replaceAll(" ", "-") : ""}</p></div></SectionCard>
          </div>

          <aside style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)"}}>
            <SectionCard><div style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)"}}><Popover open={sourceMenuOpen} onOpenChange={setSourceMenuOpen}><PopoverTrigger asChild><button type="button" aria-label="Choose collection item source" style={{"display":"flex","width":"100%","alignItems":"center","gap":"0.5rem","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","textAlign":"left","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","backgroundColor":"rgb(0,0,0,0.02)"}}><Tag className="size-4" />{sourceMode === "products" ? "Products" : "Collection"}<ChevronDown style={{"marginLeft":"auto"}} /></button></PopoverTrigger><PopoverContent align="start" sideOffset={4} style={{"width":"11rem","gap":"0.25rem","borderRadius":"0.75rem","padding":"0.375rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0,0,0,0.1), 0 4px 6px -4px rgb(0,0,0,0.1)"}}><button type="button" onClick={() => { setSourceMode("products"); setSourceMenuOpen(false) }} className={`flex h-8 w-full items-center rounded-lg px-2 text-left text-sm transition ${sourceMode === "products" ? "bg-black/[0.05] font-medium" : "hover:bg-black/[0.04]"}`}><Tag style={{"marginRight":"0.5rem"}} />Products</button><button type="button" onClick={() => { setSourceMode("collections"); setSourceMenuOpen(false) }} className={`flex h-8 w-full items-center rounded-lg px-2 text-left text-sm transition ${sourceMode === "collections" ? "bg-black/[0.05] font-medium" : "hover:bg-black/[0.04]"}`}><Link2 style={{"marginRight":"0.5rem"}} />Collection</button></PopoverContent></Popover></div><div style={{"padding":"0.5rem"}}><div style={{"display":"flex","flexWrap":"wrap","gap":"0.5rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","padding":"0.5rem"}}>{sourceMode === "products" ? <button type="button" onClick={() => setPickerOpen(true)} style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.25rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.1)","paddingLeft":"0.625rem","paddingRight":"0.625rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,0,0,0.7)"}}><CirclePlus className="size-3.5" />Add products</button> : <>{selectedCollections.map((collection) => <span key={collection.id} style={{"display":"inline-flex","height":"1.75rem","alignItems":"center","borderRadius":"0.375rem","backgroundColor":"rgb(0,0,0,0.06)","paddingLeft":"0.5rem","paddingRight":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,0,0,0.7)"}}>{collection.title}</span>)}<button type="button" onClick={() => setCollectionPickerOpen(true)} style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.25rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.1)","paddingLeft":"0.625rem","paddingRight":"0.625rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,0,0,0.7)"}}><CirclePlus className="size-3.5" />Add collection</button></>}</div></div></SectionCard>
          </aside>
        </div>
      </div>
      <ProductPicker key={`products:${products.map(([name]) => name).join("|")}`} open={pickerOpen} onOpenChange={setPickerOpen} picked={products} onDone={(selected) => { setProducts(selected); setSaved(false) }} />
      <CollectionPicker key={`collections:${selectedCollectionIds.join("|")}`} open={collectionPickerOpen} onOpenChange={setCollectionPickerOpen} selectedIds={selectedCollectionIds} onDone={addCollectionProducts} />
    </main>
  )
}
