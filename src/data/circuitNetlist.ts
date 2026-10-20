/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ishmin Motors EV Cockpit - Full 3-in-1 Automotive Circuit Layout & Netlist
 * Subsystems:
 *  1. Item A: Unisoc UIS7862S Primary IVI Processor, PMIC, Wi-Fi/BT & Audio Subsystem
 *  2. Item B: Dedicated Instrument Cluster Display Driver & Backlight Subsystem
 *  3. Item D/C: ESP32-S3 Micro-VCU, Isolated CAN 2.0B PHY & Decoupled Safety Buzzer
 *  4. Power Transient Suppression (ISO 7637-2 / Load Dump) & Automotive Connectors
 */

export interface CircuitComponent {
  ref: string;
  value: string;
  package: string;
  description: string;
  manufacturerPartNumber: string;
  subsystem: 'POWER' | 'MICRO_VCU' | 'IVI_SOC' | 'CLUSTER_DISPLAY' | 'AHD_CAMERA' | 'AUDIO_CONNECTORS';
  posX: number; // mm from PCB origin (180mm x 105mm standard 2-DIN)
  posY: number; // mm from PCB origin
  rotation: number; // degrees
  layer: 'TOP' | 'BOTTOM';
  pins: { pinNumber: string; pinName: string; net: string }[];
}

export interface CircuitNet {
  netName: string;
  netType: 'POWER' | 'GROUND' | 'DIFFERENTIAL' | 'ANALOG' | 'DIGITAL_COMM' | 'GPIO';
  voltageLevel?: string;
  description: string;
  connections: string[]; // e.g. ["U1.5", "R3.1", "C12.2"]
}

export interface PcbLayerSpec {
  layerNumber: number;
  name: string;
  type: 'COPPER' | 'DIELECTRIC' | 'CORE';
  thicknessMm: number;
  copperWeightOz?: number;
  material: string;
  description: string;
}

export const PCB_6LAYER_STACKUP: PcbLayerSpec[] = [
  { layerNumber: 1, name: 'L1_Top_Signal_RF', type: 'COPPER', thicknessMm: 0.035, copperWeightOz: 1.0, material: 'Electro-deposited Copper', description: 'High-speed differential pairs (LVDS, HDMI, USB), RF 50Ω microstrip, SMT component pads' },
  { layerNumber: 2, name: 'Dielectric_Prepreg_1', type: 'DIELECTRIC', thicknessMm: 0.100, material: 'FR-4 High-Tg (Tg ≥ 170°C, Dk=4.2)', description: 'Prepreg 2116 for controlled impedance coupling to L2 GND plane' },
  { layerNumber: 3, name: 'L2_GND_Plane', type: 'COPPER', thicknessMm: 0.018, copperWeightOz: 0.5, material: 'Solid Copper Plane', description: 'Continuous uninterrupted zero-reference ground plane for high-speed EMI shielding' },
  { layerNumber: 4, name: 'Dielectric_Core_1', type: 'CORE', thicknessMm: 0.200, material: 'FR-4 High-Tg Core (Dk=4.4)', description: 'Rigid core isolating ground plane from internal signal routing' },
  { layerNumber: 5, name: 'L3_Inner_Signal_1', type: 'COPPER', thicknessMm: 0.018, copperWeightOz: 0.5, material: 'Copper Routing', description: 'Internal CAN bus lines, UART/SPI control lines, I2C touch & sensor routing' },
  { layerNumber: 6, name: 'Dielectric_Prepreg_2', type: 'DIELECTRIC', thicknessMm: 0.150, material: 'FR-4 High-Tg Prepreg', description: 'Dielectric spacing between internal signals and internal power planes' },
  { layerNumber: 7, name: 'L4_Power_Plane', type: 'COPPER', thicknessMm: 0.035, copperWeightOz: 1.0, material: 'Split Copper Plane', description: 'Split power islands (+12V Filtered, +5V Micro-VCU, +3.8V SoC VBAT, +3.3V Logic)' },
  { layerNumber: 8, name: 'Dielectric_Core_2', type: 'CORE', thicknessMm: 0.200, material: 'FR-4 High-Tg Core', description: 'Rigid core isolating power plane from lower ground plane' },
  { layerNumber: 9, name: 'L5_GND_Shield', type: 'COPPER', thicknessMm: 0.018, copperWeightOz: 0.5, material: 'Solid Copper Plane', description: 'Secondary ground reference plane providing stripline shielding for internal signals' },
  { layerNumber: 10, name: 'Dielectric_Prepreg_3', type: 'DIELECTRIC', thicknessMm: 0.100, material: 'FR-4 High-Tg Prepreg', description: 'Prepreg isolating bottom layer from ground plane' },
  { layerNumber: 11, name: 'L6_Bottom_Power_Thermal', type: 'COPPER', thicknessMm: 0.035, copperWeightOz: 1.0, material: 'Electro-deposited Copper', description: 'Thermal relief pads for DC-DC buck ICs, audio power amp heat dissipation & decoupling capacitors' },
];

export const CIRCUIT_COMPONENTS: CircuitComponent[] = [
  // ================= 1. POWER & TRANSIENT SUPPRESSION =================
  {
    ref: 'D1',
    value: 'SMCJ28A',
    package: 'DO-214AB (SMC)',
    description: 'Unidirectional Automotive TVS Diode, 1500W Clamping, ISO 7637-2 Pulse 5a/5b Load Dump Protection',
    manufacturerPartNumber: 'SMCJ28A-Q (Littelfuse Automotive)',
    subsystem: 'POWER',
    posX: 15.0,
    posY: 20.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'CATHODE', net: 'V_RAW_12V' },
      { pinNumber: '2', pinName: 'ANODE', net: 'GND_CHASSIS' },
    ],
  },
  {
    ref: 'Q1',
    value: 'SQM40041EL',
    package: 'D2PAK (TO-263)',
    description: 'P-Channel Power MOSFET -40V -120A, Ultra-Low Rds(on) 4mΩ, Reverse-Battery Polarity Protection',
    manufacturerPartNumber: 'SQM40041EL-GE3 (Vishay Automotive)',
    subsystem: 'POWER',
    posX: 28.0,
    posY: 22.0,
    rotation: 90,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'GATE', net: 'GND_CHASSIS' },
      { pinNumber: '2', pinName: 'DRAIN', net: 'V_RAW_12V' },
      { pinNumber: '3', pinName: 'SOURCE', net: 'V_PROT_12V' },
    ],
  },
  {
    ref: 'L1',
    value: '100uH / 5A',
    package: 'SMD Inductor 12x12mm',
    description: 'Common Mode & Pi-Filter Automotive Power Choke, Ferrite Core Shielded',
    manufacturerPartNumber: 'MSS1210-104MED (Coilcraft Automotive)',
    subsystem: 'POWER',
    posX: 42.0,
    posY: 22.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'IN', net: 'V_PROT_12V' },
      { pinNumber: '2', pinName: 'OUT', net: 'V_FILTERED_12V' },
    ],
  },
  {
    ref: 'C_BULK1',
    value: '470uF / 35V',
    package: 'SMD Aluminum Cap 10x10mm',
    description: 'Low-ESR Automotive Electrolytic Smoothing Capacitor (AEC-Q200, 105°C 5000h)',
    manufacturerPartNumber: 'EEE-FK1V471P (Panasonic Automotive)',
    subsystem: 'POWER',
    posX: 55.0,
    posY: 22.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: '+', net: 'V_FILTERED_12V' },
      { pinNumber: '2', pinName: '-', net: 'GND_POWER' },
    ],
  },
  {
    ref: 'U1',
    value: 'TPS54340B-Q1',
    package: 'SOIC-8-EP',
    description: 'Automotive Step-Down DC-DC Buck Converter 4.5V-42V to 5.0V @ 3.5A, Eco-mode 100kHz-2.5MHz',
    manufacturerPartNumber: 'TPS54340BQDDARQ1 (Texas Instruments)',
    subsystem: 'POWER',
    posX: 30.0,
    posY: 45.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'BOOT', net: 'NET_BOOT_5V' },
      { pinNumber: '2', pinName: 'VIN', net: 'V_FILTERED_12V' },
      { pinNumber: '3', pinName: 'EN', net: 'V_FILTERED_12V' },
      { pinNumber: '4', pinName: 'RT/CLK', net: 'NET_RT_U1' },
      { pinNumber: '5', pinName: 'FB', net: 'NET_FB_5V' },
      { pinNumber: '6', pinName: 'COMP', net: 'NET_COMP_U1' },
      { pinNumber: '7', pinName: 'GND', net: 'GND_POWER' },
      { pinNumber: '8', pinName: 'SW', net: 'NET_SW_5V' },
      { pinNumber: '9', pinName: 'THERMAL_PAD', net: 'GND_POWER' },
    ],
  },
  {
    ref: 'U2',
    value: 'TPS54540-Q1',
    package: 'SOIC-8-EP',
    description: 'Automotive Buck Converter 12V to 3.8V @ 4.0A for Unisoc VDD_BAT Core Power Rail',
    manufacturerPartNumber: 'TPS54540QDDARQ1 (Texas Instruments)',
    subsystem: 'POWER',
    posX: 50.0,
    posY: 45.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'BOOT', net: 'NET_BOOT_3V8' },
      { pinNumber: '2', pinName: 'VIN', net: 'V_FILTERED_12V' },
      { pinNumber: '3', pinName: 'EN', net: 'IGN_ACC_12V' },
      { pinNumber: '4', pinName: 'RT/CLK', net: 'NET_RT_U2' },
      { pinNumber: '5', pinName: 'FB', net: 'NET_FB_3V8' },
      { pinNumber: '6', pinName: 'COMP', net: 'NET_COMP_U2' },
      { pinNumber: '7', pinName: 'GND', net: 'GND_POWER' },
      { pinNumber: '8', pinName: 'SW', net: 'NET_SW_3V8' },
      { pinNumber: '9', pinName: 'THERMAL_PAD', net: 'GND_POWER' },
    ],
  },
  {
    ref: 'U3',
    value: 'TLV75733PDBVR',
    package: 'SOT-23-5',
    description: 'Low-Dropout Linear Regulator 5.0V to 3.3V @ 1A Low-Noise Clean Logic Rail',
    manufacturerPartNumber: 'TLV75733PDBVR (Texas Instruments)',
    subsystem: 'POWER',
    posX: 70.0,
    posY: 45.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'IN', net: 'VCC_5V0' },
      { pinNumber: '2', pinName: 'GND', net: 'GND_LOGIC' },
      { pinNumber: '3', pinName: 'EN', net: 'VCC_5V0' },
      { pinNumber: '4', pinName: 'NC', net: 'NC' },
      { pinNumber: '5', pinName: 'OUT', net: 'VCC_3V3' },
    ],
  },

  // ================= 2. ITEM D: MICRO-VCU & CAN 2.0B SUBSYSTEM =================
  {
    ref: 'U4',
    value: 'ESP32-S3-WROOM-1',
    package: 'Module-41 (18x25mm)',
    description: 'Automotive VCU Host Controller (Dual Xtensa LX7 240MHz, 16MB Flash, 8MB PSRAM, Hardware Crypto)',
    manufacturerPartNumber: 'ESP32-S3-WROOM-1-N16R8 (Espressif)',
    subsystem: 'MICRO_VCU',
    posX: 35.0,
    posY: 75.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'GND', net: 'GND_LOGIC' },
      { pinNumber: '2', pinName: '3V3', net: 'VCC_3V3' },
      { pinNumber: '3', pinName: 'EN', net: 'NET_MCU_RESET_N' },
      { pinNumber: '13', pinName: 'GPIO4 (CAN_TX)', net: 'CAN_TX_ISO' },
      { pinNumber: '14', pinName: 'GPIO5 (CAN_RX)', net: 'CAN_RX_ISO' },
      { pinNumber: '19', pinName: 'GPIO19 (USB_D-)', net: 'USB_CDC_D_MINUS' },
      { pinNumber: '20', pinName: 'GPIO20 (USB_D+)', net: 'USB_CDC_D_PLUS' },
      { pinNumber: '25', pinName: 'GPIO14 (BUZZER_PWM)', net: 'BUZZER_PWM_GATE' },
      { pinNumber: '26', pinName: 'GPIO21 (REVERSE_CAN)', net: 'REVERSE_TRIG_ISO' },
      { pinNumber: '27', pinName: 'GPIO47 (SWC_ADC1)', net: 'SWC_KEY_1' },
      { pinNumber: '28', pinName: 'GPIO48 (SWC_ADC2)', net: 'SWC_KEY_2' },
      { pinNumber: '38', pinName: 'GPIO1 (SPI_CS)', net: 'MCU_SPI_CS' },
    ],
  },
  {
    ref: 'U5',
    value: 'TJA1051T/3',
    package: 'SOIC-8',
    description: 'Galvanically Isolated High-Speed CAN 2.0B / CAN-FD Transceiver with 3.3V Logic Level Interface',
    manufacturerPartNumber: 'TJA1051T/3/1J (NXP Automotive)',
    subsystem: 'MICRO_VCU',
    posX: 18.0,
    posY: 75.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'TXD', net: 'CAN_TX_ISO' },
      { pinNumber: '2', pinName: 'GND', net: 'GND_CAN' },
      { pinNumber: '3', pinName: 'VCC', net: 'VCC_5V0' },
      { pinNumber: '4', pinName: 'RXD', net: 'CAN_RX_ISO' },
      { pinNumber: '5', pinName: 'VIO', net: 'VCC_3V3' },
      { pinNumber: '6', pinName: 'CANL', net: 'CAN_BUS_L' },
      { pinNumber: '7', pinName: 'CANH', net: 'CAN_BUS_H' },
      { pinNumber: '8', pinName: 'S (SILENT)', net: 'GND_CAN' },
    ],
  },
  {
    ref: 'R_TERM',
    value: '120 Ohm / 1%',
    package: '1206',
    description: 'CAN 2.0B Bus Split-Termination Resistor with Jumper Selector (ISO 11898-2)',
    manufacturerPartNumber: 'CRCW1206120RFKEA (Vishay)',
    subsystem: 'MICRO_VCU',
    posX: 12.0,
    posY: 85.0,
    rotation: 90,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'CANH', net: 'CAN_BUS_H' },
      { pinNumber: '2', pinName: 'CANL', net: 'CAN_BUS_L' },
    ],
  },
  {
    ref: 'D_CAN_TVS',
    value: 'PESD2CAN-QX',
    package: 'SOT-23',
    description: 'Automotive Dual Bidirectional ESD/Surge Protection Diode for CAN Bus lines (±30kV HBM)',
    manufacturerPartNumber: 'PESD2CAN-QX (Nexperia Automotive)',
    subsystem: 'MICRO_VCU',
    posX: 12.0,
    posY: 70.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'CANH', net: 'CAN_BUS_H' },
      { pinNumber: '2', pinName: 'CANL', net: 'CAN_BUS_L' },
      { pinNumber: '3', pinName: 'GND', net: 'GND_CHASSIS' },
    ],
  },

  // ================= 3. ITEM C: FAIL-SAFE AUDIO BUZZER =================
  {
    ref: 'BZ1',
    value: 'KPI-G2210',
    package: 'Piezo 22mm Through-Hole',
    description: 'Decoupled Automotive Safety Chime Buzzer, 85dB SPL @ 10cm, 2.4kHz, Works during Android OS Crash',
    manufacturerPartNumber: 'KPI-G2210 (Kingstate Automotive)',
    subsystem: 'MICRO_VCU',
    posX: 55.0,
    posY: 80.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'POS', net: 'VCC_5V0' },
      { pinNumber: '2', pinName: 'NEG', net: 'NET_BUZZER_DRAIN' },
    ],
  },
  {
    ref: 'Q2',
    value: 'BSS138-Q1',
    package: 'SOT-23',
    description: 'N-Channel MOSFET 50V 200mA PWM Driver for Secondary Safety Chime with Flyback Clamp',
    manufacturerPartNumber: 'BSS138-Q1 (Diodes Inc)',
    subsystem: 'MICRO_VCU',
    posX: 55.0,
    posY: 92.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'GATE', net: 'BUZZER_PWM_GATE' },
      { pinNumber: '2', pinName: 'SOURCE', net: 'GND_LOGIC' },
      { pinNumber: '3', pinName: 'DRAIN', net: 'NET_BUZZER_DRAIN' },
    ],
  },

  // ================= 4. ITEM A: PRIMARY IVI PROCESSING UNIT =================
  {
    ref: 'U6',
    value: 'Unisoc UIS7862S',
    package: 'BGA-648 (17x17mm, 0.65mm pitch)',
    description: 'Primary IVI Application Processor (2x Cortex-A75 @ 2.0GHz + 6x Cortex-A55 @ 1.8GHz, Mali-G52 GPU)',
    manufacturerPartNumber: 'UIS7862S-BA (Unisoc Automotive)',
    subsystem: 'IVI_SOC',
    posX: 110.0,
    posY: 55.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: 'VDD1', pinName: 'VDD_BAT', net: 'VCC_3V8' },
      { pinNumber: 'VDD2', pinName: 'VDD_CORE_1V1', net: 'VCC_1V1_CORE' },
      { pinNumber: 'VDD3', pinName: 'VDD_LPDDR4_1V8', net: 'VCC_1V8_DDR' },
      { pinNumber: 'USB1', pinName: 'USB0_DP (from Micro-VCU)', net: 'USB_CDC_D_PLUS' },
      { pinNumber: 'USB2', pinName: 'USB0_DM', net: 'USB_CDC_D_MINUS' },
      { pinNumber: 'USB3', pinName: 'USB1_DP (External Hub)', net: 'USB_HUB_D_PLUS' },
      { pinNumber: 'USB4', pinName: 'USB1_DM', net: 'USB_HUB_D_MINUS' },
      { pinNumber: 'DISP1', pinName: 'MIPI_DSI_D0_P', net: 'MIPI_IVI_D0_P' },
      { pinNumber: 'DISP2', pinName: 'MIPI_DSI_D0_N', net: 'MIPI_IVI_D0_N' },
      { pinNumber: 'DISP3', pinName: 'MIPI_DSI_CLK_P', net: 'MIPI_IVI_CLK_P' },
      { pinNumber: 'DISP4', pinName: 'MIPI_DSI_CLK_N', net: 'MIPI_IVI_CLK_N' },
      { pinNumber: 'HDMI1', pinName: 'HDMI_TX_CLK_P', net: 'HDMI_CLUSTER_CLK_P' },
      { pinNumber: 'HDMI2', pinName: 'HDMI_TX_CLK_N', net: 'HDMI_CLUSTER_CLK_N' },
      { pinNumber: 'HDMI3', pinName: 'HDMI_TX_D0_P', net: 'HDMI_CLUSTER_D0_P' },
      { pinNumber: 'HDMI4', pinName: 'HDMI_TX_D0_N', net: 'HDMI_CLUSTER_D0_N' },
      { pinNumber: 'HDMI5', pinName: 'HDMI_TX_D1_P', net: 'HDMI_CLUSTER_D1_P' },
      { pinNumber: 'HDMI6', pinName: 'HDMI_TX_D1_N', net: 'HDMI_CLUSTER_D1_N' },
      { pinNumber: 'HDMI7', pinName: 'HDMI_TX_D2_P', net: 'HDMI_CLUSTER_D2_P' },
      { pinNumber: 'HDMI8', pinName: 'HDMI_TX_D2_N', net: 'HDMI_CLUSTER_D2_N' },
      { pinNumber: 'CAM1', pinName: 'AHD_VIN_P', net: 'AHD_VIDEO_DIFF_P' },
      { pinNumber: 'CAM2', pinName: 'AHD_VIN_N', net: 'AHD_VIDEO_DIFF_N' },
      { pinNumber: 'REV_IN', pinName: 'GPIO_REV_TRIGGER', net: 'REVERSE_TRIG_ISO' },
    ],
  },
  {
    ref: 'U7',
    value: 'LPDDR4X 4GB',
    package: 'FBGA-200 (10x14.5mm)',
    description: 'High-Speed Automotive LPDDR4X SDRAM 3733 MT/s, 32-bit Dual Channel, Point-to-Point routing',
    manufacturerPartNumber: 'MT53E1G32D4DE-046 AIT:B (Micron Automotive)',
    subsystem: 'IVI_SOC',
    posX: 110.0,
    posY: 25.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: 'A1', pinName: 'VDD1', net: 'VCC_1V8_DDR' },
      { pinNumber: 'A2', pinName: 'VDD2', net: 'VCC_1V1_CORE' },
      { pinNumber: 'A3', pinName: 'VSS', net: 'GND_LOGIC' },
    ],
  },
  {
    ref: 'U8',
    value: 'eMMC 5.1 64GB',
    package: 'BGA-153 (11.5x13mm)',
    description: 'Industrial Automotive eMMC Flash Memory -40C to +85C, Hardware AES-256 Circular Logging Partition',
    manufacturerPartNumber: 'THGBMHG9C4LBAIR (Kioxia Automotive)',
    subsystem: 'IVI_SOC',
    posX: 110.0,
    posY: 85.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: 'C6', pinName: 'VCC', net: 'VCC_3V3' },
      { pinNumber: 'M6', pinName: 'VCCQ', net: 'VCC_1V8_DDR' },
      { pinNumber: 'N5', pinName: 'VSS', net: 'GND_LOGIC' },
    ],
  },
  {
    ref: 'U9',
    value: 'RTL8821CS-CG',
    package: 'LGA-44 (12x12mm)',
    description: 'Dual-Band Wi-Fi 802.11ac 1x1 + Bluetooth 5.0 Module with Dual FAKRA RF outputs for CarPlay/AA',
    manufacturerPartNumber: 'RTL8821CS-CG (Realtek Automotive)',
    subsystem: 'IVI_SOC',
    posX: 85.0,
    posY: 25.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'VBAT', net: 'VCC_3V8' },
      { pinNumber: '2', pinName: 'VDDIO', net: 'VCC_1V8_DDR' },
      { pinNumber: '12', pinName: 'SDIO_DATA', net: 'WIFI_SDIO_BUS' },
      { pinNumber: '24', pinName: 'UART_BT', net: 'BT_HFP_UART' },
      { pinNumber: '35', pinName: 'RF_WIFI_5G', net: 'RF_SMA_WIFI_5GHZ' },
      { pinNumber: '39', pinName: 'RF_BT_2G4', net: 'RF_SMA_BT_2GHZ' },
    ],
  },

  // ================= 5. ITEM B: DEDICATED DIGITAL CLUSTER DISPLAY =================
  {
    ref: 'U10_BRG',
    value: 'RTD2660H',
    package: 'QFP-128',
    description: 'Automotive LCD Display Controller & HDMI-to-Dual-LVDS Bridge for Instrument Cluster Display',
    manufacturerPartNumber: 'RTD2660H-CG (Realtek Display)',
    subsystem: 'CLUSTER_DISPLAY',
    posX: 150.0,
    posY: 55.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'VCC_3V3', net: 'VCC_3V3' },
      { pinNumber: '10', pinName: 'HDMI_RX_CLK_P', net: 'HDMI_CLUSTER_CLK_P' },
      { pinNumber: '11', pinName: 'HDMI_RX_CLK_N', net: 'HDMI_CLUSTER_CLK_N' },
      { pinNumber: '14', pinName: 'HDMI_RX_D0_P', net: 'HDMI_CLUSTER_D0_P' },
      { pinNumber: '15', pinName: 'HDMI_RX_D0_N', net: 'HDMI_CLUSTER_D0_N' },
      { pinNumber: '32', pinName: 'LVDS_TX_CLK_P', net: 'LVDS_CLUSTER_CLK_P' },
      { pinNumber: '33', pinName: 'LVDS_TX_CLK_N', net: 'LVDS_CLUSTER_CLK_N' },
      { pinNumber: '34', pinName: 'LVDS_TX_D0_P', net: 'LVDS_CLUSTER_D0_P' },
      { pinNumber: '35', pinName: 'LVDS_TX_D0_N', net: 'LVDS_CLUSTER_D0_N' },
      { pinNumber: '50', pinName: 'PWM_OUT', net: 'CLUSTER_PWM_DIM' },
    ],
  },
  {
    ref: 'J_CLUSTER_HDMI',
    value: 'HDMI Type-A SMD',
    package: 'HDMI-19P-SMD',
    description: 'Secondary Display HDMI 1.4b High-Speed Differential TMDS Port to Cluster LCD or Virtual Bridge',
    manufacturerPartNumber: '2007435-1 (TE Connectivity)',
    subsystem: 'CLUSTER_DISPLAY',
    posX: 170.0,
    posY: 25.0,
    rotation: 90,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'TMDS_D2+', net: 'HDMI_CLUSTER_D2_P' },
      { pinNumber: '2', pinName: 'TMDS_D2_SHIELD', net: 'GND_SHIELD' },
      { pinNumber: '3', pinName: 'TMDS_D2-', net: 'HDMI_CLUSTER_D2_N' },
      { pinNumber: '4', pinName: 'TMDS_D1+', net: 'HDMI_CLUSTER_D1_P' },
      { pinNumber: '6', pinName: 'TMDS_D1-', net: 'HDMI_CLUSTER_D1_N' },
      { pinNumber: '7', pinName: 'TMDS_D0+', net: 'HDMI_CLUSTER_D0_P' },
      { pinNumber: '9', pinName: 'TMDS_D0-', net: 'HDMI_CLUSTER_D0_N' },
      { pinNumber: '10', pinName: 'TMDS_CLK+', net: 'HDMI_CLUSTER_CLK_P' },
      { pinNumber: '12', pinName: 'TMDS_CLK-', net: 'HDMI_CLUSTER_CLK_N' },
      { pinNumber: '15', pinName: 'SCL_EDID', net: 'HDMI_I2C_SCL' },
      { pinNumber: '16', pinName: 'SDA_EDID', net: 'HDMI_I2C_SDA' },
      { pinNumber: '18', pinName: '+5V_POWER', net: 'VCC_5V0' },
      { pinNumber: '19', pinName: 'HPD', net: 'HDMI_HOTPLUG_DETECT' },
    ],
  },
  {
    ref: 'U10_BKL',
    value: 'TPS61196-Q1',
    package: 'HTSSOP-28',
    description: 'Automotive 6-Channel White-LED Backlight Driver for >600nits Bar-Type Cluster LCD',
    manufacturerPartNumber: 'TPS61196QPWPRQ1 (Texas Instruments)',
    subsystem: 'CLUSTER_DISPLAY',
    posX: 155.0,
    posY: 80.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'VIN', net: 'V_FILTERED_12V' },
      { pinNumber: '8', pinName: 'PWM_DIM', net: 'CLUSTER_PWM_DIM' },
      { pinNumber: '12', pinName: 'VOUT_BOOST', net: 'V_BACKLIGHT_36V' },
      { pinNumber: '16', pinName: 'IFB1..6', net: 'LED_STRING_CATHODES' },
    ],
  },
  {
    ref: 'J_CLUSTER_LVDS',
    value: 'Hirose 40P FPC',
    package: 'FH34SRJ-40S-0.5SH',
    description: 'Direct 40-pin 0.5mm FPC Connector to Bar-Type Digital Instrument Cluster Panel',
    manufacturerPartNumber: 'FH34SRJ-40S-0.5SH(50) (Hirose)',
    subsystem: 'CLUSTER_DISPLAY',
    posX: 172.0,
    posY: 80.0,
    rotation: 90,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'VLED+', net: 'V_BACKLIGHT_36V' },
      { pinNumber: '10', pinName: 'LVDS_CLK+', net: 'LVDS_CLUSTER_CLK_P' },
      { pinNumber: '11', pinName: 'LVDS_CLK-', net: 'LVDS_CLUSTER_CLK_N' },
      { pinNumber: '12', pinName: 'LVDS_D0+', net: 'LVDS_CLUSTER_D0_P' },
      { pinNumber: '13', pinName: 'LVDS_D0-', net: 'LVDS_CLUSTER_D0_N' },
      { pinNumber: '30', pinName: 'VDD_PANEL_3V3', net: 'VCC_3V3' },
      { pinNumber: '40', pinName: 'GND', net: 'GND_LOGIC' },
    ],
  },

  // ================= 6. AHD REAR CAMERA FRONT-END =================
  {
    ref: 'U11',
    value: 'TP9950-Q1',
    package: 'QFN-32 (5x5mm)',
    description: 'Analog High-Definition (AHD 1080p/720p) Video Receiver ADC with Differential Input & MIPI-CSI Output',
    manufacturerPartNumber: 'TP9950-Q1 (Techpoint Automotive)',
    subsystem: 'AHD_CAMERA',
    posX: 75.0,
    posY: 75.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'VIN_DIFF_P', net: 'AHD_VIDEO_DIFF_P' },
      { pinNumber: '2', pinName: 'VIN_DIFF_N', net: 'AHD_VIDEO_DIFF_N' },
      { pinNumber: '8', pinName: 'MIPI_OUT_P', net: 'AHD_MIPI_CSI_P' },
      { pinNumber: '9', pinName: 'MIPI_OUT_N', net: 'AHD_MIPI_CSI_N' },
      { pinNumber: '18', pinName: 'VCC_3V3', net: 'VCC_3V3' },
      { pinNumber: '24', pinName: 'VCC_1V8', net: 'VCC_1V8_DDR' },
    ],
  },

  // ================= 7. AUDIO AMPLIFIER & VEHICLE CONNECTORS =================
  {
    ref: 'U12_AMP',
    value: 'TDA7851L',
    package: 'FLEXIWATT-25 (Vertical)',
    description: 'Automotive 4x45W Quad Bridge Audio Power Amplifier with Diagnostics and Clip Detector',
    manufacturerPartNumber: 'TDA7851L (STMicroelectronics Automotive)',
    subsystem: 'AUDIO_CONNECTORS',
    posX: 140.0,
    posY: 95.0,
    rotation: 0,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'TAB_GND', net: 'GND_POWER' },
      { pinNumber: '3', pinName: 'VCC_AMP', net: 'V_FILTERED_12V' },
      { pinNumber: '4', pinName: 'STBY', net: 'VCC_3V3' },
      { pinNumber: '11', pinName: 'OUT1+', net: 'AUDIO_SPK_FL_PLUS' },
      { pinNumber: '12', pinName: 'OUT1-', net: 'AUDIO_SPK_FL_MINUS' },
      { pinNumber: '15', pinName: 'OUT2+', net: 'AUDIO_SPK_FR_PLUS' },
      { pinNumber: '16', pinName: 'OUT2-', net: 'AUDIO_SPK_FR_MINUS' },
    ],
  },
  {
    ref: 'J1_VEHICLE',
    value: 'Molex Micro-Fit 16P',
    package: 'Connector 16-Pin Right-Angle',
    description: 'Vehicle Main Power, Ignition, CAN Bus & Steering Wheel Control Harness Connector',
    manufacturerPartNumber: '43045-1612 (Molex)',
    subsystem: 'AUDIO_CONNECTORS',
    posX: 8.0,
    posY: 45.0,
    rotation: 270,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'BATT_+12V', net: 'V_RAW_12V' },
      { pinNumber: '2', pinName: 'IGN_ACC', net: 'IGN_ACC_12V' },
      { pinNumber: '3', pinName: 'GND_CHASSIS', net: 'GND_CHASSIS' },
      { pinNumber: '4', pinName: 'ILLUMINATION', net: 'ILLUMINATION_12V' },
      { pinNumber: '5', pinName: 'REVERSE_GEAR', net: 'REVERSE_TRIG_ISO' },
      { pinNumber: '6', pinName: 'CAN_H', net: 'CAN_BUS_H' },
      { pinNumber: '7', pinName: 'CAN_L', net: 'CAN_BUS_L' },
      { pinNumber: '8', pinName: 'SPEED_PULSE', net: 'SPEED_PULSE_IN' },
      { pinNumber: '9', pinName: 'SWC_KEY1', net: 'SWC_KEY_1' },
      { pinNumber: '10', pinName: 'SWC_KEY2', net: 'SWC_KEY_2' },
      { pinNumber: '11', pinName: 'SPK_FL+', net: 'AUDIO_SPK_FL_PLUS' },
      { pinNumber: '12', pinName: 'SPK_FL-', net: 'AUDIO_SPK_FL_MINUS' },
      { pinNumber: '13', pinName: 'SPK_FR+', net: 'AUDIO_SPK_FR_PLUS' },
      { pinNumber: '14', pinName: 'SPK_FR-', net: 'AUDIO_SPK_FR_MINUS' },
      { pinNumber: '15', pinName: 'MUTE', net: 'AUDIO_MUTE_N' },
      { pinNumber: '16', pinName: 'GND_AUDIO', net: 'GND_POWER' },
    ],
  },
  {
    ref: 'J3_CAMERA',
    value: 'FAKRA Code-Z 4-Pin',
    package: 'FAKRA Coaxial SMD',
    description: 'Automotive Shielded Differential AHD Rear Camera Input Connector with 12V Power-Over-Coax',
    manufacturerPartNumber: '59S20X-40MT5-Z (Rosenberger Automotive)',
    subsystem: 'AHD_CAMERA',
    posX: 8.0,
    posY: 90.0,
    rotation: 270,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'CAM_12V_OUT', net: 'V_FILTERED_12V' },
      { pinNumber: '2', pinName: 'CAM_GND', net: 'GND_CHASSIS' },
      { pinNumber: '3', pinName: 'AHD_P', net: 'AHD_VIDEO_DIFF_P' },
      { pinNumber: '4', pinName: 'AHD_N', net: 'AHD_VIDEO_DIFF_N' },
    ],
  },
  {
    ref: 'J4_USB_DUAL',
    value: 'Dual USB-A Type-C',
    package: 'Amphenol Dual USB R/A',
    description: 'Automotive Dual Port: Port 1 for CarPlay/Android Auto (OTG), Port 2 for Flash Drive Media',
    manufacturerPartNumber: 'UE27AC54100 (Amphenol ICC)',
    subsystem: 'AUDIO_CONNECTORS',
    posX: 172.0,
    posY: 55.0,
    rotation: 90,
    layer: 'TOP',
    pins: [
      { pinNumber: '1', pinName: 'VBUS_5V', net: 'VCC_5V0' },
      { pinNumber: '2', pinName: 'USB_D-', net: 'USB_HUB_D_MINUS' },
      { pinNumber: '3', pinName: 'USB_D+', net: 'USB_HUB_D_PLUS' },
      { pinNumber: '4', pinName: 'GND', net: 'GND_POWER' },
    ],
  },
];

export const CIRCUIT_NETS: CircuitNet[] = [
  {
    netName: 'V_RAW_12V',
    netType: 'POWER',
    voltageLevel: '+12.0V to +14.4V DC',
    description: 'Unconditioned raw auxiliary battery input from Vehicle Harness Pin J1.1',
    connections: ['J1_VEHICLE.1', 'D1.1', 'Q1.2'],
  },
  {
    netName: 'V_PROT_12V',
    netType: 'POWER',
    voltageLevel: '+12.0V DC (Reverse Protected)',
    description: 'Protected 12V output behind P-MOSFET reverse-polarity switch',
    connections: ['Q1.3', 'L1.1'],
  },
  {
    netName: 'V_FILTERED_12V',
    netType: 'POWER',
    voltageLevel: '+12.0V DC (EMI Filtered)',
    description: 'Low-noise supply rail to Buck Regulators U1, U2, Camera Driver, Backlight, and Audio Amp',
    connections: ['L1.2', 'C_BULK1.1', 'U1.2', 'U2.2', 'U10_BKL.1', 'U12_AMP.3', 'J3_CAMERA.1'],
  },
  {
    netName: 'VCC_5V0',
    netType: 'POWER',
    voltageLevel: '+5.0V DC @ 3.5A',
    description: 'Regulated 5V rail for Micro-VCU, Isolated CAN PHY, USB-CDC, Secondary Chime, and HDMI +5V',
    connections: ['U1.8', 'U3.1', 'U5.3', 'BZ1.1', 'J_CLUSTER_HDMI.18', 'J4_USB_DUAL.1'],
  },
  {
    netName: 'VCC_3V8',
    netType: 'POWER',
    voltageLevel: '+3.8V DC @ 4.0A',
    description: 'Core application processor main battery rail (Unisoc VDD_BAT) and Wi-Fi VBAT',
    connections: ['U2.8', 'U6.VDD1', 'U9.1'],
  },
  {
    netName: 'VCC_3V3',
    netType: 'POWER',
    voltageLevel: '+3.3V DC @ 1.0A',
    description: 'Low-noise logic supply for ESP32-S3, TJA1051 VIO, eMMC VCC, RTD2660, and TP9950',
    connections: ['U3.5', 'U4.2', 'U5.5', 'U8.C6', 'U10_BRG.1', 'U11.18', 'J_CLUSTER_LVDS.30'],
  },
  {
    netName: 'VCC_1V8_DDR',
    netType: 'POWER',
    voltageLevel: '+1.8V DC @ 2.0A',
    description: 'LPDDR4X I/O, eMMC VCCQ, and Wi-Fi VDDIO rail from PMIC',
    connections: ['U6.VDD3', 'U7.A1', 'U8.M6', 'U9.2', 'U11.24'],
  },
  {
    netName: 'VCC_1V1_CORE',
    netType: 'POWER',
    voltageLevel: '+1.1V DC @ 5.0A',
    description: 'SoC Cortex-A75 / Cortex-A55 and GPU core voltage rail',
    connections: ['U6.VDD2', 'U7.A2'],
  },
  {
    netName: 'CAN_BUS_H',
    netType: 'DIFFERENTIAL',
    voltageLevel: '+2.5V to +3.5V Differential',
    description: 'Vehicle High-Speed CAN 2.0B Bus Line High (500 kbps)',
    connections: ['J1_VEHICLE.6', 'U5.7', 'R_TERM.1', 'D_CAN_TVS.1'],
  },
  {
    netName: 'CAN_BUS_L',
    netType: 'DIFFERENTIAL',
    voltageLevel: '+1.5V to +2.5V Differential',
    description: 'Vehicle High-Speed CAN 2.0B Bus Line Low (500 kbps)',
    connections: ['J1_VEHICLE.7', 'U5.6', 'R_TERM.2', 'D_CAN_TVS.2'],
  },
  {
    netName: 'CAN_TX_ISO',
    netType: 'DIGITAL_COMM',
    voltageLevel: '3.3V CMOS',
    description: 'UART/CAN transmit line from ESP32-S3 to TJA1051 PHY',
    connections: ['U4.13', 'U5.1'],
  },
  {
    netName: 'CAN_RX_ISO',
    netType: 'DIGITAL_COMM',
    voltageLevel: '3.3V CMOS',
    description: 'UART/CAN receive line from TJA1051 PHY to ESP32-S3',
    connections: ['U4.14', 'U5.4'],
  },
  {
    netName: 'USB_CDC_D_PLUS',
    netType: 'DIFFERENTIAL',
    voltageLevel: '3.3V USB Full-Speed/High-Speed (90Ω Differential)',
    description: 'Deterministic USB-CDC Serial Stream Data Plus (<5ms latency from Micro-VCU to IVI)',
    connections: ['U4.20', 'U6.USB1'],
  },
  {
    netName: 'USB_CDC_D_MINUS',
    netType: 'DIFFERENTIAL',
    voltageLevel: '3.3V USB Data Minus (90Ω Differential)',
    description: 'Deterministic USB-CDC Serial Stream Data Minus',
    connections: ['U4.19', 'U6.USB2'],
  },
  {
    netName: 'BUZZER_PWM_GATE',
    netType: 'GPIO',
    voltageLevel: '3.3V PWM (2.4 kHz)',
    description: 'Direct hardware chime driver signal from Micro-VCU GPIO to Q2 MOSFET (Independent of IVI OS)',
    connections: ['U4.25', 'Q2.1'],
  },
  {
    netName: 'REVERSE_TRIG_ISO',
    netType: 'GPIO',
    voltageLevel: '3.3V Active-High',
    description: 'Low-latency hardware interrupt reverse gear line (<300ms AHD camera trigger requirement)',
    connections: ['J1_VEHICLE.5', 'U6.REV_IN', 'U4.26'],
  },
  {
    netName: 'AHD_VIDEO_DIFF_P',
    netType: 'ANALOG',
    voltageLevel: '1.0Vp-p 75 Ohm Differential',
    description: 'Analog High-Definition Video Positive Input from M12 Rear Camera',
    connections: ['J3_CAMERA.3', 'U11.1', 'U6.CAM1'],
  },
  {
    netName: 'AHD_VIDEO_DIFF_N',
    netType: 'ANALOG',
    voltageLevel: '1.0Vp-p 75 Ohm Differential',
    description: 'Analog High-Definition Video Negative Input from M12 Rear Camera',
    connections: ['J3_CAMERA.4', 'U11.2', 'U6.CAM2'],
  },
  {
    netName: 'HDMI_CLUSTER_CLK_P',
    netType: 'DIFFERENTIAL',
    voltageLevel: '3.3V CML TMDS Clock (+) (100Ω Differential)',
    description: 'Secondary Display HDMI 1.4b Differential Clock Line to Cluster LCD / RTD2660 Bridge',
    connections: ['U6.HDMI1', 'J_CLUSTER_HDMI.10', 'U10_BRG.10'],
  },
  {
    netName: 'HDMI_CLUSTER_CLK_N',
    netType: 'DIFFERENTIAL',
    voltageLevel: '3.3V CML TMDS Clock (-) (100Ω Differential)',
    description: 'Secondary Display HDMI 1.4b Differential Clock Negative',
    connections: ['U6.HDMI2', 'J_CLUSTER_HDMI.12', 'U10_BRG.11'],
  },
  {
    netName: 'HDMI_CLUSTER_D0_P',
    netType: 'DIFFERENTIAL',
    voltageLevel: '3.3V CML TMDS Data 0 (+) (100Ω Differential)',
    description: 'Secondary Display HDMI TMDS Channel 0 Positive',
    connections: ['U6.HDMI3', 'J_CLUSTER_HDMI.7', 'U10_BRG.14'],
  },
  {
    netName: 'HDMI_CLUSTER_D0_N',
    netType: 'DIFFERENTIAL',
    voltageLevel: '3.3V CML TMDS Data 0 (-) (100Ω Differential)',
    description: 'Secondary Display HDMI TMDS Channel 0 Negative',
    connections: ['U6.HDMI4', 'J_CLUSTER_HDMI.9', 'U10_BRG.15'],
  },
  {
    netName: 'LVDS_CLUSTER_CLK_P',
    netType: 'DIFFERENTIAL',
    voltageLevel: '1.2V LVDS Differential Clock (+)',
    description: 'Direct LVDS Clock Line to 40-pin Cluster LCD Panel',
    connections: ['U10_BRG.32', 'J_CLUSTER_LVDS.10'],
  },
  {
    netName: 'LVDS_CLUSTER_D0_P',
    netType: 'DIFFERENTIAL',
    voltageLevel: '1.2V LVDS Differential Data 0 (+)',
    description: 'Direct LVDS Data Channel 0 to Cluster Panel',
    connections: ['U10_BRG.34', 'J_CLUSTER_LVDS.12'],
  },
  {
    netName: 'V_BACKLIGHT_36V',
    netType: 'POWER',
    voltageLevel: '+36.0V DC Boosted',
    description: 'Boosted High-Voltage LED Backlight Anode Rail for >600nits Instrument Cluster LCD',
    connections: ['U10_BKL.12', 'J_CLUSTER_LVDS.1'],
  },
  {
    netName: 'GND_CHASSIS',
    netType: 'GROUND',
    voltageLevel: '0.0V Ground Reference',
    description: 'Vehicle Chassis Ground Return path via Metal Housing & Harness Pin J1.3',
    connections: ['J1_VEHICLE.3', 'D1.2', 'Q1.1', 'D_CAN_TVS.3', 'J3_CAMERA.2'],
  },
  {
    netName: 'GND_POWER',
    netType: 'GROUND',
    voltageLevel: '0.0V Ground Reference',
    description: 'High-Current Isolated Power Ground for Buck Regulators, Audio Amp, and Bulk Capacitors',
    connections: ['U1.7', 'U1.9', 'U2.7', 'U2.9', 'C_BULK1.2', 'U12_AMP.1', 'J4_USB_DUAL.4'],
  },
  {
    netName: 'GND_LOGIC',
    netType: 'GROUND',
    voltageLevel: '0.0V Clean Reference',
    description: 'Zero-Noise Logic & Digital Plane for Micro-VCU, SoC, eMMC, and LPDDR4X',
    connections: ['U3.2', 'U4.1', 'Q2.2', 'U7.A3', 'U8.N5', 'J_CLUSTER_LVDS.40'],
  },
];

/**
 * Generates an industry-standard KiCad v7/v8 Schematic Netlist (.net)
 */
export function generateKiCadNetlist(): string {
  const timestamp = new Date().toISOString();
  let output = `(export (version D)\n`;
  output += `  (design\n`;
  output += `    (source "Ishmin_EV_Cockpit_3in1_Mainboard.kicad_sch")\n`;
  output += `    (date "${timestamp}")\n`;
  output += `    (tool "Ishmin Automotive EDA Generator v2.5")\n`;
  output += `    (company "Ishmin Motors Pvt Ltd")\n`;
  output += `    (project "RFQ-IMPL-AUTO-2026-004-R2 Decoupled Cockpit")\n`;
  output += `  )\n`;

  // Components block
  output += `  (components\n`;
  CIRCUIT_COMPONENTS.forEach((cmp) => {
    output += `    (comp (ref "${cmp.ref}")\n`;
    output += `      (value "${cmp.value}")\n`;
    output += `      (footprint "${cmp.package}")\n`;
    output += `      (fields\n`;
    output += `        (field (name "MPN") "${cmp.manufacturerPartNumber}")\n`;
    output += `        (field (name "Subsystem") "${cmp.subsystem}")\n`;
    output += `        (field (name "Description") "${cmp.description}")\n`;
    output += `        (field (name "Position_X") "${cmp.posX}mm")\n`;
    output += `        (field (name "Position_Y") "${cmp.posY}mm")\n`;
    output += `      )\n`;
    output += `    )\n`;
  });
  output += `  )\n`;

  // Nets block
  output += `  (nets\n`;
  CIRCUIT_NETS.forEach((net, idx) => {
    output += `    (net (code ${idx + 1}) (name "${net.netName}")\n`;
    // Find all pins connected to this net
    CIRCUIT_COMPONENTS.forEach((cmp) => {
      cmp.pins.forEach((p) => {
        if (p.net === net.netName) {
          output += `      (node (ref "${cmp.ref}") (pin "${p.pinNumber}"))\n`;
        }
      });
    });
    output += `    )\n`;
  });
  output += `  )\n`;
  output += `)\n`;

  return output;
}

/**
 * Generates SPICE simulation subcircuit (.cir) for power tree and signal simulation
 */
export function generateSpiceNetlist(): string {
  let output = `* ISHMIN MOTORS EV COCKPIT 3-IN-1 SPICE SIMULATION NETLIST\n`;
  output += `* PROJECT: RFQ-IMPL-AUTO-2026-004-R2 (FAIL-SAFE DECOUPLED)\n`;
  output += `* POWER TREE, LOAD DUMP SUPPRESSION & MICRO-VCU CAN COUPLING\n`;
  output += `* DATE: ${new Date().toISOString()}\n\n`;

  output += `.SUBCKT ISHMIN_3IN1_COCKPIT V_RAW_12V GND_CHASSIS CAN_H CAN_L\n\n`;

  output += `* 1. REVERSE BATTERY & LOAD DUMP TRANSIENT PROTECTION\n`;
  output += `D_TVS V_RAW_12V GND_CHASSIS SMCJ28A_MODEL\n`;
  output += `M_REV V_PROT_12V GND_CHASSIS V_RAW_12V V_RAW_12V SQM40041EL_PMOS\n`;
  output += `L_PI V_PROT_12V V_FILTERED_12V 100uH Rser=0.04\n`;
  output += `C_BULK V_FILTERED_12V GND_POWER 470uF ESR=0.08\n\n`;

  output += `* 2. STEP-DOWN BUCK REGULATORS\n`;
  output += `X_U1 V_FILTERED_12V GND_POWER VCC_5V0 TPS54340B_MODEL\n`;
  output += `X_U2 V_FILTERED_12V GND_POWER VCC_3V8 TPS54540_MODEL\n`;
  output += `X_U3 VCC_5V0 GND_LOGIC VCC_3V3 TLV75733_MODEL\n\n`;

  output += `* 3. CAN BUS 2.0B TRANSMISSION LINE MODEL\n`;
  output += `R_TERM CAN_BUS_H CAN_BUS_L 120\n`;
  output += `D_TVS_CAN1 CAN_BUS_H GND_CHASSIS PESD2CAN_MODEL\n`;
  output += `D_TVS_CAN2 CAN_BUS_L GND_CHASSIS PESD2CAN_MODEL\n`;
  output += `X_CAN_PHY CAN_TX_ISO CAN_RX_ISO CAN_BUS_H CAN_BUS_L VCC_5V0 VCC_3V3 TJA1051_MODEL\n\n`;

  output += `* 4. FAIL-SAFE BUZZER PWM DRIVER\n`;
  output += `M_CHIME NET_BUZZER_DRAIN BUZZER_PWM_GATE GND_LOGIC GND_LOGIC BSS138_NMOS\n`;
  output += `R_BUZZER VCC_5V0 NET_BUZZER_DRAIN 45\n\n`;

  output += `.MODEL SMCJ28A_MODEL D (BV=28V IBV=1mA RS=0.02)\n`;
  output += `.MODEL PESD2CAN_MODEL D (BV=32V CJO=15pF)\n`;
  output += `.MODEL SQM40041EL_PMOS PMOS (VTO=-2.0 KP=40 RDS=0.004)\n`;
  output += `.MODEL BSS138_NMOS NMOS (VTO=1.5 KP=1.2 RDS=3.5)\n`;
  output += `.ENDS ISHMIN_3IN1_COCKPIT\n\n`;
  output += `.TRAN 10ns 50ms\n`;
  output += `.END\n`;

  return output;
}

/**
 * Generates SMT Pick-and-Place Centroid Coordinates (.pos / .csv)
 */
export function generatePickAndPlaceCsv(): string {
  const headers = ['Designator', 'Val', 'Package', 'Mid X (mm)', 'Mid Y (mm)', 'Rotation', 'Layer', 'Description'];
  const rows = CIRCUIT_COMPONENTS.map((c) => [
    c.ref,
    `"${c.value}"`,
    `"${c.package}"`,
    c.posX.toFixed(2),
    c.posY.toFixed(2),
    c.rotation.toString(),
    c.layer,
    `"${c.description}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Generates complete manufacturing Bill of Materials (BOM) in CSV format
 */
export function generateBomCsv(): string {
  const headers = ['Item', 'RefDes', 'Quantity', 'Component Value', 'Package / Footprint', 'MPN', 'Subsystem Domain', 'AEC-Q Grade', 'Description'];
  const rows = CIRCUIT_COMPONENTS.map((c, idx) => [
    (idx + 1).toString(),
    c.ref,
    '1',
    `"${c.value}"`,
    `"${c.package}"`,
    `"${c.manufacturerPartNumber}"`,
    c.subsystem,
    c.subsystem === 'POWER' || c.subsystem === 'MICRO_VCU' ? 'AEC-Q100 Grade 1 (-40°C to +125°C)' : 'AEC-Q100 Grade 2 (-40°C to +105°C)',
    `"${c.description}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Generates IPC-D-356 Electrical Test Netlist format
 */
export function generateIpcNetlist(): string {
  let output = `C  IPC-D-356 ELECTRICAL TEST DATA FOR ISHMIN 3-IN-1 AUTOMOTIVE COCKPIT\n`;
  output += `C  PROJECT: RFQ-IMPL-AUTO-2026-004-R2 (FAIL-SAFE DECOUPLED)\n`;
  output += `C  DATE: ${new Date().toISOString()}\n`;
  output += `P  JOB ISHMIN_3IN1_COCKPIT_REV2.5\n`;
  output += `P  UNITS CUST 0\n`;

  CIRCUIT_NETS.forEach((net) => {
    CIRCUIT_COMPONENTS.forEach((cmp) => {
      cmp.pins.forEach((p) => {
        if (p.net === net.netName) {
          const paddedNet = (net.netName + '               ').slice(0, 14);
          const paddedRef = (cmp.ref + '     ').slice(0, 6);
          const paddedPin = (p.pinNumber + '    ').slice(0, 4);
          const posXStr = ('00000' + Math.round(cmp.posX * 100)).slice(-5);
          const posYStr = ('00000' + Math.round(cmp.posY * 100)).slice(-5);
          output += `317 ${paddedNet} ${paddedRef} ${paddedPin} D   ${posXStr}X ${posYStr}Y 0000 0000 0\n`;
        }
      });
    });
  });

  output += `999\n`;
  return output;
}

/**
 * Generates Altium Designer Protel format netlist (.net)
 */
export function generateAltiumNetlist(): string {
  let output = `[ISHMIN_3IN1_AUTOMOTIVE_COCKPIT]\n`;
  output += `Designator\tValue\tFootprint\tDescription\n`;
  CIRCUIT_COMPONENTS.forEach((cmp) => {
    output += `${cmp.ref}\t${cmp.value}\t${cmp.package}\t${cmp.description}\n`;
  });
  output += `\n[NETS]\n`;
  CIRCUIT_NETS.forEach((net) => {
    const pinList: string[] = [];
    CIRCUIT_COMPONENTS.forEach((cmp) => {
      cmp.pins.forEach((p) => {
        if (p.net === net.netName) {
          pinList.push(`${cmp.ref}-${p.pinNumber}`);
        }
      });
    });
    output += `${net.netName}\t${pinList.join(' ')}\n`;
  });
  return output;
}
