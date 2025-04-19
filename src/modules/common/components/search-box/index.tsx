// src/modules/common/components/search-box/index.tsx
"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useRef } from "react"
import { IconButton } from "@medusajs/ui"
import { Search } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function SearchBox() {
  const router                   = useRouter()
  const { countryCode = "" }     = useParams<{ countryCode?: string }>()
  const [query, setQuery]        = useState("")
  const [suggs, setSuggs]        = useState<any[]>([])
  const [open, setOpen]          = useState(false)
  const debounce = useRef<NodeJS.Timeout | null>(null)

  // fetch helper
  const fetchSuggestions = async (term = "") => {
    const url = term
      ? `/api/suggestions?q=${encodeURIComponent(term)}&limit=5`
      : `/api/suggestions?limit=5`          // top sales_rank
    const res  = await fetch(url, { cache: "no-store" })
    const json = await res.json()
    setSuggs(json.products || [])
  }

  /* handlers */
  const onFocus  = () => { setOpen(true); fetchSuggestions("") }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    setOpen(true)

    // debounce 300 ms
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => fetchSuggestions(val.trim()), 300)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q) router.push(`/${countryCode}/search?query=${encodeURIComponent(q)}`)
  }

  const onBlur = () => setTimeout(() => setOpen(false), 120)

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={onSubmit}>
        <input
          value={query}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Hledat"
          className="w-full pl-10 pr-4 py-2 rounded-md border border-ui-border-base focus:outline-none focus:border-ui-fg-base"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <IconButton type="submit" variant="transparent" size="small" aria-label="Hledat">
            <Search className="w-5 h-5 text-ui-fg-subtle" />
          </IconButton>
        </div>
      </form>

      {open && suggs.length > 0 && (
        <ul className="absolute z-[60] mt-1 w-full bg-white border border-ui-border-base rounded-md shadow-lg max-h-80 overflow-y-auto">
          {suggs.map((p) => (
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
