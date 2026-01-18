import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import changeRequestService from '../../services/changeRequestService'

export const submitRequest = createAsyncThunk(
  'changeRequests/submitRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await changeRequestService.submitRequest(requestData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchRequests = createAsyncThunk(
  'changeRequests/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await changeRequestService.getRequests()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const cancelRequest = createAsyncThunk(
  'changeRequests/cancelRequest',
  async (id, { rejectWithValue }) => {
    try {
      const response = await changeRequestService.cancelRequest(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchTeamRequests = createAsyncThunk(
  'changeRequests/fetchTeamRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await changeRequestService.getTeamRequests()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const approveRequest = createAsyncThunk(
  'changeRequests/approveRequest',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await changeRequestService.approveRequest(id, reason)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const rejectRequest = createAsyncThunk(
  'changeRequests/rejectRequest',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await changeRequestService.rejectRequest(id, reason)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  requests: [],
  isLoading: false,
  error: null,
}

const changeRequestSlice = createSlice({
  name: 'changeRequests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitRequest.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(submitRequest.fulfilled, (state, action) => {
        state.isLoading = false
        state.requests.push(action.payload)
      })
      .addCase(submitRequest.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.requests = action.payload
      })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(req => req.id === action.payload.id)
        if (index !== -1) {
          state.requests[index] = action.payload
        }
      })
      .addCase(fetchTeamRequests.fulfilled, (state, action) => {
        state.requests = action.payload
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(req => req.id === action.payload.id)
        if (index !== -1) {
          state.requests[index] = action.payload
        }
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(req => req.id === action.payload.id)
        if (index !== -1) {
          state.requests[index] = action.payload
        }
      })
  },
})

export const { clearError } = changeRequestSlice.actions
export default changeRequestSlice.reducer

