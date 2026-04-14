// Aegis — Ticket list page
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import TicketTable from '../components/TicketTable';
import CreateTicketModal from '../components/CreateTicketModal';

const TicketList = () => {
  const { isAdmin, isCustomer } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchTickets();
  }, [pagination.page, filters]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pagination.page);
      params.append('limit', '10');
      if (search) params.append('search', search);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.category) params.append('category', filters.category);

      const res = await axiosInstance.get(`/tickets?${params.toString()}`);
      setTickets(res.data.data.tickets);
      setPagination((prev) => ({ ...prev, ...res.data.data.pagination }));
    } catch (err) {
      console.error('Ticket fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchTickets();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-brand font-bold text-aegis-text">
            <span className="text-aegis-green">Aegis</span> Tickets
          </h1>
          <p className="text-aegis-muted font-body mt-1">
            {pagination.total} ticket{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        {isCustomer() && (
          <button onClick={() => setShowCreate(true)} className="aegis-btn flex items-center gap-2">
            <Plus size={16} />
            New Ticket
          </button>
        )}
      </div>

      {/* Search + Filters Bar */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aegis-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets by title or ID..."
              className="aegis-input pl-11"
            />
          </form>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="aegis-input w-auto min-w-[120px] appearance-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="aegis-input w-auto min-w-[120px] appearance-none cursor-pointer"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="aegis-input w-auto min-w-[120px] appearance-none cursor-pointer"
            >
              <option value="">All Category</option>
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="other">Other</option>
            </select>

            {(filters.status || filters.priority || filters.category) && (
              <button
                onClick={() => setFilters({ status: '', priority: '', category: '' })}
                className="px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="glass-card p-12 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-aegis-green/30 border-t-aegis-green rounded-full animate-spin" />
        </div>
      ) : (
        <TicketTable tickets={tickets} showAssigned={isAdmin()} />
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
            disabled={pagination.page === 1}
            className="aegis-btn-outline p-2 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setPagination((p) => ({ ...p, page }))}
              className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                page === pagination.page
                  ? 'bg-aegis-green text-aegis-dark'
                  : 'text-aegis-muted hover:bg-aegis-surface'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setPagination((p) => ({ ...p, page: Math.min(p.pages, p.page + 1) }))}
            disabled={pagination.page === pagination.pages}
            className="aegis-btn-outline p-2 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(newTicket) => {
          setTickets((prev) => [newTicket, ...prev]);
          setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
        }}
      />
    </motion.div>
  );
};

export default TicketList;
