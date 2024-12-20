import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/theme';

const ChatRoomsScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      // TODO: Replace with actual API call
      const mockRooms = [
        {
          id: '1',
          name: 'BTC Traders',
          lastMessage: 'Support seviyesi kırıldı!',
          lastMessageTime: '18:30',
          participantCount: 156,
          unreadCount: 3,
        },
        {
          id: '2',
          name: 'ETH Analysis',
          lastMessage: 'Yeni ATH geliyor...',
          lastMessageTime: '18:25',
          participantCount: 89,
          unreadCount: 0,
        },
        {
          id: '3',
          name: 'Altcoin Gems',
          lastMessage: 'Bu projeyi inceleyin',
          lastMessageTime: '18:15',
          participantCount: 234,
          unreadCount: 5,
        },
      ];
      setRooms(mockRooms);
    } catch (error) {
      Alert.alert('Hata', 'Sohbet odaları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = () => {
    navigation.navigate('CreateChatRoom');
  };

  const renderRoomItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => navigation.navigate('ChatRoom', { roomId: item.id, roomName: item.name })}
    >
      <View style={styles.roomInfo}>
        <View style={styles.roomHeader}>
          <Text style={styles.roomName}>{item.name}</Text>
          <Text style={styles.timeText}>{item.lastMessageTime}</Text>
        </View>
        <View style={styles.roomDetails}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          <View style={styles.roomStats}>
            <Text style={styles.participantCount}>
              {item.participantCount} kullanıcı
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Sohbet odası ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateRoom}
        >
          <Text style={styles.createButtonText}>+ Yeni Oda</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rooms.filter(room =>
          room.name.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderRoomItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  listContainer: {
    padding: 16,
  },
  roomItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomInfo: {
    flex: 1,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomName: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  timeText: {
    ...FONTS.body5,
    color: COLORS.gray,
  },
  roomDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    ...FONTS.body4,
    color: COLORS.secondary,
    flex: 1,
    marginRight: 8,
  },
  roomStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantCount: {
    ...FONTS.body5,
    color: COLORS.gray,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unreadCount: {
    ...FONTS.body5,
    color: COLORS.white,
  },
});

export default ChatRoomsScreen;
