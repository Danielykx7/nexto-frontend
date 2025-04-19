// src/app/api/suggestions/route.ts
import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

const BACKEND         = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!
const PKEY            = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
if (!PKEY) throw new Error("Chybí NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY v .env.local")

let DEFAULT_REGION_ID: string | null = null
async function getDefaultRegionId(): Promise<string | null> {
  if (DEFAULT_REGION_ID) {
    return DEFAULT_REGION_ID
  }
  const res = await fetch(`${BACKEND}/store/regions?limit=1`, {
    cache:   "no-store",
    headers: { "x-publishable-api-key": PKEY },
  })
  if (!res.ok) return null
  const { regions } = await res.json()
  DEFAULT_REGION_ID = regions?.[0]?.id || null
  return DEFAULT_REGION_ID
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q     = searchParams.get("q")     ?? undefined
  const limit = parseInt(searchParams.get("limit") ?? "5", 10)

  const region_id = await getDefaultRegionId()

  // Sestavíme parametry pro store/products
  const query: Record<string, any> = {
    limit,
    ...(q         && { q }),
    ...(region_id && { region_id }),
    // Tohle jsou klíče, které “rozbalí” price i inventory_quantity
    fields: [
      "id",
      "title",
      "handle",
      "thumbnail",
      "*variants.calculated_price",
      "*variants.inventory_quantity",
    ].join(","),
  }

  // Načteme produkty přes sdk.client.fetch
  const { products } = await sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(
      "/store/products",
      {
        cache:  "no-store",
        query,
        headers: { "x-publishable-api-key": PKEY },
      }
    )
    .catch(() => ({ products: [] }))

  return NextResponse.json({ products })
}
