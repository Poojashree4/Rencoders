

import React, { useState, useEffect } from 'react';
import { Pressable,TextInput, Text,Button, StyleSheet, View, SafeAreaView, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import styles from '../Adminhome/Adminstyle.js';
import Navbar from '../Navbar/Navbar.js';
import { setIP } from '../../store/ipSlice.js';
import { useSelector, useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { BlurView } from 'expo-blur';


function AdminHomeContent() {
  const [pressedCard, setPressedCard] = useState(null);
  const [studentCount, setStudentCount] = useState(null); 
  const [staffCount, setStaffCount] = useState(null); 
  const navigation = useNavigation();

  
  const ip = useSelector((state) => state.ip.value);
  
  useEffect(() => {
    fetchCounts(); 
  }, [ip]);
  
  const fetchCounts = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
  
      console.log("from token", token);
  
      const response = await fetch(`${ip}/countall`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });
  
      const data = await response.json();
  
      if (data.success) {
        setStudentCount(data.studentCount);
        setStaffCount(data.staffCount);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };
  

  const handlePressIn = (cardId) => {
    setPressedCard(cardId);
  };

  const handlePressOut = () => {
    setPressedCard(null);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          
         

<Pressable
            style={[styles.cardone, pressedCard === 'course' && styles.cardHover]}
           
            onPressOut={handlePressOut}
            
          >
            <View style={styles.cardHeader}>
              <Image
                source={{ uri: "https://renambl.blr1.cdn.digitaloceanspaces.com/rcoders/web/Rencoders_logo.png" }}
                style={styles.cardLogo}
                resizeMode="contain"
              />
              {/* <FontAwesome name="bell" size={24} color="black" style={styles.cardBellIcon} onPress={() => navigation.navigate('notification')}/> */}
            </View>
            <Text style={styles.headtitl}>HOME</Text>
            <Text style={styles.cardTitle}>Welcome To Admin Page</Text>
            <Text style={styles.welcomeText}>Your leadership ensures smooth operations. Let's make today productive.</Text>
          </Pressable>

          {/* First row of cards */}
          {/* <Text style={styles.cardcategory}>Explore Categories</Text> */}
          
          <View style={styles.row}>
            <Pressable
              style={[styles.card, pressedCard === 'student' && styles.cardHover]}
              onPressIn={() => handlePressIn('student')}
              onPressOut={handlePressOut}
              onPress={() => navigation.navigate('student')}
            >
              <Image
                source={{ uri: "https://static.vecteezy.com/system/resources/previews/025/003/253/non_2x/cute-cartoon-girl-student-character-on-transparent-background-generative-ai-png.png" }}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardTitle}>Student</Text>
              <Text style={styles.cardDescription}>Manage student records and information</Text>
              <View style={styles.countContainer}>
                <Text style={styles.countText}>
                  Total: {studentCount !== null ? studentCount : 'Loading...'}
                </Text>
              </View>
            </Pressable>
            
            <Pressable
              style={[styles.cardtwo, pressedCard === 'trainer' && styles.cardHover]}
              onPressIn={() => handlePressIn('trainer')}
              onPressOut={handlePressOut}
              onPress={() => navigation.navigate('trainer')}
            >
              <Image
                source={{ uri: "https://static.vecteezy.com/system/resources/previews/025/003/244/large_2x/3d-cute-cartoon-female-teacher-character-on-transparent-background-generative-ai-png.png" }}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardTitle}>Trainer</Text>
              <Text style={styles.cardDescription}>Manage trainer's profiles and details</Text>
              <View style={styles.countContainer}>
                <Text style={styles.countText}>
                  Total: {staffCount !== null ? staffCount : 'Loading...'}
                </Text>
              </View>
            </Pressable>
          </View>
          
         
          {/* Second row of cards */}
          <View style={styles.row}>
            <Pressable
              style={[styles.cardtwo, pressedCard === 'course' && styles.cardHover]}
              onPressIn={() => handlePressIn('course')}
              onPressOut={handlePressOut}
              onPress={() => navigation.navigate('course')}
            >
              <Image
                source={{ uri: "http://clipart-library.com/img1/1162604.png" }}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardTitle}>Course</Text>
              <Text style={styles.cardDescription}>View and update course information</Text>
            </Pressable>
  
            <Pressable
              style={[styles.card, pressedCard === 'payment' && styles.cardHover]}
              onPressIn={() => handlePressIn('payment')}
              onPressOut={handlePressOut}
              onPress={() => navigation.navigate('payment')}
            >
              <Image
                source={{ uri: "https://ouch-cdn2.icons8.com/0vtTeUCb2ILz_YoAyEC0d2V6N00hA9Zad5jMk5dZE-Y/rs:fit:368:368/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMjA3/LzlhMTY4NGQ2LWM4/MTktNDA5ZS05OTI5/LWQ5MmE1ZmM2NzAx/Ni5zdmc.png" }}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardTitle}>Payment</Text>
              <Text style={styles.cardDescription}>View and update payment information</Text>
            </Pressable>
          </View>

          {/* <View>
    <Text>Current IP: {ip}</Text>
    <TextInput
      placeholder="Enter new IP"
      value={input}
      onChangeText={setInput}
      style={{ borderWidth: 1, marginVertical: 10 }}
    />
    <Button title="Update IP" onPress={() => dispatch(setIP(input))} />
  </View> */}

          {/* Third row of cards */}
          <View style={styles.row}>
            <Pressable
              style={[styles.card, pressedCard === 'attendance' && styles.cardHover]}
              onPressIn={() => handlePressIn('attendance')}
              onPressOut={handlePressOut}
              onPress={() => navigation.navigate('attendance')}
            >
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/3589/3589030.png" }}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardTitle}>Attendance</Text>
              <Text style={styles.cardDescription}>Manage student attendance records</Text>
            </Pressable>
  
            <Pressable
              style={[styles.cardtwo, pressedCard === 'coursecomplete' && styles.cardHover]}
              onPressIn={() => handlePressIn('coursecomplete')}
              onPressOut={handlePressOut}
              onPress={() => navigation.navigate('coursecomplete')}
            >
              <Image
                source={{ uri: "http://clipart-library.com/images_k/grad-cap-transparent/grad-cap-transparent-24.png" }}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardTitle}>Course Completion</Text>
              <Text style={styles.cardDescription}>Manage student course details</Text>
            </Pressable>
          </View>
       
        </SafeAreaView>
      </ScrollView>
      
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </>
  );
}

export default AdminHomeContent;