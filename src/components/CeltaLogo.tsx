interface CeltaLogoProps {
  className?: string;
  size?: number;
}

export function CeltaLogo({ className = '', size = 40 }: CeltaLogoProps) {
  return (
    <svg
      id="celta-vigo-emblem"
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}
    >
      {/* Outer Shield with Red Border */}
      <path
        d="M50 8 C80 8 92 20 92 50 C92 88 50 114 50 114 C50 114 8 88 8 50 C8 20 20 8 50 8 Z"
        fill="#FFFFFF"
        stroke="#E5252A"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Inner Red Accent Line */}
      <path
        d="M50 18 C73 18 83 28 83 50 C83 80 50 103 50 103 C50 103 17 80 17 50 C17 28 27 18 50 18 Z"
        fill="#FFF5F5"
        stroke="#E5252A"
        strokeWidth="2"
      />
      {/* Athletic Diagonal Stripe */}
      <path
        d="M20 35 L75 95 L83 85 L30 25 Z"
        fill="#E5252A"
        opacity="0.25"
      />
      {/* Stylized Santiago Cross in Red */}
      {/* Vertical blade */}
      <path
        d="M50 24 L50 96"
        stroke="#E5252A"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Crossbar */}
      <path
        d="M32 44 L68 44"
        stroke="#E5252A"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Crossbar fleur accents */}
      <circle cx="30" cy="44" r="5" fill="#E5252A" />
      <circle cx="70" cy="44" r="5" fill="#E5252A" />
      {/* Top fleur circle */}
      <circle cx="50" cy="24" r="5" fill="#E5252A" />
      {/* Sword tip pointing down */}
      <polygon points="45,94 55,94 50,102" fill="#E5252A" />
    </svg>
  );
}
