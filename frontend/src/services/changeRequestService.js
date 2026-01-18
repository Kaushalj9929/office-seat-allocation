import { ApiService } from './api'
import changeRequestsMockData from '../data/mock/changeRequests.json'

class ChangeRequestService extends ApiService {
  constructor() {
    super(changeRequestsMockData)
  }

  async submitRequest(requestData) {
    if (this.useMock) {
      await this.mockDelay()
      const newRequest = {
        ...requestData,
        id: `req-${Date.now()}`,
        employee_id: localStorage.getItem('user_id') || 'emp-001',
        status: 'pending',
        requested_date: new Date().toISOString()
      }
      this.mockData.data.push(newRequest)
      return { data: newRequest }
    }
    return this.post('/employee/change-requests', requestData)
  }

  async getRequests() {
    if (this.useMock) {
      await this.mockDelay()
      const userId = localStorage.getItem('user_id') || 'emp-001'
      const userRequests = this.mockData.data.filter(req => req.employee_id === userId)
      return { data: userRequests }
    }
    return this.get('/employee/change-requests')
  }

  async cancelRequest(id) {
    if (this.useMock) {
      await this.mockDelay()
      const index = this.mockData.data.findIndex(req => req.id === id)
      if (index !== -1) {
        this.mockData.data[index].status = 'cancelled'
        return { data: this.mockData.data[index] }
      }
      throw new Error('Request not found')
    }
    return this.delete(`/employee/change-requests/${id}`)
  }

  async getTeamRequests() {
    if (this.useMock) {
      await this.mockDelay()
      return { data: this.mockData.data }
    }
    return this.get('/manager/change-requests')
  }

  async approveRequest(id, reason) {
    if (this.useMock) {
      await this.mockDelay()
      const index = this.mockData.data.findIndex(req => req.id === id)
      if (index !== -1) {
        this.mockData.data[index] = {
          ...this.mockData.data[index],
          status: 'approved',
          decision_date: new Date().toISOString(),
          decision_reason: reason
        }
        return { data: this.mockData.data[index] }
      }
      throw new Error('Request not found')
    }
    return this.put(`/manager/change-requests/${id}/approve`, { decision_reason: reason })
  }

  async rejectRequest(id, reason) {
    if (this.useMock) {
      await this.mockDelay()
      const index = this.mockData.data.findIndex(req => req.id === id)
      if (index !== -1) {
        this.mockData.data[index] = {
          ...this.mockData.data[index],
          status: 'rejected',
          decision_date: new Date().toISOString(),
          decision_reason: reason
        }
        return { data: this.mockData.data[index] }
      }
      throw new Error('Request not found')
    }
    return this.put(`/manager/change-requests/${id}/reject`, { decision_reason: reason })
  }

  async getRequestById(id) {
    if (this.useMock) {
      await this.mockDelay()
      const request = this.mockData.data.find(req => req.id === id)
      if (!request) {
        throw new Error('Request not found')
      }
      return { data: request }
    }
    return this.get(`/employee/change-requests/${id}`)
  }

  // Admin Change Request APIs
  async getAdminChangeRequests(filters = {}) {
    if (this.useMock) {
      await this.mockDelay()
      let data = [...this.mockData.data]
      
      // Apply filters
      if (filters.status) {
        data = data.filter(req => req.status === filters.status)
      }
      
      return { data }
    }
    return this.get('/admin/change-requests', { params: filters })
  }

  async getAdminChangeRequestById(id) {
    if (this.useMock) {
      await this.mockDelay()
      const request = this.mockData.data.find(req => req.id === id)
      if (!request) {
        throw new Error('Request not found')
      }
      return { data: request }
    }
    return this.get(`/admin/change-requests/${id}`)
  }

  async approveAdminChangeRequest(id, reason) {
    if (this.useMock) {
      await this.mockDelay()
      const index = this.mockData.data.findIndex(req => req.id === id)
      if (index !== -1) {
        this.mockData.data[index] = {
          ...this.mockData.data[index],
          status: 'approved',
          decision_date: new Date().toISOString(),
          decision_reason: reason
        }
        return { data: this.mockData.data[index] }
      }
      throw new Error('Request not found')
    }
    return this.post(`/admin/change-requests/${id}/approve`, { decision_reason: reason })
  }

  async rejectAdminChangeRequest(id, reason) {
    if (this.useMock) {
      await this.mockDelay()
      const index = this.mockData.data.findIndex(req => req.id === id)
      if (index !== -1) {
        this.mockData.data[index] = {
          ...this.mockData.data[index],
          status: 'rejected',
          decision_date: new Date().toISOString(),
          decision_reason: reason
        }
        return { data: this.mockData.data[index] }
      }
      throw new Error('Request not found')
    }
    return this.post(`/admin/change-requests/${id}/reject`, { decision_reason: reason })
  }
}

export default new ChangeRequestService()

