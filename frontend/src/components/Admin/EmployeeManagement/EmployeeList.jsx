import { useEffect, useState, useMemo } from 'react'
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  VStack,
  HStack,
  Text,
  Badge,
} from '@chakra-ui/react'
import { fetchEmployees, deleteEmployee, createEmployee, updateEmployee, setSelectedEmployee } from '../../../store/slices/employeeSlice'

function EmployeeList() {
  const dispatch = useDispatch()
  const toast = useToast()
  const { employees, isLoading, error, pagination, selectedEmployee } = useSelector((state) => state.employees)
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    status: 'active',
    password: '',
  })

  useEffect(() => {
    dispatch(fetchEmployees({ page: 1, limit: 20 }))
  }, [dispatch])

  const handleAddEmployee = () => {
    setFormData({ name: '', email: '', role: 'employee', status: 'active', password: '' })
    onAddOpen()
  }

  const handleEditEmployee = (employee) => {
    dispatch(setSelectedEmployee(employee))
    setFormData({
      name: employee.name || '',
      email: employee.email || '',
      role: employee.role || 'employee',
      status: employee.status || 'active',
      password: '',
    })
    onEditOpen()
  }

  const handleSubmitAdd = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: 'Error',
        description: 'Please fill in name and email',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      await dispatch(createEmployee({
        ...formData,
        password: formData.password || 'password123',
      }))
      toast({
        title: 'Employee added',
        description: `${formData.name} has been added successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onAddClose()
      dispatch(fetchEmployees({ page: 1, limit: 20 }))
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add employee',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleSubmitEdit = async () => {
    if (!selectedEmployee) return

    if (!formData.name || !formData.email) {
      toast({
        title: 'Error',
        description: 'Please fill in name and email',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      const updateData = { ...formData }
      if (!updateData.password) {
        delete updateData.password
      }
      await dispatch(updateEmployee({ id: selectedEmployee.id, data: updateData }))
      toast({
        title: 'Employee updated',
        description: `${formData.name} has been updated successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onEditClose()
      dispatch(fetchEmployees({ page: 1, limit: 20 }))
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update employee',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

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
        dispatch(fetchEmployees({ page: 1, limit: 20 }))
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
          type="button"
          bgGradient="linear(to-r, purple.500, pink.500)"
          color="white"
          onClick={handleAddEmployee}
          _hover={{
            bgGradient: 'linear(to-r, purple.600, pink.600)',
            transform: 'translateY(-1px)',
            boxShadow: 'md',
          }}
          transition="all 0.2s"
          fontWeight="500"
          letterSpacing="0.01em"
          borderRadius="5px"
          fontSize="0.6875rem"
          size="xs"
          py={2}
          px={3}
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
                      'purple.50'
                    }
                    color={
                      employee.role === 'admin' ? 'purple.700' :
                      employee.role === 'team_lead' || employee.role === 'manager' ? 'pink.700' :
                      'purple.600'
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
                    size="xs" 
                    mr={1.5} 
                    bgGradient="linear(to-r, purple.500, pink.500)"
                    color="white"
                    onClick={() => handleEditEmployee(employee)}
                    _hover={{
                      bgGradient: 'linear(to-r, purple.600, pink.600)',
                      transform: 'translateY(-1px)',
                    }}
                    transition="all 0.2s"
                    fontWeight="500"
                    fontSize="0.625rem"
                    borderRadius="5px"
                    py={2}
                    px={2.5}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    bg="red.500"
                    color="white"
                    _hover={{
                      bg: 'red.600',
                      transform: 'translateY(-1px)',
                    }}
                    transition="all 0.2s"
                    fontWeight="500"
                    fontSize="0.625rem"
                    borderRadius="5px"
                    py={2}
                    px={2.5}
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

      {/* Add Employee Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="md">
        <ModalOverlay />
        <ModalContent borderRadius="5px">
          <ModalHeader fontSize="1rem" fontWeight="500">Add New Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <FormControl mb={3} isRequired>
                <FormLabel fontSize="0.75rem" fontWeight="500" color="gray.700">Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  fontSize="0.75rem"
                  borderRadius="5px"
                  size="sm"
                  py={4}
                />
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel fontSize="0.75rem" fontWeight="500" color="gray.700">Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fontSize="0.75rem"
                  borderRadius="5px"
                  size="sm"
                  py={4}
                />
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel fontSize="0.75rem" fontWeight="500" color="gray.700">Password</FormLabel>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave empty for default password"
                  fontSize="0.75rem"
                  borderRadius="5px"
                  size="sm"
                  py={4}
                />
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel fontSize="0.75rem" fontWeight="500" color="gray.700">Role</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  fontSize="0.75rem"
                  borderRadius="5px"
                  size="sm"
                >
                  <option value="employee">Employee</option>
                  <option value="team_lead">Team Lead</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="0.75rem" fontWeight="500" color="gray.700">Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  fontSize="0.75rem"
                  borderRadius="5px"
                  size="sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onAddClose}
              fontSize="0.75rem"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              bgGradient="linear(to-r, purple.500, pink.500)"
              color="white"
              onClick={handleSubmitAdd}
              _hover={{
                bgGradient: 'linear(to-r, purple.600, pink.600)',
              }}
              fontSize="0.75rem"
              size="sm"
              borderRadius="5px"
            >
              Add Employee
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="md">
        <ModalOverlay />
        <ModalContent borderRadius="5px">
          <ModalHeader fontSize="1rem" fontWeight="500">Edit Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <FormControl mb={3} isRequired>
                <FormLabel fontSize="0.75rem" fontWeight="500" color="gray.700">Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  fontSize="0.75rem"
                  borderRadius="5px"
                  size="sm"
                  py={4}
                />
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel fontSize="0.75rem" fontWeight="500" color="gray.700">Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fontSize="0.75rem"
                  borderRadius="5px"
                  size="sm"
                  py={4}
                />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel fontSize="0.75rem" fontWeight="500" color="gray.700">New Password</FormLabel>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave empty to keep current password"
                  fontSize="0.75rem"
                  borderRadius="5px"
                  size="sm"
                  py={4}
                />
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel fontSize="0.75rem" fontWeight="500" color="gray.700">Role</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  fontSize="0.75rem"
                  borderRadius="5px"
                  size="sm"
                >
                  <option value="employee">Employee</option>
                  <option value="team_lead">Team Lead</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="0.75rem" fontWeight="500" color="gray.700">Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  fontSize="0.75rem"
                  borderRadius="5px"
                  size="sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onEditClose}
              fontSize="0.75rem"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              bgGradient="linear(to-r, purple.500, pink.500)"
              color="white"
              onClick={handleSubmitEdit}
              _hover={{
                bgGradient: 'linear(to-r, purple.600, pink.600)',
              }}
              fontSize="0.75rem"
              size="sm"
              borderRadius="5px"
            >
              Update Employee
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default EmployeeList

