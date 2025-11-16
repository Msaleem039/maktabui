const Notification = require("../models/");
const { getIO } = require("../socket/notificationSocket");

class NotificationController {
  static async createNotification(notificationData) {
    try {
      const notification = new Notification(notificationData);
      await notification.save();
      
      await notification.populate('recipient', 'name email fullName studentName');
      await notification.populate('sender', 'name email fullName studentName');

      const io = getIO();
      io.to(`user_${notificationData.recipient}`).emit("new-notification", notification);
      
      if (notificationData.broadcastToRole) {
        io.to(`role_${notificationData.broadcastToRole}`).emit("new-notification", notification);
      }

      return notification;
    } catch (error) {
      throw new Error(`Error creating notification: ${error.message}`);
    }
  }

  static async getUserNotifications(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20, unreadOnly = false } = req.query;

      const query = { recipient: userId };
      if (unreadOnly === 'true') {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .populate('sender', 'name email fullName studentName')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Notification.countDocuments(query);
      const unreadCount = await Notification.countDocuments({ 
        recipient: userId, 
        isRead: false 
      });

      res.json({
        success: true,
        notifications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        unreadCount
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      ).populate('recipient sender');

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found"
        });
      }

      const io = getIO();
      io.to(`user_${notification.recipient._id}`).emit("notification-read", notification);

      res.json({
        success: true,
        notification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async markAllAsRead(req, res) {
    try {
      const { userId } = req.params;

      await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
      );

      const io = getIO();
      io.to(`user_${userId}`).emit("all-notifications-read");

      res.json({
        success: true,
        message: "All notifications marked as read"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteNotification(req, res) {
    try {
      const { notificationId } = req.params;
      
      const notification = await Notification.findByIdAndDelete(notificationId);

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found"
        });
      }

      const io = getIO();
      io.to(`user_${notification.recipient}`).emit("notification-deleted", notificationId);

      res.json({
        success: true,
        message: "Notification deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getNotificationStats(req, res) {
    try {
      const { userId } = req.params;

      const stats = await Notification.aggregate([
        { $match: { recipient: mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: "$isRead",
            count: { $sum: 1 }
          }
        }
      ]);

      const total = await Notification.countDocuments({ recipient: userId });
      const unread = await Notification.countDocuments({ 
        recipient: userId, 
        isRead: false 
      });

      res.json({
        success: true,
        stats: {
          total,
          unread,
          read: total - unread
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

class NotificationService {
  static async sendAttendanceNotification(attendanceRecord, student, teacher) {
    const notificationData = {
      recipient: student._id,
      recipientModel: 'Student',
      sender: teacher._id,
      senderModel: 'Teacher',
      title: 'Attendance Marked',
      message: `Your attendance has been marked as ${attendanceRecord.status} for ${attendanceRecord.date}`,
      type: 'attendance',
      relatedEntity: {
        entityType: 'Attendance',
        entityId: attendanceRecord._id
      },
      actionUrl: `/attendance/${attendanceRecord._id}`
    };

    return await NotificationController.createNotification(notificationData);
  }

  static async sendGradeNotification(grade, student, teacher) {
    const notificationData = {
      recipient: student._id,
      recipientModel: 'Student',
      sender: teacher._id,
      senderModel: 'Teacher',
      title: 'New Grade Available',
      message: `You received ${grade.marksObtained} marks in ${grade.assessment.title}`,
      type: 'grade',
      relatedEntity: {
        entityType: 'Grade',
        entityId: grade._id
      },
      actionUrl: `/grades/${grade._id}`
    };

    return await NotificationController.createNotification(notificationData);
  }

  static async sendFeeNotification(fee, student, parent) {
    const notificationData = {
      recipient: parent._id,
      recipientModel: 'Parent',
      sender: student._id,
      senderModel: 'Student',
      title: 'Fee Payment Update',
      message: `Fee payment for ${student.studentName} is now ${fee.status}. Amount: $${fee.amount}`,
      type: 'fee',
      relatedEntity: {
        entityType: 'Fee',
        entityId: fee._id
      },
      priority: fee.status === 'Pending' ? 'high' : 'medium',
      actionUrl: `/fees/${fee._id}`
    };

    return await NotificationController.createNotification(notificationData);
  }

  static async sendAssignmentNotification(assessment, students, teacher) {
    const notifications = [];
    
    for (const student of students) {
      const notificationData = {
        recipient: student._id,
        recipientModel: 'Student',
        sender: teacher._id,
        senderModel: 'Teacher',
        title: 'New Assignment',
        message: `New ${assessment.type}: ${assessment.title} assigned. Due: ${assessment.dueDate}`,
        type: 'assignment',
        relatedEntity: {
          entityType: 'Assessment',
          entityId: assessment._id
        },
        priority: 'high',
        actionUrl: `/assignments/${assessment._id}`
      };

      const notification = await NotificationController.createNotification(notificationData);
      notifications.push(notification);
    }

    return notifications;
  }
}

module.exports = {
  NotificationController,
  NotificationService
};