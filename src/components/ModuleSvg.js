/**
 * High-precision architectural vector blueprints (Classic Corporate Blue & White Aesthetic)
 */

export default function ModuleSvg({ type, className = "" }) {
  const strokeColor = "#334155"; // Slate-700 technical line
  const accentBlue = "#2563eb";  // Corporate primary blue
  const softBlue = "#93c5fd";
  const fillColor = "rgba(37, 99, 235, 0.04)";

  switch (type) {
    case 'cabinet_upper_single':
      return (
        <svg viewBox="0 0 200 240" className={className} style={{ width: '100%', height: '100%' }}>
          {/* Subtle technical corner marks */}
          <line x1="25" y1="20" x2="35" y2="20" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="25" y1="20" x2="25" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="175" y1="20" x2="165" y2="20" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="175" y1="20" x2="175" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Cabinet body */}
          <rect x="40" y="25" width="120" height="185" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" rx="2" />
          <line x1="40" y1="90" x2="160" y2="90" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="40" y1="150" x2="160" y2="150" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
          
          {/* Blue handle */}
          <circle cx="145" cy="115" r="4" fill={accentBlue} />
          {/* Door opening trace */}
          <path d="M 40 25 L 160 115 L 40 210" fill="none" stroke="rgba(37, 99, 235, 0.25)" strokeDasharray="3 3" />
          <text x="100" y="230" fill={accentBlue} fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700">
            400×720×320 мм
          </text>
        </svg>
      );

    case 'cabinet_upper_double':
      return (
        <svg viewBox="0 0 200 240" className={className} style={{ width: '100%', height: '100%' }}>
          <rect x="25" y="25" width="150" height="185" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" rx="2" />
          <line x1="100" y1="25" x2="100" y2="210" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="25" y1="110" x2="175" y2="110" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
          
          <circle cx="90" cy="115" r="3.5" fill={accentBlue} />
          <circle cx="110" cy="115" r="3.5" fill={accentBlue} />
          
          <path d="M 25 25 L 100 115 L 25 210" fill="none" stroke="rgba(37, 99, 235, 0.2)" strokeDasharray="3 3" />
          <path d="M 175 25 L 100 115 L 175 210" fill="none" stroke="rgba(37, 99, 235, 0.2)" strokeDasharray="3 3" />
          <text x="100" y="230" fill={accentBlue} fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700">
            600×720×320 мм
          </text>
        </svg>
      );

    case 'cabinet_upper_dryer':
      return (
        <svg viewBox="0 0 200 240" className={className} style={{ width: '100%', height: '100%' }}>
          <rect x="20" y="25" width="160" height="185" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" rx="2" />
          <line x1="100" y1="25" x2="100" y2="210" stroke={strokeColor} strokeWidth="1.5" />
          {/* Dish rack grids */}
          <line x1="30" y1="100" x2="170" y2="100" stroke={accentBlue} strokeWidth="1.2" />
          <line x1="30" y1="165" x2="170" y2="165" stroke={accentBlue} strokeWidth="1.2" />
          <path d="M 45 95 Q 60 72 75 95" fill="none" stroke={softBlue} strokeWidth="1.5" />
          <path d="M 80 95 Q 95 72 110 95" fill="none" stroke={softBlue} strokeWidth="1.5" />
          <path d="M 115 95 Q 130 72 145 95" fill="none" stroke={softBlue} strokeWidth="1.5" />
          
          <circle cx="90" cy="115" r="3.5" fill={accentBlue} />
          <circle cx="110" cy="115" r="3.5" fill={accentBlue} />
          <text x="100" y="230" fill={accentBlue} fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700">
            800×720×320 [СУШКА]
          </text>
        </svg>
      );

    case 'cabinet_upper_lift':
      return (
        <svg viewBox="0 0 200 240" className={className} style={{ width: '100%', height: '100%' }}>
          <rect x="25" y="60" width="150" height="110" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" rx="2" />
          <line x1="60" y1="150" x2="140" y2="150" stroke={accentBlue} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 25 60 L 100 170 L 175 60" fill="none" stroke="rgba(37, 99, 235, 0.3)" strokeDasharray="3 3" />
          <text x="100" y="200" fill={accentBlue} fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700">
            600×360×320 [AVENTOS]
          </text>
        </svg>
      );

    case 'cabinet_lower_single':
      return (
        <svg viewBox="0 0 200 240" className={className} style={{ width: '100%', height: '100%' }}>
          <rect x="40" y="25" width="120" height="165" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" rx="2" />
          <line x1="40" y1="100" x2="160" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
          {/* Feet */}
          <rect x="52" y="190" width="12" height="22" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <rect x="136" y="190" width="12" height="22" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <circle cx="145" cy="55" r="4" fill={accentBlue} />
          <text x="100" y="232" fill={accentBlue} fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700">
            400×820×560 мм
          </text>
        </svg>
      );

    case 'cabinet_lower_double':
      return (
        <svg viewBox="0 0 200 240" className={className} style={{ width: '100%', height: '100%' }}>
          <rect x="25" y="25" width="150" height="165" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" rx="2" />
          <line x1="100" y1="25" x2="100" y2="190" stroke={strokeColor} strokeWidth="1.5" />
          <rect x="35" y="190" width="12" height="22" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <rect x="153" y="190" width="12" height="22" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <circle cx="90" cy="55" r="3.5" fill={accentBlue} />
          <circle cx="110" cy="55" r="3.5" fill={accentBlue} />
          <text x="100" y="232" fill={accentBlue} fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700">
            600×820×560 мм
          </text>
        </svg>
      );

    case 'cabinet_lower_drawers3':
      return (
        <svg viewBox="0 0 200 240" className={className} style={{ width: '100%', height: '100%' }}>
          <rect x="40" y="25" width="120" height="165" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" rx="2" />
          <line x1="40" y1="65" x2="160" y2="65" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="40" y1="125" x2="160" y2="125" stroke={strokeColor} strokeWidth="1.5" />
          
          {/* Drawer handles */}
          <line x1="75" y1="45" x2="125" y2="45" stroke={accentBlue} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="75" y1="95" x2="125" y2="95" stroke={accentBlue} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="75" y1="155" x2="125" y2="155" stroke={accentBlue} strokeWidth="2.5" strokeLinecap="round" />
          
          <rect x="52" y="190" width="12" height="22" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <rect x="136" y="190" width="12" height="22" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <text x="100" y="232" fill={accentBlue} fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700">
            400×820×560 [3 ЯЩИКА]
          </text>
        </svg>
      );

    case 'cabinet_lower_drawers2':
      return (
        <svg viewBox="0 0 200 240" className={className} style={{ width: '100%', height: '100%' }}>
          <rect x="25" y="25" width="150" height="165" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" rx="2" />
          <line x1="25" y1="105" x2="175" y2="105" stroke={strokeColor} strokeWidth="1.5" />
          
          <line x1="70" y1="60" x2="130" y2="60" stroke={accentBlue} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="70" y1="145" x2="130" y2="145" stroke={accentBlue} strokeWidth="2.5" strokeLinecap="round" />
          
          <rect x="35" y="190" width="12" height="22" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <rect x="153" y="190" width="12" height="22" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <text x="100" y="232" fill={accentBlue} fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700">
            600×820×560 [2 ЯЩИКА]
          </text>
        </svg>
      );

    case 'cabinet_lower_sink':
      return (
        <svg viewBox="0 0 200 240" className={className} style={{ width: '100%', height: '100%' }}>
          <rect x="25" y="25" width="150" height="165" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" rx="2" />
          <line x1="100" y1="25" x2="100" y2="190" stroke={strokeColor} strokeWidth="1.5" />
          {/* Sink faucet icon */}
          <path d="M 85 45 Q 100 25 115 45" fill="none" stroke={accentBlue} strokeWidth="2" />
          <circle cx="90" cy="70" r="3.5" fill={accentBlue} />
          <circle cx="110" cy="70" r="3.5" fill={accentBlue} />
          <rect x="35" y="190" width="12" height="22" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <rect x="153" y="190" width="12" height="22" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <text x="100" y="232" fill={accentBlue} fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700">
            600×820×560 [МОЙКА]
          </text>
        </svg>
      );

    case 'cabinet_tall_oven':
      return (
        <svg viewBox="0 0 200 240" className={className} style={{ width: '100%', height: '100%' }}>
          <rect x="35" y="10" width="130" height="195" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" rx="2" />
          <rect x="42" y="45" width="116" height="40" fill="rgba(37,99,235,0.06)" stroke={accentBlue} strokeWidth="1.2" rx="2" />
          <rect x="42" y="90" width="116" height="55" fill="rgba(37,99,235,0.08)" stroke={accentBlue} strokeWidth="1.2" rx="2" />
          <circle cx="100" cy="117" r="14" fill="none" stroke="#2563eb" strokeWidth="1.5" />
          <line x1="75" y1="175" x2="125" y2="175" stroke={accentBlue} strokeWidth="2.5" strokeLinecap="round" />
          <text x="100" y="235" fill={accentBlue} fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700">
            600×2040×560 [ДУХОВКА]
          </text>
        </svg>
      );

    case 'cabinet_tall_fridge':
      return (
        <svg viewBox="0 0 200 240" className={className} style={{ width: '100%', height: '100%' }}>
          <rect x="35" y="10" width="130" height="195" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" rx="2" />
          <line x1="35" y1="135" x2="165" y2="135" stroke={strokeColor} strokeWidth="1.8" />
          <line x1="145" y1="70" x2="145" y2="110" stroke={accentBlue} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="145" y1="150" x2="145" y2="175" stroke={accentBlue} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="198" x2="150" y2="198" stroke={accentBlue} strokeWidth="1" strokeDasharray="3 2" />
          <text x="100" y="235" fill={accentBlue} fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700">
            600×2040×560 [ХОЛОДИЛЬНИК]
          </text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 200 240" className={className} style={{ width: '100%', height: '100%' }}>
          <rect x="35" y="20" width="130" height="180" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" rx="2" />
          <line x1="35" y1="110" x2="165" y2="110" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="145" cy="110" r="4" fill={accentBlue} />
          <text x="100" y="225" fill={accentBlue} fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700">МОДУЛЬ</text>
        </svg>
      );
  }
}
