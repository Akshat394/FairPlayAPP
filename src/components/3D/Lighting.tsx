import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppSelector } from '@hooks/useRedux'

const Lighting: React.FC = () => {
  const currentScene = useAppSelector(state => state.game.currentScene)
  const sunRef = useRef<THREE.DirectionalLight>(null)
  const timeOfDay = new Date().getHours()
  
  // Determine if it's day or night
  const isDay = timeOfDay >= 6 && timeOfDay < 18
  
  // Animate sun position
  useFrame((state) => {
    if (sunRef.current) {
      const time = state.clock.elapsedTime * 0.1
      sunRef.current.position.x = Math.cos(time) * 50
      sunRef.current.position.y = Math.sin(time) * 30 + 20
      sunRef.current.position.z = Math.sin(time) * 50
    }
  })

  return (
    <>
      {/* Ambient light */}
      <ambientLight
        intensity={isDay ? 0.4 : 0.1}
        color={isDay ? '#ffffff' : '#404080'}
      />
      
      {/* Main directional light (sun/moon) */}
      <directionalLight
        ref={sunRef}
        intensity={isDay ? 1.0 : 0.3}
        color={isDay ? '#ffffff' : '#8080ff'}
        position={[50, 30, 50]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Fill light */}
      <directionalLight
        intensity={isDay ? 0.3 : 0.1}
        color={isDay ? '#87ceeb' : '#404080'}
        position={[-30, 20, -30]}
      />
      
      {/* Scene-specific lighting */}
      {currentScene === 'gym' && (
        <>
          {/* Gym overhead lights */}
          <pointLight
            position={[-10, 8, -10]}
            intensity={0.8}
            color="#ffffff"
            distance={20}
            castShadow
          />
          <pointLight
            position={[10, 8, -10]}
            intensity={0.8}
            color="#ffffff"
            distance={20}
            castShadow
          />
          <pointLight
            position={[0, 8, 10]}
            intensity={0.8}
            color="#ffffff"
            distance={20}
            castShadow
          />
        </>
      )}
      
      {currentScene === 'medical-hub' && (
        <>
          {/* Medical facility lighting */}
          <pointLight
            position={[0, 10, 0]}
            intensity={1.2}
            color="#f0f8ff"
            distance={25}
            castShadow
          />
          <spotLight
            position={[0, 15, 0]}
            angle={Math.PI / 4}
            penumbra={0.5}
            intensity={0.8}
            color="#ffffff"
            castShadow
          />
        </>
      )}
      
      {currentScene === 'plaza' && (
        <>
          {/* Plaza decorative lights */}
          <pointLight
            position={[-8, 3, 0]}
            intensity={0.5}
            color="#ffd700"
            distance={10}
          />
          <pointLight
            position={[8, 3, 0]}
            intensity={0.5}
            color="#ffd700"
            distance={10}
          />
          
          {/* Fountain light */}
          <pointLight
            position={[0, 1, 0]}
            intensity={0.6}
            color="#87ceeb"
            distance={8}
          />
        </>
      )}
      
      {/* Rim lighting for dramatic effect */}
      <directionalLight
        intensity={0.2}
        color="#ff6b6b"
        position={[0, 10, -50]}
      />
    </>
  )
}

export default Lighting