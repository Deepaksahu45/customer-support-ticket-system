// Aegis — Ticket model with auto-generated TKT-XXXX IDs
const mongoose = require('mongoose');
const Counter = require('./Counter');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Ticket description is required'],
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    category: {
      type: String,
      enum: ['billing', 'technical', 'general', 'other'],
      default: 'general',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-increment ticketId before saving
ticketSchema.pre('save', async function (next) {
  if (this.ticketId) return next();

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'ticketId' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.ticketId = `TKT-${counter.value}`;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
