
import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

export default function LoginScreen() {
  console.log('LoginScreen rendered');

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login({ email: email.trim(), password });
      
      if (result.success) {
        Alert.alert(
          'Welcome Back!',
          'You have successfully logged in.',
          [{ text: 'OK', onPress: () => router.replace('/') }]
        );
      } else {
        Alert.alert('Login Failed', result.message || 'Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
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
                Welcome Back
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <Text style={[commonStyles.textSecondary, { marginBottom: 32, textAlign: 'center' }]}>
              Sign in to your SafeKeep account to sync your warranty data across devices.
            </Text>

            {/* Login Form */}
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
                  placeholder="Enter your password"
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
            </View>

            {/* Action Buttons */}
            <View style={{ marginTop: 32, gap: 16 }}>
              <Button
                text={isLoading ? 'Signing In...' : 'Sign In'}
                onPress={handleLogin}
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
                text="Create New Account"
                onPress={() => router.push('/auth/signup')}
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
