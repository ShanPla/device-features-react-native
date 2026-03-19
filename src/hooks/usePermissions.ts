import { useEffect } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const useHomePermissions = () => {
  useEffect(() => {
    const request = async () => {
      await Location.requestForegroundPermissionsAsync();
      
      if (Platform.OS === 'android') {
        await Notifications.requestPermissionsAsync({
          android: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
      } else {
        await Notifications.requestPermissionsAsync();
      }
    };
    request();
  }, []);
};