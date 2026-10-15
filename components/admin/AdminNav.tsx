import Link from "next/link";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/admin", label: "Visão Geral" },
  { href: "/admin/flags", label: "Denúncias e Sinalizações" },
  { href: "/admin/sellers", label: "Comerciantes" },
  { href: "/admin/users", label: "Utilizadores" },
] as const;

export function AdminNav({ active }: { active: (typeof TABS)[number]["href"] }) {
  return (
    <nav className="flex gap-1 border-b border-border">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "border-b-2 px-3 py-2.5 text-sm font-medium",
            active === tab.href
              ? "border-green-600 text-green-600"
              : "border-transparent text-slate-600 hover:text-ink-900",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
