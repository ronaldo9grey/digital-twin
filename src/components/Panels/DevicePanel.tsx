// ==========================================
// 数字孪生系统 - 设备属性编辑面板
// ==========================================
import { useMemo } from 'react';
import { Card, Descriptions, Tag, InputNumber, Input, Button, Space, Empty, Progress, Typography, Popconfirm, Badge } from 'antd';
import {
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useAppStore, getDeviceTemplate } from '../../store';
import { DeviceStatus } from '../../types';

const { Text } = Typography;

/** 状态配置 */
const statusConfig: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
  [DeviceStatus.RUNNING]: { color: 'success', text: '运行中', icon: <CheckCircleOutlined /> },
  [DeviceStatus.STOPPED]: { color: 'default', text: '已停止', icon: <StopOutlined /> },
  [DeviceStatus.WARNING]: { color: 'warning', text: '预警', icon: <WarningOutlined /> },
  [DeviceStatus.ERROR]: { color: 'error', text: '故障', icon: <CloseCircleOutlined /> },
  [DeviceStatus.IDLE]: { color: 'processing', text: '空闲', icon: <ClockCircleOutlined /> },
};

/** 指标状态颜色 */
function getMetricColor(metric: { currentValue: number; normalMin: number; normalMax: number; warnMin?: number; warnMax?: number }): string {
  const { currentValue, normalMin, normalMax, warnMin, warnMax } = metric;
  if (warnMax !== undefined && currentValue > warnMax) return '#fc8181';
  if (warnMin !== undefined && currentValue < warnMin) return '#fc8181';
  if (currentValue > normalMax || currentValue < normalMin) return '#ecc94b';
  return '#48bb78';
}

/** 指标进度百分比 */
function getMetricPercent(metric: { currentValue: number; min: number; max: number }): number {
  return ((metric.currentValue - metric.min) / (metric.max - metric.min)) * 100;
}

/** 设备属性面板 */
export default function DevicePanel() {
  const selectedDeviceId = useAppStore((s) => s.selectedDeviceId);
  const devices = useAppStore((s) => s.devices);
  const updateDeviceName = useAppStore((s) => s.updateDeviceName);
  const updateDevicePosition = useAppStore((s) => s.updateDevicePosition);
  const updateDeviceRotation = useAppStore((s) => s.updateDeviceRotation);
  const updateDeviceStatus = useAppStore((s) => s.updateDeviceStatus);
  const removeDevice = useAppStore((s) => s.removeDevice);
  const setActivePanel = useAppStore((s) => s.setActivePanel);

  const device = useMemo(
    () => devices.find((d) => d.id === selectedDeviceId),
    [devices, selectedDeviceId]
  );

  const template = useMemo(
    () => (device ? getDeviceTemplate(device.templateId) : null),
    [device]
  );

  if (!device || !template) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty description="请点击场景中的设备查看详情" />
      </div>
    );
  }

  const statusInfo = statusConfig[device.status];

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '0 4px' }}>
      {/* 设备头部 */}
      <Card size="small" style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Input
              value={device.name}
              onChange={(e) => updateDeviceName(device.id, e.target.value)}
              variant="borderless"
              style={{ fontSize: 16, fontWeight: 'bold', width: 180, padding: 0 }}
            />
            <br />
            <Tag color={statusInfo.color} style={{ marginTop: 4 }}>
              {statusInfo.icon} {statusInfo.text}
            </Tag>
          </div>
          <Popconfirm
            title="确认删除此设备？"
            onConfirm={() => {
              removeDevice(device.id);
              setActivePanel('template');
            }}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </div>
      </Card>

      {/* 状态控制 */}
      <Card size="small" title="状态控制" style={{ marginBottom: 8 }}>
        <Space wrap>
          {Object.values(DeviceStatus).map((status) => (
            <Button
              key={status}
              size="small"
              type={device.status === status ? 'primary' : 'default'}
              onClick={() => updateDeviceStatus(device.id, status)}
              style={{
                borderColor: statusConfig[status].color === 'success' ? '#48bb78' :
                  statusConfig[status].color === 'error' ? '#fc8181' :
                  statusConfig[status].color === 'warning' ? '#ecc94b' : undefined,
              }}
            >
              {statusConfig[status].icon} {statusConfig[status].text}
            </Button>
          ))}
        </Space>
      </Card>

      {/* 位置编辑 */}
      <Card size="small" title="位置与旋转" style={{ marginBottom: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>X 位置</Text>
            <InputNumber
              size="small"
              value={device.position.x}
              onChange={(v) => v !== null && updateDevicePosition(device.id, { ...device.position, x: v })}
              style={{ width: '100%' }}
              step={0.5}
            />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>Y 位置</Text>
            <InputNumber
              size="small"
              value={device.position.y}
              onChange={(v) => v !== null && updateDevicePosition(device.id, { ...device.position, y: v })}
              style={{ width: '100%' }}
              step={0.5}
            />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>Z 位置</Text>
            <InputNumber
              size="small"
              value={device.position.z}
              onChange={(v) => v !== null && updateDevicePosition(device.id, { ...device.position, z: v })}
              style={{ width: '100%' }}
              step={0.5}
            />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>X 旋转</Text>
            <InputNumber
              size="small"
              value={Math.round(device.rotation.x * 180 / Math.PI)}
              onChange={(v) => v !== null && updateDeviceRotation(device.id, { ...device.rotation, x: v * Math.PI / 180 })}
              style={{ width: '100%' }}
              step={15}
              addonAfter="°"
            />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>Y 旋转</Text>
            <InputNumber
              size="small"
              value={Math.round(device.rotation.y * 180 / Math.PI)}
              onChange={(v) => v !== null && updateDeviceRotation(device.id, { ...device.rotation, y: v * Math.PI / 180 })}
              style={{ width: '100%' }}
              step={15}
              addonAfter="°"
            />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>Z 旋转</Text>
            <InputNumber
              size="small"
              value={Math.round(device.rotation.z * 180 / Math.PI)}
              onChange={(v) => v !== null && updateDeviceRotation(device.id, { ...device.rotation, z: v * Math.PI / 180 })}
              style={{ width: '100%' }}
              step={15}
              addonAfter="°"
            />
          </div>
        </div>
      </Card>

      {/* 实时数据 */}
      <Card size="small" title="📊 实时监测数据" style={{ marginBottom: 8 }}>
        {device.metrics.map((metric) => {
          const color = getMetricColor(metric);
          const percent = getMetricPercent(metric);
          return (
            <div key={metric.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 12 }}>{metric.name}</Text>
                <Text strong style={{ fontSize: 13, color }}>
                  {metric.currentValue} {metric.unit}
                </Text>
              </div>
              <Progress
                percent={Math.min(100, Math.max(0, percent))}
                showInfo={false}
                strokeColor={color}
                trailColor="#edf2f7"
                size="small"
                style={{ marginTop: 2 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 10 }}>
                  正常: {metric.normalMin}~{metric.normalMax} {metric.unit}
                </Text>
                {(metric.warnMin !== undefined || metric.warnMax !== undefined) && (
                  <Text type="secondary" style={{ fontSize: 10 }}>
                    预警: {metric.warnMin ?? '—'}~{metric.warnMax ?? '—'}
                  </Text>
                )}
              </div>
            </div>
          );
        })}
      </Card>

      {/* 设备信息 */}
      <Card size="small" title="设备信息">
        <Descriptions size="small" column={1}>
          <Descriptions.Item label="模板ID">{device.templateId}</Descriptions.Item>
          <Descriptions.Item label="实例ID">{device.id.slice(0, 8)}...</Descriptions.Item>
          <Descriptions.Item label="指标数量">{device.metrics.length}</Descriptions.Item>
          <Descriptions.Item label="API状态">
            <Badge
              status={device.apiConfig.enabled ? 'success' : 'default'}
              text={device.apiConfig.enabled ? '已配置' : '未配置'}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
