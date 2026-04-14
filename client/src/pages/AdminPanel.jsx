// Aegis — Admin panel page
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Ticket,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  Shield,
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import StatsCard from '../components/StatsCard';
import TicketTable from '../components/TicketTable';
import StatusBadge from '../components/StatusBadge';
import { getInitials, formatDate } from '../utils/helpers';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'tickets', label: 'All Tickets', icon: Ticket },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, ticketsRes] = await Promise.all([
        axiosInstance.get('/admin/stats'),
        axiosInstance.get('/admin/users'),
        axiosInstance.get('/tickets?limit=50'),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setTickets(ticketsRes.data.data.tickets);
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosInstance.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error('Role update error:', err);
    }
  };

  const handleAssign = async (ticketId, agentId) => {
    try {
      const res = await axiosInstance.patch(`/tickets/${ticketId}/assign`, { agentId });
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? res.data.data : t))
      );
    } catch (err) {
      console.error('Assign error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-2 border-aegis-green/30 border-t-aegis-green rounded-full animate-spin" />
      </div>
    );
  }

  const statsCards = stats
    ? [
        { icon: Ticket, label: 'Total Tickets', value: stats.totalTickets, color: 'blue' },
        { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'purple' },
        { icon: Clock, label: 'Open Tickets', value: stats.openTickets, color: 'yellow' },
        { icon: CheckCircle2, label: 'Resolved', value: stats.resolvedTickets, color: 'green' },
        { icon: AlertTriangle, label: 'Urgent', value: stats.urgentTickets, color: 'red' },
        { icon: MessageSquare, label: 'Total Messages', value: stats.totalMessages, color: 'blue' },
      ]
    : [];

  const agents = users.filter((u) => u.role === 'agent');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-brand font-bold text-aegis-text flex items-center gap-3">
          <Shield className="text-aegis-green" size={28} />
          <span className="text-aegis-green">Aegis</span> Control Center
        </h1>
        <p className="text-aegis-muted font-body mt-1">
          Manage users, tickets, and system analytics
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass-card w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-aegis-green text-aegis-dark'
                  : 'text-aegis-muted hover:text-aegis-text hover:bg-aegis-dark/50'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsCards.map((card, i) => (
              <StatsCard key={i} {...card} />
            ))}
          </div>

          {/* Category + Priority distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-6">
              <h3 className="text-lg font-brand font-semibold text-aegis-text mb-4">
                By Category
              </h3>
              <div className="space-y-3">
                {(stats?.categoryStats || []).map((cat) => {
                  const total = stats.totalTickets || 1;
                  const pct = Math.round((cat.count / total) * 100);
                  return (
                    <div key={cat._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-aegis-text capitalize">{cat._id}</span>
                        <span className="text-aegis-muted">{cat.count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-aegis-dark/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full bg-aegis-green rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-brand font-semibold text-aegis-text mb-4">
                By Priority
              </h3>
              <div className="space-y-3">
                {(stats?.priorityStats || []).map((pri) => {
                  const total = stats.totalTickets || 1;
                  const pct = Math.round((pri.count / total) * 100);
                  const colorMap = {
                    low: 'bg-green-400',
                    medium: 'bg-yellow-400',
                    high: 'bg-orange-400',
                    urgent: 'bg-red-400',
                  };
                  return (
                    <div key={pri._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-aegis-text capitalize">{pri._id}</span>
                        <span className="text-aegis-muted">{pri.count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-aegis-dark/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className={`h-full ${colorMap[pri._id] || 'bg-aegis-green'} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-aegis-border/50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase tracking-wider">Joined</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-aegis-border/20 hover:bg-aegis-surface/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-aegis-green/15 flex items-center justify-center">
                            <span className="text-xs font-bold text-aegis-green">
                              {getInitials(u.name)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-aegis-text">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-aegis-muted">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          u.role === 'admin'
                            ? 'bg-purple-500/15 text-purple-400'
                            : u.role === 'agent'
                            ? 'bg-blue-500/15 text-blue-400'
                            : 'bg-green-500/15 text-green-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs ${u.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-aegis-muted">{formatDate(u.createdAt)}</td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="aegis-input w-auto text-xs py-1.5 px-2 appearance-none cursor-pointer"
                        >
                          <option value="customer">Customer</option>
                          <option value="agent">Agent</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* All Tickets Tab */}
      {activeTab === 'tickets' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Assign controls */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-aegis-border/50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase">Ticket</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase">Title</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase">Priority</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase">Created By</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-aegis-muted uppercase">Assign To</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t, i) => (
                    <motion.tr
                      key={t._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-aegis-border/20 hover:bg-aegis-surface/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-aegis-green">{t.ticketId}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-aegis-text max-w-[200px] truncate">{t.title}</td>
                      <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-aegis-muted capitalize">{t.priority}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-aegis-muted">{t.createdBy?.name}</td>
                      <td className="px-6 py-4">
                        <select
                          value={t.assignedTo?._id || ''}
                          onChange={(e) => handleAssign(t._id, e.target.value)}
                          className="aegis-input w-auto text-xs py-1.5 px-2 appearance-none cursor-pointer"
                        >
                          <option value="">Unassigned</option>
                          {agents.map((a) => (
                            <option key={a._id} value={a._id}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminPanel;
