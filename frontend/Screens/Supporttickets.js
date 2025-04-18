

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CreateSupportTicket = ({ navigation }) => {
  // Hardcoded user and IP data
  const user = {
    roleID: 'support_001', // Example roleID for the user
    username: 'john_doe', // Example username
    email: 'john.doe@example.com', // Example email
  };
  

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateTicket = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      const ticketData = {
        title: title,
        createdByRole: 'support',
        createdByRoleID: user.roleID, // Using the hardcoded user roleID
        assignedToRole: 'admin',
        assignedToRoleID: 'admin_001', // Default admin ID
        chats: [{
          senderId: user.roleID,
          senderRole: 'support',
          message: description,
          timestamp: new Date().toISOString()
        }]
      };

      const response = await fetch(`${ip}/createTicket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Ticket created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        throw new Error(data.error || 'Failed to create ticket');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'Unable to create ticket. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Ticket</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Title*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter ticket title"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        <Text style={styles.label}>Description*</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Describe your issue in detail"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCreateTicket}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Create Ticket</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    padding: 16,
    backgroundColor: '#2196F3',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  descriptionInput: {
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateSupportTicket;
