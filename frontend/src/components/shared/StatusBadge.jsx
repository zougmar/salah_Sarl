const statusStyles = {
  open: 'bg-slate-100 text-slate-700 border border-slate-200',
  'in-progress': 'bg-amber-50 text-amber-700 border border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
};

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[status] || statusStyles.open}`}>
    {status.replace('-', ' ')}
  </span>
);

