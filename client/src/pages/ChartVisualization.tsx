import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const filteredApplicationsQuery = {
  data: [] as Array<{
    gpa?: string | number;
    decision?: { status?: string };
  }>,
};

const filteredApplications = filteredApplicationsQuery.data ?? [];

const chartData = [
  {
    range: '3.0-3.25',
    accepted: 0,
    total: 0,
  },
  {
    range: '3.25-3.5',
    accepted: 0,
    total: 0,
  },
  {
    range: '3.5-3.75',
    accepted: 0,
    total: 0,
  },
  {
    range: '3.75-4.0',
    accepted: 0,
    total: 0,
  },
];

filteredApplications.forEach((application) => {
  const gpa = Number(application.gpa);
  const bucket =
    gpa >= 4 || gpa >= 3.75
      ? chartData[3]
      : gpa >= 3.5
        ? chartData[2]
        : gpa >= 3.25
          ? chartData[1]
          : chartData[0];

  bucket.total++;

  if (application.decision?.status === 'ACCEPTED') {
    bucket.accepted++;
  }
});

const lineData = chartData.map((bucket) => ({
  name: bucket.range,
  acceptanceRate:
    bucket.total > 0 ? Math.round((bucket.accepted / bucket.total) * 100) : 0,
}));

export default function Example() {
  return (
    <LineChart
      style={{
        width: '100%',
        maxWidth: '700px',
        height: '100%',
        maxHeight: '70vh',
        aspectRatio: 1.618,
      }}
      data={lineData}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" stroke="var(--color-text-3)" />
      <YAxis width={40} stroke="var(--color-text-3)" />
      <Tooltip
        cursor={{
          stroke: 'var(--color-border-2)',
        }}
        contentStyle={{
          backgroundColor: 'var(--color-surface-raised)',
          borderColor: 'var(--color-border-2)',
        }}
      />
      <Legend />
      <Line
        type="monotone"
        dataKey="acceptanceRate"
        stroke="#3880ff"
        dot={{
          fill: 'var(--color-surface-base)',
        }}
        activeDot={{ r: 8, stroke: 'var(--color-surface-base)' }}
      />
    </LineChart>
  );
}