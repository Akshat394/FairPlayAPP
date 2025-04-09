import { Stack } from 'expo-router'

import Locales from '@/lib/locales'
import { StackHeader } from '@/lib/ui'

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_bottom',
        header: (props) => (
          <StackHeader navProps={props} children={undefined} />
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Learn', headerShown: false }}
      />
      <Stack.Screen
        name="(chapters)"
        options={{ title: 'Chapters', headerShown: false }}
      />
    </Stack>
  )
}

export default Layout
