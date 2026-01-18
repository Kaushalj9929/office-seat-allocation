import { useEffect } from 'react'
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
} from '@chakra-ui/react'
import { fetchEmployeeSchedule } from '../../../store/slices/scheduleSlice'

function ScheduleView() {
  const dispatch = useDispatch()
  const { employeeSchedule, isLoading, error } = useSelector((state) => state.schedules)

  useEffect(() => {
    dispatch(fetchEmployeeSchedule())
  }, [dispatch])

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={8}>
        <Spinner size="xl" />
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

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const getDayEntries = (dayOfWeek) => {
    return employeeSchedule?.entries?.filter(entry => entry.day_of_week === dayOfWeek) || []
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
      {employeeSchedule && (
        <Box>
          <Text 
            mb={4} 
            fontSize="0.75rem" 
            fontWeight="500"
            color="gray.700"
            letterSpacing="0.01em"
          >
            Week: {employeeSchedule.week_start_date} to {employeeSchedule.week_end_date}
          </Text>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }} gap={3}>
            {days.map((day, index) => {
              const entries = getDayEntries(index)
              const entry = entries[0]
              return (
                <GridItem key={day} h="100%">
                  <Card
                    h="100%"
                    borderRadius="5px"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{
                      boxShadow: 'md',
                      transform: 'translateY(-1px)',
                    }}
                    transition="all 0.2s"
                    display="flex"
                    flexDirection="column"
                  >
                    <CardBody p={4} display="flex" flexDirection="column" h="100%">
                      <Text 
                        fontWeight="500" 
                        mb={2}
                        fontSize="0.75rem"
                        color="gray.800"
                        letterSpacing="-0.01em"
                        fontFamily="Poppins"
                      >
                        {day}
                      </Text>
                      <VStack align="start" spacing={2} flex="1" justify="flex-start">
                        {entry ? (
                          <>
                            <Badge
                              bgGradient={
                                entry.work_type === 'office' 
                                  ? 'linear(to-r, purple.500, pink.500)' 
                                  : 'linear(to-r, gray.400, gray.500)'
                              }
                              color="white"
                              px={3}
                              py={1}
                              borderRadius="5px"
                              fontSize="0.6875rem"
                              fontWeight="500"
                              letterSpacing="0.05em"
                              textTransform="uppercase"
                            >
                              {entry.work_type}
                            </Badge>
                            <Text 
                              fontSize="0.6875rem" 
                              color="gray.600"
                              fontWeight="400"
                              minH="1.2em"
                            >
                              {entry.seat_id ? `Seat: ${entry.seat_id}` : '\u00A0'}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Badge
                              bg="gray.200"
                              color="gray.600"
                              px={3}
                              py={1}
                              borderRadius="5px"
                              fontSize="0.6875rem"
                              fontWeight="500"
                              letterSpacing="0.05em"
                              textTransform="uppercase"
                            >
                              No schedule
                            </Badge>
                            <Text 
                              fontSize="0.6875rem" 
                              color="gray.500"
                              fontWeight="400"
                              minH="1.2em"
                            >
                              {'\u00A0'}
                            </Text>
                          </>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              )
            })}
          </Grid>
        </Box>
      )}
    </Box>
  )
}

export default ScheduleView

