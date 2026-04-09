// ==========================================
// 数字孪生系统 - 工厂模板库
// ==========================================
import type { FactoryTemplate } from '../../types';

/** 智能制造工厂模板 */
const smartFactory: FactoryTemplate = {
  id: 'smart-factory',
  name: '智能制造工厂',
  description: '包含完整产线、传感器和能源系统的智能工厂布局',
  icon: 'HomeOutlined',
  floorSize: { width: 30, depth: 20 },
  floorColor: '#e8e8e8',
  wallColor: '#cbd5e0',
  environment: {
    ambientLight: { intensity: 0.4, color: '#ffffff' },
    directionalLight: { intensity: 0.8, color: '#ffffff', position: { x: 10, y: 15, z: 10 } },
    fog: { color: '#e2e8f0', near: 20, far: 60 },
    skyColor: '#ebf8ff',
    groundColor: '#e2e8f0',
  },
  devices: [
    // ---- 产线区域 ----
    { templateId: 'conveyor-belt', name: '主传送带-1', position: { x: -8, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'conveyor-belt', name: '主传送带-2', position: { x: -3, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'conveyor-belt', name: '主传送带-3', position: { x: 2, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'cnc-machine', name: 'CNC加工中心-1', position: { x: -8, y: 0, z: 4 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'cnc-machine', name: 'CNC加工中心-2', position: { x: -4, y: 0, z: 4 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'robotic-arm', name: '装配机械臂-1', position: { x: 0, y: 0, z: 4 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'robotic-arm', name: '装配机械臂-2', position: { x: 4, y: 0, z: 4 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'palletizer', name: '码垛机-1', position: { x: 8, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'agv-cart', name: 'AGV-01', position: { x: 5, y: 0, z: -3 }, rotation: { x: 0, y: Math.PI / 4, z: 0 } },
    { templateId: 'agv-cart', name: 'AGV-02', position: { x: -5, y: 0, z: -4 }, rotation: { x: 0, y: -Math.PI / 3, z: 0 } },

    // ---- 传感器区域 ----
    { templateId: 'temp-sensor', name: '车间温湿度-1', position: { x: -10, y: 0, z: -6 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'temp-sensor', name: '车间温湿度-2', position: { x: 5, y: 0, z: -6 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'pressure-sensor', name: '气路压力监测', position: { x: -10, y: 0, z: 6 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'vibration-sensor', name: 'CNC振动监测', position: { x: -6, y: 0, z: 5 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'flow-meter', name: '冷却水流量计', position: { x: 10, y: 0, z: 6 }, rotation: { x: 0, y: 0, z: 0 } },

    // ---- 能源动力区域 ----
    { templateId: 'air-compressor', name: '空压机-1', position: { x: -12, y: 0, z: -8 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'power-cabinet', name: '1#配电柜', position: { x: -10, y: 0, z: -8 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'power-cabinet', name: '2#配电柜', position: { x: -9, y: 0, z: -8 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'chiller', name: '冷水机组-1', position: { x: 10, y: 0, z: -8 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'vfd', name: '变频器-1', position: { x: -8, y: 0, z: -8 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'vfd', name: '变频器-2', position: { x: -7, y: 0, z: -8 }, rotation: { x: 0, y: 0, z: 0 } },
  ],
};

/** 简易车间模板 */
const simpleWorkshop: FactoryTemplate = {
  id: 'simple-workshop',
  name: '简易生产车间',
  description: '小型生产车间，适合入门演示',
  icon: 'ShopOutlined',
  floorSize: { width: 16, depth: 12 },
  floorColor: '#f0f0f0',
  wallColor: '#e2e8f0',
  environment: {
    ambientLight: { intensity: 0.5, color: '#ffffff' },
    directionalLight: { intensity: 0.7, color: '#ffffff', position: { x: 5, y: 10, z: 5 } },
    skyColor: '#f7fafc',
    groundColor: '#edf2f7',
  },
  devices: [
    { templateId: 'conveyor-belt', name: '传送带-1', position: { x: -3, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'conveyor-belt', name: '传送带-2', position: { x: 2, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'robotic-arm', name: '装配机械臂', position: { x: 0, y: 0, z: 3 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'cnc-machine', name: 'CNC加工中心', position: { x: -4, y: 0, z: 3 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'agv-cart', name: 'AGV搬运车', position: { x: 3, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'temp-sensor', name: '温湿度传感器', position: { x: -5, y: 0, z: -4 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'power-cabinet', name: '配电柜', position: { x: 5, y: 0, z: -4 }, rotation: { x: 0, y: 0, z: 0 } },
  ],
};

/** 能源监控站模板 */
const energyStation: FactoryTemplate = {
  id: 'energy-station',
  name: '能源监控站',
  description: '以能源动力设备为核心的监控场景',
  icon: 'ThunderboltOutlined',
  floorSize: { width: 14, depth: 10 },
  floorColor: '#e8e8e8',
  wallColor: '#cbd5e0',
  environment: {
    ambientLight: { intensity: 0.35, color: '#ffffff' },
    directionalLight: { intensity: 0.9, color: '#ffffff', position: { x: 5, y: 12, z: 5 } },
    fog: { color: '#e2e8f0', near: 15, far: 40 },
    skyColor: '#ebf8ff',
    groundColor: '#e2e8f0',
  },
  devices: [
    { templateId: 'air-compressor', name: '空压机-1', position: { x: -4, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'air-compressor', name: '空压机-2', position: { x: -1, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'chiller', name: '冷水机组-1', position: { x: 3, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'power-cabinet', name: '1#配电柜', position: { x: -5, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'power-cabinet', name: '2#配电柜', position: { x: -3.5, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'power-cabinet', name: '3#配电柜', position: { x: -2, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'vfd', name: '变频器-1', position: { x: 0, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'vfd', name: '变频器-2', position: { x: 1, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'vfd', name: '变频器-3', position: { x: 2, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'pressure-sensor', name: '管道压力-1', position: { x: -2.5, y: 0, z: 3 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'flow-meter', name: '冷却水流量', position: { x: 2, y: 0, z: 3 }, rotation: { x: 0, y: 0, z: 0 } },
    { templateId: 'temp-sensor', name: '环境温湿度', position: { x: 5, y: 0, z: -3 }, rotation: { x: 0, y: 0, z: 0 } },
  ],
};

// ==================== 导出 ====================

/** 所有工厂模板 */
export const factoryTemplates: FactoryTemplate[] = [
  smartFactory,
  simpleWorkshop,
  energyStation,
];

/** 根据ID获取工厂模板 */
export function getFactoryTemplate(id: string): FactoryTemplate | undefined {
  return factoryTemplates.find((t) => t.id === id);
}
