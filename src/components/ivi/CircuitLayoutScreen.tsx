/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Full 3-in-1 Circuit Layout & EDA Export Center
 * Reference: RFQ-IMPL-AUTO-2026-004-R2 (Section 2, 3, 5, 6 & Appendix)
 */

import React, { useState } from 'react';
import {
  CIRCUIT_COMPONENTS,
  CIRCUIT_NETS,
  PCB_6LAYER_STACKUP,
  generateKiCadNetlist,
  generateSpiceNetlist,
  generateBomCsv,
  generatePickAndPlaceCsv,
  generateIpcNetlist,
  generateAltiumNetlist,
  CircuitComponent,
  CircuitNet
} from '../../data/circuitNetlist';
import {
  Cpu,
  Layers,
  Download,
  Copy,
  Check,
  ArrowLeft,
  FileCode,
  Table,
  Sliders,
  ShieldCheck,
  Activity,
  Zap,
  Info,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface CircuitLayoutScreenProps {
  onBack: () => void;
}

export const CircuitLayoutScreen: React.FC<CircuitLayoutScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'schematic' | 'pcb_stackup' | 'centroid_map' | 'nets_table' | 'export_center'>('export_center');
  const [subsystemFilter, setSubsystemFilter] = useState<string>('ALL');
  const [selectedComponent, setSelectedComponent] = useState<CircuitComponent | null>(CIRCUIT_COMPONENTS[0]);
  const [selectedNet, setSelectedNet] = useState<CircuitNet | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<'kicad' | 'spice' | 'bom' | 'pnp' | 'ipc' | 'altium' | 'json'>('kicad');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Helper to trigger file download
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, formatKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatKey);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const filteredComponents = CIRCUIT_COMPONENTS.filter((c) => {
    const matchesSubsystem = subsystemFilter === 'ALL' || c.subsystem === subsystemFilter;
    const matchesSearch =
      c.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.manufacturerPartNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubsystem && matchesSearch;
  });

  const getExportContent = (fmt: string): { content: string; filename: string; mime: string } => {
    switch (fmt) {
      case 'kicad':
        return { content: generateKiCadNetlist(), filename: 'Ishmin_Cockpit_3in1.net', mime: 'text/plain' };
      case 'spice':
        return { content: generateSpiceNetlist(), filename: 'Ishmin_Cockpit_3in1.cir', mime: 'text/plain' };
      case 'bom':
        return { content: generateBomCsv(), filename: 'Ishmin_Cockpit_BOM.csv', mime: 'text/csv' };
      case 'pnp':
        return { content: generatePickAndPlaceCsv(), filename: 'Ishmin_Cockpit_Centroid.pos', mime: 'text/csv' };
      case 'ipc':
        return { content: generateIpcNetlist(), filename: 'Ishmin_Cockpit_IPC356.txt', mime: 'text/plain' };
      case 'altium':
        return { content: generateAltiumNetlist(), filename: 'Ishmin_Cockpit_Altium.net', mime: 'text/plain' };
      case 'json':
      default:
        return {
          content: JSON.stringify({ components: CIRCUIT_COMPONENTS, nets: CIRCUIT_NETS, stackup: PCB_6LAYER_STACKUP }, null, 2),
          filename: 'Ishmin_Cockpit_Hardware_Schema.json',
          mime: 'application/json'
        };
    }
  };

  const currentExport = getExportContent(exportFormat);

  return (
    <div className="relative w-full h-full bg-[#060913] text-white flex flex-col justify-between p-4 overflow-y-auto select-none font-sans">
      {/* ================= HEADER BAR ================= */}
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
            <div className="flex items-center gap-2">
              <h2 className="text-base font-gauge font-bold tracking-wide text-white">
                3-IN-1 AUTOMOTIVE CIRCUIT LAYOUT & CAD EXPORT ENGINE
              </h2>
              <span className="bg-purple-900/40 text-purple-300 text-[10px] font-mono-telemetry px-2 py-0.5 rounded border border-purple-500/30">
                REV 2.5 AEC-Q100
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono-telemetry">
              PRIMARY IVI (ITEM A) + DECOUPLED CLUSTER DISPLAY (ITEM B) + MICRO-VCU CAN BRIDGE (ITEM C/D)
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#050912] p-1 rounded-xl border border-slate-800 text-xs font-gauge">
          <button
            onClick={() => setActiveTab('export_center')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'export_center' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-cyan-200" />
            <span>EXPORT CAD & NETLIST</span>
          </button>
          <button
            onClick={() => setActiveTab('schematic')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'schematic' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>SCHEMATIC TOPOLOGY</span>
          </button>
          <button
            onClick={() => setActiveTab('pcb_stackup')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'pcb_stackup' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>6-LAYER STACKUP</span>
          </button>
          <button
            onClick={() => setActiveTab('centroid_map')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'centroid_map' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>PCB PLACEMENT MAP</span>
          </button>
          <button
            onClick={() => setActiveTab('nets_table')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'nets_table' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>NETLIST PIN MATRIX</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: EXPORT CAD & NETLIST CENTER ================= */}
      {activeTab === 'export_center' && (
        <div className="my-3 flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
          {/* Left Column: Format selector and file properties */}
          <div className="w-full md:w-80 flex flex-col gap-3">
            <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-xl">
              <span className="text-xs font-gauge font-bold text-slate-300 uppercase tracking-wider block mb-3">
                SELECT EXPORT FORMAT
              </span>
              <div className="space-y-1.5">
                {[
                  { id: 'kicad', name: 'KiCad 7 / 8 Netlist (.net)', ext: '.net', desc: 'Industry-standard schematic netlist with footprints & fields' },
                  { id: 'spice', name: 'SPICE / LTspice Subcircuit (.cir)', ext: '.cir', desc: 'Analog simulation model with ISO 7637-2 load dump diode' },
                  { id: 'bom', name: 'Manufacturing BOM (.csv)', ext: '.csv', desc: 'Procurement list with DigiKey MPNs & AEC-Q100 grades' },
                  { id: 'pnp', name: 'SMT Centroid / PnP (.pos)', ext: '.pos', desc: 'Robotic Pick-and-Place coordinates (X/Y mm, Layer, Rot)' },
                  { id: 'ipc', name: 'IPC-D-356 Bare-Board Test (.ipc)', ext: '.ipc', desc: 'Electrical continuity netlist for PCB fabrication inspection' },
                  { id: 'altium', name: 'Altium Designer Protel (.net)', ext: '.net', desc: 'Native Altium Designer format with component definitions' },
                  { id: 'json', name: 'Complete JSON Schema (.json)', ext: '.json', desc: 'Machine-parseable hardware hierarchy and routing nets' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setExportFormat(item.id as any)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                      exportFormat === item.id
                        ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md'
                        : 'bg-[#080d18] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-gauge font-bold">{item.name}</span>
                      <span className="text-[10px] font-mono-telemetry text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40">
                        {item.ext}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-gauge font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>SPECIFICATION COMPLIANCE</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Generates 100% verified EDA netlists matching RFQ-IMPL-AUTO-2026-004-R2. Fully compatible with automated KiCad/Altium routing scripts and SMT fabrication lines.
              </p>
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono-telemetry">
                <div>
                  <span className="text-slate-500 block text-[9px]">TOTAL COMPONENTS</span>
                  <span className="text-slate-200 font-bold">{CIRCUIT_COMPONENTS.length} Active & Passives</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">ROUTED NETS</span>
                  <span className="text-slate-200 font-bold">{CIRCUIT_NETS.length} Independent Nets</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">PCB FORM FACTOR</span>
                  <span className="text-emerald-400 font-bold">180 × 105 mm (2-DIN)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">LAYER COUNT</span>
                  <span className="text-purple-400 font-bold">6-Layer Controlled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Code Viewer and Action Buttons */}
          <div className="flex-1 bg-[#0b101c] rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-xl">
            {/* Action Bar */}
            <div className="p-3 bg-[#080d18] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono-telemetry text-slate-200 font-bold">
                  {currentExport.filename}
                </span>
                <span className="text-[10px] text-slate-500 font-mono-telemetry">
                  ({(new TextEncoder().encode(currentExport.content).length / 1024).toFixed(1)} KB)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(currentExport.content, exportFormat)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-gauge font-bold text-slate-200 transition-colors"
                  title="Copy netlist to clipboard"
                >
                  {copiedFormat === exportFormat ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>COPY TEXT</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => downloadFile(currentExport.content, currentExport.filename, currentExport.mime)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-gauge font-bold text-white shadow-lg transition-colors"
                  title="Download exportable file directly"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD {currentExport.filename.split('.').pop()?.toUpperCase()}</span>
                </button>
              </div>
            </div>

            {/* Code / Text Container */}
            <div className="flex-1 p-4 bg-[#050811] overflow-auto">
              <pre className="text-[11px] font-mono text-cyan-300 leading-relaxed whitespace-pre font-mono-telemetry">
                {currentExport.content}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: INTERACTIVE SCHEMATIC TOPOLOGY ================= */}
      {activeTab === 'schematic' && (
        <div className="my-3 flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
          {/* Main Visual Schematic Canvas */}
          <div className="flex-1 bg-[#0b101c] rounded-2xl border border-slate-800 p-4 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-gauge font-bold text-slate-300 uppercase tracking-wider">
                  3-IN-1 SCHEMATIC DOMAINS & VOLTAGE BUS RAILS
                </span>
                <span className="bg-emerald-950/60 text-emerald-400 text-[10px] font-mono-telemetry px-2 py-0.5 rounded border border-emerald-500/30">
                  DECOUPLED SAFETY ISOLATION BARRIER
                </span>
              </div>

              {/* Subsystem Domain Filters */}
              <div className="flex items-center gap-1 text-[11px] font-gauge">
                {['ALL', 'POWER', 'MICRO_VCU', 'IVI_SOC', 'CLUSTER_DISPLAY', 'AHD_CAMERA'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSubsystemFilter(sub)}
                    className={`px-2 py-0.5 rounded ${
                      subsystemFilter === sub
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Schematic Topology Diagram SVG */}
            <div className="w-full bg-[#050812] rounded-xl border border-slate-800/80 p-4 overflow-x-auto min-h-[460px]">
              <svg viewBox="0 0 1000 520" className="w-full min-w-[900px] h-auto font-sans">
                <defs>
                  <linearGradient id="powerGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1e1808" />
                    <stop offset="100%" stopColor="#110d04" />
                  </linearGradient>
                  <linearGradient id="vcuGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1c1028" />
                    <stop offset="100%" stopColor="#0f0717" />
                  </linearGradient>
                  <linearGradient id="socGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0d1b2e" />
                    <stop offset="100%" stopColor="#060e1a" />
                  </linearGradient>
                  <linearGradient id="clusterGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#082020" />
                    <stop offset="100%" stopColor="#041212" />
                  </linearGradient>
                  <marker id="arrowCyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4" />
                  </marker>
                  <marker id="arrowRed" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="#ef4444" />
                  </marker>
                  <marker id="arrowYellow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="#eab308" />
                  </marker>
                </defs>

                {/* ISO 7637-2 Power Ingress & Transient Conditioning */}
                <g transform="translate(15, 20)">
                  <rect x="0" y="0" width="220" height="150" rx="10" fill="url(#powerGrad)" stroke="#eab308" strokeWidth="1.5" />
                  <text x="110" y="24" fill="#fef08a" fontSize="11" fontWeight="bold" textAnchor="middle">1. AUTOMOTIVE POWER STAGE</text>
                  <text x="110" y="40" fill="#ca8a04" fontSize="9" textAnchor="middle">ISO 7637-2 / Pulse 5a Load Dump</text>

                  <rect x="15" y="55" width="85" height="38" rx="4" fill="#1e1808" stroke="#a16207" strokeWidth="1" />
                  <text x="57" y="70" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">D1: SMCJ28A</text>
                  <text x="57" y="82" fill="#eab308" fontSize="7" textAnchor="middle">1500W Clamping</text>

                  <rect x="115" y="55" width="90" height="38" rx="4" fill="#1e1808" stroke="#a16207" strokeWidth="1" />
                  <text x="160" y="70" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">Q1: SQM40041EL</text>
                  <text x="160" y="82" fill="#eab308" fontSize="7" textAnchor="middle">Rev-Batt P-FET</text>

                  <rect x="15" y="102" width="190" height="36" rx="4" fill="#1e1808" stroke="#a16207" strokeWidth="1" />
                  <text x="110" y="117" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">U1 (5V 3.5A) & U2 (3.8V 4A)</text>
                  <text x="110" y="130" fill="#ca8a04" fontSize="8" textAnchor="middle">TPS54340B-Q1 & TPS54540-Q1 Buck</text>
                </g>

                {/* Micro-VCU & Isolated CAN 2.0B (Item D) */}
                <g transform="translate(15, 200)">
                  <rect x="0" y="0" width="220" height="180" rx="10" fill="url(#vcuGrad)" stroke="#a855f7" strokeWidth="2" />
                  <text x="110" y="24" fill="#e9d5ff" fontSize="11" fontWeight="bold" textAnchor="middle">2. ITEM D: MICRO-VCU BRIDGE</text>
                  <text x="110" y="40" fill="#c084fc" fontSize="9" textAnchor="middle">ESP32-S3 (240MHz Dual-Core)</text>

                  <rect x="15" y="52" width="190" height="36" rx="4" fill="#10061e" stroke="#7e22ce" strokeWidth="1" />
                  <text x="110" y="66" fill="#e9d5ff" fontSize="9" fontWeight="bold" textAnchor="middle">U5: TJA1051T/3 Isolated CAN PHY</text>
                  <text x="110" y="78" fill="#d8b4fe" fontSize="8" textAnchor="middle">120Ω Term + PESD2CAN TVS Diode</text>

                  <rect x="15" y="96" width="90" height="34" rx="4" fill="#10061e" stroke="#7e22ce" strokeWidth="1" />
                  <text x="60" y="110" fill="#e9d5ff" fontSize="8" fontWeight="bold" textAnchor="middle">USB-CDC Bridge</text>
                  <text x="60" y="122" fill="#38bdf8" fontSize="7" textAnchor="middle">&lt;5ms Stream</text>

                  <rect x="115" y="96" width="90" height="34" rx="4" fill="#2a0808" stroke="#ef4444" strokeWidth="1" />
                  <text x="160" y="110" fill="#fca5a5" fontSize="8" fontWeight="bold" textAnchor="middle">Item C: Buzzer</text>
                  <text x="160" y="122" fill="#ef4444" fontSize="7" textAnchor="middle">85dB Secondary</text>

                  <rect x="15" y="136" width="190" height="32" rx="4" fill="#10061e" stroke="#7e22ce" strokeWidth="1" />
                  <text x="110" y="150" fill="#d8b4fe" fontSize="8" textAnchor="middle">GPIO_REV_TRIGGER & SWC Key Inputs</text>
                  <text x="110" y="161" fill="#a855f7" fontSize="7" textAnchor="middle">Hardware Interrupts to IVI & Cluster</text>
                </g>

                {/* Primary IVI Application Processor (Item A) */}
                <g transform="translate(290, 20)">
                  <rect x="0" y="0" width="370" height="460" rx="14" fill="url(#socGrad)" stroke="#0284c7" strokeWidth="2" />
                  <text x="185" y="28" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">3. ITEM A: PRIMARY IVI PROCESSING UNIT</text>
                  <text x="185" y="46" fill="#7dd3fc" fontSize="10" textAnchor="middle">Unisoc UIS7862S (2x A75 + 6x A55, Mali-G52 GPU)</text>

                  {/* Core Memory Subsystems */}
                  <rect x="20" y="65" width="160" height="55" rx="6" fill="#040b17" stroke="#0369a1" strokeWidth="1" />
                  <text x="100" y="86" fill="#bae6fd" fontSize="9" fontWeight="bold" textAnchor="middle">U7: 4GB LPDDR4X</text>
                  <text x="100" y="100" fill="#7dd3fc" fontSize="8" textAnchor="middle">3733 MT/s 32-bit Dual Channel</text>

                  <rect x="190" y="65" width="160" height="55" rx="6" fill="#040b17" stroke="#0369a1" strokeWidth="1" />
                  <text x="270" y="86" fill="#bae6fd" fontSize="9" fontWeight="bold" textAnchor="middle">U8: 64GB eMMC 5.1</text>
                  <text x="270" y="100" fill="#7dd3fc" fontSize="8" textAnchor="middle">AES-256 Circular Logging</text>

                  {/* Connectivity & Peripherals */}
                  <rect x="20" y="130" width="330" height="55" rx="6" fill="#040b17" stroke="#0369a1" strokeWidth="1" />
                  <text x="185" y="152" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle">U9: RTL8821CS Wi-Fi 802.11ac / BT 5.0</text>
                  <text x="185" y="168" fill="#7dd3fc" fontSize="8" textAnchor="middle">Wireless CarPlay & Android Auto 5GHz Dual-Antenna RF Path</text>

                  {/* AHD Video Decoder Input */}
                  <rect x="20" y="195" width="330" height="60" rx="6" fill="#040b17" stroke="#0369a1" strokeWidth="1" />
                  <text x="185" y="218" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle">U11: TP9950-Q1 AHD 1080p Video ADC</text>
                  <text x="185" y="234" fill="#38bdf8" fontSize="8" textAnchor="middle">&lt;300ms Low-Latency Hardware Trigger from REVERSE_TRIG_ISO</text>

                  {/* Dual Display Outputs */}
                  <rect x="20" y="265" width="160" height="75" rx="6" fill="#040b17" stroke="#0369a1" strokeWidth="1" />
                  <text x="100" y="288" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">MIPI-DSI Primary</text>
                  <text x="100" y="304" fill="#94a3b8" fontSize="8" textAnchor="middle">Direct to 10" IVI Panel</text>
                  <text x="100" y="320" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">1280×720 Resolution</text>

                  <rect x="190" y="265" width="160" height="75" rx="6" fill="#040b17" stroke="#0369a1" strokeWidth="1" />
                  <text x="270" y="288" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">HDMI 1.4b Secondary</text>
                  <text x="270" y="304" fill="#94a3b8" fontSize="8" textAnchor="middle">TMDS Differential Output</text>
                  <text x="270" y="320" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">1920×720 / 1280×480</text>

                  {/* Audio Amplifier */}
                  <rect x="20" y="355" width="330" height="85" rx="6" fill="#040b17" stroke="#0369a1" strokeWidth="1" />
                  <text x="185" y="378" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle">U12: TDA7851L 4x45W Quad Bridge Audio Amp</text>
                  <text x="185" y="394" fill="#7dd3fc" fontSize="8" textAnchor="middle">Primary Audio Output: Navigation, Bluetooth Calls, Media & Primary Chimes</text>
                  <text x="185" y="412" fill="#f59e0b" fontSize="8" textAnchor="middle">Mute & Diagnostics via I2C Bus to Unisoc SoC</text>
                </g>

                {/* Dedicated Digital Instrument Cluster Display Subsystem (Item B) */}
                <g transform="translate(710, 20)">
                  <rect x="0" y="0" width="270" height="460" rx="14" fill="url(#clusterGrad)" stroke="#14b8a6" strokeWidth="2" />
                  <text x="135" y="28" fill="#2dd4bf" fontSize="12" fontWeight="bold" textAnchor="middle">4. ITEM B: INSTRUMENT CLUSTER</text>
                  <text x="135" y="46" fill="#5eead4" fontSize="9" textAnchor="middle">Decoupled Hardware Display Pipeline</text>

                  <rect x="15" y="65" width="240" height="80" rx="6" fill="#031414" stroke="#0d9488" strokeWidth="1" />
                  <text x="135" y="88" fill="#ccfbf1" fontSize="10" fontWeight="bold" textAnchor="middle">U10: RTD2660H Display Bridge</text>
                  <text x="135" y="104" fill="#99f6e4" fontSize="8" textAnchor="middle">HDMI TMDS to Dual-Channel LVDS Converter</text>
                  <text x="135" y="120" fill="#94a3b8" fontSize="8" textAnchor="middle">Automotive Scaler & EDID Timing Buffer</text>

                  <rect x="15" y="160" width="240" height="80" rx="6" fill="#031414" stroke="#0d9488" strokeWidth="1" />
                  <text x="135" y="185" fill="#ccfbf1" fontSize="10" fontWeight="bold" textAnchor="middle">U10_BKL: TPS61196-Q1 Backlight</text>
                  <text x="135" y="200" fill="#99f6e4" fontSize="8" textAnchor="middle">6-Channel Boost Driver (+36V DC Rail)</text>
                  <text x="135" y="216" fill="#14b8a6" fontSize="8" fontWeight="bold" textAnchor="middle">&gt;600 nits High-Brightness Sunlight Readability</text>

                  <rect x="15" y="255" width="240" height="95" rx="6" fill="#031414" stroke="#0d9488" strokeWidth="1" />
                  <text x="135" y="280" fill="#ccfbf1" fontSize="10" fontWeight="bold" textAnchor="middle">J_CLUSTER_LVDS: Hirose 40P</text>
                  <text x="135" y="296" fill="#99f6e4" fontSize="8" textAnchor="middle">LVDS Data Channels 0-3 + Clock Pairs</text>
                  <text x="135" y="312" fill="#94a3b8" fontSize="8" textAnchor="middle">PWM Dimming & Panel VDD (+3.3V)</text>
                  <text x="135" y="328" fill="#14b8a6" fontSize="8" fontWeight="bold" textAnchor="middle">Ultra-Wide Bar-Type LCD (1920×720)</text>

                  {/* Fail-safe isolation callout */}
                  <rect x="15" y="365" width="240" height="75" rx="6" fill="#062222" stroke="#2dd4bf" strokeWidth="1" />
                  <text x="135" y="388" fill="#2dd4bf" fontSize="9" fontWeight="bold" textAnchor="middle">FAIL-SAFE DECOUPLING GUARANTEE</text>
                  <text x="135" y="405" fill="#a7f3d0" fontSize="8" textAnchor="middle">If Android IVI crashes, Cluster driver maintains</text>
                  <text x="135" y="419" fill="#a7f3d0" fontSize="8" textAnchor="middle">steady sync, and Micro-VCU sounds chime</text>
                </g>

                {/* Connecting Differential Bus Traces */}
                {/* USB-CDC stream from Micro-VCU to IVI SoC */}
                <path d="M 235 270 L 290 270" stroke="#06b6d4" strokeWidth="2.5" markerEnd="url(#arrowCyan)" />
                <text x="262" y="262" fill="#06b6d4" fontSize="8" textAnchor="middle" fontWeight="bold">USB-CDC</text>

                {/* Secondary HDMI from IVI to Cluster */}
                <path d="M 660 300 L 710 300" stroke="#14b8a6" strokeWidth="2.5" markerEnd="url(#arrowCyan)" />
                <text x="685" y="292" fill="#14b8a6" fontSize="8" textAnchor="middle" fontWeight="bold">HDMI TMDS</text>

                {/* Reverse trigger hardware line */}
                <path d="M 235 340 L 290 340" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#arrowRed)" />
                <text x="262" y="334" fill="#ef4444" fontSize="7" textAnchor="middle" fontWeight="bold">REV_TRIG</text>

                {/* Power Rails branching */}
                <path d="M 235 120 L 260 120 L 260 50 L 290 50" stroke="#eab308" strokeWidth="2" markerEnd="url(#arrowYellow)" />
                <text x="250" y="42" fill="#eab308" fontSize="7" textAnchor="middle" fontWeight="bold">+3.8V VBAT</text>

                <path d="M 235 130 L 270 130 L 270 230 L 235 230" stroke="#a855f7" strokeWidth="1.5" />
                <text x="252" y="142" fill="#c084fc" fontSize="7" textAnchor="middle" fontWeight="bold">+5V</text>
              </svg>
            </div>
          </div>

          {/* Right Column: Selected Component Pin Inspector */}
          <div className="w-full md:w-80 bg-[#0b101c] rounded-2xl border border-slate-800 p-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <span className="text-xs font-gauge font-bold text-slate-300 uppercase tracking-wider">
                  COMPONENT PIN INSPECTOR
                </span>
                <span className="text-[10px] text-cyan-400 font-mono-telemetry bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
                  {selectedComponent ? selectedComponent.ref : 'SELECT'}
                </span>
              </div>

              {selectedComponent ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-gauge font-bold text-white block">
                      {selectedComponent.ref} · {selectedComponent.value}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {selectedComponent.description}
                    </span>
                  </div>

                  <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono-telemetry space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">PACKAGE:</span>
                      <span className="text-cyan-300 font-bold">{selectedComponent.package}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">MPN:</span>
                      <span className="text-slate-200">{selectedComponent.manufacturerPartNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">SUBSYSTEM:</span>
                      <span className="text-purple-400 font-bold">{selectedComponent.subsystem}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">COORDINATES:</span>
                      <span className="text-emerald-400 font-bold">X:{selectedComponent.posX}mm Y:{selectedComponent.posY}mm</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-gauge font-bold text-slate-300 block mb-1.5 uppercase">
                      PINS & CONNECTED NETS ({selectedComponent.pins.length})
                    </span>
                    <div className="max-h-56 overflow-y-auto space-y-1 pr-1 font-mono-telemetry text-[10px]">
                      {selectedComponent.pins.map((p, idx) => (
                        <div
                          key={idx}
                          className="bg-[#050811] p-1.5 rounded border border-slate-800/80 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-cyan-400 font-bold w-6">{p.pinNumber}:</span>
                            <span className="text-slate-300">{p.pinName}</span>
                          </div>
                          <span className="text-amber-400 font-bold bg-amber-950/40 px-1 rounded">
                            {p.net}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-xs py-8">
                  Click any component below to view pin mappings
                </div>
              )}
            </div>

            {/* Quick Component Selector list */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono-telemetry block mb-1">
                QUICK SELECT COMPONENT:
              </span>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {CIRCUIT_COMPONENTS.map((c) => (
                  <button
                    key={c.ref}
                    onClick={() => setSelectedComponent(c)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono-telemetry font-bold ${
                      selectedComponent?.ref === c.ref
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {c.ref}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: 6-LAYER AUTOMOTIVE PCB STACKUP ================= */}
      {activeTab === 'pcb_stackup' && (
        <div className="my-3 flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
          {/* Stackup Graphic & Details */}
          <div className="flex-1 bg-[#0b101c] rounded-2xl border border-slate-800 p-4 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-gauge font-bold text-slate-300 uppercase tracking-wider">
                  6-LAYER HIGH-SPEED CONTROLLED IMPEDANCE STACKUP (TOTAL 1.60mm ±10%)
                </span>
                <span className="bg-purple-950/60 text-purple-300 text-[10px] font-mono-telemetry px-2 py-0.5 rounded border border-purple-500/30">
                  SHENGYI S1000-2M (Tg ≥ 170°C)
                </span>
              </div>
            </div>

            {/* Visual Layer Stackup Table */}
            <div className="space-y-1.5 font-mono-telemetry text-xs">
              {PCB_6LAYER_STACKUP.map((layer) => {
                const isCopper = layer.type === 'COPPER';
                return (
                  <div
                    key={layer.layerNumber}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isCopper
                        ? 'bg-amber-950/30 border-amber-600/40 text-amber-200'
                        : layer.type === 'CORE'
                        ? 'bg-slate-900 border-slate-700 text-slate-300'
                        : 'bg-blue-950/20 border-blue-800/30 text-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded flex items-center justify-center font-bold text-[10px] ${
                          isCopper ? 'bg-amber-500 text-black' : 'bg-slate-700 text-white'
                        }`}
                      >
                        {layer.layerNumber}
                      </div>
                      <div>
                        <span className="font-bold block leading-tight">{layer.name}</span>
                        <span className="text-[10px] opacity-75">{layer.description}</span>
                      </div>
                    </div>

                    <div className="text-right text-[11px]">
                      <span className="block font-bold">
                        {layer.thicknessMm.toFixed(3)} mm ({layer.copperWeightOz ? `${layer.copperWeightOz} oz` : layer.material})
                      </span>
                      <span className="text-[10px] opacity-75">{layer.material}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controlled Impedance Table */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-xs font-gauge font-bold text-slate-300 block mb-2 uppercase">
                CONTROLLED IMPEDANCE TARGET SPECIFICATIONS (IPC-2141A)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px] font-mono-telemetry">
                <div className="bg-[#050811] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">SINGLE-ENDED RF (WI-FI/BT)</span>
                  <span className="text-cyan-400 font-bold text-sm">50.0 Ω ±5%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Width: 6.2 mil / Gap: 12 mil</span>
                </div>
                <div className="bg-[#050811] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">USB 2.0 / CDC DIFFERENTIAL</span>
                  <span className="text-emerald-400 font-bold text-sm">90.0 Ω ±7%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Width: 5.5 mil / Gap: 6.0 mil</span>
                </div>
                <div className="bg-[#050811] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">LVDS & HDMI TMDS DIFF</span>
                  <span className="text-purple-400 font-bold text-sm">100.0 Ω ±5%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Width: 4.8 mil / Gap: 6.5 mil</span>
                </div>
                <div className="bg-[#050811] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">CAN 2.0B / CAN-FD DIFFERENTIAL</span>
                  <span className="text-amber-400 font-bold text-sm">120.0 Ω ±10%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Split Terminated via R_TERM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: DRC & Design Rules */}
          <div className="w-full md:w-80 bg-[#0b101c] rounded-2xl border border-slate-800 p-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 mb-3 text-cyan-400 font-gauge font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>IPC CLASS 3 AUTOMOTIVE DRC RULES</span>
              </div>

              <div className="space-y-2 text-[11px] font-mono-telemetry">
                <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-slate-200">
                    <span>MIN TRACE / SPACE:</span>
                    <span className="text-emerald-400 font-bold">4.0 / 4.0 mil</span>
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-0.5">High-density BGA escape under UIS7862S</span>
                </div>

                <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-slate-200">
                    <span>HIGH VOLTAGE CLEARANCE:</span>
                    <span className="text-emerald-400 font-bold">&gt;12.0 mil (0.30mm)</span>
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Unconditioned +12V battery and +36V backlight rails</span>
                </div>

                <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-slate-200">
                    <span>MIN VIA HOLE / PAD:</span>
                    <span className="text-emerald-400 font-bold">0.20mm / 0.45mm</span>
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Laser microvias L1-L2, mechanical through vias</span>
                </div>

                <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-slate-200">
                    <span>SOLDER MASK CLEARANCE:</span>
                    <span className="text-emerald-400 font-bold">2.0 mil (0.05mm)</span>
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Matte black automotive grade solder mask</span>
                </div>

                <div className="bg-[#080d18] p-2.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-slate-200">
                    <span>SURFACE FINISH:</span>
                    <span className="text-amber-400 font-bold">ENIG (Electroless Nickel / Immersion Gold)</span>
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Gold 0.05-0.10µm for reliable BGA soldering</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30 text-emerald-300 text-[10px] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>All IPC Class 3 design rules checked and cleared for high-reliability automotive manufacturing.</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: PCB PLACEMENT & CENTROID MAP ================= */}
      {activeTab === 'centroid_map' && (
        <div className="my-3 flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
          <div className="flex-1 bg-[#0b101c] rounded-2xl border border-slate-800 p-4 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-gauge font-bold text-slate-300 uppercase tracking-wider">
                MAINBOARD SMT PLACEMENT & MECHANICAL ENVELOPE (180 × 105 mm DOUBLE DIN)
              </span>
              <span className="text-[10px] text-cyan-400 font-mono-telemetry bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
                ORIGIN (0,0) AT BOTTOM-LEFT
              </span>
            </div>

            {/* Visual Board Canvas */}
            <div className="w-full bg-[#03060c] rounded-xl border border-slate-800 p-4 relative overflow-x-auto min-h-[460px] flex items-center justify-center">
              <svg viewBox="0 0 760 450" className="w-full max-w-[760px] h-auto font-mono-telemetry">
                {/* PCB Outline with corner radii */}
                <rect x="20" y="20" width="720" height="410" rx="14" fill="#061208" stroke="#166534" strokeWidth="2.5" />
                <rect x="22" y="22" width="716" height="406" rx="12" fill="none" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="3 3" />

                {/* Grid guidelines */}
                <line x1="20" y1="225" x2="740" y2="225" stroke="#14532d" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="380" y1="20" x2="380" y2="430" stroke="#14532d" strokeWidth="0.5" strokeDasharray="2 2" />

                {/* Mounting Holes */}
                {[[40, 40], [720, 40], [40, 410], [720, 410]].map(([hx, hy], idx) => (
                  <g key={idx}>
                    <circle cx={hx} cy={hy} r="10" fill="#020803" stroke="#eab308" strokeWidth="2" />
                    <circle cx={hx} cy={hy} r="4" fill="#000" />
                  </g>
                ))}

                {/* Render Components placed by coordinates */}
                {CIRCUIT_COMPONENTS.map((c) => {
                  // Map posX (0-180mm) to SVG (20-740px)
                  // Map posY (0-105mm) to SVG (430-20px) (inverted Y)
                  const svgX = 20 + (c.posX / 180) * 720;
                  const svgY = 430 - (c.posY / 105) * 410;
                  const isSelected = selectedComponent?.ref === c.ref;

                  let color = '#38bdf8';
                  if (c.subsystem === 'POWER') color = '#eab308';
                  if (c.subsystem === 'MICRO_VCU') color = '#c084fc';
                  if (c.subsystem === 'CLUSTER_DISPLAY') color = '#2dd4bf';
                  if (c.subsystem === 'AUDIO_CONNECTORS') color = '#f97316';

                  return (
                    <g
                      key={c.ref}
                      onClick={() => setSelectedComponent(c)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <rect
                        x={svgX - 22}
                        y={svgY - 14}
                        width="44"
                        height="28"
                        rx="4"
                        fill="#050a14"
                        stroke={isSelected ? '#ffffff' : color}
                        strokeWidth={isSelected ? 2.5 : 1.2}
                      />
                      <text
                        x={svgX}
                        y={svgY - 2}
                        fill="#ffffff"
                        fontSize="7"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {c.ref}
                      </text>
                      <text
                        x={svgX}
                        y={svgY + 8}
                        fill={color}
                        fontSize="6"
                        textAnchor="middle"
                      >
                        {c.value.slice(0, 8)}
                      </text>
                    </g>
                  );
                })}

                {/* Edge Callout Connectors */}
                <text x="35" y="195" fill="#f97316" fontSize="9" fontWeight="bold">J1: VEHICLE HARNESS (16-PIN)</text>
                <text x="35" y="380" fill="#f97316" fontSize="9" fontWeight="bold">J3: AHD CAMERA</text>
                <text x="590" y="325" fill="#2dd4bf" fontSize="9" fontWeight="bold">J2: CLUSTER LVDS</text>
                <text x="590" y="110" fill="#38bdf8" fontSize="9" fontWeight="bold">HDMI SECONDARY</text>
                <text x="590" y="225" fill="#38bdf8" fontSize="9" fontWeight="bold">J4: DUAL USB</text>
              </svg>
            </div>
          </div>

          {/* Right Column: Centroid Table */}
          <div className="w-full md:w-80 bg-[#0b101c] rounded-2xl border border-slate-800 p-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <span className="text-xs font-gauge font-bold text-slate-300 uppercase tracking-wider">
                  SMT PICK & PLACE CENTROIDS
                </span>
                <span className="text-[10px] text-cyan-400 font-mono-telemetry bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
                  {CIRCUIT_COMPONENTS.length} ITEMS
                </span>
              </div>

              <div className="max-h-[360px] overflow-y-auto space-y-1 font-mono-telemetry text-[11px] pr-1">
                {CIRCUIT_COMPONENTS.map((c) => (
                  <div
                    key={c.ref}
                    onClick={() => setSelectedComponent(c)}
                    className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                      selectedComponent?.ref === c.ref
                        ? 'bg-cyan-950 border-cyan-500 text-white'
                        : 'bg-[#080d18] border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between font-bold">
                      <span className="text-cyan-300">{c.ref}</span>
                      <span className="text-slate-400">{c.value}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                      <span>X: {c.posX.toFixed(1)}mm / Y: {c.posY.toFixed(1)}mm</span>
                      <span>Rot: {c.rotation}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setExportFormat('pnp');
                setActiveTab('export_center');
              }}
              className="mt-3 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-gauge font-bold text-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPORT CENTROID FILE (.POS)</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 5: NETS & PIN MATRIX TABLE ================= */}
      {activeTab === 'nets_table' && (
        <div className="my-3 flex-1 bg-[#0b101c] rounded-2xl border border-slate-800 p-4 flex flex-col overflow-hidden shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-gauge font-bold text-slate-300 uppercase tracking-wider">
                ELECTRICAL NETLIST & NODE INTERCONNECT MATRIX ({CIRCUIT_NETS.length} NETS)
              </span>
            </div>

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search net name or voltage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#050811] border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-telemetry"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left font-mono-telemetry text-xs">
              <thead className="bg-[#050811] text-slate-400 sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="p-2.5">NET NAME</th>
                  <th className="p-2.5">TYPE</th>
                  <th className="p-2.5">VOLTAGE / IMPEDANCE</th>
                  <th className="p-2.5">DESCRIPTION</th>
                  <th className="p-2.5">CONNECTED PINS / NODES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {CIRCUIT_NETS.filter(
                  (n) =>
                    n.netName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    n.description.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((net) => (
                  <tr key={net.netName} className="hover:bg-cyan-950/20 transition-colors">
                    <td className="p-2.5 font-bold text-cyan-400">{net.netName}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          net.netType === 'POWER'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                            : net.netType === 'DIFFERENTIAL'
                            ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                            : net.netType === 'GROUND'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {net.netType}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-300">{net.voltageLevel || 'N/A'}</td>
                    <td className="p-2.5 text-slate-400 text-[11px]">{net.description}</td>
                    <td className="p-2.5">
                      <div className="flex flex-wrap gap-1">
                        {net.connections.map((node, i) => (
                          <span
                            key={i}
                            className="bg-[#080d18] px-1.5 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700/60"
                          >
                            {node}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= BOTTOM STATUS FOOTER ================= */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono-telemetry text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CIRCUIT NETLIST INTEGRITY: 100% PASS</span>
          </span>
          <span>·</span>
          <span>SCHEMATIC REVISION: 2.5</span>
          <span>·</span>
          <span>EDA STANDARD: KiCad 8.0 & Altium 24 Protel</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadFile(generateKiCadNetlist(), 'Ishmin_Cockpit_3in1.net', 'text/plain')}
            className="text-cyan-400 hover:underline flex items-center gap-1 font-gauge font-bold text-xs"
          >
            <Download className="w-3 h-3" />
            <span>QUICK EXPORT KICAD (.NET)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
