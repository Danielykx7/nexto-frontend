// src/modules/layout/components/nav-search/index.tsx
"use client"

import dynamic from "next/dynamic"

// dynamicky načteme SearchBox, pouze na klientu
const SearchBox = dynamic(
  () => import("@modules/common/components/search-box"),
  { ssr: false }
)

export default function NavSearch() {
  return <SearchBox />
}
