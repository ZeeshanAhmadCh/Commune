import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner.js';

const AdminRoute = ({ children }) => {
  const { user, isLoading } = useSelector(state => state.auth);

  if (isLoading) {
    return <Spinner />;
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminRoute; 