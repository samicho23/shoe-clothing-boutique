export const auditActions = {
  userCreated: 'user.created',
  userUpdated: 'user.updated',
  productCreated: 'product.created',
  productUpdated: 'product.updated',
  inventoryAdjusted: 'inventory.adjusted',
  saleCreated: 'sale.created',
  purchaseCreated: 'purchase.created',
} as const

export type AuditAction = (typeof auditActions)[keyof typeof auditActions]
