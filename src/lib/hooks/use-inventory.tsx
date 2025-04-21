// src/lib/hooks/use-inventory.tsx
import { useEffect, useState } from "react"
import { sdk } from "@lib/config"

/**
 * Hook to fetch inventory quantity for a cart line item.
 * @param productId - ID of the product
 * @param variantId - ID of the variant
 * @returns number of items in stock, or 0 if none or on error
 */
export const useInventory = (
  productId: string | undefined,
  variantId: string | undefined
): number => {
  const [stock, setStock] = useState<number>(0)

  useEffect(() => {
    if (!productId || !variantId) {
      console.warn("[useInventory] missing productId or variantId", productId, variantId)
      setStock(0)
      return
    }

    sdk.store.product
      .retrieve(productId, {
        // get only inventory_quantity for variants
        fields: "*variants.inventory_quantity",
      })
      .then(({ product }) => {
        const found = product.variants?.find((v) => v.id === variantId)
        const qty = found?.inventory_quantity ?? 0
        setStock(qty)
      })
      .catch((error) => {
        setStock(0)
      })
  }, [productId, variantId])

  return stock
}
