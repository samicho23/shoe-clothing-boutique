import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Star, Truck } from 'lucide-react'
import { useCatalog } from '../../features/public/publicHooks'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { formatCurrency } from '../../utils/formatCurrency'

export function ProductPage() {
  const { productId } = useParams()
  const { data, isLoading, isError } = useCatalog()
  const { addItem } = useCart()
  const { user } = useAuth()
  const [variantId, setVariantId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = data?.products.find((entry) => entry.id === productId)
  const inStock = useMemo(() => product?.variants.filter((variant) => variant.quantity > 0) ?? [], [product])

  useEffect(() => {
    setVariantId(inStock[0]?.id ?? '')
    setQuantity(1)
    setAdded(false)
  }, [productId, inStock])

  if (isLoading) return <section className="store-section"><p className="store-muted">Loading product…</p></section>
  if (isError || !product) return <section className="store-section store-missing">
    <p className="store-kicker">Not found</p>
    <h1>We couldn&apos;t find that piece.</h1>
    <p className="store-muted">It may have sold out or been removed from the collection.</p>
    <Link to="/shop" className="store-button">Back to shop <ArrowLeft size={16} /></Link>
  </section>

  const variant = product.variants.find((entry) => entry.id === variantId) ?? inStock[0]
  const price = variant?.price ?? product.variants[0]?.price ?? 0
  const maxQuantity = Math.max(variant?.quantity ?? 1, 1)

  const add = () => {
    if (!variant) return
    addItem({
      variantId: variant.id,
      productId: product.id,
      name: product.name,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      unitPrice: variant.price,
      imageUrl: product.imageUrl,
      quantity: Math.min(quantity, maxQuantity),
      stock: variant.quantity,
    })
    setAdded(true)
  }

  return <section className="store-section store-product">
    <Link to="/shop" className="store-back"><ArrowLeft size={15} /> Back to shop</Link>
    <div className="store-product-layout">
      <div className="store-product-media">
        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <span aria-hidden="true">{product.name.slice(0, 1).toUpperCase()}</span>}
      </div>
      <div className="store-product-info">
        <p className="store-kicker">{product.category}</p>
        <h1>{product.name}</h1>
        <div className="store-product-rating"><span className="store-stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill="currentColor" />)}</span><small>4.9 · 128 reviews</small></div>
        <p className="store-product-price">{formatCurrency(price)}</p>
        <p className="store-product-description">{product.description ?? 'A considered everyday piece, cut for comfort and made to last season after season.'}</p>

        {inStock.length > 0 ? <>
          <div className="store-option-group">
            <p>Size / variant</p>
            <div className="store-options">
              {inStock.map((option) => <button key={option.id} className={option.id === variant?.id ? 'active' : ''} onClick={() => { setVariantId(option.id); setAdded(false) }}>
                {option.size ?? option.color ?? option.sku}
              </button>)}
            </div>
          </div>
          <div className="store-option-group">
            <p>Quantity</p>
            <div className="store-stepper">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={15} /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))} aria-label="Increase quantity"><Plus size={15} /></button>
            </div>
            <small className="store-muted">{variant ? `${variant.quantity} in stock · SKU ${variant.sku}` : ''}</small>
          </div>
          <button className="store-button store-add" onClick={add}><ShoppingBag size={17} /> Add to bag</button>
          {added && <p className="store-added" role="status"><Check size={15} /> Added to your bag. <Link to="/cart">View bag</Link>{!user && <span>You&apos;ll sign in at checkout.</span>}</p>}
        </> : <p className="store-sold-out">This piece is currently sold out.</p>}

        <ul className="store-perks">
          <li><Truck size={16} /> Free shipping on orders over $100</li>
          <li><Check size={16} /> 30-day free returns</li>
        </ul>
      </div>
    </div>
  </section>
}
