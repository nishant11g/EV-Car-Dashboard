/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit Telemetry & CAN Signal Types
 */

export type Gear = 'P' | 'R' | 'N' | 'D';
export type DriveMode = 'ECO' | 'NORMAL' | 'SPORT';
export type RegenLevel = 0 | 1 | 2 | 3;

export interface TelltaleState {
  ready: boolean;               // Green READY symbol
  hvFault: boolean;            // Red Vehicle with '!' - High Voltage critical fault
  turtleMode: boolean;         // Amber Tortoise - Derated/limited power
  lowSoc: boolean;             // Amber Battery (solid <15%, flashing <10%)
  chargingGunLocked: boolean;  // Amber/Green Plug - Drive interlock active
  regenBraking: boolean;       // Cyan energy bar active
  parkingBrake: boolean;       // Red Circle with 'P' or '!'
  auxBatteryFault: boolean;    // Red 12V Battery symbol (<11.5V)
  absFault: boolean;           // Amber (ABS) symbol
  escIntervention: boolean;    // Amber Vehicle with skid marks
  epasFault: boolean;          // Amber/Red Steering wheel + '!'
  airbagFault: boolean;        // Red passenger + airbag
  seatbeltReminder: boolean;   // Flashing red occupant with belt (>0 km/h)
  leftIndicator: boolean;      // Flashing green arrow (1.5 Hz)
  rightIndicator: boolean;     // Flashing green arrow (1.5 Hz)
  highBeam: boolean;           // Solid Blue headlamp
  positionLamps: boolean;      // Solid Green dual sidelights
  fogLamps: boolean;           // Green/Amber fog lamp symbol
  doorAjar: boolean;           // Red top-down car graphic
  bonnetAjar: boolean;         // Red bonnet unlatched
}

export interface BmsData {
  soc: number;                 // State of Charge (%)
  soh: number;                 // State of Health (%)
  packVoltage: number;         // Volts (V)
  packCurrent: number;         // Amperes (A, + discharge, - regen/charge)
  packPowerKw: number;         // Calculated Power (kW)
  batteryTempC: number;        // Battery pack average temp (°C)
  maxCellVoltage: number;      // Max cell voltage (V)
  minCellVoltage: number;      // Min cell voltage (V)
  maxCellTemp: number;         // Max cell temperature (°C)
  chargingStatus: 'DISCONNECTED' | 'CONNECTED_IDLE' | 'AC_CHARGING' | 'DC_FAST_CHARGING';
  chargeTimeRemainingMin: number;
}

export interface MotorTelemetry {
  speedKmh: number;            // Current speed (km/h)
  motorRpm: number;            // Motor RPM
  inverterTempC: number;       // Inverter temperature (°C)
  motorTempC: number;          // Motor stator temperature (°C)
  torqueNm: number;            // Output torque (Nm)
  throttlePercent: number;     // 0-100%
  brakePedalPercent: number;   // 0-100%
  energyConsumptionWhKm: number; // Wh/km
}

export interface VehicleTripData {
  odometerKm: number;
  tripKm: number;
  tripDurationSec: number;
  estimatedRangeKm: number;
  aux12vVoltage: number;       // Aux battery voltage (V)
  ambientTempC: number;
  doorStates: {
    driver: boolean;
    passenger: boolean;
    bonnet: boolean;
    trunk: boolean;
  };
}

export interface DTCItem {
  code: string;
  subsystem: 'POWERTRAIN' | 'BMS' | 'BRAKING' | 'STEERING' | 'BODY' | 'NETWORK';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
  recommendation: string;
  status: 'ACTIVE' | 'PENDING' | 'STORED';
  timestamp: string;
}

export type CloudHandshakeStep = 
  | 'DISCONNECTED'
  | 'NETWORK_AVAILABLE'
  | 'AUTHENTICATING'
  | 'WAITING_FOR_ACK'
  | 'CONNECTED'
  | 'TRANSMITTING'
  | 'ERROR_BACKOFF';

export interface TelematicsStatus {
  state: CloudHandshakeStep;
  wifiConnected: boolean;
  cellularConnected: boolean;
  signalStrengthDbm: number;
  lastHandshakeTimestamp: string | null;
  lastTelemetryUploadTimestamp: string | null;
  bufferedRecordsCount: number;
  failedUploadsCount: number;
  retryAttempt: number;
  endpointUrl: string;
  brokerProtocol: 'MQTT_TLS_1_3' | 'HTTPS';
  encryptedBufferSizeKb: number;
}

export interface TelemetrySnapshot {
  timestamp: number;
  speed: number;
  soc: number;
  voltage: number;
  current: number;
  powerKw: number;
  motorTemp: number;
  batteryTemp: number;
}

export interface CANSignalMapping {
  canId: string;
  messageName: string;
  signalName: string;
  startBit: number;
  bitLength: number;
  byteOrder: 'Intel (Little-Endian)' | 'Motorola (Big-Endian)';
  dataType: 'Signed' | 'Unsigned' | 'Enum' | 'Boolean';
  factor: number;
  offset: number;
  min: number;
  max: number;
  unit: string;
  cycleTimeMs: number;
  telemetryField: string;
  sampleValue: string;
  description: string;
}

export interface DisplayHardwareSpec {
  unit: string;
  component: string;
  specification: string;
  purpose: string;
  notes: string;
}

export interface WifiNetwork {
  ssid: string;
  bssid: string;
  signalStrengthDbm: number;
  frequency: '2.4GHz' | '5GHz';
  security: 'WPA2' | 'WPA3' | 'OPEN';
  isConnected: boolean;
  isKnown: boolean;
}

export interface WifiConnectionState {
  isEnabled: boolean;
  connectedNetwork: WifiNetwork | null;
  ipAddress: string | null;
  gateway: string | null;
  subnetMask: string | null;
  macAddress: string;
  inVehicleHotspotEnabled: boolean;
  hotspotSsid: string;
  hotspotFrequency: '5.0 GHz' | '2.4 GHz';
  telemetryStreamPort: number; // e.g., 35000 (TCP/UDP telemetry socket)
  telemetryStreamActive: boolean;
  dataPacketsReceived: number;
}

export interface ProjectionStatus {
  activeType: 'NONE' | 'CARPLAY' | 'ANDROID_AUTO';
  connectionMode: 'WIRELESS_5GHZ' | 'USB_WIRED';
  deviceModel: string;
  wirelessBtPaired: boolean;
  wifiApRunning: boolean;
  audioChannels: {
    mediaMusic: boolean;
    voiceGuidance: boolean;
    phoneCall: boolean;
  };
  screenResolution: string;
  latencyMs: number;
  certStatus: 'VERIFIED_MFI_APPLE' | 'VERIFIED_GAL_GOOGLE' | 'UNLINKED';
  projectionState: 'DISCONNECTED' | 'PAIRING_BT' | 'HANDSHAKE_WIFI' | 'ACTIVE_STREAMING';
}

export interface CloudDbConfig {
  endpointUrl: string;
  apiKey: string;
  databaseName: string;
  collectionOrTable: string;
  dailyScheduleTime: string; // "HH:MM" e.g. "02:00"
  dailyScheduleEnabled: boolean;
  lastDailySyncDate: string | null;
  requireWifiOnly: boolean;
}

export interface CloudDbSyncLog {
  id: string;
  timestamp: string;
  endpointUrl: string;
  triggerType: 'ON_DEMAND' | 'SCHEDULED_DAILY';
  transport: 'WIFI_5GHZ' | 'WIFI_2GHZ' | 'OFFLINE_BUFFERED';
  recordsCount: number;
  payloadSizeKb: number;
  status: 'SUCCESS' | 'ERROR' | 'QUEUED_OFFLINE';
  httpStatusCode: number;
  latencyMs: number;
  responseMessage: string;
}

