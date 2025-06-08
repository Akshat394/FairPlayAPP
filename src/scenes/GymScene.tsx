import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Plane, Text, Cylinder } from '@react-three/drei'
import { useBox, usePlane, useCompoundBody } from '@react-three/cannon'
import * as THREE from 'three'
import PlayerController from '@components/3D/PlayerController'
import Equipment from '@components/3D/Equipment'
import InteractionZone from '@components/3D/InteractionZone'
import FormFeedback from '@components/3D/FormFeedback'
import FatigueVisualization from '@components/3D/FatigueVisualization'

const GymScene: React.FC = () => {
  const [playerFatigue, setPlayerFatigue] = useState(0)
  const [activeEquipment, setActiveEquipment] = useState<string | null>(null)

  // Ground physics
  const [groundRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: { friction: 0.9, restitution: 0.1 }
  }))

  // Walls
  const [wallRef1] = useBox(() => ({
    position: [0, 5, -20],
    args: [40, 10, 1],
    type: 'Static'
  }))

  const [wallRef2] = useBox(() => ({
    position: [0, 5, 20],
    args: [40, 10, 1],
    type: 'Static'
  }))

  const [wallRef3] = useBox(() => ({
    position: [-20, 5, 0],
    args: [1, 10, 40],
    type: 'Static'
  }))

  const [wallRef4] = useBox(() => ({
    position: [20, 5, 0],
    args: [1, 10, 40],
    type: 'Static'
  }))

  const handleEquipmentUse = (equipmentId: string, exerciseData: any) => {
    setActiveEquipment(equipmentId)
    
    // Simulate fatigue increase
    setPlayerFatigue(prev => Math.min(100, prev + exerciseData.intensity * 5))
    
    // Trigger form feedback
    console.log('Exercise data:', exerciseData)
  }

  return (
    <>
      {/* Ground */}
      <Plane ref={groundRef} args={[40, 40]} receiveShadow>
        <meshStandardMaterial color="#2d3748" />
      </Plane>

      {/* Walls (invisible physics bodies) */}
      <Box ref={wallRef1} args={[40, 10, 1]} position={[0, 5, -20]} visible={false} />
      <Box ref={wallRef2} args={[40, 10, 1]} position={[0, 5, 20]} visible={false} />
      <Box ref={wallRef3} args={[1, 10, 40]} position={[-20, 5, 0]} visible={false} />
      <Box ref={wallRef4} args={[1, 10, 40]} position={[20, 5, 0]} visible={false} />

      {/* Gym Title */}
      <Text
        position={[0, 8, -19]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Smart Gym - Physics Training Center
      </Text>

      {/* Equipment */}
      <Equipment
        id="treadmill-1"
        type="treadmill"
        position={[-10, 0, -10]}
        rotation={[0, 0, 0]}
        onUse={handleEquipmentUse}
        isOccupied={activeEquipment === 'treadmill-1'}
      />

      <Equipment
        id="bench-press-1"
        type="bench-press"
        position={[0, 0, -10]}
        rotation={[0, 0, 0]}
        onUse={handleEquipmentUse}
        isOccupied={activeEquipment === 'bench-press-1'}
      />

      <Equipment
        id="squat-rack-1"
        type="squat-rack"
        position={[10, 0, -10]}
        rotation={[0, 0, 0]}
        onUse={handleEquipmentUse}
        isOccupied={activeEquipment === 'squat-rack-1'}
      />

      <Equipment
        id="rowing-machine-1"
        type="rowing-machine"
        position={[-10, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        onUse={handleEquipmentUse}
        isOccupied={activeEquipment === 'rowing-machine-1'}
      />

      <Equipment
        id="weights-1"
        type="weights"
        position={[10, 0, 0]}
        rotation={[0, 0, 0]}
        onUse={handleEquipmentUse}
        isOccupied={activeEquipment === 'weights-1'}
      />

      {/* Mirrors (reflective surfaces) */}
      <Box args={[0.1, 8, 15]} position={[-19.5, 4, 0]} receiveShadow>
        <meshStandardMaterial color="#87ceeb" metalness={0.9} roughness={0.1} />
      </Box>

      <Box args={[15, 8, 0.1]} position={[0, 4, -19.5]} receiveShadow>
        <meshStandardMaterial color="#87ceeb" metalness={0.9} roughness={0.1} />
      </Box>

      {/* Free Weights Area */}
      <group position={[0, 0, 10]}>
        <Text
          position={[0, 3, 0]}
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Free Weights Area
        </Text>
        
        {/* Dumbbells */}
        {Array.from({ length: 10 }, (_, i) => (
          <group key={i} position={[-8 + i * 2, 0, 0]}>
            <Cylinder args={[0.1, 0.1, 1]} rotation={[0, 0, Math.PI / 2]} position={[0, 0.5, 0]} castShadow>
              <meshStandardMaterial color="#4a5568" />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 0.2]} position={[-0.4, 0.5, 0]} castShadow>
              <meshStandardMaterial color="#2d3748" />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 0.2]} position={[0.4, 0.5, 0]} castShadow>
              <meshStandardMaterial color="#2d3748" />
            </Cylinder>
          </group>
        ))}
      </group>

      {/* Interaction Zones */}
      <InteractionZone
        position={[0, 0, 18]}
        radius={2}
        type="building-enter"
        target="plaza"
        label="Exit to Plaza"
      />

      {/* Form Feedback System */}
      {activeEquipment && (
        <FormFeedback
          position={[0, 6, 0]}
          equipmentType={activeEquipment.split('-')[0] as any}
          playerPosition={[0, 0, 0]}
          isActive={true}
        />
      )}

      {/* Fatigue Visualization */}
      <FatigueVisualization
        position={[15, 2, 15]}
        fatigueLevel={playerFatigue}
        maxFatigue={100}
      />

      {/* Player Controller */}
      <PlayerController />
    </>
  )
}

export default GymScene