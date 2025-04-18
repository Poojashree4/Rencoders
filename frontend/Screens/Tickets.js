


// export default TicketsScreen;

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   SafeAreaView,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
  
// } from 'react-native';
// import { useSelector } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { Picker } from '@react-native-picker/picker'; 


// const TicketsScreen = ({ navigation }) => {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newTicket, setNewTicket] = useState({
//     title: '',
//     message: '',
//     assignedToRole: 'support', // Default role
//     assignedToRoleID: '' // Will be populated based on role
//   });
//   const [isCreating, setIsCreating] = useState(false);
//   const [availableUsers, setAvailableUsers] = useState([]);
//   const ip = useSelector((state) => state.ip.value);
  
//   // Current user - should come from your auth system
//   const currentUser = {
//     id: 'admin_001', // or support_001
//     role: 'admin', // or 'support'
//     name: 'Admin User'
//   };

//   const fetchAllTickets = async () => {
//     try {
//       setRefreshing(true);
//       const response = await fetch(`${ip}/getAllTickets`);
//       const data = await response.json();

//       if (response.ok) {
//         // Filter tickets based on user role
//         let userTickets = [];
//         if (currentUser.role === 'admin') {
//           // Admins see all tickets assigned to them or created by them
//           userTickets = data.filter(item => 
//             item && item._id && (
//               item.assignedTo?.roleID === currentUser.id ||
//               item.createdBy?.roleID === currentUser.id
//             )
//           );
//         } else {
//           // Support agents see tickets they created or are assigned to them
//           userTickets = data.filter(item => 
//             item && item._id && (
//               item.createdBy?.roleID === currentUser.id ||
//               item.assignedTo?.roleID === currentUser.id
//             )
//           );
//         }
//         setTickets(userTickets);
//       } else {
//         Alert.alert('Error', data.error || 'Failed to fetch tickets');
//         setTickets([]);
//       }
//     } catch (err) {
//       console.error('Fetch tickets error:', err);
//       Alert.alert('Error', 'Unable to fetch tickets. Please check your connection.');
//       setTickets([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const fetchAvailableUsers = async () => {
//     try {
//       const response = await fetch(`${ip}/getUsers?role=${newTicket.assignedToRole}`);
//       const data = await response.json();
//       if (response.ok) {
//         setAvailableUsers(data);
//         // Set default assigned ID if available
//         if (data.length > 0 && !newTicket.assignedToRoleID) {
//           setNewTicket(prev => ({
//             ...prev,
//             assignedToRoleID: data[0].roleId
//           }));
//         }
//       }
//     } catch (err) {
//       console.error('Error fetching users:', err);
//     }
//   };

//   useEffect(() => {
//     fetchAllTickets();
//   }, [ip]);

//   useEffect(() => {
//     if (showCreateModal) {
//       fetchAvailableUsers();
//     }
//   }, [showCreateModal, newTicket.assignedToRole]);

//   const handleCreateTicket = async () => {
//     if (!newTicket.title.trim() || !newTicket.message.trim() || !newTicket.assignedToRoleID) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }
  
//     setIsCreating(true);
//     try {
//       const response = await fetch(`${ip}/createTicket`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           title: newTicket.title,
//           createdByRole: currentUser.role,
//           createdByRoleID: currentUser.id,
//           assignedToRole: newTicket.assignedToRole,
//           assignedToRoleID: newTicket.assignedToRoleID,
//           chats: [{
//             senderId: currentUser.id,
//             senderRole: currentUser.role,
//             message: newTicket.message,
//             timestamp: new Date().toISOString()
//           }]
//         }),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         Alert.alert('Success', 'Ticket created successfully');
//         setShowCreateModal(false);
//         setNewTicket({ 
//           title: '', 
//           message: '', 
//           assignedToRole: 'support',
//           assignedToRoleID: '' 
//         });
//         fetchAllTickets();
//       } else {
//         Alert.alert('Error', data.error || 'Failed to create ticket');
//       }
//     } catch (err) {
//       console.error('Create ticket error:', err);
//       Alert.alert('Error', 'Unable to create ticket. Please check your connection.');
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     if (!status) return '#9E9E9E';
//     switch (status.toLowerCase()) {
//       case 'open': return '#4CAF50';
//       case 'closed': return '#F44336';
//       case 'resolved': return '#2196F3';
//       case 'pending': return '#FF9800';
//       default: return '#9E9E9E';
//     }
//   };

//   const renderTicket = ({ item }) => {
//     if (!item) return null;
  
//     const lastChat = item.chats?.length > 0 ? item.chats[item.chats.length - 1] : null;
//     const lastMessage = lastChat?.message || '';
  
//     return (
//       <TouchableOpacity 
//         style={styles.card}
//         onPress={() => navigation.navigate('ticketChat', { 
//           ticketId: item._id,
//           ip: ip,
//           title: item.title,
//           status: item.status,
//           currentUserRole: currentUser.role
//         })}
//       >
//         <View style={styles.cardHeader}>
//           <Text style={styles.title}>{item.title}</Text>
//           <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
//             <Text style={styles.statusText}>{item.status || 'unknown'}</Text>
//           </View>
//         </View>
  
//         <View style={styles.infoRow}>
//           <Icon name="person-outline" size={18} color="#555" />
//           <Text style={styles.infoText}>
//             Created by: <Text style={styles.highlightText}>{item.createdBy?.role || 'N/A'} ({item.createdBy?.roleID || 'N/A'})</Text>
//           </Text>
//         </View>
  
//         <View style={styles.infoRow}>
//           <Icon name="assignment-ind" size={18} color="#555" />
//           <Text style={styles.infoText}>
//             Assigned to: <Text style={styles.highlightText}>{item.assignedTo?.role || 'N/A'} ({item.assignedTo?.roleID || 'N/A'})</Text>
//           </Text>
//         </View>
  
//         <View style={styles.infoRow}>
//           <Icon name="chat-bubble-outline" size={18} color="#555" />
//           <Text style={styles.infoText}>
//             {item.chats?.length || 0} message{item.chats?.length !== 1 ? 's' : ''}
//           </Text>
//         </View>
  
//         {lastChat && (
//           <View style={styles.lastMessageContainer}>
//             <Text style={styles.lastMessage} numberOfLines={2}>
//               <Text style={styles.senderText}>
//                 {lastChat.senderRole === 'admin' ? 'admin' : 'support'}:
//               </Text> {lastMessage}
//             </Text>
//           </View>
//         )}
  
//         <View style={styles.dateRow}>
//           <Text style={styles.dateText}>
//             Created: {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
//           </Text>
//           <Text style={styles.dateText}>
//             Updated: {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'N/A'}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#007bff" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>
//           {currentUser.role === 'admin' ? 'All Tickets' : 'My Tickets'}
//         </Text>
//         <TouchableOpacity 
//           style={styles.createButton}
//           onPress={() => setShowCreateModal(true)}
//         >
//           <Icon name="add" size={24} color="white" />
//           <Text style={styles.createButtonText}>Create Ticket</Text>
//         </TouchableOpacity>
//       </View>
      
//       <FlatList
//         data={tickets}
//         keyExtractor={(item) => item?._id || Math.random().toString()}
//         renderItem={renderTicket}
//         contentContainerStyle={styles.list}
//         refreshing={refreshing}
//         onRefresh={fetchAllTickets}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Icon name="error-outline" size={48} color="#888" />
//             <Text style={styles.emptyText}>No tickets found</Text>
//             <TouchableOpacity 
//               style={styles.emptyCreateButton}
//               onPress={() => setShowCreateModal(true)}
//             >
//               <Text style={styles.emptyCreateButtonText}>Create New Ticket</Text>
//             </TouchableOpacity>
//           </View>
//         }
//       />

//       {/* Create Ticket Modal */}
//       <Modal
//         visible={showCreateModal}
//         animationType="slide"
//         transparent={false}
//         onRequestClose={() => setShowCreateModal(false)}
//       >
//         <KeyboardAvoidingView 
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.modalContainer}
//         >
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Create New Ticket</Text>
//             <TouchableOpacity onPress={() => setShowCreateModal(false)}>
//               <Icon name="close" size={24} color="#333" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.modalContent}>
//             <Text style={styles.inputLabel}>Title</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter ticket title"
//               value={newTicket.title}
//               onChangeText={(text) => setNewTicket({...newTicket, title: text})}
//             />

//             <Text style={styles.inputLabel}>Assign To Role</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={newTicket.assignedToRole}
//                 style={styles.picker}
//                 onValueChange={(itemValue) => {
//                   setNewTicket({
//                     ...newTicket,
//                     assignedToRole: itemValue,
//                     assignedToRoleID: ''
//                   });
//                 }}
//               >
//                 <Picker.Item label="Support" value="support" />
//                 <Picker.Item label="Admin" value="admin" />
//               </Picker>
//             </View>

//             <Text style={styles.inputLabel}>Assign To RoleID</Text>
// <View style={styles.pickerContainer}>
//   <Picker
//     selectedValue={newTicket.assignedToRoleID}
//     style={styles.picker}
//     onValueChange={(itemValue) => {
//       setNewTicket({
//         ...newTicket,
//         assignedToRoleID: itemValue
//       });
//     }}
//   >
//     {newTicket.assignedToRole === 'support' ? (
//       <Picker.Item label="support_001" value="support_001" />
//     ) : (
//       <Picker.Item label="admin_001" value="admin_001" />
//     )}
//   </Picker>
// </View>

//             <Text style={styles.inputLabel}>Initial Message</Text>
//             <TextInput
//               style={[styles.input, styles.messageInput]}
//               placeholder="Enter your message..."
//               multiline
//               numberOfLines={4}
//               value={newTicket.message}
//               onChangeText={(text) => setNewTicket({...newTicket, message: text})}
//             />

//             <TouchableOpacity 
//               style={styles.submitButton}
//               onPress={handleCreateTicket}
//               disabled={isCreating}
//             >
//               {isCreating ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Create Ticket</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     padding: 16,
//     backgroundColor: '#2196F3',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   createButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1976D2',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 4,
//   },
//   createButtonText: {
//     color: 'white',
//     marginLeft: 8,
//     fontWeight: '500',
//   },
//   list: {
//     padding: 16,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     flex: 1,
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginLeft: 8,
//   },
//   statusText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   infoText: {
//     marginLeft: 8,
//     color: '#555',
//     fontSize: 16,
//   },
//   highlightText: {
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   lastMessageContainer: {
//     backgroundColor: '#f9f9f9',
//     padding: 12,
//     borderRadius: 6,
//     marginTop: 8,
//     marginBottom: 8,
//   },
//   lastMessage: {
//     color: '#666',
//     fontSize: 16,
//   },
//   senderText: {
//     fontWeight: 'bold',
//     color: '#2196F3',
//   },
//   dateRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     paddingTop: 8,
//   },
//   dateText: {
//     fontSize: 14,
//     color: '#888',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     marginTop: 16,
//     fontSize: 18,
//     color: '#888',
//   },
//   emptyCreateButton: {
//     marginTop: 20,
//     backgroundColor: '#2196F3',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 5,
//   },
//   emptyCreateButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   modalContent: {
//     flex: 1,
//     padding: 16,
//   },
//   inputLabel: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#333',
//     fontWeight: '500',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 6,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 6,
//     marginBottom: 16,
//     overflow: 'hidden',
//   },
//   picker: {
//     width: '100%',
//   },
//   messageInput: {
//     height: 120,
//     textAlignVertical: 'top',
//   },
//   submitButton: {
//     backgroundColor: '#2196F3',
//     padding: 16,
//     borderRadius: 6,
//     alignItems: 'center',
//     marginTop: 24,
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default TicketsScreen;

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
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker'; 
import Navbar from '../Navbar/Navbar.js';

const TicketsScreen = ({ navigation }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    message: '',
    assignedToRole: 'support',
    assignedToRoleID: 'support_001'
  });
  const [isCreating, setIsCreating] = useState(false);
  const ip = useSelector((state) => state.ip.value);
  
  const currentUser = {
    id: 'admin_001', 
    role: 'admin', 
    name: 'Admin User'
  };

  const fetchAllTickets = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${ip}/getAllTickets`);
      const data = await response.json();

      if (response.ok) {
       
        let userTickets = [];
        if (currentUser.role === 'admin') {
          // Admins see all tickets assigned to them or created by them
          userTickets = data.filter(item => 
            item && item._id && (
              item.assignedTo?.roleID === currentUser.id ||
              item.createdBy?.roleID === currentUser.id
            )
          );
        } else {
          // Support agents see tickets they created or are assigned to them
          userTickets = data.filter(item => 
            item && item._id && (
              item.createdBy?.roleID === currentUser.id ||
              item.assignedTo?.roleID === currentUser.id
            )
          );
        }
        setTickets(userTickets);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch tickets');
        setTickets([]);
      }
    } catch (err) {
      console.error('Fetch tickets error:', err);
      Alert.alert('Error', 'Unable to fetch tickets. Please check your connection.');
      setTickets([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, [ip]);

  const handleCreateTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    setIsCreating(true);
    try {
      const response = await fetch(`${ip}/createTicket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTicket.title,
          createdByRole: currentUser.role,
          createdByRoleID: currentUser.id,
          assignedToRole: newTicket.assignedToRole,
          assignedToRoleID: newTicket.assignedToRoleID,
          chats: [{
            senderId: currentUser.id,
            senderRole: currentUser.role,
            message: newTicket.message,
            timestamp: new Date().toISOString()
          }]
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', 'Ticket created successfully');
        setShowCreateModal(false);
        setNewTicket({ 
          title: '', 
          message: '', 
          assignedToRole: 'support',
          assignedToRoleID: 'support_001'
        });
        fetchAllTickets();
      } else {
        Alert.alert('Error', data.error || 'Failed to create ticket');
      }
    } catch (err) {
      console.error('Create ticket error:', err);
      Alert.alert('Error', 'Unable to create ticket. Please check your connection.');
    } finally {
      setIsCreating(false);
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

  const renderTicket = ({ item }) => {
    if (!item) return null;
  
    const lastChat = item.chats?.length > 0 ? item.chats[item.chats.length - 1] : null;
    const lastMessage = lastChat?.message || '';
  
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('ticketChat', { 
          ticketId: item._id,
          ip: ip,
          title: item.title,
          status: item.status,
          currentUserRole: currentUser.role
        })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status || 'unknown'}</Text>
          </View>
        </View>
  
        <View style={styles.infoRow}>
          <Icon name="person-outline" size={18} color="#555" />
          <Text style={styles.infoText}>
            Created by: <Text style={styles.highlightText}>{item.createdBy?.role || 'N/A'} ({item.createdBy?.roleID || 'N/A'})</Text>
          </Text>
        </View>
  
        <View style={styles.infoRow}>
          <Icon name="assignment-ind" size={18} color="#555" />
          <Text style={styles.infoText}>
            Assigned to: <Text style={styles.highlightText}>{item.assignedTo?.role || 'N/A'} ({item.assignedTo?.roleID || 'N/A'})</Text>
          </Text>
        </View>
  
        <View style={styles.infoRow}>
          <Icon name="chat-bubble-outline" size={18} color="#555" />
          <Text style={styles.infoText}>
            {item.chats?.length || 0} message{item.chats?.length !== 1 ? 's' : ''}
          </Text>
        </View>
  
        {lastChat && (
          <View style={styles.lastMessageContainer}>
            <Text style={styles.lastMessage} numberOfLines={2}>
              <Text style={styles.senderText}>
                {lastChat.senderRole === 'admin' ? 'admin' : 'support'}:
              </Text> {lastMessage}
            </Text>
          </View>
        )}
  
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>
            Created: {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
          </Text>
          {/* <Text style={styles.dateText}>
            Updated: {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'N/A'}
          </Text> */}
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>
          {currentUser.role === 'admin' ? 'All Tickets' : 'My Tickets'}
        </Text>
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
        keyExtractor={(item) => item?._id || Math.random().toString()}
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
            <Text style={styles.emptyCreateButtonText}>Create New Ticket</Text>
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

            <Text style={styles.inputLabel}>Assign To Role</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newTicket.assignedToRole}
                style={styles.picker}
                onValueChange={(itemValue) => {
                  setNewTicket({
                    ...newTicket,
                    assignedToRole: itemValue,
                    assignedToRoleID: itemValue === 'support' ? 'support_001' : 'admin_001'
                  });
                } }
              >
                <Picker.Item label="Support" value="support" />
                <Picker.Item label="Admin" value="admin" />
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Assigned User ID</Text>
            <TextInput
              style={styles.input}
              value={newTicket.assignedToRoleID}
              editable={false} />

            <Text style={styles.inputLabel}>Initial Message</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Enter your message..."
              multiline
              numberOfLines={4}
              value={newTicket.message}
              onChangeText={(text) => setNewTicket({ ...newTicket, message: text })} />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCreateTicket}
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Create Ticket</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView><View style={styles.navbarContainer}>
        <Navbar />
      </View></>
  );
};
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  header: {
    padding: width * 0.04, // ~16px on 400 width
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    color: 'white',
    fontSize: width > 400 ? 22 : 20,
    fontWeight: 'bold',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingHorizontal: width * 0.03, // ~12px
    paddingVertical: height * 0.01, // ~8px on 800 height
    borderRadius: 4,
  },
  createButtonText: {
    color: 'white',
    marginLeft: width * 0.02, // ~8px
    fontWeight: '500',
    fontSize: width > 400 ? 16 : 14,
  },
  list: {
    padding: width * 0.04, // ~16px
    width: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: width * 0.04, // ~16px
    marginBottom: height * 0.015, // ~12px
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.0125, // ~10px
    width: '100%',
  },
  title: {
    fontSize: width > 400 ? 20 : 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: width * 0.02, // ~8px
    paddingVertical: height * 0.005, // ~4px
    borderRadius: 12,
    marginLeft: width * 0.02, // ~8px
  },
  statusText: {
    color: '#fff',
    fontSize: width > 400 ? 15 : 14,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01, // ~8px
    width: '100%',
  },
  infoText: {
    marginLeft: width * 0.02, // ~8px
    color: '#555',
    fontSize: width > 400 ? 17 : 16,
  },
  highlightText: {
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessageContainer: {
    backgroundColor: '#f9f9f9',
    padding: width * 0.03, // ~12px
    borderRadius: 6,
    marginTop: height * 0.01, // ~8px
    marginBottom: height * 0.01,
    width: '100%',
  },
  lastMessage: {
    color: '#666',
    fontSize: width > 400 ? 17 : 16,
  },
  senderText: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01, // ~8px
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: height * 0.01,
    width: '100%',
  },
  dateText: {
    fontSize: width > 400 ? 15 : 14,
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.1, // ~40px
    width: '100%',
  },
  emptyText: {
    marginTop: height * 0.02, // ~16px
    fontSize: width > 400 ? 20 : 18,
    color: '#888',
    textAlign: 'center',
  },
  emptyCreateButton: {
    marginTop: height * 0.025, // ~20px
    backgroundColor: '#2196F3',
    paddingHorizontal: width * 0.05, // ~20px
    paddingVertical: height * 0.015, // ~12px
    borderRadius: 5,
  },
  emptyCreateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width > 400 ? 17 : 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04, // ~16px
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  modalTitle: {
    fontSize: width > 400 ? 22 : 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: width * 0.04, // ~16px
    width: '100%',
  },
  inputLabel: {
    fontSize: width > 400 ? 17 : 16,
    marginBottom: height * 0.01, // ~8px
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: width * 0.03, // ~12px
    marginBottom: height * 0.02, // ~16px
    fontSize: width > 400 ? 17 : 16,
    width: '100%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: height * 0.02,
    overflow: 'hidden',
    width: '100%',
  },
  picker: {
    width: '100%',
    height: width > 400 ? 50 : 45,
  },
  messageInput: {
    height: height * 0.15, // ~120px
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: height * 0.02, // ~16px
    borderRadius: 6,
    alignItems: 'center',
    marginTop: height * 0.03, // ~24px
    width: '100%',
  },
  submitButtonText: {
    color: 'white',
    fontSize: width > 400 ? 17 : 16,
    fontWeight: 'bold',
  },
});

export default TicketsScreen;