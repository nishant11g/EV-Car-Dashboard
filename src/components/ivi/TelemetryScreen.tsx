/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Dedicated EV Telemetry & BMS Dashboard
 * Reference: RFQ-IMPL-AUTO-2026-004-R2 (Section 4 & 7)
 * Responsive to Silver-Ice Light Theme and Obsidian Cyber Dark Theme.
 */

import React, { useState } from 'react';
import {
  BmsData,
  MotorTelemetry,
  VehicleTripData,
  TelemetrySnapshot
} from '../../types/telemetry';
import { useTheme } from '../../context/ThemeContext';
import {
  Battery,
  Zap,
  Activity,
  Thermometer,
  Gauge,
  ArrowLeft,
  RotateCcw,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface TelemetryScreenProps {
  bms: BmsData;
  motorTelemetry: MotorTelemetry;
  vehicleTrip: VehicleTripData;
  history: TelemetrySnapshot[];
  onBack: () => void;
  onResetTrip: () => void;
}

export const TelemetryScreen: React.FC<TelemetryScreenProps> = ({
  bms,
  motorTelemetry,
  vehicleTrip,
  history,
  onBack,
  onResetTrip,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [selectedChart, setSelectedChart] = useState<'power_speed' | 'soc_voltage' | 'thermal'>('power_speed');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // SVG Chart rendering math
  const chartWidth = 620;
  const chartHeight = 180;
  const padding = 20;

  // Render SVG Sparkline/Trend polyline
  const renderPolyline = (dataPoints: number[], minVal: number, maxVal: number, color: string) => {
    if (dataPoints.length < 2) return null;
    const range = maxVal - minVal || 1;
    const pts = dataPoints.map((val, idx) => {
      const x = padding + (idx / (dataPoints.length - 1)) * (chartWidth - padding * 2);
      const normalized = (val - minVal) / range;
      const y = chartHeight - padding - normalized * (chartHeight - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return (
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    );
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between p-4 overflow-y-auto select-none font-sans transition-colors duration-300 ${
        isLight
          ? 'bg-gradient-to-br from-[#f8fafc] via-[#edf2f7] to-[#e2e8f0] text-slate-800'
          : 'bg-[#070b14] text-white'
      }`}
    >
      {/* Top Header Bar */}
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
              EV POWERTRAIN & BMS TELEMETRY ENGINE
            </h2>
            <span
              className={`text-[11px] font-mono-telemetry ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              CAN-CDC STREAM · ISO 11898-2 COMPLIANT · 50HZ UPDATE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowResetConfirm(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
              isLight
                ? 'bg-white hover:bg-rose-50 border-slate-300 text-slate-700 hover:text-rose-600 shadow-xs'
                : 'bg-slate-900 border-slate-700 hover:border-red-500/50 text-slate-300'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>RESET TRIP</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Telemetry Cards & Live Charts */}
      <div className="grid grid-cols-12 gap-3.5 my-3 flex-1 items-stretch">
        {/* Left Column: BMS Pack Metrics */}
        <div className="col-span-4 space-y-3">
          {/* Main Traction Pack Card */}
          <div
            className={`p-3.5 rounded-2xl border shadow-sm transition-all ${
              isLight
                ? 'bg-white/95 border-slate-200 shadow-slate-200/50'
                : 'bg-[#0b101c] border-slate-800 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-gauge font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                TRACTION BATTERY PACK
              </span>
              <Battery className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div
                className={`p-2.5 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#070b14] border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 block font-gauge">STATE OF CHARGE</span>
                <span className="text-xl font-gauge font-bold text-emerald-500">{bms.soc.toFixed(1)}%</span>
              </div>
              <div
                className={`p-2.5 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#070b14] border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 block font-gauge">STATE OF HEALTH</span>
                <span className={`text-xl font-gauge font-bold ${isLight ? 'text-sky-600' : 'text-cyan-400'}`}>
                  {bms.soh.toFixed(1)}%
                </span>
              </div>
              <div
                className={`p-2.5 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#070b14] border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 block font-gauge">PACK VOLTAGE</span>
                <span className={`text-xl font-gauge font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {bms.packVoltage.toFixed(1)} V
                </span>
              </div>
              <div
                className={`p-2.5 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#070b14] border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 block font-gauge">PACK CURRENT</span>
                <span className={`text-xl font-gauge font-bold ${bms.packCurrent < 0 ? 'text-sky-600' : 'text-amber-500'}`}>
                  {bms.packCurrent.toFixed(1)} A
                </span>
              </div>
            </div>
          </div>

          {/* Cell Extremes & Thermal Safety Card */}
          <div
            className={`p-3.5 rounded-2xl border shadow-sm transition-all ${
              isLight
                ? 'bg-white/95 border-slate-200 shadow-slate-200/50'
                : 'bg-[#0b101c] border-slate-800 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-gauge font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                CELL BALANCING & THERMAL
              </span>
              <Thermometer className="w-4 h-4 text-amber-500" />
            </div>

            <div className="space-y-2 mt-1">
              <div
                className={`flex items-center justify-between text-xs py-1 border-b ${
                  isLight ? 'border-slate-100' : 'border-slate-800/60'
                }`}
              >
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Max Cell Voltage:</span>
                <span className={`font-mono-telemetry font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                  {bms.maxCellVoltage.toFixed(3)} V
                </span>
              </div>
              <div
                className={`flex items-center justify-between text-xs py-1 border-b ${
                  isLight ? 'border-slate-100' : 'border-slate-800/60'
                }`}
              >
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Min Cell Voltage:</span>
                <span className={`font-mono-telemetry font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                  {bms.minCellVoltage.toFixed(3)} V
                </span>
              </div>
              <div
                className={`flex items-center justify-between text-xs py-1 border-b ${
                  isLight ? 'border-slate-100' : 'border-slate-800/60'
                }`}
              >
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Cell Delta Spread:</span>
                <span className="font-mono-telemetry text-emerald-600 font-bold">
                  {((bms.maxCellVoltage - bms.minCellVoltage) * 1000).toFixed(0)} mV
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Pack Thermistor Avg:</span>
                <span className="font-mono-telemetry text-amber-500 font-bold">{bms.batteryTempC}°C</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right: Motor Inverter & Live Interactive SVG Charts */}
        <div className="col-span-8 flex flex-col justify-between space-y-3">
          {/* Motor / Power Metrics Bar */}
          <div className="grid grid-cols-4 gap-2.5">
            <div
              className={`p-3 rounded-2xl border flex items-center gap-3 shadow-xs ${
                isLight ? 'bg-white/95 border-slate-200' : 'bg-[#0b101c] border-slate-800'
              }`}
            >
              <Zap className={`w-6 h-6 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
              <div>
                <span className={`text-[10px] block font-gauge ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
                  INSTANT POWER
                </span>
                <span className={`text-lg font-gauge font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {bms.packPowerKw.toFixed(2)} kW
                </span>
              </div>
            </div>
            <div
              className={`p-3 rounded-2xl border flex items-center gap-3 shadow-xs ${
                isLight ? 'bg-white/95 border-slate-200' : 'bg-[#0b101c] border-slate-800'
              }`}
            >
              <Gauge className={`w-6 h-6 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
              <div>
                <span className={`text-[10px] block font-gauge ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
                  MOTOR RPM
                </span>
                <span className={`text-lg font-gauge font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {motorTelemetry.motorRpm}
                </span>
              </div>
            </div>
            <div
              className={`p-3 rounded-2xl border flex items-center gap-3 shadow-xs ${
                isLight ? 'bg-white/95 border-slate-200' : 'bg-[#0b101c] border-slate-800'
              }`}
            >
              <Activity className="w-6 h-6 text-emerald-500" />
              <div>
                <span className={`text-[10px] block font-gauge ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
                  TORQUE
                </span>
                <span className={`text-lg font-gauge font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {motorTelemetry.torqueNm.toFixed(1)} Nm
                </span>
              </div>
            </div>
            <div
              className={`p-3 rounded-2xl border flex items-center gap-3 shadow-xs ${
                isLight ? 'bg-white/95 border-slate-200' : 'bg-[#0b101c] border-slate-800'
              }`}
            >
              <Cpu className="w-6 h-6 text-purple-500" />
              <div>
                <span className={`text-[10px] block font-gauge ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
                  INVERTER TEMP
                </span>
                <span className={`text-lg font-gauge font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {motorTelemetry.inverterTempC}°C
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Live Chart Panel */}
          <div
            className={`p-4 rounded-2xl border flex-1 flex flex-col justify-between shadow-sm ${
              isLight ? 'bg-white/95 border-slate-200' : 'bg-[#0b101c] border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-4 h-4 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`} />
                <span
                  className={`text-xs font-gauge font-bold tracking-wider ${
                    isLight ? 'text-slate-800' : 'text-slate-200'
                  }`}
                >
                  REAL-TIME TELEMETRY TRENDS (LAST 60 SECONDS)
                </span>
              </div>

              {/* Chart Mode Selector */}
              <div
                className={`flex items-center gap-1 p-1 rounded-xl border ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#060a12] border-slate-800'
                }`}
              >
                <button
                  onClick={() => setSelectedChart('power_speed')}
                  className={`text-[11px] font-gauge px-3 py-1 rounded-lg transition-colors ${
                    selectedChart === 'power_speed'
                      ? 'bg-sky-600 text-white font-bold'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  POWER & SPEED
                </button>
                <button
                  onClick={() => setSelectedChart('soc_voltage')}
                  className={`text-[11px] font-gauge px-3 py-1 rounded-lg transition-colors ${
                    selectedChart === 'soc_voltage'
                      ? 'bg-sky-600 text-white font-bold'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SOC & VOLTAGE
                </button>
                <button
                  onClick={() => setSelectedChart('thermal')}
                  className={`text-[11px] font-gauge px-3 py-1 rounded-lg transition-colors ${
                    selectedChart === 'thermal'
                      ? 'bg-sky-600 text-white font-bold'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  THERMAL PROFILES
                </button>
              </div>
            </div>

            {/* SVG Chart Rendering */}
            <div
              className={`relative w-full h-44 rounded-xl border overflow-hidden flex items-center justify-center ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#050811] border-slate-800/80'
              }`}
            >
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
                {/* Horizontal grid lines */}
                <g stroke={isLight ? '#e2e8f0' : '#141d2f'} strokeWidth="1" strokeDasharray="4 4">
                  <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} />
                  <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} />
                  <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} />
                </g>

                {/* Render Selected Series */}
                {selectedChart === 'power_speed' && (
                  <>
                    {renderPolyline(
                      history.map((h) => h.powerKw),
                      -10,
                      40,
                      '#0284c7'
                    )}
                    {renderPolyline(
                      history.map((h) => h.speed),
                      0,
                      180,
                      '#10b981'
                    )}
                  </>
                )}

                {selectedChart === 'soc_voltage' && (
                  <>
                    {renderPolyline(
                      history.map((h) => h.soc),
                      0,
                      100,
                      '#10b981'
                    )}
                    {renderPolyline(
                      history.map((h) => h.voltage),
                      300,
                      420,
                      '#6366f1'
                    )}
                  </>
                )}

                {selectedChart === 'thermal' && (
                  <>
                    {renderPolyline(
                      history.map((h) => h.motorTemp),
                      20,
                      110,
                      '#f43f5e'
                    )}
                    {renderPolyline(
                      history.map((h) => h.batteryTemp),
                      10,
                      60,
                      '#0284c7'
                    )}
                  </>
                )}
              </svg>

              {/* Chart Legend Overlay */}
              <div
                className={`absolute top-2 right-3 flex items-center gap-3 text-[10px] font-mono-telemetry font-bold px-2 py-1 rounded-lg border ${
                  isLight ? 'bg-white/90 border-slate-200 text-slate-700' : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}
              >
                {selectedChart === 'power_speed' && (
                  <>
                    <span className="text-sky-600">● POWER (kW)</span>
                    <span className="text-emerald-600">● SPEED (km/h)</span>
                  </>
                )}
                {selectedChart === 'soc_voltage' && (
                  <>
                    <span className="text-emerald-600">● SOC (%)</span>
                    <span className="text-indigo-600">● VOLTAGE (V)</span>
                  </>
                )}
                {selectedChart === 'thermal' && (
                  <>
                    <span className="text-rose-600">● MOTOR TEMP (°C)</span>
                    <span className="text-sky-600">● BATTERY TEMP (°C)</span>
                  </>
                )}
              </div>
            </div>

            {/* Bottom summary stats */}
            <div
              className={`flex items-center justify-between text-xs pt-2 font-mono-telemetry ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              <span>EFFICIENCY: 114 Wh/km</span>
              <span>AUX 12V BUS: {vehicleTrip.aux12vVoltage.toFixed(1)} V</span>
              <span>LIFETIME ODOMETER: {vehicleTrip.odometerKm.toLocaleString()} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`max-w-sm w-full p-5 rounded-2xl border shadow-2xl ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0e1424] border-slate-700 text-white'
            }`}
          >
            <h3 className="text-sm font-gauge font-bold mb-2">CONFIRM TRIP METER RESET</h3>
            <p className={`text-xs mb-4 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Are you sure you want to reset Trip A distance and energy counters? Lifetime odometer will remain unchanged.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className={`px-3 py-1.5 text-xs ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetTrip();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-gauge font-bold shadow-sm"
              >
                Reset Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
