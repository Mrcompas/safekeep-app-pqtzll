
import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

export default function SignupScreen() {
  console.log('SignupScreen rendered');

  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signup({ 
        email: email.trim(), 
        password, 
        confirmPassword 
      });
      
      if (result.success) {
        Alert.alert(
          'Account Created!',
          'Your SafeKeep account has been created successfully. Any existing warranty items have been linked to your account.',
          [{ text: 'Get Started', onPress: () => router.replace('/') }]
        );
      } else {
        Alert.alert('Signup Failed', result.message || 'Please check your information and try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={commonStyles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingBottom: 40 }}>
            {/* Header */}
            <View style={[commonStyles.row, { marginBottom: 32 }]}>
              <TouchableOpacity onPress={() => router.back()}>
                <Icon name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[commonStyles.title, { flex: 1, textAlign: 'center', marginBottom: 0 }]}>
                Create Account
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <Text style={[commonStyles.textSecondary, { marginBottom: 32, textAlign: 'center' }]}>
              Create your SafeKeep account to sync your warranty data across all your devices.
            </Text>

            {/* Signup Form */}
            <View style={{ gap: 20 }}>
              <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                required
              />

              <View>
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password (min. 6 characters)"
                  secureTextEntry={!showPassword}
                  required
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 16,
                    top: 44,
                    padding: 4,
                  }}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>

              <View>
                <TextInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  required
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 16,
                    top: 44,
                    padding: 4,
                  }}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon 
                    name={showConfirmPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ marginTop: 32, gap: 16 }}>
              <Button
                text={isLoading ? 'Creating Account...' : 'Create Account'}
                onPress={handleSignup}
                disabled={isLoading}
                style={buttonStyles.primary}
                textStyle={buttonStyles.text}
              />

              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                <Text style={[commonStyles.textSecondary, { marginHorizontal: 16 }]}>or</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              </View>

              <Button
                text="Sign In to Existing Account"
                onPress={() => router.push('/auth/login')}
                disabled={isLoading}
                style={buttonStyles.secondary}
                textStyle={buttonStyles.textSecondary}
              />
            </View>

            {/* Skip Option */}
            <TouchableOpacity
              style={{ marginTop: 24, alignItems: 'center' }}
              onPress={() => router.replace('/')}
              disabled={isLoading}
            >
              <Text style={[commonStyles.textSecondary, { textDecorationLine: 'underline' }]}>
                Continue without account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
