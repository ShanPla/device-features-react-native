import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import AddEntryScreen from '../screens/AddEntryScreen/AddEntryScreen';
import { useTheme } from '../context/ThemeContext';

export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  const headerRight = () => (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        marginRight: 4,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.glass,
        borderWidth: 1,
        borderColor: theme.glassBorder,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FontAwesome
        name={isDarkMode ? 'sun-o' : 'moon-o'}
        size={16}
        color={isDarkMode ? '#f5c518' : theme.primary}
      />
    </TouchableOpacity>
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerRight,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
          color: theme.text,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Travel Diary' }}
      />
      <Stack.Screen
        name="AddEntry"
        component={AddEntryScreen}
        options={{ title: 'New Entry' }}
      />
    </Stack.Navigator>
  );
}
