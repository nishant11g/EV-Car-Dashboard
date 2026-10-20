/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Primary In-Vehicle Infotainment (IVI) Dashboard
 * Transformed to match the Silver-Ice Luminescent Theme from user reference image.
 * Features:
 *  - Premium Light Theme (Silver-Ice aesthetic) with Dark Theme toggle
 *  - Real-Time Energy Economy Bar Chart (kWh/100 km, interval history, Eco target line)
 *  - System & Media Volume Card (interactive slider, +/- buttons, speaker status)
 *  - Active Handsfree Phone Call Widget (contact info, call timer, call action buttons)
 *  - High-Definition Speedometer Arc (electric azure/cyan gauge)
 *  - Turn-by-Turn Navigation Preview Card
 *  - Vehicle Health, Battery SoC, Range & Cabin Climate
 *  - Media Player with interactive playback controls
 *  - Floating Frosted Bottom Navigation Dock
 */

import React, { useState, useEffect } from 'react';
import {
  BmsData,
  MotorTelemetry,
  VehicleTripData,
  Gear,
  DriveMode,
  TelltaleState,
  TelematicsStatus
} from '../../types/telemetry';
import { useTheme } from '../../context/ThemeContext';
import {
  Navigation,
  Battery,
  Wifi,
  Bluetooth,
  ChevronRight,
  Disc3,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Settings,
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Volume1,
  Minus,
  Plus,
  Car,
  TrendingDown,
  Sun,
  Moon,
  Compass,
  MapPin,
  Clock,
  Radio,
  Sliders,
  Layers,
  Thermometer,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

interface IviDashboardProps {
  bms: BmsData;
  motorTelemetry: MotorTelemetry;
  vehicleTrip: VehicleTripData;
  gear: Gear;
  driveMode: DriveMode;
  telltales?: TelltaleState;
  telematics: TelematicsStatus;
  isPlayingMedia: boolean;
  onTogglePlayMedia: () => void;
  onNavigateTo: (
    screen:
      | 'dashboard'
      | 'navigation'
      | 'telemetry'
      | 'diagnostics'
      | 'telematics'
      | 'settings'
      | 'camera'
      | 'wifi'
      | 'projection'
      | 'clouddb'
      | 'hardware'
      | 'circuit'
  ) => void;
  onToggleDriveMode: () => void;
}

export const IviDashboard: React.FC<IviDashboardProps> = ({
  bms,
  motorTelemetry,
  vehicleTrip,
  gear,
  driveMode,
  telematics,
  isPlayingMedia,
  onTogglePlayMedia,
  onNavigateTo,
  onToggleDriveMode,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  // System Volume State
  const [systemVolume, setSystemVolume] = useState<number>(68);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Phone Call Widget State
  const [callDuration, setCallDuration] = useState<number>(254); // in seconds (04:14)
  const [isCallMuted, setIsCallMuted] = useState<boolean>(false);
  const [isCallActive, setIsCallActive] = useState<boolean>(true);

  // Call timer simulation
  useEffect(() => {
    if (!isCallActive) return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Speed ratio for gauge (0 to 250 km/h)
  const maxScale = 250;
  const speedRatio = Math.min(1, Math.max(0, motorTelemetry.speedKmh / maxScale));
  const rpmFormatted = (motorTelemetry.motorRpm / 1000).toFixed(1) + 'k';

  // Real-time Energy Economy calculation
  // Wh/km converted to kWh/100 km: (Wh/km * 100) / 1000 = Wh/km / 10
  const currentConsumptionKwh = Math.max(
    8.2,
    motorTelemetry.speedKmh > 0
      ? Number((motorTelemetry.energyConsumptionWhKm / 10).toFixed(1))
      : 14.8
  );

  // Historical intervals for Energy Economy bar chart (last 50km in 10km intervals)
  const consumptionHistory = [
    { label: '50km', value: 16.2, targetDelta: +1.2 },
    { label: '40km', value: 15.4, targetDelta: +0.4 },
    { label: '30km', value: 13.9, targetDelta: -1.1 },
    { label: '20km', value: 14.3, targetDelta: -0.7 },
    { label: '10km', value: 15.8, targetDelta: +0.8 },
    { label: 'Now', value: currentConsumptionKwh, targetDelta: currentConsumptionKwh - 15.0 },
  ];
  const maxChartVal = 24.0; // max chart height reference in kWh/100km
  const ecoTargetKwh = 15.0; // green target line

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSystemVolume(Number(e.target.value));
    if (isMuted) setIsMuted(false);
  };

  const stepVolume = (delta: number) => {
    setSystemVolume((prev) => {
      const next = Math.min(100, Math.max(0, prev + delta));
      if (next > 0 && isMuted) setIsMuted(false);
      return next;
    });
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between p-3 select-none font-sans overflow-hidden transition-colors duration-300 ${
        isLight
          ? 'bg-gradient-to-br from-[#f8fafc] via-[#edf2f7] to-[#e2e8f0] text-slate-800'
          : 'bg-[#0a0d14] text-white'
      }`}
    >
      {/* Subtle ambient lighting backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isLight ? (
          <>
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-cyan-100/50 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-900/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl" />
          </>
        )}
      </div>

      {/* ================= 1. PERSISTENT TOP STATUS BAR ================= */}
      <header
        className={`relative z-10 flex items-center justify-between px-4 py-2 rounded-2xl border shadow-sm transition-all ${
          isLight
            ? 'bg-white/85 border-slate-200/90 backdrop-blur-md shadow-slate-200/50'
            : 'bg-[#0e131d]/90 border-slate-800/80 shadow-md'
        }`}
      >
        {/* Left: Clock & OS branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
            <span
              className={`font-gauge text-base font-bold tracking-tight ${
                isLight ? 'text-slate-900' : 'text-slate-100'
              }`}
            >
              10:45 AM
            </span>
          </div>
          <span
            className={`text-[11px] font-mono-telemetry px-2 py-0.5 rounded-full font-medium ${
              isLight
                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700'
            }`}
          >
            ISHMIN OS 15.2 · SILVERSHINE
          </span>
        </div>

        {/* Center: Navigation Active Status Pill */}
        <div
          onClick={() => onNavigateTo('navigation')}
          className={`flex items-center gap-2 px-3 py-1 rounded-xl cursor-pointer transition-all border ${
            isLight
              ? 'bg-sky-50/90 border-sky-200 text-sky-800 hover:bg-sky-100/80 shadow-xs'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800'
          }`}
          title="Open Navigation"
        >
          <Navigation className="w-3.5 h-3.5 text-sky-500 rotate-45 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide">
            Nav Active: Grand Central Pkwy (2.5 km)
          </span>
        </div>

        {/* Right: Connectivity Icons, Battery & Theme Quick Switch */}
        <div className="flex items-center gap-2.5">
          {/* Theme Quick Switcher button */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-gauge font-bold transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300'
            }`}
            title={`Switch to ${isLight ? 'Obsidian Cyber (Dark)' : 'Silver-Ice (Light - Reference Image)'}`}
          >
            {isLight ? (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="text-[11px]">DARK MODE</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">LIGHT THEME</span>
              </>
            )}
          </button>

          {/* Projection Indicator */}
          <div
            onClick={() => onNavigateTo('projection')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-100 text-sky-700' : 'hover:bg-slate-800 text-cyan-400'
            }`}
            title="Apple CarPlay & Android Auto Projection"
          >
            <Bluetooth className="w-4 h-4" />
            <span className="text-[10px] font-gauge font-bold">CARPLAY / AA</span>
          </div>

          {/* Wi-Fi & Hotspot */}
          <div
            onClick={() => onNavigateTo('wifi')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg cursor-pointer transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Wi-Fi Telemetry & Hotspot"
          >
            <Wifi
              className={`w-4 h-4 ${
                telematics.wifiConnected ? 'text-emerald-500' : 'text-slate-400'
              }`}
            />
            {/* Cellular signal bars */}
            <div className="flex items-end gap-0.5 h-3">
              <span className={`w-1 h-1.5 rounded-xs ${isLight ? 'bg-slate-400' : 'bg-slate-300'}`} />
              <span className={`w-1 h-2 rounded-xs ${isLight ? 'bg-slate-400' : 'bg-slate-300'}`} />
              <span className={`w-1 h-2.5 rounded-xs ${isLight ? 'bg-slate-400' : 'bg-slate-300'}`} />
              <span className={`w-1 h-3 rounded-xs ${isLight ? 'bg-sky-600' : 'bg-cyan-400'}`} />
            </div>
            <span className="text-[10px] font-gauge font-semibold">5G</span>
          </div>

          {/* Battery SoC */}
          <div
            onClick={() => onNavigateTo('telemetry')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg cursor-pointer transition-colors ${
              isLight
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
            }`}
            title="Battery State of Charge"
          >
            <Battery className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-gauge font-bold">{bms.soc.toFixed(0)}%</span>
          </div>
        </div>
      </header>

      {/* ================= 2. MAIN 3-COLUMN CONTENT GRID ================= */}
      <div className="grid grid-cols-12 gap-3 my-2.5 flex-1 items-stretch min-h-0">
        {/* ================= LEFT COLUMN: NAVIGATION & PHONE CALL WIDGET ================= */}
        <div className="col-span-3 flex flex-col gap-3 justify-between">
          {/* Navigation Preview Card */}
          <div
            onClick={() => onNavigateTo('navigation')}
            className={`rounded-2xl p-3.5 border flex flex-col justify-between cursor-pointer group transition-all shadow-sm ${
              isLight
                ? 'bg-white/95 border-slate-200/90 hover:border-sky-400 hover:shadow-md'
                : 'bg-[#0d121c] border-slate-800/80 hover:border-cyan-500/40 shadow-lg'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Compass className={`w-3.5 h-3.5 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
                  <span
                    className={`text-[11px] font-gauge font-bold tracking-widest uppercase ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    NAVIGATION
                  </span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-colors ${
                    isLight
                      ? 'text-slate-400 group-hover:text-sky-600'
                      : 'text-slate-600 group-hover:text-cyan-400'
                  }`}
                />
              </div>

              {/* Map Canvas / Vector Preview */}
              <div
                className={`relative w-full h-28 rounded-xl overflow-hidden border mb-2.5 ${
                  isLight
                    ? 'border-slate-200 bg-gradient-to-tr from-sky-50 via-slate-100 to-slate-50'
                    : 'border-slate-800 bg-[#060a12]'
                }`}
              >
                <svg viewBox="0 0 160 110" className="w-full h-full">
                  {/* Road grid lines */}
                  <path
                    d="M10 20 L150 40 M20 90 L140 70 M50 10 L60 100 M110 10 L115 100"
                    stroke={isLight ? '#cbd5e1' : '#1e293b'}
                    strokeWidth="3"
                  />
                  {/* Active Route path */}
                  <path
                    d="M30 100 L45 55 L125 35"
                    stroke={isLight ? '#0284c7' : '#0ea5e9'}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Location GPS Puck */}
                <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className={`w-6 h-6 rounded-full animate-ping absolute -inset-0 ${
                      isLight ? 'bg-sky-400/30' : 'bg-cyan-500/25'
                    }`}
                  />
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-md">
                    <Navigation className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                {/* ETA badge */}
                <div
                  className={`absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md text-[10px] font-gauge font-bold border ${
                    isLight
                      ? 'bg-white/95 text-slate-800 border-slate-200 shadow-xs'
                      : 'bg-slate-900/90 text-slate-200 border-slate-700'
                  }`}
                >
                  ETA 11:05 AM
                </div>
              </div>
            </div>

            {/* Next Maneuver Prompt */}
            <div
              className={`p-2 rounded-xl border flex items-center gap-2.5 ${
                isLight
                  ? 'bg-sky-50/70 border-sky-200/80 text-slate-800'
                  : 'bg-[#080d17] border-slate-800/80 text-white'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isLight
                    ? 'bg-sky-500 text-white border-sky-400 shadow-xs'
                    : 'bg-cyan-950/70 text-cyan-400 border-cyan-500/30'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-none stroke-current stroke-2"
                >
                  <path d="M9 11l-4-4 4-4" />
                  <path d="M5 7h11a4 4 0 0 1 4 4v7" />
                </svg>
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-gauge font-bold block truncate">
                  Turn left in 500 m
                </span>
                <span
                  className={`text-[10px] block truncate ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  2.5 km to destination
                </span>
              </div>
            </div>
          </div>

          {/* Active / Incoming Call Card Widget (Matching User Reference Image) */}
          <div
            className={`rounded-2xl p-3.5 border flex flex-col justify-between transition-all shadow-sm ${
              isLight
                ? 'bg-white/95 border-slate-200/90 shadow-slate-200/40'
                : 'bg-[#0d121c] border-slate-800/80 shadow-lg'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <PhoneCall
                    className={`w-3.5 h-3.5 ${
                      isCallActive ? 'text-emerald-500 animate-pulse' : 'text-slate-400'
                    }`}
                  />
                  <span
                    className={`text-[11px] font-gauge font-bold tracking-widest uppercase ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    HANDSFREE PHONE
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono-telemetry font-semibold px-2 py-0.5 rounded-md ${
                    isCallActive
                      ? isLight
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                      : isLight
                      ? 'bg-slate-100 text-slate-500'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCallActive ? `IN CALL · ${formatCallTime(callDuration)}` : 'DISCONNECTED'}
                </span>
              </div>

              {/* Contact Information & Avatar */}
              <div className="flex items-center gap-3 my-1.5">
                <div className="relative">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-gauge font-bold text-sm shadow-sm ${
                      isLight
                        ? 'bg-gradient-to-tr from-sky-500 to-blue-600 text-white'
                        : 'bg-gradient-to-tr from-cyan-600 to-sky-700 text-white'
                    }`}
                  >
                    SJ
                  </div>
                  {isCallActive && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <h4
                    className={`font-semibold text-sm truncate ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Sarah Jenkins
                  </h4>
                  <span
                    className={`text-[11px] block truncate ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    Mobile · +1 (555) 382-9014
                  </span>
                </div>
              </div>
            </div>

            {/* In-Call Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsCallMuted(!isCallMuted)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-gauge font-bold flex items-center justify-center gap-1.5 transition-colors border ${
                  isCallMuted
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title={isCallMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isCallMuted ? <MicOff className="w-3.5 h-3.5 text-amber-600" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isCallMuted ? 'MUTED' : 'MUTE'}</span>
              </button>

              {isCallActive ? (
                <button
                  onClick={() => setIsCallActive(false)}
                  className="flex-1 py-1.5 px-2 rounded-xl text-xs font-gauge font-bold flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs"
                  title="End Active Phone Call"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  <span>END CALL</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsCallActive(true);
                    setCallDuration(0);
                  }}
                  className="flex-1 py-1.5 px-2 rounded-xl text-xs font-gauge font-bold flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
                  title="Reconnect Call"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>CALL</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= CENTER COLUMN: CENTRAL SPEEDOMETER & DRIVE GAUGES ================= */}
        <div
          className={`col-span-6 rounded-2xl p-4 border flex flex-col items-center justify-between shadow-sm relative overflow-hidden transition-all ${
            isLight
              ? 'bg-white/95 border-slate-200/90 shadow-slate-200/50'
              : 'bg-[#0d121c] border-slate-800/80 shadow-xl'
          }`}
        >
          {/* Subtle background radial glow */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[90px] pointer-events-none ${
              isLight ? 'bg-sky-400/10' : 'bg-cyan-500/5'
            }`}
          />

          {/* Top Label & Mode indicator */}
          <div className="w-full flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-gauge font-bold tracking-widest uppercase ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                POWERTRAIN DRIVE CLUSTER
              </span>
            </div>
            <div
              onClick={onToggleDriveMode}
              className={`px-3 py-1 rounded-full cursor-pointer border text-xs font-gauge font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                driveMode === 'SPORT'
                  ? 'bg-rose-50 text-rose-600 border-rose-300'
                  : driveMode === 'NORMAL'
                  ? isLight
                    ? 'bg-sky-50 text-sky-700 border-sky-300'
                    : 'bg-blue-950/60 text-blue-400 border-blue-800/40'
                  : isLight
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
              }`}
              title="Click to toggle Drive Mode (ECO / NORMAL / SPORT)"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{driveMode} MODE</span>
            </div>
          </div>

          {/* Speedometer Gauge Canvas/SVG */}
          <div className="relative w-80 h-56 flex items-center justify-center my-auto">
            <svg viewBox="0 0 280 230" className="w-full h-full">
              <defs>
                <linearGradient id="iviSpeedGradLight" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="60%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <linearGradient id="iviSpeedGradDark" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="70%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Outer Gauge Track Arc (240 degrees) */}
              <circle
                cx="140"
                cy="120"
                r="95"
                fill="none"
                stroke={isLight ? '#e2e8f0' : '#172033'}
                strokeWidth="6"
                strokeDasharray="450"
                strokeDashoffset="130"
                transform="rotate(140 140 120)"
                strokeLinecap="round"
              />

              {/* Active Speed Arc */}
              <circle
                cx="140"
                cy="120"
                r="95"
                fill="none"
                stroke={isLight ? 'url(#iviSpeedGradLight)' : 'url(#iviSpeedGradDark)'}
                strokeWidth="8"
                strokeDasharray="450"
                strokeDashoffset={450 - speedRatio * 320}
                transform="rotate(140 140 120)"
                strokeLinecap="round"
                className="transition-all duration-200"
              />

              {/* Redline zone at 200+ km/h */}
              <circle
                cx="140"
                cy="120"
                r="95"
                fill="none"
                stroke="#ef4444"
                strokeWidth="8"
                strokeDasharray="60"
                strokeDashoffset="0"
                transform="rotate(15 140 120)"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Speed markings: 0, 50, 100, 150, 200, 250 */}
              <text
                x="68"
                y="180"
                fill={isLight ? '#94a3b8' : '#64748b'}
                fontSize="11"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                0
              </text>
              <text
                x="50"
                y="130"
                fill={isLight ? '#94a3b8' : '#64748b'}
                fontSize="11"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                50
              </text>
              <text
                x="78"
                y="75"
                fill={isLight ? '#64748b' : '#94a3b8'}
                fontSize="11"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                100
              </text>
              <text
                x="130"
                y="52"
                fill={isLight ? '#64748b' : '#94a3b8'}
                fontSize="11"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                150
              </text>
              <text
                x="182"
                y="75"
                fill={isLight ? '#64748b' : '#94a3b8'}
                fontSize="11"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                200
              </text>
              <text
                x="208"
                y="130"
                fill="#ef4444"
                fontSize="11"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                250
              </text>
            </svg>

            {/* Central Big Speed Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center -mt-2">
              <span
                className={`font-gauge text-7xl font-bold tracking-tight ${
                  isLight ? 'text-slate-900 drop-shadow-xs' : 'text-white glow-cyan'
                }`}
              >
                {Math.round(motorTelemetry.speedKmh)}
              </span>
              <span
                className={`text-xs font-gauge font-bold uppercase tracking-widest -mt-1 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                KM/H
              </span>

              {/* RPM Readout */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  className={`text-[10px] font-gauge tracking-wider ${
                    isLight ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  MOTOR
                </span>
                <span
                  className={`font-gauge text-sm font-bold ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  {rpmFormatted} RPM
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Vehicle Status Badges: Gear Selector, Odometer, Power Output */}
          <div
            className={`w-full flex items-center justify-between px-6 pt-2.5 border-t ${
              isLight ? 'border-slate-100' : 'border-slate-800/80'
            }`}
          >
            {/* Gear Selector */}
            <div className="flex items-center gap-2">
              <div
                className={`font-gauge text-xl font-bold px-3 py-1 rounded-xl border flex items-center gap-2 shadow-xs ${
                  isLight
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-sky-600'
                    : 'bg-slate-800 text-white border-slate-700'
                }`}
              >
                <span className="text-sm font-mono opacity-80">GEAR</span>
                <span className="text-2xl">{gear}</span>
              </div>
              <span
                className={`text-xs font-semibold ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {gear === 'P'
                  ? 'PARK'
                  : gear === 'R'
                  ? 'REVERSE'
                  : gear === 'N'
                  ? 'NEUTRAL'
                  : 'DRIVE'}
              </span>
            </div>

            {/* Odometer */}
            <div className="flex flex-col items-center">
              <span
                className={`text-[10px] font-gauge tracking-wider uppercase ${
                  isLight ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                ODOMETER
              </span>
              <span
                className={`font-mono-telemetry text-sm font-bold ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                {vehicleTrip.odometerKm.toLocaleString()} km
              </span>
            </div>

            {/* Inverter Power (kW) */}
            <div className="flex flex-col items-end">
              <span
                className={`text-[10px] font-gauge tracking-wider uppercase ${
                  isLight ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                POWER OUTPUT
              </span>
              <span
                className={`font-gauge text-sm font-bold ${
                  motorTelemetry.speedKmh > 0 ? 'text-sky-600 dark:text-cyan-400' : 'text-slate-400'
                }`}
              >
                {bms.packPowerKw.toFixed(1)} kW
              </span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: ENERGY ECONOMY BAR CHART & VEHICLE STATUS ================= */}
        <div className="col-span-3 flex flex-col gap-3 justify-between">
          {/* Real-time Energy Economy Bar Chart (Prominently shown in user's image) */}
          <div
            className={`rounded-2xl p-3.5 border flex flex-col justify-between transition-all shadow-sm ${
              isLight
                ? 'bg-white/95 border-slate-200/90 shadow-slate-200/40'
                : 'bg-[#0d121c] border-slate-800/80 shadow-lg'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <TrendingDown
                    className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}
                  />
                  <span
                    className={`text-[11px] font-gauge font-bold tracking-widest uppercase ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    ENERGY ECONOMY
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono-telemetry font-bold ${
                    isLight ? 'text-emerald-700' : 'text-emerald-400'
                  }`}
                >
                  TARGET: 15.0
                </span>
              </div>

              {/* Big Readout: kWh/100 km */}
              <div className="flex items-baseline justify-between my-1">
                <div>
                  <span
                    className={`font-gauge text-2xl font-bold tracking-tight ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {currentConsumptionKwh.toFixed(1)}
                  </span>
                  <span
                    className={`text-xs font-gauge ml-1.5 font-semibold ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    kWh / 100 km
                  </span>
                </div>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    currentConsumptionKwh <= ecoTargetKwh
                      ? isLight
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-emerald-950/60 text-emerald-300'
                      : isLight
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-amber-950/60 text-amber-300'
                  }`}
                >
                  {currentConsumptionKwh <= ecoTargetKwh ? '✓ Efficient' : '+ Elevated'}
                </span>
              </div>

              {/* Historical Consumption Bar Chart */}
              <div className="relative mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* Eco Target dashed line */}
                <div
                  className="absolute left-0 right-0 border-b border-dashed border-emerald-500/60 z-10 pointer-events-none"
                  style={{
                    bottom: `${(ecoTargetKwh / maxChartVal) * 60 + 20}px`,
                  }}
                />

                <div className="h-16 flex items-end justify-between gap-1.5 px-1">
                  {consumptionHistory.map((item, idx) => {
                    const heightPercent = Math.min(100, (item.value / maxChartVal) * 100);
                    const isBelowTarget = item.value <= ecoTargetKwh;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                        {/* Bar */}
                        <div className="relative w-full flex items-end justify-center h-12">
                          <div
                            className={`w-full max-w-[18px] rounded-t-sm transition-all duration-300 ${
                              isBelowTarget
                                ? isLight
                                  ? 'bg-emerald-500 group-hover:bg-emerald-600'
                                  : 'bg-emerald-400 group-hover:bg-emerald-300'
                                : isLight
                                ? 'bg-sky-500 group-hover:bg-sky-600'
                                : 'bg-cyan-500 group-hover:bg-cyan-400'
                            }`}
                            style={{ height: `${heightPercent}%` }}
                            title={`${item.label}: ${item.value.toFixed(1)} kWh/100km`}
                          />
                        </div>
                        {/* Label */}
                        <span
                          className={`text-[9px] font-mono-telemetry ${
                            idx === consumptionHistory.length - 1
                              ? 'font-bold text-sky-600 dark:text-cyan-400'
                              : isLight
                              ? 'text-slate-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Regenerated energy banner */}
            <div
              className={`mt-2 p-2 rounded-xl border flex items-center justify-between text-[11px] font-gauge ${
                isLight
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                  : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
              }`}
            >
              <span>+3.4 kWh RECOVERED</span>
              <span className="font-mono-telemetry font-bold">REGEN LVL 2</span>
            </div>
          </div>

          {/* Vehicle Status (Battery, Range, Cabin Temperature) */}
          <div
            className={`rounded-2xl p-3.5 border flex flex-col justify-between transition-all shadow-sm ${
              isLight
                ? 'bg-white/95 border-slate-200/90 shadow-slate-200/40'
                : 'bg-[#0d121c] border-slate-800/80 shadow-lg'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-gauge font-bold tracking-widest uppercase ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  VEHICLE STATUS
                </span>
                <button
                  onClick={() => onNavigateTo('telemetry')}
                  className={`text-[10px] font-gauge font-bold flex items-center gap-0.5 hover:underline ${
                    isLight ? 'text-sky-600' : 'text-cyan-400'
                  }`}
                >
                  <span>ALL METRICS</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Status Metric List */}
              <div className="space-y-2">
                {/* Battery card */}
                <div
                  onClick={() => onNavigateTo('telemetry')}
                  className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                    isLight
                      ? 'bg-slate-50 hover:bg-sky-50 border-slate-200 hover:border-sky-300'
                      : 'bg-[#080d17] hover:bg-slate-800/60 border-slate-800/80 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isLight
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/50'
                      }`}
                    >
                      <Battery className="w-4 h-4" />
                    </div>
                    <div>
                      <span
                        className={`text-[11px] block font-medium ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      >
                        Battery Pack
                      </span>
                      <span
                        className={`text-sm font-gauge font-bold ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {bms.soc.toFixed(0)}% · 84.6 kWh
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}
                  />
                </div>

                {/* Range card */}
                <div
                  onClick={() => onNavigateTo('telemetry')}
                  className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                    isLight
                      ? 'bg-slate-50 hover:bg-sky-50 border-slate-200 hover:border-sky-300'
                      : 'bg-[#080d17] hover:bg-slate-800/60 border-slate-800/80 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isLight
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-blue-950/60 text-blue-400 border border-blue-700/50'
                      }`}
                    >
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <span
                        className={`text-[11px] block font-medium ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      >
                        Estimated Range
                      </span>
                      <span
                        className={`text-sm font-gauge font-bold ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {vehicleTrip.estimatedRangeKm} km
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}
                  />
                </div>

                {/* Temperature card */}
                <div
                  onClick={() => onNavigateTo('telemetry')}
                  className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                    isLight
                      ? 'bg-slate-50 hover:bg-sky-50 border-slate-200 hover:border-sky-300'
                      : 'bg-[#080d17] hover:bg-slate-800/60 border-slate-800/80 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isLight
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-purple-950/60 text-purple-400 border border-purple-700/50'
                      }`}
                    >
                      <Thermometer className="w-4 h-4" />
                    </div>
                    <div>
                      <span
                        className={`text-[11px] block font-medium ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      >
                        Cabin / Ambient
                      </span>
                      <span
                        className={`text-sm font-gauge font-bold ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        21.5°C / {vehicleTrip.ambientTempC}°C
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}
                  />
                </div>
              </div>
            </div>

            {/* Quick Diagnostic Pill */}
            <div
              onClick={() => onNavigateTo('diagnostics')}
              className={`mt-2 flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800/60 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-gauge">OBD-II Systems Nominal</span>
              </div>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. BOTTOM ROW: MEDIA, SYSTEM VOLUME CARD & QUICK CONTROLS ================= */}
      <div className="grid grid-cols-12 gap-3">
        {/* Media Player Card */}
        <div
          className={`col-span-4 rounded-2xl p-3 border flex items-center justify-between shadow-sm transition-all ${
            isLight
              ? 'bg-white/95 border-slate-200/90 shadow-slate-200/40'
              : 'bg-[#0d121c] border-slate-800/80 shadow-md'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Album art */}
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden relative shadow-inner border ${
                isLight
                  ? 'bg-gradient-to-tr from-sky-100 via-indigo-100 to-rose-100 border-slate-200 text-sky-600'
                  : 'bg-gradient-to-tr from-slate-900 via-rose-950 to-indigo-950 border-slate-700/60 text-rose-400'
              }`}
            >
              <Disc3
                className={`w-6 h-6 ${isPlayingMedia ? 'animate-spin' : ''}`}
                style={{ animationDuration: '4s' }}
              />
            </div>
            <div className="overflow-hidden">
              <span
                className={`text-xs font-semibold block truncate max-w-[130px] ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}
              >
                The Road Ahead
              </span>
              <span
                className={`text-[11px] block truncate max-w-[130px] ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Maverick · Ishmin Audio
              </span>
            </div>
          </div>

          {/* Playback Controls */}
          <div
            className={`flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            <button
              className={`p-1.5 rounded-lg transition-colors ${
                isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
              }`}
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={onTogglePlayMedia}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 flex items-center justify-center text-white transition-all shadow-xs"
              title={isPlayingMedia ? 'Pause' : 'Play'}
            >
              {isPlayingMedia ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <button
              className={`p-1.5 rounded-lg transition-colors ${
                isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
              }`}
              title="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* System & Media Volume Widget (Matching User Reference Image) */}
        <div
          className={`col-span-4 rounded-2xl p-3 border flex flex-col justify-between shadow-sm transition-all ${
            isLight
              ? 'bg-white/95 border-slate-200/90 shadow-slate-200/40'
              : 'bg-[#0d121c] border-slate-800/80 shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1 rounded-lg transition-colors ${
                  isMuted
                    ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                    : isLight
                    ? 'text-sky-600 hover:bg-slate-100'
                    : 'text-cyan-400 hover:bg-slate-800'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : systemVolume > 50 ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <Volume1 className="w-4 h-4" />
                )}
              </button>
              <span
                className={`text-[11px] font-gauge font-bold tracking-wider uppercase ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                MEDIA VOLUME
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className={`text-xs font-gauge font-bold ${
                  isMuted ? 'text-rose-500' : isLight ? 'text-slate-900' : 'text-cyan-400'
                }`}
              >
                {isMuted ? 'MUTED' : `${systemVolume}%`}
              </span>
            </div>
          </div>

          {/* Volume Slider with +/- buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => stepVolume(-5)}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="Decrease Volume (-5%)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Slider track */}
            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : systemVolume}
                onChange={handleVolumeChange}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-sky-600 bg-slate-200 dark:bg-slate-800"
              />
            </div>

            <button
              onClick={() => stepVolume(+5)}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="Increase Volume (+5%)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Projection Card */}
        <div
          onClick={() => onNavigateTo('projection')}
          className={`col-span-2 rounded-2xl p-3 border flex items-center justify-between cursor-pointer group shadow-sm transition-all ${
            isLight
              ? 'bg-white/95 border-slate-200/90 hover:border-sky-400 hover:shadow-md'
              : 'bg-[#0d121c] border-slate-800/80 hover:border-cyan-500/40 shadow-md'
          }`}
          title="Apple CarPlay & Android Auto Manager"
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                isLight
                  ? 'bg-sky-100 text-sky-700 border-sky-200'
                  : 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30'
              }`}
            >
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span
                className={`text-xs font-semibold block ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}
              >
                CarPlay / AA
              </span>
              <span
                className={`text-[10px] block font-gauge font-bold ${
                  isLight ? 'text-sky-600' : 'text-cyan-400'
                }`}
              >
                Wireless Link
              </span>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-colors ${
              isLight
                ? 'text-slate-400 group-hover:text-sky-600'
                : 'text-slate-600 group-hover:text-cyan-400'
            }`}
          />
        </div>

        {/* Settings & System Card */}
        <div
          onClick={() => onNavigateTo('settings')}
          className={`col-span-2 rounded-2xl p-3 border flex items-center justify-between cursor-pointer group shadow-sm transition-all ${
            isLight
              ? 'bg-white/95 border-slate-200/90 hover:border-sky-400 hover:shadow-md'
              : 'bg-[#0d121c] border-slate-800/80 hover:border-cyan-500/40 shadow-md'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                isLight
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
            >
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <span
                className={`text-xs font-semibold block ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}
              >
                Settings
              </span>
              <span
                className={`text-[10px] block ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Vehicle HMI
              </span>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-colors ${
              isLight
                ? 'text-slate-400 group-hover:text-sky-600'
                : 'text-slate-600 group-hover:text-cyan-400'
            }`}
          />
        </div>
      </div>

      {/* ================= 4. FLOATING FROSTED BOTTOM DOCK ================= */}
      <nav
        className={`relative z-10 flex items-center justify-around px-4 py-2 mt-2 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white/90 border-slate-200/90 backdrop-blur-md shadow-md shadow-slate-200/50'
            : 'bg-[#0c101a]/90 border-slate-800/80 backdrop-blur-md shadow-lg'
        }`}
      >
        <button
          onClick={() => onNavigateTo('dashboard')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-gauge font-bold transition-all ${
            isLight
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-cyan-600 text-white shadow-md'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>DASHBOARD</span>
        </button>

        <button
          onClick={() => onNavigateTo('navigation')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-gauge font-bold transition-all ${
            isLight
              ? 'text-slate-600 hover:text-sky-600 hover:bg-slate-100'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>NAVIGATION</span>
        </button>

        <button
          onClick={() => onNavigateTo('telemetry')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-gauge font-bold transition-all ${
            isLight
              ? 'text-slate-600 hover:text-sky-600 hover:bg-slate-100'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>TELEMETRY</span>
        </button>

        <button
          onClick={() => onNavigateTo('projection')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-gauge font-bold transition-all ${
            isLight
              ? 'text-slate-600 hover:text-sky-600 hover:bg-slate-100'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>PROJECTION</span>
        </button>

        <button
          onClick={() => onNavigateTo('wifi')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-gauge font-bold transition-all ${
            isLight
              ? 'text-slate-600 hover:text-sky-600 hover:bg-slate-100'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span>WI-FI</span>
        </button>

        <button
          onClick={() => onNavigateTo('clouddb')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-gauge font-bold transition-all ${
            isLight
              ? 'text-slate-600 hover:text-sky-600 hover:bg-slate-100'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>CLOUD SYNC</span>
        </button>

        <button
          onClick={() => onNavigateTo('circuit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-gauge font-bold transition-all ${
            isLight
              ? 'text-slate-600 hover:text-sky-600 hover:bg-slate-100'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>CIRCUIT EDA</span>
        </button>

        <button
          onClick={() => onNavigateTo('settings')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-gauge font-bold transition-all ${
            isLight
              ? 'text-slate-600 hover:text-sky-600 hover:bg-slate-100'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>SETTINGS</span>
        </button>
      </nav>
    </div>
  );
};
