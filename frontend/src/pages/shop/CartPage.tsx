import { Link } from 'react-router-dom'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useShippingRules } from '../../features/public/publicHooks'
import { formatCurrency } from '../../utils/formatCurrency'

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart()
  const { user } = useAuth()
  const { data: rules } = useShippingRules()
  const threshold = rules?.freeShippingThreshold ?? 100
  const flatFee = rules?.flatShippingFee ?? 10
  const shippingFee = subtotal === 0 || subtotal >= threshold ? 0 : flatFee
  const total = Math.round((subtotal + shippingFee) * 100) / 100
  const remaining = Math.max(threshold - subtotal, 0)

  if (items.length === 0) return <section className="store-section store-missing">
    <p className="store-kicker">Your bag</p>
    <h1>Your bag is empty.</h1>
    <p className="store-muted">Browse the collection and add the pieces you love — no account needed.</p>
    <Link to="/shop" className="store-button">Start shopping <ArrowRight size={16} /></Link>
  </section>

  return <section className="store-section store-cart-page">
    <div className="store-cart-head">
      <div><p className="store-kicker">Your bag</p><h1>{items.length} {items.length === 1 ? 'item' : 'items'}</h1></div>
      <button className="store-text-button" onClick={clear}>Clear bag</button>
    </div>

    <div className="store-cart-layout">
      <div className="store-cart-items">
        {items.map((item) => <article key={item.variantId} className="store-cart-item">
          <div className="store-cart-thumb">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <span aria-hidden="true">{item.name.slice(0, 1).toUpperCase()}</span>}
          </div>
          <div className="store-cart-detail">
            <div>
              <h3>{item.name}</h3>
              <p className="store-muted">{[item.size, item.color].filter(Boolean).join(' · ') || item.sku}</p>
            </div>
            <div className="store-cart-row">
              <div className="store-stepper small">
                <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} aria-label={`Decrease ${item.name}`}><Minus size={13} /></button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} aria-label={`Increase ${item.name}`} disabled={item.quantity >= item.stock}><Plus size={13} /></button>
              </div>
              <button className="store-text-button" onClick={() => removeItem(item.variantId)}><Trash2 size={14} /> Remove</button>
            </div>
          </div>
          <strong className="store-cart-price">{formatCurrency(item.unitPrice * item.quantity)}</strong>
        </article>)}
      </div>

      <aside className="store-cart-summary">
        <h2>Order summary</h2>
        <dl>
          <div><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
          <div><dt>Shipping</dt><dd>{shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}</dd></div>
          <div className="total"><dt>Total</dt><dd>{formatCurrency(total)}</dd></div>
        </dl>
        {remaining > 0 && <p className="store-shipping-note">Add {formatCurrency(remaining)} more for free shipping.</p>}
        {user
          ? <Link to="/checkout" className="store-button">Checkout <ArrowRight size={16} /></Link>
          : <>
              <Link to="/login?next=/checkout" className="store-button">Sign in to check out <ArrowRight size={16} /></Link>
              <p className="store-muted">Browsing and building a bag is open to everyone. You only need an account to place the order.</p>
            </>}
        <Link to="/shop" className="store-text-button">Continue shopping</Link>
      </aside>
    </div>
    <p className="store-cart-footnote"><ShoppingBag size={15} /> Free returns within 30 days on every order.</p>
  </section>
}
