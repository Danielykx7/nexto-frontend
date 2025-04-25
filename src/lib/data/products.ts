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

  let region: HttpTypes.StoreRegion | undefined | null
  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return { response: { products: [], count: 0 }, nextPage: null }
  }

  const headers = await getAuthHeaders()
  const next = await getCacheOptions("products")

  const { products, count } = await sdk.client.fetch<{
    products: HttpTypes.StoreProduct[]
    count: number
  }>(`/store/products`, {
    method: "GET",
    query: {
      limit,
      offset,
      region_id: region.id,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
      ...queryParams,
    },
    headers,
    next,
    cache: "force-cache",
  })

  const nextPage = count > offset + limit ? pageParam + 1 : null
  return {
    response: { products, count },
    nextPage,
    queryParams,
  }
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
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: { ...queryParams, limit: 100 },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)
  const start = (page - 1) * limit
  const nextPage = count > start + limit ? page + 1 : null
  const paginated = sortedProducts.slice(start, start + limit)

  return {
    response: { products: paginated, count },
    nextPage,
    queryParams,
  }
}

/**
 * Retrieve single product by handle, including categories and their parent.
 */
export const retrieveProduct = async ({
  handle,
  countryCode,
  regionId,
}: {
  handle: string
  countryCode?: string
  regionId?: string
}): Promise<HttpTypes.StoreProduct> => {
  // 1) zjistíme region
  let region: HttpTypes.StoreRegion | undefined | null
  if (countryCode) {
    region = await getRegion(countryCode)
  } else if (regionId) {
    region = await retrieveRegion(regionId)
  }
  if (!region) {
    throw new Error("Region not found")
  }

  // 2) find product id via listProducts
  const {
    response: { products },
  } = await listProducts({ queryParams: { handle, limit: 1 }, countryCode, regionId })
  const basic = products[0]
  if (!basic) {
    throw new Error(`Product with handle "${handle}" not found`)
  }

  // 3) fetch full product via retrieve endpoint with expand
  const headers = await getAuthHeaders()
  const next = await getCacheOptions(`product-${basic.id}`)
  const product = await sdk.client.fetch<HttpTypes.StoreProduct>(
    `/store/products/${basic.id}`,
    {
      method: "GET",
      query: {
        region_id: region.id,
        expand: ["categories", "categories.parent"],
      },
      headers,
      next,
      cache: "force-cache",
    }
  )

  return product
}
