


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

const Ticketchatsuppt = ({ route }) => {
  const { ticketId, ip, supportId } = route.params;
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

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    console.log("Support Message", newMessage)

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
      const response = await fetch(`${ip}/support/addChat/${ticketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });
//console.log("Support res:", response);

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, messageData]);
        setNewMessage('');
        scrollToBottom();
      } else {
        Alert.alert('Error', data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.senderRole === 'support' ? styles.userMessage : styles.supportMessage
    ]}>
      <View style={styles.messageHeader}>
        <Text style={item.senderRole === 'support' ? styles.userSenderText : styles.supportSenderText}>
          {item.senderRole === 'support' ? 'support' : 'admin'}
        </Text>
        <Text style={styles.timeText}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <Text style={item.senderRole === 'support' ? styles.userMessageText : styles.supportMessageText}>
        {item.message}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <><KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Support TicketID: #{ticketId}</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Icon name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#4CAF50']}
          tintColor="#4CAF50" />} />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          multiline
          editable={true} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    elevation: 3,
  },
  headerText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 5,
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 0,
  },
  supportMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    borderTopLeftRadius: 0,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  userSenderText: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  supportSenderText: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  userMessageText: {
    color: '#000',
  },
  supportMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Ticketchatsuppt;