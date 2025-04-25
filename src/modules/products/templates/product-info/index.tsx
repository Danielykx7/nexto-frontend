// src/modules/products/templates/product-info/index.tsx
import React from "react"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Helper: build breadcrumb chain
const buildCrumbs = (
  categories: HttpTypes.StoreProductCategory[]
): HttpTypes.StoreProductCategory[] => {
  if (categories.length === 0) return []
  let current: HttpTypes.StoreProductCategory | null = categories[0]
  const chain: HttpTypes.StoreProductCategory[] = []
  while (current) {
    chain.unshift(current)
    current = (current.parent_category as HttpTypes.StoreProductCategory) || null
  }
  return chain
}

type ProductInfoProps = {
  product: HttpTypes.StoreProduct & {
    categories?: HttpTypes.StoreProductCategory[]
  }
  countryCode: string
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, countryCode }) => {
  const categories = product.categories || []
  const crumbs = buildCrumbs(categories)

  return (
    <div id="product-info" className="mb-6">
      {/* Collection */}
      {product.collection && (
        <div className="text-sm text-gray-600 mb-1">
          <LocalizedClientLink
            href={`/${countryCode}/collections/${product.collection.handle}`}
            className="font-semibold hover:text-ui-fg-base"
          >
            {product.collection.title}
          </LocalizedClientLink>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 mb-1">
          {product.tags.map((tag) => (
            <span
              key={tag.id}
              className="border rounded-full px-2 py-1 text-xs bg-gray-100"
            >
              {tag.value}
            </span>
          ))}
        </div>
      )}

      {/* Title & Subtitle */}
      <Heading
        level="h2"
        className="text-3xl leading-10 text-ui-fg-base mb-1"
        data-testid="product-title"
      >
        {product.title}
      </Heading>
      {product.subtitle && (
        <Text
          className="text-medium text-ui-fg-subtle mb-4"
          data-testid="product-subtitle"
        >
          {product.subtitle}
        </Text>
      )}
    </div>
  )
}

export default ProductInfo
