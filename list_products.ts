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

  const products = await prisma.product.findMany({ select: { name: true, id: true } })
  console.log("Current Products:")
  console.log(products)
}

main().catch(console.error)
