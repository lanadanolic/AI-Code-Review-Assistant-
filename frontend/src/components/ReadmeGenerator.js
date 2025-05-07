import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Divider,
  Fade,
  Snackbar,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import axios from 'axios';

const ReadmeCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4),
  backgroundColor: 'rgba(30, 36, 54, 0.99)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 12px #23294620',
  border: '1px solid #232946',
  transition: 'all 0.2s ease-in-out',
  '& .MuiCardContent-root': {
    padding: theme.spacing(3),
  },
}));

const ReadmeContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: '#202535',
  borderRadius: theme.spacing(1.5),
  fontFamily: '"JetBrains Mono", "Fira Mono", "Roboto Mono", monospace',
  color: theme.palette.text.primary,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  maxHeight: '420px',
  overflowY: 'auto',
  border: '1px solid #232946',
  fontSize: '1.01rem',
  boxShadow: '0 0 8px #23294610',
  '&::-webkit-scrollbar': {
    width: '7px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(96,165,250,0.04)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#232946',
    borderRadius: '4px',
    '&:hover': {
      background: '#2563eb',
    },
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.text.secondary,
  border: 'none',
  padding: 4,
  fontSize: '1.1rem',
  '&:hover': {
    backgroundColor: 'rgba(37,99,235,0.08)',
    color: theme.palette.primary.main,
    transform: 'scale(1.08)',
  },
  transition: 'all 0.2s ease',
}));

const EmptyState = () => (
  <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
    <InsertDriveFileOutlinedIcon sx={{ fontSize: 48, mb: 1, color: 'primary.main' }} />
    <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
      No README generated yet
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
      Enter a Git repository URL and click Generate to get started.
    </Typography>
  </Box>
);

const ReadmeGenerator = () => {
  const [gitUrl, setGitUrl] = useState('');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [readme, setReadme] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [gitUrlError, setGitUrlError] = useState('');
  const gitUrlInputRef = useRef(null);
  const readmeRef = useRef(null);

  useEffect(() => {
    if (gitUrlInputRef.current) {
      gitUrlInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (readme && readmeRef.current) {
      readmeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [readme]);

  const isValidGitUrl = (url) => {
    return /^https:\/\/(github|gitlab|bitbucket)\.com\/[\w.-]+\/[\w.-]+(\.git)?(\/?|#.*)?$/.test(url);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleGitUrlChange = (e) => {
    const value = e.target.value;
    setGitUrl(value);
    if (!isValidGitUrl(value)) {
      setGitUrlError('Please enter a valid Git repository URL (e.g. https://github.com/user/repo)');
    } else {
      setGitUrlError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidGitUrl(gitUrl)) {
      setGitUrlError('Please enter a valid Git repository URL (e.g. https://github.com/user/repo)');
      return;
    }
    setLoading(true);
    setError(null);
    setReadme(null);
    try {
      const response = await axios.post('http://localhost:8080/api/readme/generate', {
        projectName,
        description,
        gitUrl,
      });
      setReadme(response.data.readmeContent || response.data);
    } catch (err) {
      let backendMsg = err.response?.data?.message;
      if (!backendMsg && err.response?.data) {
        backendMsg = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
      }
      setError(backendMsg || 'An error occurred while generating the README. Please check your Git URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (readme) {
      navigator.clipboard.writeText(readme);
      setSnackbar({
        open: true,
        message: 'README.md copied to clipboard!',
        severity: 'success'
      });
    }
  };

  const handleDownload = () => {
    if (readme) {
      const blob = new Blob([readme], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'README.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSnackbar({
        open: true,
        message: 'README.md downloaded successfully!',
        severity: 'success'
      });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: { xs: 1, sm: 4 } }}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', letterSpacing: '-0.01em', mb: 0.5 }}>
              Generate <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>README.md</Box>
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ opacity: 0.85, mb: 0 }}>
              Enter your Git repository URL to generate a professional README.md
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Project Name (optional)"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{ style: { fontFamily: 'inherit', fontSize: '1rem' } }}
              InputLabelProps={{ style: { color: '#93a3b5', fontWeight: 400 } }}
              placeholder="e.g. My Awesome Project"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label={<span>Git Repository URL <Box component="span" sx={{ color: 'error.main', fontWeight: 700 }}>*</Box></span>}
              value={gitUrl}
              onChange={handleGitUrlChange}
              error={!!gitUrlError}
              helperText={gitUrlError || 'e.g. https://github.com/user/repo'}
              inputRef={gitUrlInputRef}
              InputProps={{
                startAdornment: <GitHubIcon sx={{ mr: 1, color: 'primary.main' }} />, style: { fontFamily: 'inherit', fontSize: '1rem' }
              }}
              InputLabelProps={{ style: { color: '#93a3b5', fontWeight: 400 } }}
              placeholder="e.g. https://github.com/user/repo"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Project Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 2 }}
              InputProps={{ style: { fontFamily: 'inherit', fontSize: '1rem' } }}
              InputLabelProps={{ style: { color: '#93a3b5', fontWeight: 400 } }}
              placeholder="Short project description (optional)"
            />
          </Grid>
          <Grid item xs={12}>
            <Tooltip title="Generate a professional README.md for your project" arrow>
              <span style={{ display: 'block' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading || !gitUrl || !!gitUrlError}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{ fontWeight: 600, fontSize: '1.05rem', py: 1.2, fontFamily: 'inherit', boxShadow: 'none', borderRadius: 2, transition: 'box-shadow 0.2s', ...(gitUrl && !gitUrlError && !loading ? { boxShadow: '0 0 0 2px #2563eb40' } : {}) }}
                >
                  {loading ? 'Generating README...' : 'Generate README'}
                </Button>
              </span>
            </Tooltip>
          </Grid>
          {loading && (
            <Grid item xs={12}>
              <LinearProgress 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: 'rgba(37,99,235,0.06)',
                  '& .MuiLinearProgress-bar': {
                    background: '#2563eb',
                  }
                }} 
              />
              <Typography 
                variant="body2" 
                color="text.secondary" 
                align="center" 
                sx={{ mt: 1, opacity: 0.8, fontFamily: 'inherit' }}
              >
                Generating your README.md...
              </Typography>
            </Grid>
          )}
          {error && (
            <Grid item xs={12}>
              <Fade in={true}>
                <Alert 
                  severity="error" 
                  icon={<ErrorOutlineIcon />}
                  sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 2px 8px #23294620',
                    backgroundColor: '#232946',
                    color: '#fff',
                    border: '1px solid #232946',
                    fontFamily: 'inherit',
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            </Grid>
          )}
          {!readme && !loading && !error && (
            <Grid item xs={12}>
              <EmptyState />
            </Grid>
          )}
          {readme && (
            <Grid item xs={12}>
              <Fade in={true}>
                <ReadmeCard ref={readmeRef}>
                  <CardContent sx={{ pb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1 }}>
                      <Tooltip title="Copy to clipboard" arrow>
                        <ActionButton onClick={handleCopy} size="small">
                          <ContentCopyIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Download README.md" arrow>
                        <ActionButton onClick={handleDownload} size="small">
                          <DownloadIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                    </Box>
                    <Divider sx={{ mb: 2, opacity: 0.15, borderColor: '#232946' }} />
                    <ReadmeContent>
                      {readme}
                    </ReadmeContent>
                  </CardContent>
                </ReadmeCard>
              </Fade>
            </Grid>
          )}
        </Grid>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            backgroundColor: '#232946',
            color: '#fff',
            border: '1px solid #232946',
            boxShadow: '0 2px 8px #23294620',
            fontFamily: 'inherit',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReadmeGenerator; 