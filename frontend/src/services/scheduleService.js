import { ApiService } from './api'
import scheduleMockData from '../data/mock/schedules.json'

class ScheduleService extends ApiService {
  constructor() {
    super(scheduleMockData)
  }

  async generateSchedule(weekStartDate, weekEndDate) {
    if (this.useMock) {
      await this.mockDelay(1000) // Simulate longer processing
      const newSchedule = {
        ...this.mockData,
        id: `schedule-${Date.now()}`,
        week_start_date: weekStartDate,
        week_end_date: weekEndDate,
        status: 'draft',
        created_at: new Date().toISOString(),
        published_at: null
      }
      return { data: newSchedule }
    }
    return this.post('/admin/schedules/generate', {
      week_start_date: weekStartDate,
      week_end_date: weekEndDate
    })
  }

  async getSchedule(id) {
    if (this.useMock) {
      await this.mockDelay()
      return { data: this.mockData }
    }
    return this.get(`/admin/schedules/${id}`)
  }

  async updateSchedule(id, scheduleData) {
    if (this.useMock) {
      await this.mockDelay()
      const updated = { ...this.mockData, ...scheduleData, updated_at: new Date().toISOString() }
      return { data: updated }
    }
    return this.put(`/admin/schedules/${id}`, scheduleData)
  }

  async publishSchedule(id) {
    if (this.useMock) {
      await this.mockDelay()
      const published = {
        ...this.mockData,
        status: 'published',
        published_at: new Date().toISOString()
      }
      return { data: published }
    }
    return this.post(`/admin/schedules/${id}/publish`)
  }

  async getScheduleEntries(id) {
    if (this.useMock) {
      await this.mockDelay()
      return { data: this.mockData.entries }
    }
    return this.get(`/admin/schedules/${id}/entries`)
  }

  async getEmployeeSchedule() {
    if (this.useMock) {
      await this.mockDelay()
      return { data: this.mockData }
    }
    return this.get('/employee/schedule')
  }
}

export default new ScheduleService()

