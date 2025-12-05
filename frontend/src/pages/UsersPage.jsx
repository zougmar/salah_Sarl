import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UserAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, Users, Mail, User as UserIcon, Shield, Trash2, Search, Plus, X } from 'lucide-react';
import { RequirePermission } from '../components/shared/RequirePermission';
import { PERMISSIONS } from '../constants/rbac';

export const UsersPage = ({ addMode = false }) => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const isAdmin = currentUser?.role === 'admin';

  const loadUsers = () =>
    UserAPI.list()
      .then((res) => setUsers(res.data))
      .catch(() => {
        if (currentUser?.role !== 'admin') {
          toast.error('You do not have permission to view users');
        } else {
          toast.error('Unable to load users');
        }
      });

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('Only admins can create users');
      return;
    }
    setLoading(true);
    try {
      await UserAPI.create(form);
      toast.success('User created successfully');
      setForm({ name: '', email: '', password: '', role: 'employee' });
      setShowAddForm(false);
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast.error('Only admins can delete users');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await UserAPI.remove(id);
      toast.success('User removed successfully');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error('Unable to delete user');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
          <p className="mt-1 text-slate-600">Manage your team members and their access</p>
        </div>
        {!addMode && (
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <RequirePermission permission={PERMISSIONS.CREATE_USERS}>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-500 hover:shadow-xl hover:shadow-primary-500/30 transition whitespace-nowrap"
              >
                {showAddForm ? (
                  <>
                    <X className="w-5 h-5" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Employee
                  </>
                )}
              </button>
            </RequirePermission>
          </div>
        )}
      </div>

      {/* Add Employee Form - Shown when button is clicked */}
      {!addMode && (
        <RequirePermission permission={PERMISSIONS.CREATE_USERS} hide>
          {showAddForm && (
            <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-white p-6 shadow-card border border-slate-100 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500 rounded-lg">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Add New Employee</h2>
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 hover:bg-white/50 rounded-lg transition"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Temporary Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    minLength={6}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setForm({ name: '', email: '', password: '', role: 'employee' });
                    }}
                    className="flex-1 rounded-lg bg-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30"
                  >
                    {loading ? 'Creating...' : 'Add Employee'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </RequirePermission>
      )}

      <div className={`grid gap-6 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
        {/* Info message for non-admins - shown when user doesn't have CREATE_USERS permission */}
        {!addMode && !isAdmin && (
          <div className="lg:col-span-1">
            <section className="rounded-2xl bg-gradient-to-br from-blue-50 to-white p-6 shadow-card border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">View Only</h2>
              </div>
              <p className="text-sm text-slate-600">
                You can view the team directory, but only administrators can add or remove employees.
              </p>
            </section>
          </div>
        )}

        {/* Users List */}
        {!addMode && (
          <div className={isAdmin ? "lg:col-span-2" : "lg:col-span-1"}>
            <section className="rounded-2xl bg-white p-6 shadow-card border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Users className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Team Directory</h2>
                    <p className="text-sm text-slate-500">{filteredUsers.length} {filteredUsers.length === 1 ? 'member' : 'members'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">
                      {searchTerm ? 'No employees found matching your search' : 'No employees yet'}
                    </p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <article
                      key={user._id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:border-primary-200 hover:bg-primary-50/50 transition-all group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          user.role === 'admin' ? 'bg-primary-100' : 'bg-slate-100'
                        }`}>
                          <UserIcon className={`w-6 h-6 ${
                            user.role === 'admin' ? 'text-primary-600' : 'text-slate-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                            {user.role === 'admin' && (
                              <Shield className="w-4 h-4 text-primary-600 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <p className="text-sm text-slate-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                          user.role === 'admin'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {user.role}
                        </span>
                        <RequirePermission permission={PERMISSIONS.DELETE_USERS} hide>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition group"
                            title="Remove user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </RequirePermission>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

