import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import teamService from '../../services/teamService'

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await teamService.getTeams()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (teamData, { rejectWithValue }) => {
    try {
      const response = await teamService.createTeam(teamData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await teamService.updateTeam(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  teams: [],
  selectedTeam: null,
  isLoading: false,
  error: null,
}

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setSelectedTeam: (state, action) => {
      state.selectedTeam = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.isLoading = false
        state.teams = action.payload
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload)
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex(team => team.id === action.payload.id)
        if (index !== -1) {
          state.teams[index] = action.payload
        }
      })
  },
})

export const { setSelectedTeam, clearError } = teamSlice.actions
export default teamSlice.reducer

