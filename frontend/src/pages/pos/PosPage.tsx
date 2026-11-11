import { useState } from 'react'
import { useProducts } from '../../features/products/productHooks'

export function PosPage() {
  const products = useProducts()
  const [cart, setCart] = useState<Array<{ name: string; price: string }>>([])
  const total = cart.reduce((sum, item) => sum + Number(item.price.replace(/[$,]/g, '')), 0)
  return <section className="page-section"><div className="page-heading"><div><p className="eyebrow">OPERATIONS / POINT OF SALE</p><h1>Point of sale</h1><p className="muted">Add products to a sale and review the total.</p></div></div><div className="pos-layout"><section className="card module-card"><h2>Products</h2><div className="pos-grid">{(products.data?.data ?? []).map((product) => <button className="pos-product" key={product.id} onClick={() => setCart([...cart, product])}><strong>{product.name}</strong><small>{product.sku}</small><b>{product.price}</b></button>)}</div></section><section className="card cart-panel"><h2>Current sale</h2>{cart.map((item, index) => <div className="cart-row" key={`${item.name}-${index}`}><span>{item.name}</span><strong>{item.price}</strong></div>)}<h3>Total ${total.toFixed(2)}</h3><button className="button primary full-width" disabled={!cart.length}>Complete sale</button></section></div></section>
}
