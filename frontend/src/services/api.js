import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1'
// Default to true (use mock data) if not explicitly set to false
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post(
          `${API_BASE_URL}/api/${API_VERSION}/auth/refresh`,
          { refresh_token: refreshToken }
        )

        const { access_token } = response.data
        localStorage.setItem('access_token', access_token)

        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Mock data delay simulation
const mockDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Service base class with mock data support
export class ApiService {
  constructor(mockData = null) {
    this.mockData = mockData
    this.useMock = USE_MOCK_DATA
    this.mockDelay = mockDelay
  }

  async get(endpoint, config = {}) {
    if (this.useMock && this.mockData) {
      await this.mockDelay()
      return { data: this.mockData }
    }
    return apiClient.get(endpoint, config)
  }

  async post(endpoint, data, config = {}) {
    if (this.useMock && this.mockData) {
      await this.mockDelay()
      // For POST, return the data with generated ID
      const response = {
        ...data,
        id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        created_at: new Date().toISOString(),
      }
      return { data: response }
    }
    return apiClient.post(endpoint, data, config)
  }

  async put(endpoint, data, config = {}) {
    if (this.useMock && this.mockData) {
      await this.mockDelay()
      return { data: { ...this.mockData, ...data } }
    }
    return apiClient.put(endpoint, data, config)
  }

  async delete(endpoint, config = {}) {
    if (this.useMock && this.mockData) {
      await this.mockDelay()
      return { data: null }
    }
    return apiClient.delete(endpoint, config)
  }
}

export default apiClient

