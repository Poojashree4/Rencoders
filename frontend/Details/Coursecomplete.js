// import React, { useState, useEffect } from 'react';
// import { FlatList, Text, StyleSheet, View, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
// import * as Progress from 'react-native-progress';
// import Navbar from '../Navbar/Navbar';
// import { useSelector } from 'react-redux';
// import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
// import {  Dimensions } from 'react-native';

// const { width, height } = Dimensions.get('window');


// export default function CourseComplete() {
//   const [completionData, setCompletionData] = useState([]);
//   const [currentDate, setCurrentDate] = useState('');
//   const ip = useSelector((state) => state.ip.value);  

//   useEffect(() => {
//     fetchCompletionData();
//     // Set current date
//     const date = new Date();
//     const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
//     setCurrentDate(date.toLocaleDateString('en-US', options));
//   }, []);

//   const fetchCompletionData = async () => {
//     try {
//       const response = await fetch(`${ip}/coursecomplete`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           completionThreshold: 90 // Set your completion threshold here
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch completion data');
//       }

//       const data = await response.json();
//       setCompletionData(data.students || []);
//     } catch (error) {
//       console.error('Error fetching completion data:', error);
//       Alert.alert('Error', 'Failed to load course completion data');
//     }
//   };

//   const renderCompletionCard = ({ item }) => (
//     <LinearGradient
//     colors={['#99f2c8', '#8f94fb']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.card} // Apply the gradient to the card
//     >
//       <View style={styles.cardHeader}>
//         <View>
//           <Text style={styles.studentName}>👤 {item.studentName}</Text>
//           <Text style={styles.studentDetail}>ID: {item.studentId}</Text>
//         </View>
//         <View style={styles.completionBadge}>
//           <Text style={[styles.completionText, { color: item.isCourseComplete ? '#4CAF50' : '#F44336' }]}>
//             {item.isCourseComplete ? 'COMPLETED' : 'IN PROGRESS'}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.detailsContainer}>
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Total Duration:</Text>
//           <Text style={styles.detailValue}>{item.totalDuration} hours</Text>
//         </View>

//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Completion Date:</Text>
//           <Text style={styles.detailValue}>
//             {item.completionDate ? new Date(item.completionDate).toLocaleDateString() : 'Not completed'}
//           </Text>
//         </View>

//         <View style={styles.progressContainer}>
//           <Progress.Bar
//             progress={item.totalDuration / 100} // Assuming 100 is max
//             width={200}
//             height={10}
//             color={item.isCourseComplete ? '#4CAF50' : '#FFC107'}
//             borderRadius={5}
//           />
//           <Text style={styles.progressText}>
//             {Math.min(100, Math.round(item.totalDuration))}% Complete
//           </Text>
//         </View>
//       </View>

//       <View style={styles.actionButtons}>
//         <TouchableOpacity style={styles.actionButton}>
//           <Text style={styles.actionButtonText}>View Details</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.actionButton}>
//           <Text style={styles.actionButtonText}>Certificate</Text>
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Course Completion</Text>
//         <Text style={styles.headerSubtitle}>Track student progress</Text>
//       </View>

//       <Text style={styles.dateText}>{currentDate}</Text>

//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Completion Status</Text>
//       </View>

//       <FlatList
//         data={completionData}
//         renderItem={renderCompletionCard}
//         keyExtractor={(item) => item.studentId.toString()}
//         contentContainerStyle={styles.listContent}
//       />

//       <View style={styles.navbarContainer}>
//         <Navbar />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     padding: 16,
//     backgroundColor: '#3F51B5',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: 'white',
//     marginBottom: 12,
//   },
//   dateText: {
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'center',
//     paddingVertical: 12,
//     backgroundColor: '#E8EAF6',
//   },
//   sectionHeader: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   listContent: {
//     paddingBottom: 80,
//   },
//   card: {
//     backgroundColor: 'transparent', // Transparent background as the gradient will fill it
//     borderRadius: 8,
//     margin: 8,
//     padding: 16,
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
//     marginBottom: 12,
//   },
//   studentName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   studentDetail: {
//     fontSize: 14,
//     color: '#666',
//   },
//   completionBadge: {
//     backgroundColor: '#f0f0f0',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//   },
//   completionText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   detailsContainer: {
//     marginVertical: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#666',
//   },
//   detailValue: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333',
//   },
//   progressContainer: {
//     marginTop: 16,
//     alignItems: 'center',
//   },
//   progressText: {
//     marginTop: 8,
//     fontSize: 14,
//     color: '#666',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//   },
//   actionButton: {
//     backgroundColor: '#E8EAF6',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 16,
//     width: '48%',
//     alignItems: 'center',
//   },
//   actionButtonText: {
//     color: '#3F51B5',
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });


import React, { useState, useEffect } from 'react';
import { FlatList, Text, StyleSheet, View, SafeAreaView, Alert, TouchableOpacity,Image } from 'react-native';
import * as Progress from 'react-native-progress';
import Navbar from '../Navbar/Navbar';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import {  Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


export default function CourseComplete() {
  const [completionData, setCompletionData] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const ip = useSelector((state) => state.ip.value);  
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    fetchCompletionData();
    // Set current date
    const date = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  const fetchCompletionData = async () => {
    try {
      const response = await fetch(`${ip}/coursecomplete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completionThreshold: 90 // Set your completion threshold here
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch completion data');
      }

      const data = await response.json();
      setCompletionData(data.students || []);
    } catch (error) {
      console.error('Error fetching completion data:', error);
      Alert.alert('Error', 'Failed to load course completion data');
    }
  };

  const CertificateModal = ({ student, onClose }) => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Image
          source={{ uri: 'https://www.simplilearn.com/ice9/skillupcertificates/Introduction_to_Data_Science.png' }}
          style={styles.certificateImage}
          resizeMode="contain"
        />
        <Text style={styles.certificateName}>{student.studentName}</Text>
        <Text style={styles.certificateCourse}>for completing {student.courseName}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderCompletionCard = ({ item }) => (
    <LinearGradient
    colors={['#cef4f7', '#ced3ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card} // Apply the gradient to the card
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.studentName}>👤 {item.studentName}</Text>
          <Text style={styles.studentDetail}>ID: {item.studentId}</Text>
        </View>
        <View style={styles.completionBadge}>
          <Text style={[styles.completionText, { color: item.isCourseComplete ? '#4CAF50' : '#F44336' }]}>
            {item.isCourseComplete ? 'COMPLETED' : 'IN PROGRESS'}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Duration:</Text>
          <Text style={styles.detailValue}>{item.totalDuration} hours</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Completion Date:</Text>
          <Text style={styles.detailValue}>
            {item.completionDate ? new Date(item.completionDate).toLocaleDateString() : 'Not completed'}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={item.totalDuration / 100} // Assuming 100 is max
            width={200}
            height={10}
            color={item.isCourseComplete ? '#4CAF50' : '#FFC107'}
            borderRadius={5}
          />
          <Text style={styles.progressText}>
            {Math.min(100, Math.round(item.totalDuration))}% Complete
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => setSelectedCertificate(item)}
      >
        <Text style={styles.actionButtonText}>Certificate</Text>
      </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Course Completion</Text>
        <Text style={styles.headerSubtitle}>Track student progress</Text>
      </View>

      <Text style={styles.dateText}>{currentDate}</Text>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Completion Status</Text>
      </View>

      <FlatList
        data={completionData}
        renderItem={renderCompletionCard}
        keyExtractor={(item) => item.studentId.toString()}
        contentContainerStyle={styles.listContent}
      />
      
    {selectedCertificate && (
      <CertificateModal
        student={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    )}

      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#3F51B5',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingVertical: 12,
    backgroundColor: '#E8EAF6',
  },
  sectionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'transparent', // Transparent background as the gradient will fill it
    borderRadius: 8,
    margin: 8,
    padding: 16,
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
    marginBottom: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  studentDetail: {
    fontSize: 14,
    color: '#666',
  },
  completionBadge: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  completionText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  progressContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: '#E8EAF6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    width: '48%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#3F51B5',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  certificateImage: {
    width: '100%',
    height: '80%',
    position: 'absolute',
  },
  certificateName: {
    position: 'absolute',
    top: height * 0.25,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    width: '100%',
  },
  certificateCourse: {
    position: 'absolute',
    top: height * 0.3,
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#3F51B5',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
