import { AlertTriangle, Package, TrendingUp, Users } from 'lucide-react'
import { useDashboardSummary } from '../../features/dashboard/dashboardHooks'
import { useProducts } from '../../features/products/productHooks'

export function DashboardPage() {
  const summary = useDashboardSummary()
  const products = useProducts()
  const data = summary.data
  return <section className="page-section"><div className="page-heading"><div><p className="eyebrow">ATELIER / OVERVIEW</p><h1>Dashboard</h1><p className="muted">A live view of your boutique operations.</p></div></div><div className="stats-grid"><Stat title="Sales" value={`$${(data?.salesTotal ?? 0).toFixed(2)}`} icon={TrendingUp} /><Stat title="Products" value={String(data?.productCount ?? products.data?.total ?? 0)} icon={Package} /><Stat title="Low stock" value={String(data?.lowStockCount ?? 0)} icon={AlertTriangle} /><Stat title="Recent orders" value={String(data?.recentSales.length ?? 0)} icon={Users} /></div><section className="card module-card"><h2>Recent sales</h2>{data?.recentSales.length ? <div className="table-wrap"><table><thead><tr><th>Reference</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>{data.recentSales.map((sale) => <tr key={String(sale.id)}><td>{String(sale.reference)}</td><td>{String(sale.customer)}</td><td>${Number(sale.total).toFixed(2)}</td><td>{String(sale.status)}</td></tr>)}</tbody></table></div> : <p className="muted">No sales recorded yet.</p>}</section></section>
}

function Stat({ title, value, icon: Icon }: { title: string; value: string; icon: typeof Package }) {
  return <div className="stat-card"><div className="stat-top"><span>{title}</span><Icon size={18} /></div><strong>{value}</strong><span className="stat-note">Live backend data</span></div>
}
