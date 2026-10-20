/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Cloud DB Telemetry Sync & Scheduler Screen
 * Sends EV telemetry to configurable Cloud DB over Wi-Fi on demand and once daily
 */

import React, { useState } from 'react';
import {
  CloudDbConfig,
  CloudDbSyncLog,
  WifiConnectionState
} from '../../types/telemetry';
import {
  Database,
  Cloud,
  Wifi,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Key,
  Layers,
  Save,
  Code,
  Sparkles,
  Lock,
  RefreshCw,
  FileText
} from 'lucide-react';

interface CloudDbSyncScreenProps {
  config: CloudDbConfig;
  logs: CloudDbSyncLog[];
  wifiState: WifiConnectionState;
  isSyncing: boolean;
  onBack: () => void;
  onUpdateConfig: (partial: Partial<CloudDbConfig>) => void;
  onTriggerSync: (triggerType: 'ON_DEMAND' | 'SCHEDULED_DAILY') => void;
  onNavigateToWifi: () => void;
}

export const CloudDbSyncScreen: React.FC<CloudDbSyncScreenProps> = ({
  config,
  logs,
  wifiState,
  isSyncing,
  onBack,
  onUpdateConfig,
  onTriggerSync,
  onNavigateToWifi,
}) => {
  const [urlInput, setUrlInput] = useState(config.endpointUrl);
  const [apiKeyInput, setApiKeyInput] = useState(config.apiKey);
  const [dbNameInput, setDbNameInput] = useState(config.databaseName);
  const [tableNameInput, setTableNameInput] = useState(config.collectionOrTable);
  const [scheduleTimeInput, setScheduleTimeInput] = useState(config.dailyScheduleTime);
  const [scheduleEnabled, setScheduleEnabled] = useState(config.dailyScheduleEnabled);
  const [requireWifiOnly, setRequireWifiOnly] = useState(config.requireWifiOnly);
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isWifiConnected = wifiState.isEnabled && wifiState.connectedNetwork !== null;

  const handleSaveConfig = () => {
    onUpdateConfig({
      endpointUrl: urlInput.trim(),
      apiKey: apiKeyInput.trim(),
      databaseName: dbNameInput.trim(),
      collectionOrTable: tableNameInput.trim(),
      dailyScheduleTime: scheduleTimeInput,
      dailyScheduleEnabled: scheduleEnabled,
      requireWifiOnly,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
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
              CLOUD DATABASE TELEMETRY SYNC ENGINE
            </h2>
            <span className="text-[11px] text-slate-400 font-mono-telemetry">
              WI-FI TELEMETRY DISPATCH · ON-DEMAND & ONCE-DAILY SCHEDULER
            </span>
          </div>
        </div>

        {/* Wi-Fi Status Quick Indicator */}
        <div className="flex items-center gap-3">
          <div
            onClick={onNavigateToWifi}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-all ${
              isWifiConnected
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400'
                : 'bg-amber-950/50 border-amber-500/40 text-amber-400'
            }`}
            title="Click to manage Wi-Fi connections"
          >
            <Wifi className="w-4 h-4" />
            <span className="font-gauge font-bold">
              {isWifiConnected ? `WI-FI: ${wifiState.connectedNetwork?.ssid}` : 'WI-FI DISCONNECTED'}
            </span>
          </div>

          <button
            onClick={() => onTriggerSync('ON_DEMAND')}
            disabled={isSyncing}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-gauge text-xs px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>{isSyncing ? 'TRANSMITTING...' : 'SYNC NOW (ON DEMAND)'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-3.5 my-3 flex-1 items-stretch">
        {/* Left Column: Configuration & Endpoints */}
        <div className="col-span-6 bg-[#0b101c] p-4 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-gauge font-bold text-slate-400 uppercase tracking-wider">
                CLOUD DB ENDPOINT CONFIGURATION
              </span>
              <Database className="w-4 h-4 text-cyan-400" />
            </div>

            {/* Cloud DB Endpoint URL */}
            <div>
              <label className="text-[11px] font-gauge font-bold text-slate-300 block mb-1">
                TARGET CLOUD DATABASE REST / INGESTION URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://your-cloud-db.com/api/v1/telemetry"
                  className="w-full bg-[#070b14] border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs font-mono-telemetry text-cyan-300 outline-none pr-10"
                />
                <Cloud className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Compatible with any REST DB, MongoDB Data API, Supabase, Firebase, or custom cloud cluster.
              </span>
            </div>

            {/* API Key / Token */}
            <div>
              <label className="text-[11px] font-gauge font-bold text-slate-300 block mb-1">
                API AUTHENTICATION TOKEN / SECRET
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Bearer token or DB Secret Key"
                  className="w-full bg-[#070b14] border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs font-mono-telemetry text-slate-200 outline-none pr-10"
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Database & Collection Names */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-gauge font-bold text-slate-400 block mb-1">
                  DATABASE NAME
                </label>
                <input
                  type="text"
                  value={dbNameInput}
                  onChange={(e) => setDbNameInput(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs font-mono-telemetry text-white outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-gauge font-bold text-slate-400 block mb-1">
                  COLLECTION / TABLE
                </label>
                <input
                  type="text"
                  value={tableNameInput}
                  onChange={(e) => setTableNameInput(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs font-mono-telemetry text-white outline-none"
                />
              </div>
            </div>

            {/* Transmission Policy */}
            <div className="p-3 bg-[#070b14] rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-gauge font-bold text-white block">
                    REQUIRE WI-FI CONNECTION ONLY
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Buffers offline in local SQLite circular buffer until driver or depot Wi-Fi connects.
                  </span>
                </div>
                <button
                  onClick={() => setRequireWifiOnly(!requireWifiOnly)}
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                    requireWifiOnly ? 'bg-cyan-600' : 'bg-slate-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    requireWifiOnly ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Save Configuration Button */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {savedSuccess ? 'Configuration saved to persistent memory!' : 'Updates persistent head unit storage.'}
            </span>
            <button
              onClick={handleSaveConfig}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-400 font-gauge text-xs px-4 py-2 rounded-xl border border-slate-700 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SAVE CLOUD DB CONFIG</span>
            </button>
          </div>
        </div>

        {/* Right Column: Scheduled Daily Sync & Recent Dispatch Logs */}
        <div className="col-span-6 space-y-3 flex flex-col justify-between">
          {/* Daily Schedule Card */}
          <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-gauge font-bold text-slate-200">
                  ONCE DAILY AUTOMATED TELEMETRY SCHEDULE
                </span>
              </div>
              <button
                onClick={() => setScheduleEnabled(!scheduleEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  scheduleEnabled ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  scheduleEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Automatically packages all daily drive cycles, battery degradation stats, and energy usage, then uploads to your Cloud DB once every 24 hours over Wi-Fi.
            </p>

            <div className="grid grid-cols-2 gap-2.5 bg-[#070b14] p-3 rounded-xl border border-slate-800 mb-3">
              <div>
                <span className="text-[10px] font-gauge font-bold text-slate-500 block mb-1">
                  DAILY SYNC TIME (HH:MM)
                </span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <input
                    type="time"
                    value={scheduleTimeInput}
                    onChange={(e) => setScheduleTimeInput(e.target.value)}
                    className="bg-black/60 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono-telemetry text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-gauge font-bold text-slate-500 block mb-1">
                  LAST DAILY RUN STATUS
                </span>
                <span className="text-xs font-mono-telemetry text-emerald-400 font-bold block">
                  {config.lastDailySyncDate ? `Completed on ${config.lastDailySyncDate}` : 'Pending Today'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono-telemetry">
                SCHEDULE STATUS: {scheduleEnabled ? 'ENABLED (24H CRON)' : 'PAUSED'}
              </span>

              <button
                onClick={() => onTriggerSync('SCHEDULED_DAILY')}
                disabled={isSyncing}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-gauge text-xs px-3 py-1.5 rounded-xl border border-slate-700 font-bold transition-colors disabled:opacity-50"
              >
                TEST DAILY CRON DISPATCH
              </button>
            </div>
          </div>

          {/* Recent Transmission Audit Trail */}
          <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-gauge font-bold text-slate-400 uppercase tracking-wider">
                  RECENT CLOUD INGESTION LOGS ({logs.length})
                </span>
                <span className="text-[10px] text-emerald-400 font-mono-telemetry">
                  TLS 1.3 ENCRYPTED POST
                </span>
              </div>

              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-[#070b14] border border-slate-800/80 text-xs font-mono-telemetry space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : log.status === 'QUEUED_OFFLINE'
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                            : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                        }`}>
                          {log.status} {log.httpStatusCode > 0 ? `(HTTP ${log.httpStatusCode})` : ''}
                        </span>
                        <span className="text-slate-400 text-[10px]">{log.triggerType}</span>
                      </div>
                      <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans line-clamp-1">
                      {log.responseMessage}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 border-t border-slate-800/50">
                      <span>Transport: <strong className="text-cyan-400">{log.transport}</strong></span>
                      <span>Payload: <strong className="text-slate-300">{log.payloadSizeKb} KB</strong></span>
                      <span>Latency: <strong className="text-white">{log.latencyMs} ms</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Automatic exponential backoff enabled on network fault.</span>
              <span className="text-cyan-400 font-mono-telemetry">STORE-AND-FORWARD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
