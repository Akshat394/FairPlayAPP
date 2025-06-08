import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { APIResponse, User, AvatarConfig, GearItem, QuizQuestion, ForumPost, Achievement, UserStats } from '@types/index'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class APIService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('fairplay-token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('fairplay-token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  private async request<T>(method: string, url: string, data?: any): Promise<APIResponse<T>> {
    try {
      const response: AxiosResponse<APIResponse<T>> = await this.client.request({
        method,
        url,
        data
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'API request failed')
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request<{ user: User; token: string }>('POST', '/auth/login', credentials)
  }

  async register(userData: { username: string; email: string; password: string; role: string }) {
    return this.request<{ user: User; token: string }>('POST', '/auth/register', userData)
  }

  async logout() {
    return this.request('POST', '/auth/logout')
  }

  async verifyToken(token: string) {
    return this.request<{ user: User }>('GET', '/auth/verify', { token })
  }

  // Avatar endpoints
  async getAvatar(userId: string) {
    return this.request<AvatarConfig>('GET', `/avatar/${userId}`)
  }

  async saveAvatar(config: AvatarConfig) {
    return this.request<AvatarConfig>('PUT', '/avatar', config)
  }

  async getAvailableGear() {
    return this.request<GearItem[]>('GET', '/avatar/gear')
  }

  // Quiz endpoints
  async generateQuiz(params: { difficulty: string; category: string; questionCount: number }) {
    return this.request<QuizQuestion[]>('POST', '/quiz/generate', params)
  }

  async submitQuiz(data: { quizId: string; answers: Record<string, any>; timeSpent: number; difficulty: string; category: string }) {
    return this.request<any>('POST', '/quiz/submit', data)
  }

  // Forum endpoints
  async getPosts(params: any) {
    return this.request<{ posts: ForumPost[]; page: number; limit: number; total: number; hasMore: boolean }>('GET', '/forum/posts', params)
  }

  async getPost(postId: string) {
    return this.request<ForumPost>('GET', `/forum/posts/${postId}`)
  }

  async createPost(postData: any) {
    return this.request<ForumPost>('POST', '/forum/posts', postData)
  }

  async createReply(replyData: any) {
    return this.request<any>('POST', '/forum/replies', replyData)
  }

  async votePost(voteData: any) {
    return this.request<any>('POST', '/forum/vote/post', voteData)
  }

  async voteReply(voteData: any) {
    return this.request<any>('POST', '/forum/vote/reply', voteData)
  }

  // Achievement endpoints
  async getAchievements() {
    return this.request<{ all: Achievement[]; unlocked: Achievement[] }>('GET', '/achievements')
  }

  async getUserStats() {
    return this.request<UserStats>('GET', '/achievements/stats')
  }

  async checkAchievements(action: any) {
    return this.request<any>('POST', '/achievements/check', action)
  }
}

// Create service instances
const apiService = new APIService()

export const authAPI = {
  login: apiService.login.bind(apiService),
  register: apiService.register.bind(apiService),
  logout: apiService.logout.bind(apiService),
  verifyToken: apiService.verifyToken.bind(apiService)
}

export const avatarAPI = {
  getAvatar: apiService.getAvatar.bind(apiService),
  saveAvatar: apiService.saveAvatar.bind(apiService),
  getAvailableGear: apiService.getAvailableGear.bind(apiService)
}

export const quizAPI = {
  generateQuiz: apiService.generateQuiz.bind(apiService),
  submitQuiz: apiService.submitQuiz.bind(apiService)
}

export const forumAPI = {
  getPosts: apiService.getPosts.bind(apiService),
  getPost: apiService.getPost.bind(apiService),
  createPost: apiService.createPost.bind(apiService),
  createReply: apiService.createReply.bind(apiService),
  votePost: apiService.votePost.bind(apiService),
  voteReply: apiService.voteReply.bind(apiService)
}

export const achievementAPI = {
  getAchievements: apiService.getAchievements.bind(apiService),
  getUserStats: apiService.getUserStats.bind(apiService),
  checkAchievements: apiService.checkAchievements.bind(apiService)
}

export default apiService