import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from './common/Card';
import { markNotificationRead } from '../store/reducers/tradingSlice';
import { formatDistanceToNow } from 'date-fns';

const NotificationsList = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { data: notifications, loading } = useSelector(
    state => state.trading.notifications
  );

  const handleNotificationPress = (notification) => {
    if (!notification.read) {
      dispatch(markNotificationRead(notification.id));
    }
  };

  const renderNotification = ({ item: notification }) => {
    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
      addSuffix: true,
    });

    return (
      <TouchableOpacity onPress={() => handleNotificationPress(notification)}>
        <Card
          style={[
            styles.notificationCard,
            !notification.read && {
              backgroundColor: theme.dark
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          ]}
        >
          <View style={styles.notificationHeader}>
            <View
              style={[
                styles.typeDot,
                {
                  backgroundColor:
                    notification.type === 'success'
                      ? theme.colors.success
                      : notification.type === 'warning'
                      ? theme.colors.warning
                      : notification.type === 'error'
                      ? theme.colors.error
                      : theme.colors.primary,
                },
              ]}
            />
            <Text style={[styles.timestamp, { color: theme.colors.text }]}>
              {timeAgo}
            </Text>
          </View>

          <Text style={[styles.title, { color: theme.colors.text }]}>
            {notification.title}
          </Text>
          <Text
            style={[styles.message, { color: theme.colors.text }]}
            numberOfLines={2}
          >
            {notification.message}
          </Text>

          {notification.data && (
            <View style={styles.detailsContainer}>
              {Object.entries(notification.data).map(([key, value]) => (
                <Text
                  key={key}
                  style={[styles.detail, { color: theme.colors.text }]}
                >
                  {key}: {value}
                </Text>
              ))}
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Loading notifications...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Notifications
      </Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No notifications
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificationCard: {
    marginBottom: 12,
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    marginBottom: 8,
  },
  detailsContainer: {
    marginTop: 8,
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  detail: {
    fontSize: 12,
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
});

export default NotificationsList;
