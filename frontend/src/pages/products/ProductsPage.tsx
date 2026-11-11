import { useState } from 'react'
import { Search } from 'lucide-react'
import { useProducts } from '../../features/products/productHooks'

export function ProductsPage() {
  const [search, setSearch] = useState('')
  const query = useProducts(search)
  const products = query.data?.data ?? []
  return <section className="page-section"><div className="page-heading"><div><p className="eyebrow">CATALOG / PRODUCTS</p><h1>Products</h1><p className="muted">Manage your product catalog and pricing.</p></div></div><section className="card module-card"><div className="module-toolbar"><div className="table-search"><Search size={16} /><input placeholder="Search products..." value={search} onChange={(event) => setSearch(event.target.value)} /></div></div>{query.isLoading ? <p className="muted">Loading products...</p> : <div className="table-wrap"><table><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td>{product.name}</td><td>{product.sku}</td><td>{product.category}</td><td>{product.price}</td><td>{product.stock}</td><td>{product.status}</td></tr>)}</tbody></table></div>}</section></section>
}
