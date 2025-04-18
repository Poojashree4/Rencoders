

import React, { useState, useEffect } from 'react';
import { FlatList, Text, StyleSheet, View, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import Navbar from '../Navbar/Navbar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

import styles from './Attendancestyle';

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const ip = useSelector((state) => state.ip.value);

  useEffect(() => {
    fetchAttendance();
    // Set current date in the format shown in reference
    const date = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, [ip]);

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${ip}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch attendance');
      }

      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      Alert.alert('Error', 'Failed to load attendance data');
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 85) return '#4CAF50'; // Green
    if (percentage >= 70) return '#FFC107'; // Amber
    return '#F44336'; // Red
  };

  const renderStudentCard = ({ item: student }) => (
    <LinearGradient
    colors= {['#d0f3ff', '#ebd0ff']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card} 
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.studentName}>{student.studentName}</Text>
          <Text style={styles.studentDetail}>ID: {student.studentId}</Text>
        </View>
        <View style={styles.weekStatus}>
          <Text style={styles.weekDays}>M T W Th F</Text>
          <Text style={styles.weekPercentage}>100%</Text>
        </View>
      </View>
  
      {student.courses.map((course, index) => (
        <View key={`${student.studentId}-${index}`} style={styles.courseContainer}>
          <Text style={styles.courseTitle}>{course.courseName}</Text>
          <View style={styles.courseDetails}>
            <Text style={styles.courseDetail}>ID: {course.courseID}</Text>
            <Text style={styles.courseDetail}>Time: 9:30am</Text>
          </View>
  
          <View style={styles.attendanceStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>04</Text>
              <Text style={styles.statLabel}>Attendance Week</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>28</Text>
              <Text style={styles.statLabel}>Ongoing Days</Text>
            </View>
            <View style={styles.statItem}>
              <Progress.Circle
                size={80}
                progress={course.attendancePercentage / 100}
                showsText={true}
                formatText={() => `${course.attendancePercentage}%`}
                color={getProgressColor(course.attendancePercentage)}
                borderWidth={0}
                thickness={6}
                textStyle={styles.progressText}
              />
            </View>
          </View>
  
          {/* <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Ask Leave</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      ))}
    </LinearGradient>
  );
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Apply the LinearGradient background to the header */}
      <LinearGradient
        colors={['#4263ff', '#99f2c8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}  // Add gradient as background to the header
      >
        <Text style={styles.headerTitle}>Student Attendance</Text>
        <Text style={styles.headerSubtitle}>Take attendance today</Text>
      </LinearGradient>

      <Text style={styles.dateText}>{currentDate}</Text>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>This week status</Text>
      </View>

      <FlatList
        data={attendanceData}
        renderItem={renderStudentCard}
        keyExtractor={(item) => item.studentId}
        contentContainerStyle={styles.listContent}
      />
     
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </SafeAreaView>
  );
}
