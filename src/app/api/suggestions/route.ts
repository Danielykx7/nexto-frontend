// src/app/api/suggestions/route.ts
import { NextRequest, NextResponse } from "next/server"
import Medusa from "@medusajs/js-sdk"

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const medusa  = new Medusa({ baseUrl: BACKEND })

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q     = searchParams.get("q")     ?? ""
  const limit = parseInt(searchParams.get("limit") ?? "5", 10)

  try {
    // ------------ nový způsob volání search ------------
    const { hits } = await medusa.search.list({
      type: "product",
      q,                      // prázdné = žádný filtr
      limit,
      // když není q, řadíme podle sales_rank (popularity)
      ...(q ? {} : { sort: "sales_rank" }),
    })
    // ----------------------------------------------------

    return NextResponse.json({ products: hits })
  } catch {
    return NextResponse.json({ products: [] }, { status: 200 })
  }
}
