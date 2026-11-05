export type CartItem = { variantId: string; quantity: number }
export const posStore = {
  items: [] as CartItem[],
  add(variantId: string) { this.items.push({ variantId, quantity: 1 }) },
  clear() { this.items = [] },
}
