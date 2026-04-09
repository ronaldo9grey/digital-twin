// ==========================================
// 数字孪生系统 - 数据服务统一入口
// ==========================================
import { DemoDataEngine } from './demoEngine';
import { LivePollingEngine } from './liveApi';
import { useAppStore } from '../store';
import { DeviceStatus } from '../types';

/**
 * 数据服务管理器
 * 统一管理Demo模式和Live模式的数据更新
 */
class DataServiceManager {
  private demoEngine: DemoDataEngine | null = null;
  private liveEngine: LivePollingEngine | null = null;

  /** 初始化 */
  init() {
    this.liveEngine = new LivePollingEngine((deviceId, values) => {
      const device = useAppStore.getState().devices.find((d) => d.id === deviceId);
      if (!device) return;

      const updatedMetrics = device.metrics.map((m) => ({
        ...m,
        currentValue: values[m.id] !== undefined ? values[m.id] : m.currentValue,
      }));

      let hasWarning = false;
      let hasError = false;
      for (const m of updatedMetrics) {
        if (m.warnMin !== undefined && m.currentValue < m.warnMin) hasWarning = true;
        if (m.warnMax !== undefined && m.currentValue > m.warnMax) hasError = true;
        if (m.currentValue < m.normalMin || m.currentValue > m.normalMax) hasWarning = true;
      }

      const status = hasError ? DeviceStatus.ERROR : hasWarning ? DeviceStatus.WARNING : DeviceStatus.RUNNING;

      const currentState = useAppStore.getState();
      useAppStore.setState({
        devices: currentState.devices.map((d) =>
          d.id === deviceId ? { ...d, metrics: updatedMetrics, status } : d
        ),
      });
    });
  }

  /** 启动数据服务 */
  start() {
    const { dataMode, devices } = useAppStore.getState();
    if (devices.length === 0) return; // 没有设备时不启动

    if (dataMode === 'demo') {
      this.startDemo();
    } else {
      this.startLive();
    }
  }

  /** 停止数据服务 */
  stop() {
    this.stopDemo();
    this.stopLive();
  }

  /** 启动Demo模式 */
  private startDemo() {
    this.stopLive();

    // 传入 getter 函数，每次 tick 从 store 读取最新设备列表
    this.demoEngine = new DemoDataEngine(
      () => useAppStore.getState().devices,
      (deviceId, metrics, status) => {
        const currentState = useAppStore.getState();
        useAppStore.setState({
          devices: currentState.devices.map((d) =>
            d.id === deviceId ? { ...d, metrics, status } : d
          ),
        });
      }
    );

    this.demoEngine.start(1500);
    useAppStore.setState({ isPlaying: true });
  }

  /** 停止Demo模式 */
  private stopDemo() {
    if (this.demoEngine) {
      this.demoEngine.stop();
      this.demoEngine = null;
    }
  }

  /** 启动Live模式 */
  private startLive() {
    this.stopDemo();
    const { devices } = useAppStore.getState();

    devices.forEach((device) => {
      if (device.apiConfig.enabled) {
        this.liveEngine?.startPolling(device.id, device.apiConfig, device.metrics);
      }
    });

    useAppStore.setState({ isPlaying: true });
  }

  /** 停止Live模式 */
  private stopLive() {
    this.liveEngine?.stopAll();
  }
}

// 单例
export const dataService = new DataServiceManager();
