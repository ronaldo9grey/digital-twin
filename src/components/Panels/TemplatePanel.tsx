// ==========================================
// 数字孪生系统 - 模板选择面板
// ==========================================
import { useMemo } from 'react';
import { Card, Tabs, Tag, Empty, Typography } from 'antd';
import {
  HomeOutlined,
  ShopOutlined,
  ThunderboltOutlined,
  SwapOutlined,
  RobotOutlined,
  CarOutlined,
  BuildOutlined,
  ToolOutlined,
  DashboardOutlined,
  LineChartOutlined,
  CloudOutlined,
  ApartmentOutlined,
  ExperimentOutlined,
  ControlOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAppStore, factoryTemplates, deviceTemplates } from '../../store';
import { DeviceCategory } from '../../types';
import type { DeviceTemplate, FactoryTemplate } from '../../types';

const { Text, Paragraph } = Typography;

/** 图标映射 */
const iconMap: Record<string, React.ReactNode> = {
  HomeOutlined: <HomeOutlined />,
  ShopOutlined: <ShopOutlined />,
  ThunderboltOutlined: <ThunderboltOutlined />,
  SwapOutlined: <SwapOutlined />,
  RobotOutlined: <RobotOutlined />,
  CarOutlined: <CarOutlined />,
  BuildOutlined: <BuildOutlined />,
  ToolOutlined: <ToolOutlined />,
  DashboardOutlined: <DashboardOutlined />,
  LineChartOutlined: <LineChartOutlined />,
  CloudOutlined: <CloudOutlined />,
  ApartmentOutlined: <ApartmentOutlined />,
  ExperimentOutlined: <ExperimentOutlined />,
  ControlOutlined: <ControlOutlined />,
};

/** 类别标签颜色 */
const categoryColors: Record<string, string> = {
  [DeviceCategory.PRODUCTION]: '#ed8936',
  [DeviceCategory.SENSOR]: '#48bb78',
  [DeviceCategory.ENERGY]: '#4299e1',
};

/** 类别名称 */
const categoryNames: Record<string, string> = {
  [DeviceCategory.PRODUCTION]: '产线设备',
  [DeviceCategory.SENSOR]: '传感器/仪表',
  [DeviceCategory.ENERGY]: '能源/动力',
};

/** 工厂模板卡片 */
function FactoryTemplateCard({ template }: { template: FactoryTemplate }) {
  const loadFactoryTemplate = useAppStore((s) => s.loadFactoryTemplate);
  const factoryTemplateId = useAppStore((s) => s.factoryTemplateId);

  return (
    <Card
      hoverable
      size="small"
      style={{
        border: factoryTemplateId === template.id ? '2px solid #4299e1' : '1px solid #e2e8f0',
        marginBottom: 8,
      }}
      onClick={() => loadFactoryTemplate(template.id)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #4299e1, #2b6cb0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 20,
          }}
        >
          {iconMap[template.icon] || <HomeOutlined />}
        </div>
        <div style={{ flex: 1 }}>
          <Text strong style={{ fontSize: 13 }}>{template.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {template.devices.length} 台设备 · {template.floorSize.width}×{template.floorSize.depth}m
          </Text>
        </div>
      </div>
      <Paragraph
        type="secondary"
        ellipsis={{ rows: 2 }}
        style={{ fontSize: 11, marginTop: 8, marginBottom: 0 }}
      >
        {template.description}
      </Paragraph>
    </Card>
  );
}

/** 设备模板卡片 */
function DeviceTemplateCard({ template }: { template: DeviceTemplate }) {
  const addDevice = useAppStore((s) => s.addDevice);

  return (
    <Card
      hoverable
      size="small"
      style={{ marginBottom: 8, border: '1px solid #e2e8f0' }}
      onClick={() => addDevice(template.id)}
      actions={[
        <PlusOutlined key="add" title="添加到场景" />,
      ]}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: template.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 18,
          }}
        >
          {iconMap[template.icon] || <ToolOutlined />}
        </div>
        <div style={{ flex: 1 }}>
          <Text strong style={{ fontSize: 13 }}>{template.name}</Text>
          <br />
          <Tag
            color={categoryColors[template.category]}
            style={{ fontSize: 10, marginTop: 2, padding: '0 4px' }}
          >
            {categoryNames[template.category]}
          </Tag>
        </div>
      </div>
      <Paragraph
        type="secondary"
        ellipsis={{ rows: 2 }}
        style={{ fontSize: 11, marginTop: 8, marginBottom: 0 }}
      >
        {template.description}
      </Paragraph>
      <div style={{ marginTop: 6 }}>
        <Text type="secondary" style={{ fontSize: 10 }}>
          监测指标：{template.metrics.map((m) => m.name).join('、')}
        </Text>
      </div>
    </Card>
  );
}

/** 模板选择面板 */
export default function TemplatePanel() {
  const templateCategory = useAppStore((s) => s.templateCategory);
  const setTemplateCategory = useAppStore((s) => s.setTemplateCategory);

  const filteredDevices = useMemo(() => {
    if (templateCategory === 'all') return deviceTemplates;
    return deviceTemplates.filter((t) => t.category === templateCategory);
  }, [templateCategory]);

  const tabItems = [
    { key: 'factory', label: '🏭 工厂模板', children: null },
    { key: 'all', label: '📋 全部设备', children: null },
    { key: DeviceCategory.PRODUCTION, label: '⚙️ 产线设备', children: null },
    { key: DeviceCategory.SENSOR, label: '📡 传感器', children: null },
    { key: DeviceCategory.ENERGY, label: '⚡ 能源动力', children: null },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        activeKey={templateCategory}
        onChange={(key) => setTemplateCategory(key as typeof templateCategory)}
        size="small"
        items={tabItems}
        style={{ marginBottom: 0 }}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 4px' }}>
        {templateCategory === 'factory' ? (
          factoryTemplates.length > 0 ? (
            factoryTemplates.map((t) => <FactoryTemplateCard key={t.id} template={t} />)
          ) : (
            <Empty description="暂无工厂模板" />
          )
        ) : filteredDevices.length > 0 ? (
          filteredDevices.map((t) => <DeviceTemplateCard key={t.id} template={t} />)
        ) : (
          <Empty description="暂无设备模板" />
        )}
      </div>
    </div>
  );
}
