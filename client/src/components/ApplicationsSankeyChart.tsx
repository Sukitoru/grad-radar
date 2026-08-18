import {
  ResponsiveContainer,
  Sankey,
  Tooltip,
  useChartWidth,
  Layer,
  Rectangle,
  SankeyNodeProps,
} from 'recharts';
import type { Application } from '../api';
import AcceptanceRateLineChart from './AcceptanceRateLineChart';
import DecisionPieChart from './DecisionPieChart';
import ApplicationSankeyChart from './AcceptanceRateLineChart';


interface ApplicationsSankeyChartProps {
  applications: Application[];
}

const getNodeColor = (name: string = '') => {
  switch (name) {
    case 'Submitted':
      return 'var(--ion-color-primary)';
    case 'Pending':
      return 'var(--ion-color-medium)';
    case 'Reviewed':
      return 'var(--ion-color-tertiary)';
    case 'Accepted':
      return 'var(--ion-color-success)';
    case 'Rejected':
      return 'var(--ion-color-danger)';
    case 'Waitlisted':
      return 'var(--ion-color-warning)';
    default:
      return 'var(--ion-color-medium)';
  }
};

function CustomSankeyNode({
  x,
  y,
  width,
  height,
  index,
  payload,
}: SankeyNodeProps) {
  const containerWidth = useChartWidth();

  if (containerWidth == null) {
    return null;
  }

  const isOut = x + width + 6 > containerWidth;

  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle x={x} y={y} width={width} height={height} fill= {getNodeColor(payload.name)} />

      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize={14}
        fill="#333"
      >
        {payload.name}
      </text>

      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 18}
        fontSize={12}
        fill="#666"
      >
        {payload.value ?? 0} applications
      </text>
    </Layer>
  );
}

export default function ApplicationsSankeyChart({ applications }: ApplicationsSankeyChartProps) {
  const acceptedCount = applications.filter(
    (application: Application) => application.decision?.status === 'ACCEPTED',
  ).length;

  const rejectedCount = applications.filter(
    (a: Application) => 
        a.decision?.status === 'REJECTED').length;

  const waitlistedCount = applications.filter(
    (a: Application) => a
    .decision?.status === 'WAITLISTED'
).length;

  const pendingCount = applications.filter(
    (a: Application) => 
        (a.decision?.status ?? 'PENDING') === 'PENDING',
  ).length;

  const reviewedCount = acceptedCount + rejectedCount + waitlistedCount;

  const sankeyData = {
    nodes: [
      { 
        name: 'Submitted' 
    },
    { 
        name: 'Pending' 
    },
    { 
        name: 'Reviewed' 
    },
    { 
        name: 'Accepted' 
    },
    { 
        name: 'Rejected' 
    },
    { 
        name: 'Waitlisted' 
    },
    ],
    links: [
      { 
        source: 0, 
        target: 1, 
        value: pendingCount, 
        fill: 'var(--ion-color-medium)',
    },
    { 
        source: 0, 
        target: 2, 
        value: reviewedCount,
        fill: 'var(--ion-color-tertiary)',
    },
    { 
        source: 2, 
        target: 3, 
        value: acceptedCount,
        fill: 'var(--ion-color-success)',
    },
    { 
        source: 2, 
        target: 4, 
        value: rejectedCount,
        fill: 'var(--ion-color-danger)',
    },
    { 
        source: 2, 
        target: 5, 
        value: waitlistedCount,
        fill: 'var(--ion-color-warning)',
    },
    ],
  };

  const getNodeColor = (name: string = '') => {
    switch (name) {
      case 'Submitted':
        return 'var(--ion-color-primary)';
      case 'Pending':
        return 'var(--ion-color-medium)';
      case 'Reviewed':
        return 'var(--ion-color-tertiary)';
      case 'Accepted':
        return 'var(--ion-color-success)';
      case 'Rejected':
        return 'var(--ion-color-danger)';
      case 'Waitlisted':
        return 'var(--ion-color-warning)';
      default:
        return 'var(--ion-color-medium)';
    }
  };

  return (
    <div className = "applications-sankey-chart">
        <ResponsiveContainer width="100%" height={360}>
          <Sankey
            data={sankeyData}
            nodePadding={24}
            node={CustomSankeyNode}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Tooltip />
          </Sankey>
        </ResponsiveContainer>
    </div>
    
  ); 
}
