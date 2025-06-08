import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { AvatarConfig } from '@types/index'

interface AvatarProps {
  config: AvatarConfig
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  isPlayer?: boolean
  animation?: string
}

const Avatar: React.FC<AvatarProps> = ({
  config,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  isPlayer = false,
  animation = 'idle'
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/avatar-base.glb')
  const { actions, mixer } = useAnimations(animations, groupRef)

  // Apply avatar customization
  useEffect(() => {
    if (!scene) return

    // Scale based on height and weight
    const heightScale = config.height / 1.75 // Normalize to average height
    const weightScale = Math.sqrt(config.weight / 70) // Normalize to average weight
    
    scene.scale.set(
      heightScale * weightScale * 0.8,
      heightScale,
      heightScale * weightScale * 0.8
    )

    // Apply body type modifications
    scene.traverse((child) => {
      if (child instanceof THREE.SkinnedMesh) {
        const mesh = child as THREE.SkinnedMesh
        
        // Modify body proportions based on body type
        switch (config.bodyType) {
          case 'slim':
            mesh.scale.setX(0.9)
            break
          case 'muscular':
            mesh.scale.setX(1.2)
            mesh.scale.setZ(1.1)
            break
          case 'heavy':
            mesh.scale.setX(1.3)
            mesh.scale.setZ(1.2)
            break
          default: // athletic
            mesh.scale.setX(1.0)
            break
        }

        // Apply skin tone
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.color.setHex(parseInt(config.customization.skinTone.replace('#', ''), 16))
        }
      }
    })

    // Apply gear
    config.gear.forEach(gearItem => {
      if (gearItem.equipped) {
        // Load and attach gear models
        // This would be implemented with actual gear GLB files
        console.log('Equipping gear:', gearItem.name)
      }
    })
  }, [config, scene])

  // Handle animations
  useEffect(() => {
    if (!actions) return

    // Stop all current animations
    Object.values(actions).forEach(action => action?.stop())

    // Play the requested animation
    const currentAnimation = actions[animation] || actions['idle']
    if (currentAnimation) {
      currentAnimation.reset().fadeIn(0.2).play()
    }

    return () => {
      if (currentAnimation) {
        currentAnimation.fadeOut(0.2)
      }
    }
  }, [animation, actions])

  // Animation blending for smooth transitions
  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta)
    }

    // Add subtle breathing animation for idle state
    if (animation === 'idle' && groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02
    }

    // Sport-specific idle animations
    if (config.sport !== 'general' && animation === 'idle') {
      // Add sport-specific micro-movements
      switch (config.sport) {
        case 'sprinting':
          // Slight forward lean
          if (groupRef.current) {
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.02
          }
          break
        case 'weightlifting':
          // Wider stance simulation
          if (groupRef.current) {
            groupRef.current.scale.z = 1.1
          }
          break
        // Add more sport-specific animations
      }
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
      
      {/* Name tag for other players */}
      {!isPlayer && (
        <mesh position={[0, 2.5, 0]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="#000000" opacity={0.7} transparent />
        </mesh>
      )}
      
      {/* Sport indicator */}
      {config.sport !== 'general' && (
        <mesh position={[0, 2.8, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color={getSportColor(config.sport)} />
        </mesh>
      )}
    </group>
  )
}

const getSportColor = (sport: string): string => {
  const colors: Record<string, string> = {
    sprinting: '#ff6b6b',
    swimming: '#4ecdc4',
    weightlifting: '#45b7d1',
    cycling: '#96ceb4',
    gymnastics: '#ffeaa7',
    football: '#dda0dd',
    basketball: '#ff7675',
    tennis: '#74b9ff'
  }
  return colors[sport] || '#ffffff'
}

// Preload the avatar model
useGLTF.preload('/models/avatar-base.glb')

export default Avatar