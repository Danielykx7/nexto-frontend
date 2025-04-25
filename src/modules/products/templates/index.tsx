// src/modules/products/templates/index.tsx
import React, { Suspense } from "react"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import CategoriesList from "@modules/products/components/categories-list"

interface ProductTemplateProps {
  product: HttpTypes.StoreProduct & { categories?: HttpTypes.StoreProductCategory[] }
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product, region, countryCode }) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      
      {/* Main section: gallery left, info/actions right */}
      <div className="content-container py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">

          {/* Left: Image Gallery */}
          <div className="w-full lg:w-2/3">
            <ImageGallery images={product.images || []} />
          </div>

          {/* Right: Info, Actions, Promo, Stock, Tags */}
          <div className="w-full lg:w-1/3 flex flex-col gap-y-6">
            {/* Product basic info */}
            <CategoriesList categories={product.categories || []} />
            <ProductInfo product={product} countryCode={countryCode} />

            {/* Add to Cart + Variant Selection */}
            <Suspense
              fallback={
                <ProductActionsWrapper id={product.id} region={region} />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>

            {/* Promotional Banner */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex justify-between items-center">
              <span>
                <strong>DOPRAVA ZDARMA</strong> na první objednávku nad 500 Kč značky {product.collection?.title}
              </span>
              <button className="text-sm font-semibold underline">Uplatnit poukaz &rarr;</button>
            </div>

            {/* Stock & Delivery Info */}
            <div className="space-y-2 text-sm text-gray-700">
              <p> ● Skladem {product.variants?.[0]?.inventory_quantity ?? 0} a více kusů</p>
              <p>📦 Objednej nyní a doručíme <strong>do 3-5 pracovních dní</strong></p>
              <p>⏳ Minimální trvanlivost do: <strong>30. 05. 2025</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs below main section */}
      <div className="content-container mt-16">
        <ProductTabs product={product} />
      </div>

      {/* Related Products */}
      <div className="content-container my-16">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate