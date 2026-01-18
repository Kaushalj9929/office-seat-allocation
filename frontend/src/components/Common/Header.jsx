import { Box, Flex, Heading, Button, Menu, MenuButton, MenuList, MenuItem, Avatar, Text, VStack } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  return (
    <Box 
      bg="white" 
      px={4} 
      py={3} 
      boxShadow="sm" 
      borderBottom="1px solid" 
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={3}>
          <Flex align="center" gap={2}>
            {/* Logo */}
            <Box
              w="32px"
              h="32px"
              bgGradient="linear(to-r, purple.500, pink.500)"
              borderRadius="5px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Box>
            <Heading 
              fontSize="0.9375rem"
              bgGradient="linear(to-r, purple.600, pink.600)" 
              bgClip="text"
              fontWeight="500"
              letterSpacing="-0.01em"
            >
              Office Seat Allocation
            </Heading>
          </Flex>
          <Text 
            fontSize="0.6875rem" 
            color="gray.600" 
            fontWeight="400"
            letterSpacing="0.05em"
            textTransform="uppercase"
          >
            {user?.role === 'admin' && 'Admin Portal'}
            {user?.role === 'employee' && 'Employee Portal'}
            {(user?.role === 'manager' || user?.role === 'team_lead') && 'Manager Portal'}
          </Text>
        </Flex>
        
        <Menu>
          <MenuButton 
            as={Button} 
            rightIcon={<ChevronDownIcon />} 
            variant="ghost"
            _hover={{ bg: 'gray.50', transform: 'scale(1.02)' }}
            transition="all 0.2s"
            px={2}
            py={1.5}
            fontSize="0.75rem"
            fontWeight="400"
          >
            <Flex align="center" gap={2}>
              <Avatar size="xs" name={user?.name} bgGradient="linear(to-r, purple.500, pink.500)" />
              <VStack spacing={0} align="start">
                <Text fontSize="0.75rem" fontWeight="500" color="gray.800" letterSpacing="-0.01em">
                  {user?.name}
                </Text>
                <Text fontSize="0.6875rem" color="gray.500" fontWeight="400">
                  {user?.email}
                </Text>
              </VStack>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem 
              onClick={handleLogout} 
              color="red.600"
              fontWeight="400"
              fontSize="0.75rem"
              _hover={{ bg: 'red.50' }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  )
}

export default Header

