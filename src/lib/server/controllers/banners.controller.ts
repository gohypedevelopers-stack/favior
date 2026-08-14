import { db } from "@/lib/db"
export type HeroBannerItem = {
  id: string
  title: string
  category: string | null
  caption: string | null
  src: string
  mobileSrc: string | null
  alt: string
  cta: string | null
  linkUrl: string | null
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export async function ensureDefaultBannersSeeded() {
  // Disabled as defaultBanners is no longer available
  return;
}

export async function listBanners() {
  await ensureDefaultBannersSeeded()
  return (db as any).heroBanner.findMany({
    orderBy: { sortOrder: "asc" },
  })
}

export async function listActiveBanners() {
  await ensureDefaultBannersSeeded()
  return (db as any).heroBanner.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  })
}

export async function createBanner(data: {
  title: string
  category?: string
  caption?: string
  src: string
  mobileSrc?: string
  alt: string
  cta?: string
  linkUrl?: string
  sortOrder?: number
  isActive?: boolean
}) {
  return (db as any).heroBanner.create({
    data: {
      title: data.title,
      category: data.category || null,
      caption: data.caption || null,
      src: data.src,
      mobileSrc: data.mobileSrc || null,
      alt: data.alt,
      cta: data.cta || "Shop now",
      linkUrl: data.linkUrl || "/shop",
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  })
}

export async function updateBanner(
  id: string,
  data: Partial<{
    title: string
    category: string
    caption: string
    src: string
    mobileSrc: string
    alt: string
    cta: string
    linkUrl: string
    sortOrder: number
    isActive: boolean
  }>
) {
  return (db as any).heroBanner.update({
    where: { id },
    data,
  })
}

export async function deleteBanner(id: string) {
  return (db as any).heroBanner.delete({
    where: { id },
  })
}
