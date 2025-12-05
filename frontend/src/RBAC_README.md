# Role-Based Access Control (RBAC) System

This project implements a comprehensive, scalable RBAC system for managing user permissions and access control.

## 📁 File Structure

```
frontend/src/
├── constants/
│   └── rbac.js              # RBAC configuration and permissions
├── utils/
│   └── permissions.js     # Permission utility functions
├── components/
│   ├── layout/
│   │   ├── RoleProtectedRoute.jsx  # Route protection component
│   │   └── SmartRedirect.jsx       # Smart redirect based on role
│   └── shared/
│       └── RequirePermission.jsx   # Conditional rendering based on permissions
```

## 🔐 Permission System

### Available Permissions

All permissions are defined in `constants/rbac.js`:

- `VIEW_DASHBOARD` - Access admin dashboard
- `VIEW_TASKS` - View tasks
- `CREATE_TASKS` - Create new tasks
- `EDIT_TASKS` - Edit existing tasks
- `DELETE_TASKS` - Delete tasks
- `VIEW_USERS` - View users/employees list
- `CREATE_USERS` - Create new users
- `EDIT_USERS` - Edit users
- `DELETE_USERS` - Delete users
- `VIEW_PROFILE` - View own profile
- `EDIT_PROFILE` - Edit own profile
- `VIEW_QR_CODE` - Access QR code feature

### Role Permissions

**Admin Role:**
- All permissions granted

**Employee Role:**
- `VIEW_TASKS`
- `EDIT_TASKS`
- `VIEW_PROFILE`
- `EDIT_PROFILE`
- `VIEW_QR_CODE`

## 🎯 Usage Examples

### 1. Route Protection

```jsx
import { RoleProtectedRoute } from './components/layout/RoleProtectedRoute';
import { PERMISSIONS } from './constants/rbac';

<Route 
  path="/dashboard" 
  element={
    <RoleProtectedRoute requiredPermission={PERMISSIONS.VIEW_DASHBOARD}>
      <DashboardPage />
    </RoleProtectedRoute>
  } 
/>
```

### 2. Conditional Rendering

```jsx
import { RequirePermission } from './components/shared/RequirePermission';
import { PERMISSIONS } from './constants/rbac';

<RequirePermission permission={PERMISSIONS.CREATE_TASKS}>
  <button>Add Task</button>
</RequirePermission>
```

### 3. Hide Content

```jsx
<RequirePermission permission={PERMISSIONS.CREATE_USERS} hide>
  {/* This content only shows if user has permission */}
  <AddUserForm />
</RequirePermission>
```

### 4. Check Permissions in Code

```jsx
import { hasPermission } from './utils/permissions';
import { PERMISSIONS } from './constants/rbac';

if (hasPermission(user.role, PERMISSIONS.CREATE_TASKS)) {
  // User can create tasks
}
```

## 🧭 Navigation

Navigation items are automatically filtered based on user permissions:

- **Common Items** (All users): Tasks, Profile, QR Code
- **Admin Items**: Dashboard, Employees (added automatically for admins)

Navigation is managed in `constants/rbac.js` via `getNavigationItems()` function.

## 🔄 Smart Redirects

The app uses `SmartRedirect` component to redirect users to appropriate pages:
- **Admins**: Redirected to `/dashboard`
- **Employees**: Redirected to `/tasks`

## 🛡️ Security

- All routes are protected at the route level
- Components check permissions before rendering
- Backend also validates permissions (server-side security)
- No sensitive data exposed to unauthorized users

## 📝 Adding New Permissions

1. Add permission constant to `constants/rbac.js`:
```javascript
export const PERMISSIONS = {
  // ... existing permissions
  NEW_PERMISSION: 'new:permission',
};
```

2. Add to role permissions:
```javascript
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // ... existing permissions
    PERMISSIONS.NEW_PERMISSION,
  ],
};
```

3. Use in components:
```jsx
<RequirePermission permission={PERMISSIONS.NEW_PERMISSION}>
  <NewFeature />
</RequirePermission>
```

## 🎨 UI Components

### Header
- Shows user's full name and role
- Professional design with role badge
- Responsive for mobile and desktop

### Sidebar
- Dynamic navigation based on permissions
- Icons for all menu items
- Organized sections (Navigation, Quick Actions)
- Mobile responsive with hamburger menu

## ✅ Best Practices

1. **Always check permissions** before rendering sensitive content
2. **Use RequirePermission** for conditional UI elements
3. **Use RoleProtectedRoute** for route-level protection
4. **Keep permissions centralized** in `rbac.js`
5. **Test with both roles** to ensure proper access control

