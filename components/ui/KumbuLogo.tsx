import React from "react";

interface KumbuLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  variant?: "horizontal" | "vertical" | "icon-only";
  theme?: "light" | "dark";
}

export function KumbuIcon({ className = "size-8", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="KUMBU Ícone"
      {...props}
    >
      <defs>
        {/* Gradiente Amarelo Sol */}
        <linearGradient id="kumbu-yellow-stem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC837" />
          <stop offset="50%" stopColor="#FFB020" />
          <stop offset="100%" stopColor="#F57C00" />
        </linearGradient>

        <linearGradient id="kumbu-yellow-leg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB82E" />
          <stop offset="100%" stopColor="#E67E00" />
        </linearGradient>

        {/* Gradiente Verde Amazônia */}
        <linearGradient id="kumbu-green-arm" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0B5D3B" />
          <stop offset="60%" stopColor="#0F7A4D" />
          <stop offset="100%" stopColor="#199963" />
        </linearGradient>

        <filter id="kumbu-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Braço Superior (Verde Amazônia) */}
      <path
        d="M 44 48 L 72 17 C 74.5 14 78.5 13 82 15 C 85 17 86.5 20.5 85 24 L 62 55 L 44 48 Z"
        fill="url(#kumbu-green-arm)"
      />

      {/* Perna Inferior (Amarelo Sol) */}
      <path
        d="M 46 45 L 61 34 L 84 76 C 86.5 80.5 83.5 86 78 86 L 62 86 C 58.5 86 55.5 84 53.5 81 L 46 45 Z"
        fill="url(#kumbu-yellow-leg)"
      />

      {/* Haste Vertical do K (Amarelo Sol) */}
      <rect
        x="16"
        y="14"
        width="23"
        height="72"
        rx="10"
        fill="url(#kumbu-yellow-stem)"
        filter="url(#kumbu-shadow)"
      />
    </svg>
  );
}

export function KumbuLogo({
  className = "",
  size = "md",
  showTagline = true,
  variant = "horizontal",
  theme = "light",
}: KumbuLogoProps) {
  const isDark = theme === "dark";
  const textColor = isDark ? "text-white" : "text-[#0B1F17]";
  const taglineColor = isDark ? "text-slate-300" : "text-slate-600";

  const iconSizes = {
    sm: "size-7",
    md: "size-10",
    lg: "size-14",
    xl: "size-20",
  };

  const textSizes = {
    sm: "text-lg tracking-wider",
    md: "text-2xl tracking-wider",
    lg: "text-3xl tracking-wider",
    xl: "text-5xl tracking-widest",
  };

  const taglineSizes = {
    sm: "text-[9px] tracking-widest",
    md: "text-[10px] tracking-[0.2em]",
    lg: "text-xs tracking-[0.22em]",
    xl: "text-sm tracking-[0.25em]",
  };

  if (variant === "icon-only") {
    return <KumbuIcon className={`${iconSizes[size]} ${className}`} />;
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <KumbuIcon className={iconSizes[size]} />
        <span className={`mt-2 font-black ${textSizes[size]} ${textColor} font-sans uppercase`}>
          KUMBU
        </span>
        {showTagline && (
          <span className={`mt-1 font-semibold ${taglineSizes[size]} ${taglineColor} uppercase`}>
            COMPARA. POUPA. ESCOLHE MELHOR.
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <KumbuIcon className={iconSizes[size]} />
      <div className="flex flex-col">
        <span className={`font-black leading-none ${textSizes[size]} ${textColor} font-sans uppercase`}>
          KUMBU
        </span>
        {showTagline && (
          <span className={`mt-1 font-bold leading-none ${taglineSizes[size]} ${taglineColor} uppercase`}>
            COMPARA. POUPA. ESCOLHE MELHOR.
          </span>
        )}
      </div>
    </div>
  );
}
