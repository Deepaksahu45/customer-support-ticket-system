// Aegis — Status badge component
import React from 'react';
import { statusColors } from '../utils/helpers';

const statusLabels = {
  open: 'Open',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const StatusBadge = ({ status }) => {
  const colors = statusColors[status] || statusColors.open;
  const label = statusLabels[status] || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {label}
    </span>
  );
};

export default StatusBadge;
