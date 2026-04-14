// Aegis — Priority badge component
import React from 'react';
import { priorityColors } from '../utils/helpers';

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

const PriorityBadge = ({ priority }) => {
  const colors = priorityColors[priority] || priorityColors.medium;
  const label = priorityLabels[priority] || priority;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {label}
    </span>
  );
};

export default PriorityBadge;
