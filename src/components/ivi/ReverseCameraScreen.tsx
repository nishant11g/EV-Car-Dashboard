/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Low-Latency AHD Reverse Camera Subsystem
 * Reference: RFQ-IMPL-AUTO-2026-004-R2 (Section 3.3 Item C: <300ms hardware interrupt trigger)
 */

import React, { useState } from 'react';
import { Camera, AlertCircle, ArrowLeft, Shield, Sliders } from 'lucide-react';

interface ReverseCameraScreenProps {
  onClose: () => void;
  isSimulatedHardwareFeed?: boolean;
}

export const ReverseCameraScreen: React.FC<ReverseCameraScreenProps> = ({
  onClose,
  isSimulatedHardwareFeed = true
}) => {
  const [steeringAngle, setSteeringAngle] = useState<number>(0);
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Top Overlay Banner */}
      <div className="absolute top-4 inset-x-6 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/80 pointer-events-auto">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>EXIT REVERSE VIEW</span>
          </button>
        </div>

        <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/80 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-gauge font-bold tracking-wider text-slate-200">
            AHD 1080P WIDE-ANGLE REAR VIEW · IP69K
          </span>
          <span className="text-[10px] text-cyan-400 font-mono-telemetry bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            LATENCY: 142ms (&lt;300ms RFQ TARGET)
          </span>
        </div>

        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 pointer-events-auto">
          <button
            onClick={() => setShowGuidelines(!showGuidelines)}
            className={`text-xs px-2.5 py-1 rounded-lg transition-colors font-gauge ${
              showGuidelines ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            TRAJECTORY LINES
          </button>
        </div>
      </div>

      {/* Camera Feed Background / Simulated Parking Bay */}
      <div className="relative flex-1 w-full h-full bg-[#03070e] flex items-center justify-center overflow-hidden">
        {isSimulatedHardwareFeed ? (
          <div className="absolute inset-0 w-full h-full">
            {/* Simulated asphalt ground texture with parking spot lines */}
            <svg viewBox="0 0 1280 720" className="w-full h-full object-cover">
              {/* Dark asphalt gradient */}
              <defs>
                <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0b1320" />
                  <stop offset="40%" stopColor="#111c2e" />
                  <stop offset="100%" stopColor="#080e18" />
                </linearGradient>
                <linearGradient id="distZoneGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.1" />
                  <stop offset="70%" stopColor="#eab308" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="1280" height="720" fill="url(#groundGrad)" />

              {/* Parking lot pavement demarcations */}
              <line x1="280" y1="720" x2="480" y2="280" stroke="#334155" strokeWidth="6" strokeDasharray="12 12" />
              <line x1="1000" y1="720" x2="800" y2="280" stroke="#334155" strokeWidth="6" strokeDasharray="12 12" />
              <line x1="420" y1="720" x2="560" y2="340" stroke="#1e293b" strokeWidth="3" />
              <line x1="860" y1="720" x2="720" y2="340" stroke="#1e293b" strokeWidth="3" />

              {/* Background wall / curb line */}
              <line x1="0" y1="280" x2="1280" y2="280" stroke="#1e293b" strokeWidth="4" />
              <rect x="0" y="0" width="1280" height="280" fill="#040810" opacity="0.8" />
              <text x="640" y="160" textAnchor="middle" fill="#334155" fontSize="20" fontFamily="sans-serif">
                CHECK SURROUNDINGS FOR SAFETY BEFORE REVERSING
              </text>

              {/* DYNAMIC PARKING GUIDELINES (RFQ: Dynamic / Static trajectory lines) */}
              {showGuidelines && (
                <g className="transition-all duration-300">
                  {/* Outer Trajectory Boundary (Green to Amber to Red) */}
                  {/* Distance Red Zone: 0.5m */}
                  <line
                    x1={470 + steeringAngle * 0.4}
                    y1="640"
                    x2={810 + steeringAngle * 0.4}
                    y2="640"
                    stroke="#ef4444"
                    strokeWidth="4"
                    strokeDasharray="6 4"
                  />
                  <text x="640" y="632" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">
                    0.5 METERS
                  </text>

                  {/* Distance Amber Zone: 1.0m */}
                  <line
                    x1={510 + steeringAngle * 0.3}
                    y1="540"
                    x2={770 + steeringAngle * 0.3}
                    y2="540"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                  />
                  <text x="640" y="532" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">
                    1.0 METERS
                  </text>

                  {/* Distance Green Zone: 2.0m */}
                  <line
                    x1={550 + steeringAngle * 0.2}
                    y1="420"
                    x2={730 + steeringAngle * 0.2}
                    y2="420"
                    stroke="#22c55e"
                    strokeWidth="3"
                  />
                  <text x="640" y="412" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">
                    2.0 METERS
                  </text>

                  {/* Dynamic side track rails */}
                  <path
                    d={`M 390 720 Q ${530 + steeringAngle} 550, ${570 + steeringAngle * 1.5} 360`}
                    stroke="#22c55e"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    d={`M 890 720 Q ${750 + steeringAngle} 550, ${710 + steeringAngle * 1.5} 360`}
                    stroke="#22c55e"
                    strokeWidth="4"
                    fill="none"
                  />
                </g>
              )}
            </svg>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Camera className="w-12 h-12 text-slate-600" />
            <span className="text-sm font-gauge tracking-wide">NO AHD HARDWARE CAMERA ATTACHED</span>
            <span className="text-xs text-slate-600">Waiting for VCU reverse gear hardware interrupt trigger</span>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROLS & ULTRASONIC SENSOR RADAR BAR */}
      <div className="absolute bottom-4 inset-x-6 z-20 flex items-center justify-between">
        {/* Steering Angle Wheel Simulation Slider */}
        <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/80">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-gauge text-slate-300">STEERING PREVIEW:</span>
          <input
            type="range"
            min="-60"
            max="60"
            value={steeringAngle}
            onChange={(e) => setSteeringAngle(Number(e.target.value))}
            className="w-32 accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono-telemetry text-cyan-300 w-8">{steeringAngle}°</span>
        </div>

        {/* Ultrasonic Parking Sensor Proximity Overlay */}
        <div className="flex items-center gap-4 bg-black/80 backdrop-blur-md px-5 py-2 rounded-2xl border border-slate-700/80">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-gauge">REAR SENSORS</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-3 h-5 rounded-xs bg-emerald-500" title="Left sensor: Clear" />
              <span className="w-3 h-6 rounded-xs bg-amber-400" title="Center left: 1.2m" />
              <span className="w-3 h-6 rounded-xs bg-amber-400" title="Center right: 1.2m" />
              <span className="w-3 h-5 rounded-xs bg-emerald-500" title="Right sensor: Clear" />
            </div>
          </div>
          <div className="h-7 w-[1px] bg-slate-700" />
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-gauge text-slate-200">OBSTACLE DISTANCE: 1.2M</span>
          </div>
        </div>

        {/* Return Button */}
        <button
          onClick={onClose}
          className="bg-slate-800 hover:bg-slate-700 text-white font-gauge text-xs px-4 py-2.5 rounded-xl border border-slate-600 transition-colors"
        >
          DISMISS CAMERA
        </button>
      </div>
    </div>
  );
};
