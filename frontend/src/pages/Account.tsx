// src/pages/Account.tsx
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Helmet } from 'react-helmet';

const Account: React.FC = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
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

  const validateName = (name: string) => name.length > 0 ? '' : 'Name is required';
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
    const passwordError = password ? validatePassword(password) : '';
    const confirmPasswordError = password ? validateConfirmPassword(password, confirmPassword) : '';

    if (!nameError && !emailError && !passwordError && !confirmPasswordError) {
      console.log('Account updated successfully');
      alert('Account details updated!');
      // Here you could send the updated info to a server
    } else {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f0f4f8"
    >
         <Helmet>
        <title>Account | SnoopTrade</title>
      </Helmet>
      <Paper elevation={3} style={{ padding: '2rem', maxWidth: '400px', width: '100%' }}>
        <Typography variant="h4" gutterBottom align="center">Account Settings</Typography>
        
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
          label="New Password"
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
          label="Confirm New Password"
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
          style={{ marginTop: '1rem' }}
          onClick={handleSubmit}
        >
          Update Account
        </Button>
      </Paper>
    </Box>
  );
};

export default Account;
