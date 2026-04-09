// ==========================================
// 数字孪生系统 - 真实API数据服务
// ==========================================
import type { DataApiConfig, DataMetric } from '../types';

/**
 * 从嵌套对象中按路径取值
 * 例如 getByPath({ data: { temp: 25 } }, 'data.temp') => 25
 */
function getByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

/**
 * 调用真实API获取数据
 */
export async function fetchLiveData(
  config: DataApiConfig,
  metrics: DataMetric[]
): Promise<Record<string, number>> {
  if (!config.enabled || !config.url) {
    return {};
  }

  try {
    const options: RequestInit = {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    };

    if (config.body && (config.method === 'POST' || config.method === 'PUT')) {
      options.body = config.body;
    }

    const response = await fetch(config.url, options);
    const data = await response.json();

    // 根据映射关系提取数据
    const result: Record<string, number> = {};
    for (const metric of metrics) {
      const apiField = config.mapping?.[metric.id] || metric.id;
      const value = getByPath(data, `${config.dataPath}.${apiField}`) ?? getByPath(data, apiField);
      if (typeof value === 'number') {
        result[metric.id] = value;
      }
    }

    return result;
  } catch (error) {
    console.error(`[LiveAPI] 请求失败: ${config.url}`, error);
    return {};
  }
}

/**
 * 创建API轮询器
 */
export class LivePollingEngine {
  private intervalIds: Map<string, ReturnType<typeof setInterval>> = new Map();
  private updateCallback: (deviceId: string, values: Record<string, number>) => void;

  constructor(callback: (deviceId: string, values: Record<string, number>) => void) {
    this.updateCallback = callback;
  }

  /** 为设备启动轮询 */
  startPolling(deviceId: string, config: DataApiConfig, metrics: DataMetric[]) {
    this.stopPolling(deviceId);
    if (!config.enabled || !config.url || config.pollingInterval <= 0) return;

    const fetchAndUpdate = async () => {
      const values = await fetchLiveData(config, metrics);
      if (Object.keys(values).length > 0) {
        this.updateCallback(deviceId, values);
      }
    };

    // 立即执行一次
    fetchAndUpdate();

    // 定时轮询
    const id = setInterval(fetchAndUpdate, config.pollingInterval);
    this.intervalIds.set(deviceId, id);
  }

  /** 停止设备轮询 */
  stopPolling(deviceId: string) {
    const id = this.intervalIds.get(deviceId);
    if (id) {
      clearInterval(id);
      this.intervalIds.delete(deviceId);
    }
  }

  /** 停止所有轮询 */
  stopAll() {
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds.clear();
  }
}
