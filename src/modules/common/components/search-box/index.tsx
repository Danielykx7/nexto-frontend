// src/modules/common/components/search-box/index.tsx
"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useRef } from "react"
import Medusa from "@medusajs/js-sdk"
import { IconButton } from "@medusajs/ui"
import { Search } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// SDK instance (browser‑side)
const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
})

export default function SearchBox() {
  const router = useRouter()
  const { countryCode = "" } = useParams<{ countryCode?: string }>()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  // fetch via SDK → CORS safe
  const fetchSuggestions = async (q?: string) => {
    try {
      const { products } = await medusa.products.list({
        limit: 5,
        ...(q ? { q } : { sort: "popularity" }),
      })
      setSuggestions(products)
    } catch {
      setSuggestions([])
    }
  }

  /* ========== handlers ========== */
  const onFocus = () => {
    setOpen(true)
    fetchSuggestions()
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    setOpen(true)
    fetchSuggestions(val.trim())
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/${countryCode}/search?query=${encodeURIComponent(trimmed)}`)
      setOpen(false)
    }
  }

  const onBlur = () => setTimeout(() => setOpen(false), 120)

  /* ========== render ========== */
  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <form onSubmit={onSubmit} className="relative">
        <input
          value={query}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Hledat"
          className="w-full pl-10 pr-4 py-2 rounded-md border border-ui-border-base focus:outline-none focus:border-ui-fg-base"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <IconButton type="submit" variant="transparent" size="small">
            <Search className="w-5 h-5 text-ui-fg-subtle" />
          </IconButton>
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-ui-border-base rounded-md shadow-lg">
          {suggestions.map((p) => (
            <li key={p.id}>
              <LocalizedClientLink
                href={`/${countryCode}/products/${p.handle}`}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                {p.title}
              </LocalizedClientLink>
            </li>
          ))}
          <li>
            <LocalizedClientLink
              href={`/${countryCode}/store`}
              className="block text-center px-4 py-2 text-ui-fg-subtle hover:bg-gray-100"
            >
              Zobrazit všechny produkty
            </LocalizedClientLink>
          </li>
        </ul>
      )}
    </div>
  )
}
