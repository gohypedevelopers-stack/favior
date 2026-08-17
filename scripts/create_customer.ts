import { db } from '../src/lib/db/index';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('customerpassword123', 10);
  
  const user = await db.user.upsert({
    where: { email: 'customer@favior.com' },
    update: {
      passwordHash: hashedPassword,
      role: 'CUSTOMER'
    },
    create: {
      email: 'customer@favior.com',
      name: 'Test Customer',
      passwordHash: hashedPassword,
      role: 'CUSTOMER'
    }
  });

  console.log('Customer created/updated:', user.email);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
