import { Routes, Route } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import Header from '../components/Common/Header'
import Sidebar from '../components/Common/Sidebar'
import ScheduleView from '../components/Employee/ScheduleView/ScheduleView'
import ChangeRequestHistory from '../components/Employee/ChangeRequest/ChangeRequestHistory'

function EmployeeDashboard() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Flex>
        <Sidebar />
        <Box flex="1" p={4} bg="gray.50" minW={0}>
          <Routes>
            <Route path="schedule" element={<ScheduleView />} />
            <Route path="change-requests" element={<ChangeRequestHistory />} />
            <Route path="*" element={<ScheduleView />} />
          </Routes>
        </Box>
      </Flex>
    </Box>
  )
}

export default EmployeeDashboard

