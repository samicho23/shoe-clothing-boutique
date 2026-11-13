import { Link } from 'react-router-dom'
import type { CatalogProduct } from '../../features/public/publicApi'
import { formatCurrency } from '../../utils/formatCurrency'

export function ProductCard({ product }: { product: CatalogProduct }) {
  const priced = product.variants.filter((variant) => variant.quantity > 0)
  const price = priced[0]?.price ?? product.variants[0]?.price ?? 0
  const soldOut = priced.length === 0

  return <Link to={`/shop/${product.id}`} className="store-card">
    <div className={`store-card-image ${soldOut ? 'is-sold-out' : ''}`}>
      {product.imageUrl ? <img src={product.imageUrl} alt={product.name} loading="lazy" /> : <span aria-hidden="true">{product.name.slice(0, 1).toUpperCase()}</span>}
      {soldOut && <em className="store-card-badge">Sold out</em>}
    </div>
    <div className="store-card-body">
      <p className="store-card-category">{product.category}</p>
      <h3>{product.name}</h3>
      <strong>{formatCurrency(price)}</strong>
    </div>
  </Link>
}
