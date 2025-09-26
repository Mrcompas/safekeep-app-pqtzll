
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface NotificationSnoozeProps {
  visible: boolean;
  onClose: () => void;
  onSnooze: (hours: number) => void;
  itemName: string;
}

const snoozeOptions = [
  { label: '1 hour', hours: 1 },
  { label: '4 hours', hours: 4 },
  { label: '1 day', hours: 24 },
  { label: '3 days', hours: 72 },
  { label: '1 week', hours: 168 },
];

export default function NotificationSnooze({ visible, onClose, onSnooze, itemName }: NotificationSnoozeProps) {
  const handleSnooze = (hours: number) => {
    onSnooze(hours);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Snooze Reminder</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.message}>
            Remind me about "{itemName}" warranty in:
          </Text>

          <View style={styles.options}>
            {snoozeOptions.map((option) => (
              <TouchableOpacity
                key={option.hours}
                style={styles.option}
                onPress={() => handleSnooze(option.hours)}
              >
                <Icon name="time" size={20} color={colors.primary} />
                <Text style={styles.optionText}>{option.label}</Text>
                <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  options: {
    gap: 8,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    backgroundColor: colors.grey + '20',
    borderRadius: 12,
    gap: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center' as const,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
};
