import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Text,
  Alert,
  AlertIcon,
  useToast,
  HStack,
  Flex,
} from '@chakra-ui/react'
import { EmailIcon, LockIcon } from '@chakra-ui/icons'
import { login } from '../store/slices/authSlice'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const { isLoading, error } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await dispatch(login({ email, password }))
      if (login.fulfilled.match(result)) {
        const user = result.payload.user
        toast({
          title: 'Login successful',
          description: `Welcome back, ${user.name}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin/employees')
        } else if (user.role === 'manager' || user.role === 'team_lead') {
          navigate('/manager/team-schedule')
        } else {
          navigate('/employee/schedule')
        }
      } else {
        toast({
          title: 'Login failed',
          description: result.payload || 'Invalid credentials',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An error occurred during login',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={8}
    >
      <Container maxW="md" centerContent>
        <Box
          bg="white"
          p={6}
          borderRadius="5px"
          boxShadow="sm"
          w="100%"
          maxW="400px"
          border="1px solid"
          borderColor="gray.200"
        >
          <VStack spacing={5}>
            {/* Logo and Title */}
            <VStack spacing={2}>
              <Box
                w="48px"
                h="48px"
                bgGradient="linear(to-r, purple.500, pink.500)"
                borderRadius="5px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Box>
              <VStack spacing={1}>
                <Heading 
                  fontSize="1.25rem"
                  fontWeight="500" 
                  color="gray.800"
                  letterSpacing="-0.02em"
                  fontFamily="Poppins"
                >
                  Welcome Back
                </Heading>
                <Text fontSize="0.75rem" color="gray.600" fontWeight="400">
                  Sign in to your account
                </Text>
              </VStack>
            </VStack>

            {error && (
              <Alert status="error" borderRadius="5px" w="100%" fontSize="0.75rem" py={2}>
                <AlertIcon />
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
                {/* Email Field */}
                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="500" mb={1.5} fontSize="0.75rem">
                    Email Address
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400" h="100%">
                      <EmailIcon boxSize={3.5} />
                    </InputLeftElement>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      size="sm"
                      pl={9}
                      borderRadius="5px"
                      border="1px solid"
                      borderColor="gray.300"
                      bg="white"
                      fontSize="0.75rem"
                      py={4}
                      _focus={{
                        borderColor: 'purple.500',
                        boxShadow: '0 0 0 1px purple.500',
                      }}
                      _hover={{
                        borderColor: 'gray.400',
                      }}
                    />
                  </InputGroup>
                </FormControl>

                {/* Password Field */}
                <FormControl isRequired>
                  <Flex justify="space-between" mb={1.5}>
                    <FormLabel color="gray.700" fontWeight="500" mb={0} fontSize="0.75rem">
                      Password
                    </FormLabel>
                    <Text
                      fontSize="0.6875rem"
                      color="purple.600"
                      cursor="pointer"
                      fontWeight="400"
                      _hover={{ color: 'purple.700', textDecoration: 'underline' }}
                    >
                      Forgot?
                    </Text>
                  </Flex>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400" h="100%">
                      <LockIcon boxSize={3.5} />
                    </InputLeftElement>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      size="sm"
                      pl={9}
                      borderRadius="5px"
                      border="1px solid"
                      borderColor="gray.300"
                      bg="white"
                      fontSize="0.75rem"
                      py={4}
                      _focus={{
                        borderColor: 'purple.500',
                        boxShadow: '0 0 0 1px purple.500',
                      }}
                      _hover={{
                        borderColor: 'gray.400',
                      }}
                    />
                  </InputGroup>
                </FormControl>

                {/* Login Button */}
                <Button
                  type="submit"
                  size="sm"
                  width="100%"
                  bgGradient="linear(to-r, purple.500, pink.500)"
                  color="white"
                  _hover={{
                    bgGradient: 'linear(to-r, purple.600, pink.600)',
                    transform: 'translateY(-1px)',
                    boxShadow: 'md',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  fontWeight="500"
                  fontSize="0.75rem"
                  letterSpacing="0.01em"
                  transition="all 0.2s"
                  borderRadius="5px"
                  py={4}
                  mt={1}
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            {/* Test Panel Button */}
            <Button
              variant="outline"
              size="sm"
              width="100%"
              onClick={() => navigate('/test')}
              borderColor="gray.300"
              color="gray.700"
              _hover={{
                bg: 'gray.50',
                borderColor: 'purple.500',
                color: 'purple.600',
              }}
              fontWeight="500"
              fontSize="0.75rem"
              letterSpacing="0.01em"
              transition="all 0.2s"
              borderRadius="5px"
              py={4}
            >
              Test Panel
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}

export default LoginPage
