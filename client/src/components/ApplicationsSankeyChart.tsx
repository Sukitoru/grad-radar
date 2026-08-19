import {
  ResponsiveContainer,
  Sankey,
  Tooltip,
  Layer,
  Rectangle,
  useChartWidth,
  type SankeyNodeProps,
  type SankeyLinkProps,
} from 'recharts';
import type { Application } from '../api';
import './ApplicationsSankeyChart.css';


interface ApplicationsSankeyChartProps {
  applications: Application[];
}

const getNodeColor = (name: string = '') => {
  switch (name) {
    case 'Submitted':
      return '#4f8cff';
    case 'Pending':
      return '#94a3b8';
    case 'Reviewed':
      return '#8b7cf6';
    case 'Accepted':
      return '#22c55e';
    case 'Rejected':
      return '#fb7185';
    case 'Waitlisted':
      return '#fbbf24';
    default:
      return '#94a3b8';
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
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={getNodeColor(payload.name)}
      />

      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize={14}
        className="sankey-node-label"
      >
        {payload.name}
      </text>

      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 18}
        fontSize={12}
        className="sankey-node-count"
      >
        {payload.value ?? 0} applications
      </text>
    </Layer>
  );
}

function CustomSankeyLink({
  sourceX,
  sourceY,
  sourceControlX,
  targetX,
  targetY,
  targetControlX,
  linkWidth,
  payload,
}: SankeyLinkProps) {
  const linkColor = getNodeColor(payload.target.name);
  const isPendingLink = payload.target.name === 'Pending';
  const path = `M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`;

  return (
    <path
      d={path}
      fill="none"
      stroke={linkColor}
      strokeOpacity={isPendingLink ? 0.25 : 0.52}
      strokeWidth={Math.max(linkWidth, 4)}
      className="sankey-flow-link"
    />
  );
}

export default function ApplicationsSankeyChart({ applications }: ApplicationsSankeyChartProps) {
  const acceptedCount = applications.filter(
    (application: Application) => application.decision?.status === 'ACCEPTED',
  ).length;

  const rejectedCount = applications.filter(
    (application: Application) => application.decision?.status === 'REJECTED',
  ).length;

  const waitlistedCount = applications.filter(
    (application: Application) =>
      application.decision?.status === 'WAITLISTED',
  ).length;

  const pendingCount = applications.filter(
    (application: Application) =>
      (application.decision?.status ?? 'PENDING') === 'PENDING',
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
    },
    { 
        source: 0, 
        target: 2, 
        value: reviewedCount,
    },
    { 
        source: 2, 
        target: 3, 
        value: acceptedCount,
    },
    { 
        source: 2, 
        target: 4, 
        value: rejectedCount,
    },
    { 
        source: 2, 
        target: 5, 
        value: waitlistedCount,
    },
    ],
  };

  return (
    <div className="applications-sankey-chart">
      <ResponsiveContainer width="100%" height={340}>
        <Sankey
          data={sankeyData}
          nodePadding={22}
          nodeWidth={16}
          node={CustomSankeyNode}
          link={CustomSankeyLink}
          margin={{ top: 16, right: 160, bottom: 16, left: 12 }}
        >
          <Tooltip />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
}
