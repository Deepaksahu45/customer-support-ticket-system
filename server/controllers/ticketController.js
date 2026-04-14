// Aegis — Ticket controller (CRUD with role-based access)
const Ticket = require('../models/Ticket');
const { ROLES } = require('../constants/roles');

// POST /api/tickets — Customer creates a ticket
const createTicket = async (req, res) => {
  const { title, description, priority, category, tags } = req.body;

  const ticket = await Ticket.create({
    title,
    description,
    priority,
    category,
    tags,
    createdBy: req.user.id,
  });

  const populated = await Ticket.findById(ticket._id)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role');

  res.status(201).json({
    success: true,
    message: 'Ticket created successfully.',
    data: populated,
  });
};

// GET /api/tickets — Role-based fetch
const getTickets = async (req, res) => {
  const { status, priority, category, search, page = 1, limit = 10 } = req.query;
  const filter = {};

  // Customers see only their tickets
  if (req.user.role === ROLES.CUSTOMER) {
    filter.createdBy = req.user.id;
  }

  // Agents see tickets assigned to them + unassigned
  if (req.user.role === ROLES.AGENT) {
    filter.$or = [{ assignedTo: req.user.id }, { assignedTo: null }];
  }

  // Admin sees all (no filter)

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { ticketId: { $regex: search, $options: 'i' } },
    ];
    // If agent already has $or, merge with $and
    if (req.user.role === ROLES.AGENT) {
      const agentOr = [{ assignedTo: req.user.id }, { assignedTo: null }];
      delete filter.$or;
      filter.$and = [
        { $or: agentOr },
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { ticketId: { $regex: search, $options: 'i' } },
          ],
        },
      ];
    }
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Ticket.countDocuments(filter);

  const tickets = await Ticket.find(filter)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    success: true,
    message: 'Tickets fetched successfully.',
    data: {
      tickets,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
};

// GET /api/tickets/:id — Single ticket (populated)
const getTicketById = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role');

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found.',
    });
  }

  // Customers can only see their own tickets
  if (
    req.user.role === ROLES.CUSTOMER &&
    ticket.createdBy._id.toString() !== req.user.id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: 'Access denied.',
    });
  }

  res.json({
    success: true,
    message: 'Ticket fetched successfully.',
    data: ticket,
  });
};

// PATCH /api/tickets/:id/status — Agent/Admin update status
const updateTicketStatus = async (req, res) => {
  const { status } = req.body;

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found.',
    });
  }

  ticket.status = status;
  if (status === 'resolved') {
    ticket.resolvedAt = new Date();
  }

  await ticket.save();

  const populated = await Ticket.findById(ticket._id)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role');

  res.json({
    success: true,
    message: `Ticket status updated to "${status}".`,
    data: populated,
  });
};

// PATCH /api/tickets/:id/assign — Admin assigns agent
const assignTicket = async (req, res) => {
  const { agentId } = req.body;

  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { assignedTo: agentId, status: 'in-progress' },
    { new: true }
  )
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role');

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found.',
    });
  }

  res.json({
    success: true,
    message: 'Ticket assigned successfully.',
    data: ticket,
  });
};

// DELETE /api/tickets/:id — Admin deletes ticket
const deleteTicket = async (req, res) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id);

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found.',
    });
  }

  res.json({
    success: true,
    message: 'Ticket deleted successfully.',
    data: ticket,
  });
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
};
