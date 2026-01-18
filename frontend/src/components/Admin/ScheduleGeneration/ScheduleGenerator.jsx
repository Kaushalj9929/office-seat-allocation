import { useState } from 'react'
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
} from '@chakra-ui/react'
import { generateSchedule } from '../../../store/slices/scheduleSlice'

function ScheduleGenerator() {
  const dispatch = useDispatch()
  const toast = useToast()
  const { currentSchedule, isLoading, error } = useSelector((state) => state.schedules)
  const [weekStart, setWeekStart] = useState('')
  const [weekEnd, setWeekEnd] = useState('')

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
            <Box 
              p={5} 
              bgGradient="linear(to-r, green.50, cyan.50)" 
              borderRadius="5px"
              border="1px solid"
              borderColor="green.200"
            >
              <Heading fontSize="1.125rem" mb={3} fontWeight="500" color="gray.800" letterSpacing="-0.01em">
                Schedule Generated Successfully
              </Heading>
              <VStack align="start" spacing={2} fontSize="0.875rem" color="gray.700" fontWeight="400">
                <Text><strong style={{ fontWeight: 500 }}>Status:</strong> <Box as="span" color="green.600" fontWeight="500">{currentSchedule.status}</Box></Text>
                <Text><strong style={{ fontWeight: 500 }}>Week:</strong> {currentSchedule.week_start_date} to {currentSchedule.week_end_date}</Text>
                <Text><strong style={{ fontWeight: 500 }}>Entries:</strong> {currentSchedule.entries?.length || 0}</Text>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  )
}

export default ScheduleGenerator

