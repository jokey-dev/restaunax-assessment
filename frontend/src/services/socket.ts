import { io, Socket } from "socket.io-client";
import { Order } from "../shared/types";

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect() {
    if (!this.socket) {
      this.socket = io("http://localhost:3005", {
        transports: ["websocket", "polling"],
      });

      this.socket.on("connect", () => {
        console.log("Connected to Socket.IO server", this.socket?.id);
      });

      this.socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });
    }
  }

  public onNewOrder(callback: (order: Order) => void) {
    this.socket?.on("new-order", callback);
  }

  public disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = SocketService.getInstance();
