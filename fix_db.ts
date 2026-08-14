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

  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    })
    
    if (admin && admin.email.includes('xelectron.com')) {
      await prisma.user.update({
        where: { id: admin.id },
        data: { email: 'admin@favior.com' },
      })
      console.log('Updated admin email to admin@favior.com')
    } else {
      console.log('No admin found or already updated', admin)
    }
  } catch (error) {
    console.error('Database update failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
