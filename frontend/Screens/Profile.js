

import React, { useState, useEffect } from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ImageBackground, 
  Image, 
  ToastAndroid,
  ActivityIndicator 
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../Navbar/Navbar.js';
import * as SecureStore from 'expo-secure-store';
import { useSelector } from 'react-redux';

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);  
  const [loading, setLoading] = useState(true); 
  const profile = useNavigation();
  const ip = useSelector((state) => state.ip.value);
  const [userEmail, setUserEmail] = useState('');

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("userEmail");
      await SecureStore.deleteItemAsync("userPassword");
      console.log("Data removed");
      ToastAndroid.show("Logout Successful", ToastAndroid.SHORT);
      profile.replace("Login");  
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const getLoggedInEmail = async () => {
      try {
        const email = await SecureStore.getItemAsync("userEmail");
        if (email) {
          setUserEmail(email);
          fetchProfile(email);
        } else {
          Alert.alert("Error", "No user email found");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting email:", error);
        setLoading(false);
      }
    };
    
    getLoggedInEmail();
  }, [ip]);

 
 

  const fetchProfile = async (email) => {
    try {
      const response = await fetch(`${ip}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
         body: JSON.stringify({ email: email }),
       
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUserProfile(data);  
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No profile data found</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <ScrollView>
        <ImageBackground
          source={{ uri: 'https://i.pinimg.com/474x/0f/f2/de/0ff2de5d50706ff975753350c8c18e1a.jpg' }}
          style={styles.backgroundImage}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.name}>PROFILE</Text>
              <TouchableOpacity style={styles.backButton} onPress={() => profile.goBack()}>
                <FontAwesome name="arrow-left" size={24} color="white" />
              </TouchableOpacity>
              {/* <Text style={styles.iconset} onPress={() => profile.navigate('notification')}>
                <Ionicons name="settings" size={24} color="white" />
              </Text> */}
              <Image
                source={{ uri: 'https://img.freepik.com/premium-photo/girl-happy-portrait-user-profile-by-ai_1119669-10.jpg' }}
                style={styles.profileImage}
              />
              <Text style={styles.name}>
                <FontAwesome name="user" size={24} color="white" />  {userProfile.name}
              </Text>
            </View>

            <View style={styles.profileCard}>
              <Text style={styles.profileItem}>📧Email: {userProfile.email}</Text>
              <Text style={styles.profileItem}>
                <FontAwesome6 name="id-card" size={20} color="blue" /> Role: {userProfile.role}
              </Text>
              <Text style={styles.profileItem}>
                <FontAwesome6 name="id-badge" size={20} color="red" /> Role ID: {userProfile.roleId}
              </Text>
              <Text style={styles.profileItem}>
                <FontAwesome6 name="phone" size={20} color="wheat" /> Phone: {userProfile.phoneNumber}
              </Text>
              <Text style={styles.profileItem}>💼 Experience: {userProfile.experience}</Text>
              <Text style={styles.profileItem}>📍 Location: {userProfile.location}</Text>

              <Pressable
                style={styles.editButton}
                onPress={() => profile.navigate('editprofile', {
                  userEmail: userProfile.email,
                  currentName: userProfile.name,
                  currentPhone: userProfile.phoneNumber,
                  currentExperience: userProfile.experience,
                  currentLocation: userProfile.location,
                  currentRole: userProfile.role,
                  currentRoleId: userProfile.roleId
                })}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </Pressable>

              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Log Out</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </ScrollView>
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </>
  );
}
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    height: height * 1.2, 
    width: '100%',
  },
  backButton: {
    position: "absolute",
    top: height * 0.02, 
    left: width * 0.04, 
    zIndex: 1,
  },
  header: {
    padding: width * 0.1, 
    alignItems: 'center',
    marginTop: height * 0.02,
    width: '100%',
  },
  profileImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    borderWidth: width * 0.008, 
    borderColor: '#fff',
  },
  name: {
    fontSize: width > 400 ? 26 : 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: height * 0.027,
  },
  profileCard: {
    backgroundColor: 'rgba(133, 133, 190, 0.4)',
    padding: width * 0.075, 
    margin: width * 0.05, 
    height: height * 0.68, 
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: -height * 0.027,
    width: width * 0.9, 
    alignSelf: 'center',
  },
  profileItem: {
    fontSize: width > 400 ? 16 : 15,
    color: 'white',
    marginBottom: height * 0.016, 
    padding: width * 0.013, 
  },
  editButton: {
    backgroundColor: '#4169e1',
    paddingVertical: height * 0.016, 
    paddingHorizontal: width * 0.021, 
    borderRadius: 10,
    marginVertical: height * 0.007,
    alignItems: 'center',
    width: width * 0.587, 
    marginLeft: width * 0.107, 
    marginTop: height * 0.029,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    paddingVertical: height * 0.016,
    paddingHorizontal: width * 0.067, 
    borderRadius: 10,
    marginVertical: height * 0.013, 
    alignItems: 'center',
    width: width * 0.587, 
    marginLeft: width * 0.107,
  },
  buttonText: {
    color: '#fff',
    fontSize: width > 400 ? 17 : 16,
    fontWeight: '600',
  },
  iconset: {
    marginLeft: '93%',
    marginBottom: height * 0.027,
    marginTop: -height * 0.027,
  }
});

// import React, { useState, useEffect } from 'react';
// import { 
//   Pressable, 
//   Text, 
//   StyleSheet, 
//   View, 
//   SafeAreaView, 
//   TouchableOpacity, 
//   ScrollView, 
//   Alert, 
//   ImageBackground, 
//   Image, 
//   ToastAndroid,
//   ActivityIndicator 
// } from 'react-native';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// import { useNavigation } from '@react-navigation/native';
// import Navbar from '../Navbar/Navbar.js';
// import * as SecureStore from 'expo-secure-store';
// import { useSelector } from 'react-redux';

// export default function Profile() {
//   const [userProfile, setUserProfile] = useState(null);  
//   const [loading, setLoading] = useState(true); 
//   const [userEmail, setUserEmail] = useState('');
//   const [token, setToken] = useState('');
//   const ip = useSelector((state) => state.ip.value);
//   const profile = useNavigation();

//   const handleLogout = async () => {
//     try {
//       await SecureStore.deleteItemAsync("userEmail");
//       await SecureStore.deleteItemAsync("userPassword");
//       await SecureStore.deleteItemAsync("jwtToken");
//       ToastAndroid.show("Logout Successful", ToastAndroid.SHORT);
//       profile.replace("Login");  
//     } catch (error) {
//       console.error("Logout error:", error);
//       Alert.alert("Error", "Logout failed. Please try again.");
//     }
//   };

//   useEffect(() => {
//     const getCredentials = async () => {
//       try {
//         const email = await SecureStore.getItemAsync("userEmail");
//         const jwtToken = await SecureStore.getItemAsync("userToken");
//         console.log("token:",jwtToken);
//         console.log("email:",email);
//         if (email && jwtToken) {
//           setUserEmail(email);
//           setToken(jwtToken);
//           fetchProfile(email, jwtToken);
//         } else {
//           Alert.alert("Error", "Missing token or email. Please login again.");
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Credential retrieval error:", error);
//         setLoading(false);
//       }
//     };

//     getCredentials();
//   }, [ip]);

//   const fetchProfile = async (email, jwtToken) => {
//     try {
//       const response = await fetch(`${ip}/profile`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           token: jwtToken
//           // email: email
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData?.error || 'Failed to fetch profile');
//       }

//       const data = await response.json();
//       setUserProfile(data);  
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </SafeAreaView>
//     );
//   }

//   if (!userProfile) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text>No profile data found</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <>
//       <ScrollView>
//         <ImageBackground
//           source={{ uri: 'https://i.pinimg.com/474x/0f/f2/de/0ff2de5d50706ff975753350c8c18e1a.jpg' }}
//           style={styles.backgroundImage}
//         >
//           <SafeAreaView style={styles.container}>
//             <View style={styles.header}>
//               <Text style={styles.name}>PROFILE</Text>
//               <TouchableOpacity style={styles.backButton} onPress={() => profile.goBack()}>
//                 <FontAwesome name="arrow-left" size={24} color="white" />
//               </TouchableOpacity>

//               <Image
//                 source={{ uri: 'https://img.freepik.com/premium-photo/girl-happy-portrait-user-profile-by-ai_1119669-10.jpg' }}
//                 style={styles.profileImage}
//               />
//               <Text style={styles.name}>
//                 <FontAwesome name="user" size={24} color="white" />  {userProfile.name}
//               </Text>
//             </View>

//             <View style={styles.profileCard}>
//               <Text style={styles.profileItem}>📧Email: {userProfile.email}</Text>
//               <Text style={styles.profileItem}>
//                 <FontAwesome6 name="id-card" size={20} color="blue" /> Role: {userProfile.role}
//               </Text>
//               <Text style={styles.profileItem}>
//                 <FontAwesome6 name="id-badge" size={20} color="red" /> Role ID: {userProfile.roleId}
//               </Text>
//               <Text style={styles.profileItem}>
//                 <FontAwesome6 name="phone" size={20} color="wheat" /> Phone: {userProfile.phoneNumber}
//               </Text>
//               <Text style={styles.profileItem}>💼 Experience: {userProfile.experience}</Text>
//               <Text style={styles.profileItem}>📍 Location: {userProfile.location}</Text>

//               <Pressable
//                 style={styles.editButton}
//                 onPress={() => profile.navigate('editprofile', {
//                   userEmail: userProfile.email,
//                   currentName: userProfile.name,
//                   currentPhone: userProfile.phoneNumber,
//                   currentExperience: userProfile.experience,
//                   currentLocation: userProfile.location,
//                   currentRole: userProfile.role,
//                   currentRoleId: userProfile.roleId
//                 })}
//               >
//                 <Text style={styles.buttonText}>Edit Profile</Text>
//               </Pressable>

//               <Pressable style={styles.logoutButton} onPress={handleLogout}>
//                 <Text style={styles.buttonText}>Log Out</Text>
//               </Pressable>
//             </View>
//           </SafeAreaView>
//         </ImageBackground>
//       </ScrollView>
//       <View style={styles.navbarContainer}>
//         <Navbar />
//       </View>
//     </>
//   );
// }

// import { Dimensions } from 'react-native';
// const { width, height } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: '100%',
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//     height: height * 1.2, 
//     width: '100%',
//   },
//   backButton: {
//     position: "absolute",
//     top: height * 0.02, 
//     left: width * 0.04, 
//     zIndex: 1,
//   },
//   header: {
//     padding: width * 0.1, 
//     alignItems: 'center',
//     marginTop: height * 0.02,
//     width: '100%',
//   },
//   profileImage: {
//     width: width * 0.4,
//     height: width * 0.4,
//     borderRadius: width * 0.2,
//     borderWidth: width * 0.008, 
//     borderColor: '#fff',
//   },
//   name: {
//     fontSize: width > 400 ? 26 : 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginTop: height * 0.027,
//   },
//   profileCard: {
//     backgroundColor: 'rgba(133, 133, 190, 0.4)',
//     padding: width * 0.075, 
//     margin: width * 0.05, 
//     height: height * 0.68, 
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//     borderWidth: 1,
//     borderColor: '#eee',
//     marginTop: -height * 0.027,
//     width: width * 0.9, 
//     alignSelf: 'center',
//   },
//   profileItem: {
//     fontSize: width > 400 ? 16 : 15,
//     color: 'white',
//     marginBottom: height * 0.016, 
//     padding: width * 0.013, 
//   },
//   editButton: {
//     backgroundColor: '#4169e1',
//     paddingVertical: height * 0.016, 
//     paddingHorizontal: width * 0.021, 
//     borderRadius: 10,
//     marginVertical: height * 0.007,
//     alignItems: 'center',
//     width: width * 0.587, 
//     marginLeft: width * 0.107, 
//     marginTop: height * 0.029,
//   },
//   logoutButton: {
//     backgroundColor: '#F44336',
//     paddingVertical: height * 0.016,
//     paddingHorizontal: width * 0.067, 
//     borderRadius: 10,
//     marginVertical: height * 0.013, 
//     alignItems: 'center',
//     width: width * 0.587, 
//     marginLeft: width * 0.107,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: width > 400 ? 17 : 16,
//     fontWeight: '600',
//   },
//   iconset: {
//     marginLeft: '93%',
//     marginBottom: height * 0.027,
//     marginTop: -height * 0.027,
//   }
// });