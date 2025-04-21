import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { formatFulfillmentStatus, formatPaymentStatus } from "@lib/util/format-status"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div>
      <Text>
        Potvrzení objednávky jsme odeslali na{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        Datum objednávky:{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString("cs-CZ", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        Číslo objednávky: <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              Stav objednávky:{" "}
              <span className="text-ui-fg-subtle" data-testid="order-status">
                {formatFulfillmentStatus(order.fulfillment_status)}
              </span>
            </Text>
            <Text>
              Stav platby:{" "}
              <span className="text-ui-fg-subtle" data-testid="order-payment-status">
                {formatPaymentStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
