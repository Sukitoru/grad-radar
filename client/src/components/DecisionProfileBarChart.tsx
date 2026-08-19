import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Application } from '../api';
import './DecisionProfileBarChart.css';

interface DecisionProfileBarChartProps {
  applications: Application[];
}

const getPublicationRange = (publicationCount: number) => {
  if (publicationCount === 0) return '0 publications';
  if (publicationCount <= 2) return '1–2 publications';
  if (publicationCount <= 5) return '3–5 publications';
  return '6+ publications';
};

const DecisionProfileBarChart: React.FC<DecisionProfileBarChartProps> = ({
  applications,
}) => {
  const publicationRanges = [
    '0 publications',
    '1–2 publications',
    '3–5 publications',
    '6+ publications',
  ];
  const decisionData = publicationRanges.map((publicationRange) => {
    const matchingApplications = applications.filter(
      (application) =>
        getPublicationRange(application.publications) === publicationRange,
    );
    const decidedApplications = matchingApplications.filter((application) =>
      ['ACCEPTED', 'REJECTED', 'WAITLISTED'].includes(
        application.decision?.status ?? '',
      ),
    );
    const getRate = (status: string) =>
      decidedApplications.length === 0
        ? 0
        : Number(
            ((decidedApplications.filter(
              (application) => application.decision?.status === status,
            ).length /
              decidedApplications.length) *
              100).toFixed(1),
          );

    return {
      publicationRange,
      acceptedRate: getRate('ACCEPTED'),
      rejectedRate: getRate('REJECTED'),
      waitlistedRate: getRate('WAITLISTED'),
      applicationCount: matchingApplications.length,
    };
  });

  if (decisionData.every((group) => group.applicationCount === 0)) {
    return <p className="decision-profile-empty">No publication data yet.</p>;
  }

  return (
    <div className="decision-profile-bar-chart" aria-label="Decision rates by publication count">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={decisionData} margin={{ top: 12, right: 12, bottom: 12, left: 4 }}>
          <CartesianGrid stroke="#64748b" strokeDasharray="3 3" opacity={0.25} />
          <XAxis
            dataKey="publicationRange"
            stroke="var(--ion-text-color)"
            tick={{ fill: 'var(--ion-text-color)', fontSize: 12 }}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            stroke="var(--ion-text-color)"
            tick={{ fill: 'var(--ion-text-color)', fontSize: 12 }}
          />
          <Tooltip
            formatter={(value, name) => [`${value}%`, name]}
            labelFormatter={(label, payload) => {
              const range = payload[0]?.payload;
              return `${label} (${range?.applicationCount ?? 0} applications)`;
            }}
            contentStyle={{
              backgroundColor: 'var(--ion-card-background)',
              borderColor: 'var(--ion-color-step-200)',
              color: 'var(--ion-text-color)',
            }}
          />
          <Legend verticalAlign="bottom" height={28} iconType="rect" />
          <Bar
            dataKey="acceptedRate"
            name="Accepted"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="rejectedRate"
            name="Rejected"
            fill="#fb7185"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="waitlistedRate"
            name="Waitlisted"
            fill="#fbbf24"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DecisionProfileBarChart;
