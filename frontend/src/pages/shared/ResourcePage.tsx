import { useState } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { createWorkspaceRecord, type WorkspaceRecord, type WorkspaceResource } from '../../features/workspace/workspaceApi'
import { useDeleteWorkspaceRecord, useWorkspaceResource } from '../../features/workspace/workspaceHooks'

const labels: Record<WorkspaceResource, { title: string; description: string; columns: Array<[string, string]> }> = {
  categories: { title: 'Categories', description: 'Organize products into clear, manageable groups.', columns: [['name', 'Category'], ['productCount', 'Products'], ['status', 'Status']] },
  customers: { title: 'Customers', description: 'Manage customer records and purchase history.', columns: [['name', 'Customer'], ['phone', 'Phone'], ['email', 'Email'], ['totalPurchases', 'Purchases'], ['status', 'Status']] },
  inventory: { title: 'Inventory', description: 'Track stock levels and reorder priorities.', columns: [['product', 'Product'], ['sku', 'SKU'], ['available', 'Available'], ['minimum', 'Minimum'], ['status', 'Status']] },
  payments: { title: 'Payments', description: 'Review payment activity and collection status.', columns: [['reference', 'Reference'], ['saleReference', 'Sale'], ['method', 'Method'], ['amount', 'Amount'], ['status', 'Status']] },
  purchases: { title: 'Purchases', description: 'Manage supplier orders and receiving.', columns: [['reference', 'Reference'], ['supplier', 'Supplier'], ['items', 'Items'], ['total', 'Total'], ['status', 'Status']] },
  sales: { title: 'Sales', description: 'Review completed sales and customer orders.', columns: [['reference', 'Reference'], ['customer', 'Customer'], ['cashier', 'Cashier'], ['total', 'Total'], ['status', 'Status']] },
  suppliers: { title: 'Suppliers', description: 'Keep supplier contacts and product counts current.', columns: [['name', 'Supplier'], ['phone', 'Phone'], ['email', 'Email'], ['products', 'Products'], ['status', 'Status']] },
  users: { title: 'Users & roles', description: 'Manage team members and access roles.', columns: [['name', 'Employee'], ['email', 'Email'], ['role', 'Role'], ['status', 'Status']] },
}

export function ResourcePage({ resource }: { resource: WorkspaceResource }) {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const config = labels[resource]
  const query = useWorkspaceResource(resource, search)
  const deleteMutation = useDeleteWorkspaceRecord(resource)
  const records = query.data?.data ?? []

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    await createWorkspaceRecord(resource, { name: name.trim(), status: 'Active' })
    setName('')
    setFormOpen(false)
    await query.refetch()
  }

  return <section className="page-section">
    <div className="page-heading"><div><p className="eyebrow">WORKSPACE / {config.title.toUpperCase()}</p><h1>{config.title}</h1><p className="muted">{config.description}</p></div><button className="button primary" onClick={() => setFormOpen(true)}><Plus size={17} />Add {resource.slice(0, -1)}</button></div>
    {formOpen && <form className="card inline-form" onSubmit={submit}><label>Name<input value={name} onChange={(event) => setName(event.target.value)} required autoFocus /></label><button className="button primary" type="submit">Save</button><button className="button secondary" type="button" onClick={() => setFormOpen(false)}>Cancel</button></form>}
    <section className="card module-card"><div className="module-toolbar"><div className="table-search"><Search size={16} /><input placeholder={`Search ${config.title.toLowerCase()}...`} value={search} onChange={(event) => setSearch(event.target.value)} /></div></div>{query.isError ? <p className="auth-error">Unable to load {config.title.toLowerCase()}.</p> : query.isLoading ? <p className="muted">Loading...</p> : records.length === 0 ? <p className="muted">No records found.</p> : <div className="table-wrap"><table><thead><tr>{config.columns.map(([, label]) => <th key={label}>{label}</th>)}<th /></tr></thead><tbody>{records.map((record) => <tr key={record.id}>{config.columns.map(([key]) => <td key={key}>{formatValue(record, key)}</td>)}<td><button className="icon-btn" title="Delete" onClick={() => deleteMutation.mutate(record.id)} disabled={deleteMutation.isPending}><Trash2 size={15} /></button></td></tr>)}</tbody></table></div>}</section>
  </section>
}

function formatValue(record: WorkspaceRecord, key: string) {
  const value = record[key]
  if (typeof value === 'number' && ['amount', 'total', 'totalPurchases'].includes(key)) return `$${value.toFixed(2)}`
  return String(value ?? '—')
}
