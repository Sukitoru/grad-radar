import { useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import type { PieSectorDataItem } from 'recharts';
import type { Application } from '../api';
import './DecisionPieChart.css';

const decisionOptions = [
  { key: 'ACCEPTED', name: 'Accepted', color: '#34d399' },
  { key: 'REJECTED', name: 'Rejected', color: '#fb7185' },
  { key: 'WAITLISTED', name: 'Waitlisted', color: '#fbbf24' },
  { key: 'PENDING', name: 'Pending', color: '#94a3b8' },
] as const;

interface DecisionPieChartProps {
  applications: Application[];
}

const renderActiveShape = (shape: PieSectorDataItem) => (
  <Sector
    {...shape}
    outerRadius={Number(shape.outerRadius) + 8}
    cornerRadius={10}
  />
);

const DecisionPieChart: React.FC<DecisionPieChartProps> = ({ applications }) => {
  const [activeDecisionIndex, setActiveDecisionIndex] = useState<number | null>(
    null,
  );

  const decisionData = decisionOptions.map((decision) => ({
    name: decision.name,
    value: applications.filter(
      (application) => (application.decision?.status ?? 'PENDING') === decision.key,
    ).length,
    color: decision.color,
  }));

  if (applications.length === 0) {
    return <p className="decision-pie-empty">No decision data yet.</p>;
  }

  const activeDecision =
    activeDecisionIndex === null ? null : decisionData[activeDecisionIndex];

  return (
    <div
      className="decision-pie-chart"
      aria-label="Overall application decisions"
    >
      <div className="decision-pie-center" aria-hidden="true">
        <strong>{applications.length}</strong>
        <span>Total applications</span>
      </div>
      {activeDecision && (
        <div className="decision-pie-hover-detail" aria-live="polite">
          <strong>{activeDecision.name}</strong>
          <span>{activeDecision.value} applications</span>
        </div>
      )}
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={decisionData}
            dataKey="value"
            nameKey="name"
            innerRadius="48%"
            outerRadius="74%"
            paddingAngle={3}
            cornerRadius={7}
            activeShape={renderActiveShape}
            animationDuration={700}
            onMouseEnter={(_, index) => setActiveDecisionIndex(index)}
            onMouseLeave={() => setActiveDecisionIndex(null)}
          >
            {decisionData.map((decision) => (
              <Cell key={decision.name} fill={decision.color} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={28}
            iconType="circle"
            wrapperStyle={{ color: 'var(--ion-text-color)', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DecisionPieChart;
