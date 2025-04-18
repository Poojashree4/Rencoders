

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
import Navbarsupt from '../Navbar/Navbarsupt';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';


import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


export default function Coursesuppt() {
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

         
        </SafeAreaView>
      </ScrollView>
     

      <View style={styles.navbarContainer}>
        <Navbarsupt />
      </View>
    </>
  );
}

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: '#f5f7fa',
//   },
//   container: {
//     flex: 1,
//     paddingBottom: 20,
//   },
//   courseCardGradient: {
//     borderRadius: 12,
//     marginBottom: 12,
//     padding: 1, // thin border-like padding for gradient edges
//   },
//   header: {
//     padding: 24,
//     backgroundColor: '#3F51B5',
//     // borderBottomLeftRadius: 20,
//     // borderBottomRightRadius: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   headerTitle: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: 'rgba(255,255,255,0.9)',
//     textAlign: 'center',
//   },
//   section: {
//     paddingHorizontal: 16,
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#444',
//     marginBottom: 16,
//     paddingLeft: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#6C63FF',
//   },
//   emptyMessage: {
//     textAlign: 'center',
//     color: '#888',
//     fontSize: 16,
//     marginTop: 20,
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//   },
//   formCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   courseCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   courseName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     flex: 1,
//   },
//   priceBadge: {
//     backgroundColor: '#E3F2FD',
//     paddingVertical: 4,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//   },
//   priceText: {
//     color: '#1976D2',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   courseId: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 12,
//   },
//   detailsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   detailItem: {
//     width: '48%',
//   },
//   detailLabel: {
//     fontSize: 12,
//     color: '#888',
//     marginBottom: 4,
//   },
//   detailValue: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#444',
//   },
//   trainersContainer: {
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   trainersTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#555',
//     marginBottom: 4,
//   },
//   trainersList: {
//     fontSize: 14,
//     color: '#666',
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#555',
//     marginTop: 12,
//     marginBottom: 6,
//   },
//   input: {
//     backgroundColor: '#f9f9f9',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 15,
//     marginBottom: 12,
//   },
//   rowInputs: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   halfInputContainer: {
//     width: '48%',
//   },
//   submitButton: {
//     backgroundColor: '#6C63FF',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//     shadowColor: '#6C63FF',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   submitButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   navbarContainer: {
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
// });

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f5f7fa',
  },
  container: {
    flex: 1,
    paddingBottom: 20,
    width: '100%',
  },
  courseCardGradient: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 1,
    width: width * 0.92,
    alignSelf: 'center',
  },
  header: {
    padding: 24,
    backgroundColor: '#3F51B5',
    marginBottom: 20,
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: width > 400 ? 18 : 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: width * 0.05,
    marginBottom: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: width > 400 ? 22 : 20,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 16,
    paddingLeft: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: width * 0.9,
    alignSelf: 'center',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: width * 0.9,
    alignSelf: 'center',
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: width * 0.92,
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseName: {
    fontSize: width > 400 ? 20 : 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  priceBadge: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  priceText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 14,
  },
  courseId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    width: '48%',
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  trainersContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  trainersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  trainersList: {
    fontSize: 14,
    color: '#666',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
    width: '100%',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfInputContainer: {
    width: '48%',
  },
  submitButton: {
    backgroundColor: '#6C63FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  navbarContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    width: '100%',
  },
});