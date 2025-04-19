// src/app/[countryCode]/(main)/search/page.tsx
import { Metadata } from 'next'
import SearchTemplate from '@modules/search/templates'
import { SortOptions } from '@modules/store/components/refinement-list/sort-products'

export const dynamic = 'force-dynamic'

interface SearchPageProps {
  params: { countryCode: string }
  searchParams: {
    query?: string
    page?: string
    sortBy?: SortOptions
  }
}

// Generates the page metadata (title)
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const q = searchParams.query || ''
  return {
    title: `Vyhledávání "${q}"`,
    description: `Výsledky vyhledávání pro "${q}"`,
  }
}

export default function SearchPage({ params, searchParams }: SearchPageProps) {
  const { countryCode } = params
  const query = searchParams.query || ''
  const pageNum = searchParams.page ? parseInt(searchParams.page, 10) : 1
  const sortBy = searchParams.sortBy || 'created_at'

  return (
    <SearchTemplate
      countryCode={countryCode}
      searchQuery={query}
      page={pageNum}
      sortBy={sortBy}
    />
  )
}
