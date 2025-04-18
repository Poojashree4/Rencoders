import React, { useState, useEffect } from 'react';
import { Pressable, Text, StyleSheet, View, SafeAreaView, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Navbar from '../Navbar/Navbar';

export default function Courselist({ route }) {
  const { courseName } = route.params;
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://192.168.1.22:4000/displaycourses', { method: 'POST' });
      const data = await response.json();
      const filteredCourses = data.filter(course => course.courseName === courseName);
      setCourses(filteredCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Course Details</Text>
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <View key={index} style={styles.courseCard}>
              <Text style={styles.courseDetail}>Course ID: {course.courseID}</Text>
              <Text style={styles.courseDetail}>Course Name: {course.courseName}</Text>
              <Text style={styles.courseDetail}>Price: {course.coursePrice}</Text>
              <Text style={styles.courseDetail}>Learning Mode: {course.learningMode}</Text>
              <Text style={styles.courseDetail}>Duration: {course.duration} hrs</Text>
              <Text style={styles.courseDetail}>Trainers: {course.trainers.join(', ')}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noCourseText}>No courses found</Text>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  courseCard: { padding: 20, backgroundColor: '#fff', marginVertical: 10, borderRadius: 10, elevation: 5 },
  courseDetail: { fontSize: 16, marginTop: 5 },
  noCourseText: { fontSize: 18, textAlign: 'center', marginTop: 20 },
});