// ==========================================
// 数字孪生系统 - 工厂环境渲染组件
// ==========================================
// 提供逼真的工厂环境，包括天空、地面、光照和雾效。
// 使用 @react-three/drei 的 Sky 组件实现天空渲染，
// 程序化生成草地纹理作为地面材质。
// ==========================================

import { useMemo } from 'react';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';

// ==================== 草地纹理生成 ====================

/** 使用 Canvas 程序化生成草地纹理 */
function createGrassTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 基础绿色
  ctx.fillStyle = '#4a8c3f';
  ctx.fillRect(0, 0, 512, 512);

  // 随机噪点模拟草地
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const shade = Math.random() * 30 - 15;
    const r = 74 + shade;
    const g = 140 + shade;
    const b = 63 + shade;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 20);
  return texture;
}

// ==================== 组件属性定义 ====================

interface FactoryEnvironmentProps {
  floorSize?: { width: number; depth: number };
}

// ==================== 工厂环境组件 ====================

/** 精细工厂环境渲染组件，包含天空、地面、光照和雾效 */
export default function FactoryEnvironment({
  floorSize = { width: 500, depth: 500 },
}: FactoryEnvironmentProps) {
  // 使用 useMemo 缓存草地纹理，避免每次渲染重新生成
  const grassTexture = useMemo(() => createGrassTexture(), []);

  return (
    <>
      {/* 天空 - 使用 @react-three/drei 的 Sky 组件 */}
      <Sky
        sunPosition={[100, 50, 100]}
        turbidity={8}
        rayleigh={2}
      />

      {/* 地面 - 大型平面，使用程序化草地纹理 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[floorSize.width, floorSize.depth]} />
        <meshStandardMaterial map={grassTexture} />
      </mesh>

      {/* 环境光 - 暖白色，提供基础照明 */}
      <ambientLight intensity={0.5} color="#fff5e6" />

      {/* 太阳光 - 主光源，带阴影 */}
      <directionalLight
        intensity={1.5}
        position={[50, 80, 50]}
        castShadow
        color="#ffffff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* 半球光 - 模拟天空和地面的反射光 */}
      <hemisphereLight
        color="#87CEEB"
        groundColor="#4a7c59"
        intensity={0.3}
      />

      {/* 雾效 - 增加场景深度感 */}
      <fog attach="fog" args={['#c8d8e8', 50, 200]} />
    </>
  );
}
