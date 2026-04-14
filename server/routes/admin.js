// Aegis — Admin routes (admin only)
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const protect = require('../middleware/roleMiddleware');
const { ROLES } = require('../constants/roles');
const { getUsers, getStats, updateUserRole } = require('../controllers/adminController');

router.use(authMiddleware);
router.use(protect(ROLES.ADMIN));

router.get('/users', getUsers);
router.get('/stats', getStats);
router.patch('/users/:id/role', updateUserRole);

module.exports = router;
