import { prisma } from '../config/database.js'

export type ResourceName = 'categories' | 'customers' | 'inventory' | 'payments' | 'purchases' | 'sales' | 'suppliers' | 'users'
export type ResourceRecord = Record<string, unknown> & { id: string; createdAt: string }

const asRecord = (value: { id: string; createdAt: Date } & Record<string, unknown>): ResourceRecord => ({
  ...value,
  createdAt: value.createdAt.toISOString(),
})

export const listResource = async (name: ResourceName, search = ''): Promise<ResourceRecord[]> => {
  const term = search.trim()
  switch (name) {
    case 'categories': {
      const rows = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: 'asc' } })
      return rows.map((row) => asRecord({ id: row.id, createdAt: row.createdAt, name: row.name, slug: row.slug, productCount: row._count.products, status: 'Active' }))
    }
    case 'customers': {
      const rows = await prisma.customer.findMany({ where: term ? { OR: [{ name: { contains: term, mode: 'insensitive' } }, { email: { contains: term, mode: 'insensitive' } }, { phone: { contains: term, mode: 'insensitive' } }] } : {}, orderBy: { createdAt: 'desc' } })
      return rows.map((row) => asRecord({ id: row.id, createdAt: row.createdAt, name: row.name, phone: row.phone ?? '', email: row.email ?? '', totalPurchases: 0, status: 'Active' }))
    }
    case 'inventory': {
      const rows = await prisma.productVariant.findMany({ where: term ? { OR: [{ sku: { contains: term, mode: 'insensitive' } }, { product: { name: { contains: term, mode: 'insensitive' } } }] } : {}, include: { product: { include: { category: true } } }, orderBy: { updatedAt: 'desc' } })
      return rows.map((row) => asRecord({ id: row.id, createdAt: row.createdAt, product: row.product.name, sku: row.sku, category: row.product.category.name, available: row.quantity, minimum: row.minimumStock, costValue: Number(row.costPrice) * row.quantity, status: row.quantity === 0 ? 'Out of stock' : row.quantity <= row.minimumStock ? 'Low stock' : 'In stock' }))
    }
    case 'payments': {
      const rows = await prisma.payment.findMany({ where: term ? { OR: [{ reference: { contains: term, mode: 'insensitive' } }, { sale: { receiptNumber: { contains: term, mode: 'insensitive' } } }] } : {}, include: { sale: true }, orderBy: { createdAt: 'desc' } })
      return rows.map((row) => asRecord({ id: row.id, createdAt: row.createdAt, reference: row.reference ?? row.id, saleReference: row.sale.receiptNumber, method: row.method, amount: Number(row.amount), status: 'Completed' }))
    }
    case 'purchases': {
      const rows = await prisma.purchase.findMany({ where: term ? { OR: [{ reference: { contains: term, mode: 'insensitive' } }, { supplier: { name: { contains: term, mode: 'insensitive' } } }] } : {}, include: { supplier: true, _count: { select: { items: true } } }, orderBy: { createdAt: 'desc' } })
      return rows.map((row) => asRecord({ id: row.id, createdAt: row.createdAt, reference: row.reference, supplier: row.supplier.name, items: row._count.items, total: Number(row.totalAmount), status: row.status }))
    }
    case 'sales': {
      const rows = await prisma.sale.findMany({ where: term ? { OR: [{ receiptNumber: { contains: term, mode: 'insensitive' } }, { customer: { name: { contains: term, mode: 'insensitive' } } }] } : {}, include: { customer: true, user: true }, orderBy: { createdAt: 'desc' } })
      return rows.map((row) => asRecord({ id: row.id, createdAt: row.createdAt, reference: row.receiptNumber, customer: row.customer?.name ?? 'Walk-in customer', cashier: row.user.name, total: Number(row.total), status: row.paymentStatus }))
    }
    case 'suppliers': {
      const rows = await prisma.supplier.findMany({ where: term ? { OR: [{ name: { contains: term, mode: 'insensitive' } }, { email: { contains: term, mode: 'insensitive' } }, { phone: { contains: term, mode: 'insensitive' } }] } : {}, include: { _count: { select: { purchases: true } } }, orderBy: { createdAt: 'desc' } })
      return rows.map((row) => asRecord({ id: row.id, createdAt: row.createdAt, name: row.name, phone: row.phone ?? '', email: row.email ?? '', products: row._count.purchases, status: row.isActive ? 'Active' : 'Inactive' }))
    }
    case 'users': {
      const rows = await prisma.user.findMany({ where: term ? { OR: [{ name: { contains: term, mode: 'insensitive' } }, { email: { contains: term, mode: 'insensitive' } }] } : {}, orderBy: { createdAt: 'desc' } })
      return rows.map((row) => asRecord({ id: row.id, createdAt: row.createdAt, name: row.name, email: row.email, role: row.role, status: row.isActive ? 'Active' : 'Inactive' }))
    }
  }
}

export const createResource = async (name: ResourceName, values: Record<string, unknown>) => {
  if (name === 'categories') {
    const row = await prisma.category.create({ data: { name: String(values.name), slug: String(values.slug ?? values.name).toLowerCase().replace(/[^a-z0-9]+/g, '-') } })
    return asRecord({ id: row.id, createdAt: row.createdAt, name: row.name, slug: row.slug, productCount: 0, status: 'Active' })
  }
  if (name === 'customers') {
    const row = await prisma.customer.create({ data: { name: String(values.name), email: values.email ? String(values.email) : undefined, phone: values.phone ? String(values.phone) : undefined } })
    return asRecord({ id: row.id, createdAt: row.createdAt, name: row.name, email: row.email ?? '', phone: row.phone ?? '', totalPurchases: 0, status: 'Active' })
  }
  if (name === 'suppliers') {
    const row = await prisma.supplier.create({ data: { name: String(values.name), email: values.email ? String(values.email) : undefined, phone: values.phone ? String(values.phone) : undefined } })
    return asRecord({ id: row.id, createdAt: row.createdAt, name: row.name, email: row.email ?? '', phone: row.phone ?? '', products: 0, status: 'Active' })
  }
  throw new Error(`Creating ${name} records is not supported by the current API`)
}

export const updateResource = async (name: ResourceName, id: string, values: Record<string, unknown>) => {
  if (name === 'categories') return prisma.category.update({ where: { id }, data: { name: values.name ? String(values.name) : undefined } }).then((row) => asRecord({ id: row.id, createdAt: row.createdAt, name: row.name, slug: row.slug, productCount: 0, status: 'Active' }))
  if (name === 'customers') return prisma.customer.update({ where: { id }, data: { name: values.name ? String(values.name) : undefined, email: values.email ? String(values.email) : undefined, phone: values.phone ? String(values.phone) : undefined } }).then((row) => asRecord({ id: row.id, createdAt: row.createdAt, name: row.name, email: row.email ?? '', phone: row.phone ?? '', totalPurchases: 0, status: 'Active' }))
  if (name === 'suppliers') return prisma.supplier.update({ where: { id }, data: { name: values.name ? String(values.name) : undefined, email: values.email ? String(values.email) : undefined, phone: values.phone ? String(values.phone) : undefined } }).then((row) => asRecord({ id: row.id, createdAt: row.createdAt, name: row.name, email: row.email ?? '', phone: row.phone ?? '', products: 0, status: 'Active' }))
  return null
}

export const deleteResource = async (name: ResourceName, id: string) => {
  if (name === 'categories') { await prisma.category.delete({ where: { id } }); return true }
  if (name === 'customers') { await prisma.customer.delete({ where: { id } }); return true }
  if (name === 'suppliers') { await prisma.supplier.delete({ where: { id } }); return true }
  return false
}
