import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { Chip } from 'react-native-paper'
import { type IconSource } from 'react-native-paper/lib/typescript/components/Icon'

function CustomisedChip({
  icon,
  children,
}: {
  children: ReactNode
  icon?: IconSource
}) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Chip icon={icon}>{children}</Chip>
    </View>
  )
}

export { CustomisedChip as Chip }
