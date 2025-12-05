import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DashboardAPI } from '../services/api';
import { StatCard } from '../components/shared/StatCard';
import { TasksPerEmployeeChart } from '../components/charts/TasksPerEmployeeChart';
import { LocationMap } from '../components/maps/LocationMapNew';
import { useAuth } from '../hooks/useAuth';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Users, 
  UserCog,
  Calendar,
  TrendingUp,
  Activity,
  Target,
  BarChart3,
  Sparkles
} from 'lucide-react';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapView, setMapView] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') return;
    setLoading(true);
    DashboardAPI.stats()
      .then((res) => setStats(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [user]);

  // This check is redundant since route is protected, but kept as safety fallback
  if (user?.role !== 'admin') {
    return (
      <div className="rounded-2xl bg-white p-10 shadow-card">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-slate-600">
            Dashboard insights are available for administrators only.
          </p>
        </div>
      </div>
    );
  }

  const taskStats = [
    { 
      label: 'Total Tasks', 
      value: stats?.totals?.total ?? (loading ? '...' : 0),
      icon: ClipboardList,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Completed', 
      value: stats?.totals?.completed ?? (loading ? '...' : 0),
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'In Progress', 
      value: stats?.totals?.inProgress ?? (loading ? '...' : 0),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    { 
      label: 'Open', 
      value: stats?.totals?.open ?? (loading ? '...' : 0),
      icon: AlertCircle,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50'
    },
    { 
      label: 'Overdue', 
      value: stats?.totals?.overdue ?? (loading ? '...' : 0),
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
  ];

  const userStats = [
    { 
      label: 'Total Users', 
      value: stats?.users?.total ?? (loading ? '...' : 0),
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    { 
      label: 'Employees', 
      value: stats?.users?.employees ?? (loading ? '...' : 0),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      label: 'Admins', 
      value: stats?.users?.admins ?? (loading ? '...' : 0),
      icon: UserCog,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
  ];

  const completionRate = stats?.totals?.total 
    ? Math.round((stats.totals.completed / stats.totals.total) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Professional Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Activity className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-primary-100 text-lg">Comprehensive overview of your organization's performance</p>
            </div>
            {stats && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-primary-100 uppercase tracking-wide">Completion Rate</p>
                  <p className="text-2xl font-bold">{completionRate}%</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Task Statistics */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-primary-600" />
          <h2 className="text-2xl font-bold text-slate-900">Task Statistics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {taskStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-primary-200 transition-all duration-300"
              >
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${stat.bgColor} opacity-60`}></div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  {loading && (
                    <div className="animate-pulse w-8 h-8 bg-slate-200 rounded"></div>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">{stat.label}</p>
                <p className={`text-4xl font-bold ${stat.color} mb-1`}>
                  {loading ? (
                    <span className="inline-block w-16 h-10 bg-slate-200 rounded animate-pulse"></span>
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </p>
                {!loading && stat.value > 0 && stats?.totals?.total > 0 && (
                  <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.bgColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.min((stat.value / stats.totals.total) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* User Statistics */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-primary-600" />
          <h2 className="text-2xl font-bold text-slate-900">Team Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-primary-200 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  {loading && (
                    <div className="animate-pulse w-8 h-8 bg-slate-200 rounded"></div>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">{stat.label}</p>
                <p className={`text-4xl font-bold ${stat.color} mb-2`}>
                  {loading ? (
                    <span className="inline-block w-12 h-10 bg-slate-200 rounded animate-pulse"></span>
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </p>
                {!loading && stats?.users?.total > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Target className="w-3 h-3" />
                    <span>
                      {Math.round((stat.value / stats.users.total) * 100)}% of total team
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Location Statistics */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-600" />
            <h2 className="text-2xl font-bold text-slate-900">Location Tracking</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMapView(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                !mapView 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>List View</span>
              </div>
            </button>
            <button
              onClick={() => setMapView(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                mapView 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Map View</span>
              </div>
            </button>
          </div>
        </div>
        <div className="rounded-2xl bg-white shadow-lg border border-slate-100 hover:shadow-xl transition-shadow overflow-hidden">
          <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Activity className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {mapView ? 'Location Map' : 'Recent Check-ins'}
                </h3>
                <p className="text-xs text-slate-500">Last 24 hours</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
              {stats?.locations?.total ?? (loading ? '...' : 0)} total
            </span>
          </div>
          
          {mapView ? (
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-80">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-slate-500">Loading map...</p>
                  </div>
                </div>
              ) : (
                <LocationMap locations={stats?.locations?.recent || []} />
              )}
            </div>
          ) : (
            <div className="p-6 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm text-slate-500">Loading location data...</p>
                </div>
              </div>
            ) : stats?.locations?.recent?.length > 0 ? (
              stats.locations.recent.map((location) => {
                const checkInTime = new Date(location.createdAt);
                const formattedDate = checkInTime.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                const formattedTime = checkInTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                });
                
                return (
                  <article
                    key={location._id}
                    className="group rounded-xl border border-slate-100 bg-gradient-to-r from-white to-slate-50/50 p-4 hover:border-primary-300 hover:shadow-md hover:from-primary-50/30 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                              {location.employeeId?.name || 'Unknown Employee'}
                            </h4>
                            <p className="text-xs text-slate-500">{location.employeeId?.email}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
                            <div className="p-1 bg-white rounded shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Date</p>
                              <p className="font-medium text-slate-700">{formattedDate}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
                            <div className="p-1 bg-white rounded shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Time</p>
                              <p className="font-medium text-slate-700">{formattedTime}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs font-medium text-blue-700">Location</p>
                          </div>
                          <p className="text-sm text-slate-700 font-mono">
                            {location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}
                          </p>
                          {location.accuracy && (
                            <p className="text-xs text-slate-500 mt-1">Accuracy: ±{location.accuracy}m</p>
                          )}
                        </div>
                        
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span>Check-in recorded</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-500">No recent check-ins</p>
                <p className="text-xs text-slate-400 mt-1">No location data in the last 24 hours</p>
              </div>
            )}
            </div>
          )}
        </div>
      </div>

      {/* Charts and Details Section */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Tasks per Employee Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Task Distribution</h3>
                <p className="text-xs text-slate-500">Tasks assigned per employee</p>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-primary-400" />
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-slate-500">Loading chart data...</p>
              </div>
            </div>
          ) : (
            <TasksPerEmployeeChart data={stats?.tasksPerEmployee || []} />
          )}
          {!loading && (!stats?.tasksPerEmployee || stats.tasksPerEmployee.length === 0) && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No task assignments yet</p>
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upcoming Deadlines</h3>
                <p className="text-xs text-slate-500">Next 7 days</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">
              {stats?.upcomingDeadlines?.length || 0}
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm text-slate-500">Loading deadlines...</p>
                </div>
              </div>
            ) : stats?.upcomingDeadlines?.length > 0 ? (
              stats.upcomingDeadlines.map((task) => {
                const dueDate = new Date(task.dueDate);
                const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <article 
                    key={task._id} 
                    className="group rounded-xl border border-slate-100 bg-gradient-to-r from-white to-slate-50/50 p-4 hover:border-primary-300 hover:shadow-md hover:from-primary-50/30 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">{task.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium">
                              {dueDate.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </span>
                          {task.assignee && (
                            <span className="flex items-center gap-1.5 text-slate-600">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-medium">{task.assignee.name}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${
                        daysUntilDue <= 1 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : daysUntilDue <= 3 
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {daysUntilDue === 0 ? 'Today' : daysUntilDue === 1 ? 'Tomorrow' : `${daysUntilDue}d`}
                      </span>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-500">No upcoming deadlines</p>
                <p className="text-xs text-slate-400 mt-1">All tasks are on schedule</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

