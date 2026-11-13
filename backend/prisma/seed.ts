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
  const admin = await prisma.user.upsert({
    where: { email: 'admin@boutique.local' },
    update: { password, firstName: 'Abebe', lastName: 'Bekele', status: 'ACTIVE', emailVerified: true },
    create: { email: 'admin@boutique.local', password, firstName: 'Abebe', lastName: 'Bekele', status: 'ACTIVE', emailVerified: true },
  })
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id },
  })
  await prisma.category.createMany({
    data: [
      { name: 'Shoes', slug: 'shoes' },
      { name: 'Clothing', slug: 'clothing' },
      { name: 'Accessories', slug: 'accessories' },
    ],
    skipDuplicates: true,
  })

  const categories = Object.fromEntries((await prisma.category.findMany()).map((category) => [category.name, category.id]))

  const catalogue = [
    { name: 'Classic Leather Sneaker', type: 'SHOES', category: 'Shoes', image: '/images/products/leather-sneaker.jpg', description: 'A clean low-top sneaker in soft leather, built on a cushioned rubber sole that holds up to daily wear.', price: 129, sizes: ['40', '41', '42', '43', '44'] },
    { name: 'Plaid Flannel Shirt', type: 'CLOTHING', category: 'Clothing', image: '/images/products/plaid-flannel-shirt.jpg', description: 'Brushed cotton flannel in a rich tartan, cut with a relaxed shoulder and a rounded hem.', price: 79, sizes: ['S', 'M', 'L', 'XL'] },
    { name: 'Mauve Crew-Neck Tee', type: 'CLOTHING', category: 'Clothing', image: '/images/products/mauve-crew-tee.jpg', description: 'Heavyweight combed cotton with a soft hand-feel and a collar that keeps its shape wash after wash.', price: 34, sizes: ['S', 'M', 'L', 'XL'] },
    { name: 'Green Overshirt', type: 'CLOTHING', category: 'Clothing', image: '/images/products/green-overshirt.jpg', description: 'A gauzy layer for changing seasons — roomy through the body with a clean camp collar.', price: 89, sizes: ['S', 'M', 'L', 'XL'] },
    { name: 'Slim Straight Jeans', type: 'CLOTHING', category: 'Clothing', image: '/images/products/slim-straight-jeans.jpg', description: 'Rigid indigo denim with a slim-straight leg and a mid rise that sits comfortably all day.', price: 98, sizes: ['28', '30', '32', '34', '36'] },
    { name: 'Denim Shorts', type: 'CLOTHING', category: 'Clothing', image: '/images/products/denim-shorts.jpg', description: 'Cut from the same rigid denim as our jeans and finished with a clean, raw hem.', price: 54, sizes: ['28', '30', '32', '34'] },
    { name: 'Teal Piqué Polo', type: 'CLOTHING', category: 'Clothing', image: '/images/products/teal-polo.jpg', description: 'Breathable cotton piqué with a two-button placket — smart enough for the week, easy on the weekend.', price: 45, sizes: ['S', 'M', 'L', 'XL'] },
    { name: 'Orange Graphic Tee', type: 'CLOTHING', category: 'Clothing', image: '/images/products/orange-graphic-tee.jpg', description: 'A wash-soft cotton tee with a small chest print and a boxy, slightly cropped body.', price: 32, sizes: ['S', 'M', 'L', 'XL'] },
    { name: 'Colourblock Raglan Tee', type: 'CLOTHING', category: 'Clothing', image: '/images/products/colourblock-raglan-tee.jpg', description: 'Contrast raglan sleeves in a slub cotton jersey, finished with a ribbed neckline.', price: 36, sizes: ['S', 'M', 'L', 'XL'] },
    { name: 'Dream Graphic Tee', type: 'CLOTHING', category: 'Clothing', image: '/images/products/dream-graphic-tee.jpg', description: 'Our olive staple with a faded screen print, garment-dyed so every piece fades a little differently.', price: 34, sizes: ['S', 'M', 'L', 'XL'] },
    { name: 'White Graphic Tee', type: 'CLOTHING', category: 'Clothing', image: '/images/products/white-graphic-tee.jpg', description: 'A bright white cotton tee with a soft-hand watercolour print across the chest.', price: 30, sizes: ['S', 'M', 'L', 'XL'] },
    { name: 'Tailored Black Trousers', type: 'CLOTHING', category: 'Clothing', image: '/images/products/tailored-trousers.jpg', description: 'A pressed straight-leg trouser in a fluid wool blend, with a hidden hook closure at the waist.', price: 89, sizes: ['28', '30', '32', '34', '36'] },
    { name: 'Black Boxy Tee', type: 'CLOTHING', category: 'Clothing', image: '/images/products/black-boxy-tee.jpg', description: 'The plain black tee, done properly: dense cotton, dropped shoulder, clean twin-needle hem.', price: 32, sizes: ['S', 'M', 'L', 'XL'] },
  ] as const

  for (const entry of catalogue) {
    const existing = await prisma.product.findFirst({ where: { name: entry.name } })
    const product = existing
      ? await prisma.product.update({ where: { id: existing.id }, data: { imageUrl: entry.image, description: entry.description } })
      : await prisma.product.create({
          data: {
            name: entry.name,
            description: entry.description,
            type: entry.type,
            categoryId: categories[entry.category],
            imageUrl: entry.image,
          },
        })

    for (const size of entry.sizes) {
      const sku = `${entry.name.slice(0, 3).toUpperCase().replace(/\s/g, '')}-${size}-${product.id.slice(-5).toUpperCase()}`
      await prisma.productVariant.upsert({
        where: { sku },
        update: { sellingPrice: entry.price, costPrice: Number((entry.price * 0.45).toFixed(2)), quantity: 12 },
        create: {
          productId: product.id,
          sku,
          size,
          sellingPrice: entry.price,
          costPrice: Number((entry.price * 0.45).toFixed(2)),
          quantity: 12,
          minimumStock: 3,
        },
      })
    }
  }
}

main().finally(() => prisma.$disconnect())
