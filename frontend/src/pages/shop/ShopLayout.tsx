import { useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'New arrivals', to: '/shop?sort=new' },
]

export function ShopLayout() {
  const { user } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const search = (event: FormEvent) => {
    event.preventDefault()
    const term = query.trim()
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop')
    setMenuOpen(false)
  }

  const firstName = user?.name?.split(' ')[0]

  return <div className="store">
    <div className="store-announcement">Free shipping on orders over $100 · 30-day returns</div>
    <header className="store-header">
      <button className="store-menu-toggle" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
      <Link to="/" className="store-logo">boutique</Link>
      <nav className="store-nav">
        {navLinks.map((link) => link.to.includes('?')
          ? <Link key={link.label} to={link.to}>{link.label}</Link>
          : <NavLink key={link.label} to={link.to} end>{link.label}</NavLink>)}
      </nav>
      <div className="store-actions">
        <form className="store-search" onSubmit={search}>
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" />
        </form>
        {user
          ? <Link to="/dashboard" className="store-account"><User size={18} /><span>{firstName ?? 'Account'}</span></Link>
          : <Link to="/login" className="store-account"><User size={18} /><span>Sign in</span></Link>}
        <Link to="/cart" className="store-cart" aria-label={`Bag, ${count} items`}>
          <ShoppingBag size={20} />
          {count > 0 && <span className="store-cart-count">{count}</span>}
        </Link>
      </div>
    </header>

    {menuOpen && <div className="store-mobile-nav">
      <div className="store-mobile-head"><span className="store-logo">boutique</span><button aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={22} /></button></div>
      {navLinks.map((link) => <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}
      <Link to={user ? '/dashboard' : '/login'} onClick={() => setMenuOpen(false)}>{user ? 'My account' : 'Sign in'}</Link>
    </div>}

    <Outlet />

    <footer className="store-footer">
      <div className="store-footer-brand">
        <Link to="/" className="store-logo">boutique</Link>
        <p>Considered pieces for everyday wear, chosen one season at a time.</p>
      </div>
      <div className="store-footer-links">
        <b>Shop</b>
        <Link to="/shop">All products</Link>
        <Link to="/shop?sort=new">New arrivals</Link>
        <Link to="/cart">Your bag</Link>
      </div>
      <div className="store-footer-links">
        <b>Help</b>
        <Link to="/shop">Shipping & returns</Link>
        <Link to="/forgot-password">Reset password</Link>
        <Link to="/login">{user ? 'Account' : 'Sign in'}</Link>
      </div>
      <form className="store-footer-newsletter" onSubmit={(event) => event.preventDefault()}>
        <b>Stay in the loop</b>
        <p>New drops and quiet offers, once a month.</p>
        <div><input type="email" required placeholder="Email address" aria-label="Email address" /><button type="submit">Join</button></div>
      </form>
      <p className="store-footer-note">© {new Date().getFullYear()} boutique. All rights reserved.</p>
    </footer>
  </div>
}
