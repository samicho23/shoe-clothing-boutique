import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Lock } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { placeOrder, type OrderInput, type PlacedOrder } from '../../features/public/publicApi'
import { useShippingRules } from '../../features/public/publicHooks'
import { formatCurrency } from '../../utils/formatCurrency'
import { Loading } from '../../components/common/Loading'

const paymentMethods: Array<{ value: OrderInput['paymentMethod']; label: string }> = [
  { value: 'CARD', label: 'Card' },
  { value: 'CASH', label: 'Cash on delivery' },
  { value: 'MOBILE_MONEY', label: 'Mobile money' },
  { value: 'BANK_TRANSFER', label: 'Bank transfer' },
]

export function CheckoutPage() {
  const { user, isLoading } = useAuth()
  const { items, subtotal, clear } = useCart()
  const { data: rules } = useShippingRules()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [form, setForm] = useState<OrderInput>({
    items: [],
    customerName: user?.name ?? '',
    phoneNumber: '',
    address: '',
    city: '',
    note: '',
    paymentMethod: 'CARD',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)

  if (isLoading) return <Loading />
  if (!user) return <Navigate to="/login?next=/checkout" replace />

  const threshold = rules?.freeShippingThreshold ?? 100
  const flatFee = rules?.flatShippingFee ?? 10
  const shippingFee = subtotal >= threshold ? 0 : flatFee
  const total = Math.round((subtotal + shippingFee) * 100) / 100

  if (placed) return <section className="store-section store-missing store-confirmation">
    <div className="store-confirm-icon"><Check size={26} /></div>
    <p className="store-kicker">Order {placed.reference}</p>
    <h1>Thank you, {placed.customerName.split(' ')[0]}.</h1>
    <p className="store-muted">We&apos;re preparing your order for delivery to {placed.address}, {placed.city}. A confirmation has been saved to your account.</p>
    <dl className="store-confirm-summary">
      {placed.items.map((item) => <div key={item.variantId}><dt>{item.quantity} × {item.productName}{item.size ? ` (${item.size})` : ''}</dt><dd>{formatCurrency(item.lineTotal)}</dd></div>)}
      <div><dt>Shipping</dt><dd>{placed.shippingFee === 0 ? 'Free' : formatCurrency(placed.shippingFee)}</dd></div>
      <div className="total"><dt>Total paid on delivery</dt><dd>{formatCurrency(placed.total)}</dd></div>
    </dl>
    <div className="store-confirm-actions">
      <Link to="/shop" className="store-button">Keep shopping</Link>
      <Link to="/dashboard" className="store-button ghost">Go to dashboard</Link>
    </div>
  </section>

  if (items.length === 0) return <section className="store-section store-missing">
    <p className="store-kicker">Checkout</p>
    <h1>Your bag is empty.</h1>
    <p className="store-muted">Add a piece to your bag before checking out.</p>
    <Link to="/shop" className="store-button">Browse the collection <ArrowRight size={16} /></Link>
  </section>

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const order = await placeOrder({
        ...form,
        items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
        note: form.note?.trim() || undefined,
      })
      setPlaced(order)
      clear()
      await queryClient.invalidateQueries({ queryKey: ['public-catalog'] })
    } catch (requestError) {
      const message = (requestError as { response?: { data?: { error?: string } } }).response?.data?.error
      setError(message ?? 'We could not place your order. Please check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return <section className="store-section store-checkout">
    <button className="store-back" onClick={() => navigate('/cart')}>← Back to bag</button>
    <div className="store-checkout-layout">
      <form className="store-checkout-form" onSubmit={submit}>
        <p className="store-kicker">Secure checkout</p>
        <h1>Delivery details</h1>
        <p className="store-muted">Signed in as {user.email ?? user.name}.</p>
        <div className="store-form-grid">
          <label>Full name<input required minLength={2} value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} /></label>
          <label>Phone number<input required type="tel" minLength={7} value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} placeholder="+1 555 010 2030" /></label>
          <label className="full">Street address<input required minLength={5} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="12 Rosewood Lane, Apt 4" /></label>
          <label>City<input required minLength={2} value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></label>
          <label>Order note (optional)<input value={form.note ?? ''} maxLength={500} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Leave with the concierge" /></label>
        </div>

        <fieldset className="store-payment">
          <legend>Payment method</legend>
          <div className="store-payment-options">
            {paymentMethods.map((method) => <label key={method.value} className={form.paymentMethod === method.value ? 'active' : ''}>
              <input type="radio" name="paymentMethod" value={method.value} checked={form.paymentMethod === method.value} onChange={() => setForm({ ...form, paymentMethod: method.value })} />
              <span>{method.label}</span>
            </label>)}
          </div>
        </fieldset>

        {error && <p className="store-error" role="alert">{error}</p>}
        <button className="store-button store-add" disabled={submitting}><Lock size={16} /> {submitting ? 'Placing order…' : `Place order · ${formatCurrency(total)}`}</button>
      </form>

      <aside className="store-cart-summary">
        <h2>Your order</h2>
        <ul className="store-checkout-items">
          {items.map((item) => <li key={item.variantId}>
            <div className="store-cart-thumb small">{item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <span aria-hidden="true">{item.name.slice(0, 1).toUpperCase()}</span>}</div>
            <div><b>{item.name}</b><small>{[item.quantity, item.size, item.color].filter(Boolean).join(' × ')}</small></div>
            <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
          </li>)}
        </ul>
        <dl>
          <div><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
          <div><dt>Shipping</dt><dd>{shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}</dd></div>
          <div className="total"><dt>Total</dt><dd>{formatCurrency(total)}</dd></div>
        </dl>
      </aside>
    </div>
  </section>
}
