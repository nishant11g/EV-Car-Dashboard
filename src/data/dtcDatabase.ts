/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Diagnostic Trouble Code (DTC) Database
 */

import { DTCItem } from '../types/telemetry';

export const INITIAL_DTCS: DTCItem[] = [
  {
    code: 'P0A80',
    subsystem: 'BMS',
    severity: 'WARNING',
    description: 'Replace Hybrid/EV Battery Pack Degradation Threshold',
    recommendation: 'Check individual cell group delta voltages; perform pack balancing cycle.',
    status: 'ACTIVE',
    timestamp: '2026-10-10 08:42:15'
  },
  {
    code: 'U0100',
    subsystem: 'NETWORK',
    severity: 'WARNING',
    description: 'Lost Communication With Engine/Motor Control Module (MCU)',
    recommendation: 'Inspect CAN 2.0B bus termination resistor (120 Ohm) and wiring harness continuity.',
    status: 'STORED',
    timestamp: '2026-10-09 17:14:02'
  },
  {
    code: 'C1201',
    subsystem: 'BRAKING',
    severity: 'INFO',
    description: 'Engine/Powertrain Control System Malfunction Interlock',
    recommendation: 'Verify regen-braking blend pressure sensor calibration.',
    status: 'STORED',
    timestamp: '2026-10-08 11:20:55'
  }
];

export const CRITICAL_FAULT_DTC: DTCItem = {
  code: 'P0AA6',
  subsystem: 'POWERTRAIN',
  severity: 'CRITICAL',
  description: 'Hybrid/EV Battery Positive Contactor Circuit Isolation Loss',
  recommendation: 'DANGER: Isolation resistance dropped below 100 Ohm/V. Immediate contactor open commanded.',
  status: 'ACTIVE',
  timestamp: '2026-10-10 09:05:00'
};
