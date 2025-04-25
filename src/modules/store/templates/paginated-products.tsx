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
  // Nové props pro filtrování podle kategorií
  categoryId?: string
  categoryChildren?: { id: string }[]
}

export default async function PaginatedProducts({
  sortBy,
  page,
  countryCode,
  searchQuery,
  categoryId,
  categoryChildren,
}: PaginatedProductsProps) {
  const queryParams: Record<string, any> = { limit: PRODUCT_LIMIT }

  if (searchQuery) {
    queryParams["q"] = searchQuery
  }

  // Přidání filtrování podle kategorie a jejích podkategorií
  if (categoryId) {
    const ids = [categoryId, ...(categoryChildren?.map(c => c.id) || [])]
    queryParams["category_id[]"] = ids
  }

  const region = await getRegion(countryCode)
  if (!region) {
    return null
  }

  const { response, nextPage } = await listProductsWithSort({
    page,
    queryParams,
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
      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
    </>
  )
}