/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function CircularLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`${className} select-none shrink-0 transition-all duration-300`} id="corporate-vector-logo">
      {/* Outer Gold Boundary and Metallic Dark Forest Teal Circle */}
      <circle cx="50" cy="50" r="48" fill="#5c6e66" stroke="#fed136" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#fed136" strokeWidth="0.75" strokeDasharray="2 1" />
      
      {/* Invisible text paths */}
      <path id="logo-curve-top" d="M 12,50 A 38,38 0 0,1 88,50" fill="transparent" stroke="none" />
      <path id="logo-curve-bottom" d="M 88,50 A 38,38 0 0,1 12,50" fill="transparent" stroke="none" />

      {/* Curved Text "AZTA BEST CHOICE" around the top */}
      <text className="font-sans font-black text-[7px] uppercase tracking-[0.06em]" fill="#fed136">
        <textPath href="#logo-curve-top" startOffset="50%" textAnchor="middle">
          AZTA BEST CHOICE
        </textPath>
      </text>

      {/* Curved Text "Counseling and Psychology" around the bottom */}
      <text className="font-sans font-bold text-[5.2px] uppercase tracking-[0.03em]" fill="#fed136">
        <textPath href="#logo-curve-bottom" startOffset="50%" textAnchor="middle">
          Counseling and Psychology
        </textPath>
      </text>

      {/* Gold Cursive Monogram "abc" with double drop shadow */}
      <g filter="url(#gold-glow-shadow)">
        {/* Letter 'a' */}
        <path d="M 33,53 C 33,48 38,48 38,53 C 38,58 33,58 33,53 Z" fill="none" stroke="#eed055" strokeWidth="2" strokeLinecap="round" />
        <path d="M 38,50 L 38,55 C 38,56.5 39.5,56.5 40.5,55" fill="none" stroke="#eed055" strokeWidth="2" strokeLinecap="round" />
        
        {/* Connecting sweep */}
        <path d="M 38,53 C 41,52.5 44,50 46,50" fill="none" stroke="#eed055" strokeWidth="1.5" strokeLinecap="round" />

        {/* Letter 'b' with high pole */}
        <path d="M 46,38 L 46,55" fill="none" stroke="#eed055" strokeWidth="2" strokeLinecap="round" />
        <path d="M 46,49 C 48.5,46 53,46 53,50.5 C 53,55 48.5,55 46,51.5" fill="none" stroke="#eed055" strokeWidth="2" strokeLinecap="round" />

        {/* Connecting sweep */}
        <path d="M 52.5,51 C 54.5,51 56.5,49.5 58,49.5" fill="none" stroke="#eed055" strokeWidth="1.5" strokeLinecap="round" />

        {/* Letter 'c' */}
        <path d="M 63.5,48.5 C 61.5,46.5 58,46.5 58,51 C 58,55.5 61.5,55.5 63.5,52" fill="none" stroke="#eed055" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Green cupping hands caring for the monogram */}
      <g>
        {/* Left hand vector */}
        <path d="M 23,55 C 20.5,63.5 28.5,74.5 44,80 C 39.5,74 32,71.5 29.5,64.5 C 28.5,61 30,59 31,59 C 32,59 32.5,60.5 32.5,62.5 C 33.5,57.5 35.5,56.5 36.5,56.5 C 37.5,56.5 37.5,58.5 37.5,60.5 C 38.5,55.5 40.5,54.5 41.5,54.5 C 42.5,54.5 43.5,56.5 42.5,59.5 C 44.5,55.5 47.5,56.5 47.5,59.5 C 47.5,63.2 42.8,69 36,73" fill="none" stroke="#7fc142" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        {/* Right hand vector (balanced) */}
        <path d="M 77,55 C 79.5,63.5 71.5,74.5 56,80 C 60.5,74 68,71.5 70.5,64.5 C 71.5,61 70,59 69,59 C 68,59 67.5,60.5 67.5,62.5 C 66.5,57.5 64.5,56.5 63.5,56.5 C 62.5,56.5 62.5,58.5 62.5,60.5 C 61.5,55.5 59.5,54.5 58.5,54.5 C 57.5,54.5 56.5,56.5 57.5,59.5 C 55.5,55.5 52.5,56.5 52.5,59.5 C 52.5,63.2 57.2,69 64,73" fill="none" stroke="#7fc142" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <defs>
        <filter id="gold-glow-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0.5" dy="0.8" stdDeviation="0.5" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>
    </svg>
  );
}
