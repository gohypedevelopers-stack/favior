import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// ─── Category Mappings ───────────────────────────────────────────────────────

const CATEGORIES = [
  { title: "Shakers", slug: "shakers", description: "Premium Shaker Bottles" },
  { title: "Wristbands", slug: "wristbands", description: "Heavy Duty Wrist Wraps" },
  { title: "Accessories", slug: "accessories", description: "Gym Accessories" },
  { title: "Gym Kits", slug: "gym-kits", description: "Complete Workout Kits" },
];

// ─── Product Data (from existing products-data.ts) ───────────────────────────

const PRODUCTS = [
  {
    slug: "the-aube-shaker",
    name: "The Aube Shaker",
    categorySlug: "shakers",
    price: "RS. 2,900",
    oldPrice: "RS. 3,500",
    discount: "17% off",
    rating: 4.8,
    reviewsCount: "1.2K Reviews",
    description: "Premium protein shaker bottle engineered for smooth mixing. Leak-proof and BPA-free.",
    mainImage: "/favior_shaker_white.png",
    shippingNotice: "Free 2-day shipping on orders above RS. 5,000",
    colors: [
      { name: "Stealth Black", bgHex: "#1e1e24" },
      { name: "Arctic White", bgHex: "#f8f9fa" },
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
  },
  {
    slug: "the-aube-wrist-wraps",
    name: "The Aube Wrist Wraps",
    categorySlug: "wristbands",
    price: "RS. 15,900",
    oldPrice: "RS. 18,900",
    discount: "15% off",
    rating: 4.9,
    reviewsCount: "850 Reviews",
    description: "Heavy-duty wrist wraps for ultimate support during heavy lifts. Engineered for powerlifters and bodybuilders.",
    mainImage: "/favior_wristwrap_white.png",
    shippingNotice: "Free 2-day shipping on orders above RS. 5,000",
    colors: [
      { name: "Classic Black", bgHex: "#111111" },
      { name: "Crimson Red", bgHex: "#990000" },
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
  },
  {
    slug: "favior-resistance-bands",
    name: "Favior Resistance Bands Set",
    categorySlug: "accessories",
    price: "RS. 4,500",
    oldPrice: null,
    discount: null,
    rating: 4.7,
    reviewsCount: "2.3K Reviews",
    description: "Complete set of fabric resistance bands. Won't roll up or snap during your lower body workouts.",
    mainImage: "/favior_bands_white.png",
    shippingNotice: "Free 2-day shipping on orders above RS. 5,000",
    colors: [
      { name: "Mixed Pack", bgHex: "#e5e7eb" },
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
  },
  {
    slug: "favior-complete-kit",
    name: "Favior Complete Gym Kit",
    categorySlug: "gym-kits",
    price: "RS. 25,000",
    oldPrice: "RS. 32,000",
    discount: "21% off",
    rating: 5.0,
    reviewsCount: "340 Reviews",
    description: "Everything you need to start your fitness journey. Includes shaker, wrist wraps, towel, and a premium duffel bag.",
    mainImage: "/favior_kit_white.png",
    shippingNotice: "Free standard shipping included",
    colors: [
      { name: "Midnight Black", bgHex: "#000000" },
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
  }
];

// ─── Seed ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...\n");

  // 1. Create categories
  console.log("📁 Creating categories...");
  const categoryMap = new Map<string, string>();

  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { title: cat.title, description: cat.description },
      create: { title: cat.title, slug: cat.slug, description: cat.description, visible: true },
    });
    categoryMap.set(cat.slug, created.id);
    console.log(`  ✅ ${cat.title} (${cat.slug})`);
  }

  // 2. Create products with relations
  console.log("\n📦 Creating products...");

  for (const product of PRODUCTS) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) {
      console.log(`  ⚠️  Skipping ${product.name} — category "${product.categorySlug}" not found`);
      continue;
    }

    const { categorySlug, colors, features, specs, ...productData } = product;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...productData,
        categoryId,
      },
      create: {
        ...productData,
        categoryId,
        colors: { create: colors },
        features: { create: features.map((f) => ({ featureText: f })) },
        specs: { create: specs },
      },
    });

    console.log(`  ✅ ${product.name}`);
  }

  // 3. Update category product counts
  console.log("\n📊 Updating category product counts...");
  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    const count = await prisma.product.count({ where: { categoryId: cat.id } });
    await prisma.category.update({ where: { id: cat.id }, data: { productCount: count } });
    console.log(`  ✅ ${cat.title}: ${count} products`);
  }

  // 4. Create default users (Admin & Customer)
  console.log("\n👤 Creating default users...");
  const adminPasswordHash = await bcrypt.hash("adminpassword123", 10);
  const customerPasswordHash = await bcrypt.hash("userpassword123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@favior.com" },
    update: { role: UserRole.ADMIN },
    create: {
      name: "Admin User",
      email: "admin@favior.com",
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });
  console.log(`  ✅ Admin User: ${adminUser.email} (Role: ${adminUser.role})`);

  const customerUser = await prisma.user.upsert({
    where: { email: "user@favior.com" },
    update: { role: UserRole.CUSTOMER },
    create: {
      name: "Customer User",
      email: "user@favior.com",
      passwordHash: customerPasswordHash,
      role: UserRole.CUSTOMER,
    },
  });
  console.log(`  ✅ Customer User: ${customerUser.email} (Role: ${customerUser.role})`);

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
