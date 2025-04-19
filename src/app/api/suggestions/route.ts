// src/app/api/suggestions/route.ts
import { NextRequest, NextResponse } from "next/server"

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!
const PKEY    = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
if (!PKEY) throw new Error("Chybí NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY v .env.local")

let DEFAULT_REGION_ID: string | null = null
async function getDefaultRegionId(): Promise<string | null> {
  if (DEFAULT_REGION_ID) return DEFAULT_REGION_ID

  const res = await fetch(`${BACKEND}/store/regions?limit=1`, {
    cache: "no-store",
    headers: { "x-publishable-api-key": PKEY },
  })
  if (!res.ok) return null

  const { regions } = await res.json()
  DEFAULT_REGION_ID = regions?.[0]?.id || null
  return DEFAULT_REGION_ID
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q         = searchParams.get("q") ?? undefined
  const limit     = parseInt(searchParams.get("limit") ?? "5", 10)
  const region_id = await getDefaultRegionId()

  // jediné parametry: limit, případně q, region_id a fields
  const params = new URLSearchParams()
  params.set("limit", String(limit))
  if (q)         params.set("q", q)
  if (region_id) params.set("region_id", region_id)

  // *variants.calculated_price +variants.inventory_quantity vrátí sklad i cenu
  params.set("fields", "*variants.calculated_price,+variants.inventory_quantity")

  const url = `${BACKEND}/store/products?${params.toString()}`
  const res = await fetch(url, {
    cache: "no-store",
    headers: { "x-publishable-api-key": PKEY },
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: "Nelze načíst produkty z Medusa Store API" },
      { status: 500 }
    )
  }

  const { products } = (await res.json()) as { products: any[] }
  return NextResponse.json({ products })
}
