// ==========================================
// 数字孪生系统 - 数据接口配置面板
// ==========================================
import { useMemo, useCallback } from 'react';
import { Card, Form, Input, Select, Switch, InputNumber, Button, Typography, Divider, Alert, Space, Tag, Empty, List } from 'antd';
import {
  ApiOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../store';
import { dataService } from '../../services';
import { DataMode } from '../../types';
import type { DataApiConfig } from '../../types';

const { Text } = Typography;

/** 数据接口配置面板 */
export default function DataPanel() {
  const devices = useAppStore((s) => s.devices);
  const selectedDeviceId = useAppStore((s) => s.selectedDeviceId);
  const dataMode = useAppStore((s) => s.dataMode);
  const isPlaying = useAppStore((s) => s.isPlaying);
  const setDataMode = useAppStore((s) => s.setDataMode);

  const selectedDevice = useMemo(
    () => devices.find((d) => d.id === selectedDeviceId),
    [devices, selectedDeviceId]
  );

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      dataService.stop();
      useAppStore.setState({ isPlaying: false });
    } else {
      dataService.start();
    }
  }, [isPlaying]);

  const handleModeSwitch = useCallback(
    (mode: DataMode) => {
      dataService.stop();
      setDataMode(mode);
    },
    [setDataMode]
  );

  const handleApiConfigChange = useCallback(
    (field: keyof DataApiConfig, value: any) => {
      if (!selectedDevice) return;
      const newConfig = { ...selectedDevice.apiConfig, [field]: value };
      useAppStore.getState().updateDeviceApiConfig(selectedDevice.id, newConfig);
    },
    [selectedDevice]
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '0 4px' }}>
      {/* 数据模式切换 */}
      <Card size="small" title="📡 数据模式" style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Button
            type={dataMode === DataMode.DEMO ? 'primary' : 'default'}
            icon={<PlayCircleOutlined />}
            onClick={() => handleModeSwitch(DataMode.DEMO)}
            style={{ flex: 1 }}
          >
            Demo模式
          </Button>
          <Button
            type={dataMode === DataMode.LIVE ? 'primary' : 'default'}
            icon={<ApiOutlined />}
            onClick={() => handleModeSwitch(DataMode.LIVE)}
            style={{ flex: 1 }}
          >
            实时模式
          </Button>
        </div>

        {dataMode === DataMode.DEMO && (
          <Alert
            message="Demo模式使用模拟数据，无需连接真实设备即可体验系统功能"
            type="info"
            showIcon
            style={{ fontSize: 12 }}
          />
        )}
        {dataMode === DataMode.LIVE && (
          <Alert
            message="实时模式将从配置的API接口获取真实数据，请确保设备已正确配置数据接口"
            type="warning"
            showIcon
            style={{ fontSize: 12 }}
          />
        )}

        {/* 运行控制 */}
        <Divider style={{ margin: '12px 0 8px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            {isPlaying ? (
              <Tag color="success" icon={<CheckCircleOutlined />}>运行中</Tag>
            ) : (
              <Tag icon={<PauseCircleOutlined />}>已暂停</Tag>
            )}
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dataMode === DataMode.DEMO ? '模拟数据更新中' : '实时数据采集中'}
            </Text>
          </Space>
          <Button
            type={isPlaying ? 'default' : 'primary'}
            danger={isPlaying}
            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={handleTogglePlay}
          >
            {isPlaying ? '停止' : '启动'}
          </Button>
        </div>
      </Card>

      {/* 设备API配置 */}
      <Card
        size="small"
        title="🔗 设备数据接口配置"
        style={{ marginBottom: 8 }}
        extra={
          selectedDevice ? (
            <Tag color={selectedDevice.apiConfig.enabled ? 'success' : 'default'}>
              {selectedDevice.apiConfig.enabled ? '已启用' : '未启用'}
            </Tag>
          ) : null
        }
      >
        {!selectedDevice ? (
          <Empty description="请先选择一个设备" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Form layout="vertical" size="small">
            <Form.Item label="启用API数据">
              <Switch
                checked={selectedDevice.apiConfig.enabled}
                onChange={(v) => handleApiConfigChange('enabled', v)}
              />
            </Form.Item>

            <Form.Item label="API地址">
              <Input
                placeholder="https://api.example.com/device/data"
                value={selectedDevice.apiConfig.url}
                onChange={(e) => handleApiConfigChange('url', e.target.value)}
              />
            </Form.Item>

            <Form.Item label="请求方法">
              <Select
                value={selectedDevice.apiConfig.method}
                onChange={(v) => handleApiConfigChange('method', v)}
                options={[
                  { label: 'GET', value: 'GET' },
                  { label: 'POST', value: 'POST' },
                  { label: 'PUT', value: 'PUT' },
                  { label: 'WEBSOCKET', value: 'WEBSOCKET' },
                ]}
              />
            </Form.Item>

            <Form.Item label="轮询间隔 (ms)">
              <InputNumber
                min={0}
                max={60000}
                step={500}
                value={selectedDevice.apiConfig.pollingInterval}
                onChange={(v) => v !== null && handleApiConfigChange('pollingInterval', v)}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item label="数据取值路径">
              <Input
                placeholder="data.sensors"
                value={selectedDevice.apiConfig.dataPath}
                onChange={(e) => handleApiConfigChange('dataPath', e.target.value)}
              />
              <Text type="secondary" style={{ fontSize: 10 }}>
                从API响应JSON中提取数据的路径，如 data.temperature
              </Text>
            </Form.Item>

            <Form.Item label="请求头 (JSON)">
              <Input.TextArea
                rows={2}
                placeholder='{"Authorization": "Bearer token"}'
                value={selectedDevice.apiConfig.headers ? JSON.stringify(selectedDevice.apiConfig.headers, null, 2) : ''}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value);
                    handleApiConfigChange('headers', headers);
                  } catch {
                    // JSON解析失败时忽略
                  }
                }}
              />
            </Form.Item>

            <Form.Item label="请求体模板">
              <Input.TextArea
                rows={2}
                placeholder='{"deviceId": "xxx"}'
                value={selectedDevice.apiConfig.body || ''}
                onChange={(e) => handleApiConfigChange('body', e.target.value)}
              />
            </Form.Item>

            <Divider style={{ margin: '8px 0' }} />

            <Text strong style={{ fontSize: 13 }}>字段映射</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 10 }}>
              将API返回字段映射到设备指标
            </Text>

            {selectedDevice.metrics.map((metric) => (
              <div key={metric.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                <Text style={{ fontSize: 12, width: 80, flexShrink: 0 }}>{metric.name}</Text>
                <Input
                  size="small"
                  placeholder="API字段名"
                  value={selectedDevice.apiConfig.mapping?.[metric.id] || ''}
                  onChange={(e) => {
                    const newMapping = {
                      ...selectedDevice.apiConfig.mapping,
                      [metric.id]: e.target.value,
                    };
                    handleApiConfigChange('mapping', newMapping);
                  }}
                />
                <Text type="secondary" style={{ fontSize: 10, flexShrink: 0 }}>
                  {metric.unit}
                </Text>
              </div>
            ))}
          </Form>
        )}
      </Card>

      {/* 设备列表概览 */}
      <Card size="small" title="📋 设备数据概览">
        <List
          size="small"
          dataSource={devices}
          renderItem={(device) => (
            <List.Item
              style={{ padding: '6px 0', cursor: 'pointer' }}
              onClick={() => useAppStore.getState().selectDevice(device.id)}
            >
              <List.Item.Meta
                avatar={
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background:
                        device.status === 'running' ? '#48bb78' :
                        device.status === 'warning' ? '#ecc94b' :
                        device.status === 'error' ? '#fc8181' : '#a0aec0',
                    }}
                  />
                }
                title={<Text style={{ fontSize: 12 }}>{device.name}</Text>}
                description={
                  <Text type="secondary" style={{ fontSize: 10 }}>
                    {device.metrics.slice(0, 2).map((m) => `${m.name}: ${m.currentValue}${m.unit}`).join(' | ')}
                  </Text>
                }
              />
              <Tag
                color={device.apiConfig.enabled ? 'blue' : 'default'}
                style={{ fontSize: 10 }}
              >
                {device.apiConfig.enabled ? 'API' : 'Demo'}
              </Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
