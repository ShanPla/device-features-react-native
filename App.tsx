import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/context/ThemeContext';
import MainNavigator from './src/navigation/MainNavigator';
import * as Notifications from 'expo-notifications'; // Suppress remote push token registration in Expo Go

Notifications.getExpoPushTokenAsync().catch(() => {});

export default function App() {
  
  return (
    <ThemeProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}