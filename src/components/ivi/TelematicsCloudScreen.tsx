/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Telematics & Cloud Handshake Application Screen
 * Reference: RFQ-IMPL-AUTO-2026-004-R2 (Section 4: Protocol & Store-and-Forward)
 */

import React, { useState } from 'react';
import { TelematicsStatus, BmsData, MotorTelemetry, VehicleTripData } from '../../types/telemetry';
import {
  Cloud,
  CheckCircle2,
  Clock,
  Wifi,
  Database,
  ArrowLeft,
  RefreshCw,
  Lock,
  Layers,
  Send,
  Code
} from 'lucide-react';

interface TelematicsCloudScreenProps {
  telematics: TelematicsStatus;
  bms: BmsData;
  motorTelemetry: MotorTelemetry;
  vehicleTrip: VehicleTripData;
  onBack: () => void;
  onTriggerHandshake: () => void;
  onSimulateDisconnect: () => void;
  onNavigateToCloudDb?: () => void;
}

export const TelematicsCloudScreen: React.FC<TelematicsCloudScreenProps> = ({
  telematics,
  bms,
  motorTelemetry,
  vehicleTrip,
  onBack,
  onTriggerHandshake,
  onSimulateDisconnect,
  onNavigateToCloudDb,
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'payload' | 'buffer'>('flow');

  // Simulated MQTT batch payload matching RFQ Section 4.2 Step 5
  const sampleTelemetryPayload = {
    header: {
      vin: 'IND-ISHMIN-2026-EV0042',
      vcuControllerId: 'VCU-ESP32S3-HW04-REV2',
      firmwareVersion: '1.4.2-STABLE',
      timestamp: new Date().toISOString(),
      cryptoProtocol: 'TLS_1_3_ECDHE_RSA_AES256_GCM_SHA384'
    },
    tractionPack: {
      socPercent: bms.soc,
      sohPercent: bms.soh,
      packVoltageV: bms.packVoltage,
      packCurrentA: bms.packCurrent,
      packPowerKw: bms.packPowerKw,
      batteryAvgTempC: bms.batteryTempC,
      cellMaxVoltageV: bms.maxCellVoltage,
      cellMinVoltageV: bms.minCellVoltage
    },
    powertrain: {
      vehicleSpeedKmh: motorTelemetry.speedKmh,
      motorRpm: motorTelemetry.motorRpm,
      motorTorqueNm: motorTelemetry.torqueNm,
      motorTempC: motorTelemetry.motorTempC,
      inverterTempC: motorTelemetry.inverterTempC,
      estimatedRangeKm: vehicleTrip.estimatedRangeKm
    },
    chassis: {
      odometerKm: vehicleTrip.odometerKm,
      tripKm: vehicleTrip.tripKm,
      aux12vVoltage: vehicleTrip.aux12vVoltage,
      activeDtcCount: 0
    }
  };

  const steps = [
    {
      id: 'NETWORK_AVAILABLE',
      name: '1. Network Detection',
      desc: 'Detect authenticated connection via local Wi-Fi or driver hotspot.',
      active: telematics.wifiConnected,
    },
    {
      id: 'AUTHENTICATING',
      name: '2. Cryptographic Handshake Initiation',
      desc: 'Send mTLS session ping with hardware Root-of-Trust token to Ishmin cloud.',
      active: telematics.state === 'AUTHENTICATING' || telematics.state === 'WAITING_FOR_ACK' || telematics.state === 'CONNECTED' || telematics.state === 'TRANSMITTING',
    },
    {
      id: 'WAITING_FOR_ACK',
      name: '3. Handshake Success Validation',
      desc: 'Receive and record bidirectional "Success" code before promoting session.',
      active: telematics.state === 'WAITING_FOR_ACK' || telematics.state === 'CONNECTED' || telematics.state === 'TRANSMITTING',
    },
    {
      id: 'CONNECTED',
      name: '4. Active MQTT TLS 1.3 Transport',
      desc: 'Publish telemetry frames (5s active drive, 60s idle, immediate on DTC).',
      active: telematics.state === 'CONNECTED' || telematics.state === 'TRANSMITTING',
    },
  ];

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
              TELEMATICS ENGINE & STORE-AND-FORWARD PROTOCOL
            </h2>
            <span className="text-[11px] text-slate-400 font-mono-telemetry">
              RFQ SECTION 4.2 · ZERO-BUNDLED-SIM · ENCRYPTED SQLITE CIRCULAR BUFFER
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToCloudDb && (
            <button
              onClick={onNavigateToCloudDb}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-500/50 hover:bg-cyan-900/60 text-xs text-cyan-300 transition-colors font-gauge font-bold shadow-md"
            >
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>CLOUD DB SYNC</span>
            </button>
          )}

          {telematics.state === 'CONNECTED' ? (
            <button
              onClick={onSimulateDisconnect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-xs text-slate-300 transition-colors font-gauge"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>SIMULATE OFFLINE</span>
            </button>
          ) : (
            <button
              onClick={onTriggerHandshake}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/50 hover:bg-cyan-900/60 text-xs text-cyan-300 transition-colors font-gauge"
            >
              <Send className="w-3.5 h-3.5" />
              <span>INITIATE HANDSHAKE</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-3.5 my-3 flex-1 items-stretch">
        {/* Left Column: Handshake State Machine & Circular Buffer Status */}
        <div className="col-span-6 space-y-3">
          {/* Status Badge Card */}
          <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-gauge font-bold text-slate-400 uppercase tracking-wider">
                SESSION HANDSHAKE STATE
              </span>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-mono-telemetry">mTLS 1.3 CERT PINNED</span>
              </div>
            </div>

            <div className="p-3 bg-[#070b14] rounded-xl border border-slate-800 flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] text-slate-500 block font-gauge">ACTIVE DAEMON STATUS</span>
                <span className={`text-base font-gauge font-bold ${
                  telematics.state === 'CONNECTED'
                    ? 'text-emerald-400 glow-green'
                    : telematics.state === 'AUTHENTICATING' || telematics.state === 'WAITING_FOR_ACK'
                    ? 'text-cyan-400 animate-pulse'
                    : 'text-amber-400'
                }`}>
                  {telematics.state}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block font-gauge">BROKER URL</span>
                <span className="text-xs font-mono-telemetry text-slate-300">{telematics.endpointUrl}</span>
              </div>
            </div>

            {/* Stepper Display */}
            <div className="space-y-2 mt-2">
              {steps.map((s, idx) => (
                <div
                  key={s.id}
                  className={`p-2.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    s.active ? 'bg-[#0f172a] border-cyan-500/40' : 'bg-[#060a12] border-slate-800/60 opacity-50'
                  }`}
                >
                  <div className={`mt-0.5 rounded-full p-1 ${s.active ? 'bg-cyan-950 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-gauge font-bold text-slate-200 block">{s.name}</span>
                    <span className="text-[11px] text-slate-400 leading-tight block">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SQLite Circular Buffer Card */}
          <div className="bg-[#0b101c] p-4 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-gauge font-bold text-slate-400 uppercase tracking-wider">
                ENCRYPTED SQLITE CIRCULAR BUFFER
              </span>
              <Database className="w-4 h-4 text-cyan-400" />
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              While disconnected, telemetry snapshots are written to an internal, AES-256 encrypted circular ring-buffer.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#070b14] p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-gauge">BUFFERED FRAMES</span>
                <span className="text-lg font-gauge font-bold text-cyan-400">
                  {telematics.bufferedRecordsCount}
                </span>
              </div>
              <div className="bg-[#070b14] p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-gauge">BUFFER SIZE</span>
                <span className="text-lg font-gauge font-bold text-white">
                  {telematics.encryptedBufferSizeKb.toFixed(1)} KB
                </span>
              </div>
              <div className="bg-[#070b14] p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-gauge">RETRY ATTEMPT</span>
                <span className="text-lg font-gauge font-bold text-amber-400">
                  {telematics.retryAttempt}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live MQTT Batch JSON Payload Inspector */}
        <div className="col-span-6 bg-[#0b101c] p-4 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-gauge font-bold text-slate-300">
                  LIVE OUTGOING MQTT BATCH PAYLOAD
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono-telemetry bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                TOPIC: ishmin/v1/telemetry/publish
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-2">
              Schema conforms strictly to Ishmin Motors RFQ Section 4.2 Step 5.
            </p>

            {/* Code block */}
            <div className="bg-[#04070e] p-3 rounded-xl border border-slate-800/80 font-mono-telemetry text-[11px] text-slate-300 overflow-y-auto max-h-[360px] leading-relaxed">
              <pre>{JSON.stringify(sampleTelemetryPayload, null, 2)}</pre>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 mt-2 font-mono-telemetry">
            <span>LAST UPLOAD: {telematics.lastTelemetryUploadTimestamp || 'None'}</span>
            <span>CYCLE: 5s DRIVE / 60s IDLE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
