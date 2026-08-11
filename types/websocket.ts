export interface MachineStatus {
  [key: string]: unknown;
}

export interface ProcessData {
  [key: string]: unknown;
}

export interface TechnicalData {
  [key: string]: unknown;
}

export interface Alarm {
  [key: string]: unknown;
}

export interface WebSocketResponse {
  machineStatus: MachineStatus;
  processData: ProcessData;
  technicalData: TechnicalData;
  alarms: Alarm[];
  extraData: unknown[];
}
