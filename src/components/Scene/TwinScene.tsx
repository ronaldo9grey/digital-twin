// ==========================================
// 数字孪生系统 - 3D场景主组件
// ==========================================
import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store';
import { getDeviceTemplate } from '../../templates/devices';
import { getFactoryTemplate } from '../../templates/factories';
import { DeviceStatus } from '../../types';
import type { DeviceInstance, GeometryPart } from '../../types';

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
    >
      <meshStandardMaterial color={isIndicator ? statusColor : part.color} />
    </mesh>
  );
}

/** 渲染单个设备 */
function DeviceMesh({ device }: { device: DeviceInstance }) {
  const template = getDeviceTemplate(device.templateId);
  const selectDevice = useAppStore((s) => s.selectDevice);
  const selectedDeviceId = useAppStore((s) => s.selectedDeviceId);
  const meshRef = useRef<THREE.Group>(null);

  if (!template) return null;

  const isSelected = selectedDeviceId === device.id;
  const statusColor = template.statusColors[device.status] || '#a0aec0';
  const maxY = template.geometry.parts ? Math.max(...template.geometry.parts.map(p => p.position.y + (p.params.height || 0))) : 1.5;

  // 设备动画（运行状态时轻微浮动）
  useFrame((state) => {
    if (meshRef.current && device.status === DeviceStatus.RUNNING) {
      meshRef.current.position.y = device.position.y + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      selectDevice(device.id);
    },
    [device.id, selectDevice]
  );

  return (
    <group
      ref={meshRef}
      position={[device.position.x, device.position.y, device.position.z]}
      rotation={[device.rotation.x, device.rotation.y, device.rotation.z]}
      scale={[device.scale.x, device.scale.y, device.scale.z]}
      onClick={handleClick}
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

// ==================== 工厂地面和墙壁 ====================

function FactoryFloor() {
  const factoryTemplateId = useAppStore((s) => s.factoryTemplateId);

  if (!factoryTemplateId) return null;

  const factory = getFactoryTemplate(factoryTemplateId);
  if (!factory) return null;

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
        fadeDistance={30}
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
        minDistance={5}
        maxDistance={60}
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
        camera={{ position: [15, 12, 15], fov: 50, near: 0.1, far: 200 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#1a202c']} />
        <SceneContent />
      </Canvas>

      {/* 空场景提示 - 基于设备数量判断 */}
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
