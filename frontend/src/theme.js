import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    heading: `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  colors: {
    brand: {
      50: '#f0f4ff',
      100: '#e0e9ff',
      200: '#c7d7fe',
      300: '#a4b8fc',
      400: '#8193f8',
      500: '#667eea',
      600: '#764ba2',
      700: '#5a3d7a',
      800: '#3d2852',
      900: '#1f1429',
    },
  },
  components: {
    Table: {
      variants: {
        simple: {
          th: {
            fontFamily: `'Poppins', sans-serif`,
            fontWeight: 500,
            fontSize: '0.625rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'gray.700',
            borderBottom: '2px solid',
            borderColor: 'gray.200',
            py: 2,
            px: 3,
          },
          td: {
            fontFamily: `'Inter', sans-serif`,
            fontWeight: 400,
            fontSize: '0.6875rem',
            color: 'gray.800',
            py: 2,
            px: 3,
            borderBottom: '1px solid',
            borderColor: 'gray.100',
          },
          tr: {
            _hover: {
              bg: 'gray.50',
            },
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: `'Poppins', sans-serif`,
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
    },
    Button: {
      baseStyle: {
        fontFamily: `'Inter', sans-serif`,
        fontWeight: 500,
        letterSpacing: '0.01em',
      },
    },
    Badge: {
      baseStyle: {
        fontFamily: `'Inter', sans-serif`,
        fontWeight: 500,
        letterSpacing: '0.025em',
      },
    },
  },
  styles: {
    global: {
      body: {
        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
        color: 'gray.800',
        letterSpacing: '-0.011em',
        lineHeight: 1.6,
      },
      h1: {
        fontFamily: `'Poppins', sans-serif`,
        fontWeight: 600,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      },
      h2: {
        fontFamily: `'Poppins', sans-serif`,
        fontWeight: 600,
        letterSpacing: '-0.02em',
        lineHeight: 1.3,
      },
      h3: {
        fontFamily: `'Poppins', sans-serif`,
        fontWeight: 600,
        letterSpacing: '-0.015em',
        lineHeight: 1.4,
      },
      h4: {
        fontFamily: `'Poppins', sans-serif`,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
    },
  },
})

export default theme

