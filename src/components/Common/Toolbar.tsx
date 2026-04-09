// ==========================================
// 数字孪生系统 - 顶部工具栏
// ==========================================
import { useCallback } from 'react';
import { Button, Space, Tag, Tooltip, Typography } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../store';
import { dataService } from '../../services';

const { Text } = Typography;

export default function Toolbar() {
  const isPlaying = useAppStore((s) => s.isPlaying);
  const dataMode = useAppStore((s) => s.dataMode);
  const devices = useAppStore((s) => s.devices);
  const clearScene = useAppStore((s) => s.clearScene);

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      dataService.stop();
      useAppStore.setState({ isPlaying: false });
    } else {
      dataService.start();
    }
  }, [isPlaying]);

  const runningCount = devices.filter((d) => d.status === 'running').length;
  const warningCount = devices.filter((d) => d.status === 'warning' || d.status === 'error').length;

  return (
    <div
      style={{
        height: 48,
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
      }}
    >
      {/* 左侧 - 标题 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Text strong style={{ fontSize: 16, color: '#2d3748' }}>
          🏭 数字孪生系统
        </Text>
        <Tag color={dataMode === 'demo' ? 'blue' : 'green'}>
          {dataMode === 'demo' ? 'Demo模式' : '实时模式'}
        </Tag>
        {isPlaying && (
          <Tag color="success" icon={<PlayCircleOutlined />}>
            运行中
          </Tag>
        )}
      </div>

      {/* 中间 - 统计信息 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          设备总数: <Text strong>{devices.length}</Text>
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          运行中: <Text strong style={{ color: '#48bb78' }}>{runningCount}</Text>
        </Text>
        {warningCount > 0 && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            预警: <Text strong style={{ color: '#fc8181' }}>{warningCount}</Text>
          </Text>
        )}
      </div>

      {/* 右侧 - 操作按钮 */}
      <Space>
        <Tooltip title={isPlaying ? '暂停数据更新' : '启动数据更新'}>
          <Button
            type={isPlaying ? 'default' : 'primary'}
            size="small"
            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={handleTogglePlay}
            danger={isPlaying}
          >
            {isPlaying ? '暂停' : '启动'}
          </Button>
        </Tooltip>

        <Tooltip title="清空场景">
          <Button
            size="small"
            icon={<ClearOutlined />}
            onClick={() => {
              dataService.stop();
              clearScene();
            }}
          >
            清空
          </Button>
        </Tooltip>
      </Space>
    </div>
  );
}
