import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import employeeSlice from './slices/employeeSlice'
import teamSlice from './slices/teamSlice'
import scheduleSlice from './slices/scheduleSlice'
import changeRequestSlice from './slices/changeRequestSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    employees: employeeSlice,
    teams: teamSlice,
    schedules: scheduleSlice,
    changeRequests: changeRequestSlice,
  },
})

