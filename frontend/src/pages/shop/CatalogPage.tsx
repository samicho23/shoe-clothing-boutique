import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCatalog } from '../../features/public/publicHooks'
import { ProductCard } from './ProductCard'

const sortOptions = [
  { value: 'new', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name A–Z' },
]

export function CatalogPage() {
  const { data, isLoading, isError } = useCatalog()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const sort = params.get('sort') ?? 'new'

  const products = data?.products ?? []
  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products])
  const isNewArrivals = params.get('sort') === 'new' && !category && !query

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const list = products.filter((product) => {
      const matchesCategory = !category || product.category === category
      const matchesTerm = !term
        || product.name.toLowerCase().includes(term)
        || product.category.toLowerCase().includes(term)
        || (product.description ?? '').toLowerCase().includes(term)
      return matchesCategory && matchesTerm
    })
    return [...list].sort((a, b) => {
      if (sort === 'price-asc') return (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0)
      if (sort === 'price-desc') return (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0)
      if (sort === 'name') return a.name.localeCompare(b.name)
      return 0
    })
  }, [products, query, category, sort])

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  return <section className="store-section store-catalog">
    <div className="store-catalog-hero">
      <div className="store-catalog-head">
        <p className="store-kicker">{isNewArrivals ? 'Just landed' : 'Shop'}</p>
        <h1>{category || (query ? `Results for “${query}”` : isNewArrivals ? 'New arrivals' : 'All products')}</h1>
        <p className="store-muted">
          {isNewArrivals ? 'The newest pieces to reach the studio, freshest first. ' : ''}
          {isLoading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`}
        </p>
      </div>
      <div className="store-catalog-visual">
        <img src={isNewArrivals ? '/images/editorial/new-arrivals.jpg' : '/images/editorial/shop.jpg'} alt="" />
      </div>
    </div>

    <div className="store-filters">
      <div className="store-chips">
        <button className={!category ? 'active' : ''} onClick={() => update('category', '')}>All</button>
        {categories.map((name) => <button key={name} className={category === name ? 'active' : ''} onClick={() => update('category', name)}>{name}</button>)}
      </div>
      <label className="store-sort">
        <span>Sort</span>
        <select value={sort} onChange={(event) => update('sort', event.target.value)}>
          {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
    </div>

    {isError && <p className="store-muted">We could not load the collection. Please refresh and try again.</p>}
    {!isError && !isLoading && filtered.length === 0 && <p className="store-muted">No products match your filters yet.</p>}
    {filtered.length > 0 && <div className="store-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
  </section>
}
