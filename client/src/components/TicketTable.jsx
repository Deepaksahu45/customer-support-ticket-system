// Aegis — Ticket table component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { formatDate, getInitials } from '../utils/helpers';

const TicketTable = ({ tickets = [], showAssigned = false }) => {
  const navigate = useNavigate();

  if (tickets.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-aegis-green/10 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-aegis-green">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
        </div>
        <p className="text-aegis-muted font-body">No tickets found</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-aegis-border/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase tracking-wider">Ticket</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase tracking-wider">Title</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase tracking-wider">Priority</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase tracking-wider">Created By</th>
              {showAssigned && (
                <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase tracking-wider">Assigned</th>
              )}
              <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <motion.tr
                key={ticket._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/tickets/${ticket._id}`)}
                className="border-b border-aegis-border/20 hover:bg-aegis-surface/50 cursor-pointer transition-colors group"
              >
                <td className="px-6 py-4">
                  <span className="text-xs font-mono text-aegis-green">{ticket.ticketId}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-aegis-text group-hover:text-aegis-green transition-colors line-clamp-1">
                    {ticket.title}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-4">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-500/15 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-indigo-400">
                        {getInitials(ticket.createdBy?.name)}
                      </span>
                    </div>
                    <span className="text-sm text-aegis-muted hidden lg:inline">
                      {ticket.createdBy?.name}
                    </span>
                  </div>
                </td>
                {showAssigned && (
                  <td className="px-6 py-4">
                    {ticket.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-aegis-green/15 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-aegis-green">
                            {getInitials(ticket.assignedTo?.name)}
                          </span>
                        </div>
                        <span className="text-sm text-aegis-muted hidden lg:inline">
                          {ticket.assignedTo?.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-aegis-muted italic">Unassigned</span>
                    )}
                  </td>
                )}
                <td className="px-6 py-4">
                  <span className="text-xs text-aegis-muted">{formatDate(ticket.createdAt)}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;
