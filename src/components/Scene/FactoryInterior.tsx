// ==========================================
// 数字孪生系统 - 厂房内部场景组件
// ==========================================
// 当相机进入厂房范围时，显示厂房内部场景：
// 室内地板、设备基础、管道、室内灯光、控制室等。
// ==========================================

interface FactoryInteriorProps {
  position?: [number, number, number];
  width?: number;
  depth?: number;
  visible: boolean;
}

/** 厂房内部场景组件 */
export default function FactoryInterior({
  position = [0, 0, 0],
  width = 20,
  depth = 12,
  visible,
}: FactoryInteriorProps) {
  if (!visible) return null;

  return (
    <group position={position}>
      {/* 室内地板 - 工业灰色 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[width - 1, depth - 1]} />
        <meshStandardMaterial color="#808080" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* 地面标线 - 安全通道（黄色虚线） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[width - 2, 0.15]} />
        <meshStandardMaterial color="#f6c23e" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, depth / 2 - 1]}>
        <planeGeometry args={[width - 2, 0.15]} />
        <meshStandardMaterial color="#f6c23e" />
      </mesh>

      {/* 设备基础平台 */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[width - 4, 0.6, depth - 4]} />
        <meshStandardMaterial color="#606060" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* 室内管道 - 横向 */}
      {[-3, 0, 3].map((z, i) => (
        <mesh key={`pipe-h-${i}`} position={[0, 5, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, width - 2, 16]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* 室内管道 - 纵向 */}
      {[-5, 0, 5].map((x, i) => (
        <mesh key={`pipe-v-${i}`} position={[x, 4.5, 0]}>
          <cylinderGeometry args={[0.12, 0.12, depth - 2, 16]} />
          <meshStandardMaterial color="#a0a0a0" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* 室内照明 - 工业灯 */}
      {[-4, 0, 4].map((x, i) => (
        <group key={`light-${i}`}>
          <pointLight position={[x, 7, 0]} intensity={2} distance={15} color="#fff5e0" />
          <mesh position={[x, 7.5, 0]}>
            <boxGeometry args={[1.5, 0.1, 0.3]} />
            <meshStandardMaterial color="#ffffff" emissive="#fff5e0" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}

      {/* 控制室 - 玻璃隔间 */}
      <mesh position={[width / 2 - 2, 2, -depth / 2 + 2]}>
        <boxGeometry args={[3, 4, 3]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 安全标识柱 */}
      {[-width / 2 + 1.5, width / 2 - 1.5].map((x, i) => (
        <mesh key={`pillar-${i}`} position={[x, 1.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
          <meshStandardMaterial color={i === 0 ? "#e53e3e" : "#38a169"} />
        </mesh>
      ))}
    </group>
  );
}
