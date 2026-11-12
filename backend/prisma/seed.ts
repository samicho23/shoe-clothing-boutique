import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '../src/config/env.js'
import { hashPassword } from '../src/utils/password.js'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: env.DATABASE_URL }) })

const main = async () => {
  const password = await hashPassword('boutique-admin')
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: { description: 'Full boutique administration access', isSystem: true },
    create: { name: 'ADMIN', description: 'Full boutique administration access', isSystem: true },
  })
  await prisma.user.upsert({
    where: { email: 'admin@boutique.local' },
    update: { password, firstName: 'Abebe', lastName: 'Bekele', status: 'ACTIVE', emailVerified: true, roles: { connect: { id: adminRole.id } } },
    create: { email: 'admin@boutique.local', password, firstName: 'Abebe', lastName: 'Bekele', status: 'ACTIVE', emailVerified: true, roles: { connect: { id: adminRole.id } } },
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
