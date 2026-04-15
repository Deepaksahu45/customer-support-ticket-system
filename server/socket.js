// Aegis — Socket.io setup with JWT authentication
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');

const initSocket = (server) => {
  // Build allowed origins list (must match server.js CORS config)
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
  ];
  if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
  }

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // JWT authentication middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      socket.emit('auth_error', { message: 'Invalid or expired token' });
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ Aegis Socket connected: ${socket.id} (user: ${socket.user.id})`);

    // Join a ticket room
    socket.on('join_ticket', ({ ticketId }) => {
      socket.join(ticketId);
      console.log(`📌 User ${socket.user.id} joined ticket room: ${ticketId}`);
    });

    // Send a message
    socket.on('send_message', async ({ ticketId, content, senderId }) => {
      try {
        const message = await Message.create({
          ticketId,
          sender: senderId,
          content,
          readBy: [senderId],
        });

        const populated = await Message.findById(message._id).populate(
          'sender',
          'name email role'
        );

        // Emit to all users in the ticket room
        io.to(ticketId).emit('receive_message', populated);
      } catch (error) {
        console.error('❌ Aegis Socket message error:', error.message);
        socket.emit('message_error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', ({ ticketId, userName }) => {
      socket.to(ticketId).emit('user_typing', { userName });
    });

    // Stop typing
    socket.on('stop_typing', ({ ticketId }) => {
      socket.to(ticketId).emit('user_stop_typing');
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`⚡ Aegis Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;
