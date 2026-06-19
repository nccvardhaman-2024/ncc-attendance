import React from 'react';

export default function BeretIcon({ className = 'w-12 h-12', color = '#14532D' }) {
  return (
    <svg viewBox="0 0 120 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Red Hackle (Feather plume) - rises up from the left side */}
      <path
        d="M28 35 C 24 10, 36 2, 38 5 C 42 12, 32 30, 33 42 C 34 50, 27 50, 28 35"
        fill="#D8232A"
        stroke="#B91C1C"
        strokeWidth="0.5"
      />
      <path
        d="M32 30 C 29 18, 38 12, 39 14 C 40 20, 34 32, 34 38"
        fill="#EF4444"
      />

      {/* Main Beret fabric fold */}
      {/* Crown of the beret, tilted and draping to the right */}
      <path
        d="M 15 48 
           C 12 35, 30 20, 60 22 
           C 95 24, 110 32, 108 46 
           C 106 58, 92 65, 82 60 
           C 78 50, 72 48, 55 48
           C 35 48, 20 54, 15 48 Z"
        fill={color}
        stroke="#0F2F1D"
        strokeWidth="1.5"
      />
      {/* Shadow layer on the fold to give 3D depth */}
      <path
        d="M 55 48 C 72 48, 78 50, 82 60 C 92 65, 106 58, 108 46 C 104 38, 88 32, 55 48 Z"
        fill="black"
        opacity="0.15"
      />

      {/* Leather/Cloth Headband (black border at the bottom) */}
      <path
        d="M 22 51 
           C 25 50, 35 48, 55 48 
           C 72 48, 77 50, 80 52
           C 80 56, 75 58, 55 58
           C 35 58, 25 56, 22 51 Z"
        fill="#1E293B"
        stroke="#0F172A"
        strokeWidth="1"
      />

      {/* Golden NCC Emblem Badge (positioned over the hackle on the left) */}
      <circle cx="33" cy="46" r="6" fill="#0F172A" stroke="#F59E0B" strokeWidth="1" />
      {/* Mini gold star or crest emblem details */}
      <path d="M33 42 L34.5 45.5 H38 L35 47.5 L36.5 51 L33 49 L29.5 51 L31 47.5 L28 45.5 H31.5 Z" fill="#F59E0B" />
      
      {/* Subtle details on the band */}
      <line x1="28" y1="52" x2="38" y2="52" stroke="#475569" strokeWidth="1" />
    </svg>
  );
}
