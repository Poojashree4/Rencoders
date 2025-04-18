

import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Navbar from '../Navbar/Navbar';
const Studentlist = ({ route }) => {
  const { student } = route.params; // Retrieve the student details

  return (
    <><ScrollView style={styles.container}>
      {/* Profile Image - Placeholder */}
      <Image
        source={{ uri: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png' }} 
        style={styles.profileImage} />

      <Text style={styles.name}>{student.studentname}</Text>
      <Text style={styles.title}>Student Details</Text>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Student ID:</Text>
        <Text style={styles.detailValue}>{student.studentId}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Learning Mode:</Text>
        <Text style={styles.detailValue}>{student.learningMode}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Total Duration:</Text>
        <Text style={styles.detailValue}>{student.totalDuration} hrs</Text>
      </View>

      {/* <View style={styles.detailContainer}>
      <Text style={styles.detailLabel}>Student Status:</Text>
      <Text style={styles.detailValue}>{student.status} </Text>
    </View> */}

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Student Status:</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: student.status === 'Active' ? 'green' : 'red' }
            ]} />
          <Text
            style={[
              styles.detailValue,
              { color: student.status === 'Active' ? 'green' : 'red' }
            ]}
          >
            {student.status}
          </Text>
        </View>
      </View>


      <Text style={styles.sectionTitle}>Courses:</Text>
      {student.courses.map((course, index) => (
        <View key={index} style={styles.courseContainer}>
          <Text style={styles.courseName}>📘 {course.courseName}</Text>
          <Text style={styles.courseDetail}>🆔 Course ID: {course.courseID}</Text>
          <Text style={styles.courseDetail}>⏳ Duration: {course.duration} hrs</Text>
        </View>
      ))}

    </ScrollView><View style={styles.navbarContainer}>
        <Navbar />
      </View></>
  );
};

import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: width * 0.0625, 
    backgroundColor: 'white',
    width: '100%',
  },
  profileImage: {
    width: width * 0.25, 
    height: width * 0.25,
    borderRadius: width * 0.125, 
    alignSelf: 'center',
    marginBottom: height * 0.025,
  },
  name: {
    fontSize: width > 400 ? 26 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.006, 
    color: '#333',
  },
  title: {
    fontSize: width > 400 ? 20 : 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: height * 0.03, 
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.018, 
    paddingBottom: height * 0.018,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  detailLabel: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: 'bold',
    color: '#444',
  },
  detailValue: {
    fontSize: width > 400 ? 18 : 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: width > 400 ? 22 : 20,
    fontWeight: 'bold',
    marginTop: height * 0.025,
    marginBottom: height * 0.012, 
    color: '#4B0082',
    textAlign: 'center',
  },
  courseContainer: {
    backgroundColor: '#E6E6FA',
    padding: width * 0.0375, 
    borderRadius: 10,
    marginBottom: height * 0.012, 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { 
      width: width * 0.005, 
      height: width * 0.005 
    },
    shadowRadius: width * 0.01,
    elevation: 3,
    width: '100%',
  },
  courseName: {
    fontSize: width > 400 ? 20 : 18,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: height * 0.006, 
  },
  courseDetail: {
    fontSize: width > 400 ? 18 : 16,
    color: '#333',
    marginBottom: height * 0.0037,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: width * 0.025, 
    height: width * 0.025,
    borderRadius: width * 0.0125, 
    marginRight: width * 0.0125, 
  }
});


export default Studentlist;
