// src/modules/layout/components/cart-dropdown/index.tsx
"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Badge, Button, Text } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { ShoppingCart } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CartDropdown = ({ cart: cartState }: { cart?: HttpTypes.StoreCart | null }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer>()
  const [openDropdown, setOpenDropdown] = useState(false)

  const totalItems = cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cartState?.subtotal ?? 0
  const totalWithTax = cartState?.total ?? subtotal + (cartState?.tax_total ?? 0)
  const itemRef = useRef<number>(totalItems)

  const open = () => setOpenDropdown(true)
  const close = () => setOpenDropdown(false)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) clearTimeout(activeTimer)
    open()
  }

  useEffect(() => () => activeTimer && clearTimeout(activeTimer), [activeTimer])

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
      itemRef.current = totalItems
    }
  }, [totalItems, pathname])

  return (
    <div className="relative h-full" onMouseEnter={openAndCancel} onMouseLeave={close}>
      <Popover className="relative h-full">
        <Popover.Button
          className="h-full flex items-center justify-center relative px-2 text-ui-fg-subtle hover:text-ui-fg-base"
          aria-label={`Košík (${totalItems})`}
          onClick={() => router.push('/cart')}
        >
          <ShoppingCart className="w-5 h-5 text-ui-fg-subtle hover:text-ui-fg-base" />
          {totalItems > 0 && (
            <Badge size="small" className="absolute top-0 right-0 w-4 h-4 text-xs leading-none flex items-center justify-center p-0">
              {totalItems}
            </Badge>
          )}
        </Popover.Button>

        <Transition
          show={openDropdown}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="absolute top-[calc(100%+1px)] right-0 z-50 hidden small:block w-[420px] bg-white border border-gray-200 text-ui-fg-base"
            data-testid="nav-cart-dropdown"
          >
            <div className="p-4 flex items-center justify-center">
              <h3 className="text-large-semi">Košík</h3>
            </div>
            {cartState?.items?.length ? (
              <>
                <div className="max-h-[402px] overflow-y-auto px-4 grid gap-y-8">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[122px_1fr] gap-x-4">
                      <LocalizedClientLink href={`/products/${item.product_handle}`} className="w-24">
                        <Thumbnail
                          thumbnail={item.thumbnail}
                          images={item.variant?.product?.images}
                          size="square"
                        />
                      </LocalizedClientLink>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <Text className="txt-medium-plus text-ui-fg-base truncate" data-testid="product-title">
                            {item.product_title}
                          </Text>
                          <LineItemOptions variant={item.variant} data-testid="product-variant" />
                          <span className="text-small-regular">Množství: {item.quantity}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <LineItemPrice item={item} style="tight" currencyCode={cartState.currency_code} />
                          <DeleteButton id={item.id}>Odebrat</DeleteButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 flex flex-col gap-y-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Celkem (vč. DPH)</span>
                    <span className="text-large-semi">
                      {convertToLocale({ amount: totalWithTax, currency_code: cartState.currency_code })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart">
                    <Button size="large" className="w-full">Přejít do košíku</Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-y-4">
                <div className="bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <span>0</span>
                </div>
                <span>Váš nákupní košík je prázdný.</span>
                <LocalizedClientLink href="/store">
                  <Button onClick={close}>Prozkoumat produkty</Button>
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
