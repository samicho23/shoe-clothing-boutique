import { useEffect, useState } from 'react'
import { getAdminAuditLogs, getAdminOverview, type AdminOverview, type AuditLog } from '../../features/admin/adminApi'

export function AdminPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getAdminOverview(), getAdminAuditLogs()])
      .then(([metrics, auditLogs]) => {
        setOverview(metrics)
        setLogs(auditLogs)
      })
      .catch(() => setError('Administrator data could not be loaded. Check your permissions.'))
  }, [])

  return <section className="page-section">
    <div className="page-heading"><div><p className="eyebrow">ATELIER / ADMINISTRATION</p><h1>Admin centre</h1><p className="muted">Manage access, content, and activity across the boutique.</p></div></div>
    {error && <p className="auth-error" role="alert">{error}</p>}
    <div className="stats-grid">
      <Stat label="Users" value={overview?.users} />
      <Stat label="Roles" value={overview?.roles} />
      <Stat label="Open contacts" value={overview?.openContacts} />
      <Stat label="Audit events" value={overview?.auditLogs} />
    </div>
    <section className="card module-card"><h2>Recent audit activity</h2>{logs.length ? <div className="table-wrap"><table><thead><tr><th>Action</th><th>Resource</th><th>Administrator</th><th>Date</th></tr></thead><tbody>{logs.map((log) => <tr key={log.id}><td>{log.action}</td><td>{log.resource}</td><td>{log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}</td><td>{new Date(log.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div> : <p className="muted">No audit activity recorded yet.</p>}</section>
  </section>
}

function Stat({ label, value }: { label: string; value?: number }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span></div><strong>{value ?? '—'}</strong><span className="stat-note">Admin API</span></div>
}
