import { Navigate, Route, Routes } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPageNew';
import { TasksPage } from './pages/TasksPage';
import { TaskDetailsPage } from './pages/TaskDetailsPage';
import { UsersPage } from './pages/UsersPage';
import { ProfilePage } from './pages/ProfilePage';
import { LocationCapturePage } from './pages/LocationCapturePage';
import { QRCodePage } from './pages/QRCodePage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { RoleProtectedRoute } from './components/layout/RoleProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { PERMISSIONS } from './constants/rbac';
import { SmartRedirect } from './components/layout/SmartRedirect';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/location-checkin" element={<LocationCapturePage />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          {/* Smart redirect based on user role */}
          <Route path="/" element={<SmartRedirect />} />
          
          {/* Admin-only routes */}
          <Route 
            path="/dashboard" 
            element={
              <RoleProtectedRoute requiredPermission={PERMISSIONS.VIEW_DASHBOARD}>
                <DashboardPage />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <RoleProtectedRoute requiredPermission={PERMISSIONS.VIEW_USERS}>
                <UsersPage />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="/users/add" 
            element={
              <RoleProtectedRoute requiredPermission={PERMISSIONS.CREATE_USERS}>
                <UsersPage addMode={true} />
              </RoleProtectedRoute>
            } 
          />
          
          {/* Common routes - available to all authenticated users */}
          <Route 
            path="/tasks" 
            element={
              <RoleProtectedRoute requiredPermission={PERMISSIONS.VIEW_TASKS}>
                <TasksPage />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="/tasks/add" 
            element={
              <RoleProtectedRoute requiredPermission={PERMISSIONS.CREATE_TASKS}>
                <TasksPage addMode={true} />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="/tasks/:id" 
            element={
              <RoleProtectedRoute requiredPermission={PERMISSIONS.VIEW_TASKS}>
                <TaskDetailsPage />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <RoleProtectedRoute requiredPermission={PERMISSIONS.VIEW_PROFILE}>
                <ProfilePage />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="/qr-code" 
            element={
              <RoleProtectedRoute requiredPermission={PERMISSIONS.VIEW_QR_CODE}>
                <QRCodePage />
              </RoleProtectedRoute>
            } 
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
