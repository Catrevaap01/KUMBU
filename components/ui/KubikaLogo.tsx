import React from "react";

interface KubikaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  variant?: "horizontal" | "vertical" | "icon-only" | "app-icon";
  theme?: "light" | "dark" | "monochrome-dark" | "monochrome-light";
}

/**
 * Ícone oficial KUBIKA
 * Letra 'K' estilizada onde a perna inferior é uma etiqueta de preço (tag) com furo circular.
 */
export function KubikaIcon({
  className = "size-8",
  theme = "light",
  ...props
}: React.SVGProps<SVGSVGElement> & { theme?: "light" | "dark" | "monochrome-dark" | "monochrome-light" }) {
  const isMonoDark = theme === "monochrome-dark";
  const isMonoLight = theme === "monochrome-light";

  const stemFill = isMonoDark ? "#0B0B0D" : isMonoLight ? "#FBFAFC" : "url(#kubika-orange-grad)";
  const armFill = isMonoDark ? "#0B0B0D" : isMonoLight ? "#FBFAFC" : "url(#kubika-orange-grad)";
  const tagFill = isMonoDark ? "#0B0B0D" : isMonoLight ? "#FBFAFC" : "url(#kubika-orange-tag)";

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="KUBIKA Ícone"
      {...props}
    >
      <defs>
        {/* Laranja Primário KUBIKA com brilho sutil */}
        <linearGradient id="kubika-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA12E" />
          <stop offset="100%" stopColor="#FF7A00" />
        </linearGradient>

        <linearGradient id="kubika-orange-tag" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9514" />
          <stop offset="100%" stopColor="#E66E00" />
        </linearGradient>

        {/* Máscara para o furo da etiqueta de preço (transparent hole) */}
        <mask id="kubika-tag-hole-mask">
          <rect width="100" height="100" fill="white" />
          {/* Furo circular na cabeça da etiqueta */}
          <circle cx="68" cy="67" r="4.2" fill="black" />
        </mask>
      </defs>

      {/* 1. Haste Vertical Esquerda (Pill / Cápsula) */}
      <rect
        x="15"
        y="12"
        width="22"
        height="76"
        rx="10"
        fill={stemFill}
      />

      {/* 2. Braço Superior Direito */}
      <path
        d="M 42 49 L 69 16 C 71.5 13 75.5 12 79 13.5 C 82.5 15 84.5 18.5 83.5 22 L 57 56 Z"
        fill={armFill}
      />

      {/* 3. Braço Inferior Direito (Etiqueta de Preço com Furo) */}
      <path
        d="M 45 46 L 59 34 L 84 62 C 86 64.5 87 67.5 87 71 C 87 77.5 81.5 83 75 83 C 71.5 83 68.5 81.5 66 79 L 45 46 Z"
        fill={tagFill}
        mask="url(#kubika-tag-hole-mask)"
      />
    </svg>
  );
}

/**
 * Ícone da Aplicação KUBIKA (Squircle Escuro #0B0B0D com K Laranja)
 */
export function KubikaAppIcon({ className = "size-12", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="KUBIKA App Icon"
      {...props}
    >
      <rect width="100" height="100" rx="24" fill="#0B0B0D" />
      <g transform="translate(6, 6) scale(0.88)">
        <KubikaIcon />
      </g>
    </svg>
  );
}

/**
 * Logotipo Completo KUBIKA
 * Inclui o símbolo, o lettering estilizado KUBIKΛ e o slogan "COMPARA. POUPA. ESCOLHE MELHOR."
 */
export function KubikaLogo({
  className = "",
  size = "md",
  showTagline = true,
  variant = "horizontal",
  theme = "light",
}: KubikaLogoProps) {
  const isDark = theme === "dark";
  const textColor = isDark ? "text-[#FBFAFC]" : "text-[#0B0B0D]";
  const taglineColor = isDark ? "text-[#A0A8B4]" : "text-[#687280]";

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
    sm: "text-[8px] tracking-[0.2em]",
    md: "text-[9.5px] tracking-[0.22em]",
    lg: "text-xs tracking-[0.24em]",
    xl: "text-sm tracking-[0.26em]",
  };

  if (variant === "app-icon") {
    return <KubikaAppIcon className={`${iconSizes[size]} ${className}`} />;
  }

  if (variant === "icon-only") {
    return <KubikaIcon className={`${iconSizes[size]} ${className}`} theme={theme} />;
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <KubikaIcon className={iconSizes[size]} theme={theme} />
        <span className={`mt-2 font-black ${textSizes[size]} ${textColor} font-sans uppercase tracking-widest`}>
          KUBIKA
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
      <KubikaIcon className={iconSizes[size]} theme={theme} />
      <div className="flex flex-col">
        <div className={`flex items-baseline font-black leading-none ${textSizes[size]} ${textColor} font-sans uppercase tracking-widest`}>
          <span>KUBIK</span>
          <span className="text-[#FF8A00]">A</span>
        </div>
        {showTagline && (
          <span className={`mt-1 font-bold leading-none ${taglineSizes[size]} ${taglineColor} uppercase`}>
            COMPARA. POUPA. ESCOLHE MELHOR.
          </span>
        )}
      </div>
    </div>
  );
}

// Compatibilidade retroativa para imports existentes de KumbuLogo
export const KumbuLogo = KubikaLogo;
export const KumbuIcon = KubikaIcon;
