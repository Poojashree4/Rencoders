
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import Navbar from '../Navbar/Navbar.js';

const { width, height } = Dimensions.get('window');
const TicketsSuppt = ({ navigation }) => {

   const ip = useSelector((state) => state.ip.value);
  
  const currentUser = {
    id: 'support_001', 
    
    role: 'support'
  };

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    message: '',
  });

  const fetchAllTickets = async () => {
    try {
      setRefreshing(true);
      setLoading(true); // Ensure loading state is set
      
      const response = await fetch(`${ip}/getAllTickets`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
  
      // More robust filtering
      const supportTickets = Array.isArray(data) 
        ? data.filter(ticket => 
            ticket?.createdBy?.role === 'support' && 
            ticket?.createdBy?.roleID === currentUser.id
          )
        : [];
        
      setTickets(supportTickets);
      
    } catch (err) {
      console.error('Fetch tickets error:', err);
      Alert.alert(
        'Error', 
        err.message.includes('HTTP error') 
          ? 'Server returned an error'
          : 'Failed to fetch tickets. Please check your connection.'
      );
      setTickets([]); // Reset to empty array on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Add ip to dependency array
  useEffect(() => {
    fetchAllTickets();
  }, [ip]); // Added ip as dependency

 

  const handleCreateTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${ip}/createTicket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTicket.title,
          createdByRole: 'support',
          createdByRoleID: currentUser.id,
          assignedToRole: 'admin',
          assignedToRoleID: 'admin_001', // Hardcoded admin ID
          chats: [{
            senderId: currentUser.id,
            senderRole: 'support',
            message: newTicket.message,
            timestamp: new Date().toISOString()
          }]
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Ticket created successfully');
        setShowCreateModal(false);
        setNewTicket({ title: '', message: '' });
        fetchAllTickets();
      } else {
        Alert.alert('Error', data.error || 'Failed to create ticket');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to create ticket. Please check your connection.');
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '#9E9E9E';
    switch (status.toLowerCase()) {
      case 'open': return '#4CAF50';
      case 'closed': return '#F44336';
      case 'resolved': return '#2196F3';
      case 'pending': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const renderTicket = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ticketchatsuppt', { 
        ticketId: item._id,
        ip: ip,
        ticketStatus: item.status
      })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item?.status) }]}>
          <Text style={styles.statusText}>{item?.status || 'unknown'}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Icon name="person-outline" size={18} color="#555" />
        <Text style={styles.infoText}>
          Created by: <Text style={styles.highlightText}>support ({currentUser.id})</Text>
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="assignment-ind" size={18} color="#555" />
        <Text style={styles.infoText}>
          Assigned to: <Text style={styles.highlightText}>admin (admin_001)</Text>
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="chat-bubble-outline" size={18} color="#555" />
        <Text style={styles.infoText}>
          {item.chats?.length || 0} message{item.chats?.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {item.chats?.length > 0 && (
        <View style={styles.lastMessageContainer}>
          <Text style={styles.lastMessage} numberOfLines={2}>
            <Text style={[
              styles.senderText,
              item.chats[item.chats.length - 1].senderRole === 'support' ? styles.supportText : {}
            ]}>
              {item.chats[item.chats.length - 1].senderRole === 'admin' ? 'admin' : 'support'}:
            </Text> {item.chats[item.chats.length - 1].message}
          </Text>
        </View>
      )}

      <View style={styles.dateRow}>
        <Text style={styles.dateText}>
          Created: {new Date(item.createdAt).toLocaleString()}
        </Text>
        <Text style={styles.dateText}>
          Updated: {new Date(item.updatedAt).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <><SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}> Support Tickets</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Icon name="add" size={24} color="white" />
          <Text style={styles.createButtonText}>Create Ticket</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item._id}
        renderItem={renderTicket}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={fetchAllTickets}
        ListEmptyComponent={<View style={styles.emptyContainer}>
          <Icon name="error-outline" size={48} color="#888" />
          <Text style={styles.emptyText}>No tickets found</Text>
          <TouchableOpacity
            style={styles.emptyCreateButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.emptyCreateButtonText}>Create Your First Ticket</Text>
          </TouchableOpacity>
        </View>} />

      {/* Create Ticket Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Ticket</Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter ticket title"
              value={newTicket.title}
              onChangeText={(text) => setNewTicket({ ...newTicket, title: text })} />

            <Text style={styles.inputLabel}>Initial Message</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Describe your issue..."
              multiline
              numberOfLines={4}
              value={newTicket.message}
              onChangeText={(text) => setNewTicket({ ...newTicket, message: text })} />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCreateTicket}
            >
              <Text style={styles.submitButtonText}>Submit Ticket</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView><View style={styles.navbarContainer}>
        <Navbar />
      </View></>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    width: width,
    height: height,
  },
  header: {
    padding: width * 0.04, 
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: width * 0.05, 
    fontWeight: 'bold',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingHorizontal: width * 0.03, 
    paddingVertical: height * 0.01,
    borderRadius: 4,
  },
  createButtonText: {
    color: 'white',
    marginLeft: width * 0.01, 
    fontWeight: '500',
    fontSize: width * 0.035, 
  },
  list: {
    padding: width * 0.03, 
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: width * 0.04, 
    marginBottom: height * 0.015,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: width * 0.94, 
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.012, 
  },
  title: {
    fontSize: width * 0.045, 
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: width * 0.02, 
    paddingVertical: height * 0.006, 
    borderRadius: 12,
    marginLeft: width * 0.02, 
  },
  statusText: {
    color: '#fff',
    fontSize: width * 0.03, 
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01, 
  },
  infoText: {
    marginLeft: width * 0.02, 
    color: '#555',
    fontSize: width * 0.038, 
  },
  highlightText: {
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessageContainer: {
    backgroundColor: '#f9f9f9',
    padding: width * 0.025, 
    borderRadius: 6,
    marginTop: height * 0.01, 
    marginBottom: height * 0.01,
  },
  lastMessage: {
    color: '#666',
    fontSize: width * 0.038,
  },
  senderText: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  supportText: {
    color: '#4CAF50',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: height * 0.01,
  },
  dateText: {
    fontSize: width * 0.032, 
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.1, 
  },
  emptyText: {
    marginTop: height * 0.02,
    fontSize: width * 0.045,
    color: '#888',
  },
  emptyCreateButton: {
    marginTop: height * 0.025, 
    backgroundColor: '#2196F3',
    paddingHorizontal: width * 0.05, 
    paddingVertical: height * 0.015, 
    borderRadius: 5,
  },
  emptyCreateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.038,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width: width,
    height: height,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: width * 0.04,
  },
  inputLabel: {
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: width * 0.03,
    marginBottom: height * 0.02,
    fontSize: width * 0.04,
  },
  messageInput: {
    height: height * 0.15, 
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: height * 0.02,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: height * 0.03,
  },
  submitButtonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});

export default TicketsSuppt;