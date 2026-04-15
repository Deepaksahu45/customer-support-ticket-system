// Aegis — Main server entry point
require('dotenv').config();
require('express-async-errors');

const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const initSocket = require('./socket');
const errorMiddleware = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const messageRoutes = require('./routes/messages');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = initSocket(server);

// Build allowed origins list from CLIENT_URL env var
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible in routes
app.set('io', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🛡️ Aegis API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`\n🛡️  Aegis Server running on port ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   API: http://localhost:${PORT}/api`);
      console.log(`   Client: ${process.env.CLIENT_URL}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start Aegis server:', error.message);
    process.exit(1);
  }
};

startServer();
