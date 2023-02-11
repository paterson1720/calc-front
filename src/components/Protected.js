import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/user-context';

export default function Protected({ children }) {
  const { user } = useUser();
  if (!user.loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!user.authToken) {
    return (
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <h1>Acess denied!</h1>
        <Link to="/"> {'Go back'}</Link>
      </div>
    );
  }
  return children;
}
