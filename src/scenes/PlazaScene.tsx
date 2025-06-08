import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Plane, Text, Sphere } from '@react-three/drei'
import { useBox, usePlane } from '@react-three/cannon'
import * as THREE from 'three'
import PlayerController from '@components/3D/PlayerController'
import Building from '@components/3D/Building'
import InteractionZone from '@components/3D/InteractionZone'
import ParticleSystem from '@components/3D/ParticleSystem'
import SpatialAudio from '@components/3D/SpatialAudio'

const PlazaScene: React.FC = () => {
  const fountainRef = useRef<THREE.Mesh>(null)

  // Ground physics
  const [groundRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: { friction: 0.8, restitution: 0.1 }
  }))

  // Animated fountain
  useFrame((state) => {
    if (fountainRef.current) {
      fountainRef.current.rotation.y += 0.01
      fountainRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <>
      {/* Ground */}
      <Plane ref={groundRef} args={[100, 100]} receiveShadow>
        <meshStandardMaterial color="#4a5568" />
      </Plane>

      {/* Central Fountain */}
      <group position={[0, 0, 0]}>
        <Sphere ref={fountainRef} args={[1, 16, 16]} position={[0, 1, 0]} castShadow>
          <meshStandardMaterial color="#3182ce" metalness={0.8} roughness={0.2} />
        </Sphere>
        <ParticleSystem
          position={[0, 2, 0]}
          count={100}
          color="#87ceeb"
          size={0.05}
          spread={2}
          velocity={[0, 5, 0]}
        />
        <SpatialAudio
          url="/audio/fountain.mp3"
          position={[0, 1, 0]}
          volume={0.3}
          loop
          autoplay
        />
      </group>

      {/* Welcome Sign */}
      <Text
        position={[0, 4, -8]}
        fontSize={2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Welcome to FairPlay Metaverse
      </Text>

      {/* Buildings */}
      <Building
        name="Smart Gym"
        type="gym"
        position={[-15, 0, -10]}
        scale={[4, 6, 4]}
        color="#e53e3e"
        icon="🏋️"
        description="Train with physics-enabled equipment and real-time form feedback"
      />

      <Building
        name="Medical Hub"
        type="medical-hub"
        position={[15, 0, -10]}
        scale={[4, 6, 4]}
        color="#38a169"
        icon="🏥"
        description="Consult with doctors and analyze supplements"
      />

      <Building
        name="Coach Colosseum"
        type="coach-colosseum"
        position={[-15, 0, 10]}
        scale={[4, 6, 4]}
        color="#3182ce"
        icon="🏟️"
        description="Interactive training sessions and workshops"
      />

      <Building
        name="Game Hall"
        type="game-hall"
        position={[15, 0, 10]}
        scale={[4, 6, 4]}
        color="#805ad5"
        icon="🎮"
        description="Mini-games and leaderboard challenges"
      />

      <Building
        name="Forum Space"
        type="forum-space"
        position={[0, 0, 15]}
        scale={[6, 4, 4]}
        color="#d69e2e"
        icon="💬"
        description="Community discussions and expert Q&A"
      />

      {/* Interaction Zones */}
      <InteractionZone
        position={[0, 0, -12]}
        radius={3}
        type="building-enter"
        target="information-center"
        label="Information Center"
      />

      {/* Decorative Elements */}
      <group position={[-8, 0, 0]}>
        <Box args={[0.5, 2, 0.5]} position={[0, 1, 0]} castShadow>
          <meshStandardMaterial color="#2d3748" />
        </Box>
        <Sphere args={[0.3]} position={[0, 2.5, 0]} castShadow>
          <meshStandardMaterial color="#f7fafc" emissive="#f7fafc" emissiveIntensity={0.5} />
        </Sphere>
      </group>

      <group position={[8, 0, 0]}>
        <Box args={[0.5, 2, 0.5]} position={[0, 1, 0]} castShadow>
          <meshStandardMaterial color="#2d3748" />
        </Box>
        <Sphere args={[0.3]} position={[0, 2.5, 0]} castShadow>
          <meshStandardMaterial color="#f7fafc" emissive="#f7fafc" emissiveIntensity={0.5} />
        </Sphere>
      </group>

      {/* Player Controller */}
      <PlayerController />

      {/* Ambient Sounds */}
      <SpatialAudio
        url="/audio/plaza-ambient.mp3"
        position={[0, 0, 0]}
        volume={0.2}
        loop
        autoplay
        refDistance={50}
      />
    </>
  )
}

export default PlazaScene