// Aegis — Admin controller for user management and analytics
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Message = require('../models/Message');
const { ALL_ROLES } = require('../constants/roles');

// GET /api/admin/users — Get all users
const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });

  res.json({
    success: true,
    message: 'Users fetched successfully.',
    data: users,
  });
};

// GET /api/admin/stats — Full analytics
const getStats = async (req, res) => {
  const [
    totalUsers,
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    closedTickets,
    urgentTickets,
    totalMessages,
  ] = await Promise.all([
    User.countDocuments(),
    Ticket.countDocuments(),
    Ticket.countDocuments({ status: 'open' }),
    Ticket.countDocuments({ status: 'in-progress' }),
    Ticket.countDocuments({ status: 'resolved' }),
    Ticket.countDocuments({ status: 'closed' }),
    Ticket.countDocuments({ priority: 'urgent' }),
    Message.countDocuments(),
  ]);

  // Category distribution
  const categoryStats = await Ticket.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  // Priority distribution
  const priorityStats = await Ticket.aggregate([
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  // Recent tickets
  const recentTickets = await Ticket.find()
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    message: 'Admin stats fetched successfully.',
    data: {
      totalUsers,
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      urgentTickets,
      totalMessages,
      categoryStats,
      priorityStats,
      recentTickets,
    },
  });
};

// PATCH /api/admin/users/:id/role — Update user role
const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!ALL_ROLES.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role. Allowed: ${ALL_ROLES.join(', ')}`,
    });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.',
    });
  }

  res.json({
    success: true,
    message: `User role updated to "${role}".`,
    data: user,
  });
};

module.exports = { getUsers, getStats, updateUserRole };
