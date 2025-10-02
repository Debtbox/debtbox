import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private merchantId: string | null = null;
  private onDisconnectCallback: (() => void) | null = null;
  private isIntentionalDisconnect: boolean = false;

  connect(merchantId: string) {
    if (this.socket && this.merchantId === merchantId) {
      return this.socket;
    }

    this.disconnect();
    this.merchantId = merchantId;

    this.socket = io('wss://api.debtbox.sa/debts', {
      query: { merchantId },
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      if (import.meta.env.VITE_ENV === 'development') {
        console.log(
          'Socket connected:',
          this.socket?.id,
          'merchantId:',
          merchantId,
        );
      }
    });

    this.socket.on('disconnect', (reason) => {
      if (import.meta.env.VITE_ENV === 'development') {
        console.log('Socket disconnected:', this.socket?.id, 'reason:', reason);
      }
      // Only call the disconnect callback if it's not an intentional disconnect
      if (this.onDisconnectCallback && !this.isIntentionalDisconnect) {
        this.onDisconnectCallback();
      }
      // Reset the flag after handling
      this.isIntentionalDisconnect = false;
    });

    this.socket.on('connect_error', (error: Error) => {
      if (import.meta.env.VITE_ENV === 'development') {
        console.error('Socket connection error:', error);
      }
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.isIntentionalDisconnect = true;
      this.socket.disconnect();
      this.socket = null;
      this.merchantId = null;
      this.onDisconnectCallback = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  // Listen for debt consent updates
  onDebtConsentUpdate(callback: (data: unknown) => void) {
    if (this.socket) {
      this.socket.on('debt.consent.update', callback);
    }
  }

  // Remove debt consent update listener
  offDebtConsentUpdate(callback: (data: unknown) => void) {
    if (this.socket) {
      this.socket.off('debt.consent.update', callback);
    }
  }

  // Generic event listener
  on(event: string, callback: (data: unknown) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Generic event listener removal
  off(event: string, callback: (data: unknown) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Set disconnect callback
  onDisconnect(callback: () => void) {
    this.onDisconnectCallback = callback;
  }

  // Remove disconnect callback
  offDisconnect() {
    this.onDisconnectCallback = null;
  }
}

export const socketManager = new SocketManager();
export default socketManager;
