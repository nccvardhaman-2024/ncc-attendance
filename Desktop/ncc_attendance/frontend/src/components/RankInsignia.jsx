import React from 'react';

export default function RankInsignia({ rank, className = 'w-16 h-16' }) {
  const normalizedRank = (rank || '').toLowerCase().trim();

  // Common colors
  const redBase = '#D8232A';
  const goldMetal = '#F59E0B';
  const darkNavy = '#0F172A';
  const greenBase = '#14532D';

  // Render SVG based on rank
  switch (normalizedRank) {
    case 'junior under officer':
    case 'juo':
      // Red shoulder slide with 1 gold horizontal bar
      return (
        <svg viewBox="0 0 90 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shoulder slide base */}
          <rect x="5" y="5" width="80" height="120" rx="6" fill={redBase} stroke={goldMetal} strokeWidth="3" />
          
          {/* Gold Bar */}
          <rect x="15" y="55" width="60" height="10" rx="1" fill={goldMetal} />
          
          {/* Metal mini star or dot at top */}
          <circle cx="45" cy="20" r="5" fill={goldMetal} />
          <path d="M45 12 L48 18 H42 L45 12Z" fill={goldMetal} />
          
          <text x="45" y="112" fill={goldMetal} fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">J.U.O.</text>
        </svg>
      );

    case 'company quarter master sergeant':
    case 'cqms':
      // Three Red chevrons with a gold key above
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="90" height="110" rx="10" fill={darkNavy} stroke={goldMetal} strokeWidth="2" />
          <path d="M20 30 L50 60 L80 30" stroke={redBase} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 48 L50 78 L80 48" stroke={redBase} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 66 L50 96 L80 66" stroke={redBase} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          {/* Key Symbol */}
          <circle cx="50" cy="18" r="4" stroke={goldMetal} strokeWidth="2" />
          <line x1="50" y1="22" x2="50" y2="28" stroke={goldMetal} strokeWidth="2" />
          <line x1="50" y1="25" x2="54" y2="25" stroke={goldMetal} strokeWidth="2" />
          <line x1="50" y1="28" x2="54" y2="28" stroke={goldMetal} strokeWidth="2" />
          <text x="50" y="112" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">CQMS</text>
        </svg>
      );

    case 'company sergeant major':
    case 'csm':
      // Three Red chevrons with a gold star/badge above
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="90" height="110" rx="10" fill={darkNavy} stroke={goldMetal} strokeWidth="2" />
          <path d="M20 30 L50 60 L80 30" stroke={redBase} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 48 L50 78 L80 48" stroke={redBase} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 66 L50 96 L80 66" stroke={redBase} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          {/* Star/Crown style badge */}
          <path d="M50 10 L53 18 L61 18 L55 23 L57 31 L50 26 L43 31 L45 23 L39 18 L47 18 Z" fill={goldMetal} />
          <text x="50" y="112" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">CSM</text>
        </svg>
      );

    case 'lance corporal':
      // One Red chevron pointing down
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="90" height="110" rx="10" fill={darkNavy} stroke={goldMetal} strokeWidth="2" />
          <path d="M20 40 L50 70 L80 40" stroke={redBase} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <text x="50" y="100" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">L/CPL</text>
        </svg>
      );

    case 'corporal':
      // Two Red chevrons pointing down
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="90" height="110" rx="10" fill={darkNavy} stroke={goldMetal} strokeWidth="2" />
          <path d="M20 30 L50 60 L80 30" stroke={redBase} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 50 L50 80 L80 50" stroke={redBase} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <text x="50" y="105" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">CPL</text>
        </svg>
      );

    case 'sergeant':
      // Three Red chevrons pointing down
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="90" height="110" rx="10" fill={darkNavy} stroke={goldMetal} strokeWidth="2" />
          <path d="M20 25 L50 55 L80 25" stroke={redBase} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 43 L50 73 L80 43" stroke={redBase} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 61 L50 91 L80 61" stroke={redBase} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <text x="50" y="110" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">SGT</text>
        </svg>
      );

    case 'cadet under officer':
    case 'under officer':
    case 'cuo':
      // Red shoulder slide with 2 gold horizontal bars
      return (
        <svg viewBox="0 0 90 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shoulder slide base */}
          <rect x="5" y="5" width="80" height="120" rx="6" fill={redBase} stroke={goldMetal} strokeWidth="3" />
          
          {/* Gold Bars */}
          <rect x="15" y="45" width="60" height="10" rx="1" fill={goldMetal} />
          <rect x="15" y="65" width="60" height="10" rx="1" fill={goldMetal} />
          
          {/* Metal mini star or dot at top */}
          <circle cx="45" cy="20" r="5" fill={goldMetal} />
          <path d="M45 12 L48 18 H42 L45 12Z" fill={goldMetal} />
          
          <text x="45" y="112" fill={goldMetal} fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">C.U.O.</text>
        </svg>
      );

    case 'cadet senior under officer':
    case 'senior under officer':
    case 'csuo':
      // Red shoulder slide with 3 gold horizontal bars
      return (
        <svg viewBox="0 0 90 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shoulder slide base */}
          <rect x="5" y="5" width="80" height="120" rx="6" fill={redBase} stroke={goldMetal} strokeWidth="3" />
          
          {/* Gold Bars */}
          <rect x="15" y="35" width="60" height="10" rx="1" fill={goldMetal} />
          <rect x="15" y="55" width="60" height="10" rx="1" fill={goldMetal} />
          <rect x="15" y="75" width="60" height="10" rx="1" fill={goldMetal} />
          
          {/* Metal mini star or dot at top */}
          <circle cx="45" cy="18" r="5" fill={goldMetal} />
          
          <text x="45" y="112" fill={goldMetal} fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1.2">C.S.U.O.</text>
        </svg>
      );

    case 'ano':
    case 'ano (associate ncc officer)':
    case 'associate ncc officer':
    case 'lieutenant':
    case 'admin':
      // ANO shoulder slide: Red base with a gold star and A.N.O. letters
      return (
        <svg viewBox="0 0 90 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shoulder slide base */}
          <rect x="5" y="5" width="80" height="120" rx="6" fill={redBase} stroke={goldMetal} strokeWidth="3" />
          
          {/* Gold Star (Lieutenant style) */}
          <path d="M45 35 L48 44 L57 44 L50 50 L53 59 L45 53 L37 59 L40 50 L33 44 L42 44 Z" fill={goldMetal} stroke={goldMetal} strokeWidth="1" />
          <path d="M45 65 L48 74 L57 74 L50 80 L53 89 L45 83 L37 89 L40 80 L33 74 L42 74 Z" fill={goldMetal} stroke={goldMetal} strokeWidth="1" />

          {/* Button at top */}
          <circle cx="45" cy="18" r="4.5" fill={goldMetal} />
          
          <text x="45" y="112" fill={goldMetal} fontSize="12" fontWeight="extrabold" textAnchor="middle" letterSpacing="1.5">A.N.O.</text>
        </svg>
      );

    case 'cadet':
    default:
      // Entry rank: Cadet
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="90" height="110" rx="10" fill={darkNavy} stroke="#64748B" strokeWidth="2" />
          {/* Golden NCC Circular logo shape */}
          <circle cx="50" cy="50" r="24" stroke={goldMetal} strokeWidth="3" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="16" fill={redBase} />
          <text x="50" y="54" fill="white" fontSize="11" fontWeight="extrabold" textAnchor="middle">CDT</text>
          <text x="50" y="100" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="2">CADET</text>
        </svg>
      );
  }
}
