import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    isConnected: false,
    socketId: null,
    error: null,
    activeRooms: [],
    onlineUsers: [],
  },
  reducers: {
    socketConnected: (state, action) => {
      state.isConnected = true;
      state.socketId = action.payload;
      state.error = null;
    },
    socketDisconnected: (state) => {
      state.isConnected = false;
      state.socketId = null;
      state.activeRooms = [];
    },
    socketConnectionError: (state, action) => {
      state.error = action.payload;
      state.isConnected = false;
    },
    joinRoom: (state, action) => {
      const roomId = action.payload;
      if (!state.activeRooms.includes(roomId)) {
        state.activeRooms.push(roomId);
      }
    },
    leaveRoom: (state, action) => {
      const roomId = action.payload;
      state.activeRooms = state.activeRooms.filter(room => room !== roomId);
    },
    userJoined: (state, action) => {
      const user = action.payload;
      if (!state.onlineUsers.find(u => u.userId === user.userId)) {
        state.onlineUsers.push(user);
      }
    },
    userLeft: (state, action) => {
      const userId = action.payload;
      state.onlineUsers = state.onlineUsers.filter(user => user.userId !== userId);
    },
    clearSocketState: (state) => {
      state.isConnected = false;
      state.socketId = null;
      state.error = null;
      state.activeRooms = [];
      state.onlineUsers = [];
    },
  },
});

export const {
  socketConnected,
  socketDisconnected,
  socketConnectionError,
  joinRoom,
  leaveRoom,
  userJoined,
  userLeft,
  clearSocketState,
} = socketSlice.actions;

export default socketSlice.reducer;