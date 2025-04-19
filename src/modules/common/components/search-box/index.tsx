// src/modules/common/components/search-box/index.tsx
"use client"

import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { IconButton } from "@medusajs/ui"
import { Search } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function SearchBox() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchSuggestions = async (url: string) => {
    try {
      const res = await fetch(url)
      const json = await res.json()
      setSuggestions(json.products)
    } catch {
      setSuggestions([])
    }
  }

  const handleFocus = () => {
    setShowDropdown(true)
    fetchSuggestions(`/store/products?limit=5&sort=popularity`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    if (q.trim() === "") {
      fetchSuggestions(`/store/products?limit=5&sort=popularity`)
    } else {
      fetchSuggestions(`/store/products?limit=5&q=${encodeURIComponent(q)}`)
    }
    setShowDropdown(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/store?query=${encodeURIComponent(trimmed)}`)
      setShowDropdown(false)
    }
  }

  const handleBlur = () => {
    // Delay to allow clicks
    setTimeout(() => setShowDropdown(false), 100)
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
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-ui-border-base rounded-md shadow-lg">
          {suggestions.map((p) => (
            <li key={p.id}>
              <LocalizedClientLink
                href={`/products/${p.handle}`}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                {p.title}
              </LocalizedClientLink>
            </li>
          ))}
          <li>
            <LocalizedClientLink
              href="/store"
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
