import { Link } from 'react-router-dom'

export function UnauthorizedPage() {
  return <main className="error-panel"><h1>Access denied</h1><p>You do not have permission to view this page.</p><Link className="button primary" to="/">Return to storefront</Link></main>
}
