
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#2196F3',      // Blue - main brand color
  secondary: '#1976D2',    // Darker blue
  accent: '#4CAF50',       // Green - accent color
  background: '#FFFFFF',   // White background
  backgroundAlt: '#F8FAFE', // Very light blue tint
  text: '#1A1A1A',         // Dark text
  textSecondary: '#6B7280', // Gray text
  success: '#4CAF50',      // Green for success states
  warning: '#FF9800',      // Orange for warnings
  error: '#F44336',        // Red for errors
  grey: '#E5E7EB',         // Light grey for borders
  card: '#FFFFFF',         // White card background
  shadow: 'rgba(33, 150, 243, 0.1)', // Blue-tinted shadow
  tabBar: '#FFFFFF',       // Tab bar background
  tabBarBorder: '#E5E7EB', // Tab bar border
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.grey,
  },
  accent: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  textSecondary: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    backgroundColor: colors.background,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
});
