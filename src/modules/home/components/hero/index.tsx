/* src/modules/home/components/hero/index.tsx */
"use client"

import { useRouter } from "next/navigation"
import { Button, Heading } from "@medusajs/ui"

export default function Hero() {
  const router = useRouter()

  return (
    <section className="relative h-[75vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("images/hero.png")` }}
        />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:px-0 gap-6">
        <Heading
          level="h1"
          className="text-white text-5xl md:text-6xl font-semibold leading-tight"
        >
          Vítejte v Nexto
        </Heading>
        <Heading
          level="h2"
          className="text-white text-lg md:text-2xl font-light"
        >
          Objevte produkty vytvořené pro vás
        </Heading>
        <div className="flex space-x-4">
          {/* Přesměrování na /store */}
          <Button
            variant="primary"
            size="large"
            onClick={() => router.push('/store')}
          >
            Nakupovat nyní
          </Button>
          <Button
            variant="secondary"
            size="large"
            onClick={() => router.push('/store')}
          >
            Více informací
          </Button>
        </div>
      </div>
    </section>
  )
}