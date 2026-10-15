export const countries = [
  "ANGOLA",
  "MOZAMBIQUE",
  "SOUTH_AFRICA",
  "KENYA",
  "NIGERIA",
  "GHANA",
  "UGANDA",
  "TANZANIA",
  "ZAMBIA",
  "ZIMBABWE",
  "BOTSWANA",
] as const;

export type CountryCode = (typeof countries)[number];

export const COUNTRY_LABEL: Record<CountryCode, string> = {
  ANGOLA: "Angola",
  MOZAMBIQUE: "Moçambique",
  SOUTH_AFRICA: "África do Sul",
  KENYA: "Quénia",
  NIGERIA: "Nigéria",
  GHANA: "Gana",
  UGANDA: "Uganda",
  TANZANIA: "Tanzânia",
  ZAMBIA: "Zâmbia",
  ZIMBABWE: "Zimbábue",
  BOTSWANA: "Botsuana",
};

export function isCountryCode(value: string): value is CountryCode {
  return (countries as readonly string[]).includes(value);
}

// Moeda principal em circulação no retalho para cada país
export const CURRENCY_BY_COUNTRY: Record<CountryCode, string> = {
  ANGOLA: "AOA",
  MOZAMBIQUE: "MZN",
  SOUTH_AFRICA: "ZAR",
  KENYA: "KES",
  NIGERIA: "NGN",
  GHANA: "GHS",
  UGANDA: "UGX",
  TANZANIA: "TZS",
  ZAMBIA: "ZMW",
  ZIMBABWE: "USD",
  BOTSWANA: "BWP",
};

// 18 Províncias de Angola
export const ANGOLA_PROVINCES = [
  "Bengo",
  "Benguela",
  "Bié",
  "Cabinda",
  "Cuando Cubango",
  "Cuanza Norte",
  "Cuanza Sul",
  "Cunene",
  "Huambo",
  "Huíla",
  "Luanda",
  "Lunda Norte",
  "Lunda Sul",
  "Malanje",
  "Moxico",
  "Namibe",
  "Uíge",
  "Zaire",
] as const;

export type AngolaProvince = (typeof ANGOLA_PROVINCES)[number];

