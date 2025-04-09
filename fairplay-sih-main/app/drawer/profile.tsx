import { router } from 'expo-router'
import React from 'react'
import { Button, Surface } from 'react-native-paper'

import Locales from '@/lib/locales'
import { ScreenInfo, styles } from '@/lib/ui'

const Profile = () => (
  <Surface style={styles.screen}>
    <ScreenInfo title={Locales.t('profile')} path="app/(tabs)/profile.tsx" />

    <Button mode="contained" onPress={() => router.push('/(auth)/login')}>
      Login
    </Button>
    <Button mode="contained" onPress={() => router.push('/(auth)/signup')}>
      Sign Up
    </Button>
  </Surface>
)

export default Profile
