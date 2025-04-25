// src/lib/data/products.ts
"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region = countryCode
    ? await getRegion(countryCode)
    : await retrieveRegion(regionId!)

  if (!region) {
    return { response: { products: [], count: 0 }, nextPage: null }
  }

  const headers = { ...(await getAuthHeaders()) }
  const next = { ...(await getCacheOptions("products")) }

  const { products, count } = await sdk.client.fetch<{
    products: HttpTypes.StoreProduct[]
    count: number
  }>(
    `/store/products`,
    {
      method: "GET",
      query: {
        limit,
        offset,
        region_id: region.id,
        // +categories i +variants.inventory_quantity
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+categories",
        ...queryParams,
      },
      headers,
      next,
      cache: "force-cache",
    }
  )

  const nextPage = count > offset + limit ? pageParam + 1 : null
  return { response: { products, count }, nextPage, queryParams }
}

export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}) => {
  const limit = queryParams?.limit || 12
  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: { ...queryParams, limit: 100 },
    countryCode,
  })

  const sorted = sortProducts(products, sortBy)
  const start = (page - 1) * limit
  const paginated = sorted.slice(start, start + limit)
  const nextPage = count > start + limit ? page + 1 : null

  return { response: { products: paginated, count }, nextPage, queryParams }
}

/**
 * Načte jeden produkt podle handle včetně inventory a variant,
 * ale bez kategorií – ty si stáhneme zvlášť.
 */
export const getProductByHandle = async (
  handle: string,
  countryCode: string
): Promise<HttpTypes.StoreProduct | undefined> => {
  const { response } = await listProducts({
    countryCode,
    queryParams: { handle, limit: 1 },
  })
  return response.products[0]
}
