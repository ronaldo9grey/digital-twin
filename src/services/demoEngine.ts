// ==========================================
// 数字孪生系统 - Demo数据模拟生成器
// ==========================================
import type { DataMetric, DeviceInstance } from '../types';
import { DeviceStatus } from '../types';

/**
 * 为指定指标生成模拟数据值
 * 基于当前值做小幅随机波动，模拟真实传感器数据
 */
function simulateMetricValue(metric: DataMetric): number {
  const { min, max, currentValue } = metric;
  const range = max - min;
  // 波动幅度为范围的3%~8%，让变化更明显
  const fluctuation = range * (0.03 + Math.random() * 0.05);
  const delta = (Math.random() - 0.5) * 2 * fluctuation;
  let newValue = currentValue + delta;

  // 偶尔产生异常值（8%概率）
  if (Math.random() < 0.08) {
    const isHigh = Math.random() > 0.5;
    newValue = isHigh
      ? metric.normalMax + (metric.warnMax || metric.normalMax) * 0.15
      : metric.normalMin - metric.normalMin * 0.15;
  }

  // 限制在范围内
  return Math.max(min, Math.min(max, newValue));
}

/**
 * 根据指标值判断设备状态
 */
function inferDeviceStatus(metrics: DataMetric[]): DeviceStatus {
  let hasWarning = false;
  let hasError = false;

  for (const m of metrics) {
    const val = m.currentValue;
    if (m.warnMin !== undefined && val < m.warnMin) hasWarning = true;
    if (m.warnMax !== undefined && val > m.warnMax) hasError = true;
    if (val < m.normalMin || val > m.normalMax) hasWarning = true;
  }

  if (hasError) return DeviceStatus.ERROR;
  if (hasWarning) return DeviceStatus.WARNING;
  return DeviceStatus.RUNNING;
}

/**
 * Demo数据引擎 - 定期更新所有设备数据
 * 
 * 关键改进：每次 tick 都从 getDevices 回调获取最新设备列表，
 * 而不是使用构造时的快照，确保数据持续累积变化。
 */
export class DemoDataEngine {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private updateCallback: (deviceId: string, metrics: DataMetric[], status: DeviceStatus) => void;
  private getDevices: () => DeviceInstance[];

  constructor(
    getDevices: () => DeviceInstance[],
    callback: (deviceId: string, metrics: DataMetric[], status: DeviceStatus) => void
  ) {
    this.getDevices = getDevices;
    this.updateCallback = callback;
  }

  /** 启动模拟 */
  start(intervalMs: number = 1500) {
    if (this.intervalId) return;

    // 启动时立即执行一次，让用户立刻看到数据
    this.tick();

    this.intervalId = setInterval(() => {
      this.tick();
    }, intervalMs);
  }

  /** 单次 tick：从 store 读取最新设备数据并更新 */
  private tick() {
    const currentDevices = this.getDevices();
    if (currentDevices.length === 0) return;

    currentDevices.forEach((device) => {
      const newMetrics = device.metrics.map((m) => ({
        ...m,
        currentValue: Math.round(simulateMetricValue(m) * 100) / 100,
      }));

      const status = inferDeviceStatus(newMetrics);
      this.updateCallback(device.id, newMetrics, status);
    });
  }

  /** 停止模拟 */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /** 是否正在运行 */
  get isRunning(): boolean {
    return this.intervalId !== null;
  }
}
