import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  VStack,
  Heading,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  Text,
  Badge,
  HStack,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Divider,
} from '@chakra-ui/react'
import { AddIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { login } from '../store/slices/authSlice'
import { createEmployee } from '../store/slices/employeeSlice'

function TestPanel() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'employee',
    team_id: null,
  })

  const testUsers = [
    {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      password: 'any',
    },
    {
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: 'employee',
      password: 'any',
    },
    {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      role: 'team_lead',
      password: 'any',
    },
    {
      email: 'bob.johnson@example.com',
      name: 'Bob Johnson',
      role: 'employee',
      password: 'any',
    },
    {
      email: 'alice.williams@example.com',
      name: 'Alice Williams',
      role: 'employee',
      password: 'any',
    },
  ]

  const handleQuickLogin = async (user) => {
    try {
      const result = await dispatch(login({ email: user.email, password: user.password }))
      if (login.fulfilled.match(result)) {
        const loggedInUser = result.payload.user
        toast({
          title: 'Login successful',
          description: `Logged in as ${loggedInUser.name}`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        
        // Redirect based on role
        if (loggedInUser.role === 'admin') {
          navigate('/admin/employees')
        } else if (loggedInUser.role === 'manager' || loggedInUser.role === 'team_lead') {
          navigate('/manager/team-schedule')
        } else {
          navigate('/employee/schedule')
        }
      }
    } catch (err) {
      toast({
        title: 'Login failed',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: 'Error',
        description: 'Please fill in name and email',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    try {
      await dispatch(createEmployee({
        ...newUser,
        password: 'password123',
        status: 'active',
      }))
      
      toast({
        title: 'User added',
        description: `${newUser.name} has been added successfully`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      
      setNewUser({ name: '', email: '', role: 'employee', team_id: null })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add user',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'red'
      case 'team_lead':
      case 'manager':
        return 'purple'
      default:
        return 'blue'
    }
  }

  return (
    <Box minH="100vh" bgGradient="linear(to-r, cyan.400, purple.500)" py={10}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          {/* Header */}
          <Box bg="white" p={6} borderRadius="5px" boxShadow="sm" w="100%" border="1px solid" borderColor="gray.200">
            <Heading fontSize="1.75rem" bgGradient="linear(to-r, cyan.400, purple.500)" bgClip="text" mb={2} fontWeight="500" letterSpacing="-0.02em">
              Test Panel
            </Heading>
            <Text color="gray.600" fontSize="0.875rem" fontWeight="400">
              Quick access to test users and add new users for testing
            </Text>
          </Box>

          {/* Quick Login Section */}
          <Box bg="white" p={6} borderRadius="5px" boxShadow="sm" w="100%" border="1px solid" borderColor="gray.200">
            <Heading fontSize="1.25rem" mb={3} color="gray.800" fontWeight="500" letterSpacing="-0.01em">
              Quick Login
            </Heading>
            <Text color="gray.600" mb={5} fontSize="0.875rem" fontWeight="400">
              Click on any user below to quickly login as that user
            </Text>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
              {testUsers.map((user, index) => (
                <GridItem key={index}>
                  <Card
                    cursor="pointer"
                    borderRadius="5px"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.2s"
                    onClick={() => handleQuickLogin(user)}
                  >
                    <CardBody p={4}>
                      <VStack spacing={3} align="start">
                        <HStack justify="space-between" w="100%">
                          <Text fontWeight="500" fontSize="0.9375rem" color="gray.800">
                            {user.name}
                          </Text>
                          <Badge 
                            colorScheme={getRoleColor(user.role)}
                            fontSize="0.6875rem"
                            fontWeight="500"
                            borderRadius="5px"
                            px={2}
                            py={0.5}
                          >
                            {user.role}
                          </Badge>
                        </HStack>
                        <Text fontSize="0.8125rem" color="gray.600" fontWeight="400">
                          {user.email}
                        </Text>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          rightIcon={<ArrowForwardIcon />}
                          w="100%"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuickLogin(user)
                          }}
                          fontSize="0.8125rem"
                          fontWeight="500"
                          borderRadius="5px"
                        >
                          Login
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              ))}
            </Grid>
          </Box>

          <Divider borderColor="whiteAlpha.300" />

          {/* Add User Section */}
          <Box bg="white" p={6} borderRadius="5px" boxShadow="sm" w="100%" border="1px solid" borderColor="gray.200">
            <Heading fontSize="1.25rem" mb={4} color="gray.800" fontWeight="500" letterSpacing="-0.01em">
              Add New User
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={4}>
              <FormControl>
                <FormLabel fontSize="0.875rem" fontWeight="500" color="gray.700">Name</FormLabel>
                <Input
                  placeholder="Enter user name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  fontSize="0.875rem"
                  borderRadius="5px"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="0.875rem" fontWeight="500" color="gray.700">Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  fontSize="0.875rem"
                  borderRadius="5px"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="0.875rem" fontWeight="500" color="gray.700">Role</FormLabel>
                <HStack spacing={2}>
                  {['employee', 'team_lead', 'admin'].map((role) => (
                    <Button
                      key={role}
                      size="sm"
                      colorScheme={newUser.role === role ? 'blue' : 'gray'}
                      variant={newUser.role === role ? 'solid' : 'outline'}
                      onClick={() => setNewUser({ ...newUser, role })}
                      textTransform="capitalize"
                      fontSize="0.8125rem"
                      fontWeight="500"
                      borderRadius="5px"
                    >
                      {role}
                    </Button>
                  ))}
                </HStack>
              </FormControl>
            </Grid>
            <Button
              leftIcon={<AddIcon />}
              onClick={handleAddUser}
              size="md"
              w="100%"
              bgGradient="linear(to-r, green.400, teal.500)"
              color="white"
              _hover={{
                bgGradient: 'linear(to-r, green.500, teal.600)',
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              fontSize="0.875rem"
              fontWeight="500"
              borderRadius="5px"
            >
              Add User
            </Button>
          </Box>

          {/* Navigation */}
          <Box bg="white" p={4} borderRadius="5px" boxShadow="sm" w="100%" border="1px solid" borderColor="gray.200">
            <HStack spacing={4} justify="center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                fontSize="0.875rem"
                fontWeight="500"
                borderRadius="5px"
              >
                Landing Page
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                fontSize="0.875rem"
                fontWeight="500"
                borderRadius="5px"
              >
                Login Page
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default TestPanel

