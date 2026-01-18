import { Routes, Route } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import Header from '../components/Common/Header'
import Sidebar from '../components/Common/Sidebar'
import TeamSchedule from '../components/Manager/TeamSchedule'
import TeamChangeRequests from '../components/Manager/TeamChangeRequests'

function ManagerDashboard() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Flex>
        <Sidebar />
        <Box flex="1" p={4} bg="gray.50" minW={0}>
          <Routes>
            <Route path="team-schedule" element={<TeamSchedule />} />
            <Route path="change-requests" element={<TeamChangeRequests />} />
            <Route path="*" element={<TeamSchedule />} />
          </Routes>
        </Box>
      </Flex>
    </Box>
  )
}

export default ManagerDashboard

