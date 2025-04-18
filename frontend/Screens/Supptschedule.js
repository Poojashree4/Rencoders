
import React, { useState, useEffect } from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  View, 
  SafeAreaView, 
  TextInput, 
  FlatList, 
  Alert 
} from 'react-native';
import Navbar from '../Navbar/Navbar.js';
import Navbarsupt from '../Navbar/Navbarsupt.js';
import { useSelector } from 'react-redux';

export default function Supptschedule() {
  const [staffId, setStaffId] = useState('');
  const [staffName, setStaffName] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [scheduleEntries, setScheduleEntries] = useState([{ 
    day: '', 
    courseID: '', 
    courseName: '', 
    courseTime: '' 
  }]);
  const ip = useSelector((state) => state.ip.value);

  
  useEffect(() => {
    fetchSchedules();
  }, [ip]);

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`${ip}/courseschedule`, {
        method: 'POST',
      });
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      Alert.alert('Error', 'Failed to load schedule data');
    }
  };

  const addScheduleEntry = () => {
    setScheduleEntries([...scheduleEntries, { 
      day: '', 
      courseID: '', 
      courseName: '', 
      courseTime: '' 
    }]);
  };

  const removeScheduleEntry = (index) => {
    const newEntries = [...scheduleEntries];
    newEntries.splice(index, 1);
    setScheduleEntries(newEntries);
  };

  const updateScheduleEntry = (index, field, value) => {
    const newEntries = [...scheduleEntries];
    newEntries[index][field] = value;
    setScheduleEntries(newEntries);
  };

  const uploadSchedule = async () => {
    if (!staffId || !staffName) {
      Alert.alert('Validation Error', 'Please enter staff ID and name');
      return;
    }

    const invalidEntries = scheduleEntries.some(entry => 
      !entry.day || !entry.courseID || !entry.courseName || !entry.courseTime
    );

    if (invalidEntries) {
      Alert.alert('Validation Error', 'Please fill in all fields for each schedule entry');
      return;
    }

    const scheduleData = {
      staffId,
      staffName,
      schedule: scheduleEntries
    };

    try {
      const response = await fetch(`${ip}/uploadSchedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Schedule uploaded successfully');
        fetchSchedules();
        setStaffId('');
        setStaffName('');
        setScheduleEntries([{ day: '', courseID: '', courseName: '', courseTime: '' }]);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to upload schedule');
      }
    } catch (error) {
      console.error('Error uploading schedule:', error);
      Alert.alert('Error', 'Failed to upload schedule');
    }
  };

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleCard}>
      <Text style={styles.staffName}>{item.staffName}</Text>
      <Text style={styles.staffDetail}>Staff ID: {item.staffId}</Text>

      {item.schedule && item.schedule.map((session, idx) => (
        <View key={idx} style={styles.sessionContainer}>
          <Text style={styles.sessionDetail}>Day: {session.day}</Text>
          <Text style={styles.sessionDetail}>Course: {session.courseName} ({session.courseID})</Text>
          <Text style={styles.sessionDetail}>Time: {session.courseTime}</Text>

          {session.trainers && session.trainers.length > 0 && (
            <View style={styles.trainersContainer}>
              <Text style={styles.trainersTitle}>Trainers:</Text>
              {session.trainers.map((trainer, tIdx) => (
                <Text key={tIdx} style={styles.trainerDetail}>
                  - {trainer.staffName} ({trainer.staffId})
                </Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Staff Schedule Management</Text>
              
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Add New Schedule</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Staff ID"
                  value={staffId}
                  onChangeText={setStaffId}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Staff Name"
                  value={staffName}
                  onChangeText={setStaffName}
                />

                <Text style={styles.sectionTitle}>Schedule Entries</Text>

                {scheduleEntries.map((entry, index) => (
                  <View key={index} style={styles.entryContainer}>
                    <Text style={styles.entryNumber}>Entry #{index + 1}</Text>

                    <TextInput
                      style={styles.input}
                      placeholder="Day (e.g., Monday)"
                      value={entry.day}
                      onChangeText={(text) => updateScheduleEntry(index, 'day', text)}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Course ID"
                      value={entry.courseID}
                      onChangeText={(text) => updateScheduleEntry(index, 'courseID', text)}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Course Name"
                      value={entry.courseName}
                      onChangeText={(text) => updateScheduleEntry(index, 'courseName', text)}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Course Time (e.g., 9:00-11:00)"
                      value={entry.courseTime}
                      onChangeText={(text) => updateScheduleEntry(index, 'courseTime', text)}
                    />

                    {scheduleEntries.length > 1 && (
                      <Pressable
                        style={styles.removeButton}
                        onPress={() => removeScheduleEntry(index)}
                      >
                        <Text style={styles.removeButtonText}>Remove Entry</Text>
                      </Pressable>
                    )}
                  </View>
                ))}

                <Pressable style={styles.addButton} onPress={addScheduleEntry}>
                  <Text style={styles.buttonText}>+ Add Another Schedule Entry</Text>
                </Pressable>

                <Pressable style={styles.submitButton} onPress={uploadSchedule}>
                  <Text style={styles.buttonText}>Submit Schedule</Text>
                </Pressable>
              </View>

              <Text style={styles.subtitle}>Current Schedules</Text>
            </>
          }
          data={schedules}
          renderItem={renderScheduleItem}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={{ height: 80 }} />}
        />
      </SafeAreaView>
      
      <View style={styles.navbarContainer}>
        <Navbarsupt />
      </View>
    </>
  );
}
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: width * 0.05,
    backgroundColor: 'white',
    width: '100%'
  },
  title: { 
    fontSize: width > 400 ? 26 : 24,
    fontWeight: 'bold',
    marginBottom: height * 0.025,
    textAlign: 'center',
    color: '#333'
  },
  card: {
    padding: width * 0.05,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: height * 0.012,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%'
  },
  cardTitle: {
    fontSize: width > 400 ? 22 : 20,
    marginBottom: height * 0.018,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: 'bold',
    marginTop: height * 0.018,
    marginBottom: height * 0.012,
    color: '#555'
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: width * 0.03,
    marginVertical: height * 0.01,
    borderRadius: 5,
    backgroundColor: 'white',
    width: '100%'
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: height * 0.017,
    borderRadius: 8,
    marginVertical: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    width: '100%'
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: height * 0.017,
    borderRadius: 8,
    marginVertical: height * 0.01,
    width: '100%'
  },
  removeButton: {
    backgroundColor: '#dc3545',
    padding: height * 0.012,
    borderRadius: 5,
    marginTop: height * 0.006,
    alignSelf: 'flex-start'
  },
  removeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: width > 400 ? 15 : 14
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: width > 400 ? 17 : 16
  },
  subtitle: {
    fontSize: width > 400 ? 22 : 20,
    marginTop: height * 0.03,
    marginBottom: height * 0.018,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  scheduleCard: {
    padding: width * 0.037,
    backgroundColor: '#fff',
    marginVertical: height * 0.012,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: '100%'
  },
  entryContainer: {
    marginBottom: height * 0.018,
    padding: width * 0.025,
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d0e3ff',
    width: '100%'
  },
  entryNumber: {
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: height * 0.006
  },
  staffName: {
    fontSize: width > 400 ? 20 : 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.006
  },
  staffDetail: {
    fontSize: width > 400 ? 16 : 15,
    color: '#555',
    marginBottom: height * 0.012
  },
  sessionContainer: {
    marginVertical: height * 0.01,
    padding: width * 0.025,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#007BFF',
    width: '100%'
  },
  sessionDetail: {
    fontSize: width > 400 ? 16 : 15,
    marginVertical: height * 0.003,
    color: '#444'
  },
  trainersContainer: {
    marginTop: height * 0.01,
    paddingTop: height * 0.01,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    width: '100%'
  },
  trainersTitle: {
    fontWeight: 'bold',
    color: '#555'
  },
  trainerDetail: {
    fontSize: width > 400 ? 15 : 14,
    color: '#666',
    marginLeft: width * 0.025,
    marginTop: height * 0.003
  },
  navbarContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    width: '100%'
  }
});