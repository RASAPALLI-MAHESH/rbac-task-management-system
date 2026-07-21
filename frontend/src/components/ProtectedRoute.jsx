import { Navigate, useLocation } from 'react-router-dom';
import { getDashboardPath, getRole, isAuthenticated } from '../utils/helpers';

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const role = getRole();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to={getDashboardPath(role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
