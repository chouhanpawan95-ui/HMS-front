import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLoginMutation } from '../api/authApi';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import { Alert } from '@mui/material';

function Login() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [login, { isLoading, error }] = useLoginMutation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

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
      const res = await login(form).unwrap();
      if (res?.token) navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.data?.message || 'Invalid email or password');
    }
  };

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
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              variant="outlined"
              fullWidth
              required
              error={!!errorMessage && !form.email}
              disabled={isLoading}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              variant="outlined"
              fullWidth
              required
              error={!!errorMessage && !form.password}
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
            <p style={{ marginTop: '1rem' }}>
        New user? <Link to="/register">Create a new account</Link>
      </p>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Login;
