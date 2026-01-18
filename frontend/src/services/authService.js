import { ApiService } from './api'
import authMockData from '../data/mock/auth.json'
import employeesMockData from '../data/mock/employees.json'

class AuthService extends ApiService {
  constructor() {
    super(authMockData)
    // Store reference to employees mock data for dynamic user lookup
    this.employeesMockData = employeesMockData
  }

  async login(email, password) {
    if (this.useMock) {
      await this.mockDelay()
      // First check predefined users
      if (email === 'admin@example.com') {
        return { data: this.mockData.admin }
      } else if (email === 'john.doe@example.com') {
        return { data: this.mockData.employee }
      } else if (email === 'jane.smith@example.com') {
        return { data: this.mockData.manager }
      }
      
      // Then check employees list for dynamically added users
      // Note: This checks the shared employees mock data object
      const employee = this.employeesMockData.data.find(emp => emp.email === email)
      
      if (employee) {
        return {
          data: {
            access_token: `mock-token-${employee.id}`,
            refresh_token: `mock-refresh-${employee.id}`,
            expires_in: 3600,
            user: {
              id: employee.id,
              email: employee.email,
              name: employee.name,
              role: employee.role,
              status: employee.status,
            }
          }
        }
      }
      
      // Default to employee if not found
      return { data: this.mockData.employee }
    }
    return this.post('/auth/login', { email, password })
  }

  async logout() {
    if (this.useMock) {
      await this.mockDelay()
      return { data: { message: 'Logged out successfully' } }
    }
    return this.post('/auth/logout')
  }

  async refreshToken(refreshToken) {
    if (this.useMock) {
      await this.mockDelay()
      return { data: { access_token: 'new-mock-token', expires_in: 3600 } }
    }
    return this.post('/auth/refresh', { refresh_token: refreshToken })
  }
}

export default new AuthService()

