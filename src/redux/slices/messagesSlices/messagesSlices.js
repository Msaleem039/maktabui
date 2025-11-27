import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sendMessage`,
        messageData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getInbox = createAsyncThunk(
  'message/getInbox',
  async ({ userId, userModel }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getInbox`,
        { userId, userModel }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// NEW: Get conversation between two users
export const getConversation = createAsyncThunk(
  'message/getConversation',
  async ({ user1Id, user1Model, user2Id, user2Model }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getConversation`,
        { user1Id, user1Model, user2Id, user2Model }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// NEW: Get all user conversations
export const getUserConversations = createAsyncThunk(
  'message/getUserConversations',
  async ({ userId, userModel }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getUserConversations`,
        { userId, userModel }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'message/markAsRead',
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/markAsRead`,
        { messageId }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// NEW: Mark conversation as read
export const markConversationAsRead = createAsyncThunk(
  'message/markConversationAsRead',
  async ({ userId, userModel, participantId, participantModel }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/markConversationAsRead`,
        { userId, userModel, participantId, participantModel }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'message/deleteMessage',
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteMessage`,
        { messageId }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUsersData = createAsyncThunk(
  'message/getUsersData',
  async ({ role,id }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getUsersData`,
        { role,id }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const socketSendMessage = createAsyncThunk(
  'message/socketSendMessage',
  async (messageData) => messageData
);

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    inbox: [],
    sentMessages: [],
    currentMessage: null,
    loading: false,
    error: null,
    success: false,
    unreadCount: 0,
    usersList: [],
    currentUserId: null,
    conversations: [],
    activeConversation: null,
    conversationLoading: false,
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
    setCurrentUserId: (state, action) => {
      state.currentUserId = action.payload;
    },
    // NEW: Set active conversation
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    // NEW: Clear active conversation
    clearActiveConversation: (state) => {
      state.activeConversation = null;
    },

    socketReceiveMessage: (state, action) => {
      const newMessage = action.payload;
      console.log('Socket received message:', newMessage);

      const existingMessageIndex = state.inbox.findIndex(msg => 
        msg._id === newMessage._id || 
        (msg._id && msg._id.startsWith('temp_') && msg.message === newMessage.message && msg.sender === newMessage.sender)
      );

      if (existingMessageIndex === -1) {
        state.inbox.unshift(newMessage);

        if (!newMessage.isRead && newMessage.receiver === state.currentUserId) {
          state.unreadCount += 1;
        }
      } else if (!state.inbox[existingMessageIndex]._id.startsWith('temp_') && newMessage._id && !newMessage._id.startsWith('temp_')) {
        state.inbox[existingMessageIndex] = newMessage;
      }

      // NEW: Also update conversations if this message belongs to active conversation
      if (state.activeConversation && 
          ((newMessage.sender === state.activeConversation.participantId && newMessage.receiver === state.currentUserId) ||
           (newMessage.receiver === state.activeConversation.participantId && newMessage.sender === state.currentUserId))) {
        state.activeConversation.messages.push(newMessage);
      }
    },

    socketMessageRead: (state, action) => {
      const message = action.payload;
      const index = state.inbox.findIndex(msg => msg._id === message._id);
      if (index !== -1) {
        state.inbox[index] = message;
        if (message.receiver === state.currentUserId) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },

    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },

    // Clear all messages (for logout)
    clearMessages: (state) => {
      state.inbox = [];
      state.sentMessages = [];
      state.currentMessage = null;
      state.unreadCount = 0;
      state.usersList = [];
      state.currentUserId = null;
      state.conversations = [];
      state.activeConversation = null;
    },
  }, 

  extraReducers: (builder) => {
    builder
      // ================= SEND MESSAGE =================
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload.data) {
          state.sentMessages.unshift(action.payload.data);
          state.inbox.unshift(action.payload.data);
          
          // NEW: Also add to active conversation if it matches
          if (state.activeConversation && 
              action.payload.data.receiver === state.activeConversation.participantId) {
            state.activeConversation.messages.push(action.payload.data);
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to send message';
      })

      // ================= GET INBOX =================
      .addCase(getInbox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInbox.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.inbox = action.payload.data;
          state.unreadCount = action.payload.data.filter(msg => !msg.isRead).length;
        }
      })
      .addCase(getInbox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch inbox';
      })

      // ================= GET CONVERSATION =================
      .addCase(getConversation.pending, (state) => {
        state.conversationLoading = true;
        state.error = null;
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.conversationLoading = false;
        if (action.payload.data) {
          state.activeConversation = {
            messages: action.payload.data,
            participantId: action.payload.participants?.user2?.id,
            participantModel: action.payload.participants?.user2?.model
          };
        }
      })
      .addCase(getConversation.rejected, (state, action) => {
        state.conversationLoading = false;
        state.error = action.payload?.message || 'Failed to fetch conversation';
      })

      // ================= GET USER CONVERSATIONS =================
      .addCase(getUserConversations.pending, (state) => {
        state.conversationLoading = true;
        state.error = null;
      })
      .addCase(getUserConversations.fulfilled, (state, action) => {
        state.conversationLoading = false;
        if (action.payload.data) {
          state.conversations = action.payload.data;
        }
      })
      .addCase(getUserConversations.rejected, (state, action) => {
        state.conversationLoading = false;
        state.error = action.payload?.message || 'Failed to fetch conversations';
      })

      // ================= MARK AS READ =================
      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMsg = action.payload.data;
        const index = state.inbox.findIndex(msg => msg._id === updatedMsg._id);
        if (index !== -1) {
          state.inbox[index] = updatedMsg;
          if (updatedMsg.receiver === state.currentUserId) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to mark message as read';
      })

      // ================= MARK CONVERSATION AS READ =================
      .addCase(markConversationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        // Update unread count in conversations
        if (state.activeConversation) {
          const conversationIndex = state.conversations.findIndex(
            conv => conv.participantId === state.activeConversation.participantId
          );
          if (conversationIndex !== -1) {
            state.conversations[conversationIndex].unreadCount = 0;
          }
        }
      })
      .addCase(markConversationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to mark conversation as read';
      })

      // ================= DELETE MESSAGE =================
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        const deletedMsg = action.payload.data;
        state.inbox = state.inbox.filter(msg => msg._id !== deletedMsg._id);
        
        // NEW: Also remove from active conversation
        if (state.activeConversation) {
          state.activeConversation.messages = state.activeConversation.messages.filter(
            msg => msg._id !== deletedMsg._id
          );
        }
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete message';
      })

      // ================= GET USERS DATA =================
      .addCase(getUsersData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.usersList = action.payload.data;
        }
      })
      .addCase(getUsersData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch users';
      })

      // ================= SOCKET SEND MESSAGE =================
      .addCase(socketSendMessage.fulfilled, (state, action) => {
        // This is for optimistic updates - message already added via socketReceiveMessage
        console.log('Socket message sent optimistically');
      });
  },
});

export const {
  clearError,
  clearSuccess,
  setCurrentMessage,
  setCurrentUserId,
  setActiveConversation,
  clearActiveConversation,
  socketReceiveMessage,
  socketMessageRead,
  updateUnreadCount,
  clearMessages,
} = messageSlice.actions;

export default messageSlice.reducer;