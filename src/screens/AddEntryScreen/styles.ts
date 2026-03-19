import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 48,
    paddingTop: 20,
  },

  // Camera placeholder
  cameraPlaceholder: {
    height: 220,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 10,
  },
  cameraIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cameraPlaceholderText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cameraPlaceholderSub: {
    fontSize: 12,
    letterSpacing: 0.2,
  },

  // Preview
  previewWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  preview: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  retakeButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  retakeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Loading
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  loadingText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },

  // Address
  addressCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.2,
  },

  // Save button
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});