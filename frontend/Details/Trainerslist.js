// import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
// import Navbar from '../Navbar/Navbar';
// const Trainerlist = ({ route }) => {
//   const { staff } = route.params; // Retrieve the student details

//   return (
//     <><ScrollView style={styles.container}>
//       {/* Profile Image - */}
//       <Image
//         source={{ uri: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png' }} // Corrected image source
//         style={styles.profileImage} />

//       <Text style={styles.name}>{staff.staffName}</Text>
//       <Text style={styles.title}>Staff Details</Text>

//       <View style={styles.detailContainer}>
//         <Text style={styles.detailLabel}>Staff ID:</Text>
//         <Text style={styles.detailValue}>{staff.staffId}</Text>
        

//       </View >

//       <View style={styles.detailContainer}>
//         <Text style={styles.detailLabel}>Experience:</Text>
//       <Text style={styles.detailValue}>2 years</Text>
//       </View>

//       {/* <View style={styles.detailContainer}>
//       <Text style={styles.detailLabel}>Learning Mode:</Text>
//       <Text style={styles.detailValue}>{student.learningMode}</Text>
//     </View> */}



//       <Text style={styles.staffDetail}>Courses:</Text>
//       {staff.specificCourse.map((course, index) => (
//         <Text key={index} style={styles.courseItem}>- {course}</Text>
//       ))}


//     </ScrollView><View style={styles.navbarContainer}>
//         <Navbar />
//       </View></>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1,  // Ensures the screen takes full height
//     padding: 25,
//     backgroundColor: 'white',
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 5,
//     color: '#333',
//   },
//   title: {
//     fontSize: 18,
//     textAlign: 'center',
//     color: '#666',
//     marginBottom: 25,
//   },
//   detailContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   detailLabel: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#444',
//   },
//   detailValue: {
//     fontSize: 16,
//     color: '#666',
//   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginTop: 20,
// //     marginBottom: 15,
// //     color: '#333',
// //   },
//   courseContainer: {
//     marginBottom: 10,
//   },
//   courseItem: {
//     fontSize: 16,
//     color: '#555',
//     lineHeight: 22,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 20,
//     marginBottom: 10,
//     color: '#4B0082', // Dark purple for a professional look
//     textAlign: 'center',
//   },
//   courseContainer: {
//     backgroundColor: '#E6E6FA', // Light lavender background
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     shadowColor: '#000', 
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 2, height: 2 },
//     shadowRadius: 4,
//     elevation: 3, 
//   },
//   courseName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#4B0082', // Dark purple
//     marginBottom: 5,
//   },
//   courseDetail: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 3,
//   },
// });

// export default Trainerlist;

import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Navbar from '../Navbar/Navbar';
import { LinearGradient } from 'expo-linear-gradient';

const Trainerlist = ({ route }) => {
  const { staff } = route.params;

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={['#6C63FF', '#4A3FBD']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Image
            source={{ uri: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png' }}
            style={styles.profileImage}
          />
        </LinearGradient>

        <View style={styles.contentContainer}>
          <Text style={styles.name}>{staff.staffName}</Text>
          <Text style={styles.title}>Professional Trainer</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Staff ID:</Text>
              <Text style={styles.infoValue}>{staff.staffId}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Experience:</Text>
              <Text style={styles.infoValue}>2 years</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Specialization:</Text>
              <Text style={styles.infoValue}>{staff.specificCourse.length} courses</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Courses Taught</Text>
          
          {staff.specificCourse.map((course, index) => (
            <View key={index} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <Text style={styles.courseName}>{course}</Text>
                <View style={styles.courseBadge}>
                  <Text style={styles.courseBadgeText}>Active</Text>
                </View>
              </View>
              
              <View style={styles.courseDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Students:</Text>
                  <Text style={styles.detailValue}>24</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Rating:</Text>
                  <Text style={styles.detailValue}>4.8 ★</Text>
                </View>
              </View>
              
              {/* <View style={styles.scheduleContainer}>
                <Text style={styles.scheduleLabel}>Next Session:</Text>
                <Text style={styles.scheduleValue}>Mon, 10:00 AM</Text>
              </View> */}
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </>
  );
};
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f5f7fa',
  },
  header: {
    height: height * 0.2, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.04, 
    borderBottomLeftRadius: width * 0.125, 
    borderBottomRightRadius: width * 0.125,
    marginBottom: height * 0.04, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    width: '100%',
  },
  profileImage: {
    width: width * 0.35, 
    height: width * 0.35,
    borderRadius: width * 0.175, 
    borderWidth: width * 0.0125, 
    borderColor: 'white',
    marginTop: height * 0.04, 
  },
  contentContainer: {
    paddingHorizontal: width * 0.0625, 
    paddingBottom: height * 0.04, 
    width: '100%',
  },
  name: {
    fontSize: width > 400 ? 30 : 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.006, 
    color: '#333',
    marginTop: height * 0.026,
  },
  title: {
    fontSize: width > 400 ? 20 : 18,
    textAlign: 'center',
    color: '#6C63FF',
    marginBottom: height * 0.033, 
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: width * 0.05, 
    marginBottom: height * 0.033, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: height * 0.016, 
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    width: '100%',
  },
  infoLabel: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: '600',
    color: '#555',
  },
  infoValue: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: '500',
    color: '#333',
  },
  sectionTitle: {
    fontSize: width > 400 ? 24 : 22,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: height * 0.026,
    paddingLeft: width * 0.025, 
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  courseCard: {
    backgroundColor: 'rgb(236, 247, 250)',
    borderRadius: 15,
    padding: width * 0.05, 
    marginBottom: height * 0.02, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02, 
    width: '100%',
  },
  courseName: {
    fontSize: width > 400 ? 20 : 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  courseBadge: {
    backgroundColor: '#E3F2FD',
    paddingVertical: height * 0.005, 
    paddingHorizontal: width * 0.03,
    borderRadius: 12,
  },
  courseBadgeText: {
    color: '#1976D2',
    fontSize: width > 400 ? 14 : 12,
    fontWeight: 'bold',
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
    width: '100%',
  },
  detailItem: {
    backgroundColor: '#f9f9f9',
    padding: width * 0.025, 
    borderRadius: 8,
    width: '48%',
  },
  detailLabel: {
    fontSize: width > 400 ? 14 : 12,
    color: '#888',
    marginBottom: height * 0.006, 
  },
  detailValue: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: '600',
    color: '#444',
  },
  scheduleContainer: {
    backgroundColor: '#F5F5FF',
    padding: width * 0.03,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  scheduleLabel: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: '600',
    color: '#6C63FF',
    marginRight: width * 0.025,
  },
  scheduleValue: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: '500',
    color: '#333',
  },
  navbarContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    width: '100%',
  },
});



export default Trainerlist;