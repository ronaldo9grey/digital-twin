// ==========================================
// 数字孪生系统 - 核心类型定义
// ==========================================

/** 设备类别 */
export const DeviceCategory = {
  PRODUCTION: 'production',
  SENSOR: 'sensor',
  ENERGY: 'energy',
} as const;
export type DeviceCategory = (typeof DeviceCategory)[keyof typeof DeviceCategory];

/** 设备状态 */
export const DeviceStatus = {
  RUNNING: 'running',
  STOPPED: 'stopped',
  WARNING: 'warning',
  ERROR: 'error',
  IDLE: 'idle',
} as const;
export type DeviceStatus = (typeof DeviceStatus)[keyof typeof DeviceStatus];

/** 数据模式 */
export const DataMode = {
  DEMO: 'demo',
  LIVE: 'live',
} as const;
export type DataMode = (typeof DataMode)[keyof typeof DataMode];

/** 3D位置 */
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

/** 3D旋转（欧拉角，度） */
export interface Rotation3D {
  x: number;
  y: number;
  z: number;
}

/** 数据指标定义 */
export interface DataMetric {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
  warnMin?: number;
  warnMax?: number;
  currentValue: number;
  icon?: string;
}

/** 数据接口配置 */
export interface DataApiConfig {
  enabled: boolean;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'WEBSOCKET';
  headers?: Record<string, string>;
  body?: string;
  pollingInterval: number;
  dataPath: string;
  mapping?: Record<string, string>;
}

/** 设备模板定义 */
export interface DeviceTemplate {
  id: string;
  name: string;
  category: DeviceCategory;
  description: string;
  icon: string;
  thumbnail?: string;
  geometry: DeviceGeometry;
  metrics: DataMetric[];
  defaultPosition: Vector3D;
  defaultRotation: Rotation3D;
  scale: Vector3D;
  color: string;
  statusColors: Record<DeviceStatus, string>;
}

/** 设备3D几何配置 */
export interface DeviceGeometry {
  type: 'box' | 'cylinder' | 'sphere' | 'composite' | 'custom';
  params: Record<string, number>;
  parts?: GeometryPart[];
}

/** 复合几何体部件 */
export interface GeometryPart {
  id: string;
  type: 'box' | 'cylinder' | 'sphere';
  params: Record<string, number>;
  position: Vector3D;
  rotation: Rotation3D;
  color: string;
  metalness?: number;
  roughness?: number;
}

/** 场景中的设备实例 */
export interface DeviceInstance {
  id: string;
  templateId: string;
  name: string;
  position: Vector3D;
  rotation: Rotation3D;
  scale: Vector3D;
  status: DeviceStatus;
  metrics: DataMetric[];
  apiConfig: DataApiConfig;
}

/** 工厂模板定义 */
export interface FactoryTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  thumbnail?: string;
  floorSize: { width: number; depth: number };
  floorColor: string;
  wallColor: string;
  devices: FactoryDevicePlacement[];
  environment: EnvironmentConfig;
}

/** 工厂中设备的预设位置 */
export interface FactoryDevicePlacement {
  templateId: string;
  name: string;
  position: Vector3D;
  rotation: Rotation3D;
}

/** 环境配置 */
export interface EnvironmentConfig {
  ambientLight: { intensity: number; color: string };
  directionalLight: { intensity: number; color: string; position: Vector3D };
  fog?: { color: string; near: number; far: number };
  skyColor: string;
  groundColor: string;
}

/** 场景状态 */
export interface SceneState {
  factoryTemplateId: string | null;
  devices: DeviceInstance[];
  dataMode: DataMode;
  isPlaying: boolean;
  selectedDeviceId: string | null;
}

/** 面板状态 */
export interface PanelState {
  activePanel: 'template' | 'device' | 'data' | null;
  templateCategory: DeviceCategory | 'factory' | 'all';
}
