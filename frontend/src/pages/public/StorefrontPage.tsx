import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ChevronDown, Search, ShoppingBag, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPublicCatalog, getPublicGallery, getPublicNews, type CatalogProduct, type GalleryItem, type NewsArticle } from '../../features/public/publicApi'

const fallbackCategories = ['New arrivals', 'Shoes', 'Clothing', 'Accessories', 'Sale']

export function StorefrontPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [news, setNews] = useState<NewsArticle[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  useEffect(() => {
    void Promise.allSettled([getPublicCatalog(), getPublicNews(), getPublicGallery()])
      .then(([catalog, articles, galleryItems]) => {
        if (catalog.status === 'fulfilled') setProducts(catalog.value.products)
        if (articles.status === 'fulfilled') setNews(articles.value)
        if (galleryItems.status === 'fulfilled') setGallery(galleryItems.value)
      })
  }, [])

  const categories = useMemo(() => {
    const apiCategories = [...new Set(products.map((product) => product.category).filter(Boolean))]
    return apiCategories.length ? ['New arrivals', ...apiCategories, 'Sale'] : fallbackCategories
  }, [products])
  const newArrivals = products.slice(0, 4)
  const topSelling = products.slice(4, 8).length ? products.slice(4, 8) : products.slice(0, 4)

  return <main className="shop-page">
    <div className="shop-announcement">Sign up and get 20% off your first order <ArrowRight size={14} /></div>
    <header className="shop-header">
      <Link to="/" className="shop-logo">SHOP.CO</Link>
      <nav className="shop-nav">{categories.slice(0, 5).map((category) => <a href={`#${category.toLowerCase().replace(/ /g, '-')}`} key={category}>{category}{category !== 'Sale' && category !== 'New arrivals' && <ChevronDown size={13} />}</a>)}</nav>
      <div className="shop-actions"><label className="shop-search"><Search size={17} /><input placeholder="Search for products..." aria-label="Search for products" /></label><button aria-label="Shopping bag" className="shop-icon"><ShoppingBag size={20} /></button><Link to="/login" className="shop-login">Sign in</Link></div>
    </header>

    <section className="shop-hero">
      <div className="shop-hero-copy"><p className="shop-kicker">NEW SEASON / 2026</p><h1>Find clothes<br />that match<br /><em>your style.</em></h1><p>Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p><a className="shop-primary-button" href="#new-arrivals">Shop now</a><div className="shop-stats"><span><strong>200+</strong><small>International brands</small></span><span><strong>2,000+</strong><small>High-quality products</small></span><span><strong>30,000+</strong><small>Happy customers</small></span></div></div>
      <div className="shop-hero-visual"><div className="hero-model">A</div><span className="hero-sparkle sparkle-one">✦</span><span className="hero-sparkle sparkle-two">✦</span></div>
    </section>
    <div className="shop-brand-strip"><span>VERSACE</span><span>ZARA</span><span>GUCCI</span><span>PRADA</span><span>Calvin Klein</span></div>

    <ProductSection id="new-arrivals" title="New arrivals" products={newArrivals} emptyLabel="New arrivals are coming soon." />
    <ProductSection id="top-selling" title="Top selling" products={topSelling} emptyLabel="Top selling products will appear here." />

    <section className="shop-category-section" id="categories"><h2>Browse by dress style</h2><div className="shop-category-grid">{categories.slice(1, 5).map((category, index) => <a href="#new-arrivals" className={`shop-category-card category-${index + 1}`} key={category}><span>{category}</span><ArrowRight size={17} /></a>)}</div></section>

    <section className="shop-reviews"><div className="shop-section-heading"><h2>Our happy customers</h2><div className="shop-review-controls"><button aria-label="Previous review">←</button><button aria-label="Next review">→</button></div></div><div className="shop-review-grid">{['The quality is exceptional and every piece feels thoughtfully made. I found my new favorite store.', 'The shopping experience was effortless. Everything arrived quickly and looked exactly like the photos.', 'Finally a boutique that understands modern style without sacrificing comfort. Highly recommended.'].map((review, index) => <article className="shop-review" key={review}><div className="shop-stars">{Array.from({ length: 5 }, (_, star) => <Star size={15} fill="currentColor" key={star} />)}</div><h3>Verified customer <span>✓</span></h3><p>“{review}”</p><small>Customer {index + 1}</small></article>)}</div></section>

    <section className="shop-newsletter"><div><p className="shop-kicker">STAY UP TO DATE</p><h2>Get the latest offers<br />from our boutique.</h2></div><form onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="Enter your email address" aria-label="Email address" required /><button className="shop-primary-button">Subscribe</button></form></section>
    {(news.length > 0 || gallery.length > 0) && <section className="shop-extra-content">{news.slice(0, 2).map((article) => <article key={article.id}><p className="shop-kicker">THE JOURNAL</p><h3>{article.title}</h3><p>{article.excerpt ?? article.content}</p></article>)}</section>}
    <footer className="shop-footer"><div><Link to="/" className="shop-logo">SHOP.CO</Link><p>Making everyday style feel effortless, one carefully chosen piece at a time.</p></div><div><b>Company</b><a href="#categories">About</a><a href="#new-arrivals">Features</a><a href="#categories">Works</a></div><div><b>Help</b><a href="#footer">Customer support</a><a href="#footer">Delivery details</a><a href="#footer">Terms & conditions</a></div><div><b>Resources</b><a href="#footer">Free e-books</a><a href="#footer">Blog</a><a href="#footer">FAQ</a></div></footer>
  </main>
}

function ProductSection({ id, title, products, emptyLabel }: { id: string; title: string; products: CatalogProduct[]; emptyLabel: string }) {
  return <section className="shop-product-section" id={id}><div className="shop-section-heading"><h2>{title}</h2><a href="#categories">View all <ArrowRight size={15} /></a></div>{products.length ? <div className="shop-product-grid">{products.map((product) => <article className="shop-product" key={product.id}><div className="shop-product-image">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <span>{product.name.slice(0, 1)}</span>}<button aria-label={`Add ${product.name} to bag`}><ShoppingBag size={16} /></button></div><h3>{product.name}</h3><div className="shop-product-rating"><span className="shop-stars">{Array.from({ length: 5 }, (_, index) => <Star size={12} fill="currentColor" key={index} />)}</span><small>4.{8 - (product.name.length % 3)}/5</small></div><strong>${(product.variants[0]?.price ?? 0).toFixed(2)}</strong></article>)}</div> : <p className="shop-empty">{emptyLabel}</p>}</section>
}
