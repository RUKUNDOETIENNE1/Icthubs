import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin1234', 10)
  await prisma.user.upsert({
    where: { email: 'admin@icthubs.com' },
    update: {},
    create: {
      email: 'admin@icthubs.com',
      name: 'Super Admin',
      password,
      role: 'SUPER_ADMIN'
    }
  })
  console.log('Seeded default SUPER_ADMIN: admin@icthubs.com / admin1234 (change in production)')
}

main().finally(async () => {
  await prisma.$disconnect()
})
