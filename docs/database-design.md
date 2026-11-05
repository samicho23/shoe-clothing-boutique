# Database design

The Prisma schema in `backend/prisma/schema.prisma` models users, categories, products, variants, suppliers, purchases, customers, sales, payments, and inventory movements.

Inventory is held on `ProductVariant.quantity`. A completed purchase increases the variant quantity and records a `PURCHASE` movement. A completed sale decreases it and records a `SALE` movement. Sale items preserve `unitPrice` so historical receipts do not change when a product price changes.

Foreign keys use restrictive deletion for transaction and inventory references. Products and users have active flags so operational records can be preserved without destructive deletion.

## Commands

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate -- --name init
```
