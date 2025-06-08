import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { useAppDispatch, useAppSelector } from '@hooks/useRedux'
import { updatePlayerPosition } from '@store/slices/gameSlice'
import { useGame } from '@services/GameService'
import Avatar from './Avatar'

const PlayerController: React.FC = () => {
  const dispatch = useAppDispatch()
  const { sendMessage } = useGame()
  const { camera } = useThree()
  const { user } = useAppSelector(state => state.auth)
  const { settings } = useAppSelector(state => state.app)
  
  const [playerRef, playerApi] = useBox(() => ({
    mass: 1,
    position: [0, 2, 0],
    args: [1, 2, 1],
    material: { friction: 0.1, restitution: 0.1 }
  }))

  const velocity = useRef([0, 0, 0])
  const position = useRef([0, 2, 0])
  const isGrounded = useRef(false)
  const moveVector = useRef(new THREE.Vector3())
  const cameraDirection = useRef(new THREE.Vector3())

  // Subscribe to physics updates
  useEffect(() => {
    const unsubscribeVelocity = playerApi.velocity.subscribe((v) => velocity.current = v)
    const unsubscribePosition = playerApi.position.subscribe((p) => {
      position.current = p
      dispatch(updatePlayerPosition({ x: p[0], y: p[1], z: p[2] }))
    })

    return () => {
      unsubscribeVelocity()
      unsubscribePosition()
    }
  }, [playerApi, dispatch])

  // Keyboard controls
  const [, getKeys] = useKeyboardControls()

  useFrame((state, delta) => {
    if (!playerRef.current) return

    const keys = getKeys()
    const { forward, backward, left, right, jump } = keys

    // Get camera direction for movement
    camera.getWorldDirection(cameraDirection.current)
    cameraDirection.current.y = 0
    cameraDirection.current.normalize()

    // Calculate movement vector
    moveVector.current.set(0, 0, 0)

    if (forward) {
      moveVector.current.add(cameraDirection.current)
    }
    if (backward) {
      moveVector.current.sub(cameraDirection.current)
    }
    if (left) {
      const leftVector = new THREE.Vector3()
      leftVector.crossVectors(camera.up, cameraDirection.current).normalize()
      moveVector.current.add(leftVector)
    }
    if (right) {
      const rightVector = new THREE.Vector3()
      rightVector.crossVectors(cameraDirection.current, camera.up).normalize()
      moveVector.current.add(rightVector)
    }

    // Apply movement
    const speed = 5
    const dampening = 0.9

    if (moveVector.current.length() > 0) {
      moveVector.current.normalize().multiplyScalar(speed)
      playerApi.velocity.set(
        moveVector.current.x,
        velocity.current[1],
        moveVector.current.z
      )

      // Send movement to server
      sendMessage('player_move', {
        position: position.current,
        rotation: [0, Math.atan2(moveVector.current.x, moveVector.current.z), 0],
        isMoving: true,
        animation: 'walk'
      })
    } else {
      // Apply dampening when not moving
      playerApi.velocity.set(
        velocity.current[0] * dampening,
        velocity.current[1],
        velocity.current[2] * dampening
      )

      sendMessage('player_move', {
        position: position.current,
        rotation: [0, 0, 0],
        isMoving: false,
        animation: 'idle'
      })
    }

    // Jumping
    if (jump && isGrounded.current) {
      playerApi.velocity.set(velocity.current[0], 8, velocity.current[2])
      isGrounded.current = false
    }

    // Check if grounded (simple ground detection)
    if (position.current[1] < 2.1 && velocity.current[1] <= 0) {
      isGrounded.current = true
    }

    // Update camera to follow player
    const cameraOffset = new THREE.Vector3(0, 5, 10)
    const desiredCamera = new THREE.Vector3(...position.current).add(cameraOffset)
    camera.position.lerp(desiredCamera, 0.1)
    camera.lookAt(new THREE.Vector3(...position.current))
  })

  if (!user?.avatar) return null

  return (
    <group ref={playerRef}>
      <Avatar
        config={user.avatar}
        position={[0, -1, 0]}
        isPlayer={true}
      />
    </group>
  )
}

export default PlayerController