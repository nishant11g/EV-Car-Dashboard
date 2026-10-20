/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Master Application
 * Android 14/15 Automotive Dual-Display In-Vehicle Infotainment & Digital Cluster
 */

import React, { useState, useEffect } from 'react';
import { telemetryService } from './services/telemetrySimulator';
import { InstrumentCluster } from './components/cluster/InstrumentCluster';
import { IviDashboard } from './components/ivi/IviDashboard';
import { NavigationScreen } from './components/ivi/NavigationScreen';
import { TelemetryScreen } from './components/ivi/TelemetryScreen';
import { DiagnosticsScreen } from './components/ivi/DiagnosticsScreen';
import { TelematicsCloudScreen } from './components/ivi/TelematicsCloudScreen';
import { SettingsScreen } from './components/ivi/SettingsScreen';
import { ReverseCameraScreen } from './components/ivi/ReverseCameraScreen';
import { WifiManagerScreen } from './components/ivi/WifiManagerScreen';
import { ProjectionScreen } from './components/ivi/ProjectionScreen';
import { CloudDbSyncScreen } from './components/ivi/CloudDbSyncScreen';
import { HardwareLayoutScreen } from './components/ivi/HardwareLayoutScreen';
import { CircuitLayoutScreen } from './components/ivi/CircuitLayoutScreen';
import { DualDisplayCockpit } from './components/dual/DualDisplayCockpit';
import { VehicleControlBar } from './components/common/VehicleControlBar';
import { VirtualDisplayModal } from './components/emulator/VirtualDisplayModal';
import { CanBusMatrixDrawer } from './components/can/CanBusMatrixDrawer';
import {
  Monitor,
  Tv,
  LayoutGrid,
  Maximize2,
  ExternalLink,
  Flame,
  Radio,
  Car,
  Wifi,
  Smartphone,
  Activity,
  Cloud,
  Cpu,
  FileCode,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  // Check if opened as standalone cluster popout for secondary monitor
  const [isStandaloneCluster, setIsStandaloneCluster] = useState<boolean>(() => {
    return window.location.search.includes('mode=cluster_standalone');
  });

  // Master view state: 'dual' | 'ivi' | 'cluster'
  const [viewMode, setViewMode] = useState<'dual' | 'ivi' | 'cluster'>('dual');

  // Sub-screen for IVI: 'dashboard' | 'navigation' | 'telemetry' | 'diagnostics' | 'telematics' | 'settings' | 'camera' | 'wifi' | 'projection' | 'clouddb' | 'hardware' | 'circuit'
  const [iviScreen, setIviScreen] = useState<'dashboard' | 'navigation' | 'telemetry' | 'diagnostics' | 'telematics' | 'settings' | 'camera' | 'wifi' | 'projection' | 'clouddb' | 'hardware' | 'circuit'>('dashboard');

  // Media state
  const [isPlayingMedia, setIsPlayingMedia] = useState<boolean>(true);

  // Modals state
  const [isVirtualDisplayModalOpen, setIsVirtualDisplayModalOpen] = useState<boolean>(false);
  const [isCanMatrixOpen, setIsCanMatrixOpen] = useState<boolean>(false);

  // Force re-render state on telemetry tick
  const [, setTick] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = telemetryService.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // When gear changes to R, automatically switch IVI to Reverse Camera (<300ms trigger RFQ requirement)
  useEffect(() => {
    if (telemetryService.gear === 'R') {
      setIviScreen('camera');
    } else if (iviScreen === 'camera') {
      setIviScreen('dashboard');
    }
  }, [telemetryService.gear, iviScreen]);

  // Handle pop-out cluster window for dual physical monitor testing
  const handlePopoutCluster = () => {
    const popoutUrl = `${window.location.origin}${window.location.pathname}?mode=cluster_standalone`;
    window.open(popoutUrl, 'IshminClusterWindow', 'width=1280,height=520,menubar=no,toolbar=no,location=no,status=no');
  };

  // If running in standalone cluster window (for secondary monitor)
  if (isStandaloneCluster) {
    return (
      <div className="w-screen h-screen bg-black overflow-hidden flex flex-col justify-between">
        <div className="flex-1 w-full h-full">
          <InstrumentCluster
            telltales={telemetryService.telltales}
            bms={telemetryService.bms}
            motorTelemetry={telemetryService.motorTelemetry}
            vehicleTrip={telemetryService.vehicleTrip}
            gear={telemetryService.gear}
            driveMode={telemetryService.driveMode}
            isFlashing={telemetryService.getIndicatorFlash()}
          />
        </div>
        <div className="bg-[#050811] px-4 py-1 flex items-center justify-between text-[11px] text-slate-500 font-mono-telemetry border-t border-slate-900">
          <span>SECONDARY MONITOR · DISPLAY 1 · VIRTUAL CLUSTER PORT</span>
          <button
            onClick={() => {
              window.history.replaceState({}, '', window.location.pathname);
              setIsStandaloneCluster(false);
            }}
            className="text-cyan-400 hover:underline"
          >
            Switch to Integrated Cockpit
          </button>
        </div>
      </div>
    );
  }

  // Pre-calculate live decoded values for CAN matrix inspector
  const liveValues: Record<string, string | number> = {
    'speedKmh': telemetryService.motorTelemetry.speedKmh.toFixed(1),
    'gear': telemetryService.gear,
    'driveMode': telemetryService.driveMode,
    'telltale.ready': telemetryService.telltales.ready ? 'TRUE' : 'FALSE',
    'throttlePercent': telemetryService.motorTelemetry.throttlePercent.toFixed(1),
    'brakePedalActive': telemetryService.motorTelemetry.brakePedalPercent > 0 ? 'TRUE' : 'FALSE',
    'bms.soc': telemetryService.bms.soc.toFixed(1),
    'bms.soh': telemetryService.bms.soh.toFixed(1),
    'bms.packVoltage': telemetryService.bms.packVoltage.toFixed(1),
    'bms.packCurrent': telemetryService.bms.packCurrent.toFixed(1),
    'estimatedRangeKm': telemetryService.vehicleTrip.estimatedRangeKm,
    'bms.batteryTempC': telemetryService.bms.batteryTempC,
    'bms.maxCellVoltage': telemetryService.bms.maxCellVoltage.toFixed(3),
    'bms.minCellVoltage': telemetryService.bms.minCellVoltage.toFixed(3),
    'bms.maxCellTemp': telemetryService.bms.maxCellTemp,
    'telltale.chargingGunLocked': telemetryService.telltales.chargingGunLocked ? 'LOCKED' : 'UNPLUGGED',
    'motorTelemetry.motorRpm': telemetryService.motorTelemetry.motorRpm,
    'motorTelemetry.torqueNm': telemetryService.motorTelemetry.torqueNm.toFixed(1),
    'motorTelemetry.motorTempC': telemetryService.motorTelemetry.motorTempC,
    'motorTelemetry.inverterTempC': telemetryService.motorTelemetry.inverterTempC,
    'telltale.hvFault': telemetryService.telltales.hvFault ? 'FAULT' : 'NORMAL',
    'telltale.turtleMode': telemetryService.telltales.turtleMode ? 'ACTIVE' : 'INACTIVE',
    'telltale.parkingBrake': telemetryService.telltales.parkingBrake ? 'ENGAGED' : 'RELEASED',
    'telltale.auxBatteryFault': telemetryService.telltales.auxBatteryFault ? 'FAULT' : 'NORMAL',
    'telltale.absFault': telemetryService.telltales.absFault ? 'FAULT' : 'NORMAL',
    'telltale.escIntervention': telemetryService.telltales.escIntervention ? 'PULSING' : 'NORMAL',
    'telltale.epasFault': telemetryService.telltales.epasFault ? 'FAULT' : 'NORMAL',
    'telltale.airbagFault': telemetryService.telltales.airbagFault ? 'FAULT' : 'NORMAL',
    'telltale.seatbeltReminder': telemetryService.telltales.seatbeltReminder ? 'UNLATCHED' : 'BUCKLED',
    'telltale.leftIndicator': telemetryService.telltales.leftIndicator ? 'FLASHING' : 'OFF',
    'telltale.rightIndicator': telemetryService.telltales.rightIndicator ? 'FLASHING' : 'OFF',
    'telltale.highBeam': telemetryService.telltales.highBeam ? 'ACTIVE' : 'OFF',
    'telltale.positionLamps': telemetryService.telltales.positionLamps ? 'ACTIVE' : 'OFF',
    'telltale.fogLamps': telemetryService.telltales.fogLamps ? 'ACTIVE' : 'OFF',
    'vehicleTrip.doorStates': telemetryService.telltales.doorAjar ? '0x01 (Open)' : '0x00 (Closed)',
    'vehicleTrip.odometerKm': telemetryService.vehicleTrip.odometerKm.toFixed(1),
    'vehicleTrip.tripKm': telemetryService.vehicleTrip.tripKm.toFixed(1),
    'vehicleTrip.aux12vVoltage': telemetryService.vehicleTrip.aux12vVoltage.toFixed(1),
  };

  return (
    <div
      className={`w-screen h-screen flex flex-col justify-between overflow-hidden select-none font-sans transition-colors duration-300 ${
        isLight ? 'bg-[#edf2f7] text-slate-800' : 'bg-[#04060b] text-white'
      }`}
    >
      {/* ================= GLOBAL TOP NAVIGATION & MODE BAR ================= */}
      <header
        className={`px-5 py-2.5 border-b flex items-center justify-between text-xs z-20 transition-all ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-800 shadow-xs backdrop-blur-md'
            : 'bg-[#070b14] border-slate-800 text-white'
        }`}
      >
        {/* Brand & Vehicle Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center font-gauge font-bold text-white shadow-md">
              IM
            </div>
            <div>
              <span
                className={`font-gauge font-bold text-sm tracking-widest block leading-none ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                ISHMIN MOTORS
              </span>
              <span
                className={`text-[10px] font-mono-telemetry block leading-tight ${
                  isLight ? 'text-sky-600' : 'text-cyan-400'
                }`}
              >
                EV COCKPIT · ANDROID 14/15 DUAL-DISPLAY
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher: Dual Display | Full IVI | Full Cluster */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-xl border ${
            isLight
              ? 'bg-slate-100 border-slate-200'
              : 'bg-[#03060c] border-slate-800'
          }`}
        >
          <button
            onClick={() => setViewMode('dual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-gauge font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'dual'
                ? isLight
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-cyan-600 text-white shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
            title="View both Instrument Cluster & IVI concurrently (Testing Mode)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>DUAL DISPLAY COCKPIT</span>
          </button>

          <button
            onClick={() => setViewMode('ivi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-gauge font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'ivi'
                ? isLight
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-cyan-600 text-white shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
            title="View dedicated In-Vehicle Infotainment display (1280×720)"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>PRIMARY IVI SCREEN</span>
          </button>

          <button
            onClick={() => setViewMode('cluster')}
            className={`px-3 py-1.5 rounded-lg text-xs font-gauge font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'cluster'
                ? isLight
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-cyan-600 text-white shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
            title="View dedicated Digital Instrument Cluster display (1920×720 / 1280×480)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>DIGITAL CLUSTER ONLY</span>
          </button>
        </div>

        {/* Quick Screen Navigation Badges */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-xl border text-xs font-gauge ${
            isLight
              ? 'bg-slate-100 border-slate-200'
              : 'bg-[#0a0f1c] border-slate-800'
          }`}
        >
          <button
            onClick={() => {
              setViewMode('ivi');
              setIviScreen('telemetry');
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              viewMode === 'ivi' && iviScreen === 'telemetry'
                ? isLight
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-cyan-600 text-white font-bold'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Inspect EV Powertrain & BMS Telemetry"
          >
            <Activity className="w-3.5 h-3.5 text-sky-500" />
            <span>TELEMETRY</span>
          </button>

          <button
            onClick={() => {
              setViewMode('ivi');
              setIviScreen('wifi');
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              viewMode === 'ivi' && iviScreen === 'wifi'
                ? isLight
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-cyan-600 text-white font-bold'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Connect via Wi-Fi and manage telemetry stream"
          >
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <span>WI-FI CONNECT</span>
          </button>

          <button
            onClick={() => {
              setViewMode('ivi');
              setIviScreen('projection');
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              viewMode === 'ivi' && iviScreen === 'projection'
                ? isLight
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-cyan-600 text-white font-bold'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Apple CarPlay & Android Auto Projection Manager"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-500" />
            <span>CARPLAY / AA</span>
          </button>

          <button
            onClick={() => {
              setViewMode('ivi');
              setIviScreen('clouddb');
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              viewMode === 'ivi' && iviScreen === 'clouddb'
                ? isLight
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-cyan-600 text-white font-bold'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Send Telemetry to Cloud DB (On-demand & Once-Daily Schedule)"
          >
            <Cloud className="w-3.5 h-3.5 text-sky-500" />
            <span>CLOUD DB SYNC</span>
          </button>

          <button
            onClick={() => {
              setViewMode('ivi');
              setIviScreen('hardware');
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              viewMode === 'ivi' && iviScreen === 'hardware'
                ? isLight
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-cyan-600 text-white font-bold'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Electrical Hardware Architecture, Wiring Harness Pinouts & Power Tree"
          >
            <Cpu className="w-3.5 h-3.5 text-purple-500" />
            <span>HARDWARE</span>
          </button>

          <button
            onClick={() => {
              setViewMode('ivi');
              setIviScreen('circuit');
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              viewMode === 'ivi' && iviScreen === 'circuit'
                ? isLight
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-cyan-600 text-white font-bold'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Full 3-in-1 Automotive Circuit Layout, KiCad & SPICE EDA Export"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-500" />
            <span>CIRCUIT (3-IN-1)</span>
          </button>
        </div>

        {/* Quick Utility Actions: Theme Toggle & Pop-Out */}
        <div className="flex items-center gap-2">
          {/* Global Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-gauge text-xs font-bold transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-300'
            }`}
            title={`Active: ${isLight ? 'Silver-Ice Luminescent (From Image)' : 'Obsidian Cyber (Dark)'}. Click to switch theme`}
          >
            {isLight ? (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span>DARK MODE</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>LIGHT THEME</span>
              </>
            )}
          </button>

          {/* Pop-out button */}
          <button
            onClick={handlePopoutCluster}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors font-gauge text-xs ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 shadow-xs'
                : 'bg-slate-900 border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white'
            }`}
            title="Open Cluster in external browser window for 2nd monitor"
          >
            <ExternalLink className={`w-3.5 h-3.5 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
            <span>POP-OUT CLUSTER</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN DISPLAY CANVAS ================= */}
      <main className="flex-1 w-full h-[calc(100vh-108px)] relative overflow-hidden flex flex-col">
        {/* VIEW MODE 1: DUAL DISPLAY COCKPIT (BOTH SCREENS CONCURRENTLY) */}
        {viewMode === 'dual' && (
          <DualDisplayCockpit
            bms={telemetryService.bms}
            motorTelemetry={telemetryService.motorTelemetry}
            vehicleTrip={telemetryService.vehicleTrip}
            gear={telemetryService.gear}
            driveMode={telemetryService.driveMode}
            telltales={telemetryService.telltales}
            telematics={telemetryService.telematics}
            isFlashing={telemetryService.getIndicatorFlash()}
            isPlayingMedia={isPlayingMedia}
            isIviCrashed={telemetryService.isIviCrashed}
            onTogglePlayMedia={() => setIsPlayingMedia(!isPlayingMedia)}
            onNavigateToIviScreen={(screen) => {
              setIviScreen(screen);
              setViewMode('ivi');
            }}
            onToggleDriveMode={() => {
              const nextMode = telemetryService.driveMode === 'ECO' ? 'NORMAL' : telemetryService.driveMode === 'NORMAL' ? 'SPORT' : 'ECO';
              telemetryService.setDriveMode(nextMode);
            }}
            onRecoverIvi={() => telemetryService.toggleIviCrash()}
          />
        )}

        {/* VIEW MODE 2: PRIMARY IVI SCREEN (1280x720 / TOUCH CONSOLE) */}
        {viewMode === 'ivi' && (
          <div className="w-full h-full relative overflow-hidden">
            {/* If IVI is simulated crashed */}
            {telemetryService.isIviCrashed ? (
              <div className="w-full h-full bg-black flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-950 border border-rose-500 flex items-center justify-center text-rose-400 mb-4 animate-bounce">
                  <Flame className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-gauge font-bold text-white mb-2">
                  ANDROID 14/15 IVI SYSTEM EXCEPTION (KERNEL PANIC / CRASH TEST)
                </h2>
                <p className="text-xs text-slate-300 max-w-md mb-6 leading-relaxed">
                  In accordance with Ishmin Motors RFQ Section 2, the IVI OS has simulated an unhandled freeze. The Instrument Cluster remains unhampered on its isolated rendering path.
                </p>
                <button
                  onClick={() => telemetryService.toggleIviCrash()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-gauge text-xs px-6 py-3 rounded-xl font-bold transition-colors shadow-lg"
                >
                  RECOVER & BOOT ANDROID IVI
                </button>
              </div>
            ) : (
              <>
                {iviScreen === 'dashboard' && (
                  <IviDashboard
                    bms={telemetryService.bms}
                    motorTelemetry={telemetryService.motorTelemetry}
                    vehicleTrip={telemetryService.vehicleTrip}
                    gear={telemetryService.gear}
                    driveMode={telemetryService.driveMode}
                    telltales={telemetryService.telltales}
                    telematics={telemetryService.telematics}
                    isPlayingMedia={isPlayingMedia}
                    onTogglePlayMedia={() => setIsPlayingMedia(!isPlayingMedia)}
                    onNavigateTo={(screen) => setIviScreen(screen)}
                    onToggleDriveMode={() => {
                      const nextMode = telemetryService.driveMode === 'ECO' ? 'NORMAL' : telemetryService.driveMode === 'NORMAL' ? 'SPORT' : 'ECO';
                      telemetryService.setDriveMode(nextMode);
                    }}
                  />
                )}
                {iviScreen === 'navigation' && (
                  <NavigationScreen
                    onBack={() => setIviScreen('dashboard')}
                    ambientTempC={telemetryService.vehicleTrip.ambientTempC}
                  />
                )}
                {iviScreen === 'telemetry' && (
                  <TelemetryScreen
                    bms={telemetryService.bms}
                    motorTelemetry={telemetryService.motorTelemetry}
                    vehicleTrip={telemetryService.vehicleTrip}
                    history={telemetryService.history}
                    onBack={() => setIviScreen('dashboard')}
                    onResetTrip={() => telemetryService.resetTrip()}
                  />
                )}
                {iviScreen === 'diagnostics' && (
                  <DiagnosticsScreen
                    dtcs={telemetryService.dtcs}
                    onBack={() => setIviScreen('dashboard')}
                    onClearDtcs={() => telemetryService.clearDTCs()}
                    onInjectCriticalFault={() => telemetryService.toggleCriticalFault()}
                  />
                )}
                {iviScreen === 'telematics' && (
                  <TelematicsCloudScreen
                    telematics={telemetryService.telematics}
                    bms={telemetryService.bms}
                    motorTelemetry={telemetryService.motorTelemetry}
                    vehicleTrip={telemetryService.vehicleTrip}
                    onBack={() => setIviScreen('dashboard')}
                    onTriggerHandshake={() => telemetryService.triggerCloudHandshake()}
                    onSimulateDisconnect={() => telemetryService.simulateCloudDisconnect()}
                    onNavigateToCloudDb={() => setIviScreen('clouddb')}
                  />
                )}
                {iviScreen === 'settings' && (
                  <SettingsScreen
                    driveMode={telemetryService.driveMode}
                    regenLevel={telemetryService.regenLevel}
                    onBack={() => setIviScreen('dashboard')}
                    onSetDriveMode={(m) => telemetryService.setDriveMode(m)}
                    onSetRegenLevel={(lvl) => telemetryService.setRegenLevel(lvl)}
                  />
                )}
                {iviScreen === 'camera' && (
                  <ReverseCameraScreen
                    onClose={() => setIviScreen('dashboard')}
                  />
                )}
                {iviScreen === 'wifi' && (
                  <WifiManagerScreen
                    wifiState={telemetryService.wifiState}
                    availableNetworks={telemetryService.availableWifiNetworks}
                    onBack={() => setIviScreen('dashboard')}
                    onConnectWifi={(ssid) => telemetryService.connectWifi(ssid)}
                    onDisconnectWifi={() => telemetryService.disconnectWifi()}
                    onToggleWifiEnabled={() => telemetryService.toggleWifiEnabled()}
                    onToggleHotspot={() => telemetryService.toggleInVehicleHotspot()}
                    onToggleTelemetryStream={() => telemetryService.toggleTelemetryWifiStream()}
                    onNavigateToTelemetry={() => setIviScreen('telemetry')}
                  />
                )}
                {iviScreen === 'projection' && (
                  <ProjectionScreen
                    projection={telemetryService.projection}
                    onBack={() => setIviScreen('dashboard')}
                    onStartCarPlay={() => telemetryService.startCarPlay()}
                    onStartAndroidAuto={() => telemetryService.startAndroidAuto()}
                    onDisconnectProjection={() => telemetryService.disconnectProjection()}
                    onSetProjectionMode={(m) => telemetryService.setProjectionMode(m)}
                    onNavigateToTelemetry={() => setIviScreen('telemetry')}
                  />
                )}
                {iviScreen === 'clouddb' && (
                  <CloudDbSyncScreen
                    config={telemetryService.cloudDbConfig}
                    logs={telemetryService.cloudDbLogs}
                    wifiState={telemetryService.wifiState}
                    isSyncing={telemetryService.isSyncingToCloudDb}
                    onBack={() => setIviScreen('dashboard')}
                    onUpdateConfig={(partial) => telemetryService.updateCloudDbConfig(partial)}
                    onTriggerSync={(triggerType) => telemetryService.syncToCloudDb(triggerType)}
                    onNavigateToWifi={() => setIviScreen('wifi')}
                  />
                )}
                {iviScreen === 'hardware' && (
                  <HardwareLayoutScreen
                    onBack={() => setIviScreen('dashboard')}
                    onNavigateToCircuit={() => setIviScreen('circuit')}
                  />
                )}
                {iviScreen === 'circuit' && (
                  <CircuitLayoutScreen
                    onBack={() => setIviScreen('dashboard')}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* VIEW MODE 3: DIGITAL CLUSTER ONLY (ULTRA-WIDE 1920x720 / 1280x480) */}
        {viewMode === 'cluster' && (
          <div className="w-full h-full relative overflow-hidden bg-black">
            <InstrumentCluster
              telltales={telemetryService.telltales}
              bms={telemetryService.bms}
              motorTelemetry={telemetryService.motorTelemetry}
              vehicleTrip={telemetryService.vehicleTrip}
              gear={telemetryService.gear}
              driveMode={telemetryService.driveMode}
              isFlashing={telemetryService.getIndicatorFlash()}
            />
          </div>
        )}
      </main>

      {/* ================= PERSISTENT BENCH TEST & SIGNAL CONTROL BAR ================= */}
      <VehicleControlBar
        speed={telemetryService.targetSpeedKmh}
        gear={telemetryService.gear}
        driveMode={telemetryService.driveMode}
        telltales={telemetryService.telltales}
        isIviCrashed={telemetryService.isIviCrashed}
        onSpeedChange={(s) => telemetryService.setTargetSpeed(s)}
        onGearChange={(g) => telemetryService.setGear(g)}
        onToggleLeftIndicator={() => telemetryService.toggleLeftIndicator()}
        onToggleRightIndicator={() => telemetryService.toggleRightIndicator()}
        onToggleHazards={() => telemetryService.toggleHazardLights()}
        onToggleHighBeam={() => telemetryService.toggleHighBeam()}
        onToggleFogLamps={() => telemetryService.toggleFogLamps()}
        onToggleSeatbelt={() => telemetryService.toggleSeatbelt()}
        onToggleDoorAjar={() => telemetryService.toggleDoorAjar()}
        onToggleCriticalFault={() => telemetryService.toggleCriticalFault()}
        onToggleIviCrash={() => telemetryService.toggleIviCrash()}
        onOpenCanMatrix={() => setIsCanMatrixOpen(true)}
        onOpenVirtualDisplayModal={() => setIsVirtualDisplayModalOpen(true)}
      />

      {/* ================= MODALS & DRAWERS ================= */}
      <VirtualDisplayModal
        isOpen={isVirtualDisplayModalOpen}
        onClose={() => setIsVirtualDisplayModalOpen(false)}
        onPopoutCluster={handlePopoutCluster}
      />

      <CanBusMatrixDrawer
        isOpen={isCanMatrixOpen}
        onClose={() => setIsCanMatrixOpen(false)}
        rawFrames={telemetryService.recentCanFrames}
        liveValues={liveValues}
      />
    </div>
  );
}
