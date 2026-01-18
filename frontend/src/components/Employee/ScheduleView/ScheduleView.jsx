import { useEffect, useMemo, useState } from 'react'
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
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { format } from 'date-fns'
import { fetchEmployeeSchedule } from '../../../store/slices/scheduleSlice'
import '../../Admin/EmployeeManagement/Calendar.css'

function ScheduleView() {
  const dispatch = useDispatch()
  const { employeeSchedule, isLoading, error } = useSelector((state) => state.schedules)
  const { user } = useSelector((state) => state.auth)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    dispatch(fetchEmployeeSchedule())
  }, [dispatch])

  // Map schedule entries to actual dates for grid view
  const calendarData = useMemo(() => {
    if (!employeeSchedule?.week_start_date || !employeeSchedule?.entries) return []

    const weekStart = new Date(employeeSchedule.week_start_date)
    weekStart.setHours(0, 0, 0, 0) // Normalize to start of day
    const days = []
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      date.setHours(0, 0, 0, 0) // Normalize to start of day
      
      const entry = employeeSchedule.entries.find(e => e.day_of_week === i)
      
      days.push({
        date,
        dayName: dayNames[i],
        dayOfWeek: i,
        entry: entry || null,
        dateStr: format(date, 'yyyy-MM-dd'), // Use format instead of toISOString for consistency
        dayNumber: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }),
      })
    }
    
    return days
  }, [employeeSchedule])

  // Map schedule entries to dates for calendar view
  const scheduleByDate = useMemo(() => {
    if (!employeeSchedule?.week_start_date || !employeeSchedule?.entries) return {}

    try {
      // Parse week_start_date and normalize to start of day
      const weekStartStr = employeeSchedule.week_start_date
      const weekStart = new Date(weekStartStr)
      
      // Normalize to start of day to avoid timezone issues
      weekStart.setHours(0, 0, 0, 0)
      
      if (isNaN(weekStart.getTime())) {
        console.error('Invalid week_start_date:', weekStartStr)
        return {}
      }

      const dateMap = {}

      employeeSchedule.entries.forEach(entry => {
        try {
          // Create a new date from weekStart and add the day offset
          const date = new Date(weekStart)
          date.setDate(weekStart.getDate() + entry.day_of_week)
          date.setHours(0, 0, 0, 0) // Normalize to start of day
          
          const dateStr = format(date, 'yyyy-MM-dd')
          
          dateMap[dateStr] = {
            workType: entry.work_type,
            seatId: entry.seat_id,
          }
        } catch (err) {
          console.error('Error processing schedule entry:', err, entry)
        }
      })

      return dateMap
    } catch (err) {
      console.error('Error processing schedule:', err)
      return {}
    }
  }, [employeeSchedule])

  // Get schedule for selected date
  const selectedDateData = useMemo(() => {
    try {
      if (!selectedDate) return null
      
      // Normalize selectedDate to start of day for accurate comparison
      const normalizedDate = new Date(selectedDate)
      normalizedDate.setHours(0, 0, 0, 0)
      const dateStr = format(normalizedDate, 'yyyy-MM-dd')
      
      return scheduleByDate[dateStr] || null
    } catch (err) {
      console.error('Error getting selected date data:', err)
      return null
    }
  }, [selectedDate, scheduleByDate])

  // Custom tile className for calendar dates with schedules
  const tileClassName = ({ date, view }) => {
    try {
      if (view === 'month' && date) {
        // Normalize date to start of day for accurate comparison
        const normalizedDate = new Date(date)
        normalizedDate.setHours(0, 0, 0, 0)
        const dateStr = format(normalizedDate, 'yyyy-MM-dd')
        const dayData = scheduleByDate[dateStr]
        if (dayData) {
          return dayData.workType === 'office' ? 'has-office-schedule' : 'has-wfh-schedule'
        }
      }
    } catch (err) {
      console.error('Error rendering calendar tile:', err)
    }
    return null
  }

  // Custom tile content for calendar
  const tileContent = ({ date, view }) => {
    try {
      if (view === 'month' && date) {
        // Normalize date to start of day for accurate comparison
        const normalizedDate = new Date(date)
        normalizedDate.setHours(0, 0, 0, 0)
        const dateStr = format(normalizedDate, 'yyyy-MM-dd')
        const dayData = scheduleByDate[dateStr]
        if (dayData) {
          return (
            <Box mt={1}>
              <Box
                w="6px"
                h="6px"
                mx="auto"
                bgGradient={dayData.workType === 'office' ? 'linear(to-r, purple.500, pink.500)' : 'linear(to-r, gray.400, gray.500)'}
                borderRadius="full"
              />
            </Box>
          )
        }
      }
    } catch (err) {
      console.error('Error rendering calendar tile:', err)
    }
    return null
  }

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
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={4}>
          <Box>
            <Box
              bg="white"
              borderRadius="5px"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
              p={4}
            >
              {/* Week Header */}
              <HStack justify="space-between" mb={4} align="center" pb={3} borderBottom="1px solid" borderColor="gray.100">
                <Text 
                  fontSize="0.75rem" 
                  fontWeight="500"
                  color="gray.600"
                  letterSpacing="0.01em"
                >
                  {format(new Date(employeeSchedule.week_start_date), 'MMM d')} - {format(new Date(employeeSchedule.week_end_date), 'MMM d, yyyy')}
                </Text>
                <Badge
                  bg={employeeSchedule.status === 'published' ? 'green.100' : 'yellow.100'}
                  color={employeeSchedule.status === 'published' ? 'green.700' : 'yellow.700'}
                  px={2}
                  py={0.5}
                  borderRadius="5px"
                  fontSize="0.625rem"
                  fontWeight="500"
                  textTransform="uppercase"
                >
                  {employeeSchedule.status}
                </Badge>
              </HStack>
              
              {/* Simple Schedule List */}
              <VStack align="stretch" spacing={2}>
                {calendarData.map((day) => (
                  <Box
                    key={day.dateStr}
                    p={3}
                    borderRadius="5px"
                    border="1px solid"
                    borderColor={day.entry ? (day.entry.work_type === 'office' ? 'purple.200' : 'gray.200') : 'gray.200'}
                    bg={day.entry ? (day.entry.work_type === 'office' ? 'purple.50' : 'gray.50') : 'white'}
                    _hover={{
                      borderColor: day.entry ? (day.entry.work_type === 'office' ? 'purple.300' : 'gray.300') : 'gray.300',
                    }}
                    transition="all 0.2s"
                  >
                    <HStack justify="space-between" align="center">
                      <HStack spacing={3} flex="1">
                        <Text 
                          fontSize="0.75rem"
                          fontWeight="500"
                          color="gray.600"
                          minW="80px"
                        >
                          {day.dayName}
                        </Text>
                        <Text 
                          fontSize="0.875rem"
                          fontWeight="500"
                          color="gray.800"
                        >
                          {format(day.date, 'MMM d')}
                        </Text>
                      </HStack>
                      <HStack spacing={2} align="center">
                        {day.entry ? (
                          <>
                            <Badge
                              bgGradient={
                                day.entry.work_type === 'office' 
                                  ? 'linear(to-r, purple.500, pink.500)' 
                                  : 'linear(to-r, gray.400, gray.500)'
                              }
                              color="white"
                              px={2}
                              py={0.5}
                              borderRadius="5px"
                              fontSize="0.625rem"
                              fontWeight="500"
                              textTransform="uppercase"
                            >
                              {day.entry.work_type === 'office' ? 'Office' : 'WFH'}
                            </Badge>
                            {day.entry.seat_id && (
                              <Text 
                                fontSize="0.6875rem" 
                                color="gray.600"
                                fontWeight="400"
                                fontFamily="mono"
                              >
                                {day.entry.seat_id}
                              </Text>
                            )}
                          </>
                        ) : (
                          <Text 
                            fontSize="0.6875rem" 
                            color="gray.400"
                            fontWeight="400"
                          >
                            No schedule
                          </Text>
                        )}
                      </HStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          </Box>

          {/* Calendar Sidebar */}
          <Box>
            <Box
              bg="white"
              borderRadius="5px"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
              p={4}
              mb={4}
            >
              <Heading fontSize="1rem" mb={3} fontWeight="500" color="gray.800" letterSpacing="-0.01em">
                Schedule Calendar
              </Heading>
              <Box>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileContent={tileContent}
                  tileClassName={tileClassName}
                />
              </Box>
              <VStack align="stretch" mt={3} spacing={2}>
                <HStack spacing={2}>
                  <Box w="8px" h="8px" bgGradient="linear(to-r, purple.500, pink.500)" borderRadius="full" />
                  <Text fontSize="0.6875rem" color="gray.600" fontWeight="400">Office</Text>
                </HStack>
                <HStack spacing={2}>
                  <Box w="8px" h="8px" bg="gray.400" borderRadius="full" />
                  <Text fontSize="0.6875rem" color="gray.600" fontWeight="400">Work From Home</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Selected Date Details */}
            <Box
              bg="white"
              borderRadius="5px"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
              p={4}
            >
              <Heading fontSize="0.9375rem" mb={3} fontWeight="500" color="gray.800" letterSpacing="-0.01em">
                {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Select a date'}
              </Heading>
              {selectedDateData ? (
                <VStack align="stretch" spacing={3}>
                  <Badge
                    bgGradient={selectedDateData.workType === 'office' ? 'linear(to-r, purple.500, pink.500)' : 'linear(to-r, gray.400, gray.500)'}
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="5px"
                    fontSize="0.625rem"
                    fontWeight="500"
                    w="fit-content"
                  >
                    {selectedDateData.workType === 'office' ? 'Office' : 'Work From Home'}
                  </Badge>
                  {selectedDateData.seatId && (
                    <Box
                      w="100%"
                      p={2}
                      bg="gray.50"
                      borderRadius="5px"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <Text fontSize="0.625rem" color="gray.600" fontWeight="500" mb={1}>
                        Seat ID
                      </Text>
                      <Text fontSize="0.75rem" color="gray.800" fontWeight="600" fontFamily="mono">
                        {selectedDateData.seatId}
                      </Text>
                    </Box>
                  )}
                </VStack>
              ) : (
                <Text fontSize="0.6875rem" color="gray.500" fontWeight="400">
                  No schedule for this date
                </Text>
              )}
            </Box>
          </Box>
        </Grid>
      )}
    </Box>
  )
}

export default ScheduleView

