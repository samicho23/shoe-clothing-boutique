import { useState, type ReactNode } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3, Bell, Boxes, ChevronDown, ClipboardList, CreditCard,
  FileBarChart, LayoutDashboard, Menu, Package, Search, Settings,
  ShoppingBag, ShoppingCart, ShieldCheck, Users, type LucideIcon,
} from 'lucide-react'
import { useAuth } from './contexts/AuthContext'

type NavItem = { label: string; path: string; icon: LucideIcon; section?: string }

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Point of sale', path: '/pos', icon: ShoppingCart, section: 'OPERATIONS' },
  { label: 'Online orders', path: '/orders', icon: ClipboardList },
  { label: 'Sales', path: '/sales', icon: FileBarChart },
  { label: 'Payments', path: '/payments', icon: CreditCard },
  { label: 'Products', path: '/products', icon: Package, section: 'CATALOG' },
  { label: 'Categories', path: '/categories', icon: Boxes },
  { label: 'Inventory', path: '/inventory', icon: Boxes },
  { label: 'Purchases', path: '/purchases', icon: ClipboardList },
  { label: 'Customers', path: '/customers', icon: Users, section: 'RELATIONSHIPS' },
  { label: 'Suppliers', path: '/suppliers', icon: ShoppingBag },
  { label: 'Users', path: '/users', icon: Users },
  { label: 'Reports', path: '/reports', icon: BarChart3, section: 'INSIGHTS' },
]

export default function App({ children }: { children?: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const visibleNavItems = user?.role === 'ADMIN' ? [...navItems, { label: 'Admin centre', path: '/admin', icon: ShieldCheck, section: 'ADMIN' }] : navItems
  const [query, setQuery] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const active = visibleNavItems.find((item) => item.path === location.pathname) ?? {
    label: location.pathname === '/settings' ? 'Settings' : location.pathname === '/profile' ? 'Profile' : 'Workspace',
    path: location.pathname,
    icon: Settings,
  }
  const initials = (user?.name ?? 'boutique').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  const go = (path: string) => {
    navigate(path)
    setMobileNav(false)
  }

  return <div className="app-shell retail-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark">A</div><div><strong>boutique</strong><span>RETAIL OPERATIONS</span></div></div>
      <div className="workspace-switch"><div className="avatar">{initials}</div><div><b>boutique Maison</b><span>Downtown boutique</span></div><ChevronDown size={16} /></div>
      <nav>{visibleNavItems.map((item) => <div key={item.path}>{item.section && <small className="nav-section">{item.section}</small>}<button className={active.path === item.path ? 'nav-item active' : 'nav-item'} onClick={() => go(item.path)}><item.icon size={17} /><span>{item.label}</span></button></div>)}</nav>
      <div className="sidebar-bottom"><button className={`nav-item ${active.label === 'Settings' ? 'active' : ''}`} onClick={() => go('/settings')}><Settings size={17} /><span>Settings</span></button><button className="profile" onClick={logout}><div className="avatar avatar-dark">{initials}</div><div><b>{user?.name ?? 'boutique user'}</b><span>{user?.role ?? 'User'} · Sign out</span></div></button></div>
    </aside>
    {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
    <main className="main">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu size={21} /></button><div className="crumbs"><span>boutique Maison</span><b>/</b><strong>{active.label}</strong></div><div className="top-actions"><div className="global-search"><Search size={16} /><input placeholder="Search workspace..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></div><button className="icon-btn notification-btn" onClick={() => setNotificationOpen(!notificationOpen)} aria-label="Notifications"><Bell size={19} /><i /></button><button className="top-avatar" onClick={() => go('/profile')}>{initials}</button></div>{notificationOpen && <div className="notifications"><b>Notifications</b><p>Your workspace is connected.</p><p>Use the sidebar to manage operations.</p></div>}</header>
      <div className="content">{children ?? <Outlet />}</div>
    </main>
  </div>
}
