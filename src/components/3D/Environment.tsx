import React from 'react'
import { Sky, Stars, Cloud } from '@react-three/drei'
import { useAppSelector } from '@hooks/useRedux'

const Environment: React.FC = () => {
  const currentScene = useAppSelector(state => state.game.currentScene)
  const timeOfDay = new Date().getHours()
  
  // Determine if it's day or night
  const isDay = timeOfDay >= 6 && timeOfDay < 18
  
  return (
    <>
      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[
          isDay ? 100 : -100,
          isDay ? 20 : -20,
          isDay ? 100 : -100
        ]}
        inclination={isDay ? 0.49 : 0.51}
        azimuth={0.25}
      />
      
      {/* Stars (only at night) */}
      {!isDay && (
        <Stars
          radius={300}
          depth={60}
          count={1000}
          factor={7}
          saturation={0}
          fade
        />
      )}
      
      {/* Clouds (only during day and in outdoor scenes) */}
      {isDay && currentScene === 'plaza' && (
        <>
          <Cloud
            position={[-20, 15, -30]}
            speed={0.2}
            opacity={0.6}
            width={10}
            depth={1.5}
            segments={20}
          />
          <Cloud
            position={[30, 20, -40]}
            speed={0.15}
            opacity={0.4}
            width={15}
            depth={2}
            segments={25}
          />
          <Cloud
            position={[0, 25, -50]}
            speed={0.1}
            opacity={0.5}
            width={12}
            depth={1.8}
            segments={22}
          />
        </>
      )}
      
      {/* Fog for atmosphere */}
      <fog attach="fog" args={[isDay ? '#87ceeb' : '#1a1a2e', 50, 200]} />
    </>
  )
}

export default Environment