import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  // Delete all existing products
  await prisma.product.deleteMany({})

  // Create or get a category for gym accessories
  let category = await prisma.category.findFirst({ where: { slug: 'gym-accessories' } })
  if (!category) {
    category = await prisma.category.create({
      data: {
        title: 'Gym Accessories',
        slug: 'gym-accessories',
        description: 'Favior Gym Accessories',
        visible: true
      }
    })
  }

  // Create Favior products
  const products = [
    {
      name: 'Favior Resistance Bands',
      slug: 'favior-resistance-bands',
      price: '1999',
      description: 'High quality resistance bands for your workout.',
      mainImage: '/favior_bands_white.png',
      shippingNotice: 'Ships in 2-3 days',
      quantity: 100,
      categoryId: category.id,
      showInBestSellers: true
    },
    {
      name: 'Favior Gym Kit',
      slug: 'favior-gym-kit',
      price: '3499',
      description: 'Complete Favior gym kit.',
      mainImage: '/favior_kit_white.png',
      shippingNotice: 'Ships in 2-3 days',
      quantity: 50,
      categoryId: category.id,
      showInBestSellers: true
    },
    {
      name: 'Favior Shaker Bottle',
      slug: 'favior-shaker',
      price: '999',
      description: 'Premium shaker bottle for your protein shakes.',
      mainImage: '/favior_shaker_white.png',
      shippingNotice: 'Ships in 1-2 days',
      quantity: 200,
      categoryId: category.id,
      showInBestSellers: true
    },
    {
      name: 'Favior Wrist Wraps',
      slug: 'favior-wrist-wraps',
      price: '1299',
      description: 'Heavy duty wrist wraps for lifting.',
      mainImage: '/favior_wristwrap_white.png',
      shippingNotice: 'Ships in 2-3 days',
      quantity: 150,
      categoryId: category.id,
      showInBestSellers: true
    }
  ]

  for (const productData of products) {
    await prisma.product.create({ data: productData })
  }

  console.log(`Successfully seeded ${products.length} Favior products.`)
}

main().catch(console.error).finally(() => process.exit(0))
