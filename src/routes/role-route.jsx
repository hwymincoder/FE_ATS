import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/configs/routes';
import { useAuth } from '@/hooks/use-auth';
import { hasAllowedRole } from '@/lib/authorization';

export default function RoleRoute({ allowedRoles, redirectTo = ROUTES.FORBIDDEN, children }) {
  const { user } = useAuth();

  if (!hasAllowedRole(user?.role, allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
