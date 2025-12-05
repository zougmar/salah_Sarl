import { ResponsiveContainer, Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';

export const TasksPerEmployeeChart = ({ data = [] }) => {
  const formatted = data
    .filter((item) => item.name)
    .map((item) => ({
      name: item.name || 'Unassigned',
      count: item.count
    }));

  if (!formatted.length) {
    return <p className="text-sm text-slate-500">No assignments yet</p>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formatted}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#cf6c1a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

