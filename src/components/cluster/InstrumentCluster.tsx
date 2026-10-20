/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Digital Instrument Cluster (Dedicated Display)
 * Inspired by Ishmin Reference Image 1: Dual Luminous Blue Gauges & Central Map
 */

import React from 'react';
import {
  TelltaleState,
  BmsData,
  MotorTelemetry,
  VehicleTripData,
  Gear,
  DriveMode
} from '../../types/telemetry';
import { TelltaleBar } from './TelltaleBar';
import { Navigation, BatteryCharging, Radio } from 'lucide-react';

interface InstrumentClusterProps {
  telltales: TelltaleState;
  bms: BmsData;
  motorTelemetry: MotorTelemetry;
  vehicleTrip: VehicleTripData;
  gear: Gear;
  driveMode: DriveMode;
  isFlashing: boolean;
  scaleMode?: 'compact' | 'ultrawide';
}

export const InstrumentCluster: React.FC<InstrumentClusterProps> = ({
  telltales,
  bms,
  motorTelemetry,
  vehicleTrip,
  gear,
  driveMode,
  isFlashing,
}) => {
  // Speed arc calculation (0 to 180 km/h maps to angle from -135deg to +135deg)
  const maxSpeed = 180;
  const speedRatio = Math.min(1, Math.max(0, motorTelemetry.speedKmh / maxSpeed));
  
  // Power arc calculation (-10kW regen to +35kW boost)
  const powerKw = motorTelemetry.speedKmh > 0 ? bms.packPowerKw : 0;
  const powerPercent = Math.min(100, Math.round((powerKw / 15) * 100));

  // Needle angle for speedometer SVG (from -130deg to +130deg)
  const needleAngle = -135 + speedRatio * 270;

  return (
    <div className="relative w-full h-full bg-[#03060c] text-white flex flex-col justify-between overflow-hidden select-none font-sans border border-slate-900 shadow-2xl">
      {/* Background ambient lighting glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-[18%] -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-[18%] -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-40 bg-sky-500/10 rounded-full blur-[90px]" />
      </div>

      {/* TOP HEADER: Ambient Temp, Active Track/Audio, Date/Time */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-4 pb-1 text-xs text-slate-400 font-medium tracking-wide">
        {/* Left: Outdoor Temperature */}
        <div className="flex items-center gap-1.5 font-gauge text-slate-300 text-sm">
          <span>+{vehicleTrip.ambientTempC}°C</span>
          <span className="text-[10px] text-slate-500 font-sans">OUTSIDE</span>
        </div>

        {/* Center: Audio / Entertainment info */}
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300 tracking-wider uppercase font-semibold">
            <Radio className="w-3 h-3 text-cyan-400" />
            <span className="truncate">ISHMIN SOUND · ZERO-EMISSION BEAT</span>
          </div>
          {/* Subtle audio progress bar */}
          <div className="w-36 h-0.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div className="w-1/2 h-full bg-cyan-400" />
          </div>
        </div>

        {/* Right: Date and Time */}
        <div className="flex items-center gap-2 font-gauge text-slate-300 text-sm text-right">
          <span className="text-[10px] text-slate-500 font-sans">SYS</span>
          <span>15:34</span>
          <span className="text-[10px] text-cyan-400">AM</span>
        </div>
      </div>

      {/* REGULATORY TELLTALE STRIP (Central Top Arc) */}
      <div className="relative z-20 flex justify-center px-4 -mt-1">
        <TelltaleBar telltales={telltales} isFlashing={isFlashing} />
      </div>

      {/* MAIN INSTRUMENTATION AREA: Left Speedo, Center Telemetry/Map, Right Power Dial */}
      <div className="relative z-10 flex-1 grid grid-cols-12 items-center px-4 py-2">
        {/* ================= LEFT GAUGE: SPEEDOMETER & ODOMETER ================= */}
        <div className="col-span-4 flex flex-col items-center justify-center relative">
          {/* eBOOST outer indicator tag */}
          <div className="absolute -left-2 top-10 flex flex-col items-center">
            <span className="text-[9px] font-gauge text-cyan-400 -rotate-90 origin-bottom">
              40% eBOOST
            </span>
          </div>

          {/* Speedometer Circular SVG */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Ambient circular glowing halo */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.35)]" />
            <div className="absolute inset-2 rounded-full border border-blue-500/20 shadow-[inset_0_0_30px_rgba(59,130,246,0.3)] bg-gradient-to-b from-[#061226]/80 to-[#020713]/90 backdrop-blur-sm" />
            <div className="absolute inset-8 rounded-full border border-sky-400/20" />

            {/* SVG Arc for ticks and needle */}
            <svg viewBox="0 0 260 260" className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="speedGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="60%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <filter id="glowFilter">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Arc Track */}
              <circle
                cx="130"
                cy="130"
                r="105"
                fill="none"
                stroke="#0f172a"
                strokeWidth="6"
                strokeDasharray="495"
                strokeDashoffset="124"
                transform="rotate(135 130 130)"
                strokeLinecap="round"
              />

              {/* Active Speed Arc with Gradient */}
              <circle
                cx="130"
                cy="130"
                r="105"
                fill="none"
                stroke="url(#speedGrad)"
                strokeWidth="6"
                strokeDasharray="495"
                strokeDashoffset={495 - (speedRatio * 370)}
                transform="rotate(135 130 130)"
                strokeLinecap="round"
                filter="url(#glowFilter)"
              />

              {/* Gauge Tick Marks */}
              {Array.from({ length: 19 }).map((_, i) => {
                const angle = -135 + i * (270 / 18);
                const rad = (angle * Math.PI) / 180;
                const isMajor = i % 2 === 0;
                const r1 = 114;
                const r2 = isMajor ? 123 : 119;
                const x1 = 130 + r1 * Math.cos(rad);
                const y1 = 130 + r1 * Math.sin(rad);
                const x2 = 130 + r2 * Math.cos(rad);
                const y2 = 130 + r2 * Math.sin(rad);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isMajor ? '#38bdf8' : '#334155'}
                    strokeWidth={isMajor ? '2' : '1'}
                    opacity={isMajor ? '0.8' : '0.4'}
                  />
                );
              })}

              {/* Dynamic Speed Needle */}
              <g transform={`rotate(${needleAngle} 130 130)`}>
                <line
                  x1="130"
                  y1="130"
                  x2="45"
                  y2="130"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#glowFilter)"
                />
                <circle cx="45" cy="130" r="3.5" fill="#e0f2fe" filter="url(#glowFilter)" />
              </g>

              {/* Center Pivot Accent */}
              <circle cx="130" cy="130" r="18" fill="#08142b" stroke="#0ea5e9" strokeWidth="2" />
            </svg>

            {/* Central Speed Readout Numerals */}
            <div className="relative z-10 flex flex-col items-center justify-center -mt-1">
              <span className="font-gauge text-6xl font-bold tracking-tight text-white glow-cyan">
                {Math.round(motorTelemetry.speedKmh)}
              </span>
              <span className="text-[11px] font-gauge tracking-widest text-cyan-300 font-semibold uppercase -mt-1">
                KM/H
              </span>
              {/* Odometer */}
              <div className="mt-3 font-mono-telemetry text-[11px] tracking-wider text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-slate-800">
                {String(Math.round(vehicleTrip.odometerKm)).padStart(6, '0')} <span className="text-[9px]">KM</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CENTER ZONE: RANGE ARC & NAVIGATION MINIMAP ================= */}
        <div className="col-span-4 flex flex-col items-center justify-center px-2">
          {/* Upper Range Arc Gauge */}
          <div className="w-full flex flex-col items-center mb-3">
            <div className="flex items-center justify-between w-64 text-xs font-gauge font-bold tracking-wider mb-1">
              <span className="text-slate-400">RANGE</span>
              <div className="flex items-center gap-1.5 text-cyan-400">
                <BatteryCharging className="w-4 h-4" />
                <span>{bms.soc.toFixed(0)}%</span>
              </div>
              <span className="text-white text-base glow-cyan">{vehicleTrip.estimatedRangeKm} <span className="text-xs text-slate-400">KM</span></span>
            </div>

            {/* Curved Glowing Range Arc Bar */}
            <div className="relative w-64 h-3 bg-slate-900/90 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-sky-300 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                style={{ width: `${Math.min(100, Math.max(5, bms.soc))}%` }}
              />
            </div>
          </div>

          {/* Navigation Next Maneuver Kicker */}
          <div className="flex items-center gap-2 text-xs font-gauge text-cyan-300 bg-slate-900/80 px-3 py-1 rounded-full border border-cyan-800/50 mb-2">
            <Navigation className="w-3.5 h-3.5 rotate-45 text-cyan-400 animate-pulse" />
            <span className="tracking-wide">IN 500M · MG ROAD EXIT 4</span>
          </div>

          {/* Stylized Automotive Dark Map Wireframe Preview */}
          <div className="relative w-full max-w-[280px] h-32 rounded-xl overflow-hidden border border-slate-800/80 bg-[#020813] shadow-inner">
            {/* SVG Vector City Grid Map Simulation */}
            <svg viewBox="0 0 300 150" className="w-full h-full opacity-60">
              <path
                d="M10 20 L290 30 M20 70 L280 65 M15 120 L295 110 M60 5 L70 145 M150 10 L145 140 M230 5 L240 145"
                stroke="#1e293b"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <path
                d="M50 140 C100 110, 140 80, 150 40 C160 20, 200 10, 260 20"
                stroke="#0284c7"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M150 140 C150 90, 150 60, 150 40"
                stroke="#06b6d4"
                strokeWidth="3"
                fill="none"
              />
              {/* Waypoint circles */}
              <circle cx="150" cy="75" r="5" fill="#38bdf8" filter="url(#glowFilter)" />
              <circle cx="150" cy="75" r="14" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.4" />
            </svg>

            {/* Vehicle Location Puck */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 animate-ping absolute -inset-0" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center shadow-[0_0_14px_rgba(6,182,212,0.9)]">
                  <Navigation className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>

            {/* Bottom address banner */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent px-2 py-1 text-center">
              <span className="text-[10px] text-slate-300 font-sans tracking-wide truncate block">
                ISHMIN MOTORS R&D FACILITY · BANGALORE
              </span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT GAUGE: EV POWER & DRIVE MODE ================= */}
        <div className="col-span-4 flex flex-col items-center justify-center relative">
          {/* eDRIVE outer indicator tag */}
          <div className="absolute -right-2 top-10 flex flex-col items-center">
            <span className="text-[9px] font-gauge text-cyan-400 rotate-90 origin-bottom">
              60% eDRIVE
            </span>
          </div>

          {/* EV Powertrain Circular SVG */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Ambient circular glowing halo */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.35)]" />
            <div className="absolute inset-2 rounded-full border border-blue-500/20 shadow-[inset_0_0_30px_rgba(59,130,246,0.3)] bg-gradient-to-b from-[#061226]/80 to-[#020713]/90 backdrop-blur-sm" />
            <div className="absolute inset-8 rounded-full border border-sky-400/20" />

            {/* SVG Arc for Power / eDRIVE */}
            <svg viewBox="0 0 260 260" className="absolute inset-0 w-full h-full">
              {/* Background Arc */}
              <circle
                cx="130"
                cy="130"
                r="105"
                fill="none"
                stroke="#0f172a"
                strokeWidth="6"
                strokeDasharray="495"
                strokeDashoffset="124"
                transform="rotate(135 130 130)"
                strokeLinecap="round"
              />

              {/* Power Delivery Arc */}
              <circle
                cx="130"
                cy="130"
                r="105"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="6"
                strokeDasharray="495"
                strokeDashoffset={495 - (Math.min(1, powerPercent / 100) * 370)}
                transform="rotate(135 130 130)"
                strokeLinecap="round"
                filter="url(#glowFilter)"
              />
            </svg>

            {/* Central EV Mode & State Info */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              {/* Power % */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-gauge tracking-widest text-slate-400 uppercase">
                  POWER
                </span>
                <span className="font-gauge text-xl font-bold text-cyan-300">
                  {powerPercent}%
                </span>
              </div>

              {/* eBOOST indicator tag */}
              <div className="my-1 text-[11px] font-gauge font-bold tracking-widest text-sky-400 uppercase">
                {bms.packPowerKw > 2 ? 'eBOOST' : 'eDRIVE'}
              </div>

              {/* Central Gear & Drive Mode Header (e.g. D ECO PRO / P ECO PRO) */}
              <div className="my-1.5 flex items-center gap-2">
                <span className={`font-gauge text-4xl font-bold px-2 py-0.5 rounded ${
                  gear === 'D' ? 'text-white' : gear === 'R' ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  {gear}
                </span>
                <span className="font-gauge text-2xl font-bold tracking-wider text-cyan-400">
                  {driveMode} {driveMode === 'ECO' ? 'PRO' : ''}
                </span>
              </div>

              {/* Charge Status */}
              <div className="flex flex-col items-center mt-1">
                <span className="text-[10px] font-gauge tracking-widest text-slate-400 uppercase">
                  CHARGE
                </span>
                <span className="font-gauge text-sm font-semibold text-slate-200">
                  {bms.soc.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER: Trip info & Hardware Decoupling Badge */}
      <div className="relative z-10 flex items-center justify-between px-8 py-2.5 bg-black/60 border-t border-slate-900/80 text-[11px] text-slate-400 font-gauge">
        <div className="flex items-center gap-4">
          <span>TRIP: <strong className="text-white font-mono-telemetry">{vehicleTrip.tripKm.toFixed(1)} km</strong></span>
          <span>AVG: <strong className="text-cyan-400 font-mono-telemetry">{motorTelemetry.energyConsumptionWhKm} Wh/km</strong></span>
          <span>MOTOR: <strong className="text-white font-mono-telemetry">{motorTelemetry.motorTempC}°C</strong></span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CAN 2.0B DIRECT LINK · HARDWARE ISOLATED (FAIL-SAFE)</span>
        </div>
      </div>
    </div>
  );
};
