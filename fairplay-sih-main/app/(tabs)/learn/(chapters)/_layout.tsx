import { Stack } from 'expo-router'

import { StackHeader } from '@/lib/ui'

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        header: (props) => (
          <StackHeader navProps={props} children={undefined} />
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Chapters', headerShown: false }}
      />
    </Stack>
  )
}

export default Layout
