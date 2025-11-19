// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useLoginMutation } from '../api/authApi';
// import { setCredentials } from '../features/authSlice';
// import { useNavigate, Link } from 'react-router-dom';
// import { Box, TextField, Button, Typography, Paper, Grid, CircularProgress, Alert } from "@mui/material";

// function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { token } = useSelector((state) => state.auth);
//   const [login, { isLoading }] = useLoginMutation();
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');

//     if (!form.email || !form.password) {
//       setErrorMessage('Please fill in all fields');
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(form.email)) {
//       setErrorMessage('Please enter a valid email address');
//       return;
//     }

//     try {
//       const res = await login(form).unwrap();
//       if (res?.token) {
//         dispatch(setCredentials({ token: res.token, user: res.user }));
//         navigate('/dashboard');
//       }
//     } catch (err) {
//       setErrorMessage(err?.data?.message || 'Invalid email or password');
//     }
//   };

//   return (
//     <Grid
//       container
//       justifyContent="center"
//       alignItems="center"
//       sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
//     >
//       <Grid item xs={11} sm={8} md={5} lg={4}>
//         <Paper elevation={4} sx={{ p: 4, borderRadius: 3, backgroundColor: "#fff" }}>
//           <Typography variant="h5" align="center" gutterBottom>
//             Login
//           </Typography>

//           <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
//             {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

//             <TextField
//               label="Email"
//               type="email"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               fullWidth
//               required
//               disabled={isLoading}
//             />
//             <TextField
//               label="Password"
//               type="password"
//               value={form.password}
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//               fullWidth
//               required
//               disabled={isLoading}
//             />

//             <Button type="submit" variant="contained" color="primary" disabled={isLoading} sx={{ py: 1.2, borderRadius: 2 }}>
//               {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
//             </Button>

//             <Typography variant="body2" sx={{ mt: 2 }}>
//               New user? <Link to="/register">Create a new account</Link>
//             </Typography>
//           </Box>
//         </Paper>
//       </Grid>
//     </Grid>
//   );
// }

// export default Login;
