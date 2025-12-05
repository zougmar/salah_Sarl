import { StatusBadge } from './StatusBadge';
import { User, Calendar, AlertCircle } from 'lucide-react';

const priorityColors = {
  low: 'text-blue-600 bg-blue-50',
  medium: 'text-yellow-600 bg-yellow-50',
  high: 'text-red-600 bg-red-50',
};

export const TaskTable = ({ tasks = [], onSelect }) => (
  <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-card">
    <table className="min-w-full divide-y divide-slate-100">
      <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50">
        <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
          <th className="px-6 py-4">Task</th>
          <th className="px-6 py-4">Assignee</th>
          <th className="px-6 py-4">Priority</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4">Due Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-sm bg-white">
        {tasks.map((task) => {
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
          return (
            <tr
              key={task._id}
              className="hover:bg-primary-50/30 cursor-pointer transition-colors group"
              onClick={() => onSelect?.(task)}
            >
              <td className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 group-hover:text-primary-600 transition">
                      {task.title}
                    </p>
                    {task.project && (
                      <p className="text-xs text-slate-500 mt-0.5">{task.project}</p>
                    )}
                  </div>
                  {isOverdue && (
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{task.assignee?.name || 'Unassigned'}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                  priorityColors[task.priority?.toLowerCase()] || 'text-slate-600 bg-slate-100'
                }`}>
                  {task.priority || 'Normal'}
                </span>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-6 py-4">
                {task.dueDate ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className={`text-slate-600 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                      {new Date(task.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

