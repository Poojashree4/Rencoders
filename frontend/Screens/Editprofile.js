import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function EditProfile({ route, navigation }) {
  const { userEmail, currentName, currentPhone, currentExperience, currentLocation } = route.params;

  const [name, setName] = useState(currentName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentPhone || '');
  const [experience, setExperience] = useState(currentExperience || '');
  const [location, setLocation] = useState(currentLocation || '');
  const [loading, setLoading] = useState(false);
  const ip = useSelector((state) => state.ip.value);

  const handleProfileUpdate = async () => {
    if (!name && !phoneNumber && !experience && !location) {
      Alert.alert("Error", "Please provide at least one field to update.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ip}/profileupdate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          name: name || undefined,
          phoneNumber: phoneNumber || undefined,
          experience: experience || undefined,
          location: location || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Profile update failed');
      }

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack(); // Navigate back to the profile screen

    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter new name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter experience"
        value={experience}
        onChangeText={setExperience}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
      />

      <Pressable style={styles.button} onPress={handleProfileUpdate} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Updating..." : "Update Profile"}</Text>
      </Pressable>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: windowWidth * 0.05, 
    backgroundColor: 'rgba(246, 238, 249, 0.93)',
  },
  title: {
    fontSize: windowWidth * 0.06, 
    fontWeight: 'bold',
    marginBottom: windowHeight * 0.025, 
    textAlign: 'center',
  },
  input: {
    height: windowHeight * 0.065,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: windowWidth * 0.03,
    marginBottom: windowHeight * 0.02,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: windowHeight * 0.07, 
    backgroundColor: '#4169e1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: windowWidth * 0.045, 
    fontWeight: 'bold',
  },
  list: {
    padding: windowWidth * 0.03,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: windowWidth * 0.04,
    marginBottom: windowHeight * 0.015,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: windowWidth * 0.94,
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: windowHeight * 0.01,
  },
});

