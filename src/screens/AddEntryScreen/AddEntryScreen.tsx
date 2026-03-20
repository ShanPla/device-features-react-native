import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  Alert, ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform, TextInput, Keyboard, BackHandler,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../context/ThemeContext';
import { saveEntry } from '../../storage/entryStorage';
import { Entry } from '../../types/Entry';
import { FontAwesome } from '@expo/vector-icons';
import styles from './styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddEntry'>;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function AddEntryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  const scrollViewRef = useRef<ScrollView>(null);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [titleTouched, setTitleTouched] = useState(false);

  // Use a ref so back handlers always see latest value without re-registering
  const hasUnsavedChangesRef = useRef(false);
  useEffect(() => {
    hasUnsavedChangesRef.current = !!(imageUri || title.trim());
  }, [imageUri, title]);

  const confirmDiscard = (onConfirm: () => void) => {
    if (hasUnsavedChangesRef.current) {
      Alert.alert(
        'Discard Entry?',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Stay', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onConfirm },
        ]
      );
    } else {
      onConfirm();
    }
  };

  // Register hardware back button and header back button once on focus
  useFocusEffect(
    useCallback(() => {
      // Header back button
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => confirmDiscard(() => navigation.goBack())}
            style={{ paddingRight: 12 }}
          >
            <FontAwesome name="chevron-left" size={16} color={theme.text} />
          </TouchableOpacity>
        ),
      });

      // Hardware back button
      const onBackPress = () => {
        confirmDiscard(() => navigation.goBack());
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [theme.text])
  );

  // Clear fields when screen loses focus (user navigated away)
  useFocusEffect(
    useCallback(() => {
      return () => {
        setImageUri(null);
        setAddress(null);
        setTitle('');
        setTitleTouched(false);
        hasUnsavedChangesRef.current = false;
      };
    }, [])
  );

  const handleTakePhoto = async () => {
    Keyboard.dismiss();

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setImageUri(uri);
    await fetchAddress();
  };

  const fetchAddress = async () => {
    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const place = geocode[0];
        const formatted = [place.street, place.city, place.region, place.country]
          .filter(Boolean)
          .join(', ');
        setAddress(formatted);
      } else {
        setAddress('Address not found');
      }
    } catch {
      setAddress('Failed to get address');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setTitleTouched(true);

    if (!imageUri) {
      Alert.alert('Validation', 'Please take a photo first.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a title for this entry.');
      return;
    }
    if (loading) {
      Alert.alert('Please Wait', 'Address is still being fetched.');
      return;
    }
    if (!address) {
      Alert.alert('Validation', 'Could not get address. Please try again.');
      return;
    }

    const entry: Entry = {
      id: Date.now().toString(),
      title: title.trim(),
      imageUri,
      address,
      timestamp: Date.now(),
    };

    await saveEntry(entry);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✈️ Travel Entry Saved!',
        body: `"${title.trim()}" captured at ${address}`,
      },
      trigger: null,
    });

    Alert.alert('Saved!', 'Your travel entry has been saved.', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Home'),
      },
    ]);
  };

  const canSave = imageUri && address && title.trim() && !loading;
  const showTitleError = titleTouched && !title.trim();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
    >
      <ScrollView
        ref={scrollViewRef}
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Camera button / Preview area */}
        {!imageUri ? (
          <TouchableOpacity
            style={[styles.cameraPlaceholder, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={handleTakePhoto}
            activeOpacity={0.8}
          >
            <View style={[styles.cameraIconCircle, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
              <FontAwesome name="camera" size={28} color={theme.primary} />
            </View>
            <Text style={[styles.cameraPlaceholderText, { color: theme.text }]}>Take a Photo</Text>
            <Text style={[styles.cameraPlaceholderSub, { color: theme.subText }]}>
              Tap to open camera
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.previewWrapper}>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <TouchableOpacity
              style={[styles.retakeButton, { backgroundColor: theme.overlay, borderColor: theme.glassBorder }]}
              onPress={handleTakePhoto}
            >
              <FontAwesome name="refresh" size={13} color={theme.text} />
              <Text style={[styles.retakeText, { color: theme.text }]}>Retake</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View style={[styles.loadingCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.subText }]}>
              Fetching location...
            </Text>
          </View>
        )}

        {/* Address card */}
        {address && !loading && (
          <View style={[styles.addressCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.addressLabelRow}>
              <FontAwesome name="map-marker" size={13} color={theme.primary} />
              <Text style={[styles.addressLabel, { color: theme.primary }]}>LOCATION</Text>
            </View>
            <Text style={[styles.addressText, { color: theme.text }]}>{address}</Text>
          </View>
        )}

        {/* Title input */}
        <View style={styles.fieldWrapper}>
          <Text style={[styles.fieldLabel, { color: theme.subText }]}>ENTRY TITLE</Text>
          <TextInput
            style={[
              styles.titleInput,
              {
                backgroundColor: theme.card,
                borderColor: showTitleError ? theme.danger : theme.cardBorder,
                color: theme.text,
              },
            ]}
            placeholder="e.g. Sunset at the beach..."
            placeholderTextColor={theme.subText}
            value={title}
            onChangeText={setTitle}
            onBlur={() => setTitleTouched(true)}
            returnKeyType="done"
            maxLength={60}
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 300);
            }}
          />
          <View style={styles.fieldFooter}>
            {showTitleError ? (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                Title is required.
              </Text>
            ) : (
              <View />
            )}
            <Text style={[styles.charCount, { color: theme.subText }]}>{title.length}/60</Text>
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: canSave ? theme.primary : theme.card,
              borderColor: canSave ? theme.primary : theme.cardBorder,
              shadowColor: canSave ? theme.primary : 'transparent',
            },
          ]}
          onPress={handleSave}
          disabled={!canSave}
          activeOpacity={canSave ? 0.85 : 1}
        >
          <FontAwesome
            name="check"
            size={14}
            color={canSave ? '#fff' : theme.subText}
            style={{ marginRight: 8 }}
          />
          <Text style={[
            styles.saveButtonText,
            { color: canSave ? '#fff' : theme.subText },
          ]}>
            Save Entry
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
