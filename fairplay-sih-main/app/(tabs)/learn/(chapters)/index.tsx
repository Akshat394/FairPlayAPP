import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ScrollView } from 'react-native'
import { Surface, Text } from 'react-native-paper'

import { useSelectChapterFromModule } from '@/lib/redux/slice/learn'
import { styles } from '@/lib/ui'
import VideoScreen from '@/lib/ui/components/Video'

const Index = () => {
  const { moduleId, chapterId } = useLocalSearchParams<{
    moduleId: string
    chapterId: string
  }>()
  const chapter = useSelectChapterFromModule({ moduleId, chapterId })

  return (
    <Surface style={styles.screen}>
      <ScrollView>
        {!chapter && (
          <>
            <Text>Chapter not found</Text>
          </>
        )}

        {chapter && (
          <>
            <Text>{chapter.chapterTitle}</Text>
            <Text>{chapter.description}</Text>
            <Text>{chapter.content}</Text>
            <VideoScreen />
          </>
        )}
      </ScrollView>
    </Surface>
  )
}

export default Index
