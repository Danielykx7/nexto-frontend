// src/modules/common/components/search-box/index.tsx
"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { IconButton, Button } from "@medusajs/ui"
import { Search, Loader, Check } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { convertToLocale } from "@lib/util/money"
import { addToCart } from "@lib/data/cart"

export default function SearchBox() {
  const router = useRouter()
  const { countryCode = "" } = (useParams() as { countryCode?: string }) || {}

  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [actionStatus, setActionStatus] = useState<Record<string, "idle"|"loading"|"success">>({})
  const containerRef = useRef<HTMLDivElement>(null)

  // zavření dropdownu klikem mimo
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const fetchSuggestions = async (q: string) => {
    // Otevřeme dropdown hned, aby uživatel viděl loading
    setShowDropdown(true)
    setIsLoading(true)

    const base = "/api/suggestions"
    const url = q.trim() ? `${base}?limit=5&q=${encodeURIComponent(q)}` : `${base}?limit=5`
    try {
      const res = await fetch(url, { cache: "no-store" })
      if (!res.ok) throw new Error()
      const json = await res.json()
      setSuggestions(json.products || [])
    } catch {
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFocus = () => {
    fetchSuggestions("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    fetchSuggestions(q)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = query.trim()
    if (t) router.push(`/${countryCode}/search?query=${encodeURIComponent(t)}`)
  }

  const handleBlur = (e: React.FocusEvent) => {
    const to = e.relatedTarget as HTMLElement | null
    if (!containerRef.current?.contains(to)) {
      setShowDropdown(false)
    }
  }

  const handleAddToCart = async (variantId: string) => {
    setActionStatus(s => ({ ...s, [variantId]: "loading" }))
    try {
      await addToCart({ variantId, quantity: 1, countryCode })
      setActionStatus(s => ({ ...s, [variantId]: "success" }))
      setTimeout(() => setActionStatus(s => ({ ...s, [variantId]: "idle" })), 1000)
    } catch {
      setActionStatus(s => ({ ...s, [variantId]: "idle" }))
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
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
          <IconButton type="submit" variant="transparent" size="small" aria-label="Hledat">
            <Search className="w-5 h-5 text-ui-fg-subtle" />
          </IconButton>
        </div>
      </form>

      {showDropdown && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-ui-border-base rounded-md shadow-lg">
          {isLoading ? (
            <li className="flex items-center justify-center px-4 py-6">
              <Loader className="w-5 h-5 animate-spin text-ui-fg-subtle" />
            </li>
          ) : suggestions.length > 0 ? (
            suggestions.map(p => {
              const v         = p.variants?.[0]
              const amount    = v.calculated_price.calculated_amount
              const currency  = v.calculated_price.currency_code
              const inventory = v.inventory_quantity
              const status    = actionStatus[v.id] || "idle"

              return (
                <li
                  key={p.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100"
                >
                  <LocalizedClientLink
                    href={`/products/${p.handle}`}
                    className="flex items-center flex-1"
                  >
                    <Thumbnail
                      thumbnail={p.thumbnail}
                      images={p.images}
                      size="square"
                      className="w-10 h-10 object-cover mr-4 rounded-sm"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium truncate">
                        {p.title}
                      </span>
                      <span className="text-xs text-ui-fg-subtle">
                        {convertToLocale({
                          amount,
                          currency_code: currency,
                        })}
                      </span>
                    </div>
                  </LocalizedClientLink>

                  <div className="ml-4 whitespace-nowrap flex items-center">
                    {inventory <= 0 ? (
                      <Button variant="ghost" size="small" disabled>
                        Není skladem
                      </Button>
                    ) : status === "loading" ? (
                      <Button variant="secondary" size="small" disabled>
                        <Loader className="w-4 h-4 animate-spin" />
                      </Button>
                    ) : status === "success" ? (
                      <Button variant="secondary" size="small" disabled>
                        <Check className="w-4 h-4 text-green-500" />
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={e => {
                          e.preventDefault()
                          handleAddToCart(v.id)
                        }}
                      >
                        Do košíku
                      </Button>
                    )}
                  </div>
                </li>
              )
            })
          ) : (
            <li className="px-4 py-2 text-center text-ui-fg-subtle">
              Žádné výsledky
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
