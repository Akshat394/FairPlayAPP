import { router } from 'expo-router'
import React from 'react'
import { Appbar, Surface, Text, Tooltip } from 'react-native-paper'

import Locales from '@/lib/locales'
import { useAppSelector } from '@/lib/redux/hooks'
import { selectQuizScore } from '@/lib/redux/slice/quiz'
import { ScreenInfo, styles } from '@/lib/ui'

const TabsHome = () => {
  const score = useAppSelector(selectQuizScore)
  return (
    <Surface style={styles.screen}>
      <ScreenInfo title={Locales.t('titleHome')} path="app/(tabs)" />
      <Text variant="displayLarge">Score : {score}</Text>
    </Surface>
  )
}

export default TabsHome
