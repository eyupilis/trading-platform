const admin = require('firebase-admin');
const { logger } = require('../utils/logger');
const { NotificationRepository } = require('../repositories/notification');

class NotificationService {
  constructor() {
    this.notificationRepo = new NotificationRepository();
  }

  async sendPushNotification(userId, notification) {
    try {
      const userTokens = await this.notificationRepo.getUserDeviceTokens(userId);
      
      if (!userTokens.length) {
        logger.warn(`No device tokens found for user ${userId}`);
        return;
      }

      const message = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: {
          type: notification.type,
          entityId: notification.entityId,
          ...notification.data,
        },
        tokens: userTokens,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'trading',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().sendMulticast(message);
      
      // Handle failed tokens
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(userTokens[idx]);
          }
        });
        
        await this.notificationRepo.removeFailedTokens(userId, failedTokens);
      }

      // Save notification to history
      await this.notificationRepo.saveNotification({
        userId,
        title: notification.title,
        message: notification.body,
        type: notification.type,
        entityId: notification.entityId,
        metadata: notification.data,
      });

      return response;
    } catch (error) {
      logger.error('Push notification error:', error);
      throw error;
    }
  }

  async sendTradeNotification(userId, trade) {
    const notification = {
      title: 'Trade Update',
      body: this.getTradeNotificationMessage(trade),
      type: 'trade',
      entityId: trade.id,
      data: {
        tradeId: trade.id,
        symbol: trade.symbol,
        type: trade.type,
        status: trade.status,
      },
    };

    return this.sendPushNotification(userId, notification);
  }

  async sendPriceAlert(userId, alert) {
    const notification = {
      title: 'Price Alert',
      body: `${alert.symbol} has reached ${alert.price}`,
      type: 'price_alert',
      entityId: alert.id,
      data: {
        alertId: alert.id,
        symbol: alert.symbol,
        price: alert.price,
        condition: alert.condition,
      },
    };

    return this.sendPushNotification(userId, notification);
  }

  getTradeNotificationMessage(trade) {
    switch (trade.status) {
      case 'take_profit':
        return `Take Profit hit! ${trade.symbol} position closed at ${trade.closePrice}`;
      case 'stop_loss':
        return `Stop Loss triggered! ${trade.symbol} position closed at ${trade.closePrice}`;
      case 'opened':
        return `New ${trade.type} position opened for ${trade.symbol} at ${trade.entryPrice}`;
      case 'closed':
        return `${trade.symbol} position closed at ${trade.closePrice}`;
      default:
        return `Trade update for ${trade.symbol}`;
    }
  }
}

module.exports = new NotificationService();
