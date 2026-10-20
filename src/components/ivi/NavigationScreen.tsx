/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Navigation Interface
 * Responsive to Silver-Ice Light Theme and Obsidian Cyber Dark Theme.
 */

import React, { useState } from 'react';
import {
  Navigation,
  Search,
  Zap,
  Volume2,
  VolumeX,
  Compass,
  ArrowLeft,
  Clock,
  MapPin,
  ShieldAlert
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavigationScreenProps {
  onBack: () => void;
  ambientTempC: number;
}

export const NavigationScreen: React.FC<NavigationScreenProps> = ({
  onBack,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDestination, setActiveDestination] = useState('Ishmin Motors R&D Hub, Indiranagar');

  const chargingPoints = [
    { name: 'Ishmin Supercharger 120kW', dist: '1.8 km', status: '4/6 Available', cost: '₹14/kWh' },
    { name: 'Statiq Fast Charger Hub', dist: '3.4 km', status: '2/4 Available', cost: '₹16/kWh' },
    { name: 'Jio-bp pulse Station', dist: '5.1 km', status: '6/8 Available', cost: '₹15/kWh' },
  ];

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans transition-colors duration-300 ${
        isLight ? 'bg-[#eef2f6] text-slate-800' : 'bg-[#070b12] text-white'
      }`}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 inset-x-6 z-20 flex items-center justify-between gap-4 pointer-events-none">
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`pointer-events-auto flex items-center gap-2 backdrop-blur-md px-4 py-2.5 rounded-2xl border transition-all shadow-md ${
            isLight
              ? 'bg-white/95 border-slate-300 hover:border-sky-500 text-slate-800'
              : 'bg-[#0c1322]/90 border-slate-700/80 hover:border-cyan-500/50 text-slate-200'
          }`}
        >
          <ArrowLeft className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
          <span className="text-xs font-gauge font-bold">RETURN TO DASHBOARD</span>
        </button>

        {/* Search Bar */}
        <div className="pointer-events-auto flex-1 max-w-md relative">
          <div
            className={`flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-2xl border shadow-md ${
              isLight
                ? 'bg-white/95 border-slate-300 text-slate-800'
                : 'bg-[#0c1322]/90 border-slate-700/80 text-white'
            }`}
          >
            <Search className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search destination, EV charger, or POI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent text-xs focus:outline-none ${
                isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
              }`}
            />
          </div>
        </div>

        {/* Map controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 backdrop-blur-md rounded-2xl border transition-colors shadow-sm ${
              isLight
                ? 'bg-white/95 border-slate-300 text-slate-700 hover:text-slate-900'
                : 'bg-[#0c1322]/90 border-slate-700/80 text-slate-300 hover:text-white'
            }`}
            title={isMuted ? 'Unmute voice navigation' : 'Mute voice navigation'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />}
          </button>
          <div
            className={`p-2.5 backdrop-blur-md rounded-2xl border shadow-sm ${
              isLight
                ? 'bg-white/95 border-slate-300 text-sky-600'
                : 'bg-[#0c1322]/90 border-slate-700/80 text-cyan-400'
            }`}
          >
            <Compass className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Modern Automotive Map Graphics */}
        <svg
          viewBox="0 0 1280 720"
          className={`w-full h-full ${isLight ? 'bg-gradient-to-tr from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1]' : 'bg-[#060a12]'}`}
        >
          <defs>
            <linearGradient id="routeGradNav" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <filter id="routeGlowNav">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines simulating city arterial blocks */}
          <g stroke={isLight ? '#cbd5e1' : '#141f33'} strokeWidth="3" opacity={isLight ? '0.8' : '0.6'}>
            <line x1="0" y1="180" x2="1280" y2="240" />
            <line x1="0" y1="360" x2="1280" y2="380" />
            <line x1="0" y1="520" x2="1280" y2="500" />
            <line x1="240" y1="0" x2="280" y2="720" />
            <line x1="560" y1="0" x2="540" y2="720" />
            <line x1="880" y1="0" x2="900" y2="720" />
            <line x1="1120" y1="0" x2="1100" y2="720" />
          </g>

          {/* Secondary streets */}
          <g stroke={isLight ? '#e2e8f0' : '#0e1726'} strokeWidth="2">
            <path d="M 120 0 L 140 720 M 380 0 L 400 720 M 720 0 L 740 720 M 1020 0 L 1000 720" />
            <path d="M 0 100 L 1280 120 M 0 440 L 1280 460 M 0 620 L 1280 600" />
          </g>

          {/* Major Highway / Express Arterial */}
          <path
            d="M 100 680 C 350 620, 480 450, 620 400 C 760 350, 920 220, 1180 180"
            stroke={isLight ? '#94a3b8' : '#1e293b'}
            strokeWidth="16"
            fill="none"
          />

          {/* Active Navigation Route Polyline */}
          <path
            d="M 420 560 L 520 440 L 620 400 L 760 350 L 880 260 L 980 240"
            stroke="url(#routeGradNav)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#routeGlowNav)"
          />

          {/* Alternative Route */}
          <path
            d="M 520 440 L 600 500 L 780 460 L 880 260"
            stroke={isLight ? '#64748b' : '#334155'}
            strokeWidth="5"
            strokeDasharray="6 6"
            fill="none"
          />

          {/* Car Puck / Location Icon */}
          <g transform="translate(420, 560)">
            <circle r="22" fill={isLight ? 'rgba(2, 132, 199, 0.2)' : 'rgba(6, 182, 212, 0.2)'} className="animate-ping" />
            <circle r="16" fill={isLight ? '#0284c7' : '#06b6d4'} stroke="#ffffff" strokeWidth="3" />
            <path d="M 0 -8 L 6 6 L 0 3 L -6 6 Z" fill="#ffffff" transform="rotate(-35)" />
          </g>

          {/* Destination Marker */}
          <g transform="translate(980, 240)">
            <circle r="14" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
            <circle r="5" fill="#ffffff" />
          </g>
        </svg>

        {/* Turn-by-Turn Maneuver Overlay Card (Left) */}
        <div
          className={`absolute bottom-6 left-6 z-20 w-80 backdrop-blur-xl p-4 rounded-3xl border shadow-xl ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-800'
              : 'bg-[#0d1322]/95 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                isLight
                  ? 'bg-gradient-to-tr from-sky-600 to-blue-600 text-white border-sky-400 shadow-md'
                  : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-400'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-current stroke-2">
                <path d="M9 11l-4-4 4-4" />
                <path d="M5 7h11a4 4 0 0 1 4 4v7" />
              </svg>
            </div>
            <div>
              <span
                className={`text-[10px] font-gauge tracking-widest uppercase block ${
                  isLight ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                NEXT MANEUVER · IN 500 METERS
              </span>
              <h3 className="text-base font-gauge font-bold">Turn Left onto 100ft Ring Rd</h3>
              <span
                className={`text-xs block mt-1 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Then continue 1.8 km towards Indiranagar Flyover
              </span>
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-gauge ${
              isLight ? 'border-slate-100' : 'border-slate-800'
            }`}
          >
            <div>
              <span className={`block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>DESTINATION</span>
              <span className="font-bold text-sm">11:05 AM</span>
            </div>
            <div>
              <span className={`block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>REMAINING</span>
              <span className="font-bold text-sm">2.5 km</span>
            </div>
            <div>
              <span className={`block text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>DURATION</span>
              <span className="font-bold text-sm">6 mins</span>
            </div>
          </div>
        </div>

        {/* Nearby Charging Stations Overlay Card (Right) */}
        <div
          className={`absolute bottom-6 right-6 z-20 w-84 backdrop-blur-xl p-4 rounded-3xl border shadow-xl ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-800'
              : 'bg-[#0d1322]/95 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
              <span className="text-xs font-gauge font-bold tracking-wider uppercase">
                EN-ROUTE EV FAST CHARGERS
              </span>
            </div>
            <span
              className={`text-[10px] font-mono-telemetry ${
                isLight ? 'text-emerald-700' : 'text-emerald-400'
              }`}
            >
              CCS2 / GB/T
            </span>
          </div>

          <div className="space-y-2">
            {chargingPoints.map((cp, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                  isLight
                    ? 'bg-slate-50 hover:bg-sky-50 border-slate-200 hover:border-sky-300'
                    : 'bg-[#080d17] hover:bg-slate-800/60 border-slate-800/80 hover:border-cyan-500/40'
                }`}
              >
                <div>
                  <h4 className="text-xs font-semibold">{cp.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{cp.dist}</span>
                    <span className="text-[10px] text-emerald-600 font-medium">{cp.status}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDestination(cp.name)}
                  className={`text-[10px] font-gauge font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                    isLight
                      ? 'bg-white hover:bg-slate-100 text-sky-700 border-slate-300 shadow-xs'
                      : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
                  }`}
                >
                  ADD STOP
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
