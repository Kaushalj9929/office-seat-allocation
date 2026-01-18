import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Heading,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Badge,
  HStack,
} from '@chakra-ui/react'
import { generateSchedule } from '../../../store/slices/scheduleSlice'

function ScheduleGenerator() {
  const dispatch = useDispatch()
  const toast = useToast()
  const { currentSchedule, isLoading, error } = useSelector((state) => state.schedules)
  const [weekStart, setWeekStart] = useState('')
  const [weekEnd, setWeekEnd] = useState('')

  // Map schedule entries to actual dates for calendar view
  const calendarData = useMemo(() => {
    if (!currentSchedule?.week_start_date || !currentSchedule?.entries) return []

    const weekStart = new Date(currentSchedule.week_start_date)
    const days = []
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    
    // Group entries by day_of_week
    const entriesByDay = {}
    currentSchedule.entries.forEach(entry => {
      if (!entriesByDay[entry.day_of_week]) {
        entriesByDay[entry.day_of_week] = []
      }
      entriesByDay[entry.day_of_week].push(entry)
    })
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      
      const entries = entriesByDay[i] || []
      
      days.push({
        date,
        dayName: dayNames[i],
        dayOfWeek: i,
        entries,
        dateStr: date.toISOString().split('T')[0],
        dayNumber: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }),
      })
    }
    
    return days
  }, [currentSchedule])

  const handleGenerate = async () => {
    if (!weekStart || !weekEnd) {
      toast({
        title: 'Error',
        description: 'Please select both start and end dates',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      await dispatch(generateSchedule({ weekStartDate: weekStart, weekEndDate: weekEnd }))
      toast({
        title: 'Schedule generated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to generate schedule',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
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
        Schedule Generation
      </Heading>
      <Box
        bg="white"
        borderRadius="5px"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
        p={4}
        maxW="2xl"
      >
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel 
              fontWeight="500" 
              fontSize="0.75rem"
              color="gray.700"
              letterSpacing="0.01em"
              mb={1.5}
            >
              Week Start Date
            </FormLabel>
            <Input
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
              size="sm"
              borderRadius="5px"
              borderColor="gray.300"
              fontSize="0.75rem"
              py={4}
              _focus={{
                borderColor: 'purple.500',
                boxShadow: '0 0 0 1px purple.500',
              }}
              fontFamily="Inter"
            />
          </FormControl>
          <FormControl>
            <FormLabel 
              fontWeight="500" 
              fontSize="0.75rem"
              color="gray.700"
              letterSpacing="0.01em"
              mb={1.5}
            >
              Week End Date
            </FormLabel>
            <Input
              type="date"
              value={weekEnd}
              onChange={(e) => setWeekEnd(e.target.value)}
              size="sm"
              borderRadius="5px"
              borderColor="gray.300"
              fontSize="0.75rem"
              py={4}
              _focus={{
                borderColor: 'purple.500',
                boxShadow: '0 0 0 1px purple.500',
              }}
              fontFamily="Inter"
            />
          </FormControl>
          <Button
            bgGradient="linear(to-r, purple.500, pink.500)"
            color="white"
            onClick={handleGenerate}
            isLoading={isLoading}
            loadingText="Generating..."
            size="sm"
            _hover={{
              bgGradient: 'linear(to-r, purple.600, pink.600)',
              transform: 'translateY(-1px)',
              boxShadow: 'md',
            }}
            transition="all 0.2s"
            fontWeight="500"
            letterSpacing="0.01em"
            borderRadius="5px"
            fontSize="0.75rem"
            py={4}
          >
            Generate Schedule
          </Button>
          {error && (
            <Alert status="error" borderRadius="5px" fontSize="0.75rem" py={2}>
              <AlertIcon />
              {error}
            </Alert>
          )}
          {currentSchedule && (
            <Box>
              <Box 
                p={4} 
                bgGradient="linear(to-r, green.50, cyan.50)" 
                borderRadius="5px"
                border="1px solid"
                borderColor="green.200"
                mb={4}
              >
                <HStack justify="space-between" mb={3}>
                  <Heading fontSize="1rem" fontWeight="500" color="gray.800" letterSpacing="-0.01em">
                    Schedule Generated Successfully
                  </Heading>
                  <Badge
                    bg={currentSchedule.status === 'published' ? 'green.100' : 'yellow.100'}
                    color={currentSchedule.status === 'published' ? 'green.700' : 'yellow.700'}
                    px={3}
                    py={1}
                    borderRadius="5px"
                    fontSize="0.625rem"
                    fontWeight="500"
                    textTransform="uppercase"
                  >
                    {currentSchedule.status}
                  </Badge>
                </HStack>
                <VStack align="start" spacing={1.5} fontSize="0.75rem" color="gray.700" fontWeight="400">
                  <Text><strong style={{ fontWeight: 500 }}>Week:</strong> {currentSchedule.week_start_date} to {currentSchedule.week_end_date}</Text>
                  <Text><strong style={{ fontWeight: 500 }}>Total Entries:</strong> {currentSchedule.entries?.length || 0}</Text>
                </VStack>
              </Box>

              {/* Calendar View */}
              {calendarData.length > 0 && (
                <Box
                  bg="white"
                  borderRadius="5px"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.200"
                  p={4}
                >
                  <Heading fontSize="0.9375rem" mb={4} fontWeight="500" color="gray.800" letterSpacing="-0.01em">
                    Schedule Calendar
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 5 }} spacing={3}>
                    {calendarData.map((day) => (
                      <Card
                        key={day.dateStr}
                        h="100%"
                        borderRadius="5px"
                        boxShadow="sm"
                        border="1px solid"
                        borderColor="gray.200"
                        _hover={{
                          boxShadow: 'md',
                          transform: 'translateY(-2px)',
                        }}
                        transition="all 0.2s"
                        display="flex"
                        flexDirection="column"
                      >
                        <CardBody p={3} display="flex" flexDirection="column" h="100%">
                          {/* Date Header */}
                          <VStack align="start" spacing={1} mb={2}>
                            <Text 
                              fontWeight="600" 
                              fontSize="0.6875rem"
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
                                fontSize="1.25rem"
                                color="gray.800"
                                letterSpacing="-0.02em"
                                fontFamily="Poppins"
                              >
                                {day.dayNumber}
                              </Text>
                              <Text 
                                fontWeight="400" 
                                fontSize="0.625rem"
                                color="gray.600"
                                letterSpacing="0.01em"
                              >
                                {day.month}
                              </Text>
                            </HStack>
                          </VStack>
                          
                          {/* Schedule Entries */}
                          <VStack align="start" spacing={1.5} flex="1" justify="flex-start" w="100%">
                            {day.entries.length > 0 ? (
                              <>
                                <Text fontSize="0.625rem" color="gray.600" fontWeight="500" mb={1}>
                                  {day.entries.length} {day.entries.length === 1 ? 'Entry' : 'Entries'}
                                </Text>
                                {day.entries.slice(0, 3).map((entry, idx) => (
                                  <Badge
                                    key={idx}
                                    bgGradient={
                                      entry.work_type === 'office' 
                                        ? 'linear(to-r, purple.500, pink.500)' 
                                        : 'linear(to-r, gray.400, gray.500)'
                                    }
                                    color="white"
                                    px={2}
                                    py={1}
                                    borderRadius="5px"
                                    fontSize="0.625rem"
                                    fontWeight="500"
                                    letterSpacing="0.05em"
                                    textTransform="uppercase"
                                    w="100%"
                                    textAlign="center"
                                  >
                                    {entry.work_type}
                                  </Badge>
                                ))}
                                {day.entries.length > 3 && (
                                  <Text fontSize="0.625rem" color="gray.500" fontWeight="400">
                                    +{day.entries.length - 3} more
                                  </Text>
                                )}
                              </>
                            ) : (
                              <Badge
                                bg="gray.200"
                                color="gray.600"
                                px={2}
                                py={1}
                                borderRadius="5px"
                                fontSize="0.625rem"
                                fontWeight="500"
                                letterSpacing="0.05em"
                                textTransform="uppercase"
                                w="100%"
                                textAlign="center"
                              >
                                No Entries
                              </Badge>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  )
}

export default ScheduleGenerator

