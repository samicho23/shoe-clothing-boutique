import { useEffect, useState } from 'react'
import { getPublicCatalog, getPublicGallery, getPublicNews, type CatalogProduct, type GalleryItem, type NewsArticle } from '../../features/public/publicApi'

export function StorefrontPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [news, setNews] = useState<NewsArticle[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getPublicCatalog(), getPublicNews(), getPublicGallery()])
      .then(([catalog, articles, items]) => {
        setProducts(catalog.products)
        setNews(articles)
        setGallery(items)
      })
      .catch(() => setError('The storefront could not be loaded. Please try again later.'))
  }, [])

  if (error) return <section className="page-section"><p className="auth-error" role="alert">{error}</p></section>
  return <section className="page-section">
    <div className="page-heading"><div><p className="eyebrow">ATELIER / STOREFRONT</p><h1>Discover the collection</h1><p className="muted">Browse our latest shoes, clothing, and boutique stories.</p></div></div>
    <section className="card module-card"><h2>Featured products</h2>{products.length ? <div className="stats-grid">{products.map((product) => <article className="stat-card" key={product.id}><span>{product.category}</span><strong>{product.name}</strong><span className="stat-note">{product.variants.length} available variants</span></article>)}</div> : <p className="muted">No products are currently available.</p>}</section>
    <section className="card module-card"><h2>Latest news</h2>{news.length ? news.map((article) => <article key={article.id}><h3>{article.title}</h3><p className="muted">{article.excerpt ?? article.content}</p></article>) : <p className="muted">No news published yet.</p>}</section>
    <section className="card module-card"><h2>Gallery</h2>{gallery.length ? <div className="stats-grid">{gallery.map((item) => <article className="stat-card" key={item.id}><strong>{item.title}</strong><span className="stat-note">{item.altText ?? 'Boutique collection'}</span></article>)}</div> : <p className="muted">No gallery items are currently visible.</p>}</section>
  </section>
}
