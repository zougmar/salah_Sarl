/**
 * Permission utility functions
 * Helper functions for role-based access control
 */

import { ROLES, hasPermission, hasAnyPermission, hasAllPermissions } from '../constants/rbac';

/**
 * Check if user is admin
 * @param {string} userRole - User's role
 * @returns {boolean}
 */
export const isAdmin = (userRole) => {
  return userRole === ROLES.ADMIN;
};

/**
 * Check if user is employee
 * @param {string} userRole - User's role
 * @returns {boolean}
 */
export const isEmployee = (userRole) => {
  return userRole === ROLES.EMPLOYEE;
};

/**
 * Re-export permission functions for convenience
 */
export { hasPermission, hasAnyPermission, hasAllPermissions };

/**
 * Get user role display name
 * @param {string} role - User role
 * @returns {string} Formatted role name
 */
export const getRoleDisplayName = (role) => {
  const roleMap = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.EMPLOYEE]: 'Employee',
  };
  return roleMap[role] || role;
};

/**
 * Get role badge color
 * @param {string} role - User role
 * @returns {string} Tailwind color class
 */
export const getRoleBadgeColor = (role) => {
  const colorMap = {
    [ROLES.ADMIN]: 'bg-primary-100 text-primary-700 border-primary-200',
    [ROLES.EMPLOYEE]: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return colorMap[role] || 'bg-slate-100 text-slate-700';
};

