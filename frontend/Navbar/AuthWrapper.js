// AuthWrapper.js
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import Adminhome from './Adminhome';
import Supporthome from './Supporthome';

const Stack = createNativeStackNavigator();

export default function AuthWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const role = await SecureStore.getItemAsync('userRole');
        
        if (token && role) {
          setUserRole(role);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userRole ? (
          <Stack.Screen 
            name={userRole === 'Admin' ? 'adminhome' : 'supporthome'} 
            component={userRole === 'Admin' ? Adminhome : Supporthome}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
            <Stack.Screen name="adminhome" component={Adminhome} />
            <Stack.Screen name="supporthome" component={Supporthome} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}