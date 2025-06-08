import React from 'react'
import { useAppSelector } from '@hooks/useRedux'
import ChatInterface from './ChatInterface'
import Minimap from './Minimap'
import NotificationCenter from './NotificationCenter'
import QuizInterface from './QuizInterface'
import AvatarCustomizer from './AvatarCustomizer'
import ForumBrowser from './ForumBrowser'
import Leaderboard from './Leaderboard'
import AchievementPanel from './AchievementPanel'
import SettingsPanel from './SettingsPanel'
import HUD from './HUD'
import InteractionPrompts from './InteractionPrompts'

const UIOverlay: React.FC = () => {
  const { activePanel, chatVisible, minimapVisible } = useAppSelector(state => state.ui)

  return (
    <div className="ui-overlay">
      {/* HUD - Always visible */}
      <HUD />
      
      {/* Interaction prompts */}
      <InteractionPrompts />
      
      {/* Chat interface */}
      {chatVisible && (
        <div className="fixed bottom-4 left-4 w-96 h-80">
          <ChatInterface />
        </div>
      )}
      
      {/* Minimap */}
      {minimapVisible && (
        <div className="fixed top-4 right-4 w-48 h-48">
          <Minimap />
        </div>
      )}
      
      {/* Notification center */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2">
        <NotificationCenter />
      </div>
      
      {/* Active panels */}
      {activePanel === 'quiz-interface' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <QuizInterface />
        </div>
      )}
      
      {activePanel === 'avatar-customizer' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <AvatarCustomizer />
        </div>
      )}
      
      {activePanel === 'forum-browser' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ForumBrowser />
        </div>
      )}
      
      {activePanel === 'leaderboard' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Leaderboard />
        </div>
      )}
      
      {activePanel === 'achievements' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <AchievementPanel />
        </div>
      )}
      
      {activePanel === 'settings' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <SettingsPanel />
        </div>
      )}
    </div>
  )
}

export default UIOverlay