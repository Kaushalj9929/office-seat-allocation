import { Routes, Route } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import Header from '../components/Common/Header'
import Sidebar from '../components/Common/Sidebar'
import EmployeeList from '../components/Admin/EmployeeManagement/EmployeeList'
import TeamList from '../components/Admin/TeamManagement/TeamList'
import ScheduleGenerator from '../components/Admin/ScheduleGeneration/ScheduleGenerator'

function AdminDashboard() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Flex>
        <Sidebar />
        <Box flex="1" p={4} bg="gray.50" minW={0}>
          <Routes>
            <Route path="employees" element={<EmployeeList />} />
            <Route path="teams" element={<TeamList />} />
            <Route path="schedules" element={<ScheduleGenerator />} />
            <Route path="*" element={<EmployeeList />} />
          </Routes>
        </Box>
      </Flex>
    </Box>
  )
}

export default AdminDashboard

