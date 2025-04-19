// src/modules/search/templates/index.tsx
import { SortOptions } from '@modules/store/components/refinement-list/sort-products'
import PaginatedProducts from '@modules/store/templates/paginated-products'
import { Heading } from '@medusajs/ui'

interface SearchTemplateProps {
  countryCode: string
  searchQuery: string
  page: number
  sortBy: SortOptions
}

export default function SearchTemplate({ countryCode, searchQuery, page, sortBy }: SearchTemplateProps) {
  return (
    <div className="content-container py-8">
      <Heading
        level="h1"
        className="text-3xl font-semibold mb-6"
      >
        Vyhledávání „{searchQuery}“
      </Heading>
      <PaginatedProducts
        countryCode={countryCode}
        searchQuery={searchQuery}
        page={page}
        sortBy={sortBy}
      />
    </div>
  )
}