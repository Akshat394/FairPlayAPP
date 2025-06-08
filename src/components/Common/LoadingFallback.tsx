import React from 'react'

const LoadingFallback: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#667eea" wireframe />
    </mesh>
  )
}

export default LoadingFallback