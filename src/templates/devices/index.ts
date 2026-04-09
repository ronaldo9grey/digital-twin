// ==========================================
// 数字孪生系统 - 设备模板库
// ==========================================
import { DeviceCategory, DeviceStatus } from '../../types';
import type { DeviceTemplate } from '../../types';

// ==================== 产线设备 ====================

/** 传送带 */
const conveyorBelt: DeviceTemplate = {
  id: 'conveyor-belt',
  name: '传送带',
  category: DeviceCategory.PRODUCTION,
  description: '物料输送传送带，用于产线物料流转',
  icon: 'SwapOutlined',
  geometry: {
    type: 'composite',
    params: {},
    parts: [
      { id: 'belt', type: 'box', params: { width: 4, height: 0.1, depth: 0.8 }, position: { x: 0, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#4a5568', metalness: 0.2, roughness: 0.7 },
      { id: 'leg1', type: 'box', params: { width: 0.1, height: 0.5, depth: 0.1 }, position: { x: -1.5, y: 0.25, z: 0.3 }, rotation: { x: 0, y: 0, z: 0 }, color: '#718096', metalness: 0.4, roughness: 0.5 },
      { id: 'leg2', type: 'box', params: { width: 0.1, height: 0.5, depth: 0.1 }, position: { x: 1.5, y: 0.25, z: 0.3 }, rotation: { x: 0, y: 0, z: 0 }, color: '#718096', metalness: 0.4, roughness: 0.5 },
      { id: 'leg3', type: 'box', params: { width: 0.1, height: 0.5, depth: 0.1 }, position: { x: -1.5, y: 0.25, z: -0.3 }, rotation: { x: 0, y: 0, z: 0 }, color: '#718096', metalness: 0.4, roughness: 0.5 },
      { id: 'leg4', type: 'box', params: { width: 0.1, height: 0.5, depth: 0.1 }, position: { x: 1.5, y: 0.25, z: -0.3 }, rotation: { x: 0, y: 0, z: 0 }, color: '#718096', metalness: 0.4, roughness: 0.5 },
      { id: 'roller1', type: 'cylinder', params: { radius: 0.15, height: 0.9 }, position: { x: -1.8, y: 0.55, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 }, color: '#a0aec0', metalness: 0.7, roughness: 0.3 },
      { id: 'roller2', type: 'cylinder', params: { radius: 0.15, height: 0.9 }, position: { x: 1.8, y: 0.55, z: 0 }, rotation: { x: 0, y: 0, z: Math.PI / 2 }, color: '#a0aec0', metalness: 0.7, roughness: 0.3 },
    ],
  },
  metrics: [
    { id: 'speed', name: '运行速度', unit: 'm/s', min: 0, max: 5, normalMin: 0.5, normalMax: 3, currentValue: 1.5 },
    { id: 'load', name: '负载率', unit: '%', min: 0, max: 100, normalMin: 10, normalMax: 85, warnMax: 95, currentValue: 65 },
    { id: 'temperature', name: '电机温度', unit: '℃', min: 0, max: 120, normalMin: 20, normalMax: 70, warnMax: 90, currentValue: 45 },
  ],
  defaultPosition: { x: 0, y: 0, z: 0 },
  defaultRotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#4a5568',
  statusColors: {
    [DeviceStatus.RUNNING]: '#48bb78',
    [DeviceStatus.STOPPED]: '#a0aec0',
    [DeviceStatus.WARNING]: '#ecc94b',
    [DeviceStatus.ERROR]: '#fc8181',
    [DeviceStatus.IDLE]: '#a0aec0',
  },
};

/** 机械臂 */
const roboticArm: DeviceTemplate = {
  id: 'robotic-arm',
  name: '六轴机械臂',
  category: DeviceCategory.PRODUCTION,
  description: '六轴工业机器人，用于焊接、装配、搬运等',
  icon: 'RobotOutlined',
  geometry: {
    type: 'composite',
    params: {},
    parts: [
      { id: 'base', type: 'cylinder', params: { radius: 0.4, height: 0.3 }, position: { x: 0, y: 0.15, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#f6ad55', metalness: 0.4, roughness: 0.5 },
      { id: 'shoulder', type: 'box', params: { width: 0.3, height: 0.8, depth: 0.3 }, position: { x: 0, y: 0.7, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#ed8936', metalness: 0.4, roughness: 0.5 },
      { id: 'elbow', type: 'box', params: { width: 0.25, height: 0.7, depth: 0.25 }, position: { x: 0, y: 1.4, z: 0.2 }, rotation: { x: -0.3, y: 0, z: 0 }, color: '#dd6b20', metalness: 0.4, roughness: 0.5 },
      { id: 'wrist', type: 'box', params: { width: 0.2, height: 0.4, depth: 0.2 }, position: { x: 0, y: 1.9, z: 0.5 }, rotation: { x: 0.2, y: 0, z: 0 }, color: '#c05621', metalness: 0.4, roughness: 0.5 },
      { id: 'gripper', type: 'box', params: { width: 0.15, height: 0.15, depth: 0.3 }, position: { x: 0, y: 2.1, z: 0.65 }, rotation: { x: 0, y: 0, z: 0 }, color: '#9c4221', metalness: 0.7, roughness: 0.3 },
    ],
  },
  metrics: [
    { id: 'joint1', name: '关节1角度', unit: '°', min: -180, max: 180, normalMin: -90, normalMax: 90, currentValue: 45 },
    { id: 'joint2', name: '关节2角度', unit: '°', min: -120, max: 120, normalMin: -60, normalMax: 60, currentValue: -30 },
    { id: 'speed', name: '运动速度', unit: 'mm/s', min: 0, max: 5000, normalMin: 100, normalMax: 2000, currentValue: 800 },
    { id: 'payload', name: '当前负载', unit: 'kg', min: 0, max: 50, normalMin: 0, normalMax: 40, warnMax: 45, currentValue: 15 },
    { id: 'cycleTime', name: '周期时间', unit: 's', min: 0, max: 60, normalMin: 2, normalMax: 30, warnMax: 45, currentValue: 12 },
  ],
  defaultPosition: { x: 0, y: 0, z: 0 },
  defaultRotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#ed8936',
  statusColors: {
    [DeviceStatus.RUNNING]: '#48bb78',
    [DeviceStatus.STOPPED]: '#a0aec0',
    [DeviceStatus.WARNING]: '#ecc94b',
    [DeviceStatus.ERROR]: '#fc8181',
    [DeviceStatus.IDLE]: '#a0aec0',
  },
};

/** AGV小车 */
const agvCart: DeviceTemplate = {
  id: 'agv-cart',
  name: 'AGV搬运车',
  category: DeviceCategory.PRODUCTION,
  description: '自动导引运输车，用于物料自动搬运',
  icon: 'CarOutlined',
  geometry: {
    type: 'composite',
    params: {},
    parts: [
      { id: 'body', type: 'box', params: { width: 1.2, height: 0.4, depth: 0.8 }, position: { x: 0, y: 0.35, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#4299e1', metalness: 0.4, roughness: 0.5 },
      { id: 'top', type: 'box', params: { width: 0.8, height: 0.15, depth: 0.6 }, position: { x: 0, y: 0.625, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#3182ce', metalness: 0.2, roughness: 0.7 },
      { id: 'wheel1', type: 'cylinder', params: { radius: 0.15, height: 0.1 }, position: { x: -0.45, y: 0.15, z: 0.4 }, rotation: { x: 0, y: 0, z: Math.PI / 2 }, color: '#2d3748', metalness: 0.7, roughness: 0.3 },
      { id: 'wheel2', type: 'cylinder', params: { radius: 0.15, height: 0.1 }, position: { x: 0.45, y: 0.15, z: 0.4 }, rotation: { x: 0, y: 0, z: Math.PI / 2 }, color: '#2d3748', metalness: 0.7, roughness: 0.3 },
      { id: 'wheel3', type: 'cylinder', params: { radius: 0.15, height: 0.1 }, position: { x: -0.45, y: 0.15, z: -0.4 }, rotation: { x: 0, y: 0, z: Math.PI / 2 }, color: '#2d3748', metalness: 0.7, roughness: 0.3 },
      { id: 'wheel4', type: 'cylinder', params: { radius: 0.15, height: 0.1 }, position: { x: 0.45, y: 0.15, z: -0.4 }, rotation: { x: 0, y: 0, z: Math.PI / 2 }, color: '#2d3748', metalness: 0.7, roughness: 0.3 },
      { id: 'sensor', type: 'sphere', params: { radius: 0.08 }, position: { x: 0, y: 0.7, z: 0.35 }, rotation: { x: 0, y: 0, z: 0 }, color: '#fc8181', metalness: 0.1, roughness: 0.8 },
    ],
  },
  metrics: [
    { id: 'battery', name: '电池电量', unit: '%', min: 0, max: 100, normalMin: 20, normalMax: 100, warnMin: 15, currentValue: 78 },
    { id: 'speed', name: '行驶速度', unit: 'm/s', min: 0, max: 3, normalMin: 0.3, normalMax: 1.5, currentValue: 0.8 },
    { id: 'load', name: '载重', unit: 'kg', min: 0, max: 1000, normalMin: 0, normalMax: 800, warnMax: 950, currentValue: 350 },
    { id: 'taskProgress', name: '任务进度', unit: '%', min: 0, max: 100, normalMin: 0, normalMax: 100, currentValue: 42 },
  ],
  defaultPosition: { x: 0, y: 0, z: 0 },
  defaultRotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#4299e1',
  statusColors: {
    [DeviceStatus.RUNNING]: '#48bb78',
    [DeviceStatus.STOPPED]: '#a0aec0',
    [DeviceStatus.WARNING]: '#ecc94b',
    [DeviceStatus.ERROR]: '#fc8181',
    [DeviceStatus.IDLE]: '#a0aec0',
  },
};

/** 码垛机 */
const palletizer: DeviceTemplate = {
  id: 'palletizer',
  name: '码垛机器人',
  category: DeviceCategory.PRODUCTION,
  description: '自动码垛设备，用于成品堆叠整理',
  icon: 'BuildOutlined',
  geometry: {
    type: 'composite',
    params: {},
    parts: [
      { id: 'base', type: 'box', params: { width: 1.5, height: 0.2, depth: 1.5 }, position: { x: 0, y: 0.1, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#718096', metalness: 0.4, roughness: 0.5 },
      { id: 'pillar', type: 'box', params: { width: 0.2, height: 3, depth: 0.2 }, position: { x: 0, y: 1.7, z: -0.5 }, rotation: { x: 0, y: 0, z: 0 }, color: '#a0aec0', metalness: 0.4, roughness: 0.5 },
      { id: 'arm', type: 'box', params: { width: 1.5, height: 0.15, depth: 0.15 }, position: { x: 0.5, y: 2.8, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#ed8936', metalness: 0.4, roughness: 0.5 },
      { id: 'gripper', type: 'box', params: { width: 0.6, height: 0.1, depth: 0.4 }, position: { x: 1.1, y: 2.7, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#dd6b20', metalness: 0.7, roughness: 0.3 },
    ],
  },
  metrics: [
    { id: 'throughput', name: '处理量', unit: '件/h', min: 0, max: 500, normalMin: 100, normalMax: 400, currentValue: 280 },
    { id: 'stackHeight', name: '堆叠高度', unit: '层', min: 0, max: 10, normalMin: 1, normalMax: 8, currentValue: 5 },
    { id: 'efficiency', name: '效率', unit: '%', min: 0, max: 100, normalMin: 60, normalMax: 95, currentValue: 87 },
  ],
  defaultPosition: { x: 0, y: 0, z: 0 },
  defaultRotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#ed8936',
  statusColors: {
    [DeviceStatus.RUNNING]: '#48bb78',
    [DeviceStatus.STOPPED]: '#a0aec0',
    [DeviceStatus.WARNING]: '#ecc94b',
    [DeviceStatus.ERROR]: '#fc8181',
    [DeviceStatus.IDLE]: '#a0aec0',
  },
};

/** CNC加工中心 */
const cncMachine: DeviceTemplate = {
  id: 'cnc-machine',
  name: 'CNC加工中心',
  category: DeviceCategory.PRODUCTION,
  description: '数控加工中心，用于精密零件加工',
  icon: 'ToolOutlined',
  geometry: {
    type: 'composite',
    params: {},
    parts: [
      { id: 'body', type: 'box', params: { width: 2, height: 1.5, depth: 1.5 }, position: { x: 0, y: 0.75, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#2d3748', metalness: 0.4, roughness: 0.5 },
      { id: 'door', type: 'box', params: { width: 1.2, height: 1, depth: 0.05 }, position: { x: 0, y: 0.8, z: 0.77 }, rotation: { x: 0, y: 0, z: 0 }, color: '#4a5568', metalness: 0.2, roughness: 0.7 },
      { id: 'window', type: 'box', params: { width: 0.6, height: 0.4, depth: 0.06 }, position: { x: 0, y: 1, z: 0.78 }, rotation: { x: 0, y: 0, z: 0 }, color: '#63b3ed', metalness: 0.1, roughness: 0.8 },
      { id: 'controlPanel', type: 'box', params: { width: 0.5, height: 0.4, depth: 0.1 }, position: { x: 0.9, y: 1.5, z: 0.5 }, rotation: { x: 0.2, y: 0, z: 0 }, color: '#1a202c', metalness: 0.4, roughness: 0.5 },
      { id: 'screen', type: 'box', params: { width: 0.35, height: 0.25, depth: 0.02 }, position: { x: 0.9, y: 1.55, z: 0.56 }, rotation: { x: 0.2, y: 0, z: 0 }, color: '#48bb78', metalness: 0.1, roughness: 0.8 },
    ],
  },
  metrics: [
    { id: 'spindleSpeed', name: '主轴转速', unit: 'RPM', min: 0, max: 24000, normalMin: 3000, normalMax: 18000, currentValue: 12000 },
    { id: 'feedRate', name: '进给速率', unit: 'mm/min', min: 0, max: 15000, normalMin: 500, normalMax: 10000, currentValue: 5000 },
    { id: 'temperature', name: '主轴温度', unit: '℃', min: 0, max: 100, normalMin: 15, normalMax: 55, warnMax: 75, currentValue: 38 },
    { id: 'vibration', name: '振动值', unit: 'mm/s', min: 0, max: 10, normalMin: 0, normalMax: 3, warnMax: 5, currentValue: 1.2 },
    { id: 'toolLife', name: '刀具寿命', unit: '%', min: 0, max: 100, normalMin: 10, normalMax: 100, warnMin: 15, currentValue: 72 },
  ],
  defaultPosition: { x: 0, y: 0, z: 0 },
  defaultRotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#2d3748',
  statusColors: {
    [DeviceStatus.RUNNING]: '#48bb78',
    [DeviceStatus.STOPPED]: '#a0aec0',
    [DeviceStatus.WARNING]: '#ecc94b',
    [DeviceStatus.ERROR]: '#fc8181',
    [DeviceStatus.IDLE]: '#a0aec0',
  },
};

// ==================== 传感器/仪表 ====================

/** 温湿度传感器 */
const tempSensor: DeviceTemplate = {
  id: 'temp-sensor',
  name: '温湿度传感器',
  category: DeviceCategory.SENSOR,
  description: '环境温湿度监测传感器',
  icon: 'DashboardOutlined',
  geometry: {
    type: 'composite',
    params: {},
    parts: [
      { id: 'body', type: 'box', params: { width: 0.2, height: 0.3, depth: 0.1 }, position: { x: 0, y: 1.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#e2e8f0', metalness: 0.2, roughness: 0.7 },
      { id: 'screen', type: 'box', params: { width: 0.15, height: 0.1, depth: 0.02 }, position: { x: 0, y: 1.55, z: 0.06 }, rotation: { x: 0, y: 0, z: 0 }, color: '#48bb78', metalness: 0.1, roughness: 0.8 },
      { id: 'pole', type: 'cylinder', params: { radius: 0.02, height: 1.5 }, position: { x: 0, y: 0.75, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#a0aec0', metalness: 0.7, roughness: 0.3 },
      { id: 'base', type: 'cylinder', params: { radius: 0.15, height: 0.05 }, position: { x: 0, y: 0.025, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#718096', metalness: 0.4, roughness: 0.5 },
    ],
  },
  metrics: [
    { id: 'temperature', name: '温度', unit: '℃', min: -20, max: 60, normalMin: 18, normalMax: 28, warnMin: 10, warnMax: 35, currentValue: 24.5 },
    { id: 'humidity', name: '湿度', unit: '%RH', min: 0, max: 100, normalMin: 30, normalMax: 70, warnMin: 20, warnMax: 80, currentValue: 55 },
  ],
  defaultPosition: { x: 0, y: 0, z: 0 },
  defaultRotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#e2e8f0',
  statusColors: {
    [DeviceStatus.RUNNING]: '#48bb78',
    [DeviceStatus.STOPPED]: '#a0aec0',
    [DeviceStatus.WARNING]: '#ecc94b',
    [DeviceStatus.ERROR]: '#fc8181',
    [DeviceStatus.IDLE]: '#a0aec0',
  },
};

/** 压力传感器 */
const pressureSensor: DeviceTemplate = {
  id: 'pressure-sensor',
  name: '压力变送器',
  category: DeviceCategory.SENSOR,
  description: '工业管道压力监测',
  icon: 'GaugeOutlined',
  geometry: {
    type: 'composite',
    params: {},
    parts: [
      { id: 'body', type: 'cylinder', params: { radius: 0.1, height: 0.2 }, position: { x: 0, y: 1.2, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#e53e3e', metalness: 0.4, roughness: 0.5 },
      { id: 'display', type: 'box', params: { width: 0.12, height: 0.08, depth: 0.02 }, position: { x: 0, y: 1.25, z: 0.11 }, rotation: { x: 0, y: 0, z: 0 }, color: '#fefcbf', metalness: 0.1, roughness: 0.8 },
      { id: 'connector', type: 'cylinder', params: { radius: 0.04, height: 0.3 }, position: { x: 0, y: 1.45, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#a0aec0', metalness: 0.7, roughness: 0.3 },
      { id: 'pipe', type: 'cylinder', params: { radius: 0.06, height: 1.2 }, position: { x: 0, y: 0.6, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#718096', metalness: 0.7, roughness: 0.3 },
    ],
  },
  metrics: [
    { id: 'pressure', name: '管道压力', unit: 'MPa', min: 0, max: 10, normalMin: 0.3, normalMax: 0.8, warnMin: 0.1, warnMax: 1.0, currentValue: 0.52 },
    { id: 'temperature', name: '介质温度', unit: '℃', min: -10, max: 150, normalMin: 20, normalMax: 80, warnMax: 100, currentValue: 55 },
  ],
  defaultPosition: { x: 0, y: 0, z: 0 },
  defaultRotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#e53e3e',
  statusColors: {
    [DeviceStatus.RUNNING]: '#48bb78',
    [DeviceStatus.STOPPED]: '#a0aec0',
    [DeviceStatus.WARNING]: '#ecc94b',
    [DeviceStatus.ERROR]: '#fc8181',
    [DeviceStatus.IDLE]: '#a0aec0',
  },
};

/** 振动传感器 */
const vibrationSensor: DeviceTemplate = {
  id: 'vibration-sensor',
  name: '振动监测仪',
  category: DeviceCategory.SENSOR,
  description: '设备振动状态在线监测',
  icon: 'ThunderboltOutlined',
  geometry: {
    type: 'composite',
    params: {},
    parts: [
      { id: 'body', type: 'cylinder', params: { radius: 0.08, height: 0.15 }, position: { x: 0, y: 0.075, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#6b46c1', metalness: 0.4, roughness: 0.5 },
      { id: 'antenna', type: 'cylinder', params: { radius: 0.01, height: 0.2 }, position: { x: 0.03, y: 0.25, z: 0 }, rotation: { x: 0, y: 0, z: 0.2 }, color: '#a0aec0', metalness: 0.7, roughness: 0.3 },
      { id: 'led', type: 'sphere', params: { radius: 0.02 }, position: { x: 0, y: 0.16, z: 0.06 }, rotation: { x: 0, y: 0, z: 0 }, color: '#48bb78', metalness: 0.1, roughness: 0.8 },
    ],
  },
  metrics: [
    { id: 'vibration', name: '振动速度', unit: 'mm/s', min: 0, max: 50, normalMin: 0, normalMax: 4.5, warnMax: 7.1, currentValue: 2.1 },
    { id: 'acceleration', name: '加速度', unit: 'g', min: 0, max: 20, normalMin: 0, normalMax: 5, warnMax: 8, currentValue: 1.8 },
    { id: 'frequency', name: '主频', unit: 'Hz', min: 0, max: 1000, normalMin: 10, normalMax: 200, currentValue: 85 },
  ],
  defaultPosition: { x: 0, y: 0, z: 0 },
  defaultRotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#6b46c1',
  statusColors: {
    [DeviceStatus.RUNNING]: '#48bb78',
    [DeviceStatus.STOPPED]: '#a0aec0',
    [DeviceStatus.WARNING]: '#ecc94b',
    [DeviceStatus.ERROR]: '#fc8181',
    [DeviceStatus.IDLE]: '#a0aec0',
  },
};

/** 流量计 */
const flowMeter: DeviceTemplate = {
  id: 'flow-meter',
  name: '电磁流量计',
  category: DeviceCategory.SENSOR,
  description: '管道流量实时监测',
  icon: 'LineChartOutlined',
  geometry: {
    type: 'composite',
    params: {},
    parts: [
      { id: 'pipe', type: 'cylinder', params: { radius: 0.1, height: 1.5 }, position: { x: 0, y: 0.75, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#718096', metalness: 0.7, roughness: 0.3 },
      { id: 'sensor', type: 'box', params: { width: 0.25, height: 0.2, depth: 0.25 }, position: { x: 0, y: 0.85, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#2b6cb0', metalness: 0.4, roughness: 0.5 },
      { id: 'display', type: 'box', params: { width: 0.15, height: 0.08, depth: 0.02 }, position: { x: 0, y: 0.9, z: 0.14 }, rotation: { x: 0, y: 0, z: 0 }, color: '#90cdf4', metalness: 0.1, roughness: 0.8 },
    ],
  },
  metrics: [
    { id: 'flowRate', name: '瞬时流量', unit: 'm³/h', min: 0, max: 500, normalMin: 50, normalMax: 300, currentValue: 185 },
    { id: 'totalFlow', name: '累计流量', unit: 'm³', min: 0, max: 999999, normalMin: 0, normalMax: 999999, currentValue: 12580 },
    { id: 'pressure', name: '管道压力', unit: 'kPa', min: 0, max: 1000, normalMin: 100, normalMax: 600, warnMax: 800, currentValue: 350 },
  ],
  defaultPosition: { x: 0, y: 0, z: 0 },
  defaultRotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#2b6cb0',
  statusColors: {
    [DeviceStatus.RUNNING]: '#48bb78',
    [DeviceStatus.STOPPED]: '#a0aec0',
    [DeviceStatus.WARNING]: '#ecc94b',
    [DeviceStatus.ERROR]: '#fc8181',
    [DeviceStatus.IDLE]: '#a0aec0',
  },
};

// ==================== 能源/动力设备 ====================

/** 空压机 */
const airCompressor: DeviceTemplate = {
  id: 'air-compressor',
  name: '螺杆空压机',
  category: DeviceCategory.ENERGY,
  description: '工业空气压缩设备，提供压缩空气动力',
  icon: 'CloudOutlined',
  geometry: {
    type: 'composite',
    params: {},
    parts: [
      { id: 'tank', type: 'cylinder', params: { radius: 0.5, height: 1.5 }, position: { x: 0, y: 0.75, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#e2e8f0', metalness: 0.7, roughness: 0.3 },
      { id: 'head', type: 'box', params: { width: 0.6, height: 0.4, depth: 0.5 }, position: { x: 0, y: 1.7, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#4a5568', metalness: 0.4, roughness: 0.5 },
      { id: 'motor', type: 'box', params: { width: 0.4, height: 0.3, depth: 0.4 }, position: { x: 0, y: 2.05, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#2d3748', metalness: 0.4, roughness: 0.5 },
      { id: 'pipe1', type: 'cylinder', params: { radius: 0.04, height: 0.5 }, position: { x: 0.3, y: 1.5, z: 0.3 }, rotation: { x: 0, y: 0, z: 0.3 }, color: '#a0aec0', metalness: 0.7, roughness: 0.3 },
      { id: 'pipe2', type: 'cylinder', params: { radius: 0.04, height: 0.5 }, position: { x: -0.3, y: 1.5, z: -0.3 }, rotation: { x: 0, y: 0, z: -0.3 }, color: '#a0aec0', metalness: 0.7, roughness: 0.3 },
    ],
  },
  metrics: [
    { id: 'pressure', name: '排气压力', unit: 'MPa', min: 0, max: 1.6, normalMin: 0.6, normalMax: 0.8, warnMin: 0.5, warnMax: 1.0, currentValue: 0.75 },
    { id: 'temperature', name: '排气温度', unit: '℃', min: 0, max: 120, normalMin: 60, normalMax: 95, warnMax: 105, currentValue: 82 },
    { id: 'power', name: '功率', unit: 'kW', min: 0, max: 200, normalMin: 30, normalMax: 150, currentValue: 90 },
    { id: 'efficiency', name: '能效比', unit: 'kW/(m³/min)', min: 0, max: 10, normalMin: 5, normalMax: 7, warnMax: 8, currentValue: 6.2 },
  ],
  defaultPosition: { x: 0, y: 0, z: 0 },
  defaultRotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#e2e8f0',
  statusColors: {
    [DeviceStatus.RUNNING]: '#48bb78',
    [DeviceStatus.STOPPED]: '#a0aec0',
    [DeviceStatus.WARNING]: '#ecc94b',
    [DeviceStatus.ERROR]: '#fc8181',
    [DeviceStatus.IDLE]: '#a0aec0',
  },
};

/** 配电柜 */
const powerCabinet: DeviceTemplate = {
  id: 'power-cabinet',
  name: '低压配电柜',
  category: DeviceCategory.ENERGY,
  description: '低压配电设备，电力分配与保护',
  icon: 'ApartmentOutlined',
  geometry: {
    type: 'composite',
    params: {},
    parts: [
      { id: 'body', type: 'box', params: { width: 0.8, height: 2.2, depth: 0.5 }, position: { x: 0, y: 1.1, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#718096', metalness: 0.4, roughness: 0.5 },
      { id: 'door', type: 'box', params: { width: 0.7, height: 2, depth: 0.03 }, position: { x: 0, y: 1.1, z: 0.27 }, rotation: { x: 0, y: 0, z: 0 }, color: '#a0aec0', metalness: 0.2, roughness: 0.7 },
      { id: 'handle', type: 'box', params: { width: 0.15, height: 0.03, depth: 0.05 }, position: { x: 0.2, y: 1.1, z: 0.3 }, rotation: { x: 0, y: 0, z: 0 }, color: '#4a5568', metalness: 0.7, roughness: 0.3 },
      { id: 'indicator1', type: 'sphere', params: { radius: 0.025 }, position: { x: -0.15, y: 1.9, z: 0.3 }, rotation: { x: 0, y: 0, z: 0 }, color: '#48bb78', metalness: 0.1, roughness: 0.8 },
      { id: 'indicator2', type: 'sphere', params: { radius: 0.025 }, position: { x: -0.05, y: 1.9, z: 0.3 }, rotation: { x: 0, y: 0, z: 0 }, color: '#48bb78', metalness: 0.1, roughness: 0.8 },
      { id: 'indicator3', type: 'sphere', params: { radius: 0.025 }, position: { x: 0.05, y: 1.9, z: 0.3 }, rotation: { x: 0, y: 0, z: 0 }, color: '#ecc94b', metalness: 0.1, roughness: 0.8 },
    ],
  },
  metrics: [
    { id: 'voltage', name: '母线电压', unit: 'V', min: 0, max: 450, normalMin: 370, normalMax: 410, warnMin: 360, warnMax: 420, currentValue: 385 },
    { id: 'current', name: '总电流', unit: 'A', min: 0, max: 2000, normalMin: 100, normalMax: 1200, warnMax: 1500, currentValue: 680 },
    { id: 'power', name: '有功功率', unit: 'kW', min: 0, max: 800, normalMin: 50, normalMax: 500, currentValue: 320 },
    { id: 'powerFactor', name: '功率因数', unit: '', min: 0, max: 1, normalMin: 0.85, normalMax: 1, warnMin: 0.8, currentValue: 0.93 },
    { id: 'temperature', name: '柜内温度', unit: '℃', min: 0, max: 60, normalMin: 15, normalMax: 40, warnMax: 50, currentValue: 32 },
  ],
  defaultPosition: { x: 0, y: 0, z: 0 },
  defaultRotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#718096',
  statusColors: {
    [DeviceStatus.RUNNING]: '#48bb78',
    [DeviceStatus.STOPPED]: '#a0aec0',
    [DeviceStatus.WARNING]: '#ecc94b',
    [DeviceStatus.ERROR]: '#fc8181',
    [DeviceStatus.IDLE]: '#a0aec0',
  },
};

/** 冷水机组 */
const chiller: DeviceTemplate = {
  id: 'chiller',
  name: '冷水机组',
  category: DeviceCategory.ENERGY,
  description: '工业制冷设备，提供工艺冷却水',
  icon: 'ExperimentOutlined',
  geometry: {
    type: 'composite',
    params: {},
    parts: [
      { id: 'body', type: 'box', params: { width: 2.5, height: 1.5, depth: 1 }, position: { x: 0, y: 0.75, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#2b6cb0', metalness: 0.4, roughness: 0.5 },
      { id: 'top', type: 'box', params: { width: 2.3, height: 0.1, depth: 0.8 }, position: { x: 0, y: 1.55, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#2c5282', metalness: 0.2, roughness: 0.7 },
      { id: 'fan1', type: 'cylinder', params: { radius: 0.3, height: 0.15 }, position: { x: -0.6, y: 1.65, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#4299e1', metalness: 0.7, roughness: 0.3 },
      { id: 'fan2', type: 'cylinder', params: { radius: 0.3, height: 0.15 }, position: { x: 0.6, y: 1.65, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#4299e1', metalness: 0.7, roughness: 0.3 },
      { id: 'panel', type: 'box', params: { width: 0.4, height: 0.5, depth: 0.05 }, position: { x: 1.26, y: 0.9, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#1a202c', metalness: 0.4, roughness: 0.5 },
      { id: 'screen', type: 'box', params: { width: 0.3, height: 0.2, depth: 0.02 }, position: { x: 1.27, y: 0.95, z: 0.03 }, rotation: { x: 0, y: 0, z: 0 }, color: '#63b3ed', metalness: 0.1, roughness: 0.8 },
    ],
  },
  metrics: [
    { id: 'supplyTemp', name: '供水温度', unit: '℃', min: 0, max: 20, normalMin: 5, normalMax: 12, warnMax: 15, currentValue: 7.2 },
    { id: 'returnTemp', name: '回水温度', unit: '℃', min: 5, max: 30, normalMin: 10, normalMax: 20, warnMax: 25, currentValue: 14.5 },
    { id: 'power', name: '输入功率', unit: 'kW', min: 0, max: 500, normalMin: 50, normalMax: 300, currentValue: 180 },
    { id: 'cop', name: '能效比COP', unit: '', min: 0, max: 8, normalMin: 3, normalMax: 6, warnMin: 2.5, currentValue: 4.5 },
    { id: 'flowRate', name: '冷冻水流量', unit: 'm³/h', min: 0, max: 200, normalMin: 30, normalMax: 150, currentValue: 95 },
  ],
  defaultPosition: { x: 0, y: 0, z: 0 },
  defaultRotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#2b6cb0',
  statusColors: {
    [DeviceStatus.RUNNING]: '#48bb78',
    [DeviceStatus.STOPPED]: '#a0aec0',
    [DeviceStatus.WARNING]: '#ecc94b',
    [DeviceStatus.ERROR]: '#fc8181',
    [DeviceStatus.IDLE]: '#a0aec0',
  },
};

/** 变频器 */
const vfd: DeviceTemplate = {
  id: 'vfd',
  name: '变频器',
  category: DeviceCategory.ENERGY,
  description: '电机变频调速控制设备',
  icon: 'ControlOutlined',
  geometry: {
    type: 'composite',
    params: {},
    parts: [
      { id: 'body', type: 'box', params: { width: 0.5, height: 0.8, depth: 0.35 }, position: { x: 0, y: 0.4, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, color: '#2d3748', metalness: 0.4, roughness: 0.5 },
      { id: 'display', type: 'box', params: { width: 0.3, height: 0.15, depth: 0.02 }, position: { x: 0, y: 0.6, z: 0.18 }, rotation: { x: 0, y: 0, z: 0 }, color: '#48bb78', metalness: 0.1, roughness: 0.8 },
      { id: 'buttons', type: 'box', params: { width: 0.35, height: 0.08, depth: 0.02 }, position: { x: 0, y: 0.35, z: 0.18 }, rotation: { x: 0, y: 0, z: 0 }, color: '#4a5568', metalness: 0.2, roughness: 0.7 },
      { id: 'heatSink', type: 'box', params: { width: 0.45, height: 0.6, depth: 0.05 }, position: { x: 0, y: 0.3, z: -0.2 }, rotation: { x: 0, y: 0, z: 0 }, color: '#a0aec0', metalness: 0.7, roughness: 0.3 },
    ],
  },
  metrics: [
    { id: 'outputFreq', name: '输出频率', unit: 'Hz', min: 0, max: 400, normalMin: 10, normalMax: 50, currentValue: 38 },
    { id: 'outputVoltage', name: '输出电压', unit: 'V', min: 0, max: 460, normalMin: 100, normalMax: 380, currentValue: 285 },
    { id: 'outputCurrent', name: '输出电流', unit: 'A', min: 0, max: 100, normalMin: 5, normalMax: 60, warnMax: 80, currentValue: 35 },
    { id: 'temperature', name: '散热器温度', unit: '℃', min: 0, max: 80, normalMin: 20, normalMax: 55, warnMax: 65, currentValue: 42 },
  ],
  defaultPosition: { x: 0, y: 0, z: 0 },
  defaultRotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  color: '#2d3748',
  statusColors: {
    [DeviceStatus.RUNNING]: '#48bb78',
    [DeviceStatus.STOPPED]: '#a0aec0',
    [DeviceStatus.WARNING]: '#ecc94b',
    [DeviceStatus.ERROR]: '#fc8181',
    [DeviceStatus.IDLE]: '#a0aec0',
  },
};

// ==================== 导出 ====================

/** 所有设备模板 */
export const deviceTemplates: DeviceTemplate[] = [
  // 产线设备
  conveyorBelt,
  roboticArm,
  agvCart,
  palletizer,
  cncMachine,
  // 传感器/仪表
  tempSensor,
  pressureSensor,
  vibrationSensor,
  flowMeter,
  // 能源/动力设备
  airCompressor,
  powerCabinet,
  chiller,
  vfd,
];

/** 根据ID获取设备模板 */
export function getDeviceTemplate(id: string): DeviceTemplate | undefined {
  return deviceTemplates.find((t) => t.id === id);
}

/** 根据类别获取设备模板 */
export function getDeviceTemplatesByCategory(category: string): DeviceTemplate[] {
  return deviceTemplates.filter((t) => t.category === category);
}
