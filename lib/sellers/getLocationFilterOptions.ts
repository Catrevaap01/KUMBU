import { prisma } from "@/lib/db/client";
import { COUNTRY_LABEL, ANGOLA_PROVINCES, type CountryCode } from "@/lib/validation/country";

export type LocationFilterOptions = {
  countries: { value: CountryCode; label: string }[];
  cities: string[];
};

export async function getLocationFilterOptions(country?: CountryCode): Promise<LocationFilterOptions> {
  const sellersWithActiveListings = await prisma.seller.findMany({
    where: { priceReports: { some: { moderationStatus: "ACTIVE" } } },
    select: { country: true, city: true },
    distinct: ["country", "city"],
  });

  const countrySet = new Set<CountryCode>(["ANGOLA", ...sellersWithActiveListings.map((s) => s.country)]);
  
  // Se for Angola (ou sem filtro de país específico), incluir todas as 18 províncias de Angola
  const baseCities = (!country || country === "ANGOLA")
    ? [...ANGOLA_PROVINCES]
    : [];

  const dbCities = sellersWithActiveListings
    .filter((s) => !country || s.country === country)
    .map((s) => s.city);

  const mergedCities = [...new Set([...baseCities, ...dbCities])].sort((a, b) =>
    a.localeCompare(b, "pt")
  );

  return {
    countries: [...countrySet].map((value) => ({ value, label: COUNTRY_LABEL[value] })),
    cities: mergedCities,
  };
}

