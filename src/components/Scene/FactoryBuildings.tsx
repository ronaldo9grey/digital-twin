// ==========================================
// 数字孪生系统 - 工厂建筑3D模型组件库
// ==========================================
// 本文件包含工厂场景中常用的精细程序化3D建筑模型组件，
// 使用 React + Three.js (@react-three/fiber + @react-three/drei) 实现。
// 所有组件均支持 position, rotation, scale 等通用变换属性，
// 并使用 meshStandardMaterial 配合合理的 metalness 和 roughness 参数
// 以达到逼真的渲染效果。
// ==========================================

import { useMemo } from 'react';
import * as THREE from 'three';

// ==================== 通用类型定义 ====================

/** 基础组件属性：位置、旋转、缩放 */
interface BaseProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

// ==================== 1. OfficeBuilding 办公楼 ====================
// 多层建筑（6-8层），玻璃幕墙效果
// 每层有窗户网格（用半透明蓝色材质模拟玻璃）
// 顶部有设备层（稍窄的灰色层）
// 底部有入口大厅（稍突出）

interface OfficeBuildingProps extends BaseProps {
  width?: number;
  depth?: number;
  floors?: number;
}

export function OfficeBuilding({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = 8,
  depth = 6,
  floors = 6,
}: OfficeBuildingProps) {
  const floorHeight = 3.5;
  const totalHeight = floors * floorHeight;
  const windowWidth = 1.2;
  const windowHeight = 1.8;
  const windowGap = 0.6;
  const windowMargin = 0.8;

  // 预计算窗户位置
  const windows = useMemo(() => {
    const result: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    const colsFront = Math.floor((width - windowMargin * 2 + windowGap) / (windowWidth + windowGap));
    const startX = -(colsFront - 1) * (windowWidth + windowGap) / 2;

    for (let f = 0; f < floors; f++) {
      const y = f * floorHeight + floorHeight * 0.55;
      // 前面窗户
      for (let c = 0; c < colsFront; c++) {
        result.push({
          pos: [startX + c * (windowWidth + windowGap), y, depth / 2 + 0.01],
          rot: [0, 0, 0],
        });
      }
      // 后面窗户
      for (let c = 0; c < colsFront; c++) {
        result.push({
          pos: [startX + c * (windowWidth + windowGap), y, -depth / 2 - 0.01],
          rot: [0, Math.PI, 0],
        });
      }
      // 左侧窗户
      const colsSide = Math.floor((depth - windowMargin * 2 + windowGap) / (windowWidth + windowGap));
      const startZ = -(colsSide - 1) * (windowWidth + windowGap) / 2;
      for (let c = 0; c < colsSide; c++) {
        result.push({
          pos: [-width / 2 - 0.01, y, startZ + c * (windowWidth + windowGap)],
          rot: [0, Math.PI / 2, 0],
        });
      }
      // 右侧窗户
      for (let c = 0; c < colsSide; c++) {
        result.push({
          pos: [width / 2 + 0.01, y, startZ + c * (windowWidth + windowGap)],
          rot: [0, -Math.PI / 2, 0],
        });
      }
    }
    return result;
  }, [floors, floorHeight, width, depth, windowWidth, windowGap, windowMargin]);

  // 楼层分隔线几何体
  const floorSlabGeometry = useMemo(
    () => new THREE.BoxGeometry(width + 0.2, 0.15, depth + 0.2),
    [width, depth]
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 主体建筑 */}
      <mesh position={[0, totalHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, totalHeight, depth]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* 楼层分隔线 */}
      {Array.from({ length: floors + 1 }).map((_, i) => (
        <mesh
          key={`slab-${i}`}
          geometry={floorSlabGeometry}
          position={[0, i * floorHeight, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#d0d0d0" metalness={0.2} roughness={0.7} />
        </mesh>
      ))}

      {/* 玻璃窗户 */}
      {windows.map((w, i) => (
        <mesh key={`win-${i}`} position={w.pos} rotation={w.rot} castShadow receiveShadow>
          <planeGeometry args={[windowWidth, windowHeight]} />
          <meshStandardMaterial
            color="#88ccff"
            transparent
            opacity={0.4}
            metalness={0.9}
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* 顶部设备层 */}
      <mesh position={[0, totalHeight + 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.7, 2.4, depth * 0.7]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* 设备层顶部小房间 */}
      <mesh position={[0, totalHeight + 2.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.4, 0.8, depth * 0.4]} />
        <meshStandardMaterial color="#909090" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* 入口大厅（底部突出） */}
      <mesh position={[0, 1.5, depth / 2 + 1.5]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.5, 3, 3]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* 入口玻璃门 */}
      <mesh position={[0, 1.5, depth / 2 + 3.01]} castShadow receiveShadow>
        <planeGeometry args={[width * 0.4, 2.5]} />
        <meshStandardMaterial
          color="#88ccff"
          transparent
          opacity={0.5}
          metalness={0.9}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ==================== 2. FactoryHall 工业厂房 ====================
// 大跨度单层建筑，蓝色/灰色坡屋顶
// 墙壁用浅灰色，有工业感
// 屋顶有锯齿形天窗（2-3个三角形突起）
// 侧面有卷帘门（深色矩形）

interface FactoryHallProps extends BaseProps {
  width?: number;
  depth?: number;
  height?: number;
  wallOpacity?: number;  // 墙壁透明度（0-1），默认0.85
  roofOpacity?: number;  // 屋顶透明度（0-1），默认0.85
}

export function FactoryHall({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = 20,
  depth = 12,
  height = 8,
  wallOpacity = 0.85,
  roofOpacity = 0.85,
}: FactoryHallProps) {
  const wallThickness = 0.3;
  const roofOverhang = 0.8;
  const sawtoothCount = 3;

  // 锯齿形天窗几何体
  const sawtoothGeometries = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    const sawWidth = (width - 2) / sawtoothCount;
    for (let i = 0; i < sawtoothCount; i++) {
      const shape = new THREE.Shape();
      const x0 = -width / 2 + 1 + i * sawWidth;
      shape.moveTo(x0, 0);
      shape.lineTo(x0 + sawWidth * 0.6, 2.5);
      shape.lineTo(x0 + sawWidth, 0);
      shape.lineTo(x0, 0);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: depth - 2,
        bevelEnabled: false,
      });
      geo.translate(0, height, -depth / 2 + 1);
      geos.push(geo);
    }
    return geos;
  }, [width, depth, height, sawtoothCount]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 地板 */}
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* 前墙 */}
      <mesh position={[0, height / 2, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.1} roughness={0.8} transparent opacity={wallOpacity} />
      </mesh>

      {/* 后墙 */}
      <mesh position={[0, height / 2, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.1} roughness={0.8} transparent opacity={wallOpacity} />
      </mesh>

      {/* 左墙 */}
      <mesh position={[-width / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.1} roughness={0.8} transparent opacity={wallOpacity} />
      </mesh>

      {/* 右墙 */}
      <mesh position={[width / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.1} roughness={0.8} transparent opacity={wallOpacity} />
      </mesh>

      {/* 主屋顶（坡屋顶 - 使用楔形效果） */}
      <mesh position={[0, height + 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + roofOverhang * 2, 0.3, depth + roofOverhang * 2]} />
        <meshStandardMaterial color="#4a6fa5" metalness={0.3} roughness={0.6} transparent opacity={roofOpacity} />
      </mesh>

      {/* 屋顶坡度 - 左侧 */}
      <mesh
        position={[0, height + 1.5, 0]}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width + roofOverhang * 2, 0.3, depth + roofOverhang * 2]} />
        <meshStandardMaterial color="#4a6fa5" metalness={0.3} roughness={0.6} transparent opacity={roofOpacity} />
      </mesh>

      {/* 锯齿形天窗 */}
      {sawtoothGeometries.map((geo, i) => (
        <mesh key={`saw-${i}`} geometry={geo} castShadow receiveShadow>
          <meshStandardMaterial color="#88ccff" transparent opacity={0.5} metalness={0.7} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* 锯齿形天窗不透明面 */}
      {sawtoothGeometries.map((geo, i) => (
        <mesh key={`saw-opaque-${i}`} geometry={geo} castShadow receiveShadow>
          <meshStandardMaterial color="#4a6fa5" metalness={0.3} roughness={0.6} side={THREE.BackSide} transparent opacity={roofOpacity} />
        </mesh>
      ))}

      {/* 前面卷帘门 */}
      <mesh position={[0, 2.5, depth / 2 + 0.01]} castShadow receiveShadow>
        <planeGeometry args={[4, 5]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.4} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* 卷帘门框 */}
      <mesh position={[-2.1, 2.5, depth / 2 + 0.02]} castShadow>
        <boxGeometry args={[0.15, 5.2, 0.1]} />
        <meshStandardMaterial color="#606060" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[2.1, 2.5, depth / 2 + 0.02]} castShadow>
        <boxGeometry args={[0.15, 5.2, 0.1]} />
        <meshStandardMaterial color="#606060" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 5.15, depth / 2 + 0.02]} castShadow>
        <boxGeometry args={[4.35, 0.15, 0.1]} />
        <meshStandardMaterial color="#606060" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 侧面卷帘门 */}
      <mesh position={[width / 2 + 0.01, 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <planeGeometry args={[3, 4]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.4} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* 屋顶边沿装饰条 */}
      <mesh position={[0, height + 0.15, depth / 2 + roofOverhang]} castShadow>
        <boxGeometry args={[width + roofOverhang * 2, 0.3, 0.15]} />
        <meshStandardMaterial color="#606060" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, height + 0.15, -depth / 2 - roofOverhang]} castShadow>
        <boxGeometry args={[width + roofOverhang * 2, 0.3, 0.15]} />
        <meshStandardMaterial color="#606060" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

// ==================== 3. Chimney 烟囱 ====================
// 细长圆柱体，顶部有环状加粗
// 底部有方形基座
// 红白相间条纹（用多段圆柱实现）

interface ChimneyProps extends BaseProps {
  height?: number;
  radius?: number;
}

export function Chimney({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  height = 15,
  radius = 0.5,
}: ChimneyProps) {
  const stripeCount = 10;
  const stripeHeight = height / stripeCount;

  // 预计算条纹几何体
  const stripeGeometries = useMemo(() => {
    return Array.from({ length: stripeCount }).map((_, i) => {
      const isRed = i % 2 === 0;
      const r = isRed ? radius : radius;
      return {
        geo: new THREE.CylinderGeometry(r, r, stripeHeight, 24),
        color: isRed ? '#cc3333' : '#f0f0f0',
        y: i * stripeHeight + stripeHeight / 2,
      };
    });
  }, [height, radius, stripeCount, stripeHeight]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 方形基座 */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[radius * 4, 1, radius * 4]} />
        <meshStandardMaterial color="#808080" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* 红白相间条纹主体 */}
      {stripeGeometries.map((s, i) => (
        <mesh key={`stripe-${i}`} geometry={s.geo} position={[0, s.y + 1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={s.color} metalness={0.2} roughness={0.7} />
        </mesh>
      ))}

      {/* 顶部环状加粗 */}
      <mesh position={[0, height + 1.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 1.4, radius * 1.2, 0.6, 24]} />
        <meshStandardMaterial color="#707070" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 顶部开口环 */}
      <mesh position={[0, height + 1.7, 0]} castShadow receiveShadow>
        <torusGeometry args={[radius * 1.1, 0.08, 8, 24]} />
        <meshStandardMaterial color="#606060" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* 底部加固环 */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[radius * 1.15, radius * 1.15, 0.3, 24]} />
        <meshStandardMaterial color="#707070" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

// ==================== 4. StorageTank 储罐 ====================
// 大型圆柱体，球形顶盖
// 有攀爬梯子（细长条）
// 底部有管道接口（小圆柱突出）
// 银灰色金属材质

interface StorageTankProps extends BaseProps {
  radius?: number;
  height?: number;
}

export function StorageTank({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  radius = 3,
  height = 6,
}: StorageTankProps) {
  // 梯子竖杆几何体
  const ladderRailGeo = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, height, 8), [height]);
  // 梯子横档几何体
  const ladderRungGeo = useMemo(() => new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), []);
  // 管道几何体
  const pipeGeo = useMemo(() => new THREE.CylinderGeometry(0.15, 0.15, 1.5, 12), []);

  const rungCount = Math.floor(height / 0.8);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 圆柱主体 */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 32]} />
        <meshStandardMaterial color="#b0b8c0" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* 球形顶盖 */}
      <mesh position={[0, height, 0]} castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#b0b8c0" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* 底部封板 */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.1, 32]} />
        <meshStandardMaterial color="#a0a8b0" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* 顶部检修口 */}
      <mesh position={[0, height + radius * 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 攀爬梯子 - 左竖杆 */}
      <mesh geometry={ladderRailGeo} position={[radius + 0.3, height / 2, 0]} rotation={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#707880" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* 攀爬梯子 - 右竖杆 */}
      <mesh geometry={ladderRailGeo} position={[radius + 0.8, height / 2, 0]} rotation={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#707880" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* 攀爬梯子 - 横档 */}
      {Array.from({ length: rungCount }).map((_, i) => (
        <mesh
          key={`rung-${i}`}
          geometry={ladderRungGeo}
          position={[radius + 0.55, 0.5 + i * 0.8, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <meshStandardMaterial color="#707880" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* 底部管道接口 - 正面 */}
      <mesh geometry={pipeGeo} position={[0, 0.8, radius + 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <meshStandardMaterial color="#808890" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* 底部管道接口 - 侧面 */}
      <mesh geometry={pipeGeo} position={[radius + 0.5, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <meshStandardMaterial color="#808890" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* 管道法兰 - 正面 */}
      <mesh position={[0, 0.8, radius + 1.3]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#606870" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 管道法兰 - 侧面 */}
      <mesh position={[radius + 1.3, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#606870" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 罐体加强环 */}
      {[height * 0.25, height * 0.5, height * 0.75].map((y, i) => (
        <mesh key={`ring-${i}`} position={[0, y, 0]} castShadow>
          <torusGeometry args={[radius + 0.05, 0.06, 8, 32]} />
          <meshStandardMaterial color="#909aa0" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ==================== 5. SphereTank 球形储罐 ====================
// 球形容器
// 有支撑腿（3-4根圆柱）

interface SphereTankProps extends BaseProps {
  radius?: number;
}

export function SphereTank({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  radius = 2.5,
}: SphereTankProps) {
  const legCount = 4;
  const legHeight = radius * 1.2;
  const legRadius = 0.12;

  // 支撑腿位置（均匀分布在球体下方）
  const legPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < legCount; i++) {
      const angle = (i / legCount) * Math.PI * 2;
      const legR = radius * 0.6;
      positions.push([Math.cos(angle) * legR, legHeight / 2, Math.sin(angle) * legR]);
    }
    return positions;
  }, [legCount, radius, legHeight]);

  // 支撑腿几何体
  const legGeo = useMemo(
    () => new THREE.CylinderGeometry(legRadius, legRadius * 1.3, legHeight, 8),
    [legHeight, legRadius]
  );

  // 横撑几何体
  const braceGeo = useMemo(() => new THREE.CylinderGeometry(0.06, 0.06, radius * 1.2, 8), [radius]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 球形容器 */}
      <mesh position={[0, legHeight + radius * 0.1, 0]} castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color="#c0c8d0" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* 赤道加强环 */}
      <mesh position={[0, legHeight + radius * 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[radius + 0.05, 0.06, 8, 32]} />
        <meshStandardMaterial color="#a0a8b0" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* 顶部检修口 */}
      <mesh position={[0, legHeight + radius * 0.1 + radius * 0.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
        <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 支撑腿 */}
      {legPositions.map((pos, i) => (
        <mesh key={`leg-${i}`} geometry={legGeo} position={pos} castShadow receiveShadow>
          <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* 横向支撑（连接支撑腿） */}
      {Array.from({ length: legCount }).map((_, i) => {
        const angle = (i / legCount) * Math.PI * 2 + Math.PI / legCount;
        const braceY = legHeight * 0.4;
        return (
          <mesh
            key={`brace-${i}`}
            geometry={braceGeo}
            position={[Math.cos(angle) * radius * 0.3, braceY, Math.sin(angle) * radius * 0.3]}
            rotation={[0, -angle + Math.PI / 2, 0]}
            castShadow
          >
            <meshStandardMaterial color="#707880" metalness={0.5} roughness={0.4} />
          </mesh>
        );
      })}

      {/* 底部基座环 */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.8, radius * 0.9, 0.3, 32]} />
        <meshStandardMaterial color="#707880" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

// ==================== 6. CoolingTower 冷却塔 ====================
// 双曲线型（上宽下窄中间最窄）
// 用LatheGeometry实现旋转体

interface CoolingTowerProps extends BaseProps {
  height?: number;
}

export function CoolingTower({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  height = 12,
}: CoolingTowerProps) {
  // 双曲线轮廓点（用于LatheGeometry）
  const latheGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const segments = 40;
    const topRadius = 3.5;
    const bottomRadius = 4.0;
    const neckRadius = 2.5;
    const neckPosition = 0.7; // 最窄处位于70%高度

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      let r: number;

      if (t < neckPosition) {
        // 下半部分：从底部到最窄处，使用双曲线
        const localT = t / neckPosition;
        // 二次曲线插值
        r = bottomRadius + (neckRadius - bottomRadius) * Math.pow(localT, 0.8);
      } else {
        // 上半部分：从最窄处到顶部，逐渐扩大
        const localT = (t - neckPosition) / (1 - neckPosition);
        r = neckRadius + (topRadius - neckRadius) * Math.pow(localT, 0.6);
      }

      points.push(new THREE.Vector2(r, t * height));
    }

    return new THREE.LatheGeometry(points, 32);
  }, [height]);

  // 顶部开口环
  const topRingGeo = useMemo(() => new THREE.TorusGeometry(3.5, 0.15, 8, 32), []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 双曲线塔体 */}
      <mesh geometry={latheGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#d8d8d8" metalness={0.1} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* 顶部加粗环 */}
      <mesh geometry={topRingGeo} position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <meshStandardMaterial color="#b0b0b0" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* 底部基座 */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4.3, 4.5, 0.6, 32]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.2} roughness={0.7} />
      </mesh>

      {/* 内部可见的蒸汽出口暗示（顶部半透明） */}
      <mesh position={[0, height - 0.5, 0]} castShadow>
        <cylinderGeometry args={[3.3, 2.8, 1, 32, 1, true]} />
        <meshStandardMaterial
          color="#c8c8c8"
          metalness={0.1}
          roughness={0.8}
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 表面竖向纹理线条（装饰） */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * 4.1;
        const z = Math.sin(angle) * 4.1;
        return (
          <mesh key={`line-${i}`} position={[x, height / 2, z]} castShadow>
            <boxGeometry args={[0.08, height, 0.08]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.15} roughness={0.75} />
          </mesh>
        );
      })}
    </group>
  );
}

// ==================== 7. PipeSegment 管道段 ====================
// 圆柱管道，两端有法兰（扁平圆柱）
// 支持90度弯头（可选）

interface PipeSegmentProps extends BaseProps {
  length?: number;
  radius?: number;
  bent?: boolean;
}

export function PipeSegment({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  length = 5,
  radius = 0.3,
  bent = false,
}: PipeSegmentProps) {
  // 管道主体几何体
  const pipeGeo = useMemo(
    () => new THREE.CylinderGeometry(radius, radius, length, 16),
    [radius, length]
  );
  // 法兰几何体
  const flangeGeo = useMemo(
    () => new THREE.CylinderGeometry(radius * 1.6, radius * 1.6, 0.12, 16),
    [radius]
  );
  // 弯头几何体（90度弯管使用TorusGeometry）
  const elbowGeo = useMemo(
    () => new THREE.TorusGeometry(length / 2, radius, 12, 16, Math.PI / 2),
    [length, radius]
  );

  if (bent) {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        {/* 弯头主体 */}
        <mesh geometry={elbowGeo} position={[length / 2, length / 2, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#a0a8b0" metalness={0.6} roughness={0.35} />
        </mesh>

        {/* 弯头起点法兰 */}
        <mesh geometry={flangeGeo} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* 弯头终点法兰（水平方向） */}
        <mesh geometry={flangeGeo} position={[length, length / 2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* 起点直管段 */}
        <mesh geometry={pipeGeo} position={[0, -length / 2, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#a0a8b0" metalness={0.6} roughness={0.35} />
        </mesh>

        {/* 终点直管段（水平） */}
        <mesh geometry={pipeGeo} position={[length + length / 2, length / 2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#a0a8b0" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 管道主体 */}
      <mesh geometry={pipeGeo} position={[0, length / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#a0a8b0" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* 底部法兰 */}
      <mesh geometry={flangeGeo} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 顶部法兰 */}
      <mesh geometry={flangeGeo} position={[0, length, 0]} castShadow>
        <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 管道支架（中间） */}
      <mesh position={[radius + 0.3, length / 2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.4]} />
        <meshStandardMaterial color="#707880" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[radius + 0.3, length / 2 - 0.45, 0]} castShadow>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#707880" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

// ==================== 8. PowerLine 输电塔 ====================
// 格构式塔架（用多个细圆柱拼接）
// 顶部有横担和绝缘子

interface PowerLineProps extends BaseProps {
  height?: number;
}

export function PowerLine({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  height = 15,
}: PowerLineProps) {
  const baseWidth = 2.5;
  const topWidth = 0.8;
  const crossArmWidth = 4;
  const insulatorHeight = 1.2;

  // 主腿几何体
  const legGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.12, height, 8), [height]);
  // 横担几何体
  const crossArmGeo = useMemo(() => new THREE.CylinderGeometry(0.06, 0.06, crossArmWidth, 8), []);
  // 斜撑几何体
  const braceGeo = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, 3, 8), []);
  // 水平撑几何体
  const horizontalGeo = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, 3, 8), []);
  // 绝缘子几何体
  const insulatorGeo = useMemo(() => new THREE.CylinderGeometry(0.06, 0.1, insulatorHeight, 8), []);
  // 绝缘子盘几何体
  const insulatorDiscGeo = useMemo(() => new THREE.CylinderGeometry(0.2, 0.2, 0.06, 12), []);

  const segmentCount = 5;
  const segmentHeight = height / segmentCount;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 四根主腿 */}
      {[
        [-baseWidth / 2, -baseWidth / 2],
        [baseWidth / 2, -baseWidth / 2],
        [-baseWidth / 2, baseWidth / 2],
        [baseWidth / 2, baseWidth / 2],
      ].map(([x, z], i) => {
        // 每条腿从底部到顶部逐渐收窄
        const topX = (x / baseWidth) * topWidth;
        const topZ = (z / baseWidth) * topWidth;
        const midX = (x + topX) / 2;
        const midZ = (z + topZ) / 2;
        const tiltAngle = Math.atan2(topX - x, height);
        const tiltAngleZ = Math.atan2(topZ - z, height);

        return (
          <mesh
            key={`leg-${i}`}
            geometry={legGeo}
            position={[midX, height / 2, midZ]}
            rotation={[tiltAngleZ, 0, -tiltAngle]}
            castShadow
          >
            <meshStandardMaterial color="#707880" metalness={0.6} roughness={0.4} />
          </mesh>
        );
      })}

      {/* 水平撑和斜撑（每段一层） */}
      {Array.from({ length: segmentCount }).map((_, seg) => {
        const y = seg * segmentHeight;
        const t = seg / segmentCount;
        const w = baseWidth + (topWidth - baseWidth) * t;
        const nextT = (seg + 1) / segmentCount;
        const nextW = baseWidth + (topWidth - baseWidth) * nextT;

        return (
          <group key={`segment-${seg}`}>
            {/* 水平撑 - 前后 */}
            <mesh
              geometry={horizontalGeo}
              position={[-w / 2, y, -w / 2]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh
              geometry={horizontalGeo}
              position={[w / 2, y, -w / 2]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh
              geometry={horizontalGeo}
              position={[-w / 2, y, w / 2]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh
              geometry={horizontalGeo}
              position={[w / 2, y, w / 2]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
            </mesh>

            {/* 水平撑 - 左右 */}
            <mesh
              geometry={horizontalGeo}
              position={[-w / 2, y, 0]}
              rotation={[0, 0, 0]}
              castShadow
            >
              <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh
              geometry={horizontalGeo}
              position={[w / 2, y, 0]}
              rotation={[0, 0, 0]}
              castShadow
            >
              <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
            </mesh>

            {/* 斜撑 - X形交叉 */}
            {seg < segmentCount - 1 && (
              <>
                {/* 前面斜撑 */}
                <mesh
                  geometry={braceGeo}
                  position={[0, y + segmentHeight / 2, -w / 2]}
                  rotation={[0, 0, Math.atan2(nextW - w, segmentHeight)]}
                  castShadow
                >
                  <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
                </mesh>
                <mesh
                  geometry={braceGeo}
                  position={[0, y + segmentHeight / 2, -w / 2]}
                  rotation={[0, 0, -Math.atan2(nextW - w, segmentHeight)]}
                  castShadow
                >
                  <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
                </mesh>
                {/* 后面斜撑 */}
                <mesh
                  geometry={braceGeo}
                  position={[0, y + segmentHeight / 2, w / 2]}
                  rotation={[0, 0, Math.atan2(nextW - w, segmentHeight)]}
                  castShadow
                >
                  <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
                </mesh>
                <mesh
                  geometry={braceGeo}
                  position={[0, y + segmentHeight / 2, w / 2]}
                  rotation={[0, 0, -Math.atan2(nextW - w, segmentHeight)]}
                  castShadow
                >
                  <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
                </mesh>
              </>
            )}
          </group>
        );
      })}

      {/* 顶部横担 */}
      <mesh
        geometry={crossArmGeo}
        position={[0, height, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#606870" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* 中层横担 */}
      <mesh
        geometry={crossArmGeo}
        position={[0, height * 0.85, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#606870" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* 顶层横担 */}
      <mesh
        geometry={new THREE.CylinderGeometry(0.05, 0.05, crossArmWidth * 0.7, 8)}
        position={[0, height + 0.8, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#606870" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* 绝缘子 - 顶层 */}
      {[-crossArmWidth * 0.35, 0, crossArmWidth * 0.35].map((x, i) => (
        <group key={`ins-top-${i}`}>
          <mesh geometry={insulatorGeo} position={[x, height + 0.8 - insulatorHeight / 2, 0]} castShadow>
            <meshStandardMaterial color="#4a6fa5" metalness={0.3} roughness={0.6} />
          </mesh>
          <mesh geometry={insulatorDiscGeo} position={[x, height + 0.8 - insulatorHeight * 0.3, 0]} castShadow>
            <meshStandardMaterial color="#5a7fb5" metalness={0.3} roughness={0.5} />
          </mesh>
          <mesh geometry={insulatorDiscGeo} position={[x, height + 0.8 - insulatorHeight * 0.6, 0]} castShadow>
            <meshStandardMaterial color="#5a7fb5" metalness={0.3} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* 绝缘子 - 中层 */}
      {[-crossArmWidth * 0.35, 0, crossArmWidth * 0.35].map((x, i) => (
        <group key={`ins-mid-${i}`}>
          <mesh geometry={insulatorGeo} position={[x, height * 0.85 - insulatorHeight / 2, 0]} castShadow>
            <meshStandardMaterial color="#4a6fa5" metalness={0.3} roughness={0.6} />
          </mesh>
          <mesh geometry={insulatorDiscGeo} position={[x, height * 0.85 - insulatorHeight * 0.3, 0]} castShadow>
            <meshStandardMaterial color="#5a7fb5" metalness={0.3} roughness={0.5} />
          </mesh>
          <mesh geometry={insulatorDiscGeo} position={[x, height * 0.85 - insulatorHeight * 0.6, 0]} castShadow>
            <meshStandardMaterial color="#5a7fb5" metalness={0.3} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* 塔尖 */}
      <mesh position={[0, height + 1.5, 0]} castShadow>
        <coneGeometry args={[0.15, 1, 8]} />
        <meshStandardMaterial color="#606870" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ==================== 9. Road 道路 ====================
// 平面网格，深灰色
// 有白色车道线

interface RoadProps extends BaseProps {
  width?: number;
  length?: number;
}

export function Road({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = 4,
  length = 20,
}: RoadProps) {
  // 道路主体几何体
  const roadGeo = useMemo(() => new THREE.PlaneGeometry(width, length), [width, length]);
  // 车道线几何体（虚线效果）
  const dashGeo = useMemo(() => new THREE.PlaneGeometry(0.15, 1.5), []);
  // 边线几何体
  const edgeLineGeo = useMemo(() => new THREE.PlaneGeometry(0.12, length), []);

  const dashCount = Math.floor(length / 3);
  const dashSpacing = length / dashCount;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 道路主体 */}
      <mesh geometry={roadGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#3a3a3a" metalness={0.05} roughness={0.95} />
      </mesh>

      {/* 路肩（稍浅灰色） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <planeGeometry args={[width + 0.4, length + 0.4]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.05} roughness={0.9} />
      </mesh>

      {/* 中心车道虚线 */}
      {Array.from({ length: dashCount }).map((_, i) => (
        <mesh
          key={`dash-${i}`}
          geometry={dashGeo}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.03, -length / 2 + dashSpacing * 0.5 + i * dashSpacing]}
          receiveShadow
        >
          <meshStandardMaterial color="#ffffff" metalness={0} roughness={0.9} />
        </mesh>
      ))}

      {/* 左边线 */}
      <mesh
        geometry={edgeLineGeo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-width / 2 + 0.2, 0.03, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#ffffff" metalness={0} roughness={0.9} />
      </mesh>

      {/* 右边线 */}
      <mesh
        geometry={edgeLineGeo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[width / 2 - 0.2, 0.03, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#ffffff" metalness={0} roughness={0.9} />
      </mesh>
    </group>
  );
}

// ==================== 10. GreenArea 绿化带 ====================
// 绿色平面，略高于地面
// 有随机分布的小树（圆锥+圆柱）

interface GreenAreaProps extends BaseProps {
  width?: number;
  depth?: number;
}

export function GreenArea({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = 10,
  depth = 5,
}: GreenAreaProps) {
  // 使用固定种子的伪随机数生成器，确保每次渲染一致
  const trees = useMemo(() => {
    const result: { x: number; z: number; treeHeight: number; crownRadius: number }[] = [];
    // 预定义的树位置（模拟随机分布）
    const treeData = [
      { x: -3.5, z: -1.5, h: 1.8, r: 0.8 },
      { x: -1.2, z: 1.2, h: 2.2, r: 1.0 },
      { x: 1.5, z: -0.8, h: 1.5, r: 0.7 },
      { x: 3.8, z: 1.5, h: 2.0, r: 0.9 },
      { x: -2.5, z: 0.5, h: 1.6, r: 0.75 },
      { x: 0.5, z: -1.8, h: 2.4, r: 1.1 },
      { x: 2.8, z: -1.2, h: 1.3, r: 0.65 },
      { x: -0.5, z: 1.8, h: 1.9, r: 0.85 },
      { x: 4.0, z: -0.3, h: 1.7, r: 0.8 },
      { x: -4.0, z: 0.0, h: 2.1, r: 0.95 },
      { x: 1.0, z: 0.3, h: 1.4, r: 0.7 },
      { x: -1.8, z: -1.0, h: 2.3, r: 1.05 },
    ];

    // 筛选在范围内的树
    for (const tree of treeData) {
      if (Math.abs(tree.x) < width / 2 - 0.5 && Math.abs(tree.z) < depth / 2 - 0.5) {
        result.push({
          x: tree.x,
          z: tree.z,
          treeHeight: tree.h,
          crownRadius: tree.r,
        });
      }
    }
    return result;
  }, [width, depth]);

  // 树干几何体
  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.12, 1, 8), []);
  // 树冠几何体（多层圆锥）
  const crownGeoBottom = useMemo(() => new THREE.ConeGeometry(1, 1, 8), []);
  const crownGeoMiddle = useMemo(() => new THREE.ConeGeometry(0.8, 0.9, 8), []);
  const crownGeoTop = useMemo(() => new THREE.ConeGeometry(0.55, 0.7, 8), []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 绿化带地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow castShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#4a8c3f" metalness={0} roughness={0.95} />
      </mesh>

      {/* 草地纹理层（稍深色） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
        <planeGeometry args={[width - 0.2, depth - 0.2]} />
        <meshStandardMaterial color="#3d7a34" metalness={0} roughness={0.95} />
      </mesh>

      {/* 边沿石 */}
      <mesh position={[0, 0.08, -depth / 2]} castShadow>
        <boxGeometry args={[width + 0.1, 0.12, 0.12]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.08, depth / 2]} castShadow>
        <boxGeometry args={[width + 0.1, 0.12, 0.12]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[-width / 2, 0.08, 0]} castShadow>
        <boxGeometry args={[0.12, 0.12, depth + 0.1]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[width / 2, 0.08, 0]} castShadow>
        <boxGeometry args={[0.12, 0.12, depth + 0.1]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* 树木 */}
      {trees.map((tree, i) => {
        const trunkHeight = tree.treeHeight * 0.4;
        const crownBase = trunkHeight + tree.crownRadius * 0.3;

        return (
          <group key={`tree-${i}`} position={[tree.x, 0.05, tree.z]}>
            {/* 树干 */}
            <mesh
              geometry={trunkGeo}
              position={[0, trunkHeight / 2, 0]}
              scale={[1, trunkHeight, 1]}
              castShadow
            >
              <meshStandardMaterial color="#6b4226" metalness={0} roughness={0.9} />
            </mesh>

            {/* 树冠 - 下层 */}
            <mesh
              geometry={crownGeoBottom}
              position={[0, crownBase, 0]}
              scale={[tree.crownRadius, tree.crownRadius, tree.crownRadius]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#2d6b1e" metalness={0} roughness={0.85} />
            </mesh>

            {/* 树冠 - 中层 */}
            <mesh
              geometry={crownGeoMiddle}
              position={[0, crownBase + tree.crownRadius * 0.6, 0]}
              scale={[tree.crownRadius, tree.crownRadius, tree.crownRadius]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#358524" metalness={0} roughness={0.85} />
            </mesh>

            {/* 树冠 - 顶层 */}
            <mesh
              geometry={crownGeoTop}
              position={[0, crownBase + tree.crownRadius * 1.1, 0]}
              scale={[tree.crownRadius, tree.crownRadius, tree.crownRadius]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#3d9a2c" metalness={0} roughness={0.85} />
            </mesh>
          </group>
        );
      })}

      {/* 灌木丛点缀 */}
      {[
        { x: -2.0, z: -2.0 },
        { x: 2.0, z: 2.0 },
        { x: -3.0, z: 1.5 },
        { x: 3.5, z: -1.5 },
        { x: 0.0, z: -2.2 },
      ].map((bush, i) => (
        <mesh key={`bush-${i}`} position={[bush.x, 0.15, bush.z]} castShadow receiveShadow>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#2a7a1a" metalness={0} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ==================== 11. CoalYard 煤场 ====================
// 大型露天煤场，四周有挡风墙，内部有煤堆（半球体模拟）
// 地面为深灰色煤灰地面

interface CoalYardProps extends BaseProps {
  width?: number;    // 煤场宽度，默认 20
  depth?: number;    // 煤场深度，默认 15
  wallHeight?: number; // 挡风墙高度，默认 3
}

export function CoalYard({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = 20,
  depth = 15,
  wallHeight = 3,
}: CoalYardProps) {
  const wallThickness = 0.3;

  // 煤堆位置（3-4个半球体）
  const coalPiles = useMemo(() => {
    return [
      { x: -4, z: -2, radius: 4 },
      { x: 4, z: -1, radius: 3.5 },
      { x: -2, z: 3.5, radius: 3 },
      { x: 3, z: 3, radius: 3.5 },
    ];
  }, []);

  // 煤堆几何体（半球体）
  const coalPileGeos = useMemo(() => {
    return coalPiles.map((pile) =>
      new THREE.SphereGeometry(pile.radius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2)
    );
  }, [coalPiles]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 煤灰地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow castShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.05} roughness={0.95} />
      </mesh>

      {/* 前挡风墙 */}
      <mesh position={[0, wallHeight / 2, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#555555" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* 后挡风墙 */}
      <mesh position={[0, wallHeight / 2, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#555555" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* 左挡风墙 */}
      <mesh position={[-width / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <meshStandardMaterial color="#555555" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* 右挡风墙 */}
      <mesh position={[width / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <meshStandardMaterial color="#555555" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* 煤堆（半球体） */}
      {coalPileGeos.map((geo, i) => (
        <mesh
          key={`pile-${i}`}
          geometry={geo}
          position={[coalPiles[i].x, 0.05, coalPiles[i].z]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#2d2d2d" metalness={0.1} roughness={0.95} />
        </mesh>
      ))}

      {/* 挡风墙顶部压顶 */}
      <mesh position={[0, wallHeight + 0.1, depth / 2]} castShadow>
        <boxGeometry args={[width + 0.1, 0.2, wallThickness + 0.1]} />
        <meshStandardMaterial color="#666666" metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[0, wallHeight + 0.1, -depth / 2]} castShadow>
        <boxGeometry args={[width + 0.1, 0.2, wallThickness + 0.1]} />
        <meshStandardMaterial color="#666666" metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[-width / 2, wallHeight + 0.1, 0]} castShadow>
        <boxGeometry args={[wallThickness + 0.1, 0.2, depth + 0.1]} />
        <meshStandardMaterial color="#666666" metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[width / 2, wallHeight + 0.1, 0]} castShadow>
        <boxGeometry args={[wallThickness + 0.1, 0.2, depth + 0.1]} />
        <meshStandardMaterial color="#666666" metalness={0.2} roughness={0.7} />
      </mesh>
    </group>
  );
}

// ==================== 12. DesulfurizationTower 脱硫塔 ====================
// 圆柱形塔体，比冷却塔细但更高，顶部有出口烟道
// 底部有浆液循环泵房，塔体有环形加强筋

interface DesulfurizationTowerProps extends BaseProps {
  height?: number;  // 塔体高度，默认 18
  radius?: number;  // 塔体半径，默认 3
}

export function DesulfurizationTower({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  height = 18,
  radius = 3,
}: DesulfurizationTowerProps) {
  // 环形加强筋位置（每隔3米一个）
  const ringPositions = useMemo(() => {
    const positions: number[] = [];
    for (let y = 3; y < height; y += 3) {
      positions.push(y);
    }
    return positions;
  }, [height]);

  // 加强筋几何体（扁平圆柱环）
  const ringGeo = useMemo(
    () => new THREE.TorusGeometry(radius + 0.08, 0.1, 8, 32),
    [radius]
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 塔体主体圆柱 */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 32]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* 顶部封盖 */}
      <mesh position={[0, height, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.3, 32]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* 底部封板 */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.3, 32]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* 顶部出口烟道（横向小圆柱，朝向侧面） */}
      <mesh
        position={[radius + 2, height - 1, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.5, 1.5, 4, 24]} />
        <meshStandardMaterial color="#d8d8d8" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* 烟道与塔体连接处加固环 */}
      <mesh position={[radius, height - 1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.3, 24]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* 环形加强筋（每隔3米一个） */}
      {ringPositions.map((y, i) => (
        <mesh
          key={`ring-${i}`}
          geometry={ringGeo}
          position={[0, y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <meshStandardMaterial color="#b0b0b0" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}

      {/* 底部浆液循环泵房（小方形建筑） */}
      <mesh position={[radius + 2.5, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 3, 3]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.2} roughness={0.7} />
      </mesh>

      {/* 泵房屋顶 */}
      <mesh position={[radius + 2.5, 3.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.3, 0.3, 3.3]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* 泵房门 */}
      <mesh position={[radius + 2.5, 1.2, 1.51]} castShadow receiveShadow>
        <planeGeometry args={[1.5, 2.4]} />
        <meshStandardMaterial color="#606060" metalness={0.3} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* 连接管道（泵房到塔体） */}
      <mesh
        position={[radius + 0.5, 1, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.3, 0.3, 2, 12]} />
        <meshStandardMaterial color="#a0a8b0" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

// ==================== 13. ElectrostaticPrecipitator 除尘器 ====================
// 大型方形设备，多个并列
// 顶部有集尘箱，底部有灰斗，侧面有管道接口

interface ElectrostaticPrecipitatorProps extends BaseProps {
  width?: number;   // 主体宽度，默认 6
  height?: number;  // 主体高度，默认 10
  depth?: number;   // 主体深度，默认 4
}

export function ElectrostaticPrecipitator({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = 6,
  height = 10,
  depth = 4,
}: ElectrostaticPrecipitatorProps) {
  // 侧面管道接口几何体
  const pipeGeo = useMemo(() => new THREE.CylinderGeometry(0.4, 0.4, 1.5, 12), []);
  // 法兰几何体
  const flangeGeo = useMemo(() => new THREE.CylinderGeometry(0.6, 0.6, 0.12, 12), []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 方形主体 */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 顶部集尘箱（稍宽的方形） */}
      <mesh position={[0, height + 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.4, 2.4, depth + 0.3]} />
        <meshStandardMaterial color="#909090" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 集尘箱顶部封板 */}
      <mesh position={[0, height + 2.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.5, 0.1, depth + 0.4]} />
        <meshStandardMaterial color="#808080" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 底部灰斗（倒梯形，用缩小的box模拟） */}
      <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.6, 2.4, depth * 0.6]} />
        <meshStandardMaterial color="#888888" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 灰斗出口 */}
      <mesh position={[0, -2.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.5, 0.5, 12]} />
        <meshStandardMaterial color="#707070" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 侧面进出口管道接口 - 左侧 */}
      <mesh
        geometry={pipeGeo}
        position={[-width / 2 - 0.75, height * 0.7, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#a0a8b0" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh
        geometry={flangeGeo}
        position={[-width / 2 - 1.55, height * 0.7, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 侧面进出口管道接口 - 右侧 */}
      <mesh
        geometry={pipeGeo}
        position={[width / 2 + 0.75, height * 0.7, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#a0a8b0" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh
        geometry={flangeGeo}
        position={[width / 2 + 1.55, height * 0.7, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#808890" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 主体加强筋（水平环带） */}
      {[height * 0.25, height * 0.5, height * 0.75].map((y, i) => (
        <mesh key={`rib-${i}`} position={[0, y, depth / 2 + 0.05]} castShadow>
          <boxGeometry args={[width + 0.2, 0.15, 0.1]} />
          <meshStandardMaterial color="#808080" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* 底部支撑腿 */}
      {[
        [-width / 2 + 0.5, -depth / 2 + 0.5],
        [width / 2 - 0.5, -depth / 2 + 0.5],
        [-width / 2 + 0.5, depth / 2 - 0.5],
        [width / 2 - 0.5, depth / 2 - 0.5],
      ].map(([x, z], i) => (
        <mesh key={`leg-${i}`} position={[x, -0.5, z]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshStandardMaterial color="#707070" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ==================== 14. TransformerStation 升压站/变压器区 ====================
// 户外变压器设备，多个变压器横向排列
// 每个变压器包含方形箱体、散热片和绝缘套管

interface TransformerStationProps extends BaseProps {
  count?: number;  // 变压器数量，默认 3
}

export function TransformerStation({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  count = 3,
}: TransformerStationProps) {
  const spacing = 5; // 变压器间距

  // 散热片几何体（竖直薄板）
  const finGeo = useMemo(() => new THREE.BoxGeometry(0.08, 2.2, 2.8), []);
  // 绝缘套管几何体
  const insulatorGeo = useMemo(() => new THREE.CylinderGeometry(0.12, 0.15, 1.5, 8), []);
  // 绝缘套管盘几何体
  const insulatorDiscGeo = useMemo(() => new THREE.CylinderGeometry(0.25, 0.25, 0.08, 12), []);

  // 计算总宽度用于混凝土基础平台
  const totalWidth = count * 3 + (count - 1) * (spacing - 3);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 混凝土基础平台 */}
      <mesh position={[0, -0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[totalWidth + 2, 0.3, 5]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.1} roughness={0.85} />
      </mesh>

      {/* 变压器组 */}
      {Array.from({ length: count }).map((_, idx) => {
        const offsetX = (idx - (count - 1) / 2) * spacing;

        return (
          <group key={`transformer-${idx}`} position={[offsetX, 0, 0]}>
            {/* 变压器主体箱体 */}
            <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[3, 2.5, 2.5]} />
              <meshStandardMaterial color="#8B7355" metalness={0.3} roughness={0.6} />
            </mesh>

            {/* 散热片 - 左侧 */}
            {Array.from({ length: 8 }).map((_, fi) => (
              <mesh
                key={`fin-left-${fi}`}
                geometry={finGeo}
                position={[-1.6, 1.25, -1.2 + fi * 0.35]}
                castShadow
              >
                <meshStandardMaterial color="#707070" metalness={0.6} roughness={0.35} />
              </mesh>
            ))}

            {/* 散热片 - 右侧 */}
            {Array.from({ length: 8 }).map((_, fi) => (
              <mesh
                key={`fin-right-${fi}`}
                geometry={finGeo}
                position={[1.6, 1.25, -1.2 + fi * 0.35]}
                castShadow
              >
                <meshStandardMaterial color="#707070" metalness={0.6} roughness={0.35} />
              </mesh>
            ))}

            {/* 绝缘套管 - 顶部4个 */}
            {[
              [-0.6, 0.6],
              [-0.2, 0.6],
              [0.2, 0.6],
              [0.6, 0.6],
            ].map(([ix, iz], ii) => (
              <group key={`insulator-${ii}`}>
                <mesh
                  geometry={insulatorGeo}
                  position={[ix, 3.25, iz]}
                  castShadow
                >
                  <meshStandardMaterial color="#A0522D" metalness={0.2} roughness={0.7} />
                </mesh>
                {/* 套管裙边 */}
                <mesh
                  geometry={insulatorDiscGeo}
                  position={[ix, 3.0, iz]}
                  castShadow
                >
                  <meshStandardMaterial color="#A0522D" metalness={0.2} roughness={0.7} />
                </mesh>
                <mesh
                  geometry={insulatorDiscGeo}
                  position={[ix, 3.5, iz]}
                  castShadow
                >
                  <meshStandardMaterial color="#A0522D" metalness={0.2} roughness={0.7} />
                </mesh>
              </group>
            ))}

            {/* 变压器底座 */}
            <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[3.2, 0.3, 2.7]} />
              <meshStandardMaterial color="#606060" metalness={0.3} roughness={0.6} />
            </mesh>
          </group>
        );
      })}

      {/* 围栏（简易表示） */}
      <mesh position={[0, 0.5, totalWidth > 0 ? totalWidth / 2 + 1.5 : 3]} castShadow>
        <boxGeometry args={[totalWidth + 4, 1, 0.05]} />
        <meshStandardMaterial color="#909090" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.5, -(totalWidth > 0 ? totalWidth / 2 + 1.5 : 3)]} castShadow>
        <boxGeometry args={[totalWidth + 4, 1, 0.05]} />
        <meshStandardMaterial color="#909090" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

// ==================== 15. CoalConveyorBelt 输煤栈桥 ====================
// 架空输煤皮带走廊，有支撑柱、走廊桥面和护栏

interface CoalConveyorBeltProps extends BaseProps {
  length?: number;  // 栈桥长度，默认 15
  height?: number;  // 架空高度，默认 5
  width?: number;   // 走廊宽度，默认 2
}

export function CoalConveyorBelt({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  length = 15,
  height = 5,
  width = 2,
}: CoalConveyorBeltProps) {
  // 支撑柱几何体
  const pillarGeo = useMemo(
    () => new THREE.CylinderGeometry(0.15, 0.2, height, 12),
    [height]
  );

  // 支撑柱位置（每隔5米一个）
  const pillarPositions = useMemo(() => {
    const positions: number[] = [];
    for (let x = -length / 2; x <= length / 2; x += 5) {
      positions.push(x);
    }
    return positions;
  }, [length]);

  // 护栏竖杆几何体
  const railPostGeo = useMemo(() => new THREE.CylinderGeometry(0.03, 0.03, 1, 8), []);
  // 护栏横杆几何体
  const railBarGeo = useMemo(() => new THREE.CylinderGeometry(0.025, 0.025, length, 8), []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 走廊桥面 */}
      <mesh position={[0, height, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.3, width]} />
        <meshStandardMaterial color="#808080" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* 走廊底板 */}
      <mesh position={[0, height - 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.1, width - 0.2]} />
        <meshStandardMaterial color="#707070" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* 支撑柱 */}
      {pillarPositions.map((x, i) => (
        <group key={`pillar-${i}`}>
          {/* 左柱 */}
          <mesh
            geometry={pillarGeo}
            position={[x, height / 2, -width / 2 + 0.2]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#a0a0a0" metalness={0.4} roughness={0.5} />
          </mesh>
          {/* 右柱 */}
          <mesh
            geometry={pillarGeo}
            position={[x, height / 2, width / 2 - 0.2]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#a0a0a0" metalness={0.4} roughness={0.5} />
          </mesh>
          {/* 横撑 */}
          <mesh
            position={[x, height / 2, 0]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.06, 0.06, width - 0.4, 8]} />
            <meshStandardMaterial color="#a0a0a0" metalness={0.4} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* 护栏 - 左侧 */}
      {pillarPositions.map((x, i) => (
        <mesh
          key={`rail-left-post-${i}`}
          geometry={railPostGeo}
          position={[x, height + 0.65, -width / 2]}
          castShadow
        >
          <meshStandardMaterial color="#c0c0c0" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <mesh
        geometry={railBarGeo}
        position={[0, height + 1.1, -width / 2]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#c0c0c0" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 护栏 - 右侧 */}
      {pillarPositions.map((x, i) => (
        <mesh
          key={`rail-right-post-${i}`}
          geometry={railPostGeo}
          position={[x, height + 0.65, width / 2]}
          castShadow
        >
          <meshStandardMaterial color="#c0c0c0" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <mesh
        geometry={railBarGeo}
        position={[0, height + 1.1, width / 2]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#c0c0c0" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* V形托辊支架（底部） */}
      {pillarPositions.map((x, i) => (
        <group key={`roller-${i}`} position={[x, height - 0.35, 0]}>
          {/* 左托辊 */}
          <mesh rotation={[0, 0, -Math.PI / 6]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, width * 0.4, 8]} />
            <meshStandardMaterial color="#909090" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* 右托辊 */}
          <mesh rotation={[0, 0, Math.PI / 6]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, width * 0.4, 8]} />
            <meshStandardMaterial color="#909090" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* 中心托辊 */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, width * 0.3, 8]} />
            <meshStandardMaterial color="#909090" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ==================== 16. WaterTreatment 化学水处理室 ====================
// 小型厂房建筑，浅蓝色外墙
// 屋顶有圆形通风口，侧面有管道进出口，门口有台阶

interface WaterTreatmentProps extends BaseProps {
  width?: number;   // 建筑宽度，默认 8
  depth?: number;   // 建筑深度，默认 5
  height?: number;  // 建筑高度，默认 4
}

export function WaterTreatment({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = 8,
  depth = 5,
  height = 4,
}: WaterTreatmentProps) {
  // 通风口几何体
  const ventGeo = useMemo(() => new THREE.CylinderGeometry(0.3, 0.3, 0.5, 12), []);
  // 管道接口几何体
  const pipeGeo = useMemo(() => new THREE.CylinderGeometry(0.2, 0.2, 1.2, 12), []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 主体方形建筑 */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#b0d4e8" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* 屋顶 */}
      <mesh position={[0, height + 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.3, 0.3, depth + 0.3]} />
        <meshStandardMaterial color="#8ab8d0" metalness={0.15} roughness={0.7} />
      </mesh>

      {/* 屋顶通风口（多个圆形突起） */}
      {[
        [-2, -1],
        [2, -1],
        [0, 1],
      ].map(([vx, vz], i) => (
        <mesh
          key={`vent-${i}`}
          geometry={ventGeo}
          position={[vx, height + 0.55, vz]}
          castShadow
        >
          <meshStandardMaterial color="#909090" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}

      {/* 通风口顶盖 */}
      {[
        [-2, -1],
        [2, -1],
        [0, 1],
      ].map(([vx, vz], i) => (
        <mesh
          key={`vent-cap-${i}`}
          position={[vx, height + 0.9, vz]}
          castShadow
        >
          <cylinderGeometry args={[0.4, 0.4, 0.08, 12]} />
          <meshStandardMaterial color="#808080" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}

      {/* 侧面管道进出口 - 左侧 */}
      <mesh
        geometry={pipeGeo}
        position={[-width / 2 - 0.6, height * 0.6, -1]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#a0a8b0" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh
        geometry={pipeGeo}
        position={[-width / 2 - 0.6, height * 0.3, 1]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#a0a8b0" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 侧面管道进出口 - 右侧 */}
      <mesh
        geometry={pipeGeo}
        position={[width / 2 + 0.6, height * 0.5, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#a0a8b0" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 门口台阶 */}
      <mesh position={[0, 0.15, depth / 2 + 0.3]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.3, 0.6]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.1} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.35, depth / 2 + 0.7]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.3, 0.4]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.1} roughness={0.85} />
      </mesh>

      {/* 门 */}
      <mesh position={[0, height * 0.35, depth / 2 + 0.01]} castShadow receiveShadow>
        <planeGeometry args={[1.6, 2.8]} />
        <meshStandardMaterial color="#505050" metalness={0.3} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* 窗户 */}
      {[-2.5, 2.5].map((wx, i) => (
        <mesh
          key={`window-${i}`}
          position={[wx, height * 0.55, depth / 2 + 0.01]}
          castShadow
          receiveShadow
        >
          <planeGeometry args={[1.2, 1.2]} />
          <meshStandardMaterial
            color="#88ccff"
            transparent
            opacity={0.5}
            metalness={0.8}
            roughness={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ==================== 17. AshSilo 灰库 ====================
// 圆柱形灰库，顶部锥形盖，底部有出灰口
// 侧面有爬梯，金属材质

interface AshSiloProps extends BaseProps {
  radius?: number;  // 灰库半径，默认 2.5
  height?: number;  // 灰库高度，默认 8
}

export function AshSilo({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  radius = 2.5,
  height = 8,
}: AshSiloProps) {
  // 爬梯竖杆几何体
  const ladderRailGeo = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, height, 8), [height]);
  // 爬梯横档几何体
  const ladderRungGeo = useMemo(() => new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), []);

  const rungCount = Math.floor(height / 0.8);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 圆柱主体 */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 32]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 顶部锥形盖 */}
      <mesh position={[0, height + 1.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[radius, 2.4, 32]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 顶部检修口 */}
      <mesh position={[0, height + 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#808080" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 底部出灰口（小圆锥朝下） */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.8, 1.2, 16]} />
        <meshStandardMaterial color="#909090" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 出灰口管道 */}
      <mesh position={[0, -1.4, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.8, 12]} />
        <meshStandardMaterial color="#808080" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 底部基座 */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius + 0.2, radius + 0.3, 0.3, 32]} />
        <meshStandardMaterial color="#909090" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* 爬梯 - 左竖杆 */}
      <mesh
        geometry={ladderRailGeo}
        position={[radius + 0.3, height / 2, 0]}
        castShadow
      >
        <meshStandardMaterial color="#707070" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 爬梯 - 右竖杆 */}
      <mesh
        geometry={ladderRailGeo}
        position={[radius + 0.8, height / 2, 0]}
        castShadow
      >
        <meshStandardMaterial color="#707070" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 爬梯横档 */}
      {Array.from({ length: rungCount }).map((_, i) => (
        <mesh
          key={`rung-${i}`}
          geometry={ladderRungGeo}
          position={[radius + 0.55, 0.5 + i * 0.8, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <meshStandardMaterial color="#707070" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* 环形加强筋 */}
      {[height * 0.25, height * 0.5, height * 0.75].map((y, i) => (
        <mesh key={`ring-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[radius + 0.05, 0.06, 8, 32]} />
          <meshStandardMaterial color="#909090" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}


