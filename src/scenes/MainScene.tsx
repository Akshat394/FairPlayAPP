import React, { Suspense } from 'react'
import { useAppSelector } from '@hooks/useRedux'
import PlazaScene from './PlazaScene'
import GymScene from './GymScene'
import MedicalHubScene from './MedicalHubScene'
import CoachColosseumScene from './CoachColosseumScene'
import GameHallScene from './GameHallScene'
import ForumSpaceScene from './ForumSpaceScene'
import Environment from '@components/3D/Environment'
import Lighting from '@components/3D/Lighting'
import LoadingFallback from '@components/Common/LoadingFallback'

const MainScene: React.FC = () => {
  const currentScene = useAppSelector(state => state.game.currentScene)

  const renderScene = () => {
    switch (currentScene) {
      case 'plaza':
        return <PlazaScene />
      case 'gym':
        return <GymScene />
      case 'medical-hub':
        return <MedicalHubScene />
      case 'coach-colosseum':
        return <CoachColosseumScene />
      case 'game-hall':
        return <GameHallScene />
      case 'forum-space':
        return <ForumSpaceScene />
      default:
        return <PlazaScene />
    }
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Environment />
      <Lighting />
      {renderScene()}
    </Suspense>
  )
}

export default MainScene