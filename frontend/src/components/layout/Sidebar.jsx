import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  ClipboardList, 
  User, 
  Users, 
  QrCode, 
  Plus,
  UserPlus,
  Building2,
  X
} from 'lucide-react';
import { getNavigationItems, getAdminActions } from '../../constants/rbac';
import { isAdmin } from '../../utils/permissions';

// Icon mapping for dynamic icon rendering
const iconMap = {
  LayoutDashboard,
  ClipboardList,
  User,
  Users,
  QrCode,
  Plus,
  UserPlus,
};

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const userRole = user?.role;

  // Debugging
  console.log('Sidebar Debug:');
  console.log('User:', user);
  console.log('User Role:', userRole);

  // Get navigation items based on RBAC
  const navigationItems = getNavigationItems(userRole);
  const adminActions = getAdminActions(userRole);

  // More debugging
  console.log('Navigation Items:', navigationItems);
  console.log('Admin Actions:', adminActions);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col w-64 bg-slate-950 text-white min-h-screen shadow-card
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-semibold">SalahElecSarl</p>
              <p className="text-xs text-white/70">Workflow Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {/* Main Navigation */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider px-4 py-2">
            Navigation
          </p>
          <div className="space-y-1 mt-2">
            {navigationItems.map((item) => {
              const Icon = iconMap[item.icon];
              if (!Icon) return null;
              
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Admin Quick Actions */}
        {isAdmin(userRole) && adminActions.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider px-4 py-2">
              Quick Actions
            </p>
            <div className="space-y-1 mt-2">
              {adminActions.map((item) => {
                const Icon = iconMap[item.icon];
                if (!Icon) return null;
                
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => onClose()}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User Info Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-white/60 truncate">{user?.email}</p>
            <p className="text-xs text-primary-400 uppercase mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

