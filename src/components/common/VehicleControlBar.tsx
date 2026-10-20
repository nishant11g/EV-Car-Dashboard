/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Floating Vehicle & Bench Test Control Bar
 * Responsive to Silver-Ice Light Theme and Obsidian Cyber Dark Theme.
 */

import React from 'react';
import {
  Gear,
  DriveMode,
  TelltaleState
} from '../../types/telemetry';
import { useTheme } from '../../context/ThemeContext';
import {
  Sliders,
  AlertTriangle,
  Lightbulb,
  Radio,
  DoorOpen,
  Monitor,
  Database,
  Flame
} from 'lucide-react';

interface VehicleControlBarProps {
  speed: number;
  gear: Gear;
  driveMode: DriveMode;
  telltales: TelltaleState;
  isIviCrashed: boolean;
  onSpeedChange: (speed: number) => void;
  onGearChange: (gear: Gear) => void;
  onToggleLeftIndicator: () => void;
  onToggleRightIndicator: () => void;
  onToggleHazards: () => void;
  onToggleHighBeam: () => void;
  onToggleFogLamps: () => void;
  onToggleSeatbelt: () => void;
  onToggleDoorAjar: () => void;
  onToggleCriticalFault: () => void;
  onToggleIviCrash: () => void;
  onOpenCanMatrix: () => void;
  onOpenVirtualDisplayModal: () => void;
}

export const VehicleControlBar: React.FC<VehicleControlBarProps> = ({
  speed,
  gear,
  driveMode,
  telltales,
  isIviCrashed,
  onSpeedChange,
  onGearChange,
  onToggleLeftIndicator,
  onToggleRightIndicator,
  onToggleHazards,
  onToggleHighBeam,
  onToggleFogLamps,
  onToggleSeatbelt,
  onToggleDoorAjar,
  onToggleCriticalFault,
  onToggleIviCrash,
  onOpenCanMatrix,
  onOpenVirtualDisplayModal,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className={`w-full backdrop-blur-md border-t px-4 py-2.5 flex items-center justify-between gap-3 text-xs z-30 select-none transition-colors duration-300 ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
          : 'bg-[#050811]/95 border-slate-800/90 text-white'
      }`}
    >
      {/* 1. Gear Selector Buttons */}
      <div
        className={`flex items-center gap-1.5 p-1 rounded-xl border ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0a0f1b] border-slate-800'
        }`}
      >
        <span
          className={`text-[10px] font-gauge font-bold px-1 ${
            isLight ? 'text-slate-500' : 'text-slate-500'
          }`}
        >
          GEAR:
        </span>
        {(['P', 'R', 'N', 'D'] as Gear[]).map((g) => (
          <button
            key={g}
            onClick={() => onGearChange(g)}
            className={`w-7 h-7 rounded-lg font-gauge font-bold text-xs transition-all ${
              gear === g
                ? g === 'P'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : g === 'R'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : isLight
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-cyan-600 text-white shadow-xs'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
            title={g === 'R' ? 'R: Reverse (Triggers AHD Camera)' : `Select Gear ${g}`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* 2. Speed Slider (Simulated Accelerator) */}
      <div
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border flex-1 max-w-xs ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0a0f1b] border-slate-800'
        }`}
      >
        <Sliders className={`w-3.5 h-3.5 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
        <span
          className={`text-[10px] font-gauge font-bold ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          SPEED:
        </span>
        <input
          type="range"
          min="0"
          max="160"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full accent-sky-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded cursor-pointer"
        />
        <span
          className={`font-gauge font-bold w-10 text-right ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          {Math.round(speed)}
        </span>
      </div>

      {/* 3. Indicators & Lights Controls */}
      <div
        className={`flex items-center gap-1.5 p-1 rounded-xl border ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0a0f1b] border-slate-800'
        }`}
      >
        <button
          onClick={onToggleLeftIndicator}
          className={`px-2 py-1 rounded text-[11px] font-gauge transition-colors ${
            telltales.leftIndicator
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
              : isLight
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Left Turn Indicator"
        >
          ◄ L
        </button>
        <button
          onClick={onToggleHazards}
          className={`px-2 py-1 rounded text-[11px] font-gauge transition-colors ${
            telltales.leftIndicator && telltales.rightIndicator
              ? 'bg-amber-100 text-amber-800 border border-amber-300 font-bold'
              : isLight
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Hazard Flashers"
        >
          ▲ HAZARD
        </button>
        <button
          onClick={onToggleRightIndicator}
          className={`px-2 py-1 rounded text-[11px] font-gauge transition-colors ${
            telltales.rightIndicator
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
              : isLight
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Right Turn Indicator"
        >
          R ►
        </button>

        <div className={`h-4 w-[1px] mx-0.5 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

        <button
          onClick={onToggleHighBeam}
          className={`p-1.5 rounded transition-colors ${
            telltales.highBeam
              ? 'bg-blue-100 text-blue-800 border border-blue-300'
              : isLight
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle High Beam Headlamp"
        >
          <Lightbulb className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onToggleFogLamps}
          className={`p-1.5 rounded transition-colors ${
            telltales.fogLamps
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : isLight
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Fog Lamps"
        >
          <Radio className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. Faults & Body Signals */}
      <div
        className={`flex items-center gap-1.5 p-1 rounded-xl border ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0a0f1b] border-slate-800'
        }`}
      >
        <button
          onClick={onToggleSeatbelt}
          className={`px-2 py-1 rounded text-[10px] font-gauge transition-colors ${
            telltales.seatbeltReminder
              ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold'
              : isLight
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Seatbelt Unlatched Reminder"
        >
          SEATBELT
        </button>
        <button
          onClick={onToggleDoorAjar}
          className={`px-2 py-1 rounded text-[10px] font-gauge transition-colors ${
            telltales.doorAjar
              ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold'
              : isLight
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Driver Door Ajar"
        >
          <DoorOpen className="w-3 h-3 inline mr-1" />
          DOOR
        </button>
        <button
          onClick={onToggleCriticalFault}
          className={`px-2 py-1 rounded text-[10px] font-gauge transition-colors ${
            telltales.hvFault
              ? 'bg-rose-600 text-white animate-pulse font-bold'
              : isLight
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Inject High Voltage Contactor / Isolation Fault"
        >
          <AlertTriangle className="w-3 h-3 inline mr-1" />
          HV FAULT
        </button>
      </div>

      {/* 5. Subsystem Decoupling Test (Simulate IVI Crash) */}
      <button
        onClick={onToggleIviCrash}
        className={`px-3 py-1.5 rounded-xl text-xs font-gauge font-bold border transition-all flex items-center gap-1.5 ${
          isIviCrashed
            ? 'bg-rose-900 text-white border-rose-500 animate-pulse shadow-md'
            : isLight
            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 shadow-xs'
            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
        }`}
        title="RFQ 2.0 Critical Test: Crash IVI OS and verify Cluster remains 100% active and unhampered!"
      >
        <Flame className={`w-3.5 h-3.5 ${isIviCrashed ? 'text-white' : 'text-rose-500'}`} />
        <span>{isIviCrashed ? 'RECOVER IVI' : 'CRASH IVI (ISOLATION TEST)'}</span>
      </button>

      {/* 6. Inspection Drawers */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCanMatrix}
          className={`font-gauge text-xs px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
            isLight
              ? 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-300 shadow-xs'
              : 'bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border-cyan-500/40'
          }`}
          title="Inspect CAN-to-telemetry signal decoding matrix"
        >
          <Database className="w-3.5 h-3.5" />
          <span>CAN MATRIX</span>
        </button>

        <button
          onClick={onOpenVirtualDisplayModal}
          className={`font-gauge text-xs px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
            isLight
              ? 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-300 shadow-xs'
              : 'bg-blue-950/70 hover:bg-blue-900/80 text-blue-300 border-blue-500/40'
          }`}
          title="Android 14/15 Virtual Display Emulation & Hardware Configuration"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>HARDWARE & VIRTUAL DISPLAY</span>
        </button>
      </div>
    </div>
  );
};
