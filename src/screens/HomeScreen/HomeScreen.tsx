import React, { useCallback, useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Alert, TextInput, ScrollView,
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return entries;
    return entries.filter(e =>
      e.title.toLowerCase().includes(query) ||
      e.address.toLowerCase().includes(query)
    );
  }, [entries, searchQuery]);

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

  const renderEmptyState = (icon: string, title: string, subtitle: string) => (
    <ScrollView
      contentContainerStyle={styles.emptyContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.emptyIconCircle, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}>
        <FontAwesome name={icon as any} size={28} color={theme.subText} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.emptySubText, { color: theme.subText }]}>{subtitle}</Text>
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Search bar — only show when there are entries */}
      {entries.length > 0 && (
        <View style={[styles.searchWrapper, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <FontAwesome name="search" size={14} color={theme.subText} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search by title or location..."
            placeholderTextColor={theme.subText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <FontAwesome name="times-circle" size={14} color={theme.subText} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {entries.length === 0 ? (
        renderEmptyState('camera', 'No Entries yet.', 'Tap the + button to capture\nyour first travel memory.')
      ) : filteredEntries.length === 0 ? (
        renderEmptyState('search', 'No results found.', 'Try searching by a different\ntitle or location.')
      ) : (
        <FlatList
          data={filteredEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EntryCard entry={item} onRemove={handleRemove} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
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
