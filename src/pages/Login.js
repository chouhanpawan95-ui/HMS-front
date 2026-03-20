 import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import { Alert } from '@mui/material';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Prevent browser back button from returning to protected routes after logout
  useEffect(() => {
    const preventBackNavigation = () => {
      window.history.pushState(null, '', window.location.pathname);
    };

    // Add a history entry and block back navigation while on the login page
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', preventBackNavigation);

    return () => {
      window.removeEventListener('popstate', preventBackNavigation);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Basic validation
    if (!form.email || !form.password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'https://hms-api-x81r.onrender.com/api';
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (data?.token) {
        localStorage.setItem('token', data.token);
        navigate('/layout/Dashboard');
      } else {
        throw new Error('No token received from server');
      }
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/layout/Dashboard");
    },4000);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
if (showSuccess) {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafc",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: "center",
          backgroundColor: "#ffffff",
          width: 350,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "8px solid #5C8FD6",   // ✅ Blue circle
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
          }}
        >
          <Typography
            sx={{
              fontSize: 60,
              color: "#5C8FD6",   // ✅ Blue tick
              fontWeight: "bold",
            }}
          >
            ✓
          </Typography>
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1F2A44", mb: 1 }}
        >
          Thank you!
        </Typography>

        <Typography variant="body1" sx={{ color: "#555" }}>
          Login Successfully.
        </Typography>
      </Paper>
    </Box>
  );
}
  return (
      <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <Grid item xs={11} sm={8} md={5} lg={4}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>

          {/* Form with submit handler */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
            }}
          >    
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}       
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              variant="outlined"
              fullWidth
              required
              disabled={isLoading}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              variant="outlined"
              fullWidth
              required
              disabled={isLoading}
            />           
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              sx={{ mt: 1, py: 1.2, borderRadius: 2 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Login'
              )}
            </Button>
            
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Login;
