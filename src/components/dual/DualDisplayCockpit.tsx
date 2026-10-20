/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Dual Display Testing Cockpit (Simultaneous Multi-Display View)
 * Displays both the Digital Instrument Cluster and IVI Screen concurrently
 * Responsive to the Silver-Ice Luminescent Theme and Obsidian Cyber Dark Theme.
 */

import React from 'react';
import { InstrumentCluster } from '../cluster/InstrumentCluster';
import { IviDashboard } from '../ivi/IviDashboard';
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
import { Monitor, Tv, Flame, ShieldCheck } from 'lucide-react';

interface DualDisplayCockpitProps {
  bms: BmsData;
  motorTelemetry: MotorTelemetry;
  vehicleTrip: VehicleTripData;
  gear: Gear;
  driveMode: DriveMode;
  telltales: TelltaleState;
  telematics: TelematicsStatus;
  isFlashing: boolean;
  isPlayingMedia: boolean;
  isIviCrashed: boolean;
  onTogglePlayMedia: () => void;
  onNavigateToIviScreen: (screen: 'dashboard' | 'navigation' | 'telemetry' | 'diagnostics' | 'telematics' | 'settings' | 'camera' | 'wifi' | 'projection' | 'clouddb' | 'hardware' | 'circuit') => void;
  onToggleDriveMode: () => void;
  onRecoverIvi: () => void;
}

export const DualDisplayCockpit: React.FC<DualDisplayCockpitProps> = ({
  bms,
  motorTelemetry,
  vehicleTrip,
  gear,
  driveMode,
  telltales,
  telematics,
  isFlashing,
  isPlayingMedia,
  isIviCrashed,
  onTogglePlayMedia,
  onNavigateToIviScreen,
  onToggleDriveMode,
  onRecoverIvi,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className={`w-full flex-1 flex flex-col p-3 gap-3 overflow-y-auto select-none font-sans transition-colors duration-300 ${
        isLight ? 'bg-[#edf2f7]' : 'bg-[#04060b]'
      }`}
    >
      {/* Dual Display Header Info Banner */}
      <div
        className={`flex items-center justify-between px-4 py-2 rounded-xl border text-xs shadow-xs ${
          isLight
            ? 'bg-white border-slate-200 text-slate-700'
            : 'bg-[#090e1a] border-slate-800 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 font-gauge font-bold ${
              isLight ? 'text-sky-600' : 'text-cyan-400'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>DUAL-DISPLAY VIRTUAL BENCH ENVIRONMENT</span>
          </div>
          <span className="text-slate-400">|</span>
          <span
            className={`text-[11px] font-mono-telemetry ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            DISPLAY ID 1 (CLUSTER: 1920×720) & DISPLAY ID 0 (IVI: 1280×720) RUNNING IN SYNC
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isIviCrashed ? (
            <div className="flex items-center gap-2 bg-rose-950/80 text-rose-300 px-3 py-1 rounded-lg border border-rose-500/50 font-gauge text-[11px]">
              <Flame className="w-3.5 h-3.5 animate-pulse text-rose-400" />
              <span>ISOLATION ACTIVE: IVI CRASHED · CLUSTER OPERATIONAL</span>
              <button
                onClick={onRecoverIvi}
                className="underline ml-1 hover:text-white"
              >
                Restore
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-600 font-gauge text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>SUBSYSTEM DECOUPLING VALIDATED (FAIL-SAFE)</span>
            </div>
          )}
        </div>
      </div>

      {/* Screen 1: Top / Dedicated Instrument Cluster */}
      <div
        className={`flex flex-col rounded-2xl overflow-hidden border shadow-xl relative ${
          isLight ? 'border-slate-300 bg-slate-900 shadow-slate-300/40' : 'border-slate-800 bg-black shadow-2xl'
        }`}
      >
        <div
          className={`px-4 py-1.5 flex items-center justify-between text-[11px] font-gauge border-b ${
            isLight
              ? 'bg-slate-800 text-slate-300 border-slate-700'
              : 'bg-[#080d17] text-slate-400 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <strong className="text-white">DISPLAY 1: DIGITAL INSTRUMENT CLUSTER (BAR-TYPE 1920×720 / 1280×480)</strong>
          </div>
          <span className="text-emerald-400 font-mono-telemetry">&lt; 50MS CAN RENDER LATENCY</span>
        </div>

        {/* Cluster Container */}
        <div className="w-full h-[320px] relative">
          <InstrumentCluster
            telltales={telltales}
            bms={bms}
            motorTelemetry={motorTelemetry}
            vehicleTrip={vehicleTrip}
            gear={gear}
            driveMode={driveMode}
            isFlashing={isFlashing}
          />
        </div>
      </div>

      {/* Screen 2: Bottom / In-Vehicle Infotainment (IVI) Screen */}
      <div
        className={`flex flex-col rounded-2xl overflow-hidden border shadow-xl relative ${
          isLight
            ? 'border-slate-300 bg-white shadow-slate-300/40'
            : 'border-slate-800 bg-black shadow-2xl'
        }`}
      >
        <div
          className={`px-4 py-1.5 flex items-center justify-between text-[11px] font-gauge border-b ${
            isLight
              ? 'bg-white text-slate-700 border-slate-200'
              : 'bg-[#080d17] text-slate-400 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <strong className={isLight ? 'text-slate-900' : 'text-white'}>
              DISPLAY 0: PRIMARY IN-VEHICLE INFOTAINMENT (1280×720 IPS TOUCH) · SILVER-ICE THEME
            </strong>
          </div>
          <span className="text-sky-600 dark:text-cyan-400 font-mono-telemetry">ANDROID 14/15 AUTOMOTIVE LAUNCHER</span>
        </div>

        {/* IVI Container (with crash simulation overlay if triggered) */}
        <div className="w-full h-[430px] relative">
          <IviDashboard
            bms={bms}
            motorTelemetry={motorTelemetry}
            vehicleTrip={vehicleTrip}
            gear={gear}
            driveMode={driveMode}
            telltales={telltales}
            telematics={telematics}
            isPlayingMedia={isPlayingMedia}
            onTogglePlayMedia={onTogglePlayMedia}
            onNavigateTo={onNavigateToIviScreen}
            onToggleDriveMode={onToggleDriveMode}
          />

          {/* Simulated Crash Overlay (Proves RFQ Subsystem Decoupling & Fault Isolation!) */}
          {isIviCrashed && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center select-text">
              <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 mb-3 animate-bounce">
                <Flame className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-gauge font-bold text-white mb-1">
                SIMULATED ANDROID 14/15 IVI SYSTEM EXCEPTION (KERNEL PANIC / REBOOT)
              </h3>
              <p className="text-xs text-slate-300 max-w-lg mb-4 leading-relaxed font-sans">
                <strong>RFQ Section 2 Verification:</strong> In the event that the primary Android IVI operating system freezes, crashes, or encounters an OS reboot, the Instrument Cluster and Cockpit safety display above remain <strong>completely operational and unhampered</strong>. Look above: the speed needle, power gauge, and regulatory telltales continue live rendering!
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={onRecoverIvi}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-gauge text-xs px-5 py-2.5 rounded-xl font-bold transition-colors shadow-lg"
                >
                  REBOOT & RESTORE ANDROID IVI
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
