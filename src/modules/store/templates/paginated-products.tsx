// src/modules/store/templates/paginated-products.tsx
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsProps = {
  sortBy: SortOptions
  page: number
  countryCode: string
  searchQuery?: string
}

export default async function PaginatedProducts({ sortBy, page, countryCode, searchQuery }: PaginatedProductsProps) {
  // Build query params for API call
  const queryParams: Record<string, any> = { limit: PRODUCT_LIMIT }
  if (searchQuery) {
    queryParams["q"] = searchQuery
  }

  const region = await getRegion(countryCode)
  if (!region) {
    return null
  }

  // Fetch sorted + paginated products
  const { response, nextPage } = await listProductsWithSort({
    page,
    queryParams: {
      ...queryParams,
    },
    sortBy,
    countryCode,
  })

  const { products, count } = response
  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductPreview key={p.id} product={p} region={region} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} />
      )}
    </>
  )
}
