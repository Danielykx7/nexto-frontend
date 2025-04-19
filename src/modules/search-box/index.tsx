// src/modules/layout/components/search-box/index.tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { IconButton } from "@medusajs/ui"
import { Search } from "lucide-react"

export default function SearchBox() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/store?query=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Hledat"
        className="w-full pl-10 pr-4 py-2 rounded-md border border-ui-border-base focus:outline-none focus:border-ui-fg-base"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <IconButton type="submit" variant="transparent" size="small" aria-label="Hledat">
          <Search className="w-5 h-5 text-ui-fg-subtle" />
        </IconButton>
      </div>
    </form>
  )
}
