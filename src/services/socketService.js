import { io } from 'socket.io-client';
import { store } from '../redux/store';
import {
  socketConnected,
  socketDisconnected,
  socketConnectionError,
  joinRoom,
  leaveRoom,
  userJoined,
  userLeft,
} from '../redux/slices/messagesSlices/socketSlices';
import {
  socketReceiveMessage,
  socketMessageRead,
} from '../redux/slices/messagesSlices/messagesSlices';

class SocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    try {
      if (this.socket?.connected) {
        console.log('Socket already connected');
        return this.socket;
      }

      this.socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        this.reconnectAttempts = 0;
        store.dispatch(socketConnected(this.socket.id));
        console.log('Connected to server:', this.socket.id);
        
        // Rejoin rooms if any were active
        const { activeRooms } = store.getState().socket;
        activeRooms.forEach(roomId => {
          this.socket.emit('joinRoom', { roomId });
        });
      });

      this.socket.on('disconnect', (reason) => {
        store.dispatch(socketDisconnected());
        console.log('Disconnected from server:', reason);
      });

      this.socket.on('connect_error', (error) => {
        this.reconnectAttempts++;
        store.dispatch(socketConnectionError(error.message));
        console.error('Connection error:', error);
      });

      this.socket.on('receiveMessage', (message) => {
        console.log('Received message via socket:', message);
        store.dispatch(socketReceiveMessage(message));
      });

      this.socket.on('messageRead', (message) => {
        console.log('Message marked as read:', message);
        store.dispatch(socketMessageRead(message));
      });

      this.socket.on('userJoined', (user) => {
        store.dispatch(userJoined(user));
      });

      this.socket.on('userLeft', (userId) => {
        store.dispatch(userLeft(userId));
      });

      this.socket.on('reconnect_attempt', (attempt) => {
        console.log(`Reconnection attempt ${attempt}`);
      });

      this.socket.on('reconnect_failed', () => {
        console.error('Failed to reconnect after maximum attempts');
      });

      return this.socket;
    } catch (error) {
      store.dispatch(socketConnectionError(error.message));
      console.error('Socket connection failed:', error);
      return null;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  joinRoom(roomId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('joinRoom', { roomId });
      store.dispatch(joinRoom(roomId));
      console.log(`Joined room: ${roomId}`);
    } else {
      console.warn('Socket not connected, cannot join room');
    }
  }

  leaveRoom(roomId) {
    if (this.socket) {
      this.socket.emit('leaveRoom', { roomId });
      store.dispatch(leaveRoom(roomId));
      console.log(`Left room: ${roomId}`);
    }
  }

  sendMessage(messageData) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('sendMessage', messageData);
      console.log('Message sent via socket:', messageData);
    } else {
      console.warn('Socket not connected, message not sent via socket');
    }
  }

  markAsRead(messageId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('markAsRead', { messageId });
      console.log('Mark as read sent for message:', messageId);
    }
  }

  userConnected(userData) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('userConnected', userData);
      console.log('User connected:', userData);
    } else {
      // Retry after a short delay if socket isn't ready
      setTimeout(() => {
        this.userConnected(userData);
      }, 1000);
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }

  getSocketId() {
    return this.socket?.id;
  }
}

export default new SocketService();