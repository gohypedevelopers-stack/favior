"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  PlusIcon,
  Trash2Icon,
  PencilIcon,
  EyeIcon,
  EyeOffIcon,
  UploadIcon,
  Loader2Icon,
  XIcon,
  VideoIcon,
  ExternalLinkIcon,
  SearchIcon,
  CheckIcon,
} from "lucide-react"
import { toast } from "sonner"
import type { CreatorVideoItem } from "@/lib/server/controllers/creator-videos.controller"
import { uploadProductImage } from "@/lib/client/upload-product-image"

type ProductOption = {
  id: string
  name: string
  slug: string
  mainImage: string
  price?: string
  category?: string
}

function ProductSelectPicker({
  products,
  selectedId,
  onSelect,
}: {
  products: ProductOption[]
  selectedId: string
  onSelect: (productId: string) => void
}) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [search, setSearch] = useState("")

  const selectedProduct = products.find((p) => p.id === selectedId)

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  )

  if (!isSelecting && selectedProduct) {
    return (
      <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","borderRadius":"0.75rem","borderWidth":"1px","backgroundColor":"rgb(248,250,252)","padding":"0.625rem"}}>
        <div style={{"display":"flex","minWidth":"0px","alignItems":"center","gap":"0.75rem"}}>
          <div style={{"position":"relative","height":"2.5rem","width":"2.5rem","flexShrink":"0","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)"}}>
            <Image
              src={selectedProduct.mainImage}
              alt={selectedProduct.name}
              fill
              style={{"objectFit":"cover"}}
            />
          </div>
          <div style={{"minWidth":"0px"}}>
            <p style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)"}}>{selectedProduct.name}</p>
            <div style={{"marginTop":"0.125rem","display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"10px","color":"rgb(0,0,0,0.5)"}}>
              {selectedProduct.price && <span>₹{selectedProduct.price}</span>}
              {selectedProduct.category && <span>• {selectedProduct.category}</span>}
            </div>
          </div>
        </div>

        <div style={{"marginLeft":"0.5rem","display":"flex","flexShrink":"0","alignItems":"center","gap":"0.5rem"}}>
          <button
            type="button"
            onClick={() => setIsSelecting(true)}
            style={{"cursor":"pointer","borderRadius":"0.5rem","borderWidth":"1px","backgroundColor":"rgb(0,0,0)","paddingLeft":"0.625rem","paddingRight":"0.625rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontSize":"11px","fontWeight":"600","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
          >
            Change
          </button>
          <button
            type="button"
            onClick={() => onSelect("")}
            style={{"cursor":"pointer","padding":"0.25rem","color":"rgb(225,29,72)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
            title="Remove product link"
          >
            <XIcon style={{"height":"1rem","width":"1rem"}} />
          </button>
        </div>
      </div>
    )
  }

  if (!isSelecting && !selectedProduct) {
    return (
      <button
        type="button"
        onClick={() => setIsSelecting(true)}
        style={{"display":"flex","width":"100%","cursor":"pointer","alignItems":"center","justifyContent":"space-between","borderRadius":"0.75rem","borderWidth":"1px","borderStyle":"dashed","borderColor":"rgb(0,0,0)","backgroundColor":"rgb(241,245,249,0.5)","padding":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
      >
        <div style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontWeight":"600"}}>
          <PlusIcon style={{"height":"1rem","width":"1rem","color":"rgb(0,0,0,0.4)"}} />
          <span>Link a Product to this Video</span>
        </div>
        <span style={{"borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"10px","color":"rgb(0,0,0,0.4)"}}>Optional</span>
      </button>
    )
  }

  return (
    <div style={{"marginTop":"calc(0.625rem * calc(1 - 0))","marginBottom":"calc(0.625rem * 0)","borderRadius":"0.75rem","borderWidth":"1px","backgroundColor":"rgb(255,255,255)","padding":"0.75rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
      <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.5rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingBottom":"0.5rem"}}>
        <span style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)"}}>Select Product to Link</span>
        <button
          type="button"
          onClick={() => setIsSelecting(false)}
          style={{"cursor":"pointer","fontSize":"11px","fontWeight":"500","color":"rgb(0,0,0)"}}
        >
          Cancel
        </button>
      </div>

      {/* Search Input */}
      <div style={{"position":"relative"}}>
        <SearchIcon style={{"position":"absolute","left":"0.625rem","top":"0.625rem","height":"0.875rem","width":"0.875rem","color":"rgb(0,0,0,0.4)"}} />
        <input
          type="text"
          autoFocus
          placeholder="Search products by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{"width":"100%","borderRadius":"0.5rem","borderWidth":"1px","backgroundColor":"rgb(255,255,255)","paddingTop":"0.375rem","paddingBottom":"0.375rem","paddingLeft":"2rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","outline":"2px solid transparent","outlineOffset":"2px","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","borderColor":"rgb(0,0,0)"}}
        />
      </div>

      {/* Scrollable Product List */}
      <div
        onWheel={(e) => e.stopPropagation()}
        onScroll={(e) => e.stopPropagation()}
        style={{"maxHeight":"12rem","touchAction":"pan-y","marginTop":"calc(0.25rem * calc(1 - 0))","marginBottom":"calc(0.25rem * 0)","borderTopWidth":"calc(1px * calc(1 - 0))","borderBottomWidth":"calc(1px * 0)","borderColor":"rgb(0,0,0,0.05)","overflowY":"auto","overscrollBehavior":"contain","paddingRight":"0.25rem"}}
      >
        <button
          type="button"
          onClick={() => {
            onSelect("")
            setIsSelecting(false)
          }}
          className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition text-left cursor-pointer ${
            !selectedId ? "bg-black/5 font-semibold text-black" : "text-black/60 hover:bg-slate-50"
          }`}
        >
          <span>No product linked</span>
          {!selectedId && <CheckIcon style={{"height":"1rem","width":"1rem","flexShrink":"0","color":"rgb(0,0,0)"}} />}
        </button>

        {filteredProducts.map((p) => {
          const isSelected = p.id === selectedId
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onSelect(p.id)
                setIsSelecting(false)
              }}
              className={`w-full flex items-center gap-3 p-2 rounded-lg text-xs transition text-left cursor-pointer ${
                isSelected ? "bg-black text-white" : "hover:bg-slate-100 text-black"
              }`}
            >
              <div style={{"position":"relative","height":"2.25rem","width":"2.25rem","flexShrink":"0","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(226,232,240)"}}>
                <Image src={p.mainImage} alt={p.name} fill style={{"objectFit":"cover"}} />
              </div>
              <div style={{"minWidth":"0px","flex":"1 1 0%"}}>
                <p style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontWeight":"600","lineHeight":"1.25"}}>{p.name}</p>
                <div style={{"marginTop":"0.125rem","display":"flex","alignItems":"center","gap":"0.5rem"}}>
                  {p.price && (
                    <span className={isSelected ? "text-white/80 text-[10px]" : "text-black/60 text-[10px]"}>
                      ₹{p.price}
                    </span>
                  )}
                  {p.category && (
                    <span className={isSelected ? "text-white/60 text-[10px]" : "text-black/40 text-[10px]"}>
                      • {p.category}
                    </span>
                  )}
                </div>
              </div>
              {isSelected && <CheckIcon style={{"height":"1rem","width":"1rem","flexShrink":"0","color":"rgb(255,255,255)"}} />}
            </button>
          )
        })}

        {filteredProducts.length === 0 && (
          <div style={{"paddingTop":"1rem","paddingBottom":"1rem","textAlign":"center","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.4)"}}>No matching products found</div>
        )}
      </div>
    </div>
  )
}

export function CreatorVideoManager({
  initialVideos,
}: {
  initialVideos: CreatorVideoItem[]
}) {
  const [videos, setVideos] = useState<CreatorVideoItem[]>(initialVideos)
  const [products, setProducts] = useState<ProductOption[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<CreatorVideoItem | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Sync / fetch videos
  useEffect(() => {
    if (initialVideos && initialVideos.length > 0) {
      setVideos(initialVideos)
    } else {
      fetch("/api/admin/creator-videos")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setVideos(data)
        })
        .catch(() => {})
    }
  }, [initialVideos])

  // Fetch product options for dropdown
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setProducts(
            json.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              mainImage: p.mainImage || "/category-smartphone.png",
              price: p.price,
              category: typeof p.category === "string" ? p.category : p.category?.title,
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    thumbnailUrl: "",
    videoUrl: "",
    productId: "",
    sortOrder: 0,
    isActive: true,
  })

  function openAddModal() {
    setEditingVideo(null)
    setFormData({
      title: "",
      thumbnailUrl: "",
      videoUrl: "",
      productId: "",
      sortOrder: videos.length,
      isActive: true,
    })
    setIsModalOpen(true)
  }

  function openEditModal(item: CreatorVideoItem) {
    setEditingVideo(item)
    setFormData({
      title: item.title || "",
      thumbnailUrl: item.thumbnailUrl,
      videoUrl: item.videoUrl || "",
      productId: item.productId || "",
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    })
    setIsModalOpen(true)
  }

  async function handleToggleActive(item: CreatorVideoItem) {
    const newStatus = !item.isActive
    setVideos((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, isActive: newStatus } : v))
    )

    try {
      const res = await fetch(`/api/admin/creator-videos/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      toast.success(newStatus ? "Video enabled" : "Video disabled")
    } catch {
      toast.error("Failed to update video status")
      setVideos((prev) =>
        prev.map((v) => (v.id === item.id ? { ...v, isActive: item.isActive } : v))
      )
    }
  }

  async function handleDelete(id: string) {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/creator-videos/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete video")
      setVideos((prev) => prev.filter((v) => v.id !== id))
      toast.success("Creator video deleted")
    } catch {
      toast.error("Failed to delete creator video")
    } finally {
      setIsSubmitting(false)
      setDeleteTargetId(null)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const uploadedResult = await uploadProductImage(file)
      setFormData((prev) => ({ ...prev, thumbnailUrl: uploadedResult.url }))
      toast.success("Thumbnail uploaded")
    } catch {
      toast.error("Failed to upload thumbnail")
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.thumbnailUrl) {
      toast.error("Thumbnail image is required")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingVideo) {
        // Update
        const res = await fetch(`/api/admin/creator-videos/${editingVideo.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || "Failed to update creator video")
        }
        const updated = await res.json()
        setVideos((prev) => prev.map((v) => (v.id === editingVideo.id ? updated : v)))
        toast.success("Creator video updated!")
      } else {
        // Create
        const res = await fetch("/api/admin/creator-videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || "Failed to create creator video")
        }
        const created = await res.json()
        setVideos((prev) => [...prev, created])
        toast.success("Creator video added successfully!")
      }
      setIsModalOpen(false)
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{"marginLeft":"auto","marginRight":"auto","maxWidth":"80rem","marginTop":"calc(1.5rem * calc(1 - 0))","marginBottom":"calc(1.5rem * 0)","padding":"1.5rem"}}>
      {/* Header */}
      <div style={{"display":"flex","flexDirection":"column","justifyContent":"space-between","gap":"1rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingBottom":"1.25rem"}}>
        <div>
          <h1 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"1.5rem","lineHeight":"2rem","fontWeight":"700","letterSpacing":"-0.025em","color":"rgb(0,0,0)"}}>
            <VideoIcon style={{"height":"1.5rem","width":"1.5rem","color":"rgb(0,0,0,0.7)"}} />
            Approved by Creators Videos
          </h1>
          <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.6)"}}>
            Manage creator video cards on homepage. Attach products so clicking a video opens the product page.
          </p>
        </div>

        <button
          onClick={openAddModal}
          style={{"display":"inline-flex","cursor":"pointer","alignItems":"center","justifyContent":"center","gap":"0.5rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
        >
          <PlusIcon style={{"height":"1rem","width":"1rem"}} />
          Add Creator Video
        </button>
      </div>

      {/* Grid */}
      {videos.length === 0 ? (
        <div style={{"borderRadius":"1rem","borderWidth":"2px","borderStyle":"dashed","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(0,0,0,0.02)","paddingTop":"4rem","paddingBottom":"4rem","textAlign":"center"}}>
          <VideoIcon style={{"marginLeft":"auto","marginRight":"auto","marginBottom":"0.75rem","height":"3rem","width":"3rem","color":"rgb(0,0,0,0.2)"}} />
          <h3 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>No Creator Videos Found</h3>
          <p style={{"marginLeft":"auto","marginRight":"auto","marginTop":"0.25rem","maxWidth":"24rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.5)"}}>
            Add videos to showcase product demonstrations from creators on your store homepage.
          </p>
          <button
            onClick={openAddModal}
            style={{"marginTop":"1rem","display":"inline-flex","cursor":"pointer","alignItems":"center","gap":"0.5rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
          >
            <PlusIcon style={{"height":"1rem","width":"1rem"}} />
            Add First Video
          </button>
        </div>
      ) : (
        <div style={{"display":"grid","gridTemplateColumns":"repeat(1, minmax(0, 1fr))","gap":"1.5rem"}}>
          {videos.map((vid) => (
            <div
              key={vid.id}
              className={`group relative bg-white border rounded-2xl overflow-hidden shadow-xs transition-all duration-200 hover:shadow-md ${
                !vid.isActive ? "opacity-60 border-dashed border-black/20" : "border-black/10"
              }`}
            >
              {/* Card Image Container (9:16 aspect ratio) */}
              <div style={{"position":"relative","aspectRatio":"9/16","width":"100%","overflow":"hidden","backgroundColor":"rgb(15,23,42)"}}>
                <Image
                  src={vid.thumbnailUrl}
                  alt={vid.title || "Creator Video"}
                  fill
                  style={{"objectFit":"cover","transitionProperty":"transform","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"500ms","transform":"translate(0, 0) rotate(0) skewX(0) skewY(0) scaleX(1.05) scaleY(1.05)"}}
                />

                <div style={{"position":"absolute","inset":"0px","backgroundImage":"undefined"}} />

                {/* Play Icon Badge */}
                <div style={{"position":"absolute","inset":"0px","display":"flex","alignItems":"center","justifyContent":"center"}}>
                  <div style={{"display":"flex","height":"3rem","width":"3rem","alignItems":"center","justifyContent":"center","borderRadius":"9999px","borderWidth":"1px","borderColor":"rgb(255,255,255,0.4)","backgroundColor":"rgb(255,255,255,0.25)","color":"rgb(255,255,255)","backdropFilter":"blur(12px)"}}>
                    <VideoIcon style={{"marginLeft":"0.125rem","height":"1.25rem","width":"1.25rem"}} />
                  </div>
                </div>

                {/* Badges */}
                <div style={{"position":"absolute","left":"0.75rem","right":"0.75rem","top":"0.75rem","display":"flex","alignItems":"center","justifyContent":"space-between"}}>
                  <span style={{"borderRadius":"9999px","backgroundColor":"rgb(0,0,0,0.6)","paddingLeft":"0.625rem","paddingRight":"0.625rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontSize":"10px","fontWeight":"500","color":"rgb(255,255,255)","backdropFilter":"blur(12px)"}}>
                    Order: {vid.sortOrder}
                  </span>

                  <button
                    onClick={() => handleToggleActive(vid)}
                    title={vid.isActive ? "Click to disable" : "Click to enable"}
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md transition cursor-pointer ${
                      vid.isActive
                        ? "bg-emerald-500/90 text-white"
                        : "bg-amber-500/90 text-white"
                    }`}
                  >
                    {vid.isActive ? <EyeIcon style={{"height":"0.75rem","width":"0.75rem"}} /> : <EyeOffIcon style={{"height":"0.75rem","width":"0.75rem"}} />}
                    {vid.isActive ? "Active" : "Hidden"}
                  </button>
                </div>

                {/* Product Badge at Bottom */}
                {vid.product && (
                  <div style={{"position":"absolute","bottom":"0.75rem","left":"0.75rem","right":"0.75rem","display":"flex","alignItems":"center","gap":"0.625rem","borderRadius":"0.75rem","backgroundColor":"rgb(255,255,255,0.95)","padding":"0.625rem","color":"rgb(0,0,0)","boxShadow":"0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0,0,0,0.1), 0 4px 6px -4px rgb(0,0,0,0.1)"}}>
                    <div style={{"position":"relative","height":"2.25rem","width":"2.25rem","flexShrink":"0","overflow":"hidden","borderRadius":"0.5rem","backgroundColor":"rgb(241,245,249)"}}>
                      <Image
                        src={vid.product.mainImage}
                        alt={vid.product.name}
                        fill
                        style={{"objectFit":"cover"}}
                      />
                    </div>
                    <div style={{"minWidth":"0px","flex":"1 1 0%"}}>
                      <p style={{"fontSize":"10px","fontWeight":"600","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(0,0,0,0.5)"}}>Linked Product</p>
                      <p style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)"}}>{vid.product.name}</p>
                    </div>
                    <Link
                      href={`/product/${vid.product.slug}`}
                      target="_blank"
                      style={{"flexShrink":"0","color":"rgb(0,0,0)"}}
                    >
                      <ExternalLinkIcon style={{"height":"1rem","width":"1rem"}} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Card Footer Info & Controls */}
              <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.5rem","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.05)","backgroundColor":"rgb(255,255,255)","padding":"1rem"}}>
                <div style={{"minWidth":"0px"}}>
                  <h4 style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)"}}>
                    {vid.title || "Untitled Video"}
                  </h4>
                </div>

                <div style={{"display":"flex","flexShrink":"0","alignItems":"center","gap":"0.25rem"}}>
                  <button
                    onClick={() => openEditModal(vid)}
                    style={{"cursor":"pointer","borderRadius":"0.5rem","padding":"0.375rem","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)"}}
                    title="Edit video"
                  >
                    <PencilIcon style={{"height":"1rem","width":"1rem"}} />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(vid.id)}
                    style={{"cursor":"pointer","borderRadius":"0.5rem","padding":"0.375rem","color":"rgb(225,29,72)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(255,241,242)"}}
                    title="Delete video"
                  >
                    <Trash2Icon style={{"height":"1rem","width":"1rem"}} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={{"position":"fixed","inset":"0px","zIndex":"50","display":"flex","alignItems":"center","justifyContent":"center","backgroundColor":"rgb(0,0,0,0.6)","padding":"1rem"}}>
          <div style={{"maxHeight":"90vh","width":"100%","maxWidth":"32rem","marginTop":"calc(1.25rem * calc(1 - 0))","marginBottom":"calc(1.25rem * 0)","overflowY":"auto","borderRadius":"1rem","backgroundColor":"rgb(255,255,255)","padding":"1.5rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgb(0,0,0,0.25)","transitionDuration":"200ms"}}>
            <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingBottom":"0.75rem"}}>
              <h3 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"1rem","lineHeight":"1.5rem","fontWeight":"700","color":"rgb(0,0,0)"}}>
                <VideoIcon style={{"height":"1.25rem","width":"1.25rem"}} />
                {editingVideo ? "Edit Creator Video" : "Add New Creator Video"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{"cursor":"pointer","borderRadius":"0.5rem","padding":"0.25rem","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
              >
                <XIcon style={{"height":"1.25rem","width":"1.25rem"}} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","fontSize":"0.75rem","lineHeight":"1rem"}}>
              {/* Title */}
              <div>
                <label style={{"marginBottom":"0.25rem","display":"block","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>Video Title / Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Earbuds Unboxing & Real Review"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{"width":"100%","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","outline":"2px solid transparent","outlineOffset":"2px"}}
                />
              </div>

              {/* Thumbnail Image URL / Upload */}
              <div>
                <label style={{"marginBottom":"0.25rem","display":"block","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>
                  Thumbnail Image (URL or Upload) *
                </label>
                <div style={{"display":"flex","gap":"0.5rem"}}>
                  <input
                    type="text"
                    required
                    placeholder="/creator-earbuds.png or https://..."
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    style={{"flex":"1 1 0%","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","outline":"2px solid transparent","outlineOffset":"2px"}}
                  />
                  <label style={{"display":"inline-flex","cursor":"pointer","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.2)","backgroundColor":"rgb(241,245,249)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontWeight":"600","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}>
                    {isUploading ? <Loader2Icon style={{"height":"1rem","width":"1rem","animation":"spin 1s linear infinite"}} /> : <UploadIcon style={{"height":"1rem","width":"1rem"}} />}
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      style={{"display":"none"}}
                    />
                  </label>
                </div>
                {formData.thumbnailUrl && (
                  <div style={{"position":"relative","marginTop":"0.5rem","height":"9rem","width":"6rem","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(15,23,42)"}}>
                    <Image
                      src={formData.thumbnailUrl}
                      alt="Preview"
                      fill
                      style={{"objectFit":"cover"}}
                    />
                  </div>
                )}
              </div>

              {/* Custom Sleek Inline Product Select Picker with Thumbnail Images */}
              <div>
                <label style={{"marginBottom":"0.25rem","display":"block","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>
                  Link Product (Opens product page when user clicks video)
                </label>
                <ProductSelectPicker
                  products={products}
                  selectedId={formData.productId}
                  onSelect={(id) => setFormData({ ...formData, productId: id })}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{"display":"flex","alignItems":"center","justifyContent":"flex-end","gap":"0.75rem","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingTop":"0.75rem"}}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{"cursor":"pointer","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.2)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)"}}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{"display":"inline-flex","cursor":"pointer","alignItems":"center","gap":"0.5rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","opacity":"0.5"}}
                >
                  {isSubmitting && <Loader2Icon style={{"height":"1rem","width":"1rem","animation":"spin 1s linear infinite"}} />}
                  {editingVideo ? "Save Changes" : "Create Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div style={{"position":"fixed","inset":"0px","zIndex":"50","display":"flex","alignItems":"center","justifyContent":"center","backgroundColor":"rgb(0,0,0,0.6)","padding":"1rem"}}>
          <div style={{"width":"100%","maxWidth":"24rem","marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","borderRadius":"1rem","backgroundColor":"rgb(255,255,255)","padding":"1.5rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgb(0,0,0,0.25)"}}>
            <h3 style={{"fontSize":"1rem","lineHeight":"1.5rem","fontWeight":"700","color":"rgb(0,0,0)"}}>Delete Creator Video</h3>
            <p style={{"fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.6)"}}>
              Are you sure you want to delete this creator video card? This action cannot be undone.
            </p>
            <div style={{"display":"flex","justifyContent":"flex-end","gap":"0.75rem","paddingTop":"0.5rem"}}>
              <button
                onClick={() => setDeleteTargetId(null)}
                style={{"cursor":"pointer","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.2)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)"}}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTargetId)}
                disabled={isSubmitting}
                style={{"display":"inline-flex","cursor":"pointer","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(190,18,60)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","opacity":"0.5"}}
              >
                {isSubmitting && <Loader2Icon style={{"height":"1rem","width":"1rem","animation":"spin 1s linear infinite"}} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
