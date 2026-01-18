import { Box, Heading, Text } from '@chakra-ui/react'

function TeamSchedule() {
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
        Team Schedule
      </Heading>
      <Box
        bg="white"
        borderRadius="5px"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
        p={4}
      >
        <Text 
          fontSize="0.75rem" 
          color="gray.600"
          fontWeight="400"
          letterSpacing="0.01em"
        >
          Team schedule view will be implemented here.
        </Text>
      </Box>
    </Box>
  )
}

export default TeamSchedule

