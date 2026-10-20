/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Vehicle Settings & Theme Configuration
 */

import React, { useState } from 'react';
import { DriveMode, RegenLevel } from '../../types/telemetry';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowLeft,
  Sun,
  Moon,
  Volume2,
  Shield,
  Zap,
  Car,
  Check,
  Sparkles,
  Sliders
} from 'lucide-react';

interface SettingsScreenProps {
  driveMode: DriveMode;
  regenLevel: RegenLevel;
  onBack: () => void;
  onSetDriveMode: (mode: DriveMode) => void;
  onSetRegenLevel: (level: RegenLevel) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  driveMode,
  regenLevel,
  onBack,
  onSetDriveMode,
  onSetRegenLevel,
}) => {
  const { theme, setTheme } = useTheme();
  const isLight = theme === 'light';

  const [brightness, setBrightness] = useState(85);
  const [soundTestPlayed, setSoundTestPlayed] = useState(false);

  const testSecondaryBuzzer = () => {
    setSoundTestPlayed(true);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {
      // Audio fallback
    }
    setTimeout(() => setSoundTestPlayed(false), 800);
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between p-4 overflow-y-auto select-none font-sans transition-colors duration-300 ${
        isLight
          ? 'bg-gradient-to-br from-[#f8fafc] via-[#edf2f7] to-[#e2e8f0] text-slate-800'
          : 'bg-[#070b14] text-white'
      }`}
    >
      {/* Top Header */}
      <div
        className={`flex items-center justify-between pb-3 border-b ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-gauge font-bold transition-colors ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
                : 'bg-[#0e1424] hover:border-cyan-500 border-slate-700 text-slate-200'
            }`}
          >
            <ArrowLeft className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
            <span>BACK</span>
          </button>
          <div>
            <h2
              className={`text-base font-gauge font-bold tracking-wide ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              VEHICLE CONTROLS & HMI THEME CONFIGURATION
            </h2>
            <span
              className={`text-[11px] font-mono-telemetry ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              SILVER-ICE LUMINESCENT THEME · POWERTRAIN CALIBRATION · SAFETY BUZZER
            </span>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 text-xs font-mono-telemetry ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          <span>ISHMIN COCKPIT BUILD v2.4-AOSP15</span>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-12 gap-3.5 my-3 flex-1 items-stretch">
        {/* Drive Mode & Regen Column */}
        <div className="col-span-6 space-y-3.5">
          {/* THEME SELECTION CARD (Matching user reference image) */}
          <div
            className={`p-4 rounded-2xl border shadow-sm transition-all ${
              isLight
                ? 'bg-white/95 border-slate-200 shadow-slate-200/50'
                : 'bg-[#0b101c] border-slate-800 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
                <span
                  className={`text-xs font-gauge font-bold uppercase tracking-wider ${
                    isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  COCKPIT HMI THEME
                </span>
              </div>
              <span
                className={`text-[10px] font-gauge font-bold px-2 py-0.5 rounded-full ${
                  isLight
                    ? 'bg-sky-100 text-sky-800 border border-sky-200'
                    : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                }`}
              >
                {isLight ? 'ACTIVE: REFERENCE IMAGE THEME' : 'ACTIVE: OBSIDIAN DARK'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Option 1: Silver-Ice Luminescent Light Theme (From Reference Image) */}
              <button
                onClick={() => setTheme('light')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isLight
                    ? 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-500/30 shadow-md text-slate-900'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-gauge font-bold text-xs">SILVER ICE</span>
                  </div>
                  {isLight && <Check className="w-4 h-4 text-sky-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Luminescent pale silver & white cards with electric azure accents from reference image.
                </p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300" />
                  <span className="w-4 h-4 rounded-full bg-sky-500" />
                  <span className="w-4 h-4 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono-telemetry text-slate-400 ml-1">Luminance Day Mode</span>
                </div>
              </button>

              {/* Option 2: Obsidian Cyber Dark Theme */}
              <button
                onClick={() => setTheme('dark')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  !isLight
                    ? 'bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-500/30 shadow-md text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-800 text-cyan-400 flex items-center justify-center">
                      <Moon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-gauge font-bold text-xs">OBSIDIAN CYBER</span>
                  </div>
                  {!isLight && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Deep space obsidian black cockpit with neon cyan and glowing amber instrumentation.
                </p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-slate-950 border border-slate-700" />
                  <span className="w-4 h-4 rounded-full bg-cyan-400" />
                  <span className="w-4 h-4 rounded-full bg-blue-600" />
                  <span className="text-[10px] font-mono-telemetry text-slate-400 ml-1">Night OLED Mode</span>
                </div>
              </button>
            </div>
          </div>

          {/* Drive Mode Card */}
          <div
            className={`p-4 rounded-2xl border shadow-sm transition-all ${
              isLight
                ? 'bg-white/95 border-slate-200 shadow-slate-200/50'
                : 'bg-[#0b101c] border-slate-800 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs font-gauge font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                POWERTRAIN DRIVE MODE
              </span>
              <Car className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['ECO', 'NORMAL', 'SPORT'] as DriveMode[]).map((mode) => {
                const isActive = driveMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => onSetDriveMode(mode)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isActive
                        ? mode === 'SPORT'
                          ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-sm'
                          : mode === 'NORMAL'
                          ? isLight
                            ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-sm'
                            : 'bg-blue-950/60 border-blue-500 text-blue-400 shadow-md'
                          : isLight
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                          : 'bg-emerald-950/60 border-emerald-500 text-emerald-400 shadow-md'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        : 'bg-[#070b14] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-gauge font-bold text-sm">{mode}</span>
                    <span className="text-[10px] mt-1 opacity-75">
                      {mode === 'ECO' ? 'Range Focus' : mode === 'NORMAL' ? 'Balanced' : 'Full Power'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regenerative Braking Level */}
          <div
            className={`p-4 rounded-2xl border shadow-sm transition-all ${
              isLight
                ? 'bg-white/95 border-slate-200 shadow-slate-200/50'
                : 'bg-[#0b101c] border-slate-800 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs font-gauge font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                REGENERATIVE BRAKING STRENGTH
              </span>
              <Zap className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {([0, 1, 2, 3] as RegenLevel[]).map((lvl) => {
                const isActive = regenLevel === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => onSetRegenLevel(lvl)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isActive
                        ? isLight
                          ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-sm'
                          : 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-md'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        : 'bg-[#070b14] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-gauge font-bold text-sm">LVL {lvl}</span>
                    <span className="text-[9px] mt-1 opacity-75">
                      {lvl === 0 ? 'Coast' : lvl === 1 ? 'Low' : lvl === 2 ? 'Standard' : '1-Pedal'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Display, Sound & Hardware Column */}
        <div className="col-span-6 space-y-3.5">
          {/* Display Brightness */}
          <div
            className={`p-4 rounded-2xl border shadow-sm transition-all ${
              isLight
                ? 'bg-white/95 border-slate-200 shadow-slate-200/50'
                : 'bg-[#0b101c] border-slate-800 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-gauge font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                DISPLAY LUMINANCE (BACKLIGHT)
              </span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>

            <div className="flex items-center gap-4 my-2">
              <input
                type="range"
                min="20"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-sky-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <span
                className={`text-xs font-gauge font-bold w-12 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {brightness}%
              </span>
            </div>
            <span
              className={`text-[11px] block ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Hardware target: &gt;500 nits IVI / &gt;600 nits Cluster for direct sunlight legibility.
            </span>
          </div>

          {/* Safety Alert Chime (Section 3.3) */}
          <div
            className={`p-4 rounded-2xl border shadow-sm transition-all ${
              isLight
                ? 'bg-white/95 border-slate-200 shadow-slate-200/50'
                : 'bg-[#0b101c] border-slate-800 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-gauge font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                INDEPENDENT SAFETY CHIME SPEAKER (RFQ 3.3)
              </span>
              <Volume2 className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
            </div>

            <p
              className={`text-xs mb-3 leading-relaxed ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Dedicated secondary buzzer ensures turn signal clicks and seatbelt alerts remain audible if the Android media stack freezes.
            </p>

            <div
              className={`flex items-center justify-between p-3 rounded-xl border ${
                isLight
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-[#070b14] border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span
                  className={`text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}
                >
                  Secondary 85dB Piezoceramic Chime
                </span>
              </div>
              <button
                onClick={testSecondaryBuzzer}
                className={`font-gauge text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 text-sky-700 border-slate-300 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border-slate-700'
                }`}
              >
                {soundTestPlayed ? 'CHIME SOUNDING...' : 'TEST CHIME'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
