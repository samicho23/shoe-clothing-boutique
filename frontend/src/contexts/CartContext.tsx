import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type CartItem = {
  variantId: string
  productId: string
  name: string
  sku: string
  size?: string | null
  color?: string | null
  unitPrice: number
  imageUrl?: string | null
  quantity: number
  stock: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (item: CartItem) => void
  updateQuantity: (variantId: string, quantity: number) => void
  removeItem: (variantId: string) => void
  clear: () => void
}

const STORAGE_KEY = 'boutique_cart'
const CartContext = createContext<CartContextValue | null>(null)

const readCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item: CartItem) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.variantId === item.variantId)
      if (!existing) return [...current, item]
      return current.map((entry) =>
        entry.variantId === item.variantId
          ? { ...entry, quantity: Math.min(entry.quantity + item.quantity, Math.max(entry.stock, 1)) }
          : entry,
      )
    })
  }, [])

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((current) =>
      current.map((entry) =>
        entry.variantId === variantId
          ? { ...entry, quantity: Math.min(Math.max(quantity, 1), Math.max(entry.stock, 1)) }
          : entry,
      ),
    )
  }, [])

  const removeItem = useCallback((variantId: string) => {
    setItems((current) => current.filter((entry) => entry.variantId !== variantId))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(() => ({
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: Math.round(items.reduce((total, item) => total + item.unitPrice * item.quantity, 0) * 100) / 100,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  }), [items, addItem, updateQuantity, removeItem, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
