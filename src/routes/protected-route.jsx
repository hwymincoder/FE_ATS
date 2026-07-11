import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/configs/routes';
import { ROLES } from '@/constants';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.CANDIDATE_LOGIN} replace state={{ from: location }} />;
  }

  if (user?.role === ROLES.CANDIDATE) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}
