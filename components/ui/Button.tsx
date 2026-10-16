import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "brand-dark";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF8A00]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#FF8A00] text-white shadow-sm shadow-[#FF8A00]/25 hover:bg-[#E67A00] hover:shadow-md hover:shadow-[#FF8A00]/30 font-bold",
  secondary: "bg-[#0B0B0D] text-white shadow-sm hover:bg-[#1E1F24]",
  "brand-dark": "bg-[#0B0B0D] text-white hover:bg-[#1E1F24] border border-white/10",
  ghost:
    "border border-border text-[#0B0B0D] hover:border-[#FF8A00]/40 hover:bg-[#FF8A00]/5 hover:text-[#FF8A00]",
  danger: "bg-red-600 text-white shadow-sm shadow-red-600/25 hover:bg-red-500",
};

type ButtonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href">)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">)
);

export function Button({ variant = "primary", className, children, href, ...rest }: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <Link
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
