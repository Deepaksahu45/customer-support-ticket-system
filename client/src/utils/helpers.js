// Aegis — Utility/helper functions

// Format date to readable string
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format date with time
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format relative time (e.g. "2 hours ago")
export const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Status color mapping
export const statusColors = {
  open: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  'in-progress': { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400' },
  resolved: { bg: 'bg-green-500/15', text: 'text-green-400', dot: 'bg-green-400' },
  closed: { bg: 'bg-gray-500/15', text: 'text-gray-400', dot: 'bg-gray-400' },
};

// Priority color mapping
export const priorityColors = {
  low: { bg: 'bg-green-500/15', text: 'text-green-400', dot: 'bg-green-400' },
  medium: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  high: { bg: 'bg-orange-500/15', text: 'text-orange-400', dot: 'bg-orange-400' },
  urgent: { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
};

// Category labels
export const categoryLabels = {
  billing: 'Billing',
  technical: 'Technical',
  general: 'General',
  other: 'Other',
};

// Cn utility for conditional classnames
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
