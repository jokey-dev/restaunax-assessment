import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import { Order } from '../../prisma/generated/client';

export class SocketService {
  private static instance: SocketService;
  private io: Server | null = null;
  private httpServer: any;

  private constructor() { }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(app: express.Application): void {
    console.log('Initializing Socket.IO...');

    this.httpServer = createServer(app);

    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling']
    });

    this.setupSocketEvents();
    console.log('Socket.IO initialized');
  }

  private setupSocketEvents(): void {
    if (!this.io) {
      console.error('Socket.IO not initialized');
      return;
    }

    this.io.on("connection", (socket: Socket) => {
      console.log(" User connected:", socket.id);

      // Order events
      socket.on("new-order", (orderData: Order) => {
        this.emitOrderCreated(orderData);
      });

      socket.on("disconnect", (reason) => {
        console.log("User disconnected:", socket.id, "Reason:", reason);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    });

    this.io.engine.on("connection_error", (err) => {
      console.log('Engine connection error:', err.code, err.message);
    });
  }

  public emitOrderCreated(orderData: Order): void {
    this.io?.emit('new-order', orderData);
  }

  public getIO(): Server | null {
    return this.io;
  }

  public getHttpServer(): any {
    return this.httpServer;
  }
}