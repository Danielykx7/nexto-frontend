"use client"

import React from "react"
import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const tabs = [
    {
      label: "Popis",
      component: (
        <div className="prose max-w-none py-8">
          {product.description}
        </div>
      ),
    },
    {
      label: "Podrobnosti o produktu",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Doprava a vrácení",
      component: <ShippingInfoTab />,
    },
    {
      label: "Recenze",
      component: (
        <div className="py-8">
          {/* TODO: sem vložte váš komponent pro recenze */}
          Zatím nejsou dostupné žádné recenze.
        </div>
      ),
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab: React.FC<ProductTabsProps> = ({ product }) => (
  <div className="text-small-regular py-8">
    <div className="grid grid-cols-2 gap-x-8">
      <div className="flex flex-col gap-y-4">
        <div>
          <span className="font-semibold">Materiál</span>
          <p>{product.material ?? "-"}</p>
        </div>
        <div>
          <span className="font-semibold">Typ</span>
          <p>{product.type?.value ?? "-"}</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <div>
          <span className="font-semibold">Hmotnost</span>
          <p>{product.weight ? `${product.weight} g` : "-"}</p>
        </div>
        <div>
          <span className="font-semibold">Rozměry</span>
          <p>
            {product.length && product.width && product.height
              ? `${product.length}L x ${product.width}W x ${product.height}H`
              : "-"}
          </p>
        </div>
      </div>
    </div>
  </div>
)

const ShippingInfoTab: React.FC = () => (
  <div className="text-small-regular py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-8">
      {/* Doprava */}
      <div className="flex flex-col items-start gap-y-2">
        <FastDelivery />
        <span className="font-semibold">Doprava</span>
        <p className="max-w-xs">
          Vaše zásilka dorazí během 2–5 pracovních dnů na Vámi zvolené místo vyzvednutí nebo přímo k Vám domů.
        </p>
      </div>

      {/* Výměna */}
      <div className="flex flex-col items-start gap-y-2">
        <Refresh />
        <span className="font-semibold">Výměna</span>
        <p className="max-w-xs">
          Nevyhovuje Vám? Žádný problém – vyměníme váš produkt za jiný bez dalších starostí.
        </p>
      </div>

      {/* Snadné vrácení */}
      <div className="flex flex-col items-start gap-y-2">
        <Back />
        <span className="font-semibold">Snadné vrácení</span>
        <p className="max-w-xs">
          Stačí vrátit svůj produkt a my vám vrátíme peníze. Žádné otázky – vše proběhne hladce a rychle.
        </p>
      </div>
    </div>
  </div>
)

export default ProductTabs
