import { useState } from 'react'
import { Box, VStack, Link, Text, Button, IconButton, Flex, Divider } from '@chakra-ui/react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { logout } from '../../store/slices/authSlice'

// Professional Icons as SVG
const EmployeesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TeamsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ScheduleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChangeRequestIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.5 3.5C16.8978 3.10218 17.4374 2.87868 18 2.87868C18.5626 2.87868 19.1022 3.10218 19.5 3.5C19.8978 3.89782 20.1213 4.43739 20.1213 5C20.1213 5.56261 19.8978 6.10218 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const role = user?.role

  const adminLinks = [
    { path: '/admin/employees', label: 'Employees', icon: EmployeesIcon },
    { path: '/admin/teams', label: 'Teams', icon: TeamsIcon },
    { path: '/admin/schedules', label: 'Schedules', icon: ScheduleIcon },
  ]

  const employeeLinks = [
    { path: '/employee/schedule', label: 'My Schedule', icon: ScheduleIcon },
    { path: '/employee/change-requests', label: 'Change Requests', icon: ChangeRequestIcon },
  ]

  const managerLinks = [
    { path: '/manager/team-schedule', label: 'Team Schedule', icon: ScheduleIcon },
    { path: '/manager/change-requests', label: 'Change Requests', icon: ChangeRequestIcon },
  ]

  const getLinks = () => {
    if (role === 'admin') return adminLinks
    if (role === 'manager' || role === 'team_lead') return managerLinks
    return employeeLinks
  }

  const links = getLinks()

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  return (
    <Box
      w={isCollapsed ? '70px' : '240px'}
      bg="white"
      minH="calc(100vh - 57px)"
      p={isCollapsed ? 3 : 4}
      borderRight="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      position="relative"
      transition="width 0.3s ease"
      flexShrink={0}
    >
      {/* Toggle Button - Aligned with header logo */}
      <IconButton
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        onClick={() => setIsCollapsed(!isCollapsed)}
        position="absolute"
        top="12px"
        left={isCollapsed ? '50%' : 'auto'}
        right={isCollapsed ? 'auto' : '-12px'}
        transform={isCollapsed ? 'translateX(-50%)' : 'none'}
        size="xs"
        w="24px"
        h="24px"
        minW="24px"
        minH="24px"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="5px"
        boxShadow="sm"
        _hover={{
          bg: 'gray.50',
          transform: isCollapsed ? 'translateX(-50%) scale(1.05)' : 'scale(1.05)',
        }}
        transition="all 0.2s"
        zIndex={10}
      />

      <VStack align="stretch" spacing={2} h="100%" pt={isCollapsed ? '40px' : '0'}>
        {/* Navigation Links */}
        <VStack align="stretch" spacing={2} flex="1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                as={RouterLink}
                to={link.path}
                px={isCollapsed ? 2 : 3}
                py={2}
                borderRadius="5px"
                bgGradient={
                  isActive 
                    ? 'linear(to-r, purple.500, pink.500)' 
                    : 'transparent'
                }
                color={isActive ? 'white' : 'gray.700'}
                _hover={{
                  bgGradient: isActive 
                    ? 'linear(to-r, purple.600, pink.600)' 
                    : 'linear(to-r, purple.50, pink.50)',
                  transform: 'translateX(2px)',
                  color: isActive ? 'white' : 'purple.700',
                }}
                transition="all 0.2s"
                fontWeight={isActive ? '500' : '400'}
                fontSize="0.75rem"
                letterSpacing="0.01em"
                display="flex"
                alignItems="center"
                gap={isCollapsed ? 0 : 2}
                justifyContent={isCollapsed ? 'center' : 'flex-start'}
              >
                <Box 
                  flexShrink={0}
                  w="28px"
                  h="28px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon />
                </Box>
                {!isCollapsed && <Text fontSize="0.75rem">{link.label}</Text>}
              </Link>
            )
          })}
        </VStack>

        {/* Logout Button at Bottom */}
        <Box>
          <Divider mb={3} borderColor="gray.200" />
          <Button
            onClick={handleLogout}
            w="100%"
            px={isCollapsed ? 2 : 3}
            py={2}
            borderRadius="5px"
            bg="transparent"
            color="red.600"
            _hover={{
              bg: 'red.50',
              transform: 'translateX(2px)',
            }}
            transition="all 0.2s"
            fontWeight="500"
            fontSize="0.75rem"
            letterSpacing="0.01em"
            display="flex"
            alignItems="center"
            gap={isCollapsed ? 0 : 2}
            justifyContent={isCollapsed ? 'center' : 'flex-start'}
          >
            <Box 
              flexShrink={0}
              w="28px"
              h="28px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <LogoutIcon />
            </Box>
            {!isCollapsed && <Text fontSize="0.75rem">Logout</Text>}
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default Sidebar
