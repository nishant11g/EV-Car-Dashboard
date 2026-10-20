/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Wireless Apple CarPlay & Android Auto Projection Manager
 * Reference: RFQ-IMPL-AUTO-2026-004-R2 (Section 3.1 Item A: Hands-Free & Projection)
 */

import React, { useState } from 'react';
import { ProjectionStatus } from '../../types/telemetry';
import {
  Smartphone,
  Wifi,
  Bluetooth,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Terminal,
  Volume2,
  Cpu,
  Tv,
  Layers,
  Radio,
  ExternalLink,
  Navigation,
  Music,
  Phone,
  MessageSquare,
  Compass
} from 'lucide-react';

interface ProjectionScreenProps {
  projection: ProjectionStatus;
  onBack: () => void;
  onStartCarPlay: () => void;
  onStartAndroidAuto: () => void;
  onDisconnectProjection: () => void;
  onSetProjectionMode: (mode: 'WIRELESS_5GHZ' | 'USB_WIRED') => void;
  onNavigateToTelemetry: () => void;
}

export const ProjectionScreen: React.FC<ProjectionScreenProps> = ({
  projection,
  onBack,
  onStartCarPlay,
  onStartAndroidAuto,
  onDisconnectProjection,
  onSetProjectionMode,
  onNavigateToTelemetry,
}) => {
  const [activeTab, setActiveTab] = useState<'screen' | 'architecture' | 'checklist'>('screen');

  return (
    <div className="relative w-full h-full bg-[#070b14] text-white flex flex-col justify-between p-4 overflow-y-auto select-none font-sans">
      {/* Top Header Bar */}
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
              SMARTPHONE PROJECTION · CARPLAY & ANDROID AUTO
            </h2>
            <span className="text-[11px] text-slate-400 font-mono-telemetry">
              UNISOC UIS7862S HARDWARE DECODE · BT 5.0 + 5.0 GHZ WI-FI WAC · &lt;40MS TOUCH LATENCY
            </span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-[#050912] p-1 rounded-xl border border-slate-800 text-xs font-gauge">
          <button
            onClick={() => setActiveTab('screen')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'screen' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            PROJECTION VIEW
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'architecture' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            DEPLOYMENT PROTOCOL STACK
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'checklist' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            CERTIFICATION & MFi CHECKLIST
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="my-3 flex-1">
        {/* ================= TAB 1: PROJECTION VIEW ================= */}
        {activeTab === 'screen' && (
          <div className="grid grid-cols-12 gap-3.5 h-full items-stretch">
            {/* Left Column: Simulated Screen Canvas */}
            <div className="col-span-8 bg-[#0a0f1b] rounded-2xl border border-slate-800 p-4 flex flex-col justify-between shadow-xl relative overflow-hidden min-h-[380px]">
              {/* Projection Top Status Indicator */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    projection.projectionState === 'ACTIVE_STREAMING' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                  }`} />
                  <span className="font-gauge font-bold text-white">
                    {projection.activeType === 'CARPLAY' ? 'APPLE CARPLAY ACTIVE' : projection.activeType === 'ANDROID_AUTO' ? 'ANDROID AUTO ACTIVE' : 'PROJECTION STANDBY'}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono-telemetry text-[11px]">
                  <span>MODE: <strong className="text-cyan-300">{projection.connectionMode}</strong></span>
                  <span>RES: <strong className="text-white">{projection.screenResolution}</strong></span>
                  <span>LATENCY: <strong className="text-emerald-400">{projection.latencyMs} ms</strong></span>
                </div>
              </div>

              {/* Screen Canvas Content */}
              <div className="flex-1 rounded-xl overflow-hidden bg-black border border-slate-900 flex items-center justify-center relative">
                {projection.activeType === 'CARPLAY' && projection.projectionState === 'ACTIVE_STREAMING' && (
                  /* SIMULATED APPLE CARPLAY UI */
                  <div className="w-full h-full bg-[#111622] p-4 flex flex-col justify-between select-none">
                    <div className="grid grid-cols-4 gap-4 p-2">
                      {/* Apple Maps */}
                      <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                          <Navigation className="w-7 h-7" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-200">Maps</span>
                      </div>

                      {/* Apple Music */}
                      <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                          <Music className="w-7 h-7" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-200">Music</span>
                      </div>

                      {/* Messages */}
                      <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-400 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                          <MessageSquare className="w-7 h-7" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-200">Messages</span>
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                          <Phone className="w-7 h-7" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-200">Phone</span>
                      </div>

                      {/* Ishmin EV Telemetry OEM App */}
                      <div
                        onClick={onNavigateToTelemetry}
                        className="flex flex-col items-center gap-1.5 cursor-pointer group"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-lg border border-cyan-400/50 group-hover:scale-105 transition-transform">
                          <span className="font-gauge font-bold text-sm">ISHMIN</span>
                        </div>
                        <span className="text-[11px] font-medium text-cyan-300 font-gauge">EV Cockpit</span>
                      </div>
                    </div>

                    {/* CarPlay Dock Bar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-black/60 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-white">10:45</span>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Wifi className="w-3.5 h-3.5 text-white" />
                          <span>5G</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Connected to: {projection.deviceModel}</span>
                      </div>
                    </div>
                  </div>
                )}

                {projection.activeType === 'ANDROID_AUTO' && projection.projectionState === 'ACTIVE_STREAMING' && (
                  /* SIMULATED ANDROID AUTO UI */
                  <div className="w-full h-full bg-[#0d121d] p-4 flex flex-col justify-between select-none">
                    <div className="grid grid-cols-12 gap-3 flex-1 items-stretch mb-2">
                      {/* Left: Google Maps Tile */}
                      <div className="col-span-8 bg-[#141b2b] rounded-2xl p-3 border border-slate-800 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <Navigation className="w-4 h-4 rotate-45" />
                            <span className="text-xs font-semibold text-white">Google Maps Navigation</span>
                          </div>
                          <span className="text-[10px] text-slate-400">18 min · 12.4 km</span>
                        </div>
                        <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                          <span className="text-white font-medium block">In 500m turn left on MG Road</span>
                          <span className="text-slate-400 text-[10px] block">Light traffic on route</span>
                        </div>
                      </div>

                      {/* Right: Media & Assistant Tile */}
                      <div className="col-span-4 bg-[#141b2b] rounded-2xl p-3 border border-slate-800 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-rose-400">
                          <Music className="w-4 h-4" />
                          <span className="text-xs font-semibold text-white">Spotify</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-white block truncate">The Road Ahead</span>
                          <span className="text-[10px] text-slate-400 block truncate">Maverick</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div className="w-2/3 h-full bg-rose-500" />
                        </div>
                      </div>
                    </div>

                    {/* Android Auto Bottom Taskbar */}
                    <div className="flex items-center justify-between px-3 py-1.5 bg-black/80 rounded-xl border border-slate-800">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                        <div className="grid grid-cols-3 gap-0.5 w-3 h-3">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-full" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-slate-300 font-mono-telemetry">
                        Google Automotive Link · {projection.deviceModel}
                      </span>
                      <span className="text-xs font-bold text-white">10:45 AM</span>
                    </div>
                  </div>
                )}

                {projection.activeType === 'NONE' && (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                    <Smartphone className="w-12 h-12 text-slate-600 mb-3" />
                    <h4 className="text-sm font-gauge font-bold text-slate-200 mb-1">
                      NO SMARTPHONE PROJECTION ACTIVE
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mb-4">
                      Connect via Wireless 5 GHz Wi-Fi or USB-OTG wired cable to launch Apple CarPlay or Android Auto.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={onStartCarPlay}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-gauge text-xs px-4 py-2 rounded-xl border border-slate-700 transition-colors"
                      >
                        Launch Apple CarPlay
                      </button>
                      <button
                        onClick={onStartAndroidAuto}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-gauge text-xs px-4 py-2 rounded-xl border border-slate-700 transition-colors"
                      >
                        Launch Android Auto
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Connection Control & Diagnostics */}
            <div className="col-span-4 space-y-3">
              {/* Quick Launch & Mode Controls */}
              <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-gauge font-bold text-slate-400 uppercase tracking-wider">
                    PROJECTION CONTROLS
                  </span>
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                </div>

                <div className="space-y-2 mb-3">
                  <button
                    onClick={onStartCarPlay}
                    className={`w-full py-2.5 px-3 rounded-xl border font-gauge text-xs font-bold flex items-center justify-between transition-colors ${
                      projection.activeType === 'CARPLAY'
                        ? 'bg-gradient-to-r from-blue-950 to-cyan-950 text-cyan-300 border-cyan-500'
                        : 'bg-[#070b14] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>Apple CarPlay</span>
                    <span className="text-[10px] text-slate-400 font-mono-telemetry">iOS 12+ Wireless</span>
                  </button>

                  <button
                    onClick={onStartAndroidAuto}
                    className={`w-full py-2.5 px-3 rounded-xl border font-gauge text-xs font-bold flex items-center justify-between transition-colors ${
                      projection.activeType === 'ANDROID_AUTO'
                        ? 'bg-gradient-to-r from-emerald-950 to-teal-950 text-emerald-300 border-emerald-500'
                        : 'bg-[#070b14] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>Android Auto</span>
                    <span className="text-[10px] text-slate-400 font-mono-telemetry">Android 11+ Wireless</span>
                  </button>

                  {projection.activeType !== 'NONE' && (
                    <button
                      onClick={onDisconnectProjection}
                      className="w-full py-2 px-3 rounded-xl border border-red-500/40 bg-red-950/40 hover:bg-red-900/50 text-red-300 font-gauge text-xs font-bold transition-colors"
                    >
                      Disconnect Active Projection
                    </button>
                  )}
                </div>

                {/* Connection Transport Mode Toggle */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-gauge font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    CONNECTION TRANSPORT
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-gauge">
                    <button
                      onClick={() => onSetProjectionMode('WIRELESS_5GHZ')}
                      className={`p-2 rounded-xl border transition-colors ${
                        projection.connectionMode === 'WIRELESS_5GHZ'
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-[#070b14] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Wireless 5 GHz (AP)
                    </button>
                    <button
                      onClick={() => onSetProjectionMode('USB_WIRED')}
                      className={`p-2 rounded-xl border transition-colors ${
                        projection.connectionMode === 'USB_WIRED'
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-[#070b14] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      USB 2.0 Wired OTG
                    </button>
                  </div>
                </div>
              </div>

              {/* Hardware Radio Status Card */}
              <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-xs font-gauge font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  RF SUBSYSTEM STATUS
                </span>

                <div className="space-y-1.5 text-xs font-mono-telemetry">
                  <div className="flex items-center justify-between p-2 bg-[#070b14] rounded-lg border border-slate-800">
                    <span className="text-slate-400">Bluetooth 5.0 HFP:</span>
                    <span className="text-emerald-400 font-bold">READY / DISCOVERABLE</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#070b14] rounded-lg border border-slate-800">
                    <span className="text-slate-400">5.0 GHz SoftAP:</span>
                    <span className="text-emerald-400 font-bold">DFS CH 149 (ACTIVE)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#070b14] rounded-lg border border-slate-800">
                    <span className="text-slate-400">VPU Video Decode:</span>
                    <span className="text-white font-bold">H.264 60FPS HARDWARE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: DEPLOYMENT PROTOCOL STACK ================= */}
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#0b101c] rounded-2xl border border-slate-800">
              <h3 className="text-sm font-gauge font-bold text-cyan-400 mb-2">
                HOW TO MAKE SURE ANDROID AUTO AND APPLE CARPLAY CONNECT AFTER DEPLOYMENT
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                On the production <strong>Unisoc UIS7862S / UIS7870 SoC</strong>, wireless projection relies on a tight choreography between Bluetooth 5.0, Wi-Fi 5 GHz (802.11ac), and low-latency hardware video decoding:
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Apple CarPlay Protocol Flow */}
                <div className="bg-[#070b14] p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-gauge font-bold">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>WIRELESS APPLE CARPLAY STACK</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed font-sans text-[11px]">
                    <li><strong>Bluetooth 5.0 Discovery</strong>: Head unit advertises CarPlay service UUID over BLE/EDR. Phone connects via HFP 1.7.</li>
                    <li><strong>WAC Handshake</strong>: Wireless Accessory Configuration exchanges credentials for the in-vehicle 5.0 GHz Wi-Fi AP.</li>
                    <li><strong>Bonjour / mDNS Broadcast</strong>: Head unit registers <code>_carplay._tcp</code> on the local Wi-Fi subnet.</li>
                    <li><strong>MFi Authentication</strong>: Hardware Apple Authentication Coprocessor 3.0 (or software cryptographic MFi daemon in Unisoc BSP) validates the token.</li>
                    <li><strong>RTSP Video & HID Input</strong>: H.264 video streams over RTP at 1280×720 @ 60fps; touchscreen events inject via low-latency HID channel.</li>
                  </ol>
                </div>

                {/* Android Auto Protocol Flow */}
                <div className="bg-[#070b14] p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-gauge font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>WIRELESS ANDROID AUTO (GAL) STACK</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed font-sans text-[11px]">
                    <li><strong>Bluetooth RFCOMM Handshake</strong>: Phone pairs over Bluetooth; companion app negotiates capabilities.</li>
                    <li><strong>Wi-Fi Direct / SoftAP Transition</strong>: Head unit commands phone to establish direct P2P link or connect to 5 GHz SoftAP.</li>
                    <li><strong>Google Automotive Link (GAL)</strong>: TLS session initiates over TCP port 50005.</li>
                    <li><strong>Hardware Video Stream</strong>: Unisoc hardware VPU decodes H.264/H.265 video directly into Android SurfaceView.</li>
                    <li><strong>Multi-Channel Audio Routing</strong>: Audio splits into Media, Guidance, and Phone calls with ALSA auto-ducking.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Micro-VCU Steering Wheel Controls Integration */}
            <div className="p-4 bg-[#0b101c] rounded-2xl border border-slate-800">
              <span className="text-xs font-gauge font-bold text-white block mb-1">
                STEERING WHEEL CAN CONTROLS (SWC) KEYCODE MAPPING (RFQ 3.4):
              </span>
              <p className="text-xs text-slate-400 mb-2">
                Physical handlebar/steering wheel buttons on Ishmin EV communicate over CAN 2.0B to the Micro-VCU (ESP32-S3), which injects native Android keyevents:
              </p>
              <div className="grid grid-cols-4 gap-2 font-mono-telemetry text-xs">
                <div className="p-2 bg-[#070b14] rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CAN 0x105 BTN 1</span>
                  <span className="text-cyan-300 font-bold">KEYCODE_MEDIA_NEXT</span>
                </div>
                <div className="p-2 bg-[#070b14] rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CAN 0x105 BTN 2</span>
                  <span className="text-cyan-300 font-bold">KEYCODE_MEDIA_PREV</span>
                </div>
                <div className="p-2 bg-[#070b14] rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CAN 0x105 BTN 3</span>
                  <span className="text-cyan-300 font-bold">KEYCODE_VOICE_ASSIST</span>
                </div>
                <div className="p-2 bg-[#070b14] rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CAN 0x105 BTN 4</span>
                  <span className="text-cyan-300 font-bold">KEYCODE_CALL / ENDCALL</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CERTIFICATION & MFi CHECKLIST ================= */}
        {activeTab === 'checklist' && (
          <div className="space-y-3">
            <div className="p-4 bg-[#0b101c] rounded-2xl border border-slate-800">
              <span className="text-xs font-gauge font-bold text-amber-400 block mb-2 uppercase">
                PRE-DEPLOYMENT HARDWARE & CERTIFICATION CHECKLIST
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[#070b14] rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">Dual-Antenna Isolation (Wi-Fi 5 GHz + BT 5.0):</strong>
                    <span className="text-slate-400 block mt-0.5">
                      Ensure &gt; 25 dB antenna isolation between 2.4 GHz Bluetooth antenna and 5 GHz Wi-Fi antenna to prevent packet collisions during simultaneous phone calls and map rendering.
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#070b14] rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">Acoustic Echo Cancellation (AEC) Microphone:</strong>
                    <span className="text-slate-400 block mt-0.5">
                      Connect external dual-microphone array with hardware DSP noise reduction for hands-free voice compliance (ITU-T P.1100 / P.1110 standard).
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#070b14] rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">Apple MFi Coprocessor Authentication:</strong>
                    <span className="text-slate-400 block mt-0.5">
                      Verify I2C communication between Unisoc SoC and MFi cryptographic IC (CP-3.0) on the carrier PCB to ensure iOS devices accept wireless projection.
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#070b14] rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white">Google Projection Compliance Test (PCT):</strong>
                    <span className="text-slate-400 block mt-0.5">
                      Run automated PCT test suite verifying video latency (&lt; 100 ms), touch latency (&lt; 50 ms), and audio channel ducking during turn-by-turn maneuvers.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono-telemetry">
        <span>ISHMIN PROJECTION DAEMON v3.2 · REALTEK RTL8821CS 802.11AC DRIVER</span>
        <button
          onClick={onBack}
          className="text-cyan-400 hover:underline font-gauge"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
