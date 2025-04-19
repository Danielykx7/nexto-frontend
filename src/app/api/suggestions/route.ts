// src/app/api/suggestions/route.ts
import { NextRequest, NextResponse } from "next/server"

const BACKEND =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
// Publishable key z .env.local
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY in .env.local")
}

/** Pomocník na získání region_id (jen jednou) */
let DEFAULT_REGION_ID: string | null = null
async function getDefaultRegionId() {
  if (DEFAULT_REGION_ID) return DEFAULT_REGION_ID

  const res = await fetch(`${BACKEND}/store/regions`, {
    headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
    cache: "no-store",
  })
  if (!res.ok) return null

  const { regions } = await res.json()
  DEFAULT_REGION_ID = regions?.[0]?.id || null
  return DEFAULT_REGION_ID
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q     = searchParams.get("q")     ?? ""
  const limit = searchParams.get("limit") ?? "5"

  // vždy přidej region_id, aby ti Medusa nehodila 400
  const regionId = await getDefaultRegionId()

  const params = new URLSearchParams({ limit })
  if (q)        params.set("q", q)
  if (regionId) params.set("region_id", regionId)

  const url = `${BACKEND}/store/products?${params.toString()}`
  console.log("▶︎ Fetching Suggestions:", url)

  const res = await fetch(url, {
    headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
    cache: "no-store",
  })
  if (!res.ok) {
    console.warn("Store/products failed:", await res.text())
    return NextResponse.json({ products: [] })
  }

  const { products } = await res.json()
  return NextResponse.json({ products: products || [] })
}
