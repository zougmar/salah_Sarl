import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../utils/permissions';
import { PERMISSIONS } from '../../constants/rbac';

/**
 * RoleProtectedRoute - Protects routes based on user permissions
 * 
 * @param {Object} props
 * @param {string} props.requiredPermission - Required permission to access the route
 * @param {string} props.fallbackPath - Path to redirect if permission denied (default: '/tasks')
 * @param {React.ReactNode} props.children - Optional children to render instead of Outlet
 */
export const RoleProtectedRoute = ({ 
  requiredPermission, 
  fallbackPath = '/tasks',
  children 
}) => {
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required permission
  if (requiredPermission && !hasPermission(user?.role, requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Render children if provided, otherwise render Outlet
  return children || <Outlet />;
};

/**
 * AdminRoute - Shorthand for admin-only routes
 */
export const AdminRoute = ({ children, fallbackPath = '/tasks' }) => {
  return (
    <RoleProtectedRoute 
      requiredPermission={PERMISSIONS.VIEW_DASHBOARD} 
      fallbackPath={fallbackPath}
    >
      {children}
    </RoleProtectedRoute>
  );
};

