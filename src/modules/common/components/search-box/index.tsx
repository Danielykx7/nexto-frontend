// src/modules/common/components/search-box/index.tsx
"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useRef } from "react"
import { IconButton, Button } from "@medusajs/ui"
import { Search } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { convertToLocale } from "@lib/util/money"
import { addToCart } from "@lib/data/cart"

export default function SearchBox() {
  const router = useRouter()
  const params = useParams() as { countryCode?: string }
  const countryCode = params.countryCode || ""

  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchSuggestions = async (q: string) => {
    const base = `/api/suggestions`
    const url = q.trim()
      ? `${base}?limit=5&q=${encodeURIComponent(q)}`
      : `${base}?limit=5`
    try {
      const res = await fetch(url, { cache: "no-store" })
      if (!res.ok) throw new Error("Fetch failed")
      const json = await res.json()
      setSuggestions(json.products || [])
    } catch {
      setSuggestions([])
    }
  }

  const handleFocus = () => {
    setShowDropdown(true)
    fetchSuggestions("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    setShowDropdown(true)
    fetchSuggestions(q)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/${countryCode}/search?query=${encodeURIComponent(trimmed)}`)
      setShowDropdown(false)
    }
  }

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 100)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* input */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Hledat"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-ui-border-base focus:outline-none focus:border-ui-fg-base"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <IconButton
            type="submit"
            variant="transparent"
            size="small"
            aria-label="Hledat"
          >
            <Search className="w-5 h-5 text-ui-fg-subtle" />
          </IconButton>
        </div>
      </form>

      {/* dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-ui-border-base rounded-md shadow-lg">
          {suggestions.map((p) => {
            const variant = p.variants?.[0]
            const price = variant?.prices?.[0]?.amount ?? 0
            const currency =
              variant?.prices?.[0]?.currency_code ?? p.region_currency_code

            return (
              <li
                key={p.id}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100"
              >
                <LocalizedClientLink
                  href={`/products/${p.handle}`}
                  className="flex items-center flex-1"
                >
                  {/* hranatý thumbnail */}
                  <Thumbnail
                    thumbnail={p.thumbnail}
                    images={p.images}
                    size="square"
                    className="w-10 h-10 object-cover rounded-sm mr-4"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium truncate">
                      {p.title}
                    </span>
                    <span className="text-xs text-ui-fg-subtle">
                      {convertToLocale({
                        amount: price,
                        currency_code: currency,
                      })}
                    </span>
                  </div>
                </LocalizedClientLink>

                {/* tlačítko Do košíku */}
                <Button
                  variant="secondary"
                  size="small"
                  className="ml-4 whitespace-nowrap"
                  onClick={async (e) => {
                    // zamezíme Navigaci při kliknutí na tlačítko
                    e.preventDefault()
                    e.stopPropagation()
                    await addToCart({
                      variantId: variant.id,
                      quantity: 1,
                      countryCode,
                    })
                  }}
                >
                  Do košíku
                </Button>
              </li>
            )
          })}

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
