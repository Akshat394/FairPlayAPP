import { Image } from 'expo-image'
import { router } from 'expo-router'
import _ from 'lodash'
import React from 'react'
import { ScrollView } from 'react-native'
import { Button, Surface, Text } from 'react-native-paper'

import { useAppSelector } from '@/lib/redux/hooks'
import { selectModules } from '@/lib/redux/slice/learn'
import { styles } from '@/lib/ui'
import { Chip } from '@/lib/ui/components/Chip'

const Learn = () => {
  const modules = useAppSelector(selectModules)
  return (
    <Surface style={styles.screen}>
      <ScrollView>
        {_.map(modules, (module, index) => (
          <Surface style={{ marginBottom: 45, gap: 35 }} key={index}>
            <Surface style={{ gap: 10 }}>
              <Text variant="headlineLarge">{module.moduleTitle}</Text>
              <Text variant="bodySmall" style={{ textAlign: 'right' }}>
                {module.author}
              </Text>
              <Text variant="bodySmall" style={{ textAlign: 'right' }}>
                {module.license}
              </Text>
              <Image
                style={{
                  flex: 1,
                  height: 200,
                  width: '100%',
                }}
                contentFit="contain"
                source="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSgmTpMbuYsrkts5VBS-scOnIM5YOM7ZD59HI90F4YjMGC68EOBhxyybPtXBbcdrenn-s&usqp=CAU"
                transition={1000}
              />
              <Text variant="bodyLarge">{module.description}</Text>
            </Surface>

            <Surface style={{ gap: 10 }}>
              <Chip icon="book-open-variant">Chapters</Chip>
              {_.map(module.chapters, ({ chapterTitle, chapterId }, index) => (
                <Button
                  key={index}
                  mode="outlined"
                  onPress={() => {
                    const params = new URLSearchParams({
                      moduleId: module.moduleId,
                      chapterId,
                    })
                    router.push(
                      `/(tabs)/learn/(chapters)/?${params.toString()}`,
                    )
                  }}
                >
                  {index + 1}. {chapterTitle}
                </Button>
              ))}
            </Surface>
          </Surface>
        ))}
      </ScrollView>
    </Surface>
  )
}

export default Learn
