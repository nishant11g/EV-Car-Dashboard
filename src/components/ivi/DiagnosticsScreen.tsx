/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Vehicle Health & OBD-II Diagnostics
 */

import React, { useState } from 'react';
import { DTCItem } from '../../types/telemetry';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  Trash2,
  Download,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Terminal
} from 'lucide-react';

interface DiagnosticsScreenProps {
  dtcs: DTCItem[];
  onBack: () => void;
  onClearDtcs: () => void;
  onInjectCriticalFault: () => void;
}

export const DiagnosticsScreen: React.FC<DiagnosticsScreenProps> = ({
  dtcs,
  onBack,
  onClearDtcs,
  onInjectCriticalFault,
}) => {
  const [selectedDtc, setSelectedDtc] = useState<DTCItem | null>(dtcs[0] || null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const exportDiagnosticsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dtcs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ishmin_obd2_diagnostics_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="relative w-full h-full bg-[#070b14] text-white flex flex-col justify-between p-4 overflow-y-auto select-none font-sans">
      {/* Header */}
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
              OBD-II & UDS DIAGNOSTICS SCANNER
            </h2>
            <span className="text-[11px] text-slate-400 font-mono-telemetry">
              SAE J1979 / ISO 14229 UDS SERVICE $03 / $07 / $0A
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Fault injector button */}
          <button
            onClick={onInjectCriticalFault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/50 hover:bg-amber-900/60 text-xs text-amber-300 transition-colors font-gauge"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>INJECT HV FAULT</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={exportDiagnosticsJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXPORT LOG</span>
          </button>

          {/* Clear DTCs button */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/50 border border-red-500/40 hover:bg-red-900/50 text-xs text-red-300 transition-colors font-gauge"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR CODES</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-3.5 my-3 flex-1 items-stretch">
        {/* Left Column: DTC List */}
        <div className="col-span-5 bg-[#0b101c] p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-gauge font-bold text-slate-400 uppercase tracking-wider">
                DETECTED TROUBLE CODES ({dtcs.length})
              </span>
              <span className="text-[10px] text-cyan-400 font-mono-telemetry">CAN 500 KBPS</span>
            </div>

            {dtcs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-[#070b14] rounded-xl border border-slate-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                <span className="text-sm font-gauge font-bold text-slate-200">NO ACTIVE FAULT CODES</span>
                <span className="text-xs text-slate-500 mt-1">All controller diagnostic monitors report normal pass criteria.</span>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
                {dtcs.map((dtc) => {
                  const isSelected = selectedDtc?.code === dtc.code;
                  return (
                    <div
                      key={dtc.code}
                      onClick={() => setSelectedDtc(dtc)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#0f172a] border-cyan-500 shadow-md'
                          : 'bg-[#070b14] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-mono-telemetry font-bold text-xs ${
                            dtc.severity === 'CRITICAL'
                              ? 'bg-red-950 text-red-400 border border-red-500/50'
                              : dtc.severity === 'WARNING'
                              ? 'bg-amber-950 text-amber-400 border border-amber-500/50'
                              : 'bg-blue-950 text-blue-400 border border-blue-500/50'
                          }`}>
                            {dtc.code}
                          </span>
                          <span className="text-[10px] font-gauge text-slate-400">{dtc.subsystem}</span>
                        </div>
                        <span className={`text-[10px] font-gauge font-bold ${
                          dtc.status === 'ACTIVE' ? 'text-red-400 animate-pulse' : 'text-slate-400'
                        }`}>
                          {dtc.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium line-clamp-1">{dtc.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-3 p-2.5 bg-[#070b14] rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>UDS Service $04: ClearDiagnosticInformation</span>
            <span className="text-emerald-400 font-mono-telemetry">READY</span>
          </div>
        </div>

        {/* Right Column: Code Detail & Freeze Frame */}
        <div className="col-span-7 bg-[#0b101c] p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
          {selectedDtc ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-mono-telemetry font-bold text-white">{selectedDtc.code}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-gauge font-bold uppercase ${
                      selectedDtc.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {selectedDtc.severity}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">{selectedDtc.description}</h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block font-gauge">FIRST LOGGED</span>
                  <span className="text-xs font-mono-telemetry text-slate-300">{selectedDtc.timestamp}</span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-3 bg-[#070b14] rounded-xl border border-slate-800">
                <span className="text-[11px] font-gauge font-bold text-cyan-400 block mb-1">
                  RECOMMENDED REPAIR / ACTION:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedDtc.recommendation}</p>
              </div>

              {/* Freeze Frame Snapshot */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-gauge font-bold text-slate-300">
                    DIAGNOSTIC FREEZE FRAME DATA (FRAME #01)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono-telemetry">
                  <div className="p-2 bg-[#070b14] rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">PID 0x0D VEHICLE SPEED</span>
                    <span className="font-bold text-white">68.4 km/h</span>
                  </div>
                  <div className="p-2 bg-[#070b14] rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">PID 0x5B BATTERY SOC</span>
                    <span className="font-bold text-white">78.2 %</span>
                  </div>
                  <div className="p-2 bg-[#070b14] rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">PACK CURRENT</span>
                    <span className="font-bold text-amber-400">18.6 A</span>
                  </div>
                  <div className="p-2 bg-[#070b14] rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">INVERTER TEMP</span>
                    <span className="font-bold text-white">42 °C</span>
                  </div>
                  <div className="p-2 bg-[#070b14] rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">ISOLATION RESISTANCE</span>
                    <span className="font-bold text-red-400">85 Ω/V</span>
                  </div>
                  <div className="p-2 bg-[#070b14] rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">AUX 12V SYSTEM</span>
                    <span className="font-bold text-white">13.8 V</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <Terminal className="w-10 h-10 mb-2" />
              <span>Select a diagnostic code to inspect freeze frame telemetry.</span>
            </div>
          )}

          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>ECU Source: Electronic Vehicle Control Unit (VCU)</span>
            <span>UDS Physical Address: 0x7E0 (Resp: 0x7E8)</span>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1424] max-w-md w-full p-5 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-2">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-sm font-gauge font-bold text-white">CRITICAL SAFETY CONFIRMATION</h3>
            </div>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Clearing Diagnostic Trouble Codes will erase stored freeze frame records and reset the Malfunction Indicator Lamp (MIL).
            </p>
            <p className="text-xs text-amber-400/90 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30 mb-4">
              NOTE: Erasing DTCs does NOT repair underlying mechanical or high-voltage electrical faults. If an isolation fault or sensor error persists, the code will re-trigger on the next ignition drive cycle.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearDtcs();
                  setSelectedDtc(null);
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-gauge font-bold shadow-lg"
              >
                Confirm Erase DTCs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
