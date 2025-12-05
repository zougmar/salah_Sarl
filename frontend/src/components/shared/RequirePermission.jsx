import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../utils/permissions';

/**
 * RequirePermission - HOC component to conditionally render based on permissions
 * 
 * @param {Object} props
 * @param {string} props.permission - Required permission
 * @param {React.ReactNode} props.children - Content to render if permission granted
 * @param {React.ReactNode} props.fallback - Optional fallback content if permission denied
 * @param {boolean} props.hide - If true, returns null instead of fallback when permission denied
 */
export const RequirePermission = ({ 
  permission, 
  children, 
  fallback = null,
  hide = false 
}) => {
  const { user } = useAuth();
  
  // If no permission required, always render children
  if (!permission) {
    return <>{children}</>;
  }
  
  // Check if user has permission
  const hasAccess = hasPermission(user?.role, permission);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // If hide is true, return null (don't show anything)
  if (hide) {
    return null;
  }
  
  // Otherwise show fallback
  return <>{fallback}</>;
};

/**
 * RequireAdmin - Shorthand for admin-only content
 */
export const RequireAdmin = ({ children, fallback = null, hide = false }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  if (isAdmin) {
    return <>{children}</>;
  }
  
  if (hide) {
    return null;
  }
  
  return <>{fallback}</>;
};

