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
}

export default new ChangeRequestService()

