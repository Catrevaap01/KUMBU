export function formatPrice(price: number, currency: string): string {
  if (currency === "AOA" || currency === "Kz") {
    const formatted = new Intl.NumberFormat("pt-AO", {
      minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(price);
    return `${formatted} Kz`;
  }
  try {
    return new Intl.NumberFormat("pt-AO", { style: "currency", currency }).format(price);
  } catch {
    return `${price.toLocaleString("pt-AO")} ${currency}`;
  }
}

export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.round(diffMs / (1000 * 60));

  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `há ${minutes} min`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;

  const days = Math.round(hours / 24);
  if (days < 30) return `há ${days} ${days === 1 ? "dia" : "dias"}`;

  const months = Math.round(days / 30);
  return `há ${months} ${months === 1 ? "mês" : "meses"}`;
}
