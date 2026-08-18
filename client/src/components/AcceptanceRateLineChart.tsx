import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Application } from '../api';
import './AcceptanceRateLineChart.css';

const gpaRanges = [
  { name: 'Below 3.00', minimum: 0, maximum: 2.99 },
  { name: '3.00–3.49', minimum: 3, maximum: 3.49 },
  { name: '3.50–3.74', minimum: 3.5, maximum: 3.74 },
  { name: '3.75–4.00', minimum: 3.75, maximum: 4 },
];

interface AcceptanceRateLineChartProps {
  applications: Application[];
}

const AcceptanceRateLineChart: React.FC<AcceptanceRateLineChartProps> = ({
  applications,
}) => {
  const lineData = gpaRanges.map((range) => {
    const rangeApplications = applications.filter((application) => {
      const gpa = Number(application.gpa);
      return gpa >= range.minimum && gpa <= range.maximum;
    });

    const acceptedApplications = rangeApplications.filter(
      (application) => application.decision?.status === 'ACCEPTED',
    ).length;

    const waitlistedApplications = rangeApplications.filter(
      (application) => application.decision?.status === 'WAITLISTED',
    ).length; 

    const rejectedApplications = rangeApplications.filter(
      (application) => application.decision?.status === 'REJECTED',
    ).length;

    const pendingApplications = rangeApplications.filter(
      (application) => !application.decision?.status,
    ).length;

    return {
      name: range.name,
      acceptanceRate:
        rangeApplications.length === 0
          ? 0
          : Math.round((acceptedApplications / rangeApplications.length) * 100),
      waitlistRate:
        rangeApplications.length === 0
          ? 0
          : Math.round((waitlistedApplications / rangeApplications.length) * 100),
      rejectionRate:
        rangeApplications.length === 0
          ? 0
          : Math.round((rejectedApplications / rangeApplications.length) * 100),
      pendingRate:
        rangeApplications.length === 0
          ? 0
          : Math.round((pendingApplications / rangeApplications.length) * 100),
    };
  });

  if (applications.length === 0) {
    return <p className="acceptance-rate-empty">No GPA data yet.</p>;
  }

  return (
    <div className="acceptance-rate-line-chart">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={lineData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid
            stroke="var(--ion-color-step-150)"
            strokeDasharray="3 3"
          />
          <XAxis dataKey="name" stroke="var(--ion-color-medium)" />
          <YAxis
            domain={[0, 100]}
            stroke="var(--ion-color-medium)"
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value, name) => [`${value}%`, name]}
            contentStyle={{
              backgroundColor: 'var(--ion-card-background)',
              borderColor: 'var(--ion-color-step-200)',
              color: 'var(--ion-text-color)',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="acceptanceRate"
            name="Acceptance Rate"
            stroke="var(--ion-color-success)"
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--ion-color-success)' }}
            activeDot={{ r: 7 }}
          />
          
          <Line
            type="monotone"
            dataKey="waitlistRate"
            name="Waitlist Rate"
            stroke="var(--ion-color-warning)"
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--ion-color-warning)' }}
            activeDot={{ r: 7 }}
          />
          
          <Line
            type="monotone"
            dataKey="rejectionRate"
            name="Rejection Rate"
            stroke="var(--ion-color-danger)"
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--ion-color-danger)' }}
            activeDot={{ r: 7 }}
          />
          
          <Line
            type="monotone"
            dataKey="pendingRate"
            name="Pending Rate"
            stroke="var(--ion-color-medium)"
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--ion-color-medium)' }}
            activeDot={{ r: 7 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AcceptanceRateLineChart;
