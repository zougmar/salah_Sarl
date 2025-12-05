import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { Menu, LogOut, User, Shield, Briefcase } from 'lucide-react';
import { getRoleDisplayName, getRoleBadgeColor } from '../../utils/permissions';
import { ROLES } from '../../constants/rbac';

export const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
  };

  const roleIcon = user?.role === ROLES.ADMIN ? Shield : Briefcase;
  const RoleIcon = roleIcon;
  const roleBadgeColor = getRoleBadgeColor(user?.role);

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b border-slate-100 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
        <div>
          <p className="text-sm text-slate-500">Welcome back</p>
          <h1 className="text-2xl font-bold text-slate-900">{user?.name || 'User'}</h1>
        </div>
      </div>
      
      {/* Professional User Info Section */}
      <div className="flex items-center gap-4">
        {/* User Info Card */}
        <div className="hidden md:flex items-center gap-3 bg-gradient-to-r from-slate-50 to-white px-4 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white border-2 border-white flex items-center justify-center">
              <RoleIcon className={`w-2.5 h-2.5 ${
                user?.role === ROLES.ADMIN ? 'text-primary-600' : 'text-slate-600'
              }`} />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                {user?.name || 'User'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${roleBadgeColor}`}>
                <RoleIcon className="w-3 h-3" />
                {getRoleDisplayName(user?.role)}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile User Info */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
              {user?.name || 'User'}
            </span>
            <span className={`text-xs ${user?.role === ROLES.ADMIN ? 'text-primary-600' : 'text-slate-600'}`}>
              {getRoleDisplayName(user?.role)}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition font-medium group"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

