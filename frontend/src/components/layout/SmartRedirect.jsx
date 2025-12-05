import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../utils/permissions';
import { PERMISSIONS, ROLES } from '../../constants/rbac';

/**
 * SmartRedirect - Redirects users to appropriate page based on their role
 * - Admins: Dashboard
 * - Employees: Tasks
 */
export const SmartRedirect = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin users go to dashboard
  if (user.role === ROLES.ADMIN && hasPermission(user.role, PERMISSIONS.VIEW_DASHBOARD)) {
    return <Navigate to="/dashboard" state={{ from: location }} replace={true} />;
  }

  // All other users go to tasks
  return <Navigate to="/tasks" replace />;
};

