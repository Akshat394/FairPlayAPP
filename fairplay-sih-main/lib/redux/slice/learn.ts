import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

import { useAppSelector } from '@/lib/redux/hooks'
import { RootState } from '@/lib/redux/store'

interface Module {
  moduleId: string
  moduleTitle: string
  description: string
  author: string
  license: string
  thumbnail: string
  chapters: Chapter[]
}

interface Chapter {
  chapterId: string
  chapterTitle: string
  description: string
  content: string
  quiz: QuizQuestion[]
  resources: Resource[]
}

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  feedback: string
}

interface Resource {
  type: 'video' | 'article' | 'code example'
  url?: string
  code?: string
}

const initialState: Module[] = [
  {
    moduleId: 'anti-doping-101',
    moduleTitle: 'Introduction to Anti-Doping',
    description:
      'This module covers the fundamentals of anti-doping, including its importance in sports and the impact of performance-enhancing drugs.',
    author: 'Jane Doe',
    license: 'CC BY-NC-SA 4.0',
    thumbnail: 'https://example.com/images/anti-doping-thumbnail.jpg',
    chapters: [
      {
        chapterId: 'chapter-1',
        chapterTitle: 'Understanding Doping',
        description:
          'An overview of what doping is and its implications in sports.',
        content:
          'Doping refers to the use of banned substances or methods to enhance athletic performance. It poses ethical questions and undermines the spirit of sports.',
        quiz: [
          {
            question: 'What is the definition of doping?',
            options: [
              'A form of training',
              'Using banned substances to enhance performance',
              'A type of sports equipment',
              'A recovery technique',
            ],
            correctAnswer: 1,
            feedback:
              'Correct! Doping involves the use of banned substances to enhance performance.',
          },
        ],
        resources: [
          {
            type: 'video',
            url: 'https://example.com/videos/understanding-doping.mp4',
          },
          {
            type: 'article',
            url: 'https://example.com/articles/what-is-doping.html',
          },
        ],
      },
      {
        chapterId: 'chapter-2',
        chapterTitle: 'The Role of Anti-Doping Agencies',
        description:
          'Explore the role and responsibilities of organizations that enforce anti-doping policies.',
        content:
          'Anti-doping agencies are responsible for creating and enforcing regulations to ensure fair play. They conduct tests and educate athletes about the risks of doping.',
        quiz: [
          {
            question: 'What is the main role of anti-doping agencies?',
            options: [
              'To promote sports',
              'To enforce doping regulations',
              'To organize sporting events',
              'To provide training facilities',
            ],
            correctAnswer: 1,
            feedback:
              'Correct! Anti-doping agencies enforce regulations to ensure fair competition.',
          },
        ],
        resources: [
          {
            type: 'article',
            url: 'https://example.com/articles/role-of-anti-doping-agencies.html',
          },
          {
            type: 'video',
            url: 'https://example.com/videos/anti-doping-agencies.mp4',
          },
        ],
      },
    ],
  },
  {
    moduleId: 'anti-doping-102',
    moduleTitle: 'Types of Performance-Enhancing Drugs',
    description:
      'This module delves into various performance-enhancing drugs, their effects, and the health risks associated with their use.',
    author: 'John Smith',
    license: 'CC BY-NC-SA 4.0',
    thumbnail: 'https://example.com/images/types-of-drugs-thumbnail.jpg',
    chapters: [
      {
        chapterId: 'chapter-1',
        chapterTitle: 'Stimulants and Their Effects',
        description:
          'An overview of stimulants and how they can enhance performance.',
        content:
          'Stimulants can increase alertness and reduce fatigue, but they come with serious health risks, including heart problems.',
        quiz: [
          {
            question: 'What is a common effect of stimulants?',
            options: [
              'Increased fatigue',
              'Reduced alertness',
              'Increased heart rate',
              'Decreased focus',
            ],
            correctAnswer: 2,
            feedback:
              'Correct! Stimulants typically increase heart rate and alertness.',
          },
        ],
        resources: [
          {
            type: 'article',
            url: 'https://example.com/articles/stimulants-in-sports.html',
          },
          {
            type: 'video',
            url: 'https://example.com/videos/stimulants-explained.mp4',
          },
        ],
      },
      {
        chapterId: 'chapter-2',
        chapterTitle: 'Anabolic Steroids',
        description:
          'Learn about anabolic steroids, their use in sports, and the potential side effects.',
        content:
          'Anabolic steroids are used to increase muscle mass and strength, but can lead to serious health issues such as hormonal imbalances.',
        quiz: [
          {
            question: 'What is a potential side effect of anabolic steroids?',
            options: [
              'Improved skin health',
              'Hair loss',
              'Better sleep',
              'Increased endurance',
            ],
            correctAnswer: 1,
            feedback:
              'Correct! Hair loss is one of the potential side effects of anabolic steroid use.',
          },
        ],
        resources: [
          {
            type: 'article',
            url: 'https://example.com/articles/anabolic-steroids.html',
          },
          {
            type: 'video',
            url: 'https://example.com/videos/anabolic-steroids-risk.mp4',
          },
        ],
      },
    ],
  },
  {
    moduleId: 'anti-doping-103',
    moduleTitle: 'Testing and Detection Methods',
    description:
      'This module discusses various methods used to test athletes for banned substances.',
    author: 'Alice Johnson',
    license: 'CC BY-NC-SA 4.0',
    thumbnail: 'https://example.com/images/testing-methods-thumbnail.jpg',
    chapters: [
      {
        chapterId: 'chapter-1',
        chapterTitle: 'Urine Testing',
        description:
          'Explore the most common method of doping testing—urine analysis.',
        content:
          'Urine tests are widely used due to their effectiveness in detecting a range of substances.',
        quiz: [
          {
            question: 'What is the most common method for doping tests?',
            options: [
              'Blood testing',
              'Urine testing',
              'Hair testing',
              'Saliva testing',
            ],
            correctAnswer: 1,
            feedback:
              'Correct! Urine testing is the most common method used in doping tests.',
          },
        ],
        resources: [
          {
            type: 'article',
            url: 'https://example.com/articles/urine-testing.html',
          },
          {
            type: 'video',
            url: 'https://example.com/videos/urine-tests.mp4',
          },
        ],
      },
      {
        chapterId: 'chapter-2',
        chapterTitle: 'Blood Testing',
        description:
          'Learn about blood testing and its applications in anti-doping.',
        content:
          'Blood tests can detect certain banned substances that are not identifiable in urine samples.',
        quiz: [
          {
            question:
              'What is a key advantage of blood testing over urine testing?',
            options: [
              'Easier to conduct',
              'Can detect more substances',
              'Less invasive',
              'Faster results',
            ],
            correctAnswer: 1,
            feedback:
              'Correct! Blood testing can identify substances that urine testing might miss.',
          },
        ],
        resources: [
          {
            type: 'article',
            url: 'https://example.com/articles/blood-testing.html',
          },
          {
            type: 'video',
            url: 'https://example.com/videos/blood-tests.mp4',
          },
        ],
      },
    ],
  },
  {
    moduleId: 'anti-doping-104',
    moduleTitle: 'Consequences of Doping',
    description:
      'This module examines the consequences of doping, both for athletes and the sport.',
    author: 'Michael Brown',
    license: 'CC BY-NC-SA 4.0',
    thumbnail: 'https://example.com/images/consequences-thumbnail.jpg',
    chapters: [
      {
        chapterId: 'chapter-1',
        chapterTitle: 'Health Risks',
        description:
          'Understand the potential health risks associated with doping.',
        content:
          'Doping can lead to severe health issues including heart disease, liver damage, and psychological effects.',
        quiz: [
          {
            question:
              'Which of the following is a potential health risk of doping?',
            options: [
              'Improved metabolism',
              'Heart disease',
              'Better hydration',
              'Enhanced lung capacity',
            ],
            correctAnswer: 1,
            feedback:
              'Correct! Heart disease is a serious risk associated with doping.',
          },
        ],
        resources: [
          {
            type: 'article',
            url: 'https://example.com/articles/doping-health-risks.html',
          },
          {
            type: 'video',
            url: 'https://example.com/videos/health-risks-of-doping.mp4',
          },
        ],
      },
      {
        chapterId: 'chapter-2',
        chapterTitle: 'Legal and Career Consequences',
        description:
          'Explore the legal implications and career risks for athletes caught doping.',
        content:
          'Athletes can face suspensions, fines, and permanent bans from their sport, impacting their careers and reputations.',
        quiz: [
          {
            question: 'What can happen to an athlete caught doping?',
            options: [
              'They may receive a medal',
              'They can be suspended or banned',
              'They get a warning',
              'Nothing happens',
            ],
            correctAnswer: 1,
            feedback:
              'Correct! Athletes caught doping can face suspensions or bans from competition.',
          },
        ],
        resources: [
          {
            type: 'article',
            url: 'https://example.com/articles/legal-consequences.html',
          },
          {
            type: 'video',
            url: 'https://example.com/videos/legal-consequences-of-doping.mp4',
          },
        ],
      },
    ],
  },
  {
    moduleId: 'anti-doping-105',
    moduleTitle: 'Ethics and Fair Play',
    description:
      'This module discusses the ethical considerations surrounding doping and the importance of fair play in sports.',
    author: 'Emily White',
    license: 'CC BY-NC-SA 4.0',
    thumbnail: 'https://example.com/images/ethics-thumbnail.jpg',
    chapters: [
      {
        chapterId: 'chapter-1',
        chapterTitle: 'The Spirit of Sports',
        description: 'Discuss the values of fair play and sportsmanship.',
        content:
          'Fair play is essential to sports, promoting respect, integrity, and camaraderie among athletes.',
        quiz: [
          {
            question: 'What does fair play emphasize?',
            options: [
              'Winning at all costs',
              'Respect and integrity',
              'Avoiding competition',
              'Using performance-enhancing drugs',
            ],
            correctAnswer: 1,
            feedback:
              'Correct! Fair play emphasizes respect and integrity in sports.',
          },
        ],
        resources: [
          {
            type: 'article',
            url: 'https://example.com/articles/fair-play.html',
          },
          {
            type: 'video',
            url: 'https://example.com/videos/spirit-of-sports.mp4',
          },
        ],
      },
      {
        chapterId: 'chapter-2',
        chapterTitle: 'Ethical Implications of Doping',
        description:
          'Examine the ethical dilemmas faced by athletes regarding doping.',
        content:
          'Doping raises significant ethical questions about fairness, pressure to perform, and the long-term consequences on health and integrity.',
        quiz: [
          {
            question: 'What is a major ethical concern regarding doping?',
            options: [
              'It promotes teamwork',
              'It ensures better performance',
              'It undermines the integrity of sports',
              'It is always safe',
            ],
            correctAnswer: 2,
            feedback:
              'Correct! Doping undermines the integrity of sports and raises serious ethical concerns.',
          },
        ],
        resources: [
          {
            type: 'article',
            url: 'https://example.com/articles/ethics-of-doping.html',
          },
          {
            type: 'video',
            url: 'https://example.com/videos/ethical-implications.mp4',
          },
        ],
      },
    ],
  },
]

const learnSlice = createSlice({
  name: 'learn',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
})

export const selectModules = (store: RootState) => store.learn

export function useSelectChapterFromModule({
  moduleId,
  chapterId,
}: {
  moduleId: string
  chapterId: string
}) {
  const modules = useAppSelector(selectModules)
  const module = _.find(modules, { moduleId })
  const chapter = _.find(module?.chapters, { chapterId })
  return chapter
}
export default learnSlice.reducer

/*
export const {} = learnSlice.actions
export const selectQuizQuestions = (store: RootState) => store.quiz.questions
export const selectQuizScore = (store: RootState) => store.quiz.score
export default learnSlice.reducer
*/
