import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Spinner, Box } from '@chakra-ui/react'

function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoading } = useSelector((state) => state.auth)

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check role if required
  if (requiredRole) {
    const userRole = user.role
    if (requiredRole === 'admin' && userRole !== 'admin') {
      return <Navigate to="/login" replace />
    }
    if (requiredRole === 'manager' && userRole !== 'manager' && userRole !== 'team_lead') {
      return <Navigate to="/login" replace />
    }
    if (requiredRole === 'employee') {
      // Allow all authenticated users to access employee routes
      // Admins and managers can also access employee routes
    }
  }

  return children
}

export default ProtectedRoute

