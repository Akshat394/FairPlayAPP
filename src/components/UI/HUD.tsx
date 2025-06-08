import React from 'react'
import { useAppSelector, useAppDispatch } from '@hooks/useRedux'
import { toggleChat, toggleMinimap, setActivePanel } from '@store/slices/uiSlice'

const HUD: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.auth)
  const { currentScene, isConnected } = useAppSelector(state => state.game)
  const { notifications } = useAppSelector(state => state.ui)
  const { stats } = useAppSelector(state => state.achievements)

  const unreadNotifications = notifications.filter(n => !n.read).length

  return (
    <>
      {/* Top HUD */}
      <div className="fixed top-4 left-4 flex items-center space-x-4 z-40">
        {/* User info */}
        <div className="ui-panel flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-white font-semibold">{user?.username}</div>
            <div className="text-xs text-gray-300">
              Level {stats?.level || 1} • {stats?.xp || 0} XP
            </div>
          </div>
        </div>

        {/* Connection status */}
        <div className="ui-panel flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-white">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Current scene */}
        <div className="ui-panel">
          <span className="text-sm text-white capitalize">
            {currentScene.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-40">
        {/* Chat toggle */}
        <button
          className="ui-button relative"
          onClick={() => dispatch(toggleChat())}
          title="Toggle Chat"
        >
          💬
        </button>

        {/* Minimap toggle */}
        <button
          className="ui-button"
          onClick={() => dispatch(toggleMinimap())}
          title="Toggle Minimap"
        >
          🗺️
        </button>

        {/* Avatar customizer */}
        <button
          className="ui-button"
          onClick={() => dispatch(setActivePanel('avatar-customizer'))}
          title="Customize Avatar"
        >
          👤
        </button>

        {/* Quiz */}
        <button
          className="ui-button"
          onClick={() => dispatch(setActivePanel('quiz-interface'))}
          title="Take Quiz"
        >
          🧠
        </button>

        {/* Forum */}
        <button
          className="ui-button"
          onClick={() => dispatch(setActivePanel('forum-browser'))}
          title="Browse Forum"
        >
          📋
        </button>

        {/* Leaderboard */}
        <button
          className="ui-button"
          onClick={() => dispatch(setActivePanel('leaderboard'))}
          title="Leaderboard"
        >
          🏆
        </button>

        {/* Achievements */}
        <button
          className="ui-button"
          onClick={() => dispatch(setActivePanel('achievements'))}
          title="Achievements"
        >
          🎖️
        </button>

        {/* Settings */}
        <button
          className="ui-button"
          onClick={() => dispatch(setActivePanel('settings'))}
          title="Settings"
        >
          ⚙️
        </button>
      </div>

      {/* Right HUD */}
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 flex flex-col space-y-2 z-40">
        {/* Notifications indicator */}
        {unreadNotifications > 0 && (
          <div className="ui-panel relative">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {unreadNotifications}
            </div>
          </div>
        )}

        {/* XP Progress */}
        {stats && (
          <div className="ui-panel w-48">
            <div className="text-xs text-gray-300 mb-1">
              Level {stats.level} Progress
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(stats.xp / stats.xpToNext) * 100}%`
                }}
              />
            </div>
            <div className="text-xs text-gray-300 mt-1">
              {stats.xp} / {stats.xpToNext} XP
            </div>
          </div>
        )}
      </div>

      {/* Controls help */}
      <div className="fixed bottom-4 right-4 ui-panel text-xs text-gray-300 z-40">
        <div className="mb-1"><strong>WASD</strong> - Move</div>
        <div className="mb-1"><strong>Space</strong> - Jump</div>
        <div className="mb-1"><strong>E</strong> - Interact</div>
        <div><strong>T</strong> - Chat</div>
      </div>
    </>
  )
}

export default HUD