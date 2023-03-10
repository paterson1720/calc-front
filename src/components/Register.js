import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import VerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { useUser } from '../contexts/user-context';
import { Alert, CircularProgress } from '@mui/material';

const theme = createTheme();

export default function Register() {
  const { user, setUser } = useUser();
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError(null);
      const formData = new FormData(event.currentTarget);
      const data = { username: formData.get('username'), password: formData.get('password') };
      if (!data.username?.trim() || !data.password?.trim()) {
        return setError('All field are required!');
      }
      setLoading(true);
      const response = await axios.post(process.env.REACT_APP_API_BASE_URL + '/register', data);
      localStorage.setItem('auth-token', response.data.token);
      setUser({ ...user, authToken: response.data.token });
      setLoading(false);
      history.replace('/calculator');
    } catch (error) {
      setError(error.response.data.error);
      setLoading(false);
    }
  };

  if (user.authToken) {
    return history.replace('/calculator');
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <VerifiedUserOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {loading && (
            <Box sx={{ display: 'grid', placeItems: 'center', width: '100%' }}>
              <CircularProgress />
            </Box>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              disabled={loading}
            />
            <Button type="submit" disabled={loading} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/" variant="body2">
                  {'Already have an account? sign in'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
