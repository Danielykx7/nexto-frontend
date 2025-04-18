import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"

export const metadata: Metadata = {
  title: "404",
  description: "Něco se pokazilo",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">Stránka nenalezena</h1>
      <p className="text-small-regular text-ui-fg-base">
        Stránka, kterou jste se pokusili navštívit, neexistuje.
      </p>
      <InteractiveLink href="/">Přejít na úvodní stránku</InteractiveLink>
    </div>
  )
}
