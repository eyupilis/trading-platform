import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/theme';

const generateRandomUsername = () => {
  const adjectives = ['Hızlı', 'Akıllı', 'Güçlü', 'Cesur', 'Şanslı'];
  const nouns = ['Trader', 'Boğa', 'Ayı', 'Balina', 'Kartal'];
  const number = Math.floor(Math.random() * 1000);
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}${randomNoun}${number}`;
};

const ChatRoomScreen = ({ route }) => {
  const { roomId, roomName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username] = useState(generateRandomUsername());
  const flatListRef = useRef(null);
  
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      // TODO: Replace with actual API call
      const mockMessages = [
        {
          id: '1',
          text: 'BTC 45k direncini test ediyor',
          username: 'HızlıTrader123',
          timestamp: '18:30',
        },
        {
          id: '2',
          text: 'RSI aşırı alım bölgesinde dikkatli olun',
          username: 'AkıllıBoğa456',
          timestamp: '18:31',
        },
        {
          id: '3',
          text: 'Hacim artışı var',
          username: 'CesurAyı789',
          timestamp: '18:32',
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      Alert.alert('Hata', 'Mesajlar yüklenirken bir hata oluştu');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // TODO: Replace with actual API call
      const newMsg = {
        id: Date.now().toString(),
        text: newMessage,
        username,
        timestamp: new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages(prevMessages => [...prevMessages, newMsg]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd();
      }, 100);
    } catch (error) {
      Alert.alert('Hata', 'Mesaj gönderilemedi');
    }
  };

  const renderMessage = ({ item, index }) => {
    const isOwnMessage = item.username === username;

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessageContainer : null,
      ]}>
        {!isOwnMessage && (
          <Text style={styles.username}>{item.username}</Text>
        )}
        <View style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
        ]}>
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
          ]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roomName}>{roomName}</Text>
        <Text style={styles.username}>Sen: {username}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Mesajınızı yazın..."
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Text style={styles.sendButtonText}>Gönder</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  roomName: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: 4,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  username: {
    ...FONTS.body5,
    color: COLORS.gray,
    marginBottom: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  ownMessageBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...FONTS.body4,
  },
  ownMessageText: {
    color: COLORS.white,
  },
  otherMessageText: {
    color: COLORS.secondary,
  },
  timestamp: {
    ...FONTS.body5,
    color: COLORS.gray,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
});

export default ChatRoomScreen;
