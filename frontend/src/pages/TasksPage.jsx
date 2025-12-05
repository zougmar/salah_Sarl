import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { TaskAPI } from '../services/api';
import { TaskTable } from '../components/shared/TaskTable';
import { Modal } from '../components/shared/Modal';
import { TaskForm } from '../components/shared/TaskForm';
import { StatusBadge } from '../components/shared/StatusBadge';
import { Plus, ClipboardList, Filter, Calendar, User, AlertCircle } from 'lucide-react';
import { RequirePermission } from '../components/shared/RequirePermission';
import { PERMISSIONS } from '../constants/rbac';

export const TasksPage = ({ addMode = false }) => {
  const { user } = useAuth();
  const { tasks, fetchTasks, refreshMyTasks } = useTasks();
  const [createOpen, setCreateOpen] = useState(addMode);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchTasks();
    } else {
      refreshMyTasks();
    }
  }, [user, fetchTasks, refreshMyTasks]);

  const handleCreate = async (payload) => {
    try {
      await TaskAPI.create(payload);
      toast.success('Task created successfully');
      setCreateOpen(false);
      // Refresh tasks based on user role
      if (user?.role === 'admin') {
        fetchTasks();
      } else {
        refreshMyTasks();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateStatus = async (task, status) => {
    try {
      await TaskAPI.update(task._id, { status });
      toast.success('Task status updated');
      if (user.role === 'admin') {
        fetchTasks();
      } else {
        refreshMyTasks();
      }
      setSelectedTask({ ...task, status });
    } catch (error) {
      console.error('Error updating task status:', error);
      const errorMessage = error.response?.data?.message || 'Unable to update task status';
      toast.error(errorMessage);
    }
  };

  const filteredTasks = statusFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === statusFilter);

  const taskStats = {
    total: tasks.length,
    open: tasks.filter(t => t.status === 'open').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
          <p className="mt-1 text-slate-600">
            {user?.role === 'admin'
              ? 'Create, assign, and monitor every deliverable'
              : 'Tasks currently assigned to you'}
          </p>
        </div>
        <RequirePermission permission={PERMISSIONS.CREATE_TASKS}>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-500 hover:shadow-xl hover:shadow-primary-500/30 transition"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </RequirePermission>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-4 shadow-card border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{taskStats.total}</p>
            </div>
            <ClipboardList className="w-8 h-8 text-slate-400" />
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-card border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Open</p>
              <p className="text-2xl font-bold text-slate-600 mt-1">{taskStats.open}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-card border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{taskStats.inProgress}</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-card border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{taskStats.completed}</p>
            </div>
            <ClipboardList className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-5 h-5 text-slate-500" />
        <div className="flex gap-2 flex-wrap">
          {['all', 'open', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === status
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {status === 'all' ? 'All Tasks' : status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Table */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 shadow-card border border-slate-100 text-center">
          <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No tasks found</h3>
          <p className="text-slate-500">
            {statusFilter === 'all' 
              ? 'Get started by creating your first task' 
              : `No tasks with status "${statusFilter}"`}
          </p>
        </div>
      ) : (
        <TaskTable tasks={filteredTasks} onSelect={(task) => setSelectedTask(task)} />
      )}

      {/* Task Details Panel */}
      {selectedTask && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedTask.title}</h3>
              <p className="text-slate-600 mb-4">{selectedTask.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">
                    {selectedTask.assignee?.name || 'Unassigned'}
                  </span>
                </div>
                {selectedTask.dueDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">
                      {new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Priority:</span>
                  <span className="capitalize font-medium text-slate-700">
                    {selectedTask.priority || 'Normal'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedTask(null)}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              ×
            </button>
          </div>
          
          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {['open', 'in-progress', 'completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedTask, status)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                        selectedTask.status === status
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {status.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-1">Current Status</p>
                <StatusBadge status={selectedTask.status} />
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal title="Create New Task" open={createOpen} onClose={() => setCreateOpen(false)}>
        <TaskForm onSubmit={handleCreate} />
      </Modal>
    </div>
  );
};

