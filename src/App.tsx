import React, { Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { Loader, Stats } from '@react-three/drei'
import { useAppDispatch } from '@hooks/useRedux'
import { initializeApp } from '@store/slices/appSlice'
import MainScene from '@scenes/MainScene'
import UIOverlay from '@components/UI/UIOverlay'
import AuthGuard from '@components/Auth/AuthGuard'
import LoginScreen from '@components/Auth/LoginScreen'
import ErrorBoundary from '@components/Common/ErrorBoundary'
import { GameProvider } from '@services/GameService'
import './App.css'

const App: React.FC = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initializeApp())
  }, [dispatch])

  return (
    <ErrorBoundary>
      <div className="app">
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route
            path="/*"
            element={
              <AuthGuard>
                <GameProvider>
                  <div className="game-container">
                    <Canvas
                      camera={{
                        position: [0, 5, 10],
                        fov: 75,
                        near: 0.1,
                        far: 1000
                      }}
                      shadows
                      gl={{
                        antialias: true,
                        alpha: false,
                        powerPreference: 'high-performance'
                      }}
                      dpr={[1, 2]}
                    >
                      <Suspense fallback={null}>
                        <Physics
                          gravity={[0, -9.81, 0]}
                          iterations={10}
                          tolerance={0.001}
                          allowSleep={false}
                          broadphase="SAP"
                        >
                          <MainScene />
                        </Physics>
                      </Suspense>
                      {process.env.NODE_ENV === 'development' && <Stats />}
                    </Canvas>
                    <UIOverlay />
                    <Loader />
                  </div>
                </GameProvider>
              </AuthGuard>
            }
          />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}

export default App