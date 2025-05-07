import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ReadmeGenerator from './components/ReadmeGenerator';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2563eb', // brand blue
      light: '#60a5fa',
      dark: '#1e40af',
    },
    background: {
      default: '#181c24',
      paper: 'rgba(30, 36, 54, 0.97)',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#93a3b5',
    },
    divider: 'rgba(96,165,250,0.10)',
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    h2: {
      fontWeight: 800,
      fontSize: '2.5rem',
      letterSpacing: '-0.03em',
      color: '#e0e0e0',
      lineHeight: 1.1,
    },
    h5: {
      fontWeight: 400,
      fontSize: '1.15rem',
      color: '#93a3b5',
      letterSpacing: '-0.01em',
    },
    body1: {
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          background: '#2563eb',
          color: '#fff',
          boxShadow: 'none',
          '&:hover': {
            background: '#1e40af',
            boxShadow: '0 2px 8px #2563eb20',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(30, 36, 54, 0.99)',
            color: '#e0e0e0',
            border: '1px solid #232946',
            '&:hover': {
              backgroundColor: 'rgba(30, 36, 54, 1)',
              borderColor: '#2563eb',
            },
            '&.Mui-focused': {
              borderColor: '#2563eb',
            },
            '& input::placeholder': {
              color: '#93a3b5',
              opacity: 1,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#93a3b5',
            fontWeight: 400,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #232946 0%, #181c24 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, py: { xs: 2, sm: 5 } }}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 5 },
              borderRadius: 4,
              backgroundColor: 'rgba(30, 36, 54, 0.97)',
              boxShadow: '0 2px 16px #23294620',
              border: '1px solid #232946',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Box sx={{ mb: 5, textAlign: 'center' }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  mb: 0.5,
                  fontFamily: 'inherit',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#e0e0e0',
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  lineHeight: 1.1,
                }}
              >
                AI Code Review Assistant
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 400,
                  maxWidth: '500px',
                  mx: 'auto',
                  opacity: 0.8,
                  color: '#93a3b5',
                  fontSize: { xs: '1rem', sm: '1.15rem' },
                  mt: 2,
                  mb: 0,
                }}
              >
                Generate professional README.md files with AI assistance
              </Typography>
            </Box>
            <ReadmeGenerator />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;