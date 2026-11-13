import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <main className="error-panel"><h1>Page not found</h1><p>The page you requested does not exist.</p><Link className="button primary" to="/">Return to storefront</Link></main>
}
