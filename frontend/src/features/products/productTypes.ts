export type Product = { id: string; name: string; sku: string; category: 'Shoes' | 'Clothing' | 'Accessories' | 'Other'; price: string; cost: string; stock: number; status: string; createdAt: string; image: string }
export type ProductInput = { name: string; sku: string; category: Product['category']; price: number; stock: number }
