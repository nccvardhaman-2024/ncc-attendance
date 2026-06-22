import React from 'react';
import emblemImg from '../assets/Emblem.png';

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
      // Three Red chevrons with a small emblem above
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="90" height="110" rx="10" fill={darkNavy} stroke={goldMetal} strokeWidth="2" />
          
          {/* Chevrons */}
          <path d="M22 50 L50 74 L78 50" stroke={redBase} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 65 L50 89 L78 65" stroke={redBase} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 80 L50 104 L78 80" stroke={redBase} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Small Indian National Emblem Image at the top */}
          <image href={emblemImg} x="35" y="8" width="30" height="40" />
          
          <text x="50" y="112" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">CQMS</text>
        </svg>
      );

    case 'company sergeant major':
    case 'csm':
      // Indian National Emblem on a premium black strip (gold border)
      return (
        <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Premium Black Fabric Slide Base */}
          <rect x="5" y="5" width="90" height="110" rx="10" fill="#0A0A0A" stroke={goldMetal} strokeWidth="2.5" />
          
          {/* Indian National Emblem Image */}
          <image href={emblemImg} x="20" y="15" width="60" height="80" />
          
          <text x="50" y="112" fill={goldMetal} fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1">CSM</text>
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
    case 'suo':
      // Red shoulder slide with 2 gold horizontal bars (modified to 2 lines per instructions)
      return (
        <svg viewBox="0 0 90 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shoulder slide base */}
          <rect x="5" y="5" width="80" height="120" rx="6" fill={redBase} stroke={goldMetal} strokeWidth="3" />
          
          {/* Gold Bars (2 lines now) */}
          <rect x="15" y="45" width="60" height="10" rx="1" fill={goldMetal} />
          <rect x="15" y="65" width="60" height="10" rx="1" fill={goldMetal} />
          
          {/* Metal mini star or dot at top */}
          <circle cx="45" cy="18" r="5" fill={goldMetal} />
          
          <text x="45" y="112" fill={goldMetal} fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1.2">S.U.O.</text>
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
