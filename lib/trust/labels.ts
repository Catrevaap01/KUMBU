import { freshnessAnchor, hoursSince } from "./freshness";

export type TrustLabel =
  | "Novo registo"
  | "Confirmado pela comunidade"
  | "Vários relatos"
  | "Possivelmente desatualizado"
  | "Sinalizado para revisão";

export type SourceLabel = "Informado pelo vendedor" | "Relatado pela comunidade";

export function computeSourceLabel(sourceType: "SELLER" | "COMMUNITY"): SourceLabel {
  return sourceType === "SELLER" ? "Informado pelo vendedor" : "Relatado pela comunidade";
}

/**
 * Deterministic, priority-ordered trust label — see spec §6. First match
 * wins. Never persisted: age keeps changing, so this must always be computed
 * at read time from the report's stored timestamps and live counts.
 */
export function computeTrustLabel(input: {
  submittedAt: Date;
  lastVerifiedAt: Date;
  confirmationCount: number;
  openFlagCount: number;
  now?: Date;
}): TrustLabel {
  const { confirmationCount, openFlagCount, now } = input;

  if (openFlagCount >= 1) return "Sinalizado para revisão";

  const ageHours = hoursSince(freshnessAnchor(input), now);
  if (ageHours > 72) return "Possivelmente desatualizado";
  if (confirmationCount >= 3) return "Vários relatos";
  if (confirmationCount >= 1) return "Confirmado pela comunidade";
  return "Novo registo";
}

export const STALE_INLINE_MESSAGE = "Este preço não é confirmado recentemente.";
export const NO_DATA_MESSAGE = "Ainda não temos informações de preço suficientes para este produto.";
export const CONFLICTING_REPORTS_MESSAGE =
  "Relatos da comunidade indicam preços divergentes. Confirme com o vendedor antes de se deslocar.";

export function computeNoDataMessage(activeReportCount: number): string | null {
  return activeReportCount === 0 ? NO_DATA_MESSAGE : null;
}

/** Wide price spread (>50% of the minimum) across active reports for one product. */
export function computeConflictingReportsMessage(prices: number[]): string | null {
  if (prices.length < 2) return null;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min <= 0) return null;
  return (max - min) / min > 0.5 ? CONFLICTING_REPORTS_MESSAGE : null;
}
