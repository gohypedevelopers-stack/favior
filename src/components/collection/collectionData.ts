import type { Product } from "@/components/ProductCard";
import type {
  CollectionDetail,
  CollectionCategory,
  CollectionCategoryKey,
} from "@/types/collection";

export interface CatalogItem extends Product {
  category: CollectionCategoryKey;
  numericPrice: number;
  inStock: boolean;
  colorName?: string;
  isNew?: boolean;
}

export const catalogProducts: CatalogItem[] = [
  {
    id: "p1",
    name: "The Havane Stainless Shaker",
    desc: "600ml double-wall vacuum insulated shaker with precision leak-proof lid & zero-residue grid.",
    price: "₹1,499",
    originalPrice: "₹1,999",
    numericPrice: 1499,
    rating: 4.9,
    reviews: 142,
    badge: "BESTSELLER",
    category: "shakers",
    inStock: true,
    colorName: "Onyx Black",
    img: "/favior_shaker_white.png",
    gallery: [
      "/favior_shaker_white.png",
      "/favior_wristwrap_white.png",
      "/favior_kit_white.png",
    ],
    swatches: ["#111111", "#4a4a4a", "#e5e5e5"],
  },
  {
    id: "p2",
    name: "The Aube Heavy-Duty Wrist Wraps",
    desc: "18-inch reinforced wrist support with elastane blend, heavy-gauge stitching and thumb loop.",
    price: "₹999",
    originalPrice: "₹1,299",
    numericPrice: 999,
    rating: 4.8,
    reviews: 98,
    badge: "ESSENTIAL",
    category: "wristbands",
    inStock: true,
    colorName: "Stealth Black",
    img: "/favior_wristwrap_white.png",
    gallery: [
      "/favior_wristwrap_white.png",
      "/favior_shaker_white.png",
      "/favior_bands_white.png",
    ],
    swatches: ["#111111", "#333333"],
  },
  {
    id: "p3",
    name: "The Lumen Performance Kit",
    desc: "Comprehensive athlete bundle: vacuum shaker, heavy wrist wraps, resistance loops & carry bag.",
    price: "₹2,999",
    originalPrice: "₹3,999",
    numericPrice: 2999,
    rating: 5.0,
    reviews: 215,
    badge: "LIMITED EDITION",
    category: "bundles",
    inStock: true,
    colorName: "Carbon Edition",
    img: "/favior_kit_white.png",
    gallery: [
      "/favior_kit_white.png",
      "/favior_shaker_white.png",
      "/favior_wristwrap_white.png",
    ],
    swatches: ["#0f0f10", "#2b2b2b"],
  },
  {
    id: "p4",
    name: "The Brume Latex Resistance Bands",
    desc: "Set of 5 premium natural Malaysian latex loop bands ranging from 5 lbs to 50 lbs of resistance.",
    price: "₹1,199",
    originalPrice: "₹1,599",
    numericPrice: 1199,
    rating: 4.9,
    reviews: 84,
    badge: "VERSATILE",
    category: "accessories",
    inStock: true,
    colorName: "Monochrome Set",
    img: "/favior_bands_white.png",
    gallery: [
      "/favior_bands_white.png",
      "/favior_wristwrap_white.png",
      "/favior_shaker_white.png",
    ],
    swatches: ["#1a1a1a", "#444444", "#888888"],
  },
  {
    id: "c1",
    name: "Pro Stainless Steel Shaker — Matte",
    desc: "750ml large capacity kitchen-grade 18/8 stainless steel bottle with acoustic leak-proof gasket.",
    price: "₹1,699",
    originalPrice: "₹2,199",
    numericPrice: 1699,
    rating: 4.9,
    reviews: 110,
    badge: "ONLINE EXCLUSIVE",
    category: "shakers",
    inStock: true,
    colorName: "Pure White",
    img: "/favior_shaker_white.png",
    gallery: [
      "/favior_shaker_white.png",
      "/favior_kit_white.png",
      "/favior_wristwrap_white.png",
    ],
    swatches: ["#ffffff", "#000000"],
  },
  {
    id: "c2",
    name: "Elite Heavy Lifting Straps",
    desc: "Neoprene-padded pure cotton webbing lifting straps for maximal deadlift and pull security.",
    price: "₹799",
    originalPrice: "₹999",
    numericPrice: 799,
    rating: 4.8,
    reviews: 67,
    badge: "NEW ARRIVAL",
    category: "wristbands",
    inStock: true,
    colorName: "Pitch Black",
    img: "/favior_wristwrap_white.png",
    gallery: [
      "/favior_wristwrap_white.png",
      "/favior_bands_white.png",
    ],
    swatches: ["#111111"],
  },
  {
    id: "c3",
    name: "Thermal Insulated Gym Flask 1L",
    desc: "1000ml double-wall thermal flask that preserves icy temperature for 24 hours without condensation.",
    price: "₹1,899",
    originalPrice: "₹2,499",
    numericPrice: 1899,
    rating: 4.9,
    reviews: 58,
    badge: "HIGH CAPACITY",
    category: "shakers",
    inStock: true,
    colorName: "Midnight Steel",
    img: "/favior_shaker_white.png",
    gallery: [
      "/favior_shaker_white.png",
      "/favior_bands_white.png",
    ],
    swatches: ["#191919", "#333333"],
  },
  {
    id: "c4",
    name: "Power Training Chalk & Grip Kit",
    desc: "100% pure magnesium carbonate block with breathable mesh storage pouch for zero-slip traction.",
    price: "₹649",
    originalPrice: "₹899",
    numericPrice: 649,
    rating: 4.7,
    reviews: 43,
    badge: "TRACTION",
    category: "accessories",
    inStock: true,
    colorName: "Classic White",
    img: "/favior_kit_white.png",
    gallery: [
      "/favior_kit_white.png",
      "/favior_bands_white.png",
    ],
    swatches: ["#f5f5f5"],
  },
  {
    id: "c5",
    name: "Total Performance Athlete Pack",
    desc: "The ultimate training suite: 2 insulated shakers, 2 sets of wrist wraps, loop bands, and gym bag.",
    price: "₹4,499",
    originalPrice: "₹5,999",
    numericPrice: 4499,
    rating: 5.0,
    reviews: 164,
    badge: "BEST VALUE",
    category: "bundles",
    inStock: true,
    colorName: "All-Black Collector Set",
    img: "/favior_kit_white.png",
    gallery: [
      "/favior_kit_white.png",
      "/favior_shaker_white.png",
      "/favior_wristwrap_white.png",
    ],
    swatches: ["#000000"],
  },
  {
    id: "heritage-oval",
    name: "Heritage Oval Atelier Edition",
    desc: "Precision sculpted bio-acetate and polished 18/8 stainless steel collectors accessory edition.",
    price: "₹8,999",
    originalPrice: "₹10,500",
    numericPrice: 8999,
    rating: 4.9,
    reviews: 73,
    badge: "ATELIER",
    category: "accessories",
    inStock: true,
    colorName: "Glossy Bio-Acetate",
    img: "/favior_wristwrap_white.png",
    gallery: [
      "/favior_wristwrap_white.png",
      "/favior_shaker_white.png",
      "/favior_bands_white.png",
    ],
    swatches: ["#000000", "#6f5639", "#ebe8e1"],
  },
];

export const collectionCategories: CollectionCategory[] = [
  {
    key: "all",
    slug: "all",
    name: "All Products",
    count: catalogProducts.length,
  },
  {
    key: "shakers",
    slug: "shakers",
    name: "Shakers & Flasks",
    count: catalogProducts.filter((p) => p.category === "shakers").length,
  },
  {
    key: "wristbands",
    slug: "wristbands",
    name: "Wrist Wraps & Straps",
    count: catalogProducts.filter((p) => p.category === "wristbands").length,
  },
  {
    key: "accessories",
    slug: "accessories",
    name: "Accessories & Bands",
    count: catalogProducts.filter((p) => p.category === "accessories").length,
  },
  {
    key: "bundles",
    slug: "bundles",
    name: "Bundles & Kits",
    count: catalogProducts.filter((p) => p.category === "bundles").length,
  },
];

export const collectionsRegistry: Record<string, CollectionDetail> = {
  all: {
    slug: "all",
    title: "All Products",
    subtitle: "Complete Atelier Series",
    tagline: "Uncompromising engineering meets minimalist luxury aesthetics.",
    description:
      "Explore our complete range of precision stainless steel shakers, heavy-duty wrist wraps, and training essentials designed for the discerning athlete.",
    categoryKey: "all",
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: "All Products" },
    ],
  },
  shakers: {
    slug: "shakers",
    title: "Precision Shakers & Flasks",
    subtitle: "Kitchen-Grade Stainless Steel",
    tagline: "Double-wall insulation, zero odor, acoustic leak-proof sealing.",
    description:
      "Engineered from surgical 18/8 stainless steel to maintain ice-cold temperatures all day with zero odor absorption and smooth, residue-free mixing.",
    categoryKey: "shakers",
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: "Shakers" },
    ],
  },
  wristbands: {
    slug: "wristbands",
    title: "Wrist Wraps & Lifting Straps",
    subtitle: "Maximal Joint Support",
    tagline: "Heavy-gauge elasticized weave engineered for heavy lifts.",
    description:
      "Reinforced custom hardware, heavy-gauge stitching, and dense elasticized webbing engineered to support your wrists under maximal loads.",
    categoryKey: "wristbands",
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: "Wrist Wraps" },
    ],
  },
  accessories: {
    slug: "accessories",
    title: "Training Accessories",
    subtitle: "Performance Essentials",
    tagline: "Resistance loops, friction chalk, and premium gear bags.",
    description:
      "Essential training tools crafted from natural Malaysian latex, pure magnesium carbonate, and durable tactical textiles.",
    categoryKey: "accessories",
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: "Accessories" },
    ],
  },
  bundles: {
    slug: "bundles",
    title: "Bundles & Performance Kits",
    subtitle: "Curated Athlete Suites",
    tagline: "Complete gear combinations with built-in bundle savings.",
    description:
      "Curated sets of our finest shakers, wraps, and bands bundled together to elevate every aspect of your training regimen.",
    categoryKey: "bundles",
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: "Bundles" },
    ],
  },
};

export function getCollectionBySlug(slug?: string): CollectionDetail {
  if (!slug || slug === "all-products" || slug === "catalog") {
    return collectionsRegistry.all;
  }
  const normalized = slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (collectionsRegistry[normalized]) {
    return collectionsRegistry[normalized];
  }
  // Alias checks
  if (normalized === "wrist-wraps" || normalized === "wristwraps" || normalized === "straps") {
    return collectionsRegistry.wristbands;
  }
  if (normalized === "kits" || normalized === "sets") {
    return collectionsRegistry.bundles;
  }
  return collectionsRegistry.all;
}

export function getProductsForCategory(categoryKey: CollectionCategoryKey): CatalogItem[] {
  if (categoryKey === "all") {
    return catalogProducts;
  }
  return catalogProducts.filter((item) => item.category === categoryKey);
}
