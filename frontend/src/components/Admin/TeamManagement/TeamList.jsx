import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
} from '@chakra-ui/react'
import { fetchTeams } from '../../../store/slices/teamSlice'

function TeamList() {
  const dispatch = useDispatch()
  const { teams, isLoading, error } = useSelector((state) => state.teams)

  useEffect(() => {
    dispatch(fetchTeams())
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

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading 
          fontSize="1.25rem"
          fontWeight="500"
          letterSpacing="-0.02em"
          bgGradient="linear(to-r, purple.600, pink.600)"
          bgClip="text"
        >
          Teams
        </Heading>
        <Button 
          bgGradient="linear(to-r, purple.500, pink.500)"
          color="white"
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
          size="sm"
          py={3}
        >
          Add Team
        </Button>
      </Flex>
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
              <Th fontSize="0.625rem" fontWeight="500">Name</Th>
              <Th fontSize="0.625rem" fontWeight="500">Description</Th>
              <Th textAlign="right" fontSize="0.625rem" fontWeight="500">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {teams.map((team) => (
              <Tr key={team.id} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                <Td fontWeight="500" color="gray.800" fontSize="0.875rem">{team.name}</Td>
                <Td color="gray.600" fontSize="0.875rem" fontWeight="400">{team.description || 'No description'}</Td>
                <Td textAlign="right">
                  <Button 
                    size="sm" 
                    bgGradient="linear(to-r, purple.500, pink.500)"
                    color="white"
                    _hover={{
                      bgGradient: 'linear(to-r, purple.600, pink.600)',
                      transform: 'translateY(-1px)',
                    }}
                    transition="all 0.2s"
                    fontWeight="500"
                    fontSize="0.8125rem"
                    borderRadius="5px"
                  >
                    Edit
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}

export default TeamList

