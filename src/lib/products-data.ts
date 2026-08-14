export type ProductColor = {
  name: string;
  bg: string;
  border?: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductDetailItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  rating: number;
  reviewsCount: string;
  description: string;
  colors: ProductColor[];
  features: string[];
  specs: ProductSpec[];
  shippingNotice: string;
  mainImage: string;
  images?: string[];
};

export const productsCatalog: Record<string, ProductDetailItem> = {
  "the-aube-shaker": {
    id: "the-aube-shaker",
    slug: "the-aube-shaker",
    name: "The Aube Shaker",
    category: "Shakers",
    categorySlug: "shakers",
    price: "RS. 2,900",
    oldPrice: "RS. 3,500",
    discount: "17% off",
    rating: 4.8,
    reviewsCount: "1.2K Reviews",
    description: "Premium protein shaker bottle engineered for smooth mixing. Leak-proof and BPA-free.",
    colors: [
      { name: "Stealth Black", bg: "#1e1e24" },
      { name: "Arctic White", bg: "#f8f9fa", border: "#e5e7eb" },
    ],
    features: [
      "Leak-proof cap design",
      "Stainless steel mixing ball",
      "Odor-resistant material",
    ],
    specs: [
      { label: "Capacity", value: "700ml" },
      { label: "Material", value: "BPA-Free Tritan" },
      { label: "Care", value: "Dishwasher Safe" },
    ],
    shippingNotice: "Free 2-day shipping on orders above RS. 5,000",
    mainImage: "/favior_shaker_white.png",
  },
  "the-aube-wrist-wraps": {
    id: "the-aube-wrist-wraps",
    slug: "the-aube-wrist-wraps",
    name: "The Aube Wrist Wraps",
    category: "Wristbands",
    categorySlug: "wristbands",
    price: "RS. 15,900",
    oldPrice: "RS. 18,900",
    discount: "15% off",
    rating: 4.9,
    reviewsCount: "850 Reviews",
    description: "Heavy-duty wrist wraps for ultimate support during heavy lifts. Engineered for powerlifters and bodybuilders.",
    colors: [
      { name: "Classic Black", bg: "#111111" },
      { name: "Crimson Red", bg: "#990000" },
    ],
    features: [
      "Thumb loop for easy wrapping",
      "Reinforced stitching",
      "Adjustable compression",
    ],
    specs: [
      { label: "Length", value: "18 Inches" },
      { label: "Material", value: "Cotton, Elastic, Polyester Blend" },
      { label: "Level", value: "Professional Heavy Duty" },
    ],
    shippingNotice: "Free 2-day shipping on orders above RS. 5,000",
    mainImage: "/favior_wristwrap_white.png",
  },
  "favior-resistance-bands": {
    id: "favior-resistance-bands",
    slug: "favior-resistance-bands",
    name: "Favior Resistance Bands Set",
    category: "Accessories",
    categorySlug: "accessories",
    price: "RS. 4,500",
    rating: 4.7,
    reviewsCount: "2.3K Reviews",
    description: "Complete set of fabric resistance bands. Won't roll up or snap during your lower body workouts.",
    colors: [
      { name: "Mixed Pack", bg: "#e5e7eb" },
    ],
    features: [
      "Anti-slip grip design",
      "Three resistance levels",
      "Includes carry bag",
    ],
    specs: [
      { label: "Levels", value: "Light, Medium, Heavy" },
      { label: "Material", value: "Premium Fabric & Latex Blend" },
    ],
    shippingNotice: "Free 2-day shipping on orders above RS. 5,000",
    mainImage: "/favior_bands_white.png",
  },
  "favior-complete-kit": {
    id: "favior-complete-kit",
    slug: "favior-complete-kit",
    name: "Favior Complete Gym Kit",
    category: "Gym Kits",
    categorySlug: "gym-kits",
    price: "RS. 25,000",
    oldPrice: "RS. 32,000",
    discount: "21% off",
    rating: 5.0,
    reviewsCount: "340 Reviews",
    description: "Everything you need to start your fitness journey. Includes shaker, wrist wraps, towel, and a premium duffel bag.",
    colors: [
      { name: "Midnight Black", bg: "#000000" },
    ],
    features: [
      "All-in-one bundle",
      "Premium quality materials",
      "Perfect for gifting",
    ],
    specs: [
      { label: "Includes", value: "Shaker, Wraps, Bag, Towel" },
      { label: "Bag Capacity", value: "40 Liters" },
    ],
    shippingNotice: "Free standard shipping included",
    mainImage: "/favior_kit_white.png",
  }
};

export const productsList = Object.values(productsCatalog);
