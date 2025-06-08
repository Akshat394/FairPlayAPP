import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '@store/index'
import App from './App'
import './index.css'

// Initialize loading progress
let progress = 0
const progressFill = document.getElementById('progress-fill')
const loadingText = document.getElementById('loading-text')

const updateProgress = (value: number, text: string) => {
  progress = value
  if (progressFill) progressFill.style.width = `${progress}%`
  if (loadingText) loadingText.textContent = text
}

// Simulate loading progress
const loadingSteps = [
  { progress: 20, text: 'Loading 3D assets...' },
  { progress: 40, text: 'Initializing physics engine...' },
  { progress: 60, text: 'Connecting to game server...' },
  { progress: 80, text: 'Setting up AI services...' },
  { progress: 100, text: 'Welcome to FairPlay!' }
]

let stepIndex = 0
const loadingInterval = setInterval(() => {
  if (stepIndex < loadingSteps.length) {
    const step = loadingSteps[stepIndex]
    updateProgress(step.progress, step.text)
    stepIndex++
  } else {
    clearInterval(loadingInterval)
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen')
      if (loadingScreen) {
        loadingScreen.style.opacity = '0'
        loadingScreen.style.transition = 'opacity 0.5s ease'
        setTimeout(() => {
          loadingScreen.style.display = 'none'
        }, 500)
      }
    }, 1000)
  }
}, 800)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)