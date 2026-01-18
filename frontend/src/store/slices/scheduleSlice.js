import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import scheduleService from '../../services/scheduleService'

export const generateSchedule = createAsyncThunk(
  'schedules/generateSchedule',
  async ({ weekStartDate, weekEndDate }, { rejectWithValue }) => {
    try {
      const response = await scheduleService.generateSchedule(weekStartDate, weekEndDate)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchSchedule = createAsyncThunk(
  'schedules/fetchSchedule',
  async (id, { rejectWithValue }) => {
    try {
      const response = await scheduleService.getSchedule(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const publishSchedule = createAsyncThunk(
  'schedules/publishSchedule',
  async (id, { rejectWithValue }) => {
    try {
      const response = await scheduleService.publishSchedule(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchEmployeeSchedule = createAsyncThunk(
  'schedules/fetchEmployeeSchedule',
  async (_, { rejectWithValue }) => {
    try {
      const response = await scheduleService.getEmployeeSchedule()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  schedules: [],
  currentSchedule: null,
  employeeSchedule: null,
  isLoading: false,
  error: null,
}

const scheduleSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    setCurrentSchedule: (state, action) => {
      state.currentSchedule = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateSchedule.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(generateSchedule.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentSchedule = action.payload
      })
      .addCase(generateSchedule.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.currentSchedule = action.payload
      })
      .addCase(publishSchedule.fulfilled, (state, action) => {
        state.currentSchedule = action.payload
      })
      .addCase(fetchEmployeeSchedule.fulfilled, (state, action) => {
        state.employeeSchedule = action.payload
      })
  },
})

export const { setCurrentSchedule, clearError } = scheduleSlice.actions
export default scheduleSlice.reducer

