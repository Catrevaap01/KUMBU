// Normalização determinística de nomes de produtos para pesquisa em português e inglês

const NUMBER_WORDS: Record<string, string> = {
  um: "1",
  uma: "1",
  dois: "2",
  duas: "2",
  tres: "3",
  quatro: "4",
  cinco: "5",
  seis: "6",
  sete: "7",
  oito: "8",
  nove: "9",
  dez: "10",
  vinte: "20",
  vintecinco: "25",
  cinquenta: "50",
  // Fallbacks em inglês
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
  twenty: "20",
};

const UNIT_PATTERNS: Array<[RegExp, string]> = [
  [/(\d+)\s*(litros|litro|litres|liters|litre|liter|l)\b/g, "$1l"],
  [/(\d+)\s*(quilogramas|quilograma|quilos|quilo|kilograms|kilogram|kilos|kilo|kg)\b/g, "$1kg"],
  [/(\d+)\s*(gramas|grama|grams|gram|g)\b/g, "$1g"],
  [/(\d+)\s*(mililitros|mililitro|ml)\b/g, "$1ml"],
];

export function normalizeProductName(raw: string): string {
  let normalized = raw.toLowerCase().trim();
  // Remove acentos (ex: óleo -> oleo, feijão -> feijao)
  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  normalized = normalized.replace(/[^a-z0-9\s]/g, " ");
  normalized = normalized.replace(/\s+/g, " ").trim();

  normalized = normalized
    .split(" ")
    .map((token) => NUMBER_WORDS[token] ?? token)
    .join(" ");

  for (const [pattern, replacement] of UNIT_PATTERNS) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized.replace(/\s+/g, " ").trim();
}

export function searchTokensOf(query: string): string[] {
  return normalizeProductName(query).split(" ").filter(Boolean);
}
