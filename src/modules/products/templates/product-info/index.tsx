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
      {/* 1) Category Breadcrumb */}
      {product.categories && product.categories.length > 0 && (
        <div className="mb-2 flex items-center text-ui-fg-muted">
          <LocalizedClientLink href="/products">
            <Text className="text-xs hover:underline">Products</Text>
          </LocalizedClientLink>
          {product.categories.map((category, index) => (
            <React.Fragment key={category.id}>
              <Text className="text-xs mx-1">/</Text>
              <LocalizedClientLink href={`/categories/${category.handle}`}>
                <Text className="text-xs hover:underline">{category.name}</Text>
              </LocalizedClientLink>
            </React.Fragment>
          ))}
        </div>
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
