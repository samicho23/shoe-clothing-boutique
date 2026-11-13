import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { listOrders, updateOrderStatus, type StaffOrder } from '../../features/orders/orderApi'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

const statuses: StaffOrder['status'][] = ['PENDING', 'CONFIRMED', 'FULFILLED', 'CANCELLED']

export function OrdersPage() {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ['orders', search], queryFn: () => listOrders(search) })
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: StaffOrder['status'] }) => updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })
  const orders = query.data ?? []

  return <section className="page-section">
    <div className="page-heading">
      <div>
        <p className="eyebrow">WORKSPACE / ORDERS</p>
        <h1>Online orders</h1>
        <p className="muted">Orders placed by customers from the storefront.</p>
      </div>
    </div>
    <section className="card module-card">
      <div className="module-toolbar">
        <div className="table-search"><Search size={16} /><input placeholder="Search orders..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      </div>
      {query.isError
        ? <p className="auth-error">Unable to load orders.</p>
        : query.isLoading
          ? <p className="muted">Loading...</p>
          : orders.length === 0
            ? <p className="muted">{search ? 'No orders match that search.' : 'No online orders yet.'}</p>
            : <div className="table-wrap"><table>
                <thead><tr><th>Reference</th><th>Customer</th><th>City</th><th>Items</th><th>Total</th><th>Payment</th><th>Placed</th><th>Status</th></tr></thead>
                <tbody>{orders.map((order) => <tr key={order.id}>
                  <td><b>{order.reference}</b></td>
                  <td><span className="table-product"><span><b>{order.customer}</b><small>{order.email || order.phoneNumber}</small></span></span></td>
                  <td>{order.city || '—'}</td>
                  <td>{order.items}</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>{order.paymentMethod.replace('_', ' ').toLowerCase()}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <select
                      className="catalog-select"
                      value={order.status}
                      disabled={mutation.isPending}
                      onChange={(event) => mutation.mutate({ id: order.id, status: event.target.value as StaffOrder['status'] })}
                    >
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>)}</tbody>
              </table></div>}
      {mutation.isError && <p className="auth-error">Could not update that order. Try again.</p>}
    </section>
  </section>
}
