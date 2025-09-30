import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private merchantId: string | null = null;

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

    this.socket.on('disconnect', () => {
      if (import.meta.env.VITE_ENV === 'development') {
        console.log('Socket disconnected:', this.socket?.id);
      }
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
      this.socket.disconnect();
      this.socket = null;
      this.merchantId = null;
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
}

export const socketManager = new SocketManager();
export default socketManager;
