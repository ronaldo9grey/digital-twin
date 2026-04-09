// ==========================================
// 数字孪生系统 - Zustand全局状态管理
// ==========================================
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  DeviceInstance,
  DataMode,
  DeviceStatus,
  DataApiConfig,
  Vector3D,
  Rotation3D,
  PanelState,
  DeviceCategory,
} from '../types';
import { DeviceStatus as DS, DataMode as DM } from '../types';
import { getDeviceTemplate } from '../templates/devices';
import { getFactoryTemplate } from '../templates/factories';

/** 主应用Store */
interface AppStore {
  // ---- 场景状态 ----
  factoryTemplateId: string | null;
  devices: DeviceInstance[];
  dataMode: DataMode;
  isPlaying: boolean;
  selectedDeviceId: string | null;

  // ---- 面板状态 ----
  activePanel: PanelState['activePanel'];
  templateCategory: DeviceCategory | 'factory' | 'all';

  // ---- 场景操作 ----
  loadFactoryTemplate: (templateId: string) => void;
  addDevice: (templateId: string, position?: Vector3D, rotation?: Rotation3D) => void;
  removeDevice: (deviceId: string) => void;
  updateDevicePosition: (deviceId: string, position: Vector3D) => void;
  updateDeviceRotation: (deviceId: string, rotation: Rotation3D) => void;
  updateDeviceName: (deviceId: string, name: string) => void;
  selectDevice: (deviceId: string | null) => void;
  updateDeviceStatus: (deviceId: string, status: DeviceStatus) => void;
  updateDeviceMetric: (deviceId: string, metricId: string, value: number) => void;
  updateDeviceApiConfig: (deviceId: string, config: DataApiConfig) => void;

  // ---- 数据模式 ----
  setDataMode: (mode: DataMode) => void;
  togglePlay: () => void;

  // ---- 面板操作 ----
  setActivePanel: (panel: PanelState['activePanel']) => void;
  setTemplateCategory: (category: DeviceCategory | 'factory' | 'all') => void;

  // ---- 清空 ----
  clearScene: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // ---- 初始状态 ----
  factoryTemplateId: null,
  devices: [],
  dataMode: DM.DEMO,
  isPlaying: false,
  selectedDeviceId: null,
  activePanel: 'template',
  templateCategory: 'all',

  // ---- 场景操作 ----
  loadFactoryTemplate: (templateId: string) => {
    const factoryTemplate = getFactoryTemplate(templateId);
    if (!factoryTemplate) return;

    const devices: DeviceInstance[] = factoryTemplate.devices.map((placement) => {
      const template = getDeviceTemplate(placement.templateId);
      if (!template) return null;

      return {
        id: uuidv4(),
        templateId: placement.templateId,
        name: placement.name,
        position: { ...placement.position },
        rotation: { ...placement.rotation },
        scale: { ...template.scale },
        status: DS.RUNNING,
        metrics: template.metrics.map((m) => ({ ...m })),
        apiConfig: {
          enabled: false,
          url: '',
          method: 'GET' as const,
          pollingInterval: 3000,
          dataPath: '',
          mapping: {},
        },
      };
    }).filter(Boolean) as DeviceInstance[];

    set({
      factoryTemplateId: templateId,
      devices,
      selectedDeviceId: null,
    });
  },

  addDevice: (templateId: string, position?: Vector3D, rotation?: Rotation3D) => {
    const template = getDeviceTemplate(templateId);
    if (!template) return;

    const newDevice: DeviceInstance = {
      id: uuidv4(),
      templateId,
      name: template.name,
      position: position || { ...template.defaultPosition },
      rotation: rotation || { ...template.defaultRotation },
      scale: { ...template.scale },
      status: DS.IDLE,
      metrics: template.metrics.map((m) => ({ ...m })),
      apiConfig: {
        enabled: false,
        url: '',
        method: 'GET',
        pollingInterval: 3000,
        dataPath: '',
        mapping: {},
      },
    };

    set((state) => ({
      devices: [...state.devices, newDevice],
    }));
  },

  removeDevice: (deviceId: string) => {
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== deviceId),
      selectedDeviceId:
        state.selectedDeviceId === deviceId ? null : state.selectedDeviceId,
    }));
  },

  updateDevicePosition: (deviceId: string, position: Vector3D) => {
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === deviceId ? { ...d, position } : d
      ),
    }));
  },

  updateDeviceRotation: (deviceId: string, rotation: Rotation3D) => {
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === deviceId ? { ...d, rotation } : d
      ),
    }));
  },

  updateDeviceName: (deviceId: string, name: string) => {
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === deviceId ? { ...d, name } : d
      ),
    }));
  },

  selectDevice: (deviceId: string | null) => {
    set({ selectedDeviceId: deviceId });
    if (deviceId) {
      set({ activePanel: 'device' });
    }
  },

  updateDeviceStatus: (deviceId: string, status: DeviceStatus) => {
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === deviceId ? { ...d, status } : d
      ),
    }));
  },

  updateDeviceMetric: (deviceId: string, metricId: string, value: number) => {
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              metrics: d.metrics.map((m) =>
                m.id === metricId ? { ...m, currentValue: value } : m
              ),
            }
          : d
      ),
    }));
  },

  updateDeviceApiConfig: (deviceId: string, config: DataApiConfig) => {
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === deviceId ? { ...d, apiConfig: config } : d
      ),
    }));
  },

  // ---- 数据模式 ----
  setDataMode: (mode: DataMode) => set({ dataMode: mode }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // ---- 面板操作 ----
  setActivePanel: (panel) => set({ activePanel: panel }),
  setTemplateCategory: (category) => set({ templateCategory: category }),

  // ---- 清空 ----
  clearScene: () =>
    set({
      factoryTemplateId: null,
      devices: [],
      selectedDeviceId: null,
      isPlaying: false,
    }),
}));

/** 获取所有设备模板 */
export { deviceTemplates, getDeviceTemplate } from '../templates/devices';
/** 获取所有工厂模板 */
export { factoryTemplates, getFactoryTemplate } from '../templates/factories';
