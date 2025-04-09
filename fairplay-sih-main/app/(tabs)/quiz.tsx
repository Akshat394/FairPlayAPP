import _ from 'lodash'
import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Avatar, List, Surface, Text } from 'react-native-paper'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import {
  selectQuizQuestions,
  selectQuizScore,
  validateAnswer,
} from '@/lib/redux/slice/quiz'

const CenteredCheckbox = ({ status }: { status: 'checked' | 'unchecked' }) => (
  <View style={{ alignSelf: 'center' }}>
    <Text>
      {status === 'checked' && '✅'}
      {status === 'unchecked' && '❌'}
    </Text>
  </View>
)

const Options = ({
  options,
  question,
  userAnswer,
}: {
  options: string[]
  question: string
  userAnswer: null | boolean
}) => {
  const dispatch = useAppDispatch()
  const [state, setState] = useState(-1)

  return _.map(options, function (option, index) {
    const label = String.fromCharCode('A'.charCodeAt(0) + index)
    return (
      <List.Item
        key={index}
        title={option}
        onPress={() => {
          if (userAnswer === null) {
            dispatch(validateAnswer({ question, answer: option }))
            setState(index)
          }
        }}
        left={(props) => (
          <Avatar.Text style={props.style} label={label} size={40} />
        )}
        right={() => {
          if (index === state) {
            if (userAnswer) return <CenteredCheckbox status="checked" />
            else return <CenteredCheckbox status="unchecked" />
          }
        }}
      />
    )
  })
}

const Quiz = () => {
  const quiz = useAppSelector(selectQuizQuestions)
  const score = useAppSelector(selectQuizScore)

  return (
    <ScrollView style={{ flex: 1 }}>
      <Surface style={{ gap: 32 }}>
        <Text variant="displayLarge">Score : {score}</Text>
        {_.map(
          quiz,
          ({ question, correctAnswer, options, userAnswer }, index) => (
            <Surface elevation={0} key={index}>
              <Text variant="titleLarge">{question}</Text>
              <List.Section title="Choose a single answer">
                <Options
                  question={question}
                  userAnswer={userAnswer}
                  options={options}
                />
              </List.Section>
            </Surface>
          ),
        )}
      </Surface>
    </ScrollView>
  )
}

export default Quiz
