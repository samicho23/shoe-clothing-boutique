import { prisma } from '../../config/database.js'
import { BadRequestError } from '../../errors/BadRequestError.js'
import { NotFoundError } from '../../errors/NotFoundError.js'
import type { AuthUser } from '../../types/common.types.js'
import { generateReference } from '../../utils/generate-reference.js'

export const FREE_SHIPPING_THRESHOLD = 100
export const FLAT_SHIPPING_FEE = 10

type OrderItemInput = { variantId: string; quantity: number }

type PlaceOrderInput = {
  items: OrderItemInput[]
  customerName: string
  phoneNumber: string
  address: string
  city: string
  note?: string
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'MOBILE_MONEY'
}

const roundMoney = (value: number) => Math.round(value * 100) / 100

export const placeOrder = async (user: AuthUser, input: PlaceOrderInput) => {
  const quantities = new Map<string, number>()
  for (const item of input.items) {
    quantities.set(item.variantId, (quantities.get(item.variantId) ?? 0) + item.quantity)
  }

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: [...quantities.keys()] }, product: { isActive: true } },
    include: { product: true },
  })

  if (variants.length !== quantities.size) {
    throw new NotFoundError('One or more items are no longer available', 'ORDER_ITEM_UNAVAILABLE')
  }

  const orderItems = variants.map((variant) => {
    const quantity = quantities.get(variant.id) ?? 0
    if (quantity > variant.quantity) {
      throw new BadRequestError(
        `${variant.product.name}${variant.size ? ` (${variant.size})` : ''} only has ${variant.quantity} left in stock`,
        'INSUFFICIENT_STOCK',
      )
    }
    const unitPrice = Number(variant.sellingPrice)
    return {
      variantId: variant.id,
      productName: variant.product.name,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      unitPrice,
      quantity,
      lineTotal: roundMoney(unitPrice * quantity),
    }
  })

  const subtotal = roundMoney(orderItems.reduce((total, item) => total + item.lineTotal, 0))
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE
  const total = roundMoney(subtotal + shippingFee)
  const reference = generateReference('ORD')

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        reference,
        userId: user.id,
        paymentMethod: input.paymentMethod,
        subtotal,
        shippingFee,
        total,
        customerName: input.customerName,
        phoneNumber: input.phoneNumber,
        address: input.address,
        city: input.city,
        note: input.note,
        status: 'PENDING',
        items: { create: orderItems },
      },
      include: { items: true },
    })

    for (const item of orderItems) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { quantity: { decrement: item.quantity } },
      })
      await tx.inventoryMovement.create({
        data: {
          variantId: item.variantId,
          userId: user.id,
          type: 'SALE',
          quantity: -item.quantity,
          reason: `Online order ${reference}`,
        },
      })
    }

    return {
      id: order.id,
      reference: order.reference,
      status: order.status,
      paymentMethod: order.paymentMethod,
      subtotal,
      shippingFee,
      total,
      customerName: order.customerName,
      phoneNumber: order.phoneNumber,
      address: order.address,
      city: order.city,
      note: order.note,
      createdAt: order.createdAt.toISOString(),
      items: orderItems,
    }
  })
}
