// Aegis — Message bubble component for ticket chat
import React from 'react';
import { motion } from 'framer-motion';
import { getInitials, formatDateTime } from '../utils/helpers';

const MessageBubble = ({ message, isOwn }) => {
  const { sender, content, createdAt } = message;

  return (
    <motion.div
      initial={{ opacity: 0, x: isOwn ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 max-w-[80%] ${isOwn ? 'ml-auto flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          isOwn
            ? 'bg-aegis-green/20 text-aegis-green'
            : 'bg-indigo-500/20 text-indigo-400'
        }`}
      >
        {getInitials(sender?.name)}
      </div>

      {/* Bubble */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium ${isOwn ? 'text-aegis-green' : 'text-indigo-400'}`}>
            {sender?.name}
          </span>
          <span className="text-[10px] text-aegis-muted">{formatDateTime(createdAt)}</span>
        </div>
        <div
          className={`px-4 py-3 rounded-2xl text-sm font-body leading-relaxed ${
            isOwn
              ? 'bg-aegis-green/10 text-aegis-text border border-aegis-green/20 rounded-br-md'
              : 'bg-aegis-surface text-aegis-text border border-aegis-border rounded-bl-md'
          }`}
        >
          {content}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
