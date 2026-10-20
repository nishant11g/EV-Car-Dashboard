/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Wi-Fi Connectivity & Telemetry Stream Manager
 * Reference: RFQ-IMPL-AUTO-2026-004-R2 (Section 4.1 & 4.2)
 */

import React, { useState } from 'react';
import { WifiConnectionState, WifiNetwork } from '../../types/telemetry';
import {
  Wifi,
  WifiOff,
  Radio,
  Lock,
  ArrowLeft,
  Check,
  RefreshCw,
  Activity,
  Server,
  Zap,
  Globe,
  HelpCircle,
  Eye
} from 'lucide-react';

interface WifiManagerScreenProps {
  wifiState: WifiConnectionState;
  availableNetworks: WifiNetwork[];
  onBack: () => void;
  onConnectWifi: (ssid: string) => void;
  onDisconnectWifi: () => void;
  onToggleWifiEnabled: () => void;
  onToggleHotspot: () => void;
  onToggleTelemetryStream: () => void;
  onNavigateToTelemetry: () => void;
}

export const WifiManagerScreen: React.FC<WifiManagerScreenProps> = ({
  wifiState,
  availableNetworks,
  onBack,
  onConnectWifi,
  onDisconnectWifi,
  onToggleWifiEnabled,
  onToggleHotspot,
  onToggleTelemetryStream,
  onNavigateToTelemetry,
}) => {
  const [selectedSsid, setSelectedSsid] = useState<string | null>(null);
  const [connectingSsid, setConnectingSsid] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 800);
  };

  const handleConnect = (ssid: string) => {
    setConnectingSsid(ssid);
    setTimeout(() => {
      onConnectWifi(ssid);
      setConnectingSsid(null);
    }, 600);
  };

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
              WI-FI CONNECTIVITY & TELEMETRY NETWORK
            </h2>
            <span className="text-[11px] text-slate-400 font-mono-telemetry">
              DUAL-BAND 802.11AC (2.4/5.0 GHZ) · DRIVER HOTSPOT & DEPOT SYNC · TCP/UDP TELEMETRY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct shortcut to EV Telemetry */}
          <button
            onClick={onNavigateToTelemetry}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/50 hover:bg-cyan-900/60 text-xs text-cyan-300 transition-colors font-gauge font-bold"
            title="Inspect Live EV Telemetry & BMS dashboard"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>VIEW LIVE TELEMETRY</span>
          </button>

          <button
            onClick={handleScan}
            disabled={!wifiState.isEnabled || isScanning}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-300 transition-colors font-gauge disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isScanning ? 'animate-spin' : ''}`} />
            <span>SCAN NETWORKS</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-3.5 my-3 flex-1 items-stretch">
        {/* Left Column: Wi-Fi Networks List & Status */}
        <div className="col-span-7 bg-[#0b101c] p-4 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-md">
          <div>
            {/* Master Wi-Fi Toggle */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  wifiState.isEnabled
                    ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {wifiState.isEnabled ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-sm font-gauge font-bold text-white block">
                    Wi-Fi Radio ({wifiState.isEnabled ? 'ON' : 'OFF'})
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Unisoc UIS7862S dual-band 2.4 GHz / 5.0 GHz MAC
                  </span>
                </div>
              </div>

              {/* Switch button */}
              <button
                onClick={onToggleWifiEnabled}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  wifiState.isEnabled ? 'bg-cyan-600' : 'bg-slate-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  wifiState.isEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Current Active Connection Banner */}
            {wifiState.connectedNetwork ? (
              <div className="p-3 bg-gradient-to-r from-[#0d1c2e] to-[#091322] rounded-xl border border-cyan-500/40 mb-3 shadow-inner">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-gauge font-bold text-white">CONNECTED NETWORK</span>
                  </div>
                  <span className="text-[10px] font-mono-telemetry bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                    {wifiState.connectedNetwork.frequency} · {wifiState.connectedNetwork.security}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div>
                    <span className="text-sm font-semibold text-white block">
                      {wifiState.connectedNetwork.ssid}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5 font-mono-telemetry">
                      <span>IP: <strong className="text-slate-200">{wifiState.ipAddress}</strong></span>
                      <span>GW: <strong className="text-slate-200">{wifiState.gateway}</strong></span>
                      <span>RSSI: <strong className="text-emerald-400">{wifiState.connectedNetwork.signalStrengthDbm} dBm</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={onDisconnectWifi}
                    className="bg-slate-800 hover:bg-slate-700 text-rose-300 font-gauge text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                  >
                    DISCONNECT
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 mb-3 text-xs text-slate-400 flex items-center justify-between">
                <span>No Wi-Fi network currently connected.</span>
                <span className="text-amber-400 font-gauge">OFFLINE STORE-AND-FORWARD BUFFERING</span>
              </div>
            )}

            {/* Available Wi-Fi Networks List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-gauge font-bold text-slate-400 uppercase tracking-wider">
                  AVAILABLE NETWORKS ({availableNetworks.length})
                </span>
                <span className="text-[10px] text-slate-500">CLICK TO CONNECT</span>
              </div>

              {!wifiState.isEnabled ? (
                <div className="p-6 bg-[#070b14] rounded-xl border border-slate-800 text-center text-slate-500 text-xs">
                  Turn on Wi-Fi above to search for available networks.
                </div>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {availableNetworks.map((net) => {
                    const isConn = wifiState.connectedNetwork?.ssid === net.ssid;
                    const isBusy = connectingSsid === net.ssid;
                    return (
                      <div
                        key={net.ssid}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                          isConn
                            ? 'bg-[#0e1726] border-cyan-500/50 text-white'
                            : 'bg-[#070b14] border-slate-800/80 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Wifi className={`w-4 h-4 ${isConn ? 'text-cyan-400' : 'text-slate-500'}`} />
                          <div>
                            <span className="text-xs font-semibold block">{net.ssid}</span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono-telemetry mt-0.5">
                              <span>{net.frequency}</span>
                              <span>·</span>
                              <span>{net.security}</span>
                              <span>·</span>
                              <span>{net.signalStrengthDbm} dBm</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {isConn ? (
                            <span className="flex items-center gap-1 text-[11px] font-gauge font-bold text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded">
                              <Check className="w-3.5 h-3.5" /> CONNECTED
                            </span>
                          ) : (
                            <button
                              onClick={() => handleConnect(net.ssid)}
                              disabled={isBusy}
                              className="bg-slate-800 hover:bg-slate-700 text-cyan-400 font-gauge text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
                            >
                              {isBusy ? 'CONNECTING...' : 'CONNECT'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Depot & Hotspot Note */}
          <div className="mt-2 p-2.5 bg-[#060a12] rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>RFQ 4.1: Uses Driver mobile Wi-Fi hotspot or Depot Wi-Fi for cloud upload.</span>
            <span className="text-cyan-400 font-mono-telemetry">ZERO BUNDLED SIMS</span>
          </div>
        </div>

        {/* Right Column: Local Wi-Fi Telemetry Stream & Hotspot Controls */}
        <div className="col-span-5 space-y-3">
          {/* Local Wi-Fi Telemetry Stream Server (Port 35000) */}
          <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-gauge font-bold text-slate-200">
                  WI-FI TELEMETRY STREAM SERVER
                </span>
              </div>
              <span className={`text-[10px] font-mono-telemetry px-2 py-0.5 rounded border ${
                wifiState.telemetryStreamActive
                  ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}>
                {wifiState.telemetryStreamActive ? 'PORT 35000 ACTIVE' : 'STOPPED'}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Streams real-time CAN bus telemetry frames over local TCP/UDP Wi-Fi socket to bench diagnostic tablets and engineers.
            </p>

            <div className="space-y-2 bg-[#070b14] p-3 rounded-xl border border-slate-800 text-xs font-mono-telemetry mb-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">SOCKET ADDRESS:</span>
                <span className="text-white font-bold">{wifiState.ipAddress || '192.168.43.104'}:35000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">PACKETS STREAMED:</span>
                <span className="text-cyan-400 font-bold">{wifiState.dataPacketsReceived.toLocaleString()} frames</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">PROTOCOL:</span>
                <span className="text-slate-200">Newline-delimited JSON / CAN 2.0B</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={onToggleTelemetryStream}
                className={`text-xs font-gauge px-3.5 py-2 rounded-xl border font-bold transition-colors ${
                  wifiState.telemetryStreamActive
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-500'
                }`}
              >
                {wifiState.telemetryStreamActive ? 'DISABLE WI-FI STREAM' : 'ENABLE WI-FI STREAM'}
              </button>

              <button
                onClick={onNavigateToTelemetry}
                className="text-xs font-gauge text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>OPEN TELEMETRY</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          </div>

          {/* In-Vehicle 5 GHz Wi-Fi Hotspot (for CarPlay / Android Auto & Passenger Devices) */}
          <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-gauge font-bold text-slate-200">
                  IN-VEHICLE 5.0 GHZ HOTSPOT (WAC AP)
                </span>
              </div>
              <button
                onClick={onToggleHotspot}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  wifiState.inVehicleHotspotEnabled ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  wifiState.inVehicleHotspotEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Provides the dedicated 5 GHz direct Wi-Fi channel required for <strong>Wireless Apple CarPlay & Android Auto</strong> projection.
            </p>

            <div className="bg-[#070b14] p-2.5 rounded-xl border border-slate-800 text-xs font-mono-telemetry space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">SSID:</span>
                <span className="text-white font-bold">{wifiState.hotspotSsid}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">CHANNEL:</span>
                <span className="text-blue-400">5.0 GHz (DFS Band 149)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
