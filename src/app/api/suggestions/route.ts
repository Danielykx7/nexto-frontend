// src/app/api/suggestions/route.ts
import { NextRequest, NextResponse } from "next/server"

const BACKEND =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
// Publishable key, který jsi uložil do .env.local
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY in .env.local")
}

/* -------- default region helper (bez SDK) -------- */
let DEFAULT_REGION_ID: string | null = null
async function getDefaultRegionId() {
  if (DEFAULT_REGION_ID) {
    return DEFAULT_REGION_ID
  }

  const res = await fetch(`${BACKEND}/store/regions`, {
    cache: "no-store",
    headers: {
      "x-publishable-api-key": PUBLISHABLE_KEY,
    },
  })

  // Pokud endpoint vrátí chybu, prostě vrátíme null a spolehceieme se na currency_code
  if (!res.ok) {
    console.warn("Failed to fetch regions:", await res.text())
    return null
  }

  const { regions } = await res.json()
  DEFAULT_REGION_ID = regions?.[0]?.id || null
  return DEFAULT_REGION_ID
}
/* -------------------------------------------------- */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q     = searchParams.get("q") ?? ""
  const limit = searchParams.get("limit") ?? "5"

  // Sestavíme základní parametry
  const params = new URLSearchParams({ limit })

  if (q) {
    params.set("q", q)
  } else {
    // Pokud už máme region, použijeme ho. Jinak žádáme backend, pokusíme se
    const regionId = await getDefaultRegionId()
    if (regionId) {
      params.set("region_id", regionId)
    }
  }

  const url = `${BACKEND}/store/products?${params.toString()}`
  // Debug
  console.log("▶︎ Fetching:", url)
  console.log("▶︎ x-publishable-api-key:", PUBLISHABLE_KEY)

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "x-publishable-api-key": PUBLISHABLE_KEY,
    },
  })

  if (!res.ok) {
    console.warn(`Store/products ${res.status}:`, await res.text())
    return NextResponse.json({ products: [] })
  }

  const { products } = await res.json()
  return NextResponse.json({ products: products || [] })
}
