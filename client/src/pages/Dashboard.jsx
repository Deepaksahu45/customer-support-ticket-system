// Aegis — Dashboard page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Users, CheckCircle2, AlertTriangle, Plus, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import StatsCard from '../components/StatsCard';
import TicketTable from '../components/TicketTable';
import CreateTicketModal from '../components/CreateTicketModal';

const Dashboard = () => {
  const { user, isAdmin, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ticketRes = await axiosInstance.get('/tickets?limit=5');
      setTickets(ticketRes.data.data.tickets);

      if (isAdmin()) {
        const statsRes = await axiosInstance.get('/admin/stats');
        setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = isAdmin() && stats
    ? [
        { icon: Ticket, label: 'Total Tickets', value: stats.totalTickets, color: 'blue' },
        { icon: Clock, label: 'Open Tickets', value: stats.openTickets, color: 'yellow' },
        { icon: CheckCircle2, label: 'Resolved', value: stats.resolvedTickets, color: 'green' },
        { icon: AlertTriangle, label: 'Urgent', value: stats.urgentTickets, color: 'red' },
      ]
    : [
        { icon: Ticket, label: 'My Tickets', value: tickets.length, color: 'blue' },
        { icon: Clock, label: 'Open', value: tickets.filter((t) => t.status === 'open').length, color: 'yellow' },
        { icon: CheckCircle2, label: 'Resolved', value: tickets.filter((t) => t.status === 'resolved').length, color: 'green' },
        { icon: AlertTriangle, label: 'Urgent', value: tickets.filter((t) => t.priority === 'urgent').length, color: 'red' },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-brand font-bold text-aegis-text">
            Welcome to <span className="text-aegis-green">Aegis</span>
          </h1>
          <p className="text-aegis-muted font-body mt-1">
            {isAdmin()
              ? 'Here is your system overview'
              : `Hello ${user?.name}, here are your support tickets`}
          </p>
        </div>
        {isCustomer() && (
          <button onClick={() => setShowCreate(true)} className="aegis-btn flex items-center gap-2">
            <Plus size={16} />
            Raise a Ticket
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {statsCards.map((card, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <StatsCard {...card} />
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Tickets Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-brand font-semibold text-aegis-text">
            Recent Tickets
          </h2>
          <button
            onClick={() => navigate('/tickets')}
            className="text-sm text-aegis-green hover:text-aegis-green/80 font-medium transition-colors"
          >
            View all →
          </button>
        </div>
        {loading ? (
          <div className="glass-card p-12 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-aegis-green/30 border-t-aegis-green rounded-full animate-spin" />
          </div>
        ) : (
          <TicketTable tickets={tickets} showAssigned={isAdmin()} />
        )}
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(newTicket) => {
          setTickets((prev) => [newTicket, ...prev]);
        }}
      />
    </motion.div>
  );
};

export default Dashboard;
