// Aegis — Ticket detail page with real-time chat
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Clock, Tag, User as UserIcon, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useSocket from '../hooks/useSocket';
import axiosInstance from '../api/axiosInstance';
import MessageBubble from '../components/MessageBubble';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { formatDate, formatDateTime, getInitials, categoryLabels } from '../utils/helpers';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isAgent } = useAuth();
  const socket = useSocket();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchTicketData();
  }, [id]);

  // Socket events
  useEffect(() => {
    if (!socket || !ticket) return;

    socket.emit('join_ticket', { ticketId: ticket._id });

    socket.on('receive_message', (msg) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on('user_typing', ({ userName }) => {
      setTypingUser(userName);
    });

    socket.on('user_stop_typing', () => {
      setTypingUser('');
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [socket, ticket]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const fetchTicketData = async () => {
    try {
      const [ticketRes, messagesRes] = await Promise.all([
        axiosInstance.get(`/tickets/${id}`),
        axiosInstance.get(`/messages/${id}`),
      ]);
      setTicket(ticketRes.data.data);
      setMessages(messagesRes.data.data);
    } catch (err) {
      console.error('Ticket detail fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      // Send via socket for real-time
      if (socket) {
        socket.emit('send_message', {
          ticketId: ticket._id,
          content: newMessage,
          senderId: user.id,
        });
        socket.emit('stop_typing', { ticketId: ticket._id });
      } else {
        // Fallback to HTTP
        const res = await axiosInstance.post(`/messages/${ticket._id}`, {
          content: newMessage,
        });
        setMessages((prev) => [...prev, res.data.data]);
      }
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (socket && ticket) {
      socket.emit('typing', { ticketId: ticket._id, userName: user.name });

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { ticketId: ticket._id });
      }, 2000);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const res = await axiosInstance.patch(`/tickets/${id}/status`, { status });
      setTicket(res.data.data);
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-2 border-aegis-green/30 border-t-aegis-green rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <p className="text-aegis-muted text-lg">Ticket not found</p>
        <button onClick={() => navigate('/tickets')} className="aegis-btn mt-4">
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[calc(100vh-8rem)]"
    >
      {/* Back button + Title */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate('/tickets')}
          className="p-2 rounded-lg hover:bg-aegis-surface transition-colors"
        >
          <ArrowLeft size={18} className="text-aegis-muted" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-aegis-green">{ticket.ticketId}</span>
            <StatusBadge status={ticket.status} />
          </div>
          <h1 className="text-xl font-brand font-bold text-aegis-text mt-0.5">
            {ticket.title}
          </h1>
        </div>
      </div>

      {/* Main content - Split layout */}
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100%-4rem)]">
        {/* LEFT: Chat panel (60%) */}
        <div className="flex-1 lg:w-[60%] glass-card flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="px-5 py-3 border-b border-aegis-border/30 flex items-center gap-2">
            <MessageSquare size={16} className="text-aegis-green" />
            <span className="text-sm font-medium text-aegis-text">Conversation</span>
            <span className="text-xs text-aegis-muted ml-auto">{messages.length} messages</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Ticket description as first message */}
            <div className="p-4 rounded-xl bg-aegis-dark/50 border border-aegis-border/30 mb-4">
              <p className="text-xs text-aegis-muted mb-1">Original Description</p>
              <p className="text-sm text-aegis-text/80 leading-relaxed">{ticket.description}</p>
            </div>

            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isOwn={msg.sender?._id === user.id || msg.sender === user.id}
              />
            ))}

            {/* Typing indicator */}
            {typingUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs text-aegis-muted"
              >
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-aegis-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-aegis-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-aegis-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                {typingUser} is typing...
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-aegis-border/30 flex gap-3"
          >
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type your message..."
              className="aegis-input flex-1"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="aegis-btn px-4 flex items-center gap-2"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-aegis-dark/30 border-t-aegis-dark rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: Info panel (40%) */}
        <div className="lg:w-[40%] glass-card overflow-y-auto">
          <div className="p-5 space-y-6">
            <h3 className="text-lg font-brand font-semibold text-aegis-text">
              Ticket Details
            </h3>

            {/* Info items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-aegis-muted">Status</span>
                {isAdmin() || isAgent() ? (
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="aegis-input w-auto text-xs py-1.5 px-3 appearance-none cursor-pointer"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                ) : (
                  <StatusBadge status={ticket.status} />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-aegis-muted">Priority</span>
                <PriorityBadge priority={ticket.priority} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-aegis-muted">Category</span>
                <span className="text-sm text-aegis-text capitalize">
                  {categoryLabels[ticket.category] || ticket.category}
                </span>
              </div>

              <div className="border-t border-aegis-border/30 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <UserIcon size={14} className="text-aegis-muted" />
                  <span className="text-sm text-aegis-muted">Created by</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/15 flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-400">
                      {getInitials(ticket.createdBy?.name)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-aegis-text">{ticket.createdBy?.name}</p>
                    <p className="text-xs text-aegis-muted">{ticket.createdBy?.email}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-aegis-border/30 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <UserIcon size={14} className="text-aegis-muted" />
                  <span className="text-sm text-aegis-muted">Assigned to</span>
                </div>
                {ticket.assignedTo ? (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-aegis-green/15 flex items-center justify-center">
                      <span className="text-xs font-bold text-aegis-green">
                        {getInitials(ticket.assignedTo?.name)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-aegis-text">{ticket.assignedTo?.name}</p>
                      <p className="text-xs text-aegis-muted">{ticket.assignedTo?.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-aegis-muted italic">Not yet assigned</p>
                )}
              </div>

              <div className="border-t border-aegis-border/30 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-aegis-muted flex items-center gap-1">
                    <Clock size={12} /> Created
                  </span>
                  <span className="text-xs text-aegis-text">{formatDate(ticket.createdAt)}</span>
                </div>
                {ticket.resolvedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-aegis-muted flex items-center gap-1">
                      <Clock size={12} /> Resolved
                    </span>
                    <span className="text-xs text-aegis-text">{formatDate(ticket.resolvedAt)}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {ticket.tags?.length > 0 && (
                <div className="border-t border-aegis-border/30 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={14} className="text-aegis-muted" />
                    <span className="text-sm text-aegis-muted">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ticket.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-aegis-dark/60 text-xs text-aegis-muted border border-aegis-border/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TicketDetail;
