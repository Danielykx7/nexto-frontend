import { Heading, Text } from "@medusajs/ui"
import TransferActions from "@modules/order/components/transfer-actions"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <Heading level="h1" className="text-xl text-zinc-900">
          Transfer request for order {id}
        </Heading>
        <Text className="text-zinc-600">
          Obdrželi jste žádost o převod vlastnictví vaší objednávky ({id}).
          Pokud s touto žádostí souhlasíte, můžete převod schválit kliknutím
          na tlačítko níže.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <Text className="text-zinc-600">
          Pokud souhlasíte, nový vlastník převezme veškeré odpovědnosti a
          oprávnění spojená s touto objednávkou.
        </Text>
        <Text className="text-zinc-600">
          Pokud tuto žádost nepoznáváte nebo si přejete vlastnictví ponechat,
          není nutné podnikat žádné další kroky.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
