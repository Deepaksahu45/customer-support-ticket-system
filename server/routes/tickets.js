// Aegis — Ticket routes (auth required)
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const protect = require('../middleware/roleMiddleware');
const { ROLES } = require('../constants/roles');
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
} = require('../controllers/ticketController');

router.use(authMiddleware);

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.patch('/:id/status', protect(ROLES.AGENT, ROLES.ADMIN), updateTicketStatus);
router.patch('/:id/assign', protect(ROLES.ADMIN), assignTicket);
router.delete('/:id', protect(ROLES.ADMIN), deleteTicket);

module.exports = router;
