// ==========================================
// 数字孪生系统 - 3D场景主组件
// ==========================================
import { useRef, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store';
import { getDeviceTemplate } from '../../templates/devices';
import { getFactoryTemplate } from '../../templates/factories';
import { DeviceStatus } from '../../types';
import type { DeviceInstance, GeometryPart } from '../../types';
import {
  OfficeBuilding,
  FactoryHall,
  Chimney,
  StorageTank,
  SphereTank,
  PipeSegment,
  PowerLine,
  Road,
  GreenArea,
  CoalYard,
  DesulfurizationTower,
  ElectrostaticPrecipitator,
  TransformerStation,
  CoalConveyorBelt,
  WaterTreatment,
  AshSilo,
  StackerReclaimer,
  BeltCorridor,
  TruckScale,
  CoalTruck,
  CoolingTowerEnhanced,
} from './FactoryBuildings';
import FactoryEnvironment from './FactoryEnvironment';
import FactoryInterior from './FactoryInterior';

// ==================== 设备3D渲染组件 ====================

/** 渲染单个几何体部件 */
function GeometryPartMesh({ part, statusColor }: { part: GeometryPart; statusColor: string }) {
  const geometry = useMemo(() => {
    switch (part.type) {
      case 'box':
        return new THREE.BoxGeometry(part.params.width, part.params.height, part.params.depth);
      case 'cylinder':
        return new THREE.CylinderGeometry(part.params.radius, part.params.radius, part.params.height, 32);
      case 'sphere':
        return new THREE.SphereGeometry(part.params.radius, 32, 32);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [part]);

  const isIndicator = ['led', 'indicator1', 'indicator2', 'indicator3', 'screen', 'display'].includes(part.id);

  return (
    <mesh
      geometry={geometry}
      position={[part.position.x, part.position.y, part.position.z]}
      rotation={[part.rotation.x, part.rotation.y, part.rotation.z]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={isIndicator ? statusColor : part.color}
        metalness={part.metalness ?? 0.3}
        roughness={part.roughness ?? 0.6}
      />
    </mesh>
  );
}

/** 渲染单个设备（支持拖拽） */
function DeviceMesh({ device }: { device: DeviceInstance }) {
  const template = getDeviceTemplate(device.templateId);
  const selectDevice = useAppStore((s) => s.selectDevice);
  const selectedDeviceId = useAppStore((s) => s.selectedDeviceId);
  const updateDevicePosition = useAppStore((s) => s.updateDevicePosition);
  const meshRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const intersection = useMemo(() => new THREE.Vector3(), []);
  const offset = useMemo(() => new THREE.Vector3(), []);
  const { raycaster, gl } = useThree();
  const [, setHovered] = useState(false);

  if (!template) return null;

  const isSelected = selectedDeviceId === device.id;
  const statusColor = template.statusColors[device.status] || '#a0aec0';
  const maxY = template.geometry.parts ? Math.max(...template.geometry.parts.map(p => p.position.y + (p.params.height || 0))) : 1.5;

  // 设备动画（运行状态时轻微浮动，拖拽时不浮动）
  useFrame((state) => {
    if (meshRef.current && device.status === DeviceStatus.RUNNING && !isDragging.current) {
      meshRef.current.position.y = device.position.y + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  /** 鼠标按下：选中设备，准备拖拽 */
  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      selectDevice(device.id);

      // 如果设备已被选中，开始拖拽
      if (selectedDeviceId === device.id) {
        isDragging.current = true;
        raycaster.ray.intersectPlane(plane, intersection);
        offset.copy(intersection).sub(new THREE.Vector3(device.position.x, 0, device.position.z));
        gl.domElement.style.cursor = 'grabbing';
      }
    },
    [device.id, device.position, selectedDeviceId, selectDevice, raycaster, plane, intersection, offset, gl]
  );

  /** 鼠标移动：拖拽设备在地面上移动 */
  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!isDragging.current || !meshRef.current) return;

      e.stopPropagation();
      raycaster.ray.intersectPlane(plane, intersection);
      const targetX = intersection.x - offset.x;
      const targetZ = intersection.z - offset.z;
      meshRef.current.position.x = targetX;
      meshRef.current.position.z = targetZ;
    },
    [raycaster, plane, intersection, offset]
  );

  /** 鼠标抬起：结束拖拽，更新store */
  const handlePointerUp = useCallback(() => {
    if (isDragging.current && meshRef.current) {
      isDragging.current = false;
      gl.domElement.style.cursor = '';
      updateDevicePosition(device.id, {
        x: meshRef.current.position.x,
        y: device.position.y,
        z: meshRef.current.position.z,
      });
    }
  }, [device.id, device.position.y, updateDevicePosition, gl]);

  return (
    <group
      ref={meshRef}
      position={[device.position.x, device.position.y, device.position.z]}
      rotation={[device.rotation.x, device.rotation.y, device.rotation.z]}
      scale={[device.scale.x, device.scale.y, device.scale.z]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOver={() => { setHovered(true); gl.domElement.style.cursor = isSelected ? 'grab' : 'pointer'; }}
      onPointerOut={() => { setHovered(false); if (!isDragging.current) gl.domElement.style.cursor = ''; }}
    >
      {/* 渲染设备几何体 */}
      {template.geometry.parts?.map((part) => (
        <GeometryPartMesh key={part.id} part={part} statusColor={statusColor} />
      ))}

      {/* 选中高亮边框 */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[3, 3, 3]} />
          <meshBasicMaterial color="#4299e1" wireframe transparent opacity={0.3} />
        </mesh>
      )}

      {/* 设备名称标签 */}
      <Html
        position={[0, maxY + 0.5, 0]}
        center
        distanceFactor={15}
        style={{
          background: 'rgba(0,0,0,0.75)',
          color: '#fff',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          border: isSelected ? '1px solid #4299e1' : '1px solid transparent',
        }}
      >
        {device.name}
      </Html>

      {/* 状态指示灯 */}
      <mesh position={[0, maxY + 0.2, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={device.status === DeviceStatus.RUNNING ? 0.8 : 0.3}
        />
      </mesh>
    </group>
  );
}

// ==================== 相机距离检测 ====================

/** 检测相机是否在指定区域内的 hook */
function useCameraProximity(center: [number, number, number], radius: number): boolean {
  const { camera } = useThree();
  const [isInside, setIsInside] = useState(false);
  const centerVec = useMemo(() => new THREE.Vector3(...center), [center]);

  useFrame(() => {
    const dist = camera.position.distanceTo(centerVec);
    setIsInside(dist < radius);
  });

  return isInside;
}

// ==================== X光透视厂房组件 ====================

/** XRayFactoryHall - 包裹 FactoryHall，根据相机距离控制墙壁和屋顶透明度 */
function XRayFactoryHall({
  position = [0, 0, 0],
  width = 20,
  depth = 12,
  isInside,
}: {
  position?: [number, number, number];
  width?: number;
  depth?: number;
  isInside: boolean;
}) {
  // 当前透明度（使用 ref 避免每帧触发重渲染）
  const wallOpacityRef = useRef(0.85);
  const roofOpacityRef = useRef(0.85);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    // 目标透明度：内部模式 vs 外部模式
    const targetWall = isInside ? 0.1 : 0.85;
    const targetRoof = isInside ? 0.05 : 0.85;

    // 使用 lerp 插值平滑过渡
    wallOpacityRef.current += (targetWall - wallOpacityRef.current) * 0.05;
    roofOpacityRef.current += (targetRoof - roofOpacityRef.current) * 0.05;

    // 遍历子 mesh，更新材质透明度
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material;
          if (mat instanceof THREE.MeshStandardMaterial) {
            // 根据颜色判断是墙壁还是屋顶
            if (mat.color.getHexString() === 'e8e8e8') {
              // 墙壁材质
              mat.transparent = true;
              mat.opacity = wallOpacityRef.current;
              mat.needsUpdate = true;
            } else if (mat.color.getHexString() === '4a6fa5') {
              // 屋顶材质（蓝色）
              mat.transparent = true;
              mat.opacity = roofOpacityRef.current;
              mat.needsUpdate = true;
            }
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <FactoryHall position={position} width={width} depth={depth} />
    </group>
  );
}

// ==================== 工厂地面和墙壁 ====================

/** 火力发电厂精细场景布局（80x60） */
function ThermalPowerPlantScene() {
  // 检测相机是否在主厂房和锅炉房附近
  const isMainHallInside = useCameraProximity([0, 0, 0], 18);
  const isBoilerHallInside = useCameraProximity([0, 0, -12], 15);

  // 任意一个厂房进入内部模式
  const isInside = isMainHallInside || isBoilerHallInside;

  return (
    <>
      {/* 精细环境渲染（天空、草地、光照、雾效） */}
      <FactoryEnvironment floorSize={{ width: 80, depth: 60 }} />

      {/* ===== 主厂房区 ===== */}
      {/* 锅炉房 - 中后方 */}
      <XRayFactoryHall position={[0, 0, -12]} width={20} depth={12} isInside={isBoilerHallInside} />
      <FactoryInterior position={[0, 0, -12]} width={20} depth={12} visible={isBoilerHallInside} />

      {/* 汽机房 - 中心 */}
      <XRayFactoryHall position={[0, 0, 0]} width={22} depth={14} isInside={isMainHallInside} />
      <FactoryInterior position={[0, 0, 0]} width={22} depth={14} visible={isMainHallInside} />

      {/* 除氧间 - 汽机房后方连接 */}
      <FactoryHall position={[0, 0, 8]} width={10} depth={5} height={6} />

      {/* ===== 烟囱区 ===== */}
      <Chimney position={[8, 0, -22]} />
      <Chimney position={[12, 0, -22]} />

      {/* 除尘器 x2 */}
      <ElectrostaticPrecipitator position={[12, 0, -15]} />
      <ElectrostaticPrecipitator position={[16, 0, -15]} />

      {/* 脱硫塔 */}
      <DesulfurizationTower position={[15, 0, -10]} />

      {/* ===== 冷却设施区 ===== */}
      <CoolingTowerEnhanced position={[18, 0, 0]} />
      <CoolingTowerEnhanced position={[18, 0, -8]} />

      {/* ===== 燃料设施区 ===== */}
      {/* 煤场 */}
      <CoalYard position={[-25, 0, -20]} width={20} depth={15} />

      {/* 输煤栈桥 - 煤场到锅炉房 */}
      <CoalConveyorBelt position={[-15, 0, -18]} rotation={[0, 0, 0]} length={12} height={6} />
      <CoalConveyorBelt position={[-8, 0, -15]} rotation={[0, -Math.PI/6, 0]} length={10} height={7} />

      {/* ===== 煤场增强 ===== */}
      {/* 斗轮堆取料机 - 在煤场内 */}
      <StackerReclaimer position={[-25, 0, -18]} rotation={[0, Math.PI/4, 0]} />

      {/* 皮带廊桥 - 煤场到主厂房的封闭输煤通道 */}
      <BeltCorridor position={[-18, 0, -16]} rotation={[0, -Math.PI/6, 0]} length={15} height={7} />
      <BeltCorridor position={[-8, 0, -12]} rotation={[0, -Math.PI/8, 0]} length={10} height={8} />

      {/* 地磅 - 进厂道路旁 */}
      <TruckScale position={[-8, 0, 26]} />

      {/* 煤车 - 在地磅上和煤场旁 */}
      <CoalTruck position={[-8, 0, 26]} />
      <CoalTruck position={[-30, 0, -14]} rotation={[0, Math.PI/3, 0]} />
      <CoalTruck position={[-28, 0, -10]} rotation={[0, -Math.PI/6, 0]} />

      {/* ===== 配电设施区 ===== */}
      {/* 升压站 */}
      <TransformerStation position={[15, 0, 15]} count={4} />

      {/* 输电塔 */}
      <PowerLine position={[25, 0, 15]} />
      <PowerLine position={[30, 0, 10]} />

      {/* ===== 水处理设施 ===== */}
      <WaterTreatment position={[-20, 0, 15]} />

      {/* 储罐 */}
      <StorageTank position={[-15, 0, 10]} />
      <StorageTank position={[-15, 0, 5]} />
      <SphereTank position={[-18, 0, 0]} />

      {/* ===== 灰渣处理 ===== */}
      <AshSilo position={[-20, 0, 5]} />
      <AshSilo position={[-22, 0, 5]} />

      {/* ===== 管道网络 ===== */}
      {/* 锅炉到除尘器 */}
      <PipeSegment position={[8, 3, -18]} rotation={[0, 0, Math.PI/2]} length={6} />
      {/* 除尘器到脱硫塔 */}
      <PipeSegment position={[14, 3, -13]} rotation={[0, 0, Math.PI/2]} length={5} />
      {/* 汽机到冷却塔 */}
      <PipeSegment position={[12, 2, -4]} rotation={[0, 0, Math.PI/2]} length={8} bent />
      <PipeSegment position={[12, 2, 4]} rotation={[0, 0, Math.PI/2]} length={8} bent />

      {/* ===== 辅助建筑 ===== */}
      {/* 办公楼 */}
      <OfficeBuilding position={[0, 0, 22]} rotation={[0, Math.PI, 0]} floors={6} />

      {/* 主控楼 */}
      <OfficeBuilding position={[-5, 0, 15]} rotation={[0, Math.PI/2, 0]} floors={3} />

      {/* ===== 道路系统 ===== */}
      {/* 主道路 - 纵向贯穿 */}
      <Road position={[0, 0.02, 25]} width={6} length={60} />
      {/* 横向道路 - 连接各区域 */}
      <Road position={[-10, 0.02, 12]} rotation={[0, Math.PI/2, 0]} width={4} length={30} />
      <Road position={[10, 0.02, -5]} rotation={[0, Math.PI/2, 0]} width={4} length={40} />
      {/* 进厂道路 */}
      <Road position={[0, 0.02, 28]} width={8} length={10} />

      {/* ===== 绿化带 ===== */}
      <GreenArea position={[-35, 0.01, -20]} />
      <GreenArea position={[-35, 0.01, 0]} />
      <GreenArea position={[-35, 0.01, 20]} />
      <GreenArea position={[30, 0.01, -20]} />
      <GreenArea position={[30, 0.01, 5]} />
      <GreenArea position={[30, 0.01, 22]} />
      <GreenArea position={[-10, 0.01, 25]} />
      <GreenArea position={[10, 0.01, 25]} />

      {/* ===== 围墙 - 厂区四周 ===== */}
      {/* 北围墙 */}
      <mesh position={[0, 1.5, -30]}>
        <boxGeometry args={[80, 3, 0.2]} />
        <meshStandardMaterial color="#808080" transparent opacity={0.3} />
      </mesh>
      {/* 南围墙 */}
      <mesh position={[0, 1.5, 30]}>
        <boxGeometry args={[80, 3, 0.2]} />
        <meshStandardMaterial color="#808080" transparent opacity={0.3} />
      </mesh>
      {/* 东围墙 */}
      <mesh position={[40, 1.5, 0]} rotation={[0, Math.PI/2, 0]}>
        <boxGeometry args={[60, 3, 0.2]} />
        <meshStandardMaterial color="#808080" transparent opacity={0.3} />
      </mesh>
      {/* 西围墙 */}
      <mesh position={[-40, 1.5, 0]} rotation={[0, Math.PI/2, 0]}>
        <boxGeometry args={[60, 3, 0.2]} />
        <meshStandardMaterial color="#808080" transparent opacity={0.3} />
      </mesh>
      {/* 大门 - 南围墙中间 */}
      <mesh position={[0, 3, 30]}>
        <boxGeometry args={[8, 6, 0.5]} />
        <meshStandardMaterial color="#4a5568" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* 门柱 x2 */}
      <mesh position={[-5, 3.5, 30]}>
        <boxGeometry args={[1, 7, 1]} />
        <meshStandardMaterial color="#718096" />
      </mesh>
      <mesh position={[5, 3.5, 30]}>
        <boxGeometry args={[1, 7, 1]} />
        <meshStandardMaterial color="#718096" />
      </mesh>

      {/* 视图模式提示标签 */}
      <Html
        position={[0, 15, 0]}
        center
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            background: isInside ? 'rgba(66, 153, 225, 0.9)' : 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            letterSpacing: '1px',
            transition: 'background 0.5s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {isInside ? '[ 内部视图 ] 滚轮拉远返回外部' : '[ 外部视图 ] 滚轮拉近进入厂房'}
        </div>
      </Html>
    </>
  );
}

/** 智能制造工厂精细场景布局（30x20） */
function SmartFactoryScene() {
  // 检测相机是否在主生产车间附近
  const isInside = useCameraProximity([0, 0, -2], 12);

  return (
    <>
      {/* 精细环境渲染（天空、草地、光照、雾效） */}
      <FactoryEnvironment floorSize={{ width: 30, depth: 20 }} />

      {/* 办公楼 - 6层，面向场景内部 */}
      <OfficeBuilding position={[-10, 0, 7]} rotation={[0, Math.PI / 2, 0]} />

      {/* 质检楼 - 4层 */}
      <OfficeBuilding position={[12, 0, -3]} floors={4} />

      {/* 主生产车间 - 场景中心 - 支持X光透视 */}
      <XRayFactoryHall position={[0, 0, -2]} width={18} depth={10} isInside={isInside} />

      {/* 主生产车间内部场景 */}
      <FactoryInterior position={[0, 0, -2]} width={18} depth={10} visible={isInside} />

      {/* 仓库 - 小厂房 */}
      <FactoryHall position={[-12, 0, -5]} width={8} depth={6} height={5} />

      {/* 小型储罐 */}
      <StorageTank position={[14, 0, 5]} />

      {/* 管道段 - 连接仓库到主车间 */}
      <PipeSegment position={[-6, 0, -4]} rotation={[0, 0, Math.PI / 2]} length={6} />

      {/* 管道段 - 连接主车间到质检楼 */}
      <PipeSegment position={[8, 0, -2]} rotation={[0, 0, Math.PI / 2]} length={6} bent />

      {/* 道路 - 纵向贯穿场景 */}
      <Road position={[0, 0.02, 8]} width={5} length={30} />

      {/* 道路 - 横向连接 */}
      <Road position={[-6, 0.02, 2]} rotation={[0, Math.PI / 2, 0]} width={3} length={16} />

      {/* 绿化带 x3 */}
      <GreenArea position={[-14, 0.01, 5]} />
      <GreenArea position={[14, 0.01, -8]} />
      <GreenArea position={[-14, 0.01, -5]} />

      {/* 视图模式提示标签 */}
      <Html
        position={[0, 10, 0]}
        center
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            background: isInside ? 'rgba(66, 153, 225, 0.9)' : 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            letterSpacing: '1px',
            transition: 'background 0.5s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {isInside ? '[ 内部视图 ] 滚轮拉远返回外部' : '[ 外部视图 ] 滚轮拉近进入厂房'}
        </div>
      </Html>
    </>
  );
}

/** 简易生产车间精细场景布局（16x12） */
function SimpleWorkshopScene() {
  // 检测相机是否在主车间附近
  const isInside = useCameraProximity([0, 0, 0], 10);

  return (
    <>
      {/* 精细环境渲染（天空、草地、光照、雾效） */}
      <FactoryEnvironment floorSize={{ width: 16, depth: 12 }} />

      {/* 主车间 - 场景中心 - 支持X光透视 */}
      <XRayFactoryHall position={[0, 0, 0]} width={12} depth={8} isInside={isInside} />

      {/* 主车间内部场景 */}
      <FactoryInterior position={[0, 0, 0]} width={12} depth={8} visible={isInside} />

      {/* 小仓库 */}
      <FactoryHall position={[8, 0, -2]} width={5} depth={4} height={4} />

      {/* 道路 - 纵向贯穿场景 */}
      <Road position={[0, 0.02, 5]} width={3} length={16} />

      {/* 绿化带 x2 */}
      <GreenArea position={[-7, 0.01, -4]} />
      <GreenArea position={[7, 0.01, 4]} />

      {/* 视图模式提示标签 */}
      <Html
        position={[0, 8, 0]}
        center
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            background: isInside ? 'rgba(66, 153, 225, 0.9)' : 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            letterSpacing: '1px',
            transition: 'background 0.5s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {isInside ? '[ 内部视图 ] 滚轮拉远返回外部' : '[ 外部视图 ] 滚轮拉近进入厂房'}
        </div>
      </Html>
    </>
  );
}

/** 能源监控站精细场景布局（14x10） */
function EnergyStationScene() {
  // 检测相机是否在空压机房附近
  const isInside = useCameraProximity([-3, 0, -2], 8);

  return (
    <>
      {/* 精细环境渲染（天空、草地、光照、雾效） */}
      <FactoryEnvironment floorSize={{ width: 14, depth: 10 }} />

      {/* 空压机房 - 支持X光透视 */}
      <XRayFactoryHall position={[-3, 0, -2]} width={8} depth={6} isInside={isInside} />

      {/* 空压机房内部场景 */}
      <FactoryInterior position={[-3, 0, -2]} width={8} depth={6} visible={isInside} />

      {/* 冷却设备间 */}
      <FactoryHall position={[4, 0, -2]} width={6} depth={5} height={4} />

      {/* 小型储罐 */}
      <StorageTank position={[6, 0, 3]} />

      {/* 球形储气罐 */}
      <SphereTank position={[-6, 0, 3]} />

      {/* 管道段 - 连接空压机房到冷却设备间 */}
      <PipeSegment position={[1, 0, -2]} rotation={[0, 0, Math.PI / 2]} length={5} bent />

      {/* 管道段 - 连接空压机房到储气罐 */}
      <PipeSegment position={[-5, 0, 0]} rotation={[Math.PI / 2, 0, 0]} length={5} />

      {/* 管道段 - 连接冷却设备到储罐 */}
      <PipeSegment position={[5, 0, 0]} rotation={[Math.PI / 2, 0, 0]} length={5} />

      {/* 道路 - 纵向贯穿场景 */}
      <Road position={[0, 0.02, 5]} width={3} length={14} />

      {/* 绿化带 x2 */}
      <GreenArea position={[-7, 0.01, 4]} />
      <GreenArea position={[7, 0.01, 4]} />

      {/* 视图模式提示标签 */}
      <Html
        position={[0, 8, 0]}
        center
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            background: isInside ? 'rgba(66, 153, 225, 0.9)' : 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            letterSpacing: '1px',
            transition: 'background 0.5s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {isInside ? '[ 内部视图 ] 滚轮拉远返回外部' : '[ 外部视图 ] 滚轮拉近进入厂房'}
        </div>
      </Html>
    </>
  );
}

function FactoryFloor() {
  const factoryTemplateId = useAppStore((s) => s.factoryTemplateId);

  if (!factoryTemplateId) return null;

  const factory = getFactoryTemplate(factoryTemplateId);
  if (!factory) return null;

  // 火力发电厂模板使用精细场景渲染
  if (factoryTemplateId === 'thermal-power-plant') {
    return <ThermalPowerPlantScene />;
  }

  // 智能制造工厂模板使用精细场景渲染
  if (factoryTemplateId === 'smart-factory') {
    return <SmartFactoryScene />;
  }

  // 简易生产车间模板使用精细场景渲染
  if (factoryTemplateId === 'simple-workshop') {
    return <SimpleWorkshopScene />;
  }

  // 能源监控站模板使用精细场景渲染
  if (factoryTemplateId === 'energy-station') {
    return <EnergyStationScene />;
  }

  // 其他模板保持原有简单渲染方式
  const { floorSize, floorColor, wallColor, environment } = factory;

  return (
    <>
      {/* 地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[floorSize.width, floorSize.depth]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {/* 地面网格线 */}
      <Grid
        args={[floorSize.width, floorSize.depth]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#cbd5e0"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#a0aec0"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
        position={[0, 0.01, 0]}
      />

      {/* 墙壁 - 后墙 */}
      <mesh position={[0, floorSize.depth / 4, -floorSize.depth / 2]}>
        <boxGeometry args={[floorSize.width, floorSize.depth / 2, 0.15]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.6} />
      </mesh>

      {/* 墙壁 - 左墙 */}
      <mesh position={[-floorSize.width / 2, floorSize.depth / 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[floorSize.depth, floorSize.depth / 2, 0.15]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.4} />
      </mesh>

      {/* 墙壁 - 右墙 */}
      <mesh position={[floorSize.width / 2, floorSize.depth / 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[floorSize.depth, floorSize.depth / 2, 0.15]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.4} />
      </mesh>

      {/* 环境光 */}
      <ambientLight intensity={environment.ambientLight.intensity} color={environment.ambientLight.color} />

      {/* 方向光 */}
      <directionalLight
        intensity={environment.directionalLight.intensity}
        color={environment.directionalLight.color}
        position={[
          environment.directionalLight.position.x,
          environment.directionalLight.position.y,
          environment.directionalLight.position.z,
        ]}
        castShadow
      />

      {/* 雾效 */}
      {environment.fog && (
        <fog attach="fog" args={[environment.fog.color, environment.fog.near, environment.fog.far]} />
      )}
    </>
  );
}

// ==================== 场景内容 ====================

function SceneContent() {
  const devices = useAppStore((s) => s.devices);
  const selectDevice = useAppStore((s) => s.selectDevice);

  const handleGroundClick = useCallback(() => {
    selectDevice(null);
  }, [selectDevice]);

  return (
    <>
      <FactoryFloor />

      {/* 渲染所有设备 */}
      {devices.map((device) => (
        <DeviceMesh key={device.id} device={device} />
      ))}

      {/* 点击空白区域取消选中 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} onClick={handleGroundClick} visible={false}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 轨道控制器 */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.1}
        minDistance={3}
        maxDistance={120}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  );
}

// ==================== 主场景组件 ====================

export default function TwinScene() {
  const devices = useAppStore((s) => s.devices);
  const hasContent = devices.length > 0;

  return (
    <div style={{ width: '100%', height: '100%', background: '#1a202c' }}>
      <Canvas
        camera={{ position: [15, 12, 15], fov: 50, near: 0.1, far: 300 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#1a202c']} />
        <SceneContent />
      </Canvas>

      {/* 空场景提示 */}
      {!hasContent && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#a0aec0',
            fontSize: '18px',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏭</div>
          <div>请从左侧面板选择工厂模板或添加设备</div>
        </div>
      )}
    </div>
  );
}
