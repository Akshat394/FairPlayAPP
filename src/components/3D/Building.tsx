import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Text, Html } from '@react-three/drei'
import { useBox } from '@react-three/cannon'
import * as THREE from 'three'
import { useAppDispatch } from '@hooks/useRedux'
import { setCurrentScene } from '@store/slices/gameSlice'
import { SceneType } from '@types/index'

interface BuildingProps {
  name: string
  type: SceneType
  position: [number, number, number]
  scale: [number, number, number]
  color: string
  icon: string
  description: string
}

const Building: React.FC<BuildingProps> = ({
  name,
  type,
  position,
  scale,
  color,
  icon,
  description
}) => {
  const dispatch = useAppDispatch()
  const buildingRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  // Physics body for collision
  const [physicsRef] = useBox(() => ({
    position: [position[0], position[1] + scale[1] / 2, position[2]],
    args: scale,
    type: 'Static'
  }))

  // Hover animation
  useFrame((state) => {
    if (buildingRef.current) {
      const targetY = hovered ? position[1] + 0.2 : position[1]
      buildingRef.current.position.y = THREE.MathUtils.lerp(
        buildingRef.current.position.y,
        targetY,
        0.1
      )

      // Gentle floating animation
      buildingRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.05

      // Glow effect when hovered
      if (hovered) {
        const material = buildingRef.current.material as THREE.MeshStandardMaterial
        material.emissive.setHex(parseInt(color.replace('#', ''), 16))
        material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 3) * 0.1
      } else {
        const material = buildingRef.current.material as THREE.MeshStandardMaterial
        material.emissive.setHex(0x000000)
        material.emissiveIntensity = 0
      }
    }
  })

  const handleClick = () => {
    dispatch(setCurrentScene(type))
  }

  const handlePointerEnter = () => {
    setHovered(true)
    setShowInfo(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerLeave = () => {
    setHovered(false)
    setShowInfo(false)
    document.body.style.cursor = 'default'
  }

  return (
    <group position={position}>
      {/* Physics body (invisible) */}
      <Box ref={physicsRef} args={scale} visible={false} />
      
      {/* Visual building */}
      <Box
        ref={buildingRef}
        args={scale}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={hovered ? 0.9 : 0.8}
        />
      </Box>

      {/* Building name */}
      <Text
        position={[0, scale[1] + 1, 0]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {name}
      </Text>

      {/* Icon */}
      <Text
        position={[0, scale[1] / 2, scale[2] / 2 + 0.1]}
        fontSize={2}
        anchorX="center"
        anchorY="middle"
      >
        {icon}
      </Text>

      {/* Info panel */}
      {showInfo && (
        <Html
          position={[0, scale[1] + 2, 0]}
          center
          distanceFactor={10}
          occlude
        >
          <div className="ui-panel" style={{ maxWidth: '300px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: color }}>{name}</h3>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
              {description}
            </p>
            <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.7 }}>
              Click to enter
            </div>
          </div>
        </Html>
      )}

      {/* Entrance glow */}
      <mesh position={[0, 0.1, scale[2] / 2 + 0.5]}>
        <cylinderGeometry args={[2, 2, 0.1, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Particle effects */}
      {hovered && (
        <group>
          {Array.from({ length: 10 }, (_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * scale[0] * 2,
                Math.random() * scale[1] * 2,
                (Math.random() - 0.5) * scale[2] * 2
              ]}
            >
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

export default Building