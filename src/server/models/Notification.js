const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'recipientModel'
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ['Teacher', 'Student', 'Parent', 'Admin', 'User']
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'senderModel'
    },
    senderModel: {
      type: String,
      enum: ['Teacher', 'Student', 'Parent', 'Admin', 'User', 'System']
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: [
        'attendance',
        'grade',
        'fee',
        'assignment',
        'announcement',
        'system',
        'message'
      ],
      default: 'system'
    },
    relatedEntity: {
      entityType: {
        type: String,
        enum: ['Assessment', 'Attendance', 'Fee', 'Grade', 'Class', 'Timetable']
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId
      }
    },
    isRead: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    actionUrl: {
      type: String,
      default: ''
    },
    expiresAt: {
      type: Date
    }
  },
  { 
    timestamps: true 
  }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);