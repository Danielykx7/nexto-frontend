// src/modules/search/templates/index.tsx
import { Suspense } from "react"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import RefinementList from "@modules/store/components/refinement-list"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { Heading } from "@medusajs/ui"

interface SearchTemplateProps {
  countryCode: string
  searchQuery: string
  page: number
  sortBy: SortOptions
}

export default function SearchTemplate({ countryCode, searchQuery, page, sortBy }: SearchTemplateProps) {
  return (
    <div className="content-container py-8 flex flex-col md:flex-row gap-4">
      {/* Filtry */}
      <div className="w-full md:w-1/4">
        <RefinementList sortBy={"price_asc"} />
      </div>

      {/* Výsledky vyhledávání */}
      <div className="flex-1">
        <Heading level="h1" className="text-3xl font-semibold mb-6">
          Vyhledávání „{searchQuery}“
        </Heading>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            countryCode={countryCode}
            searchQuery={searchQuery}
            page={page}
            sortBy={sortBy}
          />
        </Suspense>
      </div>
    </div>
  )
}
