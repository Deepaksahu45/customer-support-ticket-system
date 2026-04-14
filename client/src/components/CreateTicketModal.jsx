// Aegis — Create ticket modal component
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, AlertCircle } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const CreateTicketModal = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post('/tickets', form);
      onCreated(res.data.data);
      setForm({ title: '', description: '', priority: 'medium', category: 'general' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-brand font-bold text-aegis-text">
                  Create New Ticket
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-aegis-dark/50 transition-colors"
                >
                  <X size={18} className="text-aegis-muted" />
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-400" />
                  <span className="text-sm text-red-400">{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-aegis-muted mb-1.5">Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Brief summary of the issue"
                    className="aegis-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-aegis-muted mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your issue in detail..."
                    rows={4}
                    className="aegis-input resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-aegis-muted mb-1.5">Priority</label>
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="aegis-input appearance-none cursor-pointer"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-aegis-muted mb-1.5">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="aegis-input appearance-none cursor-pointer"
                    >
                      <option value="general">General</option>
                      <option value="technical">Technical</option>
                      <option value="billing">Billing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="aegis-btn-outline flex-1">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="aegis-btn flex-1 flex items-center justify-center gap-2">
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-aegis-dark/30 border-t-aegis-dark rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus size={16} />
                        Create Ticket
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateTicketModal;
