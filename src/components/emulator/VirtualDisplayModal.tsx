/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Dual-Display Emulation & Hardware Configuration Modal
 */

import React, { useState } from 'react';
import { DISPLAY_HARDWARE_SPECS, ANDROID_EMULATION_INSTRUCTIONS } from '../../data/displayHardwareConfig';
import {
  X,
  Monitor,
  Cpu,
  Layers,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Tv
} from 'lucide-react';

interface VirtualDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPopoutCluster: () => void;
}

export const VirtualDisplayModal: React.FC<VirtualDisplayModalProps> = ({
  isOpen,
  onClose,
  onPopoutCluster,
}) => {
  const [activeTab, setActiveTab] = useState<'emulation' | 'hardware' | 'deployment'>('emulation');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 select-none font-sans">
      <div className="bg-[#0b101c] w-full max-w-4xl h-[90vh] rounded-3xl border border-slate-700 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080d17]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-gauge font-bold text-white tracking-wide">
                DUAL-DISPLAY AUTOMOTIVE EMULATION & HARDWARE GUIDE
              </h2>
              <span className="text-xs text-slate-400 font-mono-telemetry">
                ANDROID 14 / 15 VIRTUAL DISPLAY & PRODUCTION DECOUPLING
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Pop-out secondary window button */}
            <button
              onClick={onPopoutCluster}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-gauge text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 font-bold transition-colors shadow-lg"
              title="Launch Cluster in a separate popup window for physical dual-monitor setups"
            >
              <ExternalLink className="w-4 h-4" />
              <span>POP-OUT CLUSTER (2ND MONITOR)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-[#080d17]/50 text-xs font-gauge">
          <button
            onClick={() => setActiveTab('emulation')}
            className={`pb-3 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'emulation' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            VIRTUAL DISPLAY EMULATION (TESTING)
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={`pb-3 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'hardware' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            DISPLAY HARDWARE CONFIGURATION
          </button>
          <button
            onClick={() => setActiveTab('deployment')}
            className={`pb-3 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'deployment' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            DEPLOYMENT & FAULT ISOLATION
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* ================= TAB 1: EMULATION & TESTING INSTRUCTIONS ================= */}
          {activeTab === 'emulation' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#070b14] rounded-2xl border border-slate-800">
                <h3 className="text-sm font-gauge font-bold text-cyan-400 mb-1">
                  HOW TO VIEW BOTH SCREENS SIMULTANEOUSLY DURING TESTING
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  During development and bench testing in Android 14 and 15, physical automotive dual-screen rigs are emulated using Android’s native <strong>Multi-Display</strong> subsystem. You can verify both the Cluster and IVI in three ways:
                </p>
              </div>

              {ANDROID_EMULATION_INSTRUCTIONS.testingMethods.map((m, idx) => (
                <div key={idx} className="p-4 bg-[#070b14] rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-gauge font-bold text-white">{m.title}</span>
                    <Terminal className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-xs text-slate-400">{m.description}</p>
                  {m.command && (
                    <div className="flex items-center justify-between bg-black/80 p-2.5 rounded-xl border border-slate-800 text-xs font-mono-telemetry text-cyan-300">
                      <code>{m.command}</code>
                      <button
                        onClick={() => copyToClipboard(m.command, idx)}
                        className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                        title="Copy command"
                      >
                        {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Code Snippet for Android 14/15 Kotlin VirtualDisplay Integration */}
              <div className="p-4 bg-[#070b14] rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-gauge font-bold text-slate-300">
                  ANDROID 14/15 KOTLIN MULTI-DISPLAY IMPLEMENTATION PATTERN:
                </span>
                <div className="bg-black/80 p-3 rounded-xl border border-slate-800 text-[11px] font-mono-telemetry text-slate-300 overflow-x-auto leading-relaxed">
                  <pre>{`// In Android Automotive OS Service / Presentation Host:
val displayManager = getSystemService(Context.DISPLAY_SERVICE) as DisplayManager
val displays = displayManager.getDisplays(DisplayManager.DISPLAY_CATEGORY_PRESENTATION)

if (displays.isNotEmpty()) {
    // Secondary display detected (e.g. HDMI out or virtual display 1920x720)
    val clusterDisplay = displays[0]
    val clusterPresentation = ClusterPresentation(this, clusterDisplay)
    clusterPresentation.show()
} else {
    // Create virtual display emulator programmatically for bench validation
    val virtualDisplay = displayManager.createVirtualDisplay(
        "SimulatedCluster", 1920, 720, 160,
        clusterSurfaceView.holder.surface,
        DisplayManager.VIRTUAL_DISPLAY_FLAG_PRESENTATION
    )
}`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: DISPLAY HARDWARE CONFIGURATION ================= */}
          {activeTab === 'hardware' && (
            <div className="space-y-3">
              <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-xs text-slate-300">
                Below is the exact procurement-grade hardware bill of materials (BOM) specified in Ishmin Motors RFQ-IMPL-AUTO-2026-004-R2 Section 3:
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {DISPLAY_HARDWARE_SPECS.map((spec, idx) => (
                  <div key={idx} className="p-3.5 bg-[#070b14] rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-gauge font-bold text-cyan-400">{spec.unit}</span>
                      <span className="text-[10px] font-mono-telemetry text-slate-400">{spec.component}</span>
                    </div>
                    <div className="text-xs font-semibold text-white my-1">{spec.specification}</div>
                    <div className="text-[11px] text-slate-400">{spec.purpose}</div>
                    <div className="text-[10px] text-slate-500 mt-1 italic">Note: {spec.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: DEPLOYMENT & FAULT ISOLATION ================= */}
          {activeTab === 'deployment' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#070b14] rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-sm font-gauge font-bold">
                    PRODUCTION SUBSYSTEM DECOUPLING & FAULT ISOLATION (RFQ SECTION 2)
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  The primary architectural constraint requires <strong>complete operational decoupling</strong> between the IVI domain and the Instrument Cluster:
                </p>
                <div className="space-y-2">
                  {ANDROID_EMULATION_INSTRUCTIONS.deploymentArchitecture.points.map((pt, idx) => (
                    <div key={idx} className="p-2.5 bg-black/60 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#070b14] rounded-2xl border border-slate-800">
                <span className="text-xs font-gauge font-bold text-amber-400 block mb-1">
                  ACCEPTANCE CRITERIA VERIFICATION THRESHOLDS:
                </span>
                <div className="grid grid-cols-2 gap-3 mt-2 text-xs font-mono-telemetry">
                  <div className="p-2.5 bg-black/70 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">CLUSTER COLD BOOT:</span>
                    <span className="text-emerald-400 font-bold">&lt; 4.5 seconds to full telemetry</span>
                  </div>
                  <div className="p-2.5 bg-black/70 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">CAN-TO-SCREEN LATENCY:</span>
                    <span className="text-emerald-400 font-bold">&lt; 50 ms telltale response</span>
                  </div>
                  <div className="p-2.5 bg-black/70 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">REVERSE CAMERA SWITCH:</span>
                    <span className="text-emerald-400 font-bold">&lt; 300 ms AHD trigger</span>
                  </div>
                  <div className="p-2.5 bg-black/70 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">MICRO-VCU TRANSLATION:</span>
                    <span className="text-emerald-400 font-bold">&lt; 5 ms deterministic buffer</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#080d17] flex items-center justify-between text-xs text-slate-400">
          <span>Ishmin Motors RFQ-IMPL-AUTO-2026-004-R2 Multi-Display Architecture</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-gauge transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
