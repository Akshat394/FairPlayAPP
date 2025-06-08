import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ForumPost, ForumReply, ForumCategory } from '@types/index'
import { forumAPI } from '@services/api'

interface ForumState {
  posts: ForumPost[]
  currentPost: ForumPost | null
  categories: ForumCategory[]
  activeCategory: ForumCategory | 'all'
  searchQuery: string
  sortBy: 'newest' | 'oldest' | 'popular' | 'replies'
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

const initialState: ForumState = {
  posts: [],
  currentPost: null,
  categories: [
    'general-discussion',
    'doping-regulations',
    'nutrition-supplements',
    'testing-experiences',
    'athlete-support',
    'coach-corner',
    'medical-advice',
    'case-studies'
  ],
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'newest',
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true
  }
}

export const loadPosts = createAsyncThunk(
  'forum/loadPosts',
  async (params: {
    category?: ForumCategory | 'all'
    search?: string
    sort?: 'newest' | 'oldest' | 'popular' | 'replies'
    page?: number
    limit?: number
  }, { rejectWithValue }) => {
    try {
      const response = await forumAPI.getPosts(params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load posts')
    }
  }
)

export const loadPost = createAsyncThunk(
  'forum/loadPost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await forumAPI.getPost(postId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load post')
    }
  }
)

export const createPost = createAsyncThunk(
  'forum/createPost',
  async (postData: {
    title: string
    content: string
    category: ForumCategory
    tags: string[]
  }, { rejectWithValue }) => {
    try {
      const response = await forumAPI.createPost(postData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create post')
    }
  }
)

export const createReply = createAsyncThunk(
  'forum/createReply',
  async (replyData: {
    postId: string
    content: string
    parentReply?: string
  }, { rejectWithValue }) => {
    try {
      const response = await forumAPI.createReply(replyData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create reply')
    }
  }
)

export const votePost = createAsyncThunk(
  'forum/votePost',
  async (voteData: {
    postId: string
    type: 'upvote' | 'downvote'
  }, { rejectWithValue }) => {
    try {
      const response = await forumAPI.votePost(voteData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to vote on post')
    }
  }
)

export const voteReply = createAsyncThunk(
  'forum/voteReply',
  async (voteData: {
    replyId: string
    type: 'upvote' | 'downvote'
  }, { rejectWithValue }) => {
    try {
      const response = await forumAPI.voteReply(voteData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to vote on reply')
    }
  }
)

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    setActiveCategory: (state, action: PayloadAction<ForumCategory | 'all'>) => {
      state.activeCategory = action.payload
      state.pagination.page = 1
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.pagination.page = 1
    },
    
    setSortBy: (state, action: PayloadAction<'newest' | 'oldest' | 'popular' | 'replies'>) => {
      state.sortBy = action.payload
      state.pagination.page = 1
    },
    
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    
    clearCurrentPost: (state) => {
      state.currentPost = null
    },
    
    updatePostVotes: (state, action: PayloadAction<{ postId: string; upvotes: number; downvotes: number }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId)
      if (post) {
        post.upvotes = action.payload.upvotes
        post.downvotes = action.payload.downvotes
      }
      
      if (state.currentPost && state.currentPost.id === action.payload.postId) {
        state.currentPost.upvotes = action.payload.upvotes
        state.currentPost.downvotes = action.payload.downvotes
      }
    },
    
    updateReplyVotes: (state, action: PayloadAction<{ replyId: string; upvotes: number; downvotes: number }>) => {
      if (state.currentPost) {
        const reply = state.currentPost.replies.find(r => r.id === action.payload.replyId)
        if (reply) {
          reply.upvotes = action.payload.upvotes
          reply.downvotes = action.payload.downvotes
        }
      }
    },
    
    addReplyToPost: (state, action: PayloadAction<ForumReply>) => {
      if (state.currentPost) {
        state.currentPost.replies.push(action.payload)
      }
    },
    
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPosts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.isLoading = false
        
        if (action.payload.page === 1) {
          state.posts = action.payload.posts
        } else {
          state.posts.push(...action.payload.posts)
        }
        
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasMore: action.payload.hasMore
        }
      })
      .addCase(loadPosts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      .addCase(loadPost.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadPost.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentPost = action.payload
      })
      .addCase(loadPost.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload)
      })
      
      .addCase(createReply.fulfilled, (state, action) => {
        if (state.currentPost) {
          state.currentPost.replies.push(action.payload)
        }
      })
      
      .addCase(votePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId)
        if (post) {
          post.upvotes = action.payload.upvotes
          post.downvotes = action.payload.downvotes
        }
        
        if (state.currentPost && state.currentPost.id === action.payload.postId) {
          state.currentPost.upvotes = action.payload.upvotes
          state.currentPost.downvotes = action.payload.downvotes
        }
      })
      
      .addCase(voteReply.fulfilled, (state, action) => {
        if (state.currentPost) {
          const reply = state.currentPost.replies.find(r => r.id === action.payload.replyId)
          if (reply) {
            reply.upvotes = action.payload.upvotes
            reply.downvotes = action.payload.downvotes
          }
        }
      })
  }
})

export const {
  setActiveCategory,
  setSearchQuery,
  setSortBy,
  setPage,
  clearCurrentPost,
  updatePostVotes,
  updateReplyVotes,
  addReplyToPost,
  clearError
} = forumSlice.actions

export default forumSlice.reducer