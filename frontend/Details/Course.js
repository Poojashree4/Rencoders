
import React, { useState, useEffect } from 'react';
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
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Course() {
  const [courseID, setCourseID] = useState('');
  const [courseName, setCourseName] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [learningMode, setLearningMode] = useState('');
  const [duration, setDuration] = useState('');
  const [trainers, setTrainers] = useState('');
  const [courses, setCourses] = useState([]);
  const ip = useSelector((state) => state.ip.value);

  useEffect(() => {
    fetchCourses();
  }, [ip]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${ip}/displaycourses`, { 
        method: 'POST' 
      });
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Error', 'Failed to load course data');
    }
  };

  const addCourse = async () => {
    if (!courseID || !courseName || !coursePrice || !learningMode || !duration || !trainers) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${ip}/addcourse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseID,
          courseName,
          coursePrice: parseFloat(coursePrice),
          learningMode,
          duration: parseInt(duration),
          trainers: trainers.split(',').map(trainer => trainer.trim()),
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Course added successfully!');
        fetchCourses();
        resetForm();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      Alert.alert('Error', 'Failed to add course');
    }
  };

  const resetForm = () => {
    setCourseID('');
    setCourseName('');
    setCoursePrice('');
    setLearningMode('');
    setDuration('');
    setTrainers('');
  };

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Course Management</Text>
            <Text style={styles.headerSubtitle}>Create and manage your courses</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Courses</Text>
            {courses.length === 0 ? (
              <Text style={styles.emptyMessage}>No courses available yet</Text>
            ) : (
              courses.map((course, index) => (
                <LinearGradient
    key={index}
    colors={['#FC466B', '#3F5EFB']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.courseCardGradient}
  >
                <View key={index} style={styles.courseCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.courseName}>{course.courseName}</Text>
                    <View style={styles.priceBadge}>
                      <Text style={styles.priceText}>₹{course.coursePrice}</Text>
                    </View>
                  </View>
                  <Text style={styles.courseId}>ID: {course.courseID}</Text>
                  
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Mode</Text>
                      <Text style={styles.detailValue}>{course.learningMode}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Duration</Text>
                      <Text style={styles.detailValue}>{course.duration} hrs</Text>
                    </View>
                  </View>

                  <View style={styles.trainersContainer}>
                    <Text style={styles.trainersTitle}>Trainers:</Text>
                    <Text style={styles.trainersList}>{course.trainers.join(', ')}</Text>
                  </View>
                </View>
                </LinearGradient>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add New Course</Text>
            <View style={styles.formCard}>
              <Text style={styles.inputLabel}>Course ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter course ID"
                value={courseID}
                onChangeText={setCourseID}
              />

              <Text style={styles.inputLabel}>Course Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter course name"
                value={courseName}
                onChangeText={setCourseName}
              />

              <View style={styles.rowInputs}>
                <View style={styles.halfInputContainer}>
                  <Text style={styles.inputLabel}>Price (₹)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter price"
                    value={coursePrice}
                    onChangeText={setCoursePrice}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfInputContainer}>
                  <Text style={styles.inputLabel}>Duration (hrs)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter duration"
                    value={duration}
                    onChangeText={setDuration}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Learning Mode</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Online, Offline"
                value={learningMode}
                onChangeText={setLearningMode}
              />

              <Text style={styles.inputLabel}>Trainers</Text>
              <TextInput
                style={styles.input}
                placeholder="Comma separated trainer names"
                value={trainers}
                onChangeText={setTrainers}
              />

              <TouchableOpacity style={styles.submitButton} onPress={addCourse}>
                <Text style={styles.submitButtonText}>Add Course</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>

      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </>
  );
}



const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f5f7fa',
  },
  container: {
    flex: 1,
    paddingBottom: windowHeight * 0.025,
  },
  courseCardGradient: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 1, 
  },
  header: {
    padding: windowWidth * 0.06,
    backgroundColor: '#3F51B5',
    marginBottom: windowHeight * 0.025,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTitle: {
    fontSize: windowWidth * 0.065,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: windowHeight * 0.005,
  },
  headerSubtitle: {
    fontSize: windowWidth * 0.04,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: windowWidth * 0.04,
    marginBottom: windowHeight * 0.025,
  },
  sectionTitle: {
    fontSize: windowWidth * 0.05,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: windowHeight * 0.02,
    paddingLeft: windowWidth * 0.02,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    fontSize: windowWidth * 0.04,
    marginTop: windowHeight * 0.025,
    padding: windowWidth * 0.05,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: windowWidth * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: windowWidth * 0.04,
    marginBottom: windowHeight * 0.015,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: windowHeight * 0.01,
  },
  courseName: {
    fontSize: windowWidth * 0.045,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  priceBadge: {
    backgroundColor: '#E3F2FD',
    paddingVertical: windowHeight * 0.005,
    paddingHorizontal: windowWidth * 0.03,
    borderRadius: 12,
  },
  priceText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: windowWidth * 0.035,
  },
  courseId: {
    fontSize: windowWidth * 0.035,
    color: '#666',
    marginBottom: windowHeight * 0.015,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: windowHeight * 0.015,
  },
  detailItem: {
    width: '48%',
  },
  detailLabel: {
    fontSize: windowWidth * 0.03,
    color: '#888',
    marginBottom: windowHeight * 0.005,
  },
  detailValue: {
    fontSize: windowWidth * 0.035,
    fontWeight: '500',
    color: '#444',
  },
  trainersContainer: {
    marginTop: windowHeight * 0.01,
    paddingTop: windowHeight * 0.01,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  trainersTitle: {
    fontSize: windowWidth * 0.035,
    fontWeight: '600',
    color: '#555',
    marginBottom: windowHeight * 0.005,
  },
  trainersList: {
    fontSize: windowWidth * 0.035,
    color: '#666',
  },
  inputLabel: {
    fontSize: windowWidth * 0.035,
    fontWeight: '600',
    color: '#555',
    marginTop: windowHeight * 0.015,
    marginBottom: windowHeight * 0.007,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: windowWidth * 0.035,
    fontSize: windowWidth * 0.038,
    marginBottom: windowHeight * 0.015,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
  },
  submitButton: {
    backgroundColor: '#6C63FF',
    padding: windowHeight * 0.02,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: windowHeight * 0.01,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: windowWidth * 0.04,
  },
  navbarContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
