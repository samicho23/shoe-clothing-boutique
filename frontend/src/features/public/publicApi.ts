import { api } from '../../services/api'

export type CatalogProduct = {
  id: string
  name: string
  description?: string | null
  type: string
  category: string
  imageUrl?: string | null
  variants: Array<{ id: string; sku: string; size?: string | null; color?: string | null; price: number; quantity: number }>
}

export type NewsArticle = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  imageUrl?: string | null
  isPublished: boolean
  publishedAt?: string | null
}

export type GalleryItem = {
  id: string
  title: string
  imageUrl: string
  altText?: string | null
  sortOrder: number
  isVisible: boolean
}

export type BoutiqueMeta = {
  name: string
  description: string
  categories: Array<{ id: string; name: string; slug: string }>
  roles: Array<{ id: string; name: string; description?: string | null }>
  productTypes: string[]
  paymentMethods: string[]
}

export const getPublicCatalog = async () => (await api.get<{ data: { categories: Array<{ id: string; name: string; slug: string }>; products: CatalogProduct[] } }>('/public/catalog')).data.data
export const getPublicNews = async () => (await api.get<{ data: NewsArticle[] }>('/public/news')).data.data
export const getPublicGallery = async () => (await api.get<{ data: GalleryItem[] }>('/public/gallery')).data.data
export const getBoutiqueMeta = async () => (await api.get<{ data: BoutiqueMeta }>('/meta')).data.data
export const submitContact = async (input: { name: string; email: string; subject?: string; message: string }) => (await api.post<{ data: { id: string; message: string } }>('/public/contact', input)).data.data

export type OrderItemInput = { variantId: string; quantity: number }

export type OrderInput = {
  items: OrderItemInput[]
  customerName: string
  phoneNumber: string
  address: string
  city: string
  note?: string
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'MOBILE_MONEY'
}

export type PlacedOrder = {
  id: string
  reference: string
  status: string
  paymentMethod: string
  subtotal: number
  shippingFee: number
  total: number
  customerName: string
  phoneNumber: string
  address: string
  city: string
  note?: string | null
  createdAt: string
  items: Array<{ variantId: string; productName: string; size?: string | null; color?: string | null; unitPrice: number; quantity: number; lineTotal: number }>
}

export const placeOrder = async (input: OrderInput) => (await api.post<{ data: PlacedOrder }>('/public/orders', input)).data.data

export const getShippingRules = async () => (await api.get<{ data: { freeShippingThreshold: number; flatShippingFee: number } }>('/public/shipping')).data.data
