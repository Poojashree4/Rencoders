

import React, { useState, useEffect, useRef } from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  View, 
  SafeAreaView, 
  TextInput, 
  ScrollView, 
  Alert, 
  TouchableOpacity 
} from 'react-native';
import Navbar from '../Navbar/Navbar';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, 
    shouldSetBadge: false,
  }),
});


export default function Trainer() {
  const [staffId, setStaffId] = useState('');
  const [staffName, setStaffName] = useState('');
  const [specificCourse, setSpecificCourse] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(''); 
  const [staffs, setStaffs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const ip = useSelector((state) => state.ip.value);

  useEffect(() => {
    fetchStaff();
  }, [ip]);

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${ip}/displaystaff`, {
        method: 'POST',
      });
      const data = await response.json();
      setStaffs(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      Alert.alert('Error', 'Failed to load staff data');
    }
  };

  const addStaff = async () => {
    if (staffId && staffName && specificCourse) {
      try {
        const response = await fetch(`${ip}/addstaff`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            staffId,
            staffName,
            specificCourse: specificCourse.split(',').map(course => course.trim()),
          }),
        });
  
        const responseData = await response.json();
  
        if (response.ok) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Success',
              body: 'Staff added successfully',
              sound: 'default',
            },
            trigger: null,
          });
          fetchStaff();
          setStaffId('');
          setStaffName('');
          setSpecificCourse('');
          setSelectedCourse('');
          setIsEditing(false);
        } else {
          const message = Array.isArray(responseData.error)
            ? responseData.error.join('\n')
            : responseData.error || 'Failed to add staff';
  
          Alert.alert('Error', message);
        }
      } catch (error) {
        console.error("Network or unexpected error:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } else {
      Alert.alert('Validation Error', 'Please fill in all fields');
    }
  };
  

  const updateStaff = async () => {
    if (staffId && staffName && specificCourse) {
      try {
        
        const coursesArray = specificCourse.split(',')
          .map(course => course.trim())
          .filter(course => course.length > 0);
  
        if (coursesArray.length === 0) {
          Alert.alert('Error', 'At least one course is required');
          return;
        }
  
        const response = await fetch(`${ip}/updatestaff`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            staffId: staffId.toString(), // Ensure it's a string
            staffName,
            specificCourse: coursesArray,
          }),
        });
  
        const responseData = await response.json();
        console.log('Update response:', responseData); // Log the response
  
        if (response.ok) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Trainer Updated',
              body: `Trainer ${staffName} updated successfully.`,
              sound: 'default',
            },
            trigger: null,
          });
  
          fetchStaff();
          setStaffId('');
          setStaffName('');
          setSpecificCourse('');
          setIsEditing(false);
        } else {
          Alert.alert('Update Failed', responseData.error || responseData.message || 'Could not update trainer');
        }
      } catch (error) {
        console.error('Update error:', error);
        Alert.alert('Error', 'An error occurred while updating trainer.');
      }
    } else {
      Alert.alert('Missing Fields', 'Please fill all the fields before updating.');
    }
  };
  const editStaff = (staff) => {
    setStaffId(staff.staffId);
    setStaffName(staff.staffName);
    setSpecificCourse(staff.specificCourse.join(', '));
    setIsEditing(true);
    
    // Scroll to top of the form
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <>
      <ScrollView 
        style={styles.scrollView}
        ref={scrollViewRef}
      >
        <LinearGradient
                  colors={['#f5f7fa', '#e4f1f9']}
                  style={styles.background}
         >
                  <SafeAreaView style={styles.container}>
                    <LinearGradient
                      colors={['#4263ff', '#99f2c8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.header}
                    >
            <Text style={styles.headerTitle}>Trainer Management</Text>
            <Text style={styles.headerSubtitle}>Manage your training staff</Text>
       </LinearGradient>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{isEditing ? '✏️ Edit Trainer' : ' Add New Trainer'}</Text>
            <Text style={styles.inputLabel}>Trainer ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter trainer ID"
              value={staffId}
              onChangeText={setStaffId}
              editable={!isEditing}
            />
            <Text style={styles.inputLabel}>Trainer Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter trainer name"
              value={staffName}
              onChangeText={setStaffName}
            />
            
            <Text style={styles.inputLabel}>Course Name</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCourse}
                onValueChange={(itemValue) => {
                  setSelectedCourse(itemValue);
                  // Add selected course to the comma-separated list
                  setSpecificCourse(prev => 
                    prev ? `${prev}, ${itemValue}` : itemValue
                  );
                }}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                <Picker.Item label="Select Course" value="" />
                <Picker.Item label="Mern Stack" value="Mern Stack" />
                <Picker.Item label="Java Full Stack" value="Java Full Stack" />
                <Picker.Item label="Python Full Stack" value="Python Full Stack" />
                <Picker.Item label="Data Structures" value="Data Structures" />
                <Picker.Item label="React Advanced" value="React Advanced" />
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Assigned Courses (comma-separated)</Text>
            <TextInput
              style={styles.input}
              placeholder="Comma-separated course list"
              value={specificCourse}
              onChangeText={setSpecificCourse}
            />
            
            <Pressable 
              style={[styles.button, isEditing ? styles.updateButton : styles.addButton]} 
              onPress={isEditing ? updateStaff : addStaff}
            >
              <Text style={styles.buttonText}>
                {isEditing ? ' Update Trainer' : ' Add Trainer'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}> Trainer List</Text>

          {staffs.length === 0 ? (
            <Text style={styles.emptyMessage}>No trainers added yet</Text>
          ) : (
            staffs.map((staff) => (
              <TouchableOpacity
                key={staff.staffId}
                onPress={() => navigation.navigate('trainerlist', { staff })}
              >
                <LinearGradient
                  colors={['#e7cef7', '#c1f3ff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.staffCard}
                >
                  <View style={styles.staffInfo}>
                    <View>
                      <Text style={styles.staffName}>👤 {staff.staffName}</Text>
                      <Text style={styles.staffDetail}>ID: {staff.staffId}</Text>
                      <Text style={styles.staffCourse}>Course: {staff.specificCourse}</Text>
                    </View>
                    <Pressable 
                      style={styles.editButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        editStaff(staff);
                      }}
                    >
                      <FontAwesome6 name="edit" size={width * 0.05} color="black" />
                    </Pressable>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))
          )}
        </SafeAreaView>
        </LinearGradient>
      </ScrollView>

      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </>
  );
}

import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f5f7fa',
  },
  container: {
    flex: 1,
    padding: width * 0.0375, // 15px equivalent
    backgroundColor: '#f5f7fa',
    width: '100%',
  },
  header: {
    padding: width * 0.05, // 20px equivalent
    backgroundColor: '#3F51B5',
    borderRadius: 15,
    marginBottom: height * 0.025, // 20px equivalent
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    width: '100%',
  },
  headerTitle: {
    fontSize: width > 400 ? 28 : 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: width > 400 ? 18 : 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  card: {
    padding: width * 0.05, // 20px equivalent
    backgroundColor: 'white',
    borderRadius: 15,
    marginVertical: height * 0.0125, // 10px equivalent
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
  },
  cardTitle: {
    fontSize: width > 400 ? 22 : 20,
    marginBottom: height * 0.01875, // 15px equivalent
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: '600',
    color: '#555',
    marginTop: height * 0.0125, // 10px equivalent
    marginBottom: height * 0.00625, // 5px equivalent
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: width * 0.03, // 12px equivalent
    borderRadius: 8,
    marginVertical: height * 0.00625, // 5px equivalent
    backgroundColor: '#f9f9f9',
    fontSize: width > 400 ? 18 : 16,
    width: '100%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: height * 0.00625, // 5px equivalent
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    width: '100%',
  },
  picker: {
    width: '100%',
    height: width > 400 ? 55 : 50,
    color: '#333',
  },
  button: {
    padding: width * 0.0375, // 15px equivalent
    borderRadius: 8,
    marginVertical: height * 0.0125, // 10px equivalent
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  updateButton: {
    backgroundColor: '#FFA500',
  },
  buttonText: {
    color: '#fff',
    fontSize: width > 400 ? 18 : 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: width > 400 ? 22 : 20,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginTop: height * 0.025, // 20px equivalent
    marginBottom: height * 0.01875, // 15px equivalent
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    fontSize: width > 400 ? 18 : 16,
    marginTop: height * 0.025, // 20px equivalent
  },
  staffCard: {
    padding: width * 0.045, // 18px equivalent
    backgroundColor: '#d2e2e8',
    marginVertical: width * 0.02, // 8px equivalent
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  staffInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  staffName: {
    fontSize: width > 400 ? 20 : 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.00625, // 5px equivalent
  },
  staffDetail: {
    fontSize: width > 400 ? 16 : 14,
    color: '#666',
    marginTop: height * 0.00375, // 3px equivalent
  },
  editButton: {
    padding: width * 0.02, // 8px equivalent
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
  },
  navbarContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    width: '100%',
  },
});