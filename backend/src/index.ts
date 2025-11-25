import cors from 'cors';
import express from 'express';
import env from './config/env.config';
import { ExceptionHandler } from './middlewares/exception.middleware';
import orderRouter from './routes/order.route';
import itemRouter from './routes/item.route';
import { SocketService } from './services/socket.service';

// Server Setup
const app = express();
const PORT = env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', itemRouter);
app.use('/api/orders', orderRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'Restaunax API is running',
        socketIo: true
    });
});

// Error Handler
app.use(ExceptionHandler);

// Initialize Socket Service
const socketService = SocketService.getInstance();
socketService.initialize(app);

// Get the HTTP server from socket service
const httpServer = socketService.getHttpServer();

// Start server
httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📋 Items API available at http://localhost:${PORT}/api/items`);
    console.log(`📋 Orders API available at http://localhost:${PORT}/api/orders`);
    console.log(`🔌 Socket.IO available at http://localhost:${PORT}`);
    console.log(`❤️ Health check: http://localhost:${PORT}/health`);
});