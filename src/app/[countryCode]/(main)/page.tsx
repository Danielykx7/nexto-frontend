/* src/app/[countryCode]/(main)/page.tsx */
import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import FeaturedProducts from "@modules/home/components/featured-products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Nexto Shop - Elektronika a Díly",
  description:
    "Široký výběr elektroniky a dílů. Objevte kvalitní produkty a užijte si rychlé a spolehlivé nakupování.",
}

export default async function Home({ params }: { params: { countryCode: string } }) {
  const { countryCode } = params
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    handle: ["featured"],
    fields: "id, handle, title",
  })

  if (!region || !collections || collections.length === 0) {
    return null
  }

  return (
    <>
      <Hero />
      <FeaturedProducts collections={collections} region={region} />
    </>
  )
}