
// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { FontAwesome } from "@expo/vector-icons";
// import * as Notifications from 'expo-notifications';
// import * as Permissions from 'expo-permissions';
// import { useSelector } from 'react-redux';
// // Configure notification handler
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function Notification() {
//   const [emailNotifications, setEmailNotification] = useState(true);
//   const [smsNotifications, setSmsNotifications] = useState(false);
//   const [appUpdates, setAppUpdates] = useState(true);
//   const [promotionalOffers, setPromotionalOffers] = useState(false);
//   const [eventReminders, setEventReminders] = useState(true);
//   const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
//   const [expoPushToken, setExpoPushToken] = useState('');

//   const navigation = useNavigation();
//   const ip = useSelector((state) => state.ip.value);

//   // Register for push notifications
//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => {
//       setExpoPushToken(token);
//       // Check if notifications are enabled
//       checkNotificationPermissions();
//     });

//     // Listen for incoming notifications when app is in foreground
//     const notificationListener = Notifications.addNotificationReceivedListener(notification => {
//       console.log('Notification received:', notification);
//     });

//     // Listen for notification responses (user taps on notification)
//     const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log('Notification response:', response);
//     });

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener);
//       Notifications.removeNotificationSubscription(responseListener);
//     };
//   }, []);

//   // Check notification permissions
//   const checkNotificationPermissions = async () => {
//     const { status } = await Notifications.getPermissionsAsync();
//     setPushNotificationsEnabled(status === 'granted');
//   };

//   // Register for push notifications
//   const registerForPushNotificationsAsync = async () => {
//     let token;
//     if (Platform.OS === 'android') {
//       await Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FF231F7C',
//       });
//     }

//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
    
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
    
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
    
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log('Expo push token:', token);
    
//     return token;
//   };

//   const savePreferences = async () => {
//     const preferences = {
//       emailNotifications,
//       smsNotifications,
//       appUpdates,
//       promotionalOffers,
//       eventReminders,
//       pushToken: expoPushToken,
//     };
  
//     try {
//       const response = await fetch(`${ip}/save-notifications`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(preferences),
//       });
  
//       const result = await response.json();
//       if (response.ok) {
//         alert('Preferences saved successfully!');
//       } else {
//         alert(result.error || 'Failed to save preferences.');
//       }
//     } catch (error) {
//       console.error('Error saving preferences:', error);
//       alert('An error occurred.');
//     }
//   };
  

//   // Toggle push notifications
//   const togglePushNotifications = async () => {
//     if (pushNotificationsEnabled) {
//       // Disable notifications
//       await Notifications.setNotificationCategoryAsync('default', []);
//       setPushNotificationsEnabled(false);
//     } else {
//       // Enable notifications
//       const { status } = await Notifications.requestPermissionsAsync();
//       if (status === 'granted') {
//         setPushNotificationsEnabled(true);
        
//         // Schedule a test notification
//         if (eventReminders) {
//           scheduleTestNotification();
//         }
//       } else {
//         alert('Permission to enable notifications was denied');
//       }
//     }
//   };

//   // Schedule a test notification
//   const scheduleTestNotification = async () => {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Notification Test",
//         body: "This is a test notification from your app!",
//         data: { testData: "This is test data" },
//       },
//       trigger: { seconds: 2 }, // Show after 2 seconds
//     });
//   };

//   // Handle event reminders toggle
//   const handleEventRemindersToggle = async (value) => {
//     setEventReminders(value);
    
//     if (value && pushNotificationsEnabled) {
//       // If enabling and push notifications are on, schedule a test reminder
//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: "Event Reminder Enabled",
//           body: "You'll now receive reminders for upcoming events!",
//         },
//         trigger: { seconds: 1 },
//       });
//     }
//   };

//   // Test notification button handler
//   const handleTestNotification = async () => {
//     if (!pushNotificationsEnabled) {
//       alert('Please enable push notifications first');
//       return;
//     }

//     await scheduleTestNotification();
//     alert('Test notification scheduled! It will appear in a few seconds.');
//   };

//   return (
//     <View style={styles.container}>
//       {/* Back Button */}
//       {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//         <FontAwesome name="arrow-left" size={24} color="#444" />
//       </TouchableOpacity> */}

//       <Text style={styles.header}>Notification Settings</Text>

//       {/* Push Notifications Toggle */}
//       <View style={styles.notificationRow}>
//         <Text style={styles.label}>Push Notifications</Text>
//         <Switch 
//           value={pushNotificationsEnabled} 
//           onValueChange={togglePushNotifications} 
//         />
//       </View>

//       {/* Notification Toggles */}
//       <View style={styles.notificationRow}>
//         <Text style={styles.label}>Email Notifications</Text>
//         <Switch 
//           value={emailNotifications} 
//           onValueChange={() => setEmailNotification(!emailNotifications)} 
//         />
//       </View>

//       {/* <View style={styles.notificationRow}>
//         <Text style={styles.label}>SMS Notifications</Text>
//         <Switch 
//           value={smsNotifications} 
//           onValueChange={() => setSmsNotifications(!smsNotifications)} 
//         />
//       </View> */}
// {/* 
//       <View style={styles.notificationRow}>
//         <Text style={styles.label}>App Updates</Text>
//         <Switch 
//           value={appUpdates} 
//           onValueChange={() => setAppUpdates(!appUpdates)} 
//         />
//       </View> */}

//       {/* <View style={styles.notificationRow}>
//         <Text style={styles.label}>Promotional Offers</Text>
//         <Switch 
//           value={promotionalOffers} 
//           onValueChange={() => setPromotionalOffers(!promotionalOffers)} 
//         />
//       </View> */}

//       <View style={styles.notificationRow}>
//         <Text style={styles.label}>Event Reminders</Text>
//         <Switch 
//           value={eventReminders} 
//           onValueChange={handleEventRemindersToggle} 
//         />
//       </View>

//       {/* Test Notification Button */}
//       {/* <TouchableOpacity 
//         style={styles.testButton} 
//         onPress={handleTestNotification}
//         disabled={!pushNotificationsEnabled}
//       >
//         <Text style={styles.testButtonText}>Send Test Notification</Text>
//       </TouchableOpacity> */}

// {/* <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Expo Push Token (for debugging)</Text> */}

//       {/* {__DEV__ && (
//         <View style={styles.tokenContainer}>
//           <Text style={styles.tokenLabel}>Expo Push Token:</Text>
//           <Text style={styles.tokenText}>{expoPushToken || 'Requesting...'}</Text>
//         </View>
//       )} */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f9f9f9",
//     padding: 20,
//     paddingTop: 60,
//   },
//   backButton: {
//     position: "absolute",
//     top: 20,
//     left: 20,
//     zIndex: 1,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 30,
//     color: "#333",
//   },
//   notificationRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     backgroundColor: "#fff",
//     marginBottom: 12,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   label: {
//     fontSize: 16,
//     color: "#333",
//   },
//   testButton: {
//     backgroundColor: '#4a90e2',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   testButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   tokenContainer: {
//     marginTop: 30,
//     padding: 10,
//     backgroundColor: '#eee',
//     borderRadius: 5,
//   },
//   tokenLabel: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   tokenText: {
//     fontSize: 12,
//     color: '#666',
//   },
// });