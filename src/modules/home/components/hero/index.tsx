/* src/modules/home/components/hero/index.tsx */
import { Button, Heading } from "@medusajs/ui"

export default function Hero() {
  return (
    <section className="relative h-[75vh] w-full overflow-hidden">
      {/* Pozadí */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("/images/hero.jpg")` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      {/* Obsah hero sekce */}
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
          Objevte prémiové produkty vytvořené pro vás
        </Heading>
        <div className="flex space-x-4">
          <Button variant="primary" size="large">
            Nakupovat nyní
          </Button>
          <Button variant="secondary" size="large">
            Více informací
          </Button>
        </div>
      </div>
    </section>
  )
}