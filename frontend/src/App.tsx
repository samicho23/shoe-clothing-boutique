import { useMemo, useState } from 'react'
import {
  ArrowUpRight, BarChart3, Bell, Boxes, ChevronDown, CircleDollarSign,
  ClipboardList, Grid2X2, LayoutDashboard, Menu,
  Package, Plus, Search, Settings, ShoppingBag, ShoppingCart, SlidersHorizontal,
  Sparkles, TrendingDown, TrendingUp, Users, X
} from 'lucide-react'

type NavItem = { label: string; icon: typeof LayoutDashboard; section?: string }
type Product = { name: string; sku: string; category: string; price: string; stock: number; status: 'In stock' | 'Low stock' | 'Out of stock'; image: string }

const navItems: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Point of sale', icon: ShoppingCart, section: 'OPERATIONS' },
  { label: 'Products', icon: Package, section: 'CATALOG' },
  { label: 'Inventory', icon: Boxes },
  { label: 'Purchases', icon: ClipboardList },
  { label: 'Customers', icon: Users, section: 'RELATIONSHIPS' },
  { label: 'Suppliers', icon: ShoppingBag },
  { label: 'Reports', icon: BarChart3, section: 'INSIGHTS' },
]

const products: Product[] = [
  { name: 'Siena leather loafer', sku: 'SH-00248', category: 'Shoes', price: '$189.00', stock: 24, status: 'In stock', image: 'loafer' },
  { name: 'Luna satin shoulder bag', sku: 'BG-00106', category: 'Accessories', price: '$129.00', stock: 8, status: 'Low stock', image: 'bag' },
  { name: 'Marais relaxed blazer', sku: 'CL-00389', category: 'Clothing', price: '$245.00', stock: 0, status: 'Out of stock', image: 'blazer' },
  { name: 'No. 08 silk scarf', sku: 'AC-00421', category: 'Accessories', price: '$68.00', stock: 42, status: 'In stock', image: 'scarf' },
]

const sales = [
  ['#AT-1048', 'Maya Thompson', '2 items', '$318.00', 'Paid'],
  ['#AT-1047', 'Oliver Chen', '1 item', '$189.00', 'Paid'],
  ['#AT-1046', 'Ava Williams', '3 items', '$512.00', 'Partial'],
  ['#AT-1045', 'Ethan Brooks', '1 item', '$68.00', 'Paid'],
]

function App() {
  const [active, setActive] = useState('Overview')
  const [query, setQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const filteredProducts = useMemo(() => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase())), [query])

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark">A</div><div><strong>atelier</strong><span>STUDIO OPERATIONS</span></div></div>
        <div className="workspace-switch"><div className="avatar">AM</div><div><b>Atelier Maison</b><span>Downtown studio</span></div><ChevronDown size={16} /></div>
        <nav>
          {navItems.map((item) => <div key={item.label}>
            {item.section && <small className="nav-section">{item.section}</small>}
            <button className={active === item.label ? 'nav-item active' : 'nav-item'} onClick={() => { setActive(item.label); setMobileNav(false) }}><item.icon size={18} /><span>{item.label}</span>{item.label === 'Inventory' && <em>3</em>}</button>
          </div>)}
        </nav>
        <div className="sidebar-bottom"><button className="nav-item"><Settings size={18} /><span>Settings</span></button><div className="profile"><div className="avatar avatar-dark">JS</div><div><b>Jordan Smith</b><span>Administrator</span></div><MoreDots /></div></div>
      </aside>
      {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
      <main className="main">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu size={21} /></button><div className="crumbs"><span>Workspace</span><b>/</b><strong>{active}</strong></div><div className="top-actions"><div className="global-search"><Search size={16} /><input placeholder="Search anything..." value={query} onChange={(e) => setQuery(e.target.value)} /><kbd>⌘ K</kbd></div><button className="icon-btn notification-btn" onClick={() => setShowNotifications(!showNotifications)}><Bell size={19} /><i /></button><div className="top-avatar">JS</div></div>{showNotifications && <div className="notifications"><b>Notifications</b><p><span className="dot orange" />3 products are low on stock</p><p><span className="dot green" />Purchase order #PO-204 received</p></div>}</header>
        <div className="content">
          {active === 'Overview' ? <Dashboard onAdd={() => setShowAdd(true)} products={filteredProducts} /> : <ModulePage title={active} onAdd={() => setShowAdd(true)} products={filteredProducts} />}
        </div>
      </main>
      {showAdd && <AddProduct onClose={() => setShowAdd(false)} />}
    </div>
  )
}

function Dashboard({ onAdd, products }: { onAdd: () => void; products: Product[] }) {
  return <><div className="page-heading"><div><p className="eyebrow">THURSDAY, NOVEMBER 5, 2026</p><h1>Good morning, Jordan <span>✦</span></h1><p className="muted">Here’s what’s happening across your studio today.</p></div><div className="heading-actions"><button className="button secondary"><ArrowUpRight size={16} /> Export report</button><button className="button primary" onClick={onAdd}><Plus size={17} /> Add product</button></div></div>
    <div className="stats-grid"><Stat title="Total revenue" value="$24,680" change="+12.8%" note="vs. last month" icon={CircleDollarSign} positive /><Stat title="Sales this month" value="184" change="+8.2%" note="vs. last month" icon={ShoppingBag} positive /><Stat title="Total products" value="248" change="+4 new" note="this month" icon={Package} positive /><Stat title="Low stock items" value="12" change="3 critical" note="needs attention" icon={TrendingDown} /></div>
    <div className="dashboard-grid"><section className="card revenue-card"><div className="card-heading"><div><h2>Revenue overview</h2><p className="muted">Monthly revenue performance</p></div><button className="select-button">Last 6 months <ChevronDown size={14} /></button></div><div className="chart-legend"><span><i className="legend-dot dark" />Revenue</span><span><i className="legend-dot light" />Previous period</span></div><RevenueChart /></section><section className="card quick-card"><div className="card-heading"><div><h2>Quick actions</h2><p className="muted">Common tasks</p></div><Sparkles size={18} className="sparkle" /></div><div className="quick-actions"><button onClick={onAdd}><span className="quick-icon purple"><Plus size={18} /></span><span><b>Add a product</b><small>Create a new catalog item</small></span><ArrowUpRight size={16} /></button><button><span className="quick-icon peach"><ShoppingCart size={18} /></span><span><b>New sale</b><small>Open point of sale</small></span><ArrowUpRight size={16} /></button><button><span className="quick-icon blue"><ClipboardList size={18} /></span><span><b>Receive stock</b><small>Update inventory levels</small></span><ArrowUpRight size={16} /></button></div></section></div>
    <div className="lower-grid"><section className="card"><div className="card-heading"><div><h2>Recent sales</h2><p className="muted">Your latest transactions</p></div><button className="text-button">View all <ArrowUpRight size={14} /></button></div><div className="table-wrap"><table><thead><tr><th>Sale ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th></tr></thead><tbody>{sales.map((sale) => <tr key={sale[0]}><td className="mono">{sale[0]}</td><td><b>{sale[1]}</b></td><td>{sale[2]}</td><td><b>{sale[3]}</b></td><td><span className={`status ${sale[4].toLowerCase()}`}>{sale[4]}</span></td></tr>)}</tbody></table></div></section><section className="card products-card"><div className="card-heading"><div><h2>Inventory watch</h2><p className="muted">Items needing attention</p></div><button className="text-button">View inventory <ArrowUpRight size={14} /></button></div>{products.slice(0, 3).map((product) => <ProductRow key={product.sku} product={product} />)}</section></div>
  </>
}

function Stat({ title, value, change, note, icon: Icon, positive }: { title: string; value: string; change: string; note: string; icon: typeof Package; positive?: boolean }) {
  return <div className="stat-card"><div className="stat-top"><span>{title}</span><Icon size={18} /></div><strong>{value}</strong><div><span className={positive ? 'change positive' : 'change warning'}>{positive && <TrendingUp size={13} />}{change}</span><span className="stat-note">{note}</span></div></div>
}

function ProductRow({ product }: { product: Product }) {
  return <div className="product-row"><div className={`product-image ${product.image}`}><span>{product.image === 'loafer' ? 'S' : product.image === 'bag' ? 'L' : 'M'}</span></div><div className="product-info"><b>{product.name}</b><small>{product.sku} · {product.category}</small></div><div className="stock"><span className={`stock-dot ${product.status.replace(' ', '-').toLowerCase()}`} /><span>{product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}</span></div></div>
}

function RevenueChart() {
  const points = '0,145 62,127 124,135 186,91 248,104 310,72 372,84 434,50 496,62 558,30 620,45 682,17'
  return <div className="chart"><svg viewBox="0 0 700 180" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6552d6" stopOpacity=".18" /><stop offset="100%" stopColor="#6552d6" stopOpacity="0" /></linearGradient></defs><path d={`M ${points} L 682,180 L 0,180 Z`} fill="url(#area)" /><polyline points={points} fill="none" stroke="#6552d6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{points.split(' ').map((point) => { const [x, y] = point.split(','); return <circle key={point} cx={x} cy={y} r="4" fill="white" stroke="#6552d6" strokeWidth="2" /> })}</svg><div className="chart-labels"><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span></div></div>
}

function ModulePage({ title, onAdd, products }: { title: string; onAdd: () => void; products: Product[] }) {
  const isProducts = title === 'Products'
  return <><div className="page-heading"><div><p className="eyebrow">WORKSPACE / {title.toUpperCase()}</p><h1>{title}</h1><p className="muted">{isProducts ? 'Manage your catalog, pricing, and product variants.' : `Review and manage your ${title.toLowerCase()} in one place.`}</p></div><button className="button primary" onClick={onAdd}><Plus size={17} /> {isProducts ? 'Add product' : `New ${title.toLowerCase().replace(/s$/, '')}`}</button></div><section className="card module-card"><div className="module-toolbar"><div className="table-search"><Search size={16} /><input placeholder={`Search ${title.toLowerCase()}...`} /></div><button className="button secondary"><SlidersHorizontal size={16} /> Filters</button></div>{isProducts ? <div className="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr></thead><tbody>{products.map((p) => <tr key={p.sku}><td><div className="table-product"><div className={`mini-image ${p.image}`} /> <span><b>{p.name}</b><small>{p.sku}</small></span></div></td><td>{p.category}</td><td><b>{p.price}</b></td><td>{p.stock}</td><td><span className={`status ${p.status.toLowerCase().replace(' ', '-')}`}>{p.status}</span></td><td><button className="more-button">•••</button></td></tr>)}</tbody></table></div> : <div className="empty-state"><div><Grid2X2 size={26} /></div><h3>Your {title.toLowerCase()} will appear here</h3><p>Connect your backend to start managing this workspace.</p></div>}</section></>
}

function AddProduct({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="modal"><div className="modal-header"><div><p className="eyebrow">CATALOG / NEW</p><h2>Add product</h2></div><button className="icon-btn" onClick={onClose}><X size={19} /></button></div><div className="form-grid"><label>Product name<input placeholder="e.g. Siena leather loafer" /></label><label>Category<select><option>Select category</option><option>Shoes</option><option>Clothing</option><option>Accessories</option></select></label><label>SKU<input placeholder="SH-00000" /></label><label>Selling price<input placeholder="$ 0.00" /></label><label className="full">Description<textarea placeholder="Add a short product description..." rows={3} /></label></div><div className="modal-footer"><button className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" onClick={onClose}>Save product</button></div></div></div>
}

function MoreDots() { return <span className="more-dots">•••</span> }

export default App
