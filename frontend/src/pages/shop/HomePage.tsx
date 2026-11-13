import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import { useCatalog } from '../../features/public/publicHooks'
import { ProductCard } from './ProductCard'

const reviews = [
  { name: 'Amina K.', quote: 'The fit is exactly as pictured and the fabric feels far more expensive than it costs.' },
  { name: 'Daniel R.', quote: 'Ordered on a Thursday, wearing it on Saturday. Packaging was beautiful too.' },
  { name: 'Nadia S.', quote: 'My third order this year. Everything washes well and still looks new.' },
]

export function HomePage() {
  const { data, isLoading, isError } = useCatalog()
  const products = data?.products ?? []
  const categories = [...new Set(products.map((product) => product.category))]
  const highlights = products.slice(0, 8)

  return <>
    <section className="store-hero">
      <div className="store-hero-copy">
        <p className="store-kicker">Autumn / Winter 2026</p>
        <h1>Style that<br />works as hard<br />as you do.</h1>
        <p className="store-hero-text">Timeless shoes and clothing, made in small batches and priced without the middleman. Free returns for 30 days.</p>
        <div className="store-hero-actions">
          <Link to="/shop" className="store-button">Shop the collection <ArrowRight size={17} /></Link>
          <Link to="/shop?sort=new" className="store-button ghost">New arrivals</Link>
        </div>
        <div className="store-hero-stats">
          <span><strong>2,000+</strong><small>Products in stock</small></span>
          <span><strong>30k</strong><small>Happy customers</small></span>
          <span><strong>4.9/5</strong><small>Average rating</small></span>
        </div>
      </div>
      <div className="store-hero-visual">
        <img src="/images/editorial/hero.jpg" alt="Two models wearing pieces from the new season" />
        <Link to="/shop" className="store-hero-tag">
          <small>Autumn edit</small>
          <b>Shop the new collection</b>
        </Link>
      </div>
    </section>

    <div className="store-marquee">
      {['New season', 'Small batch', 'Free shipping over $100', '30-day returns', 'Ethically made'].map((item) => <span key={item}>{item}</span>)}
    </div>

    <section className="store-section">
      <div className="store-section-head">
        <div><p className="store-kicker">Currently selling</p><h2>This week&apos;s highlights</h2></div>
        <Link to="/shop">View all <ArrowRight size={15} /></Link>
      </div>
      {isError
        ? <p className="store-muted">We could not load the collection. Please refresh and try again.</p>
        : isLoading
          ? <p className="store-muted">Loading products…</p>
          : highlights.length
            ? <div className="store-grid">{highlights.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            : <p className="store-muted">New pieces are being added — check back shortly.</p>}
    </section>

    {categories.length > 0 && <section className="store-section">
      <div className="store-section-head">
        <div><p className="store-kicker">Shop by style</p><h2>Find your fit</h2></div>
      </div>
      <div className="store-category-grid">
        {categories.slice(0, 4).map((category, index) => {
          const image = products.find((product) => product.category === category && product.imageUrl)?.imageUrl
          return <Link
            key={category}
            to={`/shop?category=${encodeURIComponent(category)}`}
            className={`store-category ${image ? 'has-image' : `store-category-${(index % 4) + 1}`}`}
            style={image ? { backgroundImage: `linear-gradient(180deg, rgba(17,17,17,0.04), rgba(17,17,17,0.62)), url(${image})` } : undefined}
          >
            <span>{category}</span>
            <ArrowRight size={18} />
          </Link>
        })}
      </div>
    </section>}

    <section className="store-banner has-image" style={{ backgroundImage: 'linear-gradient(90deg, rgba(17,17,17,0.94) 0%, rgba(17,17,17,0.78) 42%, rgba(17,17,17,0.15) 100%), url(/images/editorial/sale.jpg)' }}>
      <div>
        <p className="store-kicker light">End of season</p>
        <h2>Up to 40% off<br />last-chance pieces.</h2>
      </div>
      <Link to="/shop" className="store-button invert">Shop the sale</Link>
    </section>

    <section className="store-section">
      <div className="store-section-head">
        <div><p className="store-kicker">Reviews</p><h2>Loved by 30,000 customers</h2></div>
      </div>
      <div className="store-reviews">
        {reviews.map((review) => <article key={review.name}>
          <div className="store-stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill="currentColor" />)}</div>
          <p>“{review.quote}”</p>
          <small>{review.name} · Verified buyer</small>
        </article>)}
      </div>
    </section>
  </>
}
