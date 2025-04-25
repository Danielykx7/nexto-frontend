// src/app/products/[handle]/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductByHandle, listProducts } from "@lib/data/products"
import { getCategoriesByProduct } from "@lib/data/categories"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then((regs) =>
    regs?.flatMap((r) => r.countries?.map((c) => c.iso_2) ?? [])
  )
  if (!countryCodes) return []

  const { response } = await listProducts({
    countryCode: "US",
    queryParams: { fields: "handle", limit: 100 },
  })

  return countryCodes
    .flatMap((cc) => response.products.map((p) => ({ countryCode: cc, handle: p.handle })))
    .filter((p) => p.handle)
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode, handle } = await props.params
  const region = await getRegion(countryCode)
  if (!region) notFound()

  const product = await getProductByHandle(handle, countryCode)
  if (!product) notFound()

  return {
    title: `${product.title} | Eshop`,
    description: product.description || product.title,
    openGraph: {
      title: `${product.title} | Eshop`,
      description: product.description || product.title,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const { countryCode, handle } = await props.params
  const region = await getRegion(countryCode)
  if (!region) notFound()

  const product = await getProductByHandle(handle, countryCode)
  if (!product) notFound()

  // teď stáhneme kategorie zvlášť
  const categories = await getCategoriesByProduct(product.id)

  return (
    <ProductTemplate
      product={{ ...product, categories }}
      region={region}
      countryCode={countryCode}
    />
  )
}
