// Ilustração do topo: um consultório calmo, com janela para o amanhecer.
const folhas = [
  [0, -20, -32], [12, -46, -8], [-14, -54, -40], [8, -78, 10], [-10, -84, -22],
  [20, -30, 24], [-22, -30, -58], [2, -104, -4],
];

export default function Ilustracao() {
  return (
    <svg
      className="ilustracao"
      viewBox="0 0 640 520"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Ilustração de um consultório com duas poltronas e uma janela"
    >
      <defs>
        <linearGradient id="il-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9cdb5" />
          <stop offset="1" stopColor="#fdeee3" />
        </linearGradient>
        <linearGradient id="il-parede" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6efe9" />
          <stop offset="1" stopColor="#efe4da" />
        </linearGradient>
        <clipPath id="il-janela">
          <path d="M210 330 V160 A110 110 0 0 1 430 160 V330 Z" />
        </clipPath>
        <ellipse id="il-folha" cx="0" cy="0" rx="11" ry="26" />
      </defs>

      {/* parede e piso */}
      <rect width="640" height="520" fill="url(#il-parede)" />
      <rect y="392" width="640" height="128" fill="#e3d3c4" />
      <rect y="392" width="640" height="6" fill="#d6c3b2" />

      {/* janela com vista */}
      <g clipPath="url(#il-janela)">
        <rect x="200" y="40" width="240" height="300" fill="url(#il-ceu)" />
        <circle cx="356" cy="236" r="34" fill="#fff6ee" />
        <path d="M200 268 Q270 228 330 254 T440 240 V340 H200 Z" fill="#a9bfdc" />
        <path d="M200 296 Q250 262 318 288 T440 276 V340 H200 Z" fill="#7f9dc8" />
        <path d="M200 318 Q290 296 360 314 T440 306 V340 H200 Z" fill="#5a7cb0" />
      </g>
      <path
        d="M210 330 V160 A110 110 0 0 1 430 160 V330"
        fill="none"
        stroke="#ffffff"
        strokeWidth="12"
      />
      <path d="M320 50 V330 M210 230 H430" stroke="#ffffff" strokeWidth="6" />
      <rect x="196" y="328" width="248" height="14" rx="4" fill="#ffffff" />
      <rect x="196" y="338" width="248" height="5" fill="#e4d7cb" />

      {/* tapete */}
      <ellipse cx="320" cy="462" rx="236" ry="40" fill="#f0b8a5" />
      <ellipse cx="320" cy="462" rx="196" ry="30" fill="none" stroke="#f8d6c9" strokeWidth="5" />

      {/* luminária */}
      <path d="M88 452 V170 Q88 136 124 136 H138" fill="none" stroke="#1f3a5f" strokeWidth="6" />
      <path d="M120 136 L172 136 L160 104 L132 104 Z" fill="#1f3a5f" />
      <ellipse cx="88" cy="454" rx="26" ry="6" fill="#1f3a5f" />
      <path d="M126 138 L104 330 L190 330 L166 138 Z" fill="#fff4e8" opacity="0.5" />

      {/* poltrona coral (esquerda) */}
      <ellipse cx="188" cy="470" rx="96" ry="12" fill="#cfa08f" opacity="0.6" />
      <rect x="114" y="300" width="138" height="120" rx="34" fill="#e8694c" />
      <rect x="114" y="300" width="20" height="120" rx="10" fill="#f2896f" />
      <rect x="104" y="376" width="168" height="62" rx="22" fill="#d65a3f" />
      <rect x="236" y="352" width="40" height="86" rx="18" fill="#e8694c" />
      <rect x="96" y="352" width="40" height="86" rx="18" fill="#f07b5f" />
      <path d="M118 438 l-8 30 M260 438 l8 30" stroke="#7a3a2b" strokeWidth="7" strokeLinecap="round" />

      {/* mesinha com xícara */}
      <ellipse cx="322" cy="472" rx="40" ry="6" fill="#cfa08f" opacity="0.6" />
      <rect x="290" y="404" width="64" height="10" rx="5" fill="#1f3a5f" />
      <path d="M302 414 L296 470 M342 414 L348 470" stroke="#1f3a5f" strokeWidth="5" strokeLinecap="round" />
      <rect x="310" y="384" width="22" height="20" rx="5" fill="#ffffff" />
      <path d="M332 390 q10 4 0 10" fill="none" stroke="#ffffff" strokeWidth="4" />
      <path d="M316 374 q4 -6 0 -12 M326 374 q4 -6 0 -12" stroke="#c9b6a6" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* poltrona azul (direita) */}
      <ellipse cx="456" cy="470" rx="96" ry="12" fill="#cfa08f" opacity="0.6" />
      <rect x="392" y="300" width="138" height="120" rx="34" fill="#2c4f7c" />
      <rect x="510" y="300" width="20" height="120" rx="10" fill="#244266" />
      <rect x="372" y="376" width="168" height="62" rx="22" fill="#24446c" />
      <rect x="368" y="352" width="40" height="86" rx="18" fill="#3a6194" />
      <rect x="508" y="352" width="40" height="86" rx="18" fill="#2c4f7c" />
      <path d="M384 438 l-8 30 M526 438 l8 30" stroke="#132740" strokeWidth="7" strokeLinecap="round" />

      {/* planta */}
      <g transform="translate(-26 0)">
      <g transform="translate(590 330)">
        {folhas.map(([x, y, angulo], i) => (
          <use
            key={i}
            href="#il-folha"
            transform={`translate(${x} ${y}) rotate(${angulo}) scale(${1 - i * 0.04})`}
            fill={i % 2 ? '#3f7d5c' : '#4f9470'}
          />
        ))}
        <path d="M0 0 V-90" stroke="#2f6247" strokeWidth="4" />
      </g>
      <path d="M560 330 H620 L610 400 H570 Z" fill="#1f3a5f" />
      <path d="M560 330 H620 L618 344 H562 Z" fill="#2c4f7c" />
      <ellipse cx="590" cy="404" rx="30" ry="5" fill="#cfa08f" opacity="0.6" />
      </g>
    </svg>
  );
}
