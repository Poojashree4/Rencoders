

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
import Navbarsupt from '../Navbar/Navbarsupt';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const { width, height } = Dimensions.get('window');

export default function Paymentsuppt() {
  const [studentId, setStudentId] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [courses, setCourses] = useState([{ courseID: '', courseName: '', coursePrice: '', duration: '' }]);
  const [paymentList, setPaymentList] = useState([]);
  const ip = useSelector((state) => state.ip.value);
  
 
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

        
             

            
        </SafeAreaView>
      </ScrollView>
      
      <View style={styles.navbarContainer}>
        <Navbarsupt />
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
  },
  header: {
    padding: 24,
    backgroundColor: '#3F51B5',
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
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
  },
  formCard: {
    backgroundColor:' rgba(250, 254, 255, 0.93)',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 16,
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
    fontSize: 15,
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
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
});