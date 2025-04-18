

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Navbar from '../Navbar/Navbar.js';
import * as SecureStore from 'expo-secure-store';

const AdminChatScreen = ({ route }) => {
  const { ticketId, ip, adminId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [ticketId, ip]);

  const fetchMessages = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${ip}/getChats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(data.chats || []);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Unable to fetch messages. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchMessages();
  };

  const scrollToBottom = (animated = true) => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    console.log("Admin Message", newMessage);
    // const userRole = "admin"; 
    // const userId = "admin_001"; 
    // const messageData = {
    //   message: newMessage,
    //   timestamp: new Date().toISOString(),
    //   senderId: userId,
    //   senderRole: userRole

    const userRole = await SecureStore.getItemAsync('userRole');
    const userId = await SecureStore.getItemAsync('userroleId');

    if (!userRole || !userId) {
      console.error("User role or ID not found");
      return;
    }

    const messageData = {
      message: newMessage,
      timestamp: new Date().toISOString(),
      senderId: userId,
      senderRole: userRole
    };
  
    try {
      const endpoint = userRole === 'admin' 
        ? `${ip}/admin/addChat/${ticketId}`
        : `${ip}/support/addChat/${ticketId}`;
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
  console.log("res:",response)
      if (response.ok) {
        setMessages(prev => [...prev, messageData]);
        setNewMessage('');
        setTimeout(() => scrollToBottom(), 100); // Small delay to ensure message is rendered
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to send message');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.senderRole === 'admin' ? styles.userMessage : styles.adminMessage
    ]}>
      <View style={styles.messageHeader}>
        <Text style={item.senderRole === 'admin' ? styles.userSenderText : styles.adminSenderText}>
          {item.senderRole === 'admin' ? 'admin' : 'support'}
        </Text>
        <Text style={styles.timeText}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <Text style={item.senderRole === 'admin' ? styles.userMessageText : styles.adminMessageText}>
        {item.message}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9C27B0" />
      </View>
    );
  }

  return (
    <><KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>TicketID: #{ticketId}</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Icon name="refresh" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => scrollToBottom(false)}
        onLayout={() => scrollToBottom(false)}
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#9C27B0']}
          tintColor="#9C27B0" />}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled" />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          multiline
          onFocus={() => scrollToBottom()} />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Icon name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView><View style={styles.navbarContainer}>
        <Navbar />
      </View></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#9C27B0',
    padding: 8,
    elevation: 3,
  },
  headerText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 7,

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  adminMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3E5F5',
    borderTopLeftRadius: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#673AB7',
    borderTopRightRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  adminSenderText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#7B1FA2',
  },
  userSenderText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff',
  },
  timeText: {
    fontSize: 12,
    color: 'white',
  },
  adminMessageText: {
    fontSize: 16,
    color: '#333',
  },
  userMessageText: {
    fontSize: 16,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#9C27B0',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminChatScreen;