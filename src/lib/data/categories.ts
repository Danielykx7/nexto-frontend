// src/lib/data/categories.ts
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

/**
 * Vrátí všechny kategorie (včetně children, products, parent řetězu).
 * Zachováno beze změny kvůli závislostem.
 */
export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

/**
 * Načte jednu kategorii podle handle (včetně children a parent řetězu).
 * Zachováno beze změny kvůli závislostem.
 */
export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}

/**
 * Načte všechny kategorie, do kterých je přiřazen daný produkt.
 * Protože store API nepodporuje `product_id` filter, stáhneme
 * všechny kategorie a vyfiltrujeme ty, jejichž .products obsahuje ID.
 */
export const getCategoriesByProduct = async (
  productId: string
): Promise<HttpTypes.StoreProductCategory[]> => {
  // Načteme co nejvíce kategorií
  const categories = await listCategories({ limit: 1000 })

  // Vrátíme jen ty, které mají v poli .products daný productId
  return categories.filter((cat) =>
    cat.products?.some((p) => p.id === productId)
  )
}
