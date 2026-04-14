// Aegis — Message routes (auth required)
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/messageController');

router.use(authMiddleware);

router.post('/:ticketId', sendMessage);
router.get('/:ticketId', getMessages);

module.exports = router;
