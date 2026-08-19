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
import './AcceptanceRateByAwardsChart.css';

interface AcceptanceRateByAwardsChartProps {
  applications: Application[];
}

const getAwardRange = (awardCount: number) => {
  if (awardCount === 0) return '0 awards';
  if (awardCount === 1) return '1 award';
  if (awardCount === 2) return '2 awards';
  return '3+ awards';
};

const AcceptanceRateByAwardsChart: React.FC<AcceptanceRateByAwardsChartProps> = ({
  applications,
}) => {
  const awardRanges = ['0 awards', '1 award', '2 awards', '3+ awards'];
  const chartData = awardRanges.map((awardRange) => {
    const matchingApplications = applications.filter(
      (application) => getAwardRange(application.awards.length) === awardRange,
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
      awardRange,
      acceptedRate: getRate('ACCEPTED'),
      rejectedRate: getRate('REJECTED'),
      waitlistedRate: getRate('WAITLISTED'),
      applicationCount: matchingApplications.length,
    };
  });

  if (chartData.every((range) => range.applicationCount === 0)) {
    return <p className="acceptance-awards-empty">No award data yet.</p>;
  }

  return (
    <div
      className="acceptance-awards-chart"
      aria-label="Decision rates by award count"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 12, right: 12, bottom: 12, left: 4 }}>
          <CartesianGrid stroke="#64748b" strokeDasharray="3 3" opacity={0.25} />
          <XAxis
            dataKey="awardRange"
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
          <Bar dataKey="acceptedRate" name="Accepted" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="rejectedRate" name="Rejected" fill="#fb7185" radius={[4, 4, 0, 0]} />
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

export default AcceptanceRateByAwardsChart;
