

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
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get('window');

export default function Payment() {
  const [studentId, setStudentId] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [courses, setCourses] = useState([{ courseID: '', courseName: '', coursePrice: '', duration: '' }]);
  const [paymentList, setPaymentList] = useState([]);
  const ip = useSelector((state) => state.ip.value);
  
  // Course options data
  const courseOptions = [
    { id: 'MER120', name: 'Mern Stack', price: '12000' },
    { id: 'JV200', name: 'Java Full Stack', price: '15000' },
    { id: 'PY300', name: 'Python Full Stack', price: '13000' },
    { id: 'DSA500', name: 'Data Structures', price: '8000' },
    { id: 'RE400', name: 'React Advanced', price: '10000' }
  ];

  useEffect(() => {
    fetchPayments();
  }, [ip]);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${ip}/displaypaymentlist`, { method: 'GET' });
      const data = await response.json();
      setPaymentList(data);
    } catch (error) {
      console.error('Error fetching payment list:', error);
      Alert.alert('Error', 'Failed to load payment data');
    }
  };

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    
    // If changing course name, try to find matching course and auto-fill ID and price
    if (field === 'courseName') {
      const selectedCourse = courseOptions.find(c => c.name === value);
      if (selectedCourse) {
        newCourses[index].courseID = selectedCourse.id;
        newCourses[index].coursePrice = selectedCourse.price;
      }
    }
    // If changing course ID, try to find matching course and auto-fill name and price
    else if (field === 'courseID') {
      const selectedCourse = courseOptions.find(c => c.id === value);
      if (selectedCourse) {
        newCourses[index].courseName = selectedCourse.name;
        newCourses[index].coursePrice = selectedCourse.price;
      }
    }
    
    setCourses(newCourses);
  };

  const addCourseField = () => {
    setCourses([...courses, { courseID: '', courseName: '', coursePrice: '', duration: '' }]);
  };

  const removeCourseField = (index) => {
    if (courses.length > 1) {
      const newCourses = [...courses];
      newCourses.splice(index, 1);
      setCourses(newCourses);
    }
  };

  const addPayment = async () => {
    if (studentId && courses.length > 0 && amountPaid && paymentDate) {
      try {
        const parsedCourses = courses.map(course => ({
          ...course,
          coursePrice: parseFloat(course.coursePrice),
          duration: parseInt(course.duration, 10),
        }));
  
        const formattedDate = new Date(paymentDate).toISOString().split('T')[0];
  
        const response = await fetch(`${ip}/addpaymentlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            StudentId: studentId,
            courses: parsedCourses,
            amountPaid: parseFloat(amountPaid),
            paymentDate: formattedDate,
          }),
        });
  
        if (response.ok) {
          Alert.alert('Success', 'Payment added successfully!');
          fetchPayments();
          resetForm();
        } else {
          const errorResponse = await response.json();
          Alert.alert('Error', errorResponse.error || 'Failed to add payment');
        }
      } catch (error) {
        console.error('Error adding payment:', error);
        Alert.alert('Error', 'An error occurred while adding payment');
      }
    } else {
      Alert.alert('Error', 'Please fill in all required fields');
    }
  };
  
  const resetForm = () => {
    setStudentId('');
    setCourses([{ courseID: '', courseName: '', coursePrice: '', duration: '' }]);
    setAmountPaid('');
    setPaymentDate('');
  };

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Payment Management</Text>
            <Text style={styles.headerSubtitle}>Track and manage student payments</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Payments</Text>
            {paymentList.length === 0 ? (
              <Text style={styles.emptyMessage}>No payment records found</Text>
            ) : (
              paymentList.map((payment, index) => (
                             <LinearGradient
                 key={index}
                 colors={['#4263ff', '#99f2c8']}
                 start={{ x: 0, y: 0 }}
                 end={{ x: 1, y: 1 }}
                 style={styles.card}
               >
                             <View key={index} style={styles.card}>
                               <View style={styles.cardHeader}>
                                 <Text style={styles.studentName}>Student ID: {payment.studentId}</Text>
                                 <View style={styles.amountBadge}>
                                   <Text style={styles.amountText}>₹{payment.amountPaid}</Text>
                                 </View>
                               </View>
                               
                               <Text style={styles.paymentDate}>
                                 Paid on: {new Date(payment.paymentDate).toLocaleDateString()}
                               </Text>
                               
                               <View style={styles.courseContainer}>
                                 <Text style={styles.courseTitle}>Courses Enrolled:</Text>
                                 {payment.courses.map((course, idx) => (
                                   <View key={idx} style={styles.courseItem}>
                                     <Text style={styles.courseName}>- {course.courseName}</Text>
                                     <View style={styles.courseDetails}>
                                       <Text style={styles.courseDetail}>ID: {course.courseID}</Text>
                                       <Text style={styles.courseDetail}>Price: ₹{course.coursePrice}</Text>
                                       <Text style={styles.courseDetail}>{course.duration} hrs</Text>
                                     </View>
                                   </View>
                                  
                                 ))}
                               </View>
                               
                             </View>
                             </LinearGradient>
                           ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add New Payment</Text>
            <View style={styles.formCard}>
              <Text style={styles.inputLabel}>Student ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter student ID"
                value={studentId}
                onChangeText={setStudentId}
              />

              <Text style={styles.inputLabel}>Courses</Text>
              {courses.map((course, index) => (
                <View key={index} style={styles.courseInputGroup}>
                  <Text style={styles.inputLabel}>Course ID</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={course.courseID}
                      onValueChange={(value) => handleCourseChange(index, 'courseID', value)}
                      style={styles.picker}
                      dropdownIconColor="#666"
                      placeholder='select'
                    >
                      <Picker.Item label="Select Course ID" value="" />
                      {courseOptions.map((option) => (
                        <Picker.Item key={option.id} label={option.id} value={option.id} />
                      ))}
                    </Picker>
                  </View>

                  <Text style={styles.inputLabel}>Course Name</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={course.courseName}
                      onValueChange={(value) => handleCourseChange(index, 'courseName', value)}
                      style={styles.picker}
                      dropdownIconColor="#666"
                    >
                      <Picker.Item label="Select Course Name" value="" />
                      {courseOptions.map((option) => (
                        <Picker.Item key={option.id} label={option.name} value={option.name} />
                      ))}
                    </Picker>
                  </View>

                  <View style={styles.rowInputs}>
                    <TextInput
                      style={[styles.input, styles.halfInput]}
                      placeholder="Price"
                      value={course.coursePrice}
                      onChangeText={(value) => handleCourseChange(index, 'coursePrice', value)}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.input, styles.halfInput]}
                      placeholder="Duration (hrs)"
                      value={course.duration}
                      onChangeText={(value) => handleCourseChange(index, 'duration', value)}
                      keyboardType="numeric"
                    />
                  </View>
                  {courses.length > 1 && (
                    <TouchableOpacity 
                      style={styles.removeButton} 
                      onPress={() => removeCourseField(index)}
                    >
                      <Text style={styles.removeButtonText}>Remove Course</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity style={styles.addButton} onPress={addCourseField}>
                <Text style={styles.addButtonText}>+ Add Another Course</Text>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Amount Paid</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={amountPaid}
                onChangeText={setAmountPaid}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Payment Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={paymentDate}
                onChangeText={setPaymentDate}
              />

              <TouchableOpacity style={styles.submitButton} onPress={addPayment}>
                <Text style={styles.submitButtonText}>Record Payment</Text>
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
    paddingBottom: 20,
    width: '100%',
  },
  header: {
    padding: width * 0.06, 
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
    paddingHorizontal: width * 0.04,
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
    backgroundColor: 'rgba(250, 254, 255, 0.93)',
    borderRadius: 12,
    padding: width * 0.05, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: width * 0.90,
    alignSelf: 'center',
  },
  card: {
    backgroundColor:'#d2e2e8' ,
    borderRadius: 12,
    padding: 16,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: {
    fontSize: width > 400 ? 17 : 16,
    fontWeight: '600',
    color: '#333',
  },
  amountBadge: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  amountText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 14,
  },
  paymentDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  courseContainer: {
    marginTop: 8,
  },
  courseTitle: {
    fontSize: width > 400 ? 16 : 15,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  courseItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  courseName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseDetail: {
    fontSize: 13,
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
  halfInput: {
    width: '48%',
  },
  courseInputGroup: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addButton: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  addButtonText: {
    color: '#1976D2',
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
    width: '100%',
  },
  removeButtonText: {
    color: '#D32F2F',
    fontSize: 13,
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