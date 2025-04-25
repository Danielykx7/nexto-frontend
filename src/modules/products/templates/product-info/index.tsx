// src/modules/products/templates/product-info/index.tsx
import React from "react"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <div id="product-info" className="mb-6">
      {/* 1) Breadcrumb kategorií */}
      {product.categories?.length > 0 && (
        <nav className="text-sm text-gray-500 mb-2">
          {product.categories.map((cat, i) => (
            <span key={cat.id}>
              <LocalizedClientLink
                href={`/c/${cat.handle}`}
                className="underline hover:text-ui-fg-base"
              >
                {cat.name}
              </LocalizedClientLink>
              {i < product.categories.length - 1 && " / "}
            </span>
          ))}
        </nav>
      )}

      {/* 2) Kolekce */}
      {product.collection && (
        <div className="text-sm text-gray-600 mb-1">
          Kolekce:{" "}
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="font-semibold hover:text-ui-fg-base"
          >
            {product.collection.title}
          </LocalizedClientLink>
        </div>
      )}

      {/* 3) Název + podtitul (subtitle) */}
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
