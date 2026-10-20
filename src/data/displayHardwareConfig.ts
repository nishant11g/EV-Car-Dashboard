/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Hardware & Display Specifications
 * Reference: RFQ-IMPL-AUTO-2026-004-R2 (Section 3, Section 5, Section 7)
 */

import { DisplayHardwareSpec } from '../types/telemetry';

export const DISPLAY_HARDWARE_SPECS: DisplayHardwareSpec[] = [
  {
    unit: 'Item A: Primary IVI Processing Unit',
    component: 'System-on-Chip (SoC)',
    specification: 'Unisoc UIS7862S / UIS7870 Octa-Core (ARM Cortex-A75 @ 2.0GHz + Cortex-A55 @ 1.8GHz)',
    purpose: 'Drives Android 14 / 15 Automotive OS, IVI apps, navigation, media, and UI processing.',
    notes: 'Automotive grade, Mali-G52 GPU, dedicated NPU for voice/speech'
  },
  {
    unit: 'Item A: Primary IVI Processing Unit',
    component: 'Memory & Storage',
    specification: '4 GB LPDDR4X RAM + 64 GB Industrial-grade eMMC 5.1 Storage',
    purpose: 'System memory and encrypted local SQLite telematics circular buffer store.',
    notes: 'Hardware-accelerated AES-256 partition encryption required'
  },
  {
    unit: 'Item A: Primary IVI Processing Unit',
    component: 'Primary Screen Form Factor',
    specification: '9.0" to 10.1" IPS Capacitive Multi-touch Panel (1280 x 720 native, >500 nits)',
    purpose: 'Main dashboard touchscreen console for infotainment and driver controls.',
    notes: 'Anti-glare, anti-fingerprint optical bonding coating'
  },
  {
    unit: 'Item A: Primary IVI Processing Unit',
    component: 'Secondary Video Output',
    specification: 'Native HDMI 1.4b / USB Type-C DisplayPort Alternate Mode (1080p60 capable)',
    purpose: 'Extended display interface driving the secondary Instrument Cluster panel.',
    notes: 'Supports Android Presentation API & VirtualDisplay output'
  },
  {
    unit: 'Item B: Dedicated Instrument Cluster',
    component: 'Display Panel & Resolution',
    specification: '8.8" to 12.3" Ultra-Wide Bar-Type IPS Display (1920 x 720 @ 60Hz or 1280 x 480)',
    purpose: 'Dedicated digital instrument cluster showing speedometer, telltales, and power arcs.',
    notes: 'Luminance >600 nits for direct sunlight readability; operating temp -20°C to +70°C'
  },
  {
    unit: 'Item B: Dedicated Instrument Cluster',
    component: 'Wake-Up Performance',
    specification: 'Cold-boot display activation to full telemetry readiness < 4.5 seconds',
    purpose: 'Regulatory compliance for instantaneous telltale & speedometer presentation upon ACC-ON.',
    notes: 'Early-display fast-boot frame buffer initialization'
  },
  {
    unit: 'Item C: Camera & Audio Subsystem',
    component: 'Analog HD Camera Interface',
    specification: 'AHD 720p/1080p PAL/NTSC with hardware interrupt decode (<300ms reverse gear latency)',
    purpose: 'Instant rear-view backup camera display with dynamic trajectory guidelines.',
    notes: 'Hardware overlay bypasses Android window compositor for safety latency target'
  },
  {
    unit: 'Item C: Camera & Audio Subsystem',
    component: 'Safety Chime Speaker Output',
    specification: 'Dedicated secondary 85dB piezoceramic / voice-coil buzzer speaker circuit',
    purpose: 'Guarantees turn-signal ticking, seatbelt reminder, and fault chimes remain audible.',
    notes: 'Physically independent from Android audio stack; operates even if Android audio daemon crashes'
  },
  {
    unit: 'Item D: Micro-VCU Interface Bridge',
    component: 'CAN-to-USB Serial Bridge',
    specification: 'ESP32-S3 or STM32F4 with High-Speed CAN 2.0B Transceiver (250/500 kbps, 120Ω)',
    purpose: 'Bridges vehicle CAN bus to Android host USB-CDC port with <5ms latency profile.',
    notes: 'ISO 7637-2 transient protection, reverse polarity protection, checksum verification'
  },
  {
    unit: 'Security & Telematics',
    component: 'Cryptographic Root of Trust',
    specification: 'Hardware Root of Trust (RoT), Secure Boot, TLS 1.3 / mTLS client certificates',
    purpose: 'Rejects untrusted bootloaders; secures MQTT cloud telemetry ingestion without carrier SIMs.',
    notes: 'JTAG/SWD disabled in production, encrypted SQLite store-and-forward buffer'
  }
];

export const ANDROID_EMULATION_INSTRUCTIONS = {
  overview: 'In Android 14 and 15 (Automotive OS and standard AOSP), dual-display testing is accomplished using virtual display emulation or secondary display overlays.',
  testingMethods: [
    {
      title: 'Method 1: ADB Overlay Display (Immediate Bench Testing)',
      command: 'adb shell settings put global overlay_display_devices 1920x720/160',
      description: 'Creates a persistent hardware overlay on the connected Android 14/15 device or emulator, simulating the 1920x720 cluster at 160 DPI. Both screens are visible simultaneously on the device screen.',
      removalCommand: 'adb shell settings delete global overlay_display_devices'
    },
    {
      title: 'Method 2: Android Automotive Emulator Multi-Display Flags',
      command: 'emulator -avd Pixel_Car -car-display 1920x720:density=160',
      description: 'Launches the Android Automotive OS emulator with an independent cluster display window alongside the primary IVI window.',
      removalCommand: ''
    },
    {
      title: 'Method 3: Dual Physical Monitors (HDMI / Type-C DP-Alt Mode)',
      command: 'android.app.Presentation or DisplayManager.getDisplays()',
      description: 'Connect secondary bar-type LCD via HDMI. Android detects Display ID 1. The app binds the ClusterActivity / ClusterPresentation directly to display ID 1 while IVI runs on Display ID 0.',
      removalCommand: ''
    }
  ],
  deploymentArchitecture: {
    title: 'Production Fail-Safe Decoupling Architecture',
    points: [
      'Level 1 (Direct Hypervisor / Micro-VCU Bypass): The Cluster display is driven by a secondary hardware display controller or real-time MCU connected directly to the CAN bus.',
      'Level 2 (Failure Isolation Guarantee): When Android IVI crashes, freezes, or reboots, the Cluster video path is unaffected and continues rendering live speedometer readings and telltales in <50ms.',
      'Level 3 (Audio Separation): Safety chimes (turn signal click, seatbelt alert, critical HV warning) route through a hardware chime synthesizer so they stay audible even during IVI media stack crashes.'
    ]
  }
};
