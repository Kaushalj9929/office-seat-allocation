import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Heading,
  Grid,
  GridItem,
  Card,
  CardBody,
  Text,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react'
import { fetchEmployeeSchedule } from '../../../store/slices/scheduleSlice'

function ScheduleView() {
  const dispatch = useDispatch()
  const { employeeSchedule, isLoading, error } = useSelector((state) => state.schedules)

  useEffect(() => {
    dispatch(fetchEmployeeSchedule())
  }, [dispatch])

  // Map schedule entries to actual dates
  const calendarData = useMemo(() => {
    if (!employeeSchedule?.week_start_date || !employeeSchedule?.entries) return []

    const weekStart = new Date(employeeSchedule.week_start_date)
    const days = []
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      
      const entry = employeeSchedule.entries.find(e => e.day_of_week === i)
      
      days.push({
        date,
        dayName: dayNames[i],
        dayOfWeek: i,
        entry: entry || null,
        dateStr: date.toISOString().split('T')[0],
        dayNumber: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }),
      })
    }
    
    return days
  }, [employeeSchedule])

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" color="purple.500" />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      <Heading 
        fontSize="1.25rem"
        mb={4}
        fontWeight="500"
        letterSpacing="-0.02em"
        bgGradient="linear(to-r, purple.600, pink.600)"
        bgClip="text"
      >
        My Schedule
      </Heading>
      {employeeSchedule && calendarData.length > 0 && (
        <Box>
          <HStack justify="space-between" mb={4} align="center">
            <Text 
              fontSize="0.75rem" 
              fontWeight="500"
              color="gray.700"
              letterSpacing="0.01em"
            >
              Week: {employeeSchedule.week_start_date} to {employeeSchedule.week_end_date}
            </Text>
            <Badge
              bg={employeeSchedule.status === 'published' ? 'green.100' : 'yellow.100'}
              color={employeeSchedule.status === 'published' ? 'green.700' : 'yellow.700'}
              px={3}
              py={1}
              borderRadius="5px"
              fontSize="0.625rem"
              fontWeight="500"
              textTransform="uppercase"
            >
              {employeeSchedule.status}
            </Badge>
          </HStack>
          
          {/* Calendar View */}
          <Box
            bg="white"
            borderRadius="5px"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
            p={4}
            mb={4}
          >
            <SimpleGrid columns={{ base: 1, md: 5 }} spacing={3}>
              {calendarData.map((day) => (
                <Card
                  key={day.dateStr}
                  h="100%"
                  borderRadius="5px"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor={day.entry ? (day.entry.work_type === 'office' ? 'purple.200' : 'gray.200') : 'gray.200'}
                  _hover={{
                    boxShadow: 'md',
                    transform: 'translateY(-2px)',
                  }}
                  transition="all 0.2s"
                  display="flex"
                  flexDirection="column"
                  bg={day.entry ? (day.entry.work_type === 'office' ? 'purple.50' : 'gray.50') : 'white'}
                >
                  <CardBody p={4} display="flex" flexDirection="column" h="100%">
                    {/* Date Header */}
                    <VStack align="start" spacing={1} mb={3}>
                      <Text 
                        fontWeight="600" 
                        fontSize="0.75rem"
                        color="gray.600"
                        letterSpacing="0.05em"
                        textTransform="uppercase"
                        fontFamily="Poppins"
                      >
                        {day.dayName}
                      </Text>
                      <HStack spacing={1} align="baseline">
                        <Text 
                          fontWeight="700" 
                          fontSize="1.5rem"
                          color="gray.800"
                          letterSpacing="-0.02em"
                          fontFamily="Poppins"
                        >
                          {day.dayNumber}
                        </Text>
                        <Text 
                          fontWeight="400" 
                          fontSize="0.6875rem"
                          color="gray.600"
                          letterSpacing="0.01em"
                        >
                          {day.month}
                        </Text>
                      </HStack>
                    </VStack>
                    
                    {/* Schedule Info */}
                    <VStack align="start" spacing={2} flex="1" justify="flex-start">
                      {day.entry ? (
                        <>
                          <Badge
                            bgGradient={
                              day.entry.work_type === 'office' 
                                ? 'linear(to-r, purple.500, pink.500)' 
                                : 'linear(to-r, gray.400, gray.500)'
                            }
                            color="white"
                            px={3}
                            py={1.5}
                            borderRadius="5px"
                            fontSize="0.6875rem"
                            fontWeight="600"
                            letterSpacing="0.05em"
                            textTransform="uppercase"
                            w="100%"
                            textAlign="center"
                          >
                            {day.entry.work_type === 'office' ? '🏢 Office' : '🏠 WFH'}
                          </Badge>
                          {day.entry.seat_id && (
                            <Box
                              w="100%"
                              p={2}
                              bg="white"
                              borderRadius="5px"
                              border="1px solid"
                              borderColor="gray.200"
                            >
                              <Text 
                                fontSize="0.625rem" 
                                color="gray.600"
                                fontWeight="500"
                                textAlign="center"
                              >
                                Seat
                              </Text>
                              <Text 
                                fontSize="0.75rem" 
                                color="gray.800"
                                fontWeight="600"
                                textAlign="center"
                                fontFamily="mono"
                              >
                                {day.entry.seat_id}
                              </Text>
                            </Box>
                          )}
                        </>
                      ) : (
                        <>
                          <Badge
                            bg="gray.200"
                            color="gray.600"
                            px={3}
                            py={1.5}
                            borderRadius="5px"
                            fontSize="0.6875rem"
                            fontWeight="500"
                            letterSpacing="0.05em"
                            textTransform="uppercase"
                            w="100%"
                            textAlign="center"
                          >
                            No Schedule
                          </Badge>
                          <Box
                            w="100%"
                            p={2}
                            bg="transparent"
                            borderRadius="5px"
                          >
                            <Text 
                              fontSize="0.625rem" 
                              color="gray.400"
                              fontWeight="400"
                              textAlign="center"
                              minH="2.5em"
                            >
                              {'\u00A0'}
                            </Text>
                          </Box>
                        </>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ScheduleView

