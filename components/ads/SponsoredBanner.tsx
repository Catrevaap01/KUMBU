import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export type SponsoredPartner = {
  id: string;
  partnerName: string;
  tagline: string;
  category: string;
  promoText: string;
  linkUrl: string;
  location: string;
};

const DEFAULT_SPONSORS: SponsoredPartner[] = [
  {
    id: "sp-1",
    partnerName: "Rede de Grossistas do Kikolo & São Paulo",
    tagline: "Preços de Cesta Básica Direto dos Armazéns Grossistas",
    category: "Armazém Grossista & Distribuição",
    promoText: "Sacos de Arroz 25kg, Fuba de Milho e Caixas de Óleo com até 35% de desconto para compras em quantidade.",
    linkUrl: "/search?q=Arroz",
    location: "Luanda, Angola",
  },
  {
    id: "sp-2",
    partnerName: "Campanha Óleo Vegetal Palanca & Solange 5L",
    tagline: "Qualidade Nacional Certificada para a Sua Família",
    category: "Bens de Consumo · Óleos Alimentares",
    promoText: "Compare os preços praticados pelas lojas oficiais e poupe no essencial do mês.",
    linkUrl: "/search?q=%C3%93leo",
    location: "Todas as Províncias",
  },
];

export function SponsoredBanner({
  sponsor = DEFAULT_SPONSORS[0],
  className = "",
}: {
  sponsor?: SponsoredPartner;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 p-5 shadow-sm transition hover:shadow-md ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge tone="accent" dot className="!text-[10px] font-bold tracking-wider uppercase">
              Patrocinado · Destaque Comercial
            </Badge>
            <span className="text-xs text-slate-500 font-medium">{sponsor.location}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-ink-900">
            {sponsor.partnerName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700">
            {sponsor.promoText}
          </p>
        </div>

        <Link
          href={sponsor.linkUrl}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-ink-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-ink-800"
        >
          Consultar Ofertas →
        </Link>
      </div>
    </div>
  );
}
