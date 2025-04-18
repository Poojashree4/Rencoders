
// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Image, Dimensions } from 'react-native';

// import Login from './frontend/Login/Login.js'; 
// import Adminhome from './frontend/Adminhome/Adminhome.js';
// import Student from './frontend/Details/Student.js';
// import Schedule from './frontend/Screens/Schedule.js';
// import Profile from './frontend/Screens/Profile.js';
// import Trainer from './frontend/Details/Trainer.js';
// import Course from './frontend/Details/Course.js';
// import Payment from './frontend/Details/Payment.js';
// import Attendance from './frontend/Details/Attendance.js';
// import CourseComplete from './frontend/Details/Coursecomplete.js';
// import Studentlist from './frontend/Details/Studentlist.js';
// import Trainerlist from './frontend/Details/Trainerslist.js';
// import Notification from './frontend/Screens/Notification.js';
// import Editprofile from './frontend/Screens/Editprofile.js';


// const Stack = createNativeStackNavigator();

// export default function App() {
//   const windowWidth = Dimensions.get('window').width;
//   const windowHeight = Dimensions.get('window').height;
//   const [initialRoute,setInitRoute]=useState(null);
//   const [loading,setLoading]=useState(true);

//   useState(()=>{
//     const checkLoginStatus =async ()=>{
//       try{
//         const token= await SecureStore.getItemAsync("token");
//         const mail=await SecureStore.getItemAsync("email");

//         if(token && mail){
//           setInitRoute("adminhome");
//         }else{
//           setInitRoute("Login");
//         }
//       }
//       catch(error){
//         console.error("Error retrieving token",error);
//         setInitRoute("Login");
//       }
//       finally{
//         setLoading(false);
//       }
//     };
//     checkLoginStatus();
//   }, []);

//   if(loading){
//     return()
//   }


//   const logo = () => (
//     <Image
//       source={{ uri: "https://renambl.blr1.cdn.digitaloceanspaces.com/rcoders/web/Rencoders_logo.png" }}
//       style={{ width: windowWidth * 0.2, height: windowHeight * 0.02 }} 
//     />
//   );

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen name="Login" component={Login} options={{
//             headerRight: logo,  
//             title: 'Login',
//             headerShown: false,
//             headerTitleAlign: 'center',
//             headerStyle: { backgroundColor: 'white', height: 10 },
//             headerTitleStyle: { fontSize: 16, color: 'black' },
//           }}
//         />
//         <Stack.Screen name="adminhome" component={Adminhome}
//           options={{
//             headerRight: logo,  
//             title: 'Home',
//             headerTitleAlign: 'center',
//             headerShown: false,
//             headerStyle: {
//               backgroundColor: 'rgb(206 ,234,214)',  
//             },
//           }}
//         />
//         <Stack.Screen name="student" component={Student}
//           options={{
//             headerRight: logo,  
//             title: 'Students',
//             headerTitleAlign: 'center',
//           }}
//         />
//         <Stack.Screen name="schedule" component={Schedule} options={{  headerRight: logo,  title: 'Schedule', headerTitleAlign: 'center', headerStyle:{ backgroundColor:'rgb(206 ,234,214)',},
//           }}
//         />
//         <Stack.Screen name="profile" component={Profile} options={{ headerRight: logo,   title: 'Profile', headerTitleAlign: 'center', headerShown: false, }}
//         />
//       <Stack.Screen name="trainer" component={Trainer} options={{ headerRight: logo,   title: 'Trainer', headerTitleAlign: 'center',headerStyle: { backgroundColor: 'white', 
//     },
//   }}
// />
// <Stack.Screen name="trainerlist" component={Trainerlist} options={{ headerRight: logo,   title: 'Trainers List', headerTitleAlign: 'center',headerStyle: { backgroundColor: 'white', 
//     },
//   }}
// />

//         <Stack.Screen name="course" component={Course}
//           options={{
//             headerRight: logo, 
//             title: 'Courses',
//             headerTitleAlign: 'center',  
//           }}
//         />
        
//         <Stack.Screen name="payment" component={Payment}
//           options={{
//             headerRight: logo, 
//             title: 'Payment',
//             headerTitleAlign: 'center',
//           }}
//         />
//         <Stack.Screen name="attendance" component={Attendance}
//           options={{
//             headerRight: logo,  
//             title: 'Attendance',
//             headerTitleAlign: 'center',
//           }}
//         />
//         <Stack.Screen name="coursecomplete" component={CourseComplete}
//           options={{
//             headerRight: logo, 
//             title: 'Completion',
//             headerTitleAlign: 'center',
//           }}
//         />

// <Stack.Screen name="studentlist" component={Studentlist} options={{ headerRight: logo,   title: 'Student List', headerTitleAlign: 'center',headerStyle: { backgroundColor: 'white', 
//     },
//   }}
// />

// <Stack.Screen name="notification" component={Notification} options={{ headerRight: logo,   title: 'Settings', headerTitleAlign: 'center',headerStyle: { backgroundColor: 'white', 
//     },
//   }}
// />
// <Stack.Screen name="editprofile" component={Editprofile} options={{ headerRight: logo,   title: 'Edit Profile', headerTitleAlign: 'center',headerStyle: { backgroundColor: 'white', 
//     },
//   }}
// />

//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


import * as React from 'react';
import { useState,useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, Dimensions, ActivityIndicator, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Provider } from 'react-redux';
import { store } from './store/index.js';



import Login from './frontend/Login/Login.js'; 
import Adminhome from './frontend/Adminhome/Adminhome.js';
import Student from './frontend/Details/Student.js';
import Schedule from './frontend/Screens/Schedule.js';
import Profile from './frontend/Screens/Profile.js';
import Trainer from './frontend/Details/Trainer.js';
import Course from './frontend/Details/Course.js';
import Payment from './frontend/Details/Payment.js';
import Attendance from './frontend/Details/Attendance.js';
import CourseComplete from './frontend/Details/Coursecomplete.js';
import Studentlist from './frontend/Details/Studentlist.js';
import Trainerlist from './frontend/Details/Trainerslist.js';
import Notification from './frontend/Screens/Notification.js';
import Editprofile from './frontend/Screens/Editprofile.js';
import Supporthome from './frontend/Adminhome/Supporthome.js';
import Profilesuppt from './frontend/Screens/Profilesuppt.js';
import Studentsuppt from './frontend/Details/Studentsuppt.js';

import Trainersuppt from './frontend/Details/Trainersuppt.js';
import Supptschedule from './frontend/Screens/Supptschedule.js';
import Coursesuppt from './frontend/Details/Coursesuppt.js';
import Paymentsuppt from './frontend/Details/Paymentsuppt.js';
import Tickets from './frontend/Screens/Tickets.js';
import TicketChatScreen from './frontend/Screens/TicketChatScreen.js';
import TicketsSuppt from './frontend/Screens/TicketsSuppt.js';

import Ticketchatsuppt from './frontend/Screens/Ticketchatsuppt.js';
import Supporttickets from './frontend/Screens/Supporttickets.js';

const Stack = createNativeStackNavigator();

export default function App() {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState(null);

  const logo = () => (
    <Image
      source={{ uri: "https://renambl.blr1.cdn.digitaloceanspaces.com/rcoders/web/Rencoders_logo.png" }}
      style={{ width: windowWidth * 0.2, height: windowHeight * 0.02 }} 
    />
  );

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const email = await SecureStore.getItemAsync("userEmail");
        const role = await SecureStore.getItemAsync("userRole");

        console.log('Token:', token);
console.log('Email:', email);
console.log('Role:', role);
  
        if (token && email && role) {
          if (role === 'admin') {
            setInitialRoute("adminhome");
          } else if (role === 'support') {
            setInitialRoute("supporthome");
          } else {
            setInitialRoute("Login");
          }
        } else {
          setInitialRoute("Login");
        }
      } catch (error) {
        console.error("Error retrieving login info:", error);
        setInitialRoute("Login");
      } finally {
        setLoading(false);
      }
    };
  
    checkLoginStatus();
  }, []);
  

  if (loading || !initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
 

 

  return (
    <Provider store={store}>
    <NavigationContainer  onReady={() => {
    console.log("Navigation is ready with initial route:", initialRoute);
  }}>
      
      <Stack.Navigator initialRouteName={initialRoute}> 
     
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="adminhome" component={Adminhome} options={{ headerShown: false }} />
      
        <Stack.Screen name="student" component={Student} options={{ headerRight: logo, title: 'Students', headerTitleAlign: 'center' }} />
        <Stack.Screen name="schedule" component={Schedule} options={{ headerRight: logo, title: 'Schedule', headerTitleAlign: 'center', headerStyle: { backgroundColor: 'rgb(206 ,234,214)' } }} />
        <Stack.Screen name="profile" component={Profile} options={{ headerRight: logo, title: 'Profile', headerTitleAlign: 'center', headerShown: false }} />
        <Stack.Screen name="trainer" component={Trainer} options={{ headerRight: logo, title: 'Trainer', headerTitleAlign: 'center', headerStyle: { backgroundColor: 'white' } }} />
        <Stack.Screen name="trainerlist" component={Trainerlist} options={{ headerRight: logo, title: 'Trainers List', headerTitleAlign: 'center', headerStyle: { backgroundColor: 'white' } }} />
        <Stack.Screen name="course" component={Course} options={{ headerRight: logo, title: 'Courses', headerTitleAlign: 'center' }} />
        <Stack.Screen name="payment" component={Payment} options={{ headerRight: logo, title: 'Payment', headerTitleAlign: 'center' }} />
        <Stack.Screen name="attendance" component={Attendance} options={{ headerRight: logo, title: 'Attendance', headerTitleAlign: 'center' }} />
        <Stack.Screen name="coursecomplete" component={CourseComplete} options={{ headerRight: logo, title: 'Completion', headerTitleAlign: 'center' }} />
        <Stack.Screen name="studentlist" component={Studentlist} options={{ headerRight: logo, title: 'Student List', headerTitleAlign: 'center', headerStyle: { backgroundColor: 'white' } }} />
        {/* <Stack.Screen name="notification" component={Notification} options={{ headerRight: logo, title: 'Settings', headerTitleAlign: 'center', headerStyle: { backgroundColor: 'white' } }} /> */}
        <Stack.Screen name="editprofile" component={Editprofile} options={{ headerRight: logo, title: 'Edit Profile', headerTitleAlign: 'center', headerStyle: { backgroundColor: 'white' } }} />
        <Stack.Screen name="tickets" component={Tickets} options={{ headerRight: logo, title:'Tickets', headerTitleAlign: 'center', headerStyle: { backgroundColor: 'white' } }}  initialParams={{ userId: 'admin_001', userRole: 'admin' }}  />
        <Stack.Screen name="ticketChat" component={TicketChatScreen} options={{ headerRight: logo, title:'Chats', headerTitleAlign: 'center', headerStyle: { backgroundColor: 'white' } }} />
       
       
    
  
        <Stack.Screen name="profilesuppt" component={Profilesuppt} options={{ headerRight: logo, title: 'Profile', headerTitleAlign: 'center', headerShown: false }} />
        <Stack.Screen name="supporthome" component={Supporthome} options={{ headerShown: false }} />
        <Stack.Screen name="studentsuppt" component={Studentsuppt} options={{ headerRight: logo, title: 'Students', headerTitleAlign: 'center' }} />
        <Stack.Screen name="trainersuppt" component={Trainersuppt} options={{ headerRight: logo, title: 'Trainers', headerTitleAlign: 'center' }} />
        <Stack.Screen name="supptschedule" component={Supptschedule} options={{ headerRight: logo, title: 'Trainers', headerTitleAlign: 'center' }} />
        <Stack.Screen name="coursesuppt" component={Coursesuppt} options={{ headerRight: logo, title: 'Courses', headerTitleAlign: 'center' }} />
        <Stack.Screen name="paymentsuppt" component={Paymentsuppt} options={{ headerRight: logo, title: 'Payment', headerTitleAlign: 'center' }} />
        <Stack.Screen name="ticketsSuppt" component={TicketsSuppt} options={{ headerRight: logo, title:'Tickets', headerTitleAlign: 'center', headerStyle: { backgroundColor: 'white' } }} />
        <Stack.Screen name="ticketchatsuppt" component={Ticketchatsuppt} options={{ headerRight: logo, title:'Tickets', headerTitleAlign: 'center', headerStyle: { backgroundColor: 'white' } }} />
        <Stack.Screen name="supporttickets" component={Supporttickets} options={{ headerRight: logo, title: 'Create Ticket' }} />
    
      </Stack.Navigator>
     
    </NavigationContainer>
    </Provider>
  );
}
