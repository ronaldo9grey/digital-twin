// ==========================================
// 数字孪生系统 - 主应用组件
// ==========================================
import { useEffect } from 'react';
import { ConfigProvider, theme, Layout } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import {
  AppstoreOutlined,
  ToolOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useAppStore } from './store';
import { dataService } from './services';
import TwinScene from './components/Scene/TwinScene';
import TemplatePanel from './components/Panels/TemplatePanel';
import DevicePanel from './components/Panels/DevicePanel';
import DataPanel from './components/Panels/DataPanel';
import Toolbar from './components/Common/Toolbar';
import './App.css';

const { Sider, Content } = Layout;

function App() {
  const activePanel = useAppStore((s) => s.activePanel);
  const setActivePanel = useAppStore((s) => s.setActivePanel);

  // 初始化数据服务
  useEffect(() => {
    dataService.init();
    return () => {
      dataService.stop();
    };
  }, []);

  const siderItems = [
    { key: 'template', icon: <AppstoreOutlined />, label: '模板库' },
    { key: 'device', icon: <ToolOutlined />, label: '设备属性' },
    { key: 'data', icon: <DatabaseOutlined />, label: '数据配置' },
  ];

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#4299e1',
          borderRadius: 6,
          fontSize: 13,
        },
      }}
    >
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        {/* 顶部工具栏 */}
        <Toolbar />

        <Layout>
          {/* 左侧面板 */}
          <Sider
            width={320}
            theme="light"
            style={{
              borderRight: '1px solid #e2e8f0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* 面板切换标签 */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #e2e8f0',
                flexShrink: 0,
              }}
            >
              {siderItems.map((item) => (
                <div
                  key={item.key}
                  onClick={() => setActivePanel(item.key as typeof activePanel)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px 0',
                    cursor: 'pointer',
                    fontSize: 12,
                    color: activePanel === item.key ? '#4299e1' : '#718096',
                    borderBottom: activePanel === item.key ? '2px solid #4299e1' : '2px solid transparent',
                    background: activePanel === item.key ? '#ebf8ff' : 'transparent',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}
                >
                  {item.icon}
                  {item.label}
                </div>
              ))}
            </div>

            {/* 面板内容 */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
              {activePanel === 'template' && <TemplatePanel />}
              {activePanel === 'device' && <DevicePanel />}
              {activePanel === 'data' && <DataPanel />}
            </div>
          </Sider>

          {/* 3D场景 */}
          <Content style={{ position: 'relative', overflow: 'hidden' }}>
            <TwinScene />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
