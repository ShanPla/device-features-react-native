import React, { useCallback, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../context/ThemeContext';
import { getEntries, deleteEntry } from '../../storage/entryStorage';
import { Entry } from '../../types/Entry';
import EntryCard from '../../components/EntryCard';
import { useHomePermissions } from '../../hooks/usePermissions';
import { FontAwesome } from '@expo/vector-icons';
import styles from './styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const [entries, setEntries] = useState<Entry[]>([]);

  useHomePermissions();

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await getEntries();
        setEntries(data);
      };
      load();
    }, [])
  );

  const handleRemove = (id: string) => {
    Alert.alert('Remove Entry', 'Are you sure you want to remove this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await deleteEntry(id);
          setEntries(prev => prev.filter(e => e.id !== id));
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
            <FontAwesome name="camera" size={32} color={theme.subText} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No Entries yet.</Text>
          <Text style={[styles.emptySubText, { color: theme.subText }]}>
            Tap the + button to capture{'\n'}your first travel memory.
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EntryCard entry={item} onRemove={handleRemove} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
        onPress={() => navigation.navigate('AddEntry')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
