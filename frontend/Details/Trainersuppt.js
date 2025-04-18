

// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Pressable, 
//   Text, 
//   StyleSheet, 
//   View, 
//   SafeAreaView, 
//   TextInput, 
//   ScrollView, 
//   Alert, 
//   TouchableOpacity 
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// import Navbarsupt from '../Navbar/Navbarsupt';
// import { useSelector } from 'react-redux';

// export default function Trainersuppt() {
//   const [staffId, setStaffId] = useState('');
//   const [staffName, setStaffName] = useState('');
//   const [specificCourse, setSpecificCourse] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState(''); // New state for course picker
//   const [staffs, setStaffs] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const navigation = useNavigation();
//   const scrollViewRef = useRef();
//   const ip = useSelector((state) => state.ip.value);

//   useEffect(() => {
//     fetchStaff();
//   }, [ip]);

//   const fetchStaff = async () => {
//     try {
//       const response = await fetch(`${ip}/displaystaff`, {
//         method: 'POST',
//       });
//       const data = await response.json();
//       setStaffs(data);
//     } catch (error) {
//       console.error('Error fetching staff:', error);
//       Alert.alert('Error', 'Failed to load staff data');
//     }
//   };

  
//   return (
//     <>
//       <ScrollView 
//         style={styles.scrollView}
//         ref={scrollViewRef}
//       >
//         <SafeAreaView style={styles.container}>
//           <View style={styles.header}>
//             <Text style={styles.headerTitle}>Trainer Management</Text>
//             <Text style={styles.headerSubtitle}>Manage your training staff</Text>
//           </View>

          
//           <Text style={styles.sectionTitle}> Trainer List</Text>

//           {staffs.length === 0 ? (
//             <Text style={styles.emptyMessage}>No trainers added yet</Text>
//           ) : (
//             staffs.map((staff) => (
//               <TouchableOpacity
//                 key={staff.staffId}
//                 style={styles.staffCard}
//                 onPress={() => navigation.navigate('trainerlist', { staff })}
//               >
//                 <View style={styles.staffInfo}>
//                   <View>
//                     <Text style={styles.staffName}>👤 {staff.staffName}</Text>
//                     <Text style={styles.staffDetail}> ID: {staff.staffId}</Text>
//                   </View>
//                   <Pressable style={styles.editButton} onPress={() => editStaff(staff)}>
//                     <FontAwesome6 name="edit" size={20} color="#4A90E2" />
//                   </Pressable>
//                 </View>
//               </TouchableOpacity>
//             ))
//           )}
//         </SafeAreaView>
//       </ScrollView>

//       <View style={styles.navbarContainer}>
//         <Navbarsupt />
//       </View>
//     </>
//   );
// }


// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: '#f5f7fa',
//   },
//   container: {
//     flex: 1,
//     padding: 15,
//     backgroundColor: '#f5f7fa',
//   },
//   header: {
//     padding: 20,
//     backgroundColor: '#3F51B5',
//     borderRadius: 15,
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
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: 'rgba(255,255,255,0.9)',
//     textAlign: 'center',
//   },
//   card: {
//     padding: 20,
//     backgroundColor: 'white',
//     borderRadius: 15,
//     marginVertical: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 20,
//     marginBottom: 15,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#555',
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   input: {
//     borderColor: '#ddd',
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 5,
//     backgroundColor: '#f9f9f9',
//     fontSize: 16,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     marginVertical: 5,
//     backgroundColor: '#f9f9f9',
//     overflow: 'hidden',
//   },
//   picker: {
//     width: '100%',
//     height: 50,
//     color: '#333',
//   },
//   button: {
//     padding: 15,
//     borderRadius: 8,
//     marginVertical: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   addButton: {
//     backgroundColor: '#4CAF50',
//   },
//   updateButton: {
//     backgroundColor: '#FFA500',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#6C63FF',
//     marginTop: 20,
//     marginBottom: 15,
//   },
//   emptyMessage: {
//     textAlign: 'center',
//     color: '#888',
//     fontSize: 16,
//     marginTop: 20,
//   },
//   staffCard: {
//     padding: 18,
//     backgroundColor: '#d2e2e8',
//     marginVertical: 8,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   staffInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   staffName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   staffDetail: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 3,
//   },
//   editButton: {
//     padding: 8,
//     borderRadius: 20,
//     backgroundColor: '#f0f4ff',
//   },
//   navbarContainer: {
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
// });

// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Pressable, 
//   Text, 
//   StyleSheet, 
//   View, 
//   SafeAreaView, 
//   TextInput, 
//   ScrollView, 
//   Alert, 
//   TouchableOpacity 
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// import Navbarsupt from '../Navbar/Navbarsupt';
// import { useSelector } from 'react-redux';
// import { LinearGradient } from 'expo-linear-gradient';

// export default function Trainersuppt() {
//   const [staffId, setStaffId] = useState('');
//   const [staffName, setStaffName] = useState('');
//   const [specificCourse, setSpecificCourse] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [staffs, setStaffs] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const navigation = useNavigation();
//   const scrollViewRef = useRef();
//   const ip = useSelector((state) => state.ip.value);

//   useEffect(() => {
//     fetchStaff();
//   }, [ip]);

//   const fetchStaff = async () => {
//     try {
//       const response = await fetch(`${ip}/displaystaff`, {
//         method: 'POST',
//       });
//       const data = await response.json();
//       setStaffs(data);
//     } catch (error) {
//       console.error('Error fetching staff:', error);
//       Alert.alert('Error', 'Failed to load staff data');
//     }
//   };

//   const editStaff = (staff) => {
//     setStaffId(staff.staffId);
//     setStaffName(staff.staffName);
//     setSpecificCourse(staff.specificCourse);
//     setIsEditing(true);
//     scrollViewRef.current?.scrollTo({ y: 0, animated: true });
//   };

//   return (
//     <>
//       <ScrollView 
//         style={styles.scrollView}
//         ref={scrollViewRef}
//       >
//         <LinearGradient
//           colors={['#f5f7fa', '#e4f1f9']}
//           style={styles.background}
//         >
//           <SafeAreaView style={styles.container}>
//             <LinearGradient
//               colors={['#4263ff', '#99f2c8']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.header}
//             >
//               <Text style={styles.headerTitle}>Trainer Management</Text>
//               <Text style={styles.headerSubtitle}>Manage your training staff</Text>
//             </LinearGradient>

           
              

//             <Text style={styles.sectionTitle}>Trainer List</Text>

//             {staffs.length === 0 ? (
//               <View style={styles.emptyContainer}>
//                 <Text style={styles.emptyMessage}>No trainers added yet</Text>
//               </View>
//             ) : (
//               staffs.map((staff) => (
//                 <TouchableOpacity
//                   key={staff.staffId}
//                   onPress={() => navigation.navigate('trainerlist', { staff })}
//                 >
//                   <LinearGradient
//                     colors={['#4e54c8', '#8f94fb']}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.staffCard}
//                   >
//                     <View style={styles.staffInfo}>
//                       <View>
//                         <Text style={styles.staffName}>👤 {staff.staffName}</Text>
//                         <Text style={styles.staffDetail}>ID: {staff.staffId}</Text>
//                         <Text style={styles.staffCourse}>Course: {staff.specificCourse}</Text>
//                       </View>
//                       <Pressable 
//                         style={styles.editButton}
//                         onPress={(e) => {
//                           e.stopPropagation();
//                           editStaff(staff);
//                         }}
//                       >
//                         <FontAwesome6 name="edit" size={20} color="white" />
//                       </Pressable>
//                     </View>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               ))
//             )}
//           </SafeAreaView>
//         </LinearGradient>
//       </ScrollView>

//       <View style={styles.navbarContainer}>
//         <Navbarsupt />
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   scrollView: {
//     flex: 1,
//   },
//   background: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     padding: 15,
//     paddingBottom: 80,
//   },
//   header: {
//     padding: 25,
//     borderRadius: 15,
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
//     textShadowColor: 'rgba(0,0,0,0.2)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: 'rgba(255,255,255,0.9)',
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   card: {
//     padding: 20,
//     backgroundColor: 'white',
//     borderRadius: 15,
//     marginVertical: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 20,
//     marginBottom: 15,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#555',
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   input: {
//     borderColor: '#ddd',
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 5,
//     backgroundColor: '#f9f9f9',
//     fontSize: 16,
//   },
//   button: {
//     padding: 15,
//     borderRadius: 8,
//     marginVertical: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   addButton: {
//     backgroundColor: '#4CAF50',
//   },
//   updateButton: {
//     backgroundColor: '#FFA500',
//   },
//   cancelButton: {
//     backgroundColor: '#F44336',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1f4037',
//     marginTop: 20,
//     marginBottom: 15,
//     paddingLeft: 10,
//   },
//   emptyContainer: {
//     padding: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   emptyMessage: {
//     textAlign: 'center',
//     color: '#888',
//     fontSize: 16,
//   },
//   staffCard: {
//     padding: 18,
//     marginVertical: 8,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   staffInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   staffName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 5,
//   },
//   staffDetail: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.9)',
//     marginTop: 3,
//   },
//   staffCourse: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.9)',
//     marginTop: 3,
//     fontStyle: 'italic',
//   },
//   editButton: {
//     padding: 10,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//   },
//   navbarContainer: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
// });

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
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Navbarsupt from '../Navbar/Navbarsupt';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Trainersuppt() {
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

  const editStaff = (staff) => {
    setStaffId(staff.staffId);
    setStaffName(staff.staffName);
    setSpecificCourse(staff.specificCourse);
    setIsEditing(true);
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

            <Text style={styles.sectionTitle}>Trainer List</Text>

            {staffs.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyMessage}>No trainers added yet</Text>
              </View>
            ) : (
              staffs.map((staff) => (
                <TouchableOpacity
                  key={staff.staffId}
                  onPress={() => navigation.navigate('trainerlist', { staff })}
                >
                  <LinearGradient
                    colors={['#f6b7ff', '#8f94fb']}
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
                        <FontAwesome6 name="edit" size={width * 0.05} color="white" />
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
        <Navbarsupt />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: width,
  },
  background: {
    flex: 1,
    minHeight: height,
  },
  container: {
    flex: 1,
    padding: width * 0.04,
    paddingBottom: height * 0.1,
  },
  header: {
    padding: height * 0.03,
    borderRadius: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.3,
    shadowRadius: width * 0.02,
    elevation: 5,
  },
  headerTitle: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: width * 0.002, height: height * 0.002 },
    textShadowRadius: width * 0.01,
  },
  headerSubtitle: {
    fontSize: width * 0.04,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: height * 0.005,
  },
  card: {
    padding: width * 0.05,
    backgroundColor: 'white',
    borderRadius: width * 0.04,
    marginVertical: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.002 },
    shadowOpacity: 0.1,
    shadowRadius: width * 0.02,
    elevation: 3,
  },
  cardTitle: {
    fontSize: width * 0.05,
    marginBottom: height * 0.02,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#555',
    marginTop: height * 0.01,
    marginBottom: height * 0.005,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: height * 0.015,
    borderRadius: width * 0.02,
    marginVertical: height * 0.005,
    backgroundColor: '#f9f9f9',
    fontSize: width * 0.04,
  },
  button: {
    padding: height * 0.02,
    borderRadius: width * 0.02,
    marginVertical: height * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.002 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.01,
    elevation: 3,
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  updateButton: {
    backgroundColor: '#FFA500',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#1f4037',
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
    paddingLeft: width * 0.03,
  },
  emptyContainer: {
    padding: height * 0.03,
    backgroundColor: 'white',
    borderRadius: width * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.001 },
    shadowOpacity: 0.1,
    shadowRadius: width * 0.01,
    elevation: 2,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    fontSize: width * 0.04,
  },
  staffCard: {
    padding: height * 0.02,
    marginVertical: height * 0.01,
    borderRadius: width * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.002 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.01,
    elevation: 3,
  },
  staffInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  staffName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: height * 0.005,
  },
  staffDetail: {
    fontSize: width * 0.035,
    color: 'rgba(255,255,255,0.9)',
    marginTop: height * 0.003,
  },
  staffCourse: {
    fontSize: width * 0.035,
    color: 'rgba(255,255,255,0.9)',
    marginTop: height * 0.003,
    fontStyle: 'italic',
  },
  editButton: {
    padding: height * 0.012,
    borderRadius: width * 0.05,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});