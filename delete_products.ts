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

  // Delete all XElectron products
  const result = await prisma.product.deleteMany({
    where: {
      name: {
        startsWith: 'XElectron'
      }
    }
  })

  console.log(`Deleted ${result.count} XElectron products.`)
}

main().catch(console.error)
