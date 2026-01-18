import { Box, Container, Heading, Text, Button, VStack, HStack, Grid, GridItem, Flex, IconButton, Badge, SimpleGrid } from '@chakra-ui/react'
import { ArrowForwardIcon, CheckIcon, StarIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionVStack = motion(VStack)
const MotionHStack = motion(HStack)

function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: '📅',
      title: 'Smart Scheduling',
      description: 'Automated weekly schedule generation with fair distribution of office and work-from-home days.',
      color: 'blue',
    },
    {
      icon: '👥',
      title: 'Team Management',
      description: 'Efficiently manage employees, teams, and seating arrangements with ease.',
      color: 'purple',
    },
    {
      icon: '⚙️',
      title: 'Flexible Requests',
      description: 'Employees can request schedule changes with 2-day advance notice and real-time approval.',
      color: 'pink',
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track office capacity, utilization rates, and employee preferences with comprehensive dashboards.',
      color: 'cyan',
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      description: 'Get instant alerts for schedule changes, approvals, and important updates.',
      color: 'orange',
    },
    {
      icon: '🔒',
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with role-based access control and audit trails.',
      color: 'green',
    },
  ]

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '500+', label: 'Companies' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ]

  const benefits = [
    'Automated fair distribution of office days',
    'Real-time capacity management',
    'Seamless change request workflow',
    'Role-based access control',
    'Comprehensive audit logging',
    'Mobile-friendly interface',
  ]

  return (
    <Box minH="100vh" position="relative" overflow="hidden">
      {/* Animated Background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)"
        backgroundSize="400% 400%"
        animation="gradient 15s ease infinite"
        sx={{
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
        opacity={0.95}
      />
      
      {/* Floating Orbs */}
      <MotionBox
        position="absolute"
        top="10%"
        left="10%"
        w="300px"
        h="300px"
        bg="whiteAlpha.200"
            borderRadius="5px"
        filter="blur(80px)"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <MotionBox
        position="absolute"
        bottom="10%"
        right="10%"
        w="400px"
        h="400px"
        bg="whiteAlpha.200"
            borderRadius="5px"
        filter="blur(100px)"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Navigation Bar */}
      <Box
        position="relative"
        bg="whiteAlpha.100"
        backdropFilter="blur(10px)"
        boxShadow="lg"
        borderBottom="1px solid"
        borderColor="whiteAlpha.200"
      >
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <Heading
              fontSize="1.125rem"
              bgGradient="linear(to-r, white, cyan.100)"
              bgClip="text"
              fontWeight="500"
              letterSpacing="-0.01em"
              textShadow="0 1px 2px rgba(0,0,0,0.1)"
            >
              Office Seat Allocation
            </Heading>
            <HStack spacing={3}>
              <Button
                variant="ghost"
                onClick={() => navigate('/test')}
                color="white"
                _hover={{ bg: 'whiteAlpha.200', transform: 'scale(1.02)' }}
                transition="all 0.2s"
                fontSize="0.875rem"
                fontWeight="400"
                px={3}
                py={2}
              >
                Test Panel
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                color="white"
                _hover={{ bg: 'whiteAlpha.200', transform: 'scale(1.02)' }}
                transition="all 0.2s"
                fontSize="0.875rem"
                fontWeight="400"
                px={3}
                py={2}
              >
                Sign In
              </Button>
              <Button
                bg="white"
                color="purple.600"
                onClick={() => navigate('/login')}
                _hover={{
                  bg: 'whiteAlpha.900',
                  transform: 'translateY(-1px)',
                  boxShadow: 'md',
                }}
                transition="all 0.2s"
                fontWeight="500"
                px={5}
                py={4}
                fontSize="0.875rem"
                borderRadius="5px"
              >
                Get Started
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxW="container.xl" py={32} position="relative" zIndex={1}>
        <MotionVStack
          spacing={10}
          textAlign="center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge
            colorScheme="whiteAlpha"
            px={4}
            py={1.5}
            borderRadius="5px"
            fontSize="0.75rem"
            fontWeight="500"
            letterSpacing="0.05em"
            backdropFilter="blur(10px)"
            bg="whiteAlpha.200"
            color="white"
          >
            Transform Your Office Management
          </Badge>
          
          <Heading
            fontSize={{ base: '2rem', md: '2.5rem', lg: '3rem' }}
            color="white"
            fontWeight="500"
            textShadow="0 2px 10px rgba(0,0,0,0.2)"
            lineHeight="1.3"
            letterSpacing="-0.02em"
          >
            Efficient Office Space
            <br />
            <Box
              as="span"
              bgGradient="linear(to-r, white, cyan.100)"
              bgClip="text"
              fontWeight="500"
            >
              Management Made Simple
            </Box>
          </Heading>
          
          <Text
            fontSize={{ base: '0.9375rem', md: '1rem', lg: '1.125rem' }}
            color="white"
            maxW="2xl"
            opacity={0.95}
            fontWeight="400"
            textShadow="0 1px 5px rgba(0,0,0,0.1)"
            lineHeight="1.6"
            letterSpacing="0"
          >
            Streamline your hybrid work model with intelligent seat allocation, 
            automated scheduling, and seamless change request management.
          </Text>
          
          <HStack spacing={3} flexWrap="wrap" justify="center" mt={4}>
            <Button
              size="md"
              bg="white"
              color="purple.600"
              rightIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/login')}
              _hover={{
                bg: 'whiteAlpha.900',
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
              fontWeight="500"
              px={6}
              py={5}
              fontSize="0.9375rem"
              borderRadius="5px"
            >
              Get Started
            </Button>
            <Button
              size="md"
              variant="outline"
              borderWidth="1px"
              borderColor="white"
              color="white"
              _hover={{
                bg: 'whiteAlpha.200',
                borderColor: 'white',
                transform: 'translateY(-2px)',
              }}
              onClick={() => navigate('/login')}
              px={6}
              py={5}
              fontSize="0.9375rem"
              fontWeight="400"
              borderRadius="5px"
            >
              Learn More
            </Button>
          </HStack>

          {/* Stats */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mt={10} w="100%" maxW="3xl">
            {stats.map((stat, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <VStack spacing={1}>
                  <Text
                    fontSize={{ base: '1.5rem', md: '1.75rem', lg: '2rem' }}
                    fontWeight="500"
                    color="white"
                    textShadow="0 1px 5px rgba(0,0,0,0.2)"
                    letterSpacing="-0.01em"
                    fontFamily="Poppins"
                  >
                    {stat.value}
                  </Text>
                  <Text 
                    color="whiteAlpha.800" 
                    fontSize="0.75rem" 
                    fontWeight="400"
                    letterSpacing="0.05em"
                    textTransform="uppercase"
                  >
                    {stat.label}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </MotionVStack>
      </Container>

      {/* Features Section */}
      <Box bg="white" py={24} position="relative">
        <Container maxW="container.xl">
          <MotionVStack
            spacing={16}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <VStack spacing={3} textAlign="center">
              <Badge colorScheme="purple" px={3} py={1} borderRadius="5px" fontSize="0.75rem" fontWeight="500" letterSpacing="0.05em">
                Features
              </Badge>
              <Heading
                fontSize={{ base: '1.75rem', md: '2rem' }}
                bgGradient="linear(to-r, purple.600, pink.600)"
                bgClip="text"
                fontWeight="500"
                letterSpacing="-0.02em"
              >
                Everything You Need
              </Heading>
              <Text fontSize="0.9375rem" color="gray.600" maxW="2xl" fontWeight="400" lineHeight="1.6">
                Comprehensive tools to manage your office seating efficiently and effortlessly
              </Text>
            </VStack>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={5} w="100%">
              {features.map((feature, index) => (
                <GridItem key={index}>
                  <MotionBox
                    p={6}
                    borderRadius="5px"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{
                      borderColor: `${feature.color}.400`,
                      transform: 'translateY(-4px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.2s"
                    h="100%"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <VStack spacing={3} align="start">
                      <Box
                        fontSize="2rem"
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                      >
                        {feature.icon}
                      </Box>
                      <Heading fontSize="1.125rem" color="gray.800" fontWeight="500" letterSpacing="-0.01em">
                        {feature.title}
                      </Heading>
                      <Text color="gray.600" lineHeight="1.6" fontSize="0.875rem" fontWeight="400">
                        {feature.description}
                      </Text>
                    </VStack>
                  </MotionBox>
                </GridItem>
              ))}
            </Grid>
          </MotionVStack>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box
        bgGradient="linear(to-b, gray.50, white)"
        py={24}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="radial(circle at 20% 50%, purple.100 0%, transparent 50%), radial(circle at 80% 80%, cyan.100 0%, transparent 50%)"
          opacity={0.5}
        />
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={16} alignItems="center">
            <GridItem>
              <MotionVStack
                spacing={8}
                align="start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Badge colorScheme="purple" px={3} py={1} borderRadius="5px" fontSize="0.75rem" fontWeight="500" letterSpacing="0.05em">
                  Why Choose Us?
                </Badge>
                <Heading
                  fontSize={{ base: '1.5rem', md: '1.75rem' }}
                  bgGradient="linear(to-r, purple.600, pink.600)"
                  bgClip="text"
                  fontWeight="500"
                  letterSpacing="-0.02em"
                >
                  Built for Modern Teams
                </Heading>
                <SimpleGrid columns={1} spacing={3} w="100%">
                  {benefits.map((benefit, index) => (
                    <MotionHStack
                      key={index}
                      spacing={3}
                      p={3}
                      borderRadius="5px"
                      bg="white"
                      boxShadow="sm"
                      _hover={{
                        boxShadow: 'md',
                        transform: 'translateX(4px)',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Box
                        w={5}
                        h={5}
                        bgGradient="linear(to-r, purple.400, pink.400)"
                        borderRadius="5px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                      >
                        <CheckIcon color="white" boxSize={2.5} />
                      </Box>
                      <Text fontSize="0.875rem" color="gray.700" fontWeight="400" lineHeight="1.5">
                        {benefit}
                      </Text>
                    </MotionHStack>
                  ))}
                </SimpleGrid>
              </MotionVStack>
            </GridItem>
            <GridItem>
              <MotionBox
                p={6}
                bg="white"
                borderRadius="5px"
                boxShadow="sm"
                border="1px solid"
                borderColor="purple.100"
                position="relative"
                overflow="hidden"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  bgGradient: 'linear(to-r, purple.400, pink.400)',
                }}
              >
                <VStack spacing={4} align="start">
                  <HStack spacing={1}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} color="yellow.400" boxSize={3} />
                    ))}
                  </HStack>
                  <Heading fontSize="1.25rem" bgGradient="linear(to-r, purple.600, pink.600)" bgClip="text" fontWeight="500" letterSpacing="-0.01em">
                    Streamlined Workflow
                  </Heading>
                  <Text color="gray.600" fontSize="0.875rem" lineHeight="1.6" fontWeight="400">
                    Our platform ensures that every employee gets a fair share of office days 
                    while maintaining optimal capacity utilization. The system automatically 
                    handles schedule generation, validates change requests, and keeps everyone 
                    informed through real-time notifications.
                  </Text>
                  <Button
                    bgGradient="linear(to-r, purple.500, pink.500)"
                    color="white"
                    rightIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/login')}
                    _hover={{
                      bgGradient: 'linear(to-r, purple.600, pink.600)',
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.2s"
                    size="md"
                    fontWeight="500"
                    px={5}
                    py={4}
                    fontSize="0.875rem"
                    borderRadius="5px"
                  >
                    Start Managing Today
                  </Button>
                </VStack>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        position="relative"
        bgGradient="linear(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
        color="white"
        py={24}
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="radial(circle at 50% 50%, whiteAlpha.100 0%, transparent 70%)"
          opacity={0.5}
        />
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <MotionVStack
            spacing={10}
            textAlign="center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge
              colorScheme="whiteAlpha"
              px={3}
              py={1}
              borderRadius="5px"
              fontSize="0.75rem"
              fontWeight="500"
              letterSpacing="0.05em"
              backdropFilter="blur(10px)"
              bg="whiteAlpha.200"
            >
              Join Thousands of Happy Users
            </Badge>
            <Heading
              fontSize={{ base: '1.75rem', md: '2rem' }}
              textShadow="0 2px 10px rgba(0,0,0,0.2)"
              fontWeight="500"
              lineHeight="1.3"
              letterSpacing="-0.02em"
            >
              Ready to Transform Your
              <br />
              Office Management?
            </Heading>
            <Text fontSize="0.9375rem" maxW="2xl" opacity={0.95} fontWeight="400" lineHeight="1.6">
              Join organizations that are already using our platform to manage their 
              hybrid work model efficiently. Start your free trial today!
            </Text>
            <HStack spacing={3} justify="center" flexWrap="wrap" mt={2}>
              <Button
                size="md"
                bg="white"
                color="purple.600"
                rightIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/login')}
                _hover={{
                  bg: 'whiteAlpha.900',
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
                fontWeight="500"
                px={6}
                py={5}
                fontSize="0.875rem"
                borderRadius="5px"
              >
                Get Started
              </Button>
              <Button
                size="md"
                variant="outline"
                borderWidth="1px"
                borderColor="white"
                color="white"
                _hover={{
                  bg: 'whiteAlpha.200',
                  borderColor: 'white',
                  transform: 'translateY(-2px)',
                }}
                onClick={() => navigate('/login')}
                px={6}
                py={5}
                fontSize="0.875rem"
                fontWeight="400"
                borderRadius="5px"
              >
                Learn More
              </Button>
            </HStack>
          </MotionVStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        bg="gray.900"
        color="white"
        py={16}
        borderTop="1px solid"
        borderColor="gray.800"
        position="relative"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="1px"
          bgGradient="linear(to-r, transparent, purple.500, transparent)"
        />
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', md: '2fr 1fr 1fr' }} gap={12}>
            <GridItem>
              <VStack align="start" spacing={4}>
                <Heading
                  fontSize="1.125rem"
                  bgGradient="linear(to-r, cyan.400, purple.400, pink.400)"
                  bgClip="text"
                  fontWeight="500"
                  letterSpacing="-0.01em"
                >
                  Office Seat Allocation
                </Heading>
                <Text color="gray.400" fontSize="0.8125rem" lineHeight="1.6" maxW="md" fontWeight="400">
                  Efficiently manage your office space and hybrid work schedules with our 
                  intelligent platform designed for modern teams.
                </Text>
                <HStack spacing={3} mt={1}>
                  <IconButton
                    aria-label="Twitter"
                    icon={<Text fontSize="0.875rem">🐦</Text>}
                    variant="ghost"
                    color="gray.400"
                    size="sm"
                    _hover={{ color: 'cyan.400', transform: 'scale(1.1)' }}
                    transition="all 0.2s"
                  />
                  <IconButton
                    aria-label="LinkedIn"
                    icon={<Text fontSize="0.875rem">💼</Text>}
                    variant="ghost"
                    color="gray.400"
                    size="sm"
                    _hover={{ color: 'cyan.400', transform: 'scale(1.1)' }}
                    transition="all 0.2s"
                  />
                  <IconButton
                    aria-label="GitHub"
                    icon={<Text fontSize="0.875rem">⚡</Text>}
                    variant="ghost"
                    color="gray.400"
                    size="sm"
                    _hover={{ color: 'cyan.400', transform: 'scale(1.1)' }}
                    transition="all 0.2s"
                  />
                </HStack>
              </VStack>
            </GridItem>
            <GridItem>
              <VStack align="start" spacing={3}>
                <Heading fontSize="0.875rem" color="white" fontWeight="500" letterSpacing="0.05em" textTransform="uppercase">
                  Product
                </Heading>
                <VStack align="start" spacing={1.5}>
                  <Text cursor="pointer" _hover={{ color: 'cyan.400' }} fontSize="0.8125rem" color="gray.400" fontWeight="400">
                    Features
                  </Text>
                  <Text cursor="pointer" _hover={{ color: 'cyan.400' }} fontSize="0.8125rem" color="gray.400" fontWeight="400">
                    Pricing
                  </Text>
                  <Text cursor="pointer" _hover={{ color: 'cyan.400' }} fontSize="0.8125rem" color="gray.400" fontWeight="400">
                    Integrations
                  </Text>
                  <Text cursor="pointer" _hover={{ color: 'cyan.400' }} fontSize="0.8125rem" color="gray.400" fontWeight="400">
                    Updates
                  </Text>
                </VStack>
              </VStack>
            </GridItem>
            <GridItem>
              <VStack align={{ base: 'start', md: 'end' }} spacing={3}>
                <Heading fontSize="0.875rem" color="white" fontWeight="500" letterSpacing="0.05em" textTransform="uppercase">
                  Company
                </Heading>
                <VStack align={{ base: 'start', md: 'end' }} spacing={1.5}>
                  <Text cursor="pointer" _hover={{ color: 'cyan.400' }} fontSize="0.8125rem" color="gray.400" fontWeight="400">
                    About Us
                  </Text>
                  <Text cursor="pointer" _hover={{ color: 'cyan.400' }} fontSize="0.8125rem" color="gray.400" fontWeight="400">
                    Privacy Policy
                  </Text>
                  <Text cursor="pointer" _hover={{ color: 'cyan.400' }} fontSize="0.8125rem" color="gray.400" fontWeight="400">
                    Terms of Service
                  </Text>
                  <Text cursor="pointer" _hover={{ color: 'cyan.400' }} fontSize="0.8125rem" color="gray.400" fontWeight="400">
                    Contact
                  </Text>
                </VStack>
              </VStack>
            </GridItem>
          </Grid>
          <Box mt={8} pt={6} borderTop="1px solid" borderColor="gray.800">
            <Flex justify="space-between" align="center" direction={{ base: 'column', md: 'row' }} gap={3}>
              <Text color="gray.500" fontSize="0.75rem" fontWeight="400">
                © 2024 Office Seat Allocation. All rights reserved.
              </Text>
              <HStack spacing={5}>
                <Text cursor="pointer" _hover={{ color: 'cyan.400' }} fontSize="0.75rem" color="gray.500" fontWeight="400">
                  Privacy
                </Text>
                <Text cursor="pointer" _hover={{ color: 'cyan.400' }} fontSize="0.75rem" color="gray.500" fontWeight="400">
                  Terms
                </Text>
                <Text cursor="pointer" _hover={{ color: 'cyan.400' }} fontSize="0.75rem" color="gray.500" fontWeight="400">
                  Cookies
                </Text>
              </HStack>
            </Flex>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
