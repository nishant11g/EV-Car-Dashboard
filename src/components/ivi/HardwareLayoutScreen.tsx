/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Hardware Architecture & Physical Layout Screen
 * Reference: RFQ-IMPL-AUTO-2026-004-R2 (Section 2, 3, 4 & 5)
 */

import React, { useState } from 'react';
import {
  Cpu,
  Tv,
  Layers,
  Radio,
  Zap,
  ShieldCheck,
  ArrowLeft,
  Activity,
  HardDrive,
  Volume2,
  Camera,
  Maximize2,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';

interface HardwareLayoutScreenProps {
  onBack: () => void;
  onNavigateToCircuit?: () => void;
}

export const HardwareLayoutScreen: React.FC<HardwareLayoutScreenProps> = ({ onBack, onNavigateToCircuit }) => {
  const [activeTab, setActiveTab] = useState<'block_diagram' | 'pinouts' | 'power_tree' | 'physical_layout'>('block_diagram');

  return (
    <div className="relative w-full h-full bg-[#070b14] text-white flex flex-col justify-between p-4 overflow-y-auto select-none font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 bg-[#0e1424] px-3.5 py-2 rounded-xl border border-slate-700 hover:border-cyan-500 text-xs text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span className="font-gauge font-bold">BACK</span>
          </button>
          <div>
            <h2 className="text-base font-gauge font-bold tracking-wide text-white">
              ELECTRICAL HARDWARE & HARNESS LAYOUT SPECIFICATION
            </h2>
            <span className="text-[11px] text-slate-400 font-mono-telemetry">
              RFQ-IMPL-AUTO-2026-004-R2 · UNISOC UIS7862S + ESP32-S3 MICRO-VCU · FAIL-SAFE DECOUPLING
            </span>
          </div>
        </div>

        {/* Tab Switcher & Circuit CAD Link */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#050912] p-1 rounded-xl border border-slate-800 text-xs font-gauge">
            <button
              onClick={() => setActiveTab('block_diagram')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'block_diagram' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              SYSTEM BLOCK DIAGRAM
            </button>
            <button
              onClick={() => setActiveTab('pinouts')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'pinouts' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              HARNESS PINOUTS
            </button>
            <button
              onClick={() => setActiveTab('power_tree')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'power_tree' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              POWER TREE & THERMAL
            </button>
            <button
              onClick={() => setActiveTab('physical_layout')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'physical_layout' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              PHYSICAL DIMENSIONS & RF
            </button>
          </div>

          {onNavigateToCircuit && (
            <button
              onClick={onNavigateToCircuit}
              className="px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-gauge font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
              title="Open Full 3-in-1 Schematic Netlists & CAD Export Engine"
            >
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>CIRCUIT CAD & EXPORT</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-3 flex-1">
        {/* ================= TAB 1: SYSTEM BLOCK DIAGRAM ================= */}
        {activeTab === 'block_diagram' && (
          <div className="space-y-4">
            <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-gauge font-bold text-slate-300 uppercase tracking-wider">
                  HIGH-LEVEL AUTOMOTIVE HARDWARE INTERCONNECT TOPOLOGY
                </span>
                <span className="text-[10px] text-emerald-400 font-mono-telemetry bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-500/30">
                  FAIL-SAFE ISOLATION VERIFIED (RFQ SEC 2)
                </span>
              </div>

              {/* Visual System Block Diagram SVG */}
              <div className="w-full bg-[#050812] rounded-xl border border-slate-800/80 p-4 overflow-x-auto">
                <svg viewBox="0 0 1000 480" className="w-full min-w-[850px] h-auto font-sans">
                  <defs>
                    <linearGradient id="iviBoxGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0c182c" />
                      <stop offset="100%" stopColor="#08101f" />
                    </linearGradient>
                    <linearGradient id="vcuBoxGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#181328" />
                      <stop offset="100%" stopColor="#0f0c1a" />
                    </linearGradient>
                    <linearGradient id="clusterBoxGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#091d26" />
                      <stop offset="100%" stopColor="#051016" />
                    </linearGradient>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4" />
                    </marker>
                    <marker id="arrowAmber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#f59e0b" />
                    </marker>
                    <marker id="arrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
                    </marker>
                  </defs>

                  {/* 1. VEHICLE HIGH-VOLTAGE & CAN 2.0B BUS (LEFT SIDE) */}
                  <g transform="translate(20, 40)">
                    <rect x="0" y="0" width="160" height="90" rx="10" fill="#1e130c" stroke="#f97316" strokeWidth="1.5" />
                    <text x="80" y="28" fill="#fdba74" fontSize="11" fontWeight="bold" textAnchor="middle">VEHICLE POWERTRAIN</text>
                    <text x="80" y="46" fill="#94a3b8" fontSize="9" textAnchor="middle">72V Traction Pack & MCU</text>
                    <text x="80" y="62" fill="#94a3b8" fontSize="9" textAnchor="middle">12V Aux DC-DC Converter</text>
                    <text x="80" y="78" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">CAN 2.0B (500 kbps)</text>
                  </g>

                  {/* 2. MICRO-VCU CAN-TO-USB BRIDGE (ITEM D) */}
                  <g transform="translate(240, 20)">
                    <rect x="0" y="0" width="220" height="150" rx="12" fill="url(#vcuBoxGrad)" stroke="#a855f7" strokeWidth="2" />
                    <text x="110" y="24" fill="#d8b4fe" fontSize="12" fontWeight="bold" textAnchor="middle">ITEM D: MICRO-VCU BRIDGE</text>
                    <text x="110" y="42" fill="#c084fc" fontSize="10" textAnchor="middle">ESP32-S3 / STM32F4 Core</text>
                    
                    <rect x="15" y="55" width="190" height="36" rx="6" fill="#090514" stroke="#7e22ce" strokeWidth="1" />
                    <text x="110" y="70" fill="#e9d5ff" fontSize="9" textAnchor="middle">TJA1051T/3 Isolated CAN PHY</text>
                    <text x="110" y="84" fill="#a855f7" fontSize="8" textAnchor="middle">ISO 7637-2 Protection + 120Ω Term</text>

                    <rect x="15" y="98" width="90" height="40" rx="6" fill="#090514" stroke="#7e22ce" strokeWidth="1" />
                    <text x="60" y="114" fill="#d8b4fe" fontSize="8" textAnchor="middle">USB-CDC Bridge</text>
                    <text x="60" y="128" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">&gt;115200 Baud (&lt;5ms)</text>

                    <rect x="115" y="98" width="90" height="40" rx="6" fill="#090514" stroke="#ef4444" strokeWidth="1" />
                    <text x="160" y="114" fill="#fca5a5" fontSize="8" textAnchor="middle">PWM Chime Out</text>
                    <text x="160" y="128" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle">85dB Safety Buzzer</text>
                  </g>

                  {/* 3. INDEPENDENT SAFETY CHIME BUZZER (ITEM C) */}
                  <g transform="translate(240, 200)">
                    <rect x="30" y="0" width="160" height="60" rx="8" fill="#1f0a0a" stroke="#ef4444" strokeWidth="1.5" />
                    <text x="110" y="24" fill="#f87171" fontSize="11" fontWeight="bold" textAnchor="middle">SECONDARY BUZZER</text>
                    <text x="110" y="40" fill="#fca5a5" fontSize="9" textAnchor="middle">85dB Piezoceramic Chime</text>
                    <text x="110" y="52" fill="#94a3b8" fontSize="8" textAnchor="middle">(Operates during IVI OS crash)</text>
                  </g>

                  {/* Line from Micro-VCU to Buzzer */}
                  <path d="M 400 170 L 400 200" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#arrowAmber)" />

                  {/* Line from Powertrain CAN to Micro-VCU */}
                  <path d="M 180 85 L 240 85" stroke="#06b6d4" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <text x="210" y="78" fill="#06b6d4" fontSize="9" textAnchor="middle" fontWeight="bold">CAN H/L</text>

                  {/* 4. PRIMARY IN-VEHICLE INFOTAINMENT (ITEM A) */}
                  <g transform="translate(540, 20)">
                    <rect x="0" y="0" width="430" height="230" rx="14" fill="url(#iviBoxGrad)" stroke="#0ea5e9" strokeWidth="2" />
                    <text x="215" y="26" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">ITEM A: PRIMARY IVI PROCESSING UNIT</text>
                    <text x="215" y="44" fill="#7dd3fc" fontSize="10" textAnchor="middle">Unisoc UIS7862S / UIS7870 (Octa-Core Cortex-A75 + Cortex-A55)</text>

                    {/* Internal Subsystems inside IVI SoC */}
                    <g transform="translate(20, 58)">
                      <rect x="0" y="0" width="185" height="50" rx="6" fill="#061224" stroke="#0284c7" strokeWidth="1" />
                      <text x="92" y="20" fill="#e0f2fe" fontSize="10" fontWeight="bold" textAnchor="middle">4GB LPDDR4 + 64GB eMMC</text>
                      <text x="92" y="36" fill="#94a3b8" fontSize="8" textAnchor="middle">AES-256 Encrypted SQLite Circular Buffer</text>
                    </g>

                    <g transform="translate(225, 58)">
                      <rect x="0" y="0" width="185" height="50" rx="6" fill="#061224" stroke="#0284c7" strokeWidth="1" />
                      <text x="92" y="20" fill="#e0f2fe" fontSize="10" fontWeight="bold" textAnchor="middle">Wi-Fi 802.11ac + BT 5.0</text>
                      <text x="92" y="36" fill="#94a3b8" fontSize="8" textAnchor="middle">CarPlay / AA Projection (Dual Antennas)</text>
                    </g>

                    <g transform="translate(20, 120)">
                      <rect x="0" y="0" width="185" height="50" rx="6" fill="#061224" stroke="#0284c7" strokeWidth="1" />
                      <text x="92" y="20" fill="#e0f2fe" fontSize="10" fontWeight="bold" textAnchor="middle">MIPI-DSI Video Controller</text>
                      <text x="92" y="36" fill="#38bdf8" fontSize="8" textAnchor="middle">Drives 10.1" Touchscreen (1280×720)</text>
                    </g>

                    <g transform="translate(225, 120)">
                      <rect x="0" y="0" width="185" height="50" rx="6" fill="#061224" stroke="#0284c7" strokeWidth="1" />
                      <text x="92" y="20" fill="#e0f2fe" fontSize="10" fontWeight="bold" textAnchor="middle">AHD Video Hardware Decoder</text>
                      <text x="92" y="36" fill="#10b981" fontSize="8" textAnchor="middle">Hardware Reverse Trigger (&lt;300ms)</text>
                    </g>

                    <g transform="translate(20, 180)">
                      <rect x="0" y="0" width="390" height="38" rx="6" fill="#030b17" stroke="#38bdf8" strokeWidth="1" />
                      <text x="195" y="18" fill="#e0f2fe" fontSize="9" fontWeight="bold" textAnchor="middle">Secondary Display Output: Native HDMI 1.4b / USB-C DP-Alt Mode</text>
                      <text x="195" y="30" fill="#94a3b8" fontSize="8" textAnchor="middle">Dual-Screen Extended Video Pipe (1080p60 Capable)</text>
                    </g>
                  </g>

                  {/* Line from Micro-VCU to IVI SoC (USB-CDC) */}
                  <path d="M 460 70 L 540 70" stroke="#a855f7" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <text x="500" y="62" fill="#d8b4fe" fontSize="9" textAnchor="middle" fontWeight="bold">USB-CDC</text>

                  {/* 5. PRIMARY 10.1" TOUCHSCREEN (ITEM A DISPLAY) */}
                  <g transform="translate(540, 280)">
                    <rect x="0" y="0" width="200" height="90" rx="10" fill="#071926" stroke="#06b6d4" strokeWidth="1.5" />
                    <text x="100" y="28" fill="#67e8f9" fontSize="11" fontWeight="bold" textAnchor="middle">DISPLAY 0: 10.1" IVI PANEL</text>
                    <text x="100" y="46" fill="#94a3b8" fontSize="9" textAnchor="middle">1280 × 720 Native IPS</text>
                    <text x="100" y="62" fill="#94a3b8" fontSize="9" textAnchor="middle">&gt;500 nits Multi-Touch</text>
                    <text x="100" y="78" fill="#06b6d4" fontSize="8" textAnchor="middle">Center Console Infotainment</text>
                  </g>

                  {/* Line from IVI MIPI to Display 0 */}
                  <path d="M 640 250 L 640 280" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow)" />

                  {/* 6. DEDICATED DIGITAL INSTRUMENT CLUSTER (ITEM B) */}
                  <g transform="translate(770, 280)">
                    <rect x="0" y="0" width="200" height="90" rx="10" fill="url(#clusterBoxGrad)" stroke="#10b981" strokeWidth="2" />
                    <text x="100" y="26" fill="#6ee7b7" fontSize="11" fontWeight="bold" textAnchor="middle">ITEM B: INSTRUMENT CLUSTER</text>
                    <text x="100" y="44" fill="#e2e8f0" fontSize="9" textAnchor="middle">8.8"–12.3" Ultra-Wide Bar LCD</text>
                    <text x="100" y="60" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">1920 × 720 / &gt;600 nits</text>
                    <text x="100" y="76" fill="#94a3b8" fontSize="8" textAnchor="middle">Cold Boot &lt;4.5s · Direct Safety View</text>
                  </g>

                  {/* Line from HDMI Out to Cluster Display */}
                  <path d="M 870 250 L 870 280" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
                  <text x="895" y="266" fill="#10b981" fontSize="8" textAnchor="middle">HDMI</text>

                  {/* 7. AHD BACKUP CAMERA (ITEM C) */}
                  <g transform="translate(540, 395)">
                    <rect x="0" y="0" width="430" height="55" rx="8" fill="#061a12" stroke="#10b981" strokeWidth="1.5" />
                    <text x="215" y="24" fill="#a7f3d0" fontSize="11" fontWeight="bold" textAnchor="middle">ITEM C: ANALOG HIGH-DEFINITION (AHD) REAR CAMERA</text>
                    <text x="215" y="42" fill="#94a3b8" fontSize="9" textAnchor="middle">1080p IP69K Wide-Angle Camera · Hardware Interrupt Trigger Switching Latency &lt; 300 ms</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Quick architectural summary note */}
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <p>
                <strong>Decoupled Safety Architecture:</strong> The ESP32-S3 Micro-VCU handles CAN bus decoding independently from Android. Safety telltales, vehicle speed, and regulatory chimes maintain an isolated physical hardware path, ensuring complete compliance with Ishmin Motors RFQ Section 2 fault isolation requirements.
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 2: HARNESS PINOUTS ================= */}
        {activeTab === 'pinouts' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Connector J1: Main Power & Vehicle Signal Harness (16-Pin) */}
              <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-gauge font-bold text-cyan-400 uppercase">
                    CONNECTOR J1: 16-PIN MAIN POWER & VEHICLE HARNESS
                  </span>
                  <span className="text-[10px] font-mono-telemetry text-slate-400">MOLEX MINI-FIT JR</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono-telemetry">
                    <thead className="bg-[#070b14] text-slate-400 text-[10px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-2">Pin #</th>
                        <th className="py-2 px-2">Signal Name</th>
                        <th className="py-2 px-2">Wire Spec</th>
                        <th className="py-2 px-2">Function</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-[11px]">
                      <tr><td className="py-1.5 px-2 text-cyan-300">1</td><td className="font-bold text-white">BATT_12V_CONST</td><td>18 AWG Red</td><td>12V Battery Constant (+10V to +16V)</td></tr>
                      <tr><td className="py-1.5 px-2 text-cyan-300">2</td><td className="font-bold text-white">IGN_ACC_12V</td><td>20 AWG Yellow</td><td>Ignition ACC ON Trigger (&lt;4.5s wake)</td></tr>
                      <tr><td className="py-1.5 px-2 text-cyan-300">3</td><td className="font-bold text-white">POWER_GND</td><td>18 AWG Black</td><td>Chassis Ground Return</td></tr>
                      <tr><td className="py-1.5 px-2 text-cyan-300">4</td><td className="font-bold text-white">ILL_DIM_PWM</td><td>22 AWG Orange</td><td>Illumination / Headlamp Dimmer Input</td></tr>
                      <tr><td className="py-1.5 px-2 text-cyan-300">5</td><td className="font-bold text-white">REVERSE_TRIG</td><td>20 AWG Blue</td><td>Reverse Gear HW Trigger (&lt;300ms AHD)</td></tr>
                      <tr><td className="py-1.5 px-2 text-cyan-300">6</td><td className="font-bold text-white">CAN_HIGH</td><td>22 AWG Twisted White</td><td>High-Speed CAN 2.0B Bus High</td></tr>
                      <tr><td className="py-1.5 px-2 text-cyan-300">7</td><td className="font-bold text-white">CAN_LOW</td><td>22 AWG Twisted Green</td><td>High-Speed CAN 2.0B Bus Low</td></tr>
                      <tr><td className="py-1.5 px-2 text-cyan-300">8</td><td className="font-bold text-white">CHASSIS_SHIELD</td><td>Drain Wire</td><td>CAN Ground Shield Isolation</td></tr>
                      <tr><td className="py-1.5 px-2 text-cyan-300">9</td><td className="font-bold text-white">SWC_KEY_1</td><td>22 AWG Violet</td><td>Steering Wheel Analog Resistive Key 1</td></tr>
                      <tr><td className="py-1.5 px-2 text-cyan-300">10</td><td className="font-bold text-white">SWC_KEY_2</td><td>22 AWG Gray</td><td>Steering Wheel Analog Resistive Key 2</td></tr>
                      <tr><td className="py-1.5 px-2 text-cyan-300">11</td><td className="font-bold text-white">PARK_BRAKE_SW</td><td>22 AWG Brown</td><td>Parking Brake Interlock Switch</td></tr>
                      <tr><td className="py-1.5 px-2 text-cyan-300">12</td><td className="font-bold text-white">SPEED_PULSE</td><td>22 AWG Pink</td><td>Wheel Speed VSS Pulse Input (Backup)</td></tr>
                      <tr><td className="py-1.5 px-2 text-cyan-300">13-16</td><td className="font-bold text-slate-400">RESERVED_EXP</td><td>22 AWG Black</td><td>Expansion GPIO / Spare Digital Inputs</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Connector J2 & J3: Micro-VCU & AHD Camera Pinouts */}
              <div className="space-y-4">
                {/* Connector J2: Micro-VCU (8-Pin) */}
                <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-gauge font-bold text-purple-400 uppercase">
                      CONNECTOR J2: 8-PIN MICRO-VCU BRIDGE HARNESS
                    </span>
                    <span className="text-[10px] font-mono-telemetry text-slate-400">MOLEX MICRO-FIT 3.0</span>
                  </div>
                  <table className="w-full text-left text-xs font-mono-telemetry">
                    <tbody className="divide-y divide-slate-800/60 text-[11px]">
                      <tr><td className="py-1.5 px-2 text-purple-300">Pin 1</td><td className="font-bold text-white">MCU_VCC_5V</td><td>Regulated 5.0V @ 1.0A Power Input</td></tr>
                      <tr><td className="py-1.5 px-2 text-purple-300">Pin 2</td><td className="font-bold text-white">MCU_GND</td><td>Signal & Logic Ground</td></tr>
                      <tr><td className="py-1.5 px-2 text-purple-300">Pin 3</td><td className="font-bold text-white">CAN_H</td><td>CAN 2.0B Differential High (+2.5V to +3.5V)</td></tr>
                      <tr><td className="py-1.5 px-2 text-purple-300">Pin 4</td><td className="font-bold text-white">CAN_L</td><td>CAN 2.0B Differential Low (+1.5V to +2.5V)</td></tr>
                      <tr><td className="py-1.5 px-2 text-purple-300">Pin 5</td><td className="font-bold text-white">TERM_120R_JMP</td><td>Jumper for Internal 120Ω Termination</td></tr>
                      <tr><td className="py-1.5 px-2 text-purple-300">Pin 6</td><td className="font-bold text-white">USB_D_PLUS</td><td>USB-CDC High-Speed Data Plus (to IVI host)</td></tr>
                      <tr><td className="py-1.5 px-2 text-purple-300">Pin 7</td><td className="font-bold text-white">USB_D_MINUS</td><td>USB-CDC High-Speed Data Minus</td></tr>
                      <tr><td className="py-1.5 px-2 text-purple-300">Pin 8</td><td className="font-bold text-white">BUZZER_PWM_OUT</td><td>Chime Driver Output (85dB Piezoceramic)</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* Connector J3: AHD Camera (4-Pin M12 Aviation Connector) */}
                <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-gauge font-bold text-emerald-400 uppercase">
                      CONNECTOR J3: 4-PIN AHD REVERSE CAMERA (IP69K)
                    </span>
                    <span className="text-[10px] font-mono-telemetry text-slate-400">M12 WATERPROOF AVIATION</span>
                  </div>
                  <table className="w-full text-left text-xs font-mono-telemetry">
                    <tbody className="divide-y divide-slate-800/60 text-[11px]">
                      <tr><td className="py-1.5 px-2 text-emerald-300">Pin 1</td><td className="font-bold text-white">CAM_PWR_12V</td><td>Filtered Camera 12V Power Output (Max 500mA)</td></tr>
                      <tr><td className="py-1.5 px-2 text-emerald-300">Pin 2</td><td className="font-bold text-white">CAM_GND</td><td>Power Return Ground</td></tr>
                      <tr><td className="py-1.5 px-2 text-emerald-300">Pin 3</td><td className="font-bold text-white">AHD_VIDEO_SIG</td><td>75Ω Coaxial Analog High-Definition Signal (1080p)</td></tr>
                      <tr><td className="py-1.5 px-2 text-emerald-300">Pin 4</td><td className="font-bold text-white">VIDEO_SHIELD</td><td>Coaxial Braided Ground Shield</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: POWER TREE & THERMAL ================= */}
        {activeTab === 'power_tree' && (
          <div className="space-y-4">
            <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md">
              <span className="text-xs font-gauge font-bold text-amber-400 uppercase tracking-wider block mb-2">
                AUTOMOTIVE POWER TREE & TRANSIENT PROTECTION ARCHITECTURE (ISO 7637-2)
              </span>

              <div className="space-y-3 text-xs">
                {/* Stage 1 */}
                <div className="p-3 bg-[#070b14] rounded-xl border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-400 font-bold">STAGE 1</div>
                  <div>
                    <strong className="text-white block">Automotive Transient & Surge Protection:</strong>
                    <span className="text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                      Input Stage incorporates an <strong>SMCJ28A Transient Voltage Suppressor (TVS)</strong> diode clamping spikes up to 45V, paired with a P-Channel MOSFET circuit providing reverse-polarity protection. Withstands ISO 7637-2 Pulse 1 (-100V), Pulse 2a (+50V), and Pulse 5b load dump conditions.
                    </span>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="p-3 bg-[#070b14] rounded-xl border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-bold">STAGE 2</div>
                  <div>
                    <strong className="text-white block">High-Efficiency DC-DC Stepdown Buck Regulators:</strong>
                    <div className="grid grid-cols-4 gap-2 mt-2 font-mono-telemetry text-[11px]">
                      <div className="p-2 bg-black/60 rounded-lg border border-slate-800">
                        <span className="text-cyan-400 font-bold block">5.0V @ 3.5A</span>
                        <span className="text-slate-400 text-[10px]">USB Ports, Micro-VCU, AHD Camera</span>
                      </div>
                      <div className="p-2 bg-black/60 rounded-lg border border-slate-800">
                        <span className="text-cyan-400 font-bold block">3.8V @ 4.0A</span>
                        <span className="text-slate-400 text-[10px]">Unisoc UIS7862S VDD_BAT Core Rail</span>
                      </div>
                      <div className="p-2 bg-black/60 rounded-lg border border-slate-800">
                        <span className="text-cyan-400 font-bold block">3.3V @ 1.5A</span>
                        <span className="text-slate-400 text-[10px]">Wi-Fi / BT Module, I/O Buffers</span>
                      </div>
                      <div className="p-2 bg-black/60 rounded-lg border border-slate-800">
                        <span className="text-cyan-400 font-bold block">1.8V / 1.1V</span>
                        <span className="text-slate-400 text-[10px]">LPDDR4 Memory & GPU Cores</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="p-3 bg-[#070b14] rounded-xl border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold">STAGE 3</div>
                  <div>
                    <strong className="text-white block">Thermal Dissipation & Chassis Gap Pad Interface:</strong>
                    <span className="text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                      The Unisoc UIS7862S SoC and power management IC (PMIC) connect via high-conductivity thermal silicone pads (3.5 W/m-K) directly to the die-cast aluminum rear heat sink chassis. Tested from -20°C to +70°C ambient temperatures without thermal throttling.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: PHYSICAL DIMENSIONS & RF ================= */}
        {activeTab === 'physical_layout' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Packaging Geometries */}
              <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md space-y-3">
                <span className="text-xs font-gauge font-bold text-white uppercase block">
                  PHYSICAL MECHANICAL PACKAGING & ENCLOSURES
                </span>

                <div className="space-y-2 text-xs font-mono-telemetry">
                  <div className="p-2.5 bg-[#070b14] rounded-xl border border-slate-800">
                    <span className="text-cyan-400 font-bold block">ITEM A: IVI HEAD-UNIT CHASSIS</span>
                    <span className="text-slate-300 block">Form Factor: Universal Double-DIN (178mm × 100mm × 55mm depth)</span>
                    <span className="text-slate-500 text-[10px] block">Material: Die-cast aluminum rear heatsink + ABS-PC flame-retardant front housing.</span>
                  </div>

                  <div className="p-2.5 bg-[#070b14] rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold block">ITEM B: CLUSTER BAR-DISPLAY HOUSING</span>
                    <span className="text-slate-300 block">Form Factor: Ultra-wide Bar-type (298mm × 112mm × 22mm depth)</span>
                    <span className="text-slate-500 text-[10px] block">Mounting: Direct steering column bracket / dashboard cowl recess with sun-visor hood.</span>
                  </div>

                  <div className="p-2.5 bg-[#070b14] rounded-xl border border-slate-800">
                    <span className="text-purple-400 font-bold block">ITEM D: MICRO-VCU MODULE</span>
                    <span className="text-slate-300 block">Form Factor: Compact Module (65mm × 45mm × 18mm)</span>
                    <span className="text-slate-500 text-[10px] block">Enclosure: IP54 sealed aluminum extruded enclosure mounted behind dashboard bulkhead.</span>
                  </div>
                </div>
              </div>

              {/* Antenna Placement & RF Isolation */}
              <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md space-y-3">
                <span className="text-xs font-gauge font-bold text-white uppercase block">
                  RF ANTENNA PLACEMENT & DUAL-BAND ISOLATION
                </span>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 bg-[#070b14] rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-cyan-400 font-gauge">Wi-Fi 5.0 GHz Antenna (CarPlay / AA / Cloud):</strong>
                      <span className="text-[10px] font-mono-telemetry text-slate-400">SMA FAKRA Code-I</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Mounted on upper left dashboard cowl. Dedicated to 802.11ac SoftAP on DFS Channel 149 for high-throughput video projection without interference.
                    </p>
                  </div>

                  <div className="p-2.5 bg-[#070b14] rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-blue-400 font-gauge">Bluetooth 5.0 Antenna (HFP / Discovery):</strong>
                      <span className="text-[10px] font-mono-telemetry text-slate-400">FAKRA Code-Z</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Positioned &gt; 15 cm away from the Wi-Fi 5 GHz antenna to maintain &gt; 25 dB RF spatial isolation, preventing packet collisions during simultaneous phone calls and wireless projection.
                    </p>
                  </div>

                  <div className="p-2.5 bg-[#070b14] rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-emerald-400 font-gauge">GPS / GLONASS / BeiDou Antenna:</strong>
                      <span className="text-[10px] font-mono-telemetry text-slate-400">FAKRA Code-C</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      25mm × 25mm high-gain active ceramic patch antenna mounted on top dashboard center with unobstructed sky view through windshield.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono-telemetry">
        <span>ISHMIN MOTORS DUAL-DISPLAY HARDWARE SPECIFICATION · REVISION 2.4</span>
        <button onClick={onBack} className="text-cyan-400 hover:underline font-gauge">
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
