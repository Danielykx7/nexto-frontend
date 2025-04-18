"use client"

import { resetOnboardingState } from "@lib/data/onboarding"
import { Button, Container, Text } from "@medusajs/ui"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full">
      <div className="flex flex-col gap-y-4 center p-4 md:items-center">
        <Text className="text-ui-fg-base text-xl">
          Vaše testovací objednávka byla úspěšně vytvořena! 🎉
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          Nyní můžete dokončit nastavení svého obchodu v administraci.
        </Text>
        <Button
          className="w-fit"
          size="xlarge"
          onClick={() => resetOnboardingState(orderId)}
        >
          Dokončit nastavení v administraci
        </Button>
      </div>
    </Container>
  )
}

export default OnboardingCta
