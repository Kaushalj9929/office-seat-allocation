import { ApiService } from './api'
import employeesMockData from '../data/mock/employees.json'

class EmployeeService extends ApiService {
  constructor() {
    super(employeesMockData)
  }

  async getEmployees(page = 1, limit = 20, filters = {}) {
    if (this.useMock) {
      await this.mockDelay()
      let data = [...this.mockData.data]
      
      // Apply filters
      if (filters.team_id) {
        data = data.filter(emp => emp.team_id === filters.team_id)
      }
      if (filters.status) {
        data = data.filter(emp => emp.status === filters.status)
      }
      
      // Apply pagination
      const start = (page - 1) * limit
      const end = start + limit
      const paginatedData = data.slice(start, end)
      
      return {
        data: {
          data: paginatedData,
          pagination: {
            page,
            limit,
            total: data.length
          }
        }
      }
    }
    return this.get('/admin/employees', { params: { page, limit, ...filters } })
  }

  async createEmployee(employeeData) {
    if (this.useMock) {
      await this.mockDelay()
      const newEmployee = {
        ...employeeData,
        id: `emp-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      this.mockData.data.push(newEmployee)
      return { data: newEmployee }
    }
    return this.post('/admin/employees', employeeData)
  }

  async updateEmployee(id, employeeData) {
    if (this.useMock) {
      await this.mockDelay()
      const index = this.mockData.data.findIndex(emp => emp.id === id)
      if (index !== -1) {
        this.mockData.data[index] = {
          ...this.mockData.data[index],
          ...employeeData,
          updated_at: new Date().toISOString()
        }
        return { data: this.mockData.data[index] }
      }
      throw new Error('Employee not found')
    }
    return this.put(`/admin/employees/${id}`, employeeData)
  }

  async deleteEmployee(id) {
    if (this.useMock) {
      await this.mockDelay()
      this.mockData.data = this.mockData.data.filter(emp => emp.id !== id)
      return { data: null }
    }
    return this.delete(`/admin/employees/${id}`)
  }
}

export default new EmployeeService()

