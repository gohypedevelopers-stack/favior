import type { ProductDetail } from "@/types/product";
export * from "@/types/product";

// Sample mock data for a premium eyewear product
export const sampleProductDetail: ProductDetail = {
  id: "heritage-oval",
  slug: "heritage-oval",
  editLabel: "HERITAGE COLLECTIVE",
  title: "HERITAGE OVAL",
  breadcrumb: [
    { label: "Homepage", href: "/" },
    { label: "Collections", href: "/all-products" },
    { label: "Heritage Oval" },
    { label: "Glossy Black" },
  ],
  originalPrice: "₹10,500",
  price: "₹8,999",
  sold: "1,238 Sold",
  rating: "4.8",
  description:
    "An architectural oval frame sculpted from premium polished bio-acetate, featuring custom hardware and signature wire cores. Engineered to balance sharp contours with smooth, beveled edges for an elevated, timeless profile.",
  detailsBody:
    "Precision-sculpted bio-acetate with 100% UV400 protective lenses. Designed with a robust 5-barrel hinge construction and signature metal temple accents to ensure lasting durability and comfort.",
  careNotes: [
    "Wipe lenses with the microfiber cleaning cloth.",
    "Store in the provided leather protective case.",
    "Avoid leaving in high heat (like a car dashboard).",
    "Rinse with lukewarm water and mild soap if needed.",
  ],
  shippingNotes: [
    "Standard delivery in 2-4 business days.",
    "Free exchange within 14 days.",
    "Cash on delivery available on select pin codes.",
  ],
  colorName: "Glossy Black",
  colors: [
    { name: "Glossy Black", value: "#000000" },
    { name: "Royal Tortoise", value: "#6f5639" },
    { name: "Ivory Mist", value: "#ebe8e1" },
    { name: "Midnight Blue", value: "#111722" },
  ],
  sizes: ["XS", "S", "M", "L"],
  gallery: [
    { src: "/favior_shaker_white.png", alt: "Classic Heritage Oval sunglasses in glossy black frame", objectPosition: "center center" },
    { src: "/favior_kit_white.png", alt: "Detail view of the premium acetate frame and custom wire core", objectPosition: "center center" },
    { src: "/favior_wristwrap_white.png", alt: "Model posing in Heritage Oval sunglasses", objectPosition: "center center" },
    { src: "/favior_bands_white.png", alt: "Studio portrait highlighting front profile of Heritage Oval", objectPosition: "center center" },
  ],
  deliveryPerks: [
    { label: "Fast delivery", detail: "2-4 days", icon: "truck" },
    { label: "Easy exchange", detail: "14 days", icon: "exchange" },
    { label: "Secure checkout", detail: "COD available", icon: "shield" },
    { label: "Tracked shipping", detail: "Live updates", icon: "card" },
  ],
  highlights: [
    {
      title: "Precision Bio-Acetate",
      description: "Meticulously sculpted from organically sourced bio-acetate, each frame undergoes a multi-day tumbling process and precision polishing. This creates a rich, lustrous finish with exceptional durability and lightweight, hypoallergenic comfort.",
      imageSrc: "/favior_shaker_white.png",
      imageAlt: "Close-up of premium polished acetate frame details",
      imagePosition: "center 42%",
    },
    {
      title: "Signature 5-Barrel Hinges",
      description: "Reinforced custom metal hinges and wire temple cores provide structural longevity. Engineered to distribute weight evenly and balance the fit, ensuring the frames rest comfortably on your nose bridge without sliding.",
      imageSrc: "/favior_kit_white.png",
      imageAlt: "Detail view of premium custom hinge construction and wire core craftsmanship",
      imagePosition: "center 36%",
    },
  ],
};

export const productsCatalog: Record<string, ProductDetail> = {
  "heritage-oval": sampleProductDetail,
  "the-havane": {
    id: "p1",
    slug: "the-havane",
    editLabel: "SIGNATURE SERIES",
    title: "THE HAVANE SHAKER",
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Bestsellers", href: "/#products" },
      { label: "The Havane" },
    ],
    originalPrice: "RS. 19,999",
    price: "RS. 16,500",
    sold: "3,410 Sold",
    rating: "4.9",
    description:
      "600ml double-wall insulated stainless steel shaker with leak-proof screw lid and precision removable mixing grid. Engineered for zero residue, zero odor, and maximum thermal endurance.",
    detailsBody:
      "Constructed from kitchen-grade 18/8 stainless steel with a matte powder-coated finish. Features silent-flow internal spout geometry and condensation-free exterior touch.",
    careNotes: [
      "Hand wash recommended with warm soapy water.",
      "Lid and mixing grid are top-rack dishwasher safe.",
      "Do not microwave or place in freezer.",
      "Store with lid off when not in use for optimal freshness.",
    ],
    shippingNotes: [
      "Express delivery in 2-3 business days across India.",
      "Free 7-day hassle-free replacement.",
      "Cash on Delivery & Prepaid UPI available.",
    ],
    colorName: "Matte Onyx",
    colors: [
      { name: "Matte Onyx", value: "#111111" },
      { name: "Raw Steel", value: "#888888" },
      { name: "Chalk White", value: "#f3f3f3" },
    ],
    sizes: ["600ml", "750ml", "1000ml"],
    gallery: [
      { src: "/favior_shaker_white.png", alt: "The Havane Stainless Steel Shaker in Matte Onyx", objectPosition: "center center" },
      { src: "/favior_kit_white.png", alt: "The Havane with full training set accessories", objectPosition: "center center" },
      { src: "/favior_wristwrap_white.png", alt: "Detail of leak-proof seal and grip lid", objectPosition: "center center" },
      { src: "/og_shaker.png", alt: "The Havane shaker studio profile", objectPosition: "center center" },
    ],
    deliveryPerks: [
      { label: "Fast delivery", detail: "2-3 days", icon: "truck" },
      { label: "Easy exchange", detail: "7 days", icon: "exchange" },
      { label: "Secure checkout", detail: "COD available", icon: "shield" },
      { label: "Tracked shipping", detail: "Live updates", icon: "card" },
    ],
    highlights: [
      {
        title: "Double-Wall Vacuum Insulation",
        description: "Keeps protein smoothies and electrolyte blends icy cold for up to 24 hours. The condensation-free outer wall guarantees a firm, dry grip during intense training sessions.",
        imageSrc: "/favior_shaker_white.png",
        imageAlt: "Vacuum insulation engineering detail",
        imagePosition: "center center",
      },
      {
        title: "Acoustic-Grade Leakproof Seal",
        description: "Precision-machined threading and medical-grade food-safe silicone gaskets prevent leaks under 5 atmospheres of kinetic pressure.",
        imageSrc: "/favior_kit_white.png",
        imageAlt: "Leakproof seal mechanism detail",
        imagePosition: "center center",
      },
    ],
  },
  "the-aube": {
    id: "p2",
    slug: "the-aube",
    editLabel: "HEAVY ATHLETICS",
    title: "THE AUBE WRIST WRAPS",
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Equipment", href: "/#products" },
      { label: "The Aube" },
    ],
    originalPrice: "RS. 18,299",
    price: "RS. 15,900",
    sold: "2,840 Sold",
    rating: "4.8",
    description:
      "Heavy-duty 18-inch competition grade wrist wraps with reinforced thumb loops and industrial hook-and-loop closure. Built for supreme wrist stability during maximal pressing and overhead lifts.",
    detailsBody:
      "Woven from high-tensile cotton elastic blend with multi-row nylon stitching. Delivers adjustable cast-like stiffness or moderate flexibility based on wrap tension.",
    careNotes: [
      "Hand wash in cool water with mild sports detergent.",
      "Air dry flat away from direct sunlight.",
      "Fasten hook-and-loop tabs before washing.",
    ],
    shippingNotes: [
      "Standard delivery in 2-4 business days.",
      "Free 7-day exchange for sizing/support checks.",
      "COD available nationwide.",
    ],
    colorName: "Stealth Black",
    colors: [
      { name: "Stealth Black", value: "#111111" },
      { name: "Gunmetal Gray", value: "#444444" },
      { name: "Military Olive", value: "#3b4437" },
    ],
    sizes: ["18 Inch", "24 Inch"],
    gallery: [
      { src: "/favior_wristwrap_white.png", alt: "The Aube Wrist Wraps Pair in Stealth Black", objectPosition: "center center" },
      { src: "/favior_wristwrap_banner.png", alt: "The Aube Wraps in action banner", objectPosition: "center center" },
      { src: "/og_wristband.png", alt: "Wrist Wrap thumb loop and stitching detail", objectPosition: "center center" },
      { src: "/favior_kit_white.png", alt: "Wrist wrap rolled presentation", objectPosition: "center center" },
    ],
    deliveryPerks: [
      { label: "Fast delivery", detail: "2-4 days", icon: "truck" },
      { label: "Easy exchange", detail: "7 days", icon: "exchange" },
      { label: "Secure checkout", detail: "100% safe", icon: "shield" },
      { label: "Tracked shipping", detail: "Live updates", icon: "card" },
    ],
    highlights: [
      {
        title: "Dual-Density Elastic Weave",
        description: "Engineered specifically for heavy bench press, overhead squat, and strict press. Eliminates hyperextension risks under extreme barbell loads.",
        imageSrc: "/favior_wristwrap_white.png",
        imageAlt: "Close up of reinforced stitching",
      },
      {
        title: "Reinforced Thumb Anchors",
        description: "Double-reinforced box-X stitched elastic thumb loop ensures seamless single-handed wrapping with zero shifting under tension.",
        imageSrc: "/favior_wristwrap_banner.png",
        imageAlt: "Thumb anchor structural detail",
      },
    ],
  },
  "the-lumen": {
    id: "p3",
    slug: "the-lumen",
    editLabel: "COLLECTIVE BUNDLE",
    title: "THE LUMEN PERFORMANCE KIT",
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Bundles", href: "/#products" },
      { label: "The Lumen Kit" },
    ],
    originalPrice: "RS. 21,999",
    price: "RS. 18,500",
    sold: "1,980 Sold",
    rating: "5.0",
    description:
      "Complete elite training bundle featuring our double-wall thermal shaker, 18-inch competition wrist wraps, 5-piece resistance band set, and custom travel chalk case.",
    detailsBody:
      "All-in-one curated performance collection tailored for serious lifters. Includes matte-black ballistic nylon gear bag for organized gym transport.",
    careNotes: [
      "Refer to individual item care specifications.",
      "Wipe down gear bag with damp microfiber cloth.",
      "Store in cool, dry climate.",
    ],
    shippingNotes: [
      "Complimentary express courier shipping.",
      "Signature on delivery included.",
      "7-day easy exchange guarantee.",
    ],
    colorName: "Monochrome Black",
    colors: [
      { name: "Monochrome Black", value: "#0a0a0a" },
      { name: "Graphite", value: "#2c2c2c" },
    ],
    sizes: ["Standard Bundle", "Deluxe Pro Bundle"],
    gallery: [
      { src: "/favior_kit_white.png", alt: "The Lumen Performance Kit in White Studio Setting", objectPosition: "center center" },
      { src: "/favior_shaker_white.png", alt: "Kit Stainless Shaker Included", objectPosition: "center center" },
      { src: "/favior_wristwrap_white.png", alt: "Kit Wrist Wraps Included", objectPosition: "center center" },
      { src: "/favior_bands_white.png", alt: "Kit Resistance Bands Included", objectPosition: "center center" },
    ],
    deliveryPerks: [
      { label: "Express delivery", detail: "1-2 days", icon: "truck" },
      { label: "Easy exchange", detail: "7 days", icon: "exchange" },
      { label: "Secure checkout", detail: "Protected", icon: "shield" },
      { label: "Tracked shipping", detail: "Priority", icon: "card" },
    ],
  },
  "the-brume": {
    id: "p4",
    slug: "the-brume",
    editLabel: "RESISTANCE ESSENTIALS",
    title: "THE BRUME RESISTANCE BANDS",
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Accessories", href: "/#products" },
      { label: "The Brume" },
    ],
    originalPrice: "RS. 17,599",
    price: "RS. 15,900",
    sold: "1,620 Sold",
    rating: "4.9",
    description:
      "Set of 5 heavy-duty 100% natural Malaysian latex loop bands with calibrated progressive resistance levels (10 lbs to 60 lbs) and breathable mesh travel pouch.",
    detailsBody:
      "Continuous layer-dip dipping process provides snap resistance and consistent tension throughout full range of motion. Ideal for warmups, mobility, and progressive overload.",
    careNotes: [
      "Wipe clean with damp cloth after sweaty sessions.",
      "Store away from direct sunlight and heat sources.",
      "Lightly dust with talc powder occasionally for longevity.",
    ],
    shippingNotes: [
      "Dispatched within 24 hours.",
      "Free 7-day replacement policy.",
      "COD available on all pin codes.",
    ],
    colorName: "Obsidian Gradient",
    colors: [
      { name: "Obsidian Gradient", value: "#1f1f1f" },
      { name: "Natural Earth", value: "#4a4036" },
    ],
    sizes: ["5-Band Set"],
    gallery: [
      { src: "/favior_bands_white.png", alt: "The Brume Resistance Bands Full Set", objectPosition: "center center" },
      { src: "/favior_kit_white.png", alt: "The Brume Bands with Travel Pouch", objectPosition: "center center" },
      { src: "/favior_wristwrap_white.png", alt: "Elastic tensile demonstration", objectPosition: "center center" },
    ],
    deliveryPerks: [
      { label: "Fast delivery", detail: "2-3 days", icon: "truck" },
      { label: "Easy exchange", detail: "7 days", icon: "exchange" },
      { label: "Secure checkout", detail: "Guaranteed", icon: "shield" },
      { label: "Tracked shipping", detail: "Live updates", icon: "card" },
    ],
  },
  "pro-stainless-shaker": {
    id: "c1",
    slug: "pro-stainless-shaker",
    editLabel: "ONLINE EXCLUSIVE",
    title: "PRO STAINLESS SHAKER — ONYX",
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Hydration", href: "/#products" },
      { label: "Pro Stainless Shaker" },
    ],
    originalPrice: "₹1,999",
    price: "₹1,499",
    sold: "4,520 Sold",
    rating: "4.9",
    description:
      "600ml double-wall insulated shaker with leak-proof lid and precision mixing grid. Built for gym perfection and lifetime durability.",
    detailsBody:
      "Medical grade 304 stainless steel interior resists bacteria and odor retention. Laser-etched volume indicators in both ml and oz.",
    careNotes: ["Dishwasher safe lid", "Hand wash flask body", "Do not microwave"],
    shippingNotes: ["Fast delivery in 2-4 days", "7 days easy replacement"],
    colorName: "Onyx Black",
    colors: [
      { name: "Onyx Black", value: "#1a1a1a" },
      { name: "Graphite", value: "#555555" },
      { name: "Pure Silver", value: "#d0d0d0" },
    ],
    sizes: ["600ml", "750ml"],
    gallery: [
      { src: "/favior_shaker_white.png", alt: "Pro Stainless Shaker Onyx", objectPosition: "center center" },
      { src: "/favior_kit_white.png", alt: "Pro Stainless Shaker Angle View", objectPosition: "center center" },
      { src: "/og_shaker.png", alt: "Shaker lid mechanism", objectPosition: "center center" },
    ],
    deliveryPerks: [
      { label: "Fast delivery", detail: "2-4 days", icon: "truck" },
      { label: "Easy exchange", detail: "7 days", icon: "exchange" },
      { label: "Secure checkout", detail: "100% safe", icon: "shield" },
      { label: "Tracked shipping", detail: "Live updates", icon: "card" },
    ],
  },
  "elite-wrist-wraps": {
    id: "c2",
    slug: "elite-wrist-wraps",
    editLabel: "ONLINE EXCLUSIVE",
    title: "ELITE WRIST WRAPS — BLACK",
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Equipment", href: "/#products" },
      { label: "Elite Wrist Wraps" },
    ],
    originalPrice: "₹1,299",
    price: "₹999",
    sold: "3,110 Sold",
    rating: "4.8",
    description:
      "Heavy-duty 18\" wrist wraps with thumb loop, built for maximum support during heavy lifts, bench pressing, and kettlebell overhead work.",
    detailsBody:
      "Thick elastic cotton composite blend engineered to support high-strain wrist flexion under maximal loads.",
    careNotes: ["Hand wash in cold water", "Hang dry", "Do not bleach"],
    shippingNotes: ["Standard delivery 2-4 days", "Free replacement"],
    colorName: "Deep Black",
    colors: [
      { name: "Deep Black", value: "#111111" },
      { name: "Shadow Gray", value: "#444444" },
    ],
    sizes: ["18 Inch", "24 Inch"],
    gallery: [
      { src: "/favior_wristwrap_white.png", alt: "Elite Wrist Wraps Black", objectPosition: "center center" },
      { src: "/favior_wristwrap_banner.png", alt: "Elite Wrist Wraps Flat", objectPosition: "center center" },
    ],
    deliveryPerks: [
      { label: "Fast delivery", detail: "2-4 days", icon: "truck" },
      { label: "Easy exchange", detail: "7 days", icon: "exchange" },
      { label: "Secure checkout", detail: "Protected", icon: "shield" },
      { label: "Tracked shipping", detail: "Live updates", icon: "card" },
    ],
  },
  "performance-gym-kit": {
    id: "c3",
    slug: "performance-gym-kit",
    editLabel: "ONLINE EXCLUSIVE",
    title: "PERFORMANCE GYM KIT",
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Curated Sets", href: "/#products" },
      { label: "Performance Gym Kit" },
    ],
    originalPrice: "₹3,999",
    price: "₹2,999",
    sold: "2,200 Sold",
    rating: "5.0",
    description:
      "Complete training essentials bundle: stainless shaker, wrist wraps, resistance bands & waterproof travel gym carry bag.",
    detailsBody:
      "Everything needed for dedicated strength training in a unified signature black finish.",
    careNotes: ["Wipe clean carry case", "See individual items for details"],
    shippingNotes: ["Express shipping 1-3 days", "Free 7-day exchange"],
    colorName: "Monochrome Black",
    colors: [
      { name: "Monochrome Black", value: "#111111" },
      { name: "Charcoal Slate", value: "#333333" },
    ],
    sizes: ["Full Set"],
    gallery: [
      { src: "/favior_kit_white.png", alt: "Performance Gym Kit Full View", objectPosition: "center center" },
      { src: "/favior_shaker_white.png", alt: "Performance Kit Shaker Included", objectPosition: "center center" },
      { src: "/favior_wristwrap_white.png", alt: "Performance Kit Wraps Included", objectPosition: "center center" },
      { src: "/favior_bands_white.png", alt: "Performance Kit Bands Included", objectPosition: "center center" },
    ],
    deliveryPerks: [
      { label: "Fast delivery", detail: "2-4 days", icon: "truck" },
      { label: "Easy exchange", detail: "7 days", icon: "exchange" },
      { label: "Secure checkout", detail: "Guaranteed", icon: "shield" },
      { label: "Tracked shipping", detail: "Live updates", icon: "card" },
    ],
  },
  "resistance-band-set": {
    id: "c4",
    slug: "resistance-band-set",
    editLabel: "ONLINE EXCLUSIVE",
    title: "RESISTANCE BAND SET",
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Accessories", href: "/#products" },
      { label: "Resistance Band Set" },
    ],
    originalPrice: "₹1,599",
    price: "₹1,199",
    sold: "1,550 Sold",
    rating: "4.9",
    description:
      "Set of 5 heavy-duty latex bands with varying resistance levels, non-slip texture, and travel pouch.",
    detailsBody: "100% natural latex dipping with calibrated resistance increments.",
    careNotes: ["Store dry", "Keep out of extreme heat"],
    shippingNotes: ["Delivery in 2-4 days", "Hassle-free replacement"],
    colorName: "Midnight Slate",
    colors: [
      { name: "Midnight Slate", value: "#333333" },
      { name: "Jet Black", value: "#111111" },
    ],
    sizes: ["5-Band Set"],
    gallery: [
      { src: "/favior_bands_white.png", alt: "Resistance Band Set", objectPosition: "center center" },
      { src: "/favior_kit_white.png", alt: "Resistance Band Set with Bag", objectPosition: "center center" },
    ],
    deliveryPerks: [
      { label: "Fast delivery", detail: "2-4 days", icon: "truck" },
      { label: "Easy exchange", detail: "7 days", icon: "exchange" },
      { label: "Secure checkout", detail: "Protected", icon: "shield" },
      { label: "Tracked shipping", detail: "Live updates", icon: "card" },
    ],
  },
};

export function getProductBySlug(slug: string): ProductDetail {
  if (productsCatalog[slug]) {
    return productsCatalog[slug];
  }
  // Try case-insensitive / normalized match
  const normalized = slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const found = Object.values(productsCatalog).find(
    (p) => p.slug === normalized || p.id?.toLowerCase() === normalized
  );
  if (found) return found;

  // Fallback to sampleProductDetail
  return sampleProductDetail;
}

export function getAllProductDetails(): ProductDetail[] {
  return Object.values(productsCatalog);
}
