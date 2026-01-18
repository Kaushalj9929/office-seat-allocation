import { ApiService } from './api'
import teamsMockData from '../data/mock/teams.json'

class TeamService extends ApiService {
  constructor() {
    super(teamsMockData)
  }

  async getTeams() {
    if (this.useMock) {
      await this.mockDelay()
      return { data: this.mockData.data }
    }
    return this.get('/admin/teams')
  }

  async createTeam(teamData) {
    if (this.useMock) {
      await this.mockDelay()
      const newTeam = {
        ...teamData,
        id: `team-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      this.mockData.data.push(newTeam)
      return { data: newTeam }
    }
    return this.post('/admin/teams', teamData)
  }

  async updateTeam(id, teamData) {
    if (this.useMock) {
      await this.mockDelay()
      const index = this.mockData.data.findIndex(team => team.id === id)
      if (index !== -1) {
        this.mockData.data[index] = {
          ...this.mockData.data[index],
          ...teamData,
          updated_at: new Date().toISOString()
        }
        return { data: this.mockData.data[index] }
      }
      throw new Error('Team not found')
    }
    return this.put(`/admin/teams/${id}`, teamData)
  }

  async getTeamMembers(id) {
    if (this.useMock) {
      await this.mockDelay()
      // Return employees that belong to this team
      const employeesMockData = await import('../data/mock/employees.json').then(m => m.default || m)
      const members = employeesMockData.data.filter(emp => emp.team_id === id)
      return { data: members }
    }
    return this.get(`/admin/teams/${id}/members`)
  }
}

export default new TeamService()

