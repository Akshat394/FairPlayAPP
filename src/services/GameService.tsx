import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import { Client, Room } from 'colyseus.js'
import { useAppDispatch, useAppSelector } from '@hooks/useRedux'
import { setConnectionStatus, addPlayer, removePlayer, updatePlayerData } from '@store/slices/gameSlice'
import { addMessage } from '@store/slices/chatSlice'
import { unlockAchievement } from '@store/slices/achievementSlice'
import { addNotification } from '@store/slices/uiSlice'

interface GameContextType {
  client: Client | null
  room: Room | null
  isConnected: boolean
  sendMessage: (type: string, data: any) => void
  joinRoom: (roomName: string) => Promise<void>
  leaveRoom: () => void
}

const GameContext = createContext<GameContextType | null>(null)

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

interface GameProviderProps {
  children: ReactNode
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.auth)
  const clientRef = useRef<Client | null>(null)
  const roomRef = useRef<Room | null>(null)

  useEffect(() => {
    if (user) {
      initializeGameClient()
    }

    return () => {
      if (roomRef.current) {
        roomRef.current.leave()
      }
    }
  }, [user])

  const initializeGameClient = async () => {
    try {
      const serverUrl = import.meta.env.VITE_GAME_SERVER_URL || 'ws://localhost:2567'
      clientRef.current = new Client(serverUrl)
      
      dispatch(setConnectionStatus(true))
      dispatch(addNotification({
        type: 'success',
        title: 'Connected',
        message: 'Successfully connected to game server'
      }))

      // Auto-join the main plaza room
      await joinRoom('plaza')
    } catch (error) {
      console.error('Failed to connect to game server:', error)
      dispatch(setConnectionStatus(false))
      dispatch(addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: 'Failed to connect to game server'
      }))
    }
  }

  const joinRoom = async (roomName: string) => {
    if (!clientRef.current || !user) return

    try {
      // Leave current room if exists
      if (roomRef.current) {
        roomRef.current.leave()
      }

      // Join new room
      const room = await clientRef.current.joinOrCreate(roomName, {
        userId: user.id,
        username: user.username,
        avatar: user.avatar
      })

      roomRef.current = room
      setupRoomHandlers(room)

      dispatch(addNotification({
        type: 'info',
        title: 'Room Joined',
        message: `Joined ${roomName}`
      }))
    } catch (error) {
      console.error('Failed to join room:', error)
      dispatch(addNotification({
        type: 'error',
        title: 'Join Failed',
        message: `Failed to join ${roomName}`
      }))
    }
  }

  const setupRoomHandlers = (room: Room) => {
    // Player joined
    room.onMessage('player_joined', (data) => {
      dispatch(addPlayer(data.player))
      dispatch(addMessage({
        id: Date.now().toString(),
        sender: { id: 'system', username: 'System' } as any,
        content: `${data.player.username} joined the area`,
        type: 'system',
        timestamp: new Date(),
        channel: 'proximity',
        isPrivate: false
      }))
    })

    // Player left
    room.onMessage('player_left', (data) => {
      dispatch(removePlayer(data.playerId))
      dispatch(addMessage({
        id: Date.now().toString(),
        sender: { id: 'system', username: 'System' } as any,
        content: `${data.username} left the area`,
        type: 'system',
        timestamp: new Date(),
        channel: 'proximity',
        isPrivate: false
      }))
    })

    // Player moved
    room.onMessage('player_moved', (data) => {
      dispatch(updatePlayerData({
        id: data.playerId,
        data: {
          position: data.position,
          rotation: data.rotation,
          isMoving: data.isMoving,
          currentAnimation: data.animation
        }
      }))
    })

    // Chat message
    room.onMessage('chat_message', (data) => {
      dispatch(addMessage(data))
    })

    // Achievement unlocked
    room.onMessage('achievement_unlocked', (data) => {
      dispatch(unlockAchievement(data.achievement))
      dispatch(addNotification({
        type: 'success',
        title: 'Achievement Unlocked!',
        message: data.achievement.name
      }))
    })

    // Quiz invitation
    room.onMessage('quiz_invitation', (data) => {
      dispatch(addNotification({
        type: 'info',
        title: 'Quiz Challenge',
        message: `${data.from} challenged you to a quiz!`,
        actions: [
          {
            label: 'Accept',
            action: () => sendMessage('quiz_accept', { challengeId: data.id }),
            style: 'primary'
          },
          {
            label: 'Decline',
            action: () => sendMessage('quiz_decline', { challengeId: data.id }),
            style: 'secondary'
          }
        ]
      }))
    })

    // Error handling
    room.onError((code, message) => {
      console.error('Room error:', code, message)
      dispatch(addNotification({
        type: 'error',
        title: 'Room Error',
        message: message || 'An error occurred in the game room'
      }))
    })

    // Room left
    room.onLeave((code) => {
      console.log('Left room with code:', code)
      roomRef.current = null
    })
  }

  const sendMessage = (type: string, data: any) => {
    if (roomRef.current) {
      roomRef.current.send(type, data)
    }
  }

  const leaveRoom = () => {
    if (roomRef.current) {
      roomRef.current.leave()
      roomRef.current = null
    }
  }

  const contextValue: GameContextType = {
    client: clientRef.current,
    room: roomRef.current,
    isConnected: !!clientRef.current,
    sendMessage,
    joinRoom,
    leaveRoom
  }

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  )
}