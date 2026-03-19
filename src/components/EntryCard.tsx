import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Entry } from '../types/Entry';
import { useTheme } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
  entry: Entry;
  onRemove: (id: string) => void;
};

export default function EntryCard({ entry, onRemove }: Props) {
  const { theme } = useTheme();

  const formattedDate = new Date(entry.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      {/* Photo */}
      <Image source={{ uri: entry.imageUri }} style={styles.image} />

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {entry.title}
        </Text>
        <View style={styles.locationRow}>
          <FontAwesome name="map-marker" size={12} color={theme.primary} style={styles.pinIcon} />
          <Text style={[styles.address, { color: theme.subText }]} numberOfLines={2}>
            {entry.address}
          </Text>
        </View>
        <Text style={[styles.date, { color: theme.subText }]}>{formattedDate}</Text>
      </View>

      {/* Remove */}
      <TouchableOpacity
        style={[styles.removeButton, { borderTopColor: theme.border }]}
        onPress={() => onRemove(entry.id)}
      >
        <FontAwesome name="trash-o" size={13} color={theme.danger} />
        <Text style={[styles.removeText, { color: theme.danger }]}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  info: {
    padding: 14,
    paddingBottom: 10,
    gap: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  pinIcon: {
    marginTop: 2,
  },
  address: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  date: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderTopWidth: 1,
  },
  removeText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
