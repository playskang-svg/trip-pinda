import { AffiliateAnchor } from '@/components/AffiliateAnchor'
import { retina } from '@/lib/images'
import type { Product } from '@/payload-types'

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="products">
      {products.map((product) => (
        <li key={product.id}>
          <AffiliateAnchor link={product.link}>
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={product.name} height={300} loading="lazy" src={product.image} srcSet={retina(product.image)} width={400} />
            ) : (
              <span className="products__blank" />
            )}
            <small>{product.partner}</small>
            <strong>{product.name}</strong>
          </AffiliateAnchor>
        </li>
      ))}
    </ul>
  )
}
