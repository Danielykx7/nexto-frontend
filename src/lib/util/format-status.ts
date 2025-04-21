// src/lib/util/format-status.ts

export function formatFulfillmentStatus(status?: string): string {
  switch (status) {
    case "not_fulfilled": return "Nenaplněno";
    case "fulfilled":     return "Vyřízeno";
    case "partially_fulfilled": return "Částečně vyřízeno";
    case "canceled":      return "Zrušeno";
    default:              return "Vyřizuje se";
  }
}

export function formatPaymentStatus(status?: string): string {
  switch (status) {
    case "not_paid":      return "Nezaplaceno";
    case "awaiting":      return "Čeká na platbu";
    case "captured":      return "Zaplaceno";
    case "requires_action": return "Potřebuje akci";
    case "canceled":      return "Zrušeno";
    default:              return "Neznámý stav";
  }
}
