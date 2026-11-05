# API documentation

All routes are versioned under `/api/v1`.

## Health

`GET /api/v1/health`

## Products

`GET /api/v1/products?search=loafer&category=Shoes`

`POST /api/v1/products`

```json
{
  "name": "Siena leather loafer",
  "sku": "SH-00248",
  "category": "Shoes",
  "price": 189,
  "stock": 24
}
```

The current development API validates the request and rejects duplicate SKUs. Persistence-backed module routes will be added alongside the Prisma migration.
