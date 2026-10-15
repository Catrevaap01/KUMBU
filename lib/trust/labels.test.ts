import { describe, expect, it } from "vitest";
import {
  computeConflictingReportsMessage,
  computeNoDataMessage,
  computeSourceLabel,
  computeTrustLabel,
} from "./labels";

const NOW = new Date("2026-01-10T12:00:00Z");
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 60 * 60 * 1000);

describe("computeSourceLabel", () => {
  it("maps SELLER and COMMUNITY to their display strings", () => {
    expect(computeSourceLabel("SELLER")).toBe("Informado pelo vendedor");
    expect(computeSourceLabel("COMMUNITY")).toBe("Relatado pela comunidade");
  });
});

describe("computeTrustLabel", () => {
  it("flags for review regardless of age/confirmations when an open flag exists", () => {
    const label = computeTrustLabel({
      submittedAt: hoursAgo(1),
      lastVerifiedAt: hoursAgo(1),
      confirmationCount: 5,
      openFlagCount: 1,
      now: NOW,
    });
    expect(label).toBe("Sinalizado para revisão");
  });

  it("is possibly outdated past 72 hours with no flags", () => {
    const label = computeTrustLabel({
      submittedAt: hoursAgo(73),
      lastVerifiedAt: hoursAgo(73),
      confirmationCount: 0,
      openFlagCount: 0,
      now: NOW,
    });
    expect(label).toBe("Possivelmente desatualizado");
  });

  it("is not outdated at exactly 72 hours", () => {
    const label = computeTrustLabel({
      submittedAt: hoursAgo(72),
      lastVerifiedAt: hoursAgo(72),
      confirmationCount: 0,
      openFlagCount: 0,
      now: NOW,
    });
    expect(label).not.toBe("Possivelmente desatualizado");
  });

  it("is multiple reports at 3+ confirmations within the freshness window", () => {
    const label = computeTrustLabel({
      submittedAt: hoursAgo(10),
      lastVerifiedAt: hoursAgo(10),
      confirmationCount: 3,
      openFlagCount: 0,
      now: NOW,
    });
    expect(label).toBe("Vários relatos");
  });

  it("is community confirmed at 1-2 confirmations", () => {
    const label = computeTrustLabel({
      submittedAt: hoursAgo(10),
      lastVerifiedAt: hoursAgo(10),
      confirmationCount: 1,
      openFlagCount: 0,
      now: NOW,
    });
    expect(label).toBe("Confirmado pela comunidade");
  });

  it("is newly reported with zero confirmations and fresh age", () => {
    const label = computeTrustLabel({
      submittedAt: hoursAgo(1),
      lastVerifiedAt: hoursAgo(1),
      confirmationCount: 0,
      openFlagCount: 0,
      now: NOW,
    });
    expect(label).toBe("Novo registo");
  });

  it("uses the more recent of submittedAt/lastVerifiedAt as the freshness anchor", () => {
    const label = computeTrustLabel({
      submittedAt: hoursAgo(200),
      lastVerifiedAt: hoursAgo(1),
      confirmationCount: 0,
      openFlagCount: 0,
      now: NOW,
    });
    expect(label).toBe("Novo registo");
  });
});

describe("computeNoDataMessage", () => {
  it("returns the exact spec copy when there are zero active reports", () => {
    expect(computeNoDataMessage(0)).toBe(
      "Ainda não temos informações de preço suficientes para este produto.",
    );
  });

  it("returns null when reports exist", () => {
    expect(computeNoDataMessage(1)).toBeNull();
  });
});

describe("computeConflictingReportsMessage", () => {
  it("returns the exact spec copy when price spread exceeds 50% of the minimum", () => {
    expect(computeConflictingReportsMessage([10, 20])).toBe(
      "Relatos da comunidade indicam preços divergentes. Confirme com o vendedor antes de se deslocar.",
    );
  });

  it("returns null when prices are close together", () => {
    expect(computeConflictingReportsMessage([10, 12])).toBeNull();
  });

  it("returns null with fewer than two prices", () => {
    expect(computeConflictingReportsMessage([10])).toBeNull();
  });
});
