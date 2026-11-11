import { useQuery } from '@tanstack/react-query'
import { getSalesReport } from '../../features/reports/reportsApi'

export function ReportsPage() {
  const report = useQuery({ queryKey: ['sales-report'], queryFn: () => getSalesReport() })
  const data = report.data?.data
  return <section className="page-section"><div className="page-heading"><div><p className="eyebrow">INSIGHTS / REPORTS</p><h1>Reports</h1><p className="muted">Sales performance from the backend.</p></div></div><div className="stats-grid"><div className="stat-card"><span>Total sales</span><strong>${Number(data?.total ?? 0).toFixed(2)}</strong></div><div className="stat-card"><span>Transactions</span><strong>{data?.count ?? 0}</strong></div></div><section className="card module-card"><h2>Sales report</h2>{report.isLoading ? <p className="muted">Loading report...</p> : <p className="muted">The report includes {data?.count ?? 0} recorded sales.</p>}</section></section>
}
