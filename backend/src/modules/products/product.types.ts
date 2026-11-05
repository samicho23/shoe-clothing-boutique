export type ProductCategory = 'Shoes' | 'Clothing' | 'Accessories' | 'Other'
export type Product = { id: string; name: string; sku: string; category: ProductCategory; price: number; stock: number; status: 'In stock' | 'Low stock' | 'Out of stock'; createdAt: string }
