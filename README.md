# 🏭 数字孪生系统 (Digital Twin System)

基于 React + Three.js + TypeScript 的工厂数字孪生可视化平台。

## 功能特性

- 🏭 **工厂模板** — 内置智能制造工厂、生产车间、能源监控站等预设布局
- ⚙️ **设备模板** — 产线设备、传感器/仪表、能源动力设备共13种
- 🎮 **3D可视化** — Three.js交互式3D场景，支持旋转、缩放、漫游
- 📊 **实时监测** — 设备状态、运行参数实时展示
- 🔗 **数据接口** — 可视化配置API接口，支持字段映射
- 🔄 **Demo模式** — 内置模拟数据引擎，无需真实设备即可演示

## 技术栈

- React 19 + TypeScript
- Three.js + @react-three/fiber + @react-three/drei
- Zustand 状态管理
- Ant Design 5
- Vite 构建

## 本地开发

```bash
npm install
npm run dev
```

## 构建部署

```bash
npm run build
# 构建产物在 dist/ 目录
```

## 自动部署

推送代码到 GitHub 后，Webhook 自动触发服务器拉取构建部署。
