import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import BackgroundImage from '../assests/Images/login_background.jpg';
import logo from '../assests/Images/Logo.png';

const CLIENT_ID = '978139760528-bmaaljd4da3akanum226u4627h4iq98e.apps.googleusercontent.com';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^\S+@\S+\.\S+$/.test(email) ? '' : 'Enter a valid email';
  const validatePassword = (password: string) =>
    password.length >= 6 ? '' : 'Password must be at least 6 characters';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (!emailError && !passwordError) {
      try {
        const formData = new URLSearchParams();
        formData.append('username', email); // 'username' as required by OAuth2PasswordRequestForm
        formData.append('password', password);

        const response = await fetch('http://localhost:8000/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('authToken', data.access_token);
          console.log('Login successful', data);
          navigate('/dashboard');
        } else {
          const errorData = await response.json();
          setLoginError(errorData.detail || 'Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setLoginError('Something went wrong. Please try again.');
      }
    } else {
      setErrors({ email: emailError, password: passwordError });
    }
  };

  const handleGoogleSuccess = (response: any) => {
    try {
      const token = response.credential;
      localStorage.setItem('authToken', token); // Store token in localStorage
      const user = jwtDecode(token);
      console.log('Google Login successful:', user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error decoding Google token:', error);
    }
  };

  const handleGoogleFailure = () => {
    console.error('Google Login failed');
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        flexDirection="column"
        sx={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Helmet>
          <title>SnoopTrade | Login</title>
        </Helmet>

        <Box display="flex" alignItems="center" marginBottom={4}>
          <img src={logo} alt="Logo" style={{ height: 50, marginRight: 10 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#F3F6F8',
              textShadow: '2px 2px 5px rgba(0, 0, 0, 0.8)',
            }}
          >
            SnoopTrade
          </Typography>
        </Box>

        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          width={{ xs: '90%', sm: '80%', lg: '60%' }}
          maxWidth="1200px"
          borderRadius="15px"
          overflow="hidden"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            p={4}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Welcome to SnoopTrade
            </Typography>
            <Typography variant="body1" gutterBottom>
              Discover insider trading insights and make smarter investment decisions with our tools and reports.
            </Typography>
          </Box>

          <Box
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
          >
            <Paper
              elevation={3}
              sx={{
                padding: '2rem',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '10px',
              }}
            >
              <Typography variant="h6" align="center" gutterBottom>
                Login to Your Account
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {loginError && (
                  <Typography color="error" variant="body2" align="center" gutterBottom>
                    {loginError}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: '#73C2A0',
                    color: 'white',
                    marginTop: 2,
                    '&:hover': { backgroundColor: '#6D727B' },
                  }}
                >
                  Login
                </Button>
              </form>

              <Typography variant="body2" align="center" sx={{ marginY: 2 }}>
                OR
              </Typography>

              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                width="100%"
                theme="outline"
                text="signin_with"
                logo_alignment="center"
              />

              <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: '#73C2A0', textDecoration: 'none' }}>
                  Sign Up
                </Link>
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </GoogleOAuthProvider>
  );
};

export default Login;
