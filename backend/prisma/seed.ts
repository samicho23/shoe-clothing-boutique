import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '../src/config/env.js'
import { hashPassword } from '../src/utils/password.js'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: env.DATABASE_URL }) })

const main = async () => {
  const passwordHash = await hashPassword('atelier-admin')
  await prisma.user.upsert({
    where: { email: 'admin@atelier.local' },
    update: { passwordHash, name: 'Jordan Smith', role: 'ADMIN', isActive: true },
    create: { email: 'admin@atelier.local', passwordHash, name: 'Jordan Smith', role: 'ADMIN' },
  })
  await prisma.category.createMany({
    data: [
      { name: 'Shoes', slug: 'shoes' },
      { name: 'Clothing', slug: 'clothing' },
      { name: 'Accessories', slug: 'accessories' },
    ],
    skipDuplicates: true,
  })
}

main().finally(() => prisma.$disconnect())
