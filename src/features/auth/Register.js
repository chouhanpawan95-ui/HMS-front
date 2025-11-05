import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSignupMutation } from '../api/authApi';
import { Box, TextField, Button, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { token } = useSelector((state) => state.auth);
  const [signup, { isLoading, error }] = useSignupMutation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // client-side validation
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(String(formData.email).toLowerCase())) newErrors.email = 'Invalid email';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      console.log('Register payload:', formData);
      const res = await signup(formData).unwrap();
      console.log('Signup success', res);
      setSuccessMessage('User created successfully! You can now go to the login page.');
      setErrorMessage('');
      setFormData({ name: '', email: '', password: '' }); // Clear the form
    } catch (err) {
      console.error('Signup error', err);
      // Try to extract a useful message from RTK Query error shapes,
      // but handle HTML or invalid JSON responses gracefully.
      const raw = err?.data ?? err?.error ?? err;
      let serverMessage = '';
      if (typeof raw === 'string') {
        const trimmed = raw.trim();
        if (trimmed.startsWith('<')) {
          // Server returned HTML (like an error page)
          serverMessage = 'User already available';
        } else {
          serverMessage = trimmed;
        }
      } else if (raw && typeof raw === 'object') {
        serverMessage = raw.message || raw.error || JSON.stringify(raw);
      } else {
        serverMessage = String(raw);
      }

      if (err?.status === 409 || /already/i.test(String(serverMessage))) {
        setErrorMessage('User already exists. Please login.');
      } else if (serverMessage) {
        setErrorMessage(serverMessage);
      } else {
        setErrorMessage('Signup failed. Please try again.');
      }
      setSuccessMessage('');
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
            Register
          </Typography>

          {successMessage && (
            <Typography variant="body1" color="success.main" align="center" sx={{ mb: 1 }}>
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography variant="body2" color="error" align="center" sx={{ mb: 1 }}>
              {errorMessage}
            </Typography>
          )}

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
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              variant="outlined"
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
              error={!!errors.password}
              helperText={errors.password}
            />           
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 1, py: 1.2, borderRadius: 2 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Signing up...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <p style={{ marginTop: '1rem' }}>
               Already have an Account <Link to="/">Login</Link>
           </p>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Register;
