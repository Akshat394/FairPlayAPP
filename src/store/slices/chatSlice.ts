import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChatMessage, ChatChannel, User } from '@types/index'

interface ChatState {
  messages: ChatMessage[]
  activeChannel: ChatChannel
  channels: ChatChannel[]
  isTyping: boolean
  typingUsers: string[]
  blockedUsers: string[]
  mutedChannels: ChatChannel[]
  messageHistory: Record<string, ChatMessage[]>
}

const initialState: ChatState = {
  messages: [],
  activeChannel: 'global',
  channels: ['global', 'proximity', 'building', 'private', 'expert'],
  isTyping: false,
  typingUsers: [],
  blockedUsers: [],
  mutedChannels: [],
  messageHistory: {}
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const message = action.payload
      
      // Add to current messages
      state.messages.push(message)
      
      // Add to channel history
      if (!state.messageHistory[message.channel]) {
        state.messageHistory[message.channel] = []
      }
      state.messageHistory[message.channel].push(message)
      
      // Keep only last 100 messages per channel
      if (state.messageHistory[message.channel].length > 100) {
        state.messageHistory[message.channel] = state.messageHistory[message.channel].slice(-100)
      }
      
      // Keep only last 50 messages in current view
      if (state.messages.length > 50) {
        state.messages = state.messages.slice(-50)
      }
    },
    
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(m => m.id !== action.payload)
      
      // Remove from all channel histories
      Object.keys(state.messageHistory).forEach(channel => {
        state.messageHistory[channel] = state.messageHistory[channel].filter(m => m.id !== action.payload)
      })
    },
    
    setActiveChannel: (state, action: PayloadAction<ChatChannel>) => {
      state.activeChannel = action.payload
      
      // Load messages for this channel
      if (state.messageHistory[action.payload]) {
        state.messages = [...state.messageHistory[action.payload]]
      } else {
        state.messages = []
      }
    },
    
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload
    },
    
    addTypingUser: (state, action: PayloadAction<string>) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload)
      }
    },
    
    removeTypingUser: (state, action: PayloadAction<string>) => {
      state.typingUsers = state.typingUsers.filter(u => u !== action.payload)
    },
    
    blockUser: (state, action: PayloadAction<string>) => {
      if (!state.blockedUsers.includes(action.payload)) {
        state.blockedUsers.push(action.payload)
      }
      
      // Remove messages from blocked user
      state.messages = state.messages.filter(m => m.sender.id !== action.payload)
      
      // Remove from all channel histories
      Object.keys(state.messageHistory).forEach(channel => {
        state.messageHistory[channel] = state.messageHistory[channel].filter(m => m.sender.id !== action.payload)
      })
    },
    
    unblockUser: (state, action: PayloadAction<string>) => {
      state.blockedUsers = state.blockedUsers.filter(u => u !== action.payload)
    },
    
    muteChannel: (state, action: PayloadAction<ChatChannel>) => {
      if (!state.mutedChannels.includes(action.payload)) {
        state.mutedChannels.push(action.payload)
      }
    },
    
    unmuteChannel: (state, action: PayloadAction<ChatChannel>) => {
      state.mutedChannels = state.mutedChannels.filter(c => c !== action.payload)
    },
    
    clearMessages: (state, action: PayloadAction<ChatChannel | 'all'>) => {
      if (action.payload === 'all') {
        state.messages = []
        state.messageHistory = {}
      } else {
        if (state.activeChannel === action.payload) {
          state.messages = []
        }
        delete state.messageHistory[action.payload]
      }
    },
    
    updateMessage: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const message = state.messages.find(m => m.id === action.payload.id)
      if (message) {
        message.content = action.payload.content
      }
      
      // Update in channel history
      Object.keys(state.messageHistory).forEach(channel => {
        const historyMessage = state.messageHistory[channel].find(m => m.id === action.payload.id)
        if (historyMessage) {
          historyMessage.content = action.payload.content
        }
      })
    }
  }
})

export const {
  addMessage,
  removeMessage,
  setActiveChannel,
  setTyping,
  addTypingUser,
  removeTypingUser,
  blockUser,
  unblockUser,
  muteChannel,
  unmuteChannel,
  clearMessages,
  updateMessage
} = chatSlice.actions

export default chatSlice.reducer