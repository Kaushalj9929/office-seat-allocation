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
  useToast,
  Flex,
} from '@chakra-ui/react'
import { fetchEmployees, deleteEmployee } from '../../../store/slices/employeeSlice'

function EmployeeList() {
  const dispatch = useDispatch()
  const toast = useToast()
  const { employees, isLoading, error, pagination } = useSelector((state) => state.employees)

  useEffect(() => {
    dispatch(fetchEmployees({ page: 1, limit: 20 }))
  }, [dispatch])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await dispatch(deleteEmployee(id))
        toast({
          title: 'Employee deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to delete employee',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

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
          Employees
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
          Add Employee
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
              <Th fontSize="0.625rem" fontWeight="500">Email</Th>
              <Th fontSize="0.625rem" fontWeight="500">Role</Th>
              <Th fontSize="0.625rem" fontWeight="500">Status</Th>
              <Th textAlign="right" fontSize="0.625rem" fontWeight="500">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employees.map((employee) => (
              <Tr key={employee.id} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                <Td fontWeight="500" color="gray.800" fontSize="0.875rem">{employee.name}</Td>
                <Td color="gray.600" fontSize="0.875rem" fontWeight="400">{employee.email}</Td>
                <Td>
                  <Box
                    as="span"
                    px={3}
                    py={1}
                    borderRadius="5px"
                    fontSize="0.6875rem"
                    fontWeight="500"
                    letterSpacing="0.05em"
                    textTransform="uppercase"
                    bg={
                      employee.role === 'admin' ? 'purple.100' :
                      employee.role === 'team_lead' || employee.role === 'manager' ? 'pink.100' :
                      'cyan.100'
                    }
                    color={
                      employee.role === 'admin' ? 'purple.700' :
                      employee.role === 'team_lead' || employee.role === 'manager' ? 'pink.700' :
                      'cyan.700'
                    }
                  >
                    {employee.role}
                  </Box>
                </Td>
                <Td>
                  <Box
                    as="span"
                    px={3}
                    py={1}
                    borderRadius="5px"
                    fontSize="0.6875rem"
                    fontWeight="500"
                    letterSpacing="0.05em"
                    textTransform="uppercase"
                    bg={employee.status === 'active' ? 'green.100' : 'gray.100'}
                    color={employee.status === 'active' ? 'green.700' : 'gray.700'}
                  >
                    {employee.status}
                  </Box>
                </Td>
                <Td textAlign="right">
                  <Button 
                    size="sm" 
                    mr={2} 
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
                  <Button
                    size="sm"
                    bg="red.500"
                    color="white"
                    _hover={{
                      bg: 'red.600',
                      transform: 'translateY(-1px)',
                    }}
                    transition="all 0.2s"
                    fontWeight="500"
                    fontSize="0.8125rem"
                    borderRadius="5px"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Delete
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

export default EmployeeList

