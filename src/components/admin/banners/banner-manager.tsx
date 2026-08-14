"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  PlusIcon,
  Trash2Icon,
  PencilIcon,
  ImageIcon,
  EyeIcon,
  EyeOffIcon,
  UploadIcon,
  Loader2Icon,
  XIcon,
  RefreshCwIcon,
} from "lucide-react"
import { toast } from "sonner"
import type { HeroBannerItem } from "@/lib/server/controllers/banners.controller"
import { uploadProductImage } from "@/lib/client/upload-product-image"

type CategoryOption = { id: string; title: string; slug: string }

export function BannerManager({ initialBanners }: { initialBanners: HeroBannerItem[] }) {
  const [banners, setBanners] = useState<HeroBannerItem[]>(initialBanners)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<HeroBannerItem | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingDesktop, setIsUploadingDesktop] = useState(false)
  const [isUploadingMobile, setIsUploadingMobile] = useState(false)
  const [categories, setCategories] = useState<CategoryOption[]>([])

  useEffect(() => {
    if (initialBanners && initialBanners.length > 0) {
      setBanners(initialBanners)
    } else {
      fetch("/api/admin/banners")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setBanners(data)
        })
        .catch(() => {})
    }
  }, [initialBanners])

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data)
        }
      })
      .catch(() => {})
  }, [])

  async function handleRestoreDefaults() {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/banners/seed", { method: "POST" })
      if (!res.ok) throw new Error("Failed to restore default banners")
      const data = await res.json()
      setBanners(data)
      toast.success("Default banners loaded successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to load default banners")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    caption: "",
    src: "",
    mobileSrc: "",
    alt: "",
    cta: "Shop now",
    linkUrl: "/shop",
    sortOrder: 0,
    isActive: true,
  })

  function getCategoryLinkUrl(categoryTitle: string): string {
    const cat = categories.find((c) => c.title === categoryTitle)
    return cat ? `/shop?filter=${cat.slug}` : "/shop"
  }

  function openAddModal() {
    setEditingBanner(null)
    setFormData({
      title: "",
      category: "",
      caption: "",
      src: "",
      mobileSrc: "",
      alt: "",
      cta: "Shop now",
      linkUrl: "/shop",
      sortOrder: banners.length,
      isActive: true,
    })
    setIsModalOpen(true)
  }

  function openEditModal(banner: HeroBannerItem) {
    setEditingBanner(banner)
    const resolvedLink = banner.category
      ? getCategoryLinkUrl(banner.category)
      : banner.linkUrl || "/shop"
    setFormData({
      title: banner.title,
      category: banner.category || "",
      caption: banner.caption || "",
      src: banner.src,
      mobileSrc: banner.mobileSrc || "",
      alt: banner.alt || banner.title,
      cta: banner.cta || "Shop now",
      linkUrl: resolvedLink,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
    })
    setIsModalOpen(true)
  }

  async function handleToggleActive(banner: HeroBannerItem) {
    const newStatus = !banner.isActive
    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? { ...b, isActive: newStatus } : b))
    )

    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      })

      if (!res.ok) {
        throw new Error("Failed to update status")
      }
      toast.success(`Banner ${newStatus ? "activated" : "deactivated"}`)
    } catch {
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, isActive: banner.isActive } : b))
      )
      toast.error("Failed to update banner status")
    }
  }

  async function handleDelete(id: string) {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete banner")

      setBanners((prev) => prev.filter((b) => b.id !== id))
      toast.success("Banner deleted successfully")
      setDeleteTargetId(null)
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete banner")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDesktopFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingDesktop(true)
    try {
      const uploaded = await uploadProductImage(file)
      setFormData((prev) => ({ ...prev, src: uploaded.url }))
      toast.success("Desktop image uploaded successfully")
    } catch (err) {
      console.error(err)
      toast.error("Image upload failed")
    } finally {
      setIsUploadingDesktop(false)
    }
  }

  async function handleMobileFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingMobile(true)
    try {
      const uploaded = await uploadProductImage(file)
      setFormData((prev) => ({ ...prev, mobileSrc: uploaded.url }))
      toast.success("Mobile image uploaded successfully")
    } catch (err) {
      console.error(err)
      toast.error("Mobile image upload failed")
    } finally {
      setIsUploadingMobile(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error("Banner title is required")
      return
    }
    if (!formData.src.trim()) {
      toast.error("Banner Desktop Image (URL or file) is required")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingBanner) {
        // Update existing banner
        const res = await fetch(`/api/admin/banners/${editingBanner.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || "Failed to update banner")
        }
        const updated = await res.json()

        setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
        toast.success("Banner updated successfully")
      } else {
        // Create new banner
        const res = await fetch("/api/admin/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || "Failed to create banner")
        }
        const created = await res.json()

        setBanners((prev) => [...prev, created])
        toast.success("New banner added successfully")
      }
      setIsModalOpen(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || "Failed to save banner")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{"display":"flex","flex":"1 1 0%","flexDirection":"column","gap":"1.5rem","backgroundColor":"rgb(246,246,246)","padding":"1.5rem"}}>
      {/* Header Bar */}
      <div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"1rem"}}>
        <div>
          <h1 style={{"fontSize":"1.25rem","lineHeight":"1.75rem","fontWeight":"700","letterSpacing":"-0.025em","color":"rgb(0,0,0)"}}>Homepage Hero Banners</h1>
          <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.6)"}}>
            Add, preview, edit, or delete slides for the main homepage carousel slider.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          style={{"display":"inline-flex","alignItems":"center","gap":"0.5rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
        >
          <PlusIcon className="size-4" />
          Add New Banner
        </button>
      </div>

      {/* Banner Cards Grid */}
      {banners.length === 0 ? (
        <div style={{"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","borderRadius":"1rem","borderWidth":"1px","borderStyle":"dashed","backgroundColor":"rgb(255,255,255)","paddingTop":"4rem","paddingBottom":"4rem","textAlign":"center"}}>
          <ImageIcon style={{"color":"rgb(0,0,0,0.3)"}} />
          <h3 style={{"marginTop":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0)"}}>No hero banners created yet</h3>
          <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Add your custom banner or load the default homepage hero banners.</p>
          <div style={{"marginTop":"1rem","display":"flex","alignItems":"center","gap":"0.75rem"}}>
            <button
              type="button"
              onClick={handleRestoreDefaults}
              disabled={isSubmitting}
              style={{"display":"inline-flex","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.2)","backgroundColor":"rgb(0,0,0,0.05)","paddingLeft":"0.875rem","paddingRight":"0.875rem","paddingTop":"0.375rem","paddingBottom":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)","opacity":"0.5"}}
            >
              {isSubmitting ? <Loader2Icon style={{"animation":"spin 1s linear infinite"}} /> : <RefreshCwIcon className="size-3.5" />}
              Load Default Banners
            </button>

            <button
              type="button"
              onClick={openAddModal}
              style={{"display":"inline-flex","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.875rem","paddingRight":"0.875rem","paddingTop":"0.375rem","paddingBottom":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(255,255,255)"}}
            >
              <PlusIcon className="size-3.5" />
              Add Custom Banner
            </button>
          </div>
        </div>
      ) : (
        <div style={{"display":"grid","gap":"1.5rem"}}>
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`group relative flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition-all hover:shadow-md ${
                !banner.isActive ? "opacity-60" : ""
              }`}
            >
              {/* Live Banner Preview Image Container */}
              <div style={{"position":"relative","width":"100%","overflow":"hidden","backgroundColor":"rgb(15,23,42)"}}>
                <Image
                  src={banner.src}
                  alt={banner.alt || banner.title}
                  fill
                  style={{"objectFit":"cover","transitionProperty":"transform","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"300ms","transform":"translate(0, 0) rotate(0) skewX(0) skewY(0) scaleX(1.05) scaleY(1.05)"}}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Status Badges */}
                <div style={{"position":"absolute","left":"0.75rem","top":"0.75rem","zIndex":"10","display":"flex","flexWrap":"wrap","gap":"0.375rem"}}>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      banner.isActive
                        ? "bg-emerald-500/90 text-white backdrop-blur-xs"
                        : "bg-neutral-800/90 text-neutral-300 backdrop-blur-xs"
                    }`}
                  >
                    {banner.isActive ? <EyeIcon className="size-3" /> : <EyeOffIcon className="size-3" />}
                    {banner.isActive ? "Active" : "Hidden"}
                  </span>

                  {banner.category ? (
                    <span style={{"borderRadius":"9999px","backgroundColor":"rgb(0,0,0,0.6)","paddingLeft":"0.625rem","paddingRight":"0.625rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"11px","fontWeight":"500","color":"rgb(255,255,255)"}}>
                      {banner.category}
                    </span>
                  ) : null}
                </div>

                <div style={{"position":"absolute","bottom":"0.75rem","right":"0.75rem","zIndex":"10","borderRadius":"0.375rem","backgroundColor":"rgb(0,0,0,0.7)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"10px","fontWeight":"500","color":"rgb(255,255,255)"}}>
                  Order: #{banner.sortOrder}
                </div>
              </div>

              {/* Banner Details Body */}
              <div style={{"display":"flex","flex":"1 1 0%","flexDirection":"column","padding":"1rem"}}>
                <h3 style={{"overflow":"hidden","display":"-webkit-box","WebkitBoxOrient":"vertical","WebkitLineClamp":"1","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"700","color":"rgb(0,0,0)"}}>{banner.title}</h3>
                {banner.caption ? (
                  <p style={{"marginTop":"0.25rem","overflow":"hidden","display":"-webkit-box","WebkitBoxOrient":"vertical","WebkitLineClamp":"2","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.6)"}}>{banner.caption}</p>
                ) : null}

                <div style={{"marginTop":"0.75rem","display":"flex","alignItems":"center","justifyContent":"space-between","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingTop":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem"}}>
                  <span style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap"}} title={banner.linkUrl || "/shop"}>
                    CTA: <strong style={{"fontWeight":"600","color":"rgb(0,0,0)"}}>{banner.cta || "Shop now"}</strong>
                  </span>

                  {/* Actions */}
                  <div style={{"display":"flex","flexShrink":"0","alignItems":"center","gap":"0.375rem"}}>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(banner)}
                      title={banner.isActive ? "Deactivate banner" : "Activate banner"}
                      style={{"borderRadius":"0.375rem","padding":"0.375rem","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)"}}
                    >
                      {banner.isActive ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(banner)}
                      title="Edit banner"
                      style={{"borderRadius":"0.375rem","padding":"0.375rem","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)"}}
                    >
                      <PencilIcon className="size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(banner.id)}
                      title="Delete banner"
                      style={{"borderRadius":"0.375rem","padding":"0.375rem","color":"rgb(220,38,38)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(254,242,242)"}}
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {isModalOpen ? (
        <div style={{"position":"fixed","inset":"0px","zIndex":"50","display":"flex","alignItems":"center","justifyContent":"center","overflowY":"auto","backgroundColor":"rgb(0,0,0,0.5)","padding":"1rem"}}>
          <div style={{"position":"relative","marginTop":"2rem","marginBottom":"2rem","width":"100%","maxWidth":"36rem","borderRadius":"1rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1.5rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgb(0,0,0,0.25)"}}>
            <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingBottom":"0.75rem"}}>
              <h2 style={{"fontSize":"1rem","lineHeight":"1.5rem","fontWeight":"700","color":"rgb(0,0,0)"}}>
                {editingBanner ? "Edit Hero Banner" : "Add New Hero Banner"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{"borderRadius":"0.375rem","padding":"0.25rem","color":"rgb(0,0,0)","backgroundColor":"rgb(0,0,0,0.05)"}}
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","fontSize":"0.75rem","lineHeight":"1rem"}}>
              {/* Banner Title */}
              <div>
                <label style={{"display":"block","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>Banner Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Favior Techno Android Projector"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{"marginTop":"0.25rem","width":"100%","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","outline":"2px solid transparent","outlineOffset":"2px"}}
                />
              </div>

              <div style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","gap":"0.75rem"}}>
                {/* Category */}
                <div>
                  <label style={{"display":"block","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const selectedTitle = e.target.value
                      const selectedCat = categories.find((c) => c.title === selectedTitle)
                      setFormData({
                        ...formData,
                        category: selectedTitle,
                        linkUrl: selectedCat ? `/shop?filter=${selectedCat.slug}` : "/shop",
                      })
                    }}
                    style={{"marginTop":"0.25rem","width":"100%","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0)","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","outline":"2px solid transparent","outlineOffset":"2px"}}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.title}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CTA Button Text */}
                <div>
                  <label style={{"display":"block","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>CTA Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Shop now, Explore now"
                    value={formData.cta}
                    onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                    style={{"marginTop":"0.25rem","width":"100%","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","outline":"2px solid transparent","outlineOffset":"2px"}}
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label style={{"display":"block","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>Subtitle / Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Projection Made Simple • Full HD 1080p"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  style={{"marginTop":"0.25rem","width":"100%","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","outline":"2px solid transparent","outlineOffset":"2px"}}
                />
              </div>

              {/* Desktop Image Upload or URL */}
              <div>
                <label style={{"display":"block","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>Desktop Image (URL or Upload) *</label>
                <div style={{"marginTop":"0.25rem","display":"flex","alignItems":"center","gap":"0.5rem"}}>
                  <input
                    type="text"
                    required
                    placeholder="/hero-banner-techno-projector.png or https://..."
                    value={formData.src}
                    onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                    style={{"width":"100%","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","outline":"2px solid transparent","outlineOffset":"2px"}}
                  />
                  <label style={{"display":"inline-flex","flexShrink":"0","cursor":"pointer","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.2)","backgroundColor":"rgb(229,229,229)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}>
                    {isUploadingDesktop ? <Loader2Icon style={{"animation":"spin 1s linear infinite"}} /> : <UploadIcon className="size-3.5" />}
                    Upload
                    <input type="file" accept="image/*" style={{"display":"none"}} onChange={handleDesktopFileUpload} />
                  </label>
                </div>
                {formData.src ? (
                  <div style={{"position":"relative","marginTop":"0.5rem","height":"6rem","width":"100%","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(15,23,42)"}}>
                    <Image src={formData.src} alt="Desktop Preview" fill style={{"objectFit":"cover"}} />
                  </div>
                ) : null}
              </div>

              {/* Mobile Image Upload or URL */}
              <div>
                <label style={{"display":"block","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>Mobile Image (Optional)</label>
                <div style={{"marginTop":"0.25rem","display":"flex","alignItems":"center","gap":"0.5rem"}}>
                  <input
                    type="text"
                    placeholder="Optional mobile image path or URL"
                    value={formData.mobileSrc}
                    onChange={(e) => setFormData({ ...formData, mobileSrc: e.target.value })}
                    style={{"width":"100%","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","outline":"2px solid transparent","outlineOffset":"2px"}}
                  />
                  <label style={{"display":"inline-flex","flexShrink":"0","cursor":"pointer","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.2)","backgroundColor":"rgb(229,229,229)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}>
                    {isUploadingMobile ? <Loader2Icon style={{"animation":"spin 1s linear infinite"}} /> : <UploadIcon className="size-3.5" />}
                    Upload
                    <input type="file" accept="image/*" style={{"display":"none"}} onChange={handleMobileFileUpload} />
                  </label>
                </div>
              </div>

              <div style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","gap":"0.75rem"}}>
                {/* Link URL */}
                <div>
                  <label style={{"display":"block","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>Link Target URL</label>
                  <input
                    type="text"
                    placeholder="/shop or /product/techno-projector"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    style={{"marginTop":"0.25rem","width":"100%","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","outline":"2px solid transparent","outlineOffset":"2px"}}
                  />
                </div>

                {/* Sort Order */}
                <div>
                  <label style={{"display":"block","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>Display Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    style={{"marginTop":"0.25rem","width":"100%","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","outline":"2px solid transparent","outlineOffset":"2px"}}
                  />
                </div>
              </div>

              {/* Is Active Toggle */}
              <div style={{"display":"flex","alignItems":"center","gap":"0.5rem","paddingTop":"0.25rem"}}>
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{"borderRadius":"0.25rem","accentColor":"#000"}}
                />
                <label htmlFor="isActiveToggle" style={{"cursor":"pointer","userSelect":"none","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>
                  Display this banner on homepage
                </label>
              </div>

              {/* Form Buttons */}
              <div style={{"display":"flex","alignItems":"center","justifyContent":"flex-end","gap":"0.5rem","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingTop":"1rem"}}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{"borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.2)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)","backgroundColor":"rgb(0,0,0,0.05)"}}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{"display":"inline-flex","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","opacity":"0.5"}}
                >
                  {isSubmitting ? <Loader2Icon style={{"animation":"spin 1s linear infinite"}} /> : null}
                  {editingBanner ? "Save Changes" : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {deleteTargetId ? (
        <div style={{"position":"fixed","inset":"0px","zIndex":"50","display":"flex","alignItems":"center","justifyContent":"center","backgroundColor":"rgb(0,0,0,0.5)","padding":"1rem"}}>
          <div style={{"width":"100%","maxWidth":"24rem","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1.25rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgb(0,0,0,0.25)"}}>
            <h3 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"700","color":"rgb(0,0,0)"}}>Delete Banner?</h3>
            <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.6)"}}>
              Are you sure you want to delete this hero banner? This action cannot be undone.
            </p>
            <div style={{"marginTop":"1rem","display":"flex","justifyContent":"flex-end","gap":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem"}}>
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                style={{"borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.2)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.375rem","paddingBottom":"0.375rem","fontWeight":"500","color":"rgb(0,0,0)","backgroundColor":"rgb(0,0,0,0.05)"}}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDelete(deleteTargetId)}
                style={{"display":"inline-flex","alignItems":"center","gap":"0.375rem","borderRadius":"0.375rem","backgroundColor":"rgb(185,28,28)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.375rem","paddingBottom":"0.375rem","fontWeight":"600","color":"rgb(255,255,255)","opacity":"0.5"}}
              >
                {isSubmitting ? <Loader2Icon style={{"animation":"spin 1s linear infinite"}} /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
