import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { fetchRequests } from '../../../store/slices/changeRequestSlice'

function ChangeRequestHistory() {
  const dispatch = useDispatch()
  const { requests, isLoading, error } = useSelector((state) => state.changeRequests)

  useEffect(() => {
    dispatch(fetchRequests())
  }, [dispatch])

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'green'
      case 'rejected':
        return 'red'
      case 'pending':
        return 'yellow'
      case 'cancelled':
        return 'gray'
      default:
        return 'gray'
    }
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

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
        Change Requests
      </Heading>
      <Box 
        bg="white" 
        borderRadius="5px" 
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
        overflow="hidden"
      >
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th fontSize="0.625rem" fontWeight="500">Current Day</Th>
              <Th fontSize="0.625rem" fontWeight="500">Requested Day</Th>
              <Th fontSize="0.625rem" fontWeight="500">Reason</Th>
              <Th fontSize="0.625rem" fontWeight="500">Status</Th>
              <Th fontSize="0.625rem" fontWeight="500">Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {requests.map((request) => (
              <Tr key={request.id} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                <Td fontWeight="500" color="gray.800" fontSize="0.875rem">{days[request.current_day]}</Td>
                <Td fontWeight="500" color="gray.800" fontSize="0.875rem">{days[request.requested_day]}</Td>
                <Td color="gray.600" fontSize="0.875rem" fontWeight="400">{request.reason || '-'}</Td>
                <Td>
                  <Badge
                    bg={
                      request.status === 'approved' ? 'green.100' :
                      request.status === 'rejected' ? 'red.100' :
                      request.status === 'pending' ? 'yellow.100' :
                      'gray.100'
                    }
                    color={
                      request.status === 'approved' ? 'green.700' :
                      request.status === 'rejected' ? 'red.700' :
                      request.status === 'pending' ? 'yellow.700' :
                      'gray.700'
                    }
                    px={3}
                    py={1}
                    borderRadius="5px"
                    fontSize="0.6875rem"
                    fontWeight="500"
                    letterSpacing="0.05em"
                    textTransform="uppercase"
                  >
                    {request.status}
                  </Badge>
                </Td>
                <Td color="gray.600" fontSize="0.875rem" fontWeight="400">{new Date(request.requested_date).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}

export default ChangeRequestHistory

