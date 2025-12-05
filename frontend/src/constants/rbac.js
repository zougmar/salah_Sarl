/**
 * Role-Based Access Control (RBAC) Configuration
 * 
 * This file defines all permissions and navigation items based on user roles.
 * Centralized configuration for easy maintenance and scalability.
 */

export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
};

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view:dashboard',
  
  // Tasks
  VIEW_TASKS: 'view:tasks',
  CREATE_TASKS: 'create:tasks',
  EDIT_TASKS: 'edit:tasks',
  DELETE_TASKS: 'delete:tasks',
  
  // Users/Employees
  VIEW_USERS: 'view:users',
  CREATE_USERS: 'create:users',
  EDIT_USERS: 'edit:users',
  DELETE_USERS: 'delete:users',
  
  // Profile
  VIEW_PROFILE: 'view:profile',
  EDIT_PROFILE: 'edit:profile',
  
  // QR Code
  VIEW_QR_CODE: 'view:qr_code',
};

// Role to Permissions Mapping
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_TASKS,
    PERMISSIONS.CREATE_TASKS,
    PERMISSIONS.EDIT_TASKS,
    PERMISSIONS.DELETE_TASKS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_QR_CODE,
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_TASKS,
    PERMISSIONS.EDIT_TASKS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_QR_CODE,
  ],
};

// Navigation Items Configuration
export const NAVIGATION_ITEMS = {
  // Available to all authenticated users
  COMMON: [
    {
      id: 'tasks',
      label: 'Tasks',
      path: '/tasks',
      icon: 'ClipboardList',
      permission: PERMISSIONS.VIEW_TASKS,
    },
    {
      id: 'profile',
      label: 'My Profile',
      path: '/profile',
      icon: 'User',
      permission: PERMISSIONS.VIEW_PROFILE,
    },
    {
      id: 'qr-code',
      label: 'QR Code',
      path: '/qr-code',
      icon: 'QrCode',
      permission: PERMISSIONS.VIEW_QR_CODE,
    },
  ],
  
  // Admin-only items
  ADMIN: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
      id: 'employees',
      label: 'Employees',
      path: '/users',
      icon: 'Users',
      permission: PERMISSIONS.VIEW_USERS,
    },
  ],
  
  // Quick actions (admin only)
  ADMIN_ACTIONS: [
    {
      id: 'add-task',
      label: 'Add Task',
      path: '/tasks/add',
      icon: 'Plus',
      permission: PERMISSIONS.CREATE_TASKS,
    },
    {
      id: 'add-employee',
      label: 'Add Employee',
      path: '/users/add',
      icon: 'UserPlus',
      permission: PERMISSIONS.CREATE_USERS,
    },
  ],
};

/**
 * Check if user has a specific permission
 * @param {string} userRole - User's role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 * @param {string} userRole - User's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean}
 */
export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

/**
 * Check if user has all of the specified permissions
 * @param {string} userRole - User's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean}
 */
export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

/**
 * Get navigation items for a specific role
 * @param {string} userRole - User's role
 * @returns {Array} Filtered navigation items
 */
export const getNavigationItems = (userRole) => {
  const items = [...NAVIGATION_ITEMS.COMMON];
  
  if (userRole === ROLES.ADMIN) {
    items.push(...NAVIGATION_ITEMS.ADMIN);
  }
  
  return items.filter(item => hasPermission(userRole, item.permission));
};

/**
 * Get admin action items
 * @param {string} userRole - User's role
 * @returns {Array} Admin action items
 */
export const getAdminActions = (userRole) => {
  if (userRole !== ROLES.ADMIN) return [];
  return NAVIGATION_ITEMS.ADMIN_ACTIONS.filter(item => 
    hasPermission(userRole, item.permission)
  );
};

