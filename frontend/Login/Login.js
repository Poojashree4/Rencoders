

import React, { useState, useEffect } from 'react';
import { 
  Pressable, 
  Text, 
  TextInput, 
  View, 
  Image, 
  ToastAndroid, 
  Dimensions,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './Loginstyle.js';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

export default function LoginWithOTP() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState('credentials'); // 'credentials', 'otp'
  const [countdown, setCountdown] = useState(0);

  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ip = useSelector((state) => state.ip.value);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 4;
  };

  const handleSendOTP = async () => {
    if (!validateEmail(email)) {
      ToastAndroid.show("Please enter a valid email address.", ToastAndroid.SHORT);
      return;
    }
    if (!validatePassword(password)) {
      ToastAndroid.show("Password must be at least 4 characters long.", ToastAndroid.SHORT);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${ip}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      const data = await response.json();
      
      if (response.ok) {
        ToastAndroid.show("OTP sent to your email!", ToastAndroid.SHORT);
        setLoginStep('otp');
        setCountdown(60); // 60 seconds countdown
      } else {
        throw new Error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      ToastAndroid.show("Please enter a valid 6-digit OTP", ToastAndroid.SHORT);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${ip}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (response.ok) {
        ToastAndroid.show("Login successful!", ToastAndroid.SHORT);

        await SecureStore.setItemAsync('userEmail', email);
        await SecureStore.setItemAsync('userToken', data.token);
        await SecureStore.setItemAsync('userRole', data.user.role);
        await SecureStore.setItemAsync('userroleId', data.user.roleId);
        // Navigate based on role
        if (data.user.role === 'admin') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'adminhome' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'supporthome' }],
          });
        }
      } else {
        throw new Error(data.error || "Invalid OTP");
      }
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleSendOTP();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#88d3ce', '#ebb8ff']}
        style={styles.gradientBackground}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: "https://renambl.blr1.cdn.digitaloceanspaces.com/rcoders/web/Rencoders_logo.png" }} 
            style={[styles.logo, { width: windowWidth * 0.6, height: windowHeight * 0.2 }]} 
          />
          <Text style={styles.appSubtitle}>
            Start Learning and Embrace New Skills for Better Future!!
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.box}>
        {loginStep === 'credentials' ? (
          <>
            <Text style={styles.welcomeText}>Welcome Back</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inpt}
                placeholder='user@gmail.com'
                placeholderTextColor="#999"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inpt}
                placeholder='Password'
                placeholderTextColor="#999"
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
              />
            </View>
            
            <View style={styles.roleContainer}>
              <Pressable
                style={[
                  styles.roleButton,
                  selectedRole === 'admin' ? styles.selectedButton : styles.unselectedButton,
                ]}
                onPress={() => setSelectedRole('admin')}
              >
                <Text style={styles.buttonText}>Admin</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.roleButton,
                  selectedRole === 'support' ? styles.selectedButton : styles.unselectedButton,
                ]}
                onPress={() => setSelectedRole('support')}
              >
                <Text style={styles.buttonText}>Support</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.button}
              onPress={handleSendOTP}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.welcomeText}>Enter OTP</Text>
            <Text style={styles.otpSubtitle}>Sent to {email}</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inpt}
                placeholder='6-digit OTP'
                placeholderTextColor="#999"
                onChangeText={setOtp}
                value={otp}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <Pressable
              style={styles.button}
              onPress={handleVerifyOTP}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.resendButton}
              onPress={handleResendOTP}
              disabled={countdown > 0}
            >
              <Text style={[
                styles.resendButtonText,
                countdown > 0 && styles.resendButtonDisabled
              ]}>
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </Text>
            </Pressable>
          </>
        )}

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
}

