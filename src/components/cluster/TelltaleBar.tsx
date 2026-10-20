/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - AIS-071 / ISO 2575 Regulatory Telltale Strip
 */

import React from 'react';
import { TelltaleState } from '../../types/telemetry';
import {
  AlertTriangle,
  Zap,
  BatteryWarning,
  Disc,
  ShieldAlert,
  Car,
  Lightbulb,
  Radio,
  Power
} from 'lucide-react';

interface TelltaleBarProps {
  telltales: TelltaleState;
  isFlashing: boolean;
  className?: string;
}

export const TelltaleBar: React.FC<TelltaleBarProps> = ({
  telltales,
  isFlashing,
  className = ''
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-3 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-slate-800/80 shadow-inner ${className}`}
      aria-label="Vehicle Regulatory Telltales"
    >
      {/* 1. Left Directional Indicator (1.5 Hz flash) */}
      <div
        className={`flex items-center justify-center w-6 h-6 transition-opacity ${
          telltales.leftIndicator && isFlashing
            ? 'text-emerald-400 glow-green opacity-100'
            : 'text-slate-700 opacity-20'
        }`}
        title="Left Turn Indicator (AIS-071)"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M14 6l-6 6 6 6V6z" />
        </svg>
      </div>

      {/* 2. READY - Powertrain Drive Active (Green) */}
      <div
        className={`flex items-center px-2 py-0.5 rounded text-[11px] font-gauge font-bold tracking-widest uppercase transition-all ${
          telltales.ready
            ? 'text-emerald-400 border border-emerald-500/50 bg-emerald-950/40 glow-green'
            : 'text-slate-700 border border-transparent opacity-20'
        }`}
        title="Vehicle READY - Contactors Closed"
      >
        READY
      </div>

      {/* 3. High Beam (Blue) */}
      <div
        className={`w-5 h-5 flex items-center justify-center transition-all ${
          telltales.highBeam
            ? 'text-blue-500 glow-blue opacity-100'
            : 'text-slate-700 opacity-20'
        }`}
        title="High Beam Headlamp (ISO 2575)"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
          <path d="M4 12h16M4 8h16M4 16h16" />
          <path d="M18 6a6 6 0 0 1 0 12" />
        </svg>
      </div>

      {/* 4. Position / Parking Lamps (Green) */}
      <div
        className={`w-5 h-5 flex items-center justify-center transition-all ${
          telltales.positionLamps
            ? 'text-emerald-400 glow-green opacity-100'
            : 'text-slate-700 opacity-20'
        }`}
        title="Position / Parking Lamps"
      >
        <Lightbulb className="w-4 h-4" />
      </div>

      {/* 5. Front/Rear Fog Lamps (Amber/Green) */}
      <div
        className={`w-5 h-5 flex items-center justify-center transition-all ${
          telltales.fogLamps
            ? 'text-amber-400 glow-amber opacity-100'
            : 'text-slate-700 opacity-20'
        }`}
        title="Fog Lamps"
      >
        <Radio className="w-4 h-4" />
      </div>

      {/* 6. High Voltage Critical Fault (Red Vehicle with !) */}
      <div
        className={`w-5 h-5 flex items-center justify-center transition-all ${
          telltales.hvFault
            ? 'text-red-500 glow-red animate-pulse opacity-100'
            : 'text-slate-700 opacity-20'
        }`}
        title="HV Isolation / Contactor Fault"
      >
        <Zap className="w-4 h-4" />
      </div>

      {/* 7. Turtle / Limited Power Derating (Amber) */}
      <div
        className={`w-5 h-5 flex items-center justify-center transition-all ${
          telltales.turtleMode
            ? 'text-amber-400 glow-amber opacity-100'
            : 'text-slate-700 opacity-20'
        }`}
        title="Turtle Mode - Power Derated"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          {/* Turtle Silhouette */}
          <path d="M12 4a5 5 0 0 0-5 5v1H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v1a5 5 0 0 0 10 0v-1h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2V9a5 5 0 0 0-5-5z" />
        </svg>
      </div>

      {/* 8. Low Traction SoC (Amber) */}
      <div
        className={`w-5 h-5 flex items-center justify-center transition-all ${
          telltales.lowSoc
            ? 'text-amber-400 glow-amber opacity-100'
            : 'text-slate-700 opacity-20'
        }`}
        title="Low Traction Battery SoC (<15%)"
      >
        <BatteryWarning className="w-4 h-4" />
      </div>

      {/* 9. Charging Gun Locked (Amber/Green) */}
      <div
        className={`w-5 h-5 flex items-center justify-center transition-all ${
          telltales.chargingGunLocked
            ? 'text-cyan-400 glow-cyan opacity-100'
            : 'text-slate-700 opacity-20'
        }`}
        title="Charging Gun Locked - Drive Interlock Active"
      >
        <Power className="w-4 h-4" />
      </div>

      {/* 10. Brake / Park Brake (Solid Red P) */}
      <div
        className={`w-5 h-5 flex items-center justify-center font-bold text-xs transition-all ${
          telltales.parkingBrake
            ? 'text-red-500 glow-red border border-red-500 rounded-full w-5 h-5 opacity-100'
            : 'text-slate-700 border border-slate-800 rounded-full w-5 h-5 opacity-20'
        }`}
        title="Park Brake Engaged (P)"
      >
        P
      </div>

      {/* 11. ABS Fault (Amber) */}
      <div
        className={`px-1 py-0.2 rounded font-bold text-[10px] tracking-tight transition-all ${
          telltales.absFault
            ? 'text-amber-400 border border-amber-500/60 glow-amber opacity-100'
            : 'text-slate-700 border border-slate-800/40 opacity-20'
        }`}
        title="ABS System Status"
      >
        ABS
      </div>

      {/* 12. ESC / ESP Intervention (Amber) */}
      <div
        className={`w-5 h-5 flex items-center justify-center transition-all ${
          telltales.escIntervention
            ? 'text-amber-400 glow-amber opacity-100'
            : 'text-slate-700 opacity-20'
        }`}
        title="ESC Stability Control"
      >
        <Disc className="w-4 h-4" />
      </div>

      {/* 13. EPAS Steering Warning (Red/Amber) */}
      <div
        className={`w-5 h-5 flex items-center justify-center transition-all ${
          telltales.epasFault
            ? 'text-red-500 glow-red opacity-100'
            : 'text-slate-700 opacity-20'
        }`}
        title="EPAS Steering Assist Warning"
      >
        <ShieldAlert className="w-4 h-4" />
      </div>

      {/* 14. Seatbelt Reminder (Red) */}
      <div
        className={`w-5 h-5 flex items-center justify-center transition-all ${
          telltales.seatbeltReminder
            ? isFlashing
              ? 'text-red-500 glow-red opacity-100'
              : 'text-red-800 opacity-60'
            : 'text-slate-700 opacity-20'
        }`}
        title="Seatbelt Reminder"
      >
        <AlertTriangle className="w-4 h-4" />
      </div>

      {/* 15. Door / Bonnet Ajar (Red) */}
      <div
        className={`w-5 h-5 flex items-center justify-center transition-all ${
          telltales.doorAjar || telltales.bonnetAjar
            ? 'text-red-500 glow-red opacity-100'
            : 'text-slate-700 opacity-20'
        }`}
        title="Door or Bonnet Ajar"
      >
        <Car className="w-4 h-4" />
      </div>

      {/* 16. Right Directional Indicator (1.5 Hz flash) */}
      <div
        className={`flex items-center justify-center w-6 h-6 transition-opacity ${
          telltales.rightIndicator && isFlashing
            ? 'text-emerald-400 glow-green opacity-100'
            : 'text-slate-700 opacity-20'
        }`}
        title="Right Turn Indicator (AIS-071)"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M10 6l6 6-6 6V6z" />
        </svg>
      </div>
    </div>
  );
};
