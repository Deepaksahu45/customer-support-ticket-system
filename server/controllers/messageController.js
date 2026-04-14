// Aegis — Message controller for ticket conversations
const Message = require('../models/Message');
const Ticket = require('../models/Ticket');
const { ROLES } = require('../constants/roles');

// POST /api/messages/:ticketId — Send a message
const sendMessage = async (req, res) => {
  const { ticketId } = req.params;
  const { content, isInternal } = req.body;

  // Verify ticket exists
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found.',
    });
  }

  // Customers can only message on their own tickets
  if (
    req.user.role === ROLES.CUSTOMER &&
    ticket.createdBy.toString() !== req.user.id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: 'Access denied.',
    });
  }

  const message = await Message.create({
    ticketId,
    sender: req.user.id,
    content,
    isInternal: isInternal || false,
    readBy: [req.user.id],
  });

  const populated = await Message.findById(message._id).populate(
    'sender',
    'name email role'
  );

  res.status(201).json({
    success: true,
    message: 'Message sent successfully.',
    data: populated,
  });
};

// GET /api/messages/:ticketId — Get all messages for a ticket
const getMessages = async (req, res) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found.',
    });
  }

  // Customers can only see their own ticket messages
  if (
    req.user.role === ROLES.CUSTOMER &&
    ticket.createdBy.toString() !== req.user.id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: 'Access denied.',
    });
  }

  const filter = { ticketId };

  // Hide internal messages from customers
  if (req.user.role === ROLES.CUSTOMER) {
    filter.isInternal = false;
  }

  const messages = await Message.find(filter)
    .populate('sender', 'name email role')
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    message: 'Messages fetched successfully.',
    data: messages,
  });
};

module.exports = { sendMessage, getMessages };
