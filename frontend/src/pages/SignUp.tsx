import React, { useState } from 'react';
import { TextField, Button, Box, Typography, IconButton, InputAdornment, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import { Helmet } from 'react-helmet';
import BackgroundImage from '../assests/Images/login_background.jpg';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateName = (name: string) => (name.length > 0 ? '' : 'Name is required');
  const validateEmail = (email: string) =>
    /^\S+@\S+\.\S+$/.test(email) ? '' : 'Enter a valid email';
  const validatePassword = (password: string) =>
    password.length >= 6 ? '' : 'Password must be at least 6 characters';
  const validateConfirmPassword = (password: string, confirmPassword: string) =>
    password === confirmPassword ? '' : 'Passwords do not match';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

    if (!nameError && !emailError && !passwordError && !confirmPasswordError) {
      console.log('Form submitted successfully');
    } else {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Google Sign Up initiated');
    // Add Google sign-up logic here
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Helmet>
        <title>Sign Up | SnoopTrade</title>
      </Helmet>

      {/* Content Wrapper */}
      <Paper
        elevation={3}
        sx={{
          padding: '2rem',
          maxWidth: '400px',
          width: '90%',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            margin="normal"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
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
          <TextField
            label="Re-type Password"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: '1rem' }}
          >
            Sign Up
          </Button>
        </form>

        {/* OR Divider */}
        <Typography
          variant="body2"
          align="center"
          sx={{ marginTop: '1rem', marginBottom: '1rem' }}
        >
          OR
        </Typography>

        {/* Google Sign Up Button */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignUp}
          sx={{
            backgroundColor: '#DB4437',
            color: 'white',
            '&:hover': { backgroundColor: '#C33D2E' },
          }}
        >
          Sign Up with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default SignUp;
