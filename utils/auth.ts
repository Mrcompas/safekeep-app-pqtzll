
import { User } from '../types/item';
import { getCurrentUser, setCurrentUser, getUserByEmail, saveUser, migrateLocalItemsToUser } from './storage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  confirmPassword: string;
}

// Simple password hashing (in production, use proper bcrypt or similar)
const hashPassword = (password: string): string => {
  // This is a very basic hash - in production use proper encryption
  return btoa(password + 'safekeep_salt');
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true };
};

export const signup = async (credentials: SignupCredentials): Promise<{ success: boolean; message?: string; user?: User }> => {
  try {
    const { email, password, confirmPassword } = credentials;

    // Validate email
    if (!validateEmail(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { success: false, message: passwordValidation.message };
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { success: false, message: 'An account with this email already exists' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    // Save user with hashed password (stored separately for security)
    await saveUser(newUser);
    
    // Store password hash separately (in production, this should be more secure)
    const userWithPassword = { ...newUser, passwordHash: hashPassword(password) };
    await saveUser(userWithPassword as any);

    // Set as current user
    await setCurrentUser(newUser);

    // Migrate any existing local items to this user
    await migrateLocalItemsToUser(newUser.id);

    console.log('User signed up successfully:', newUser.email);
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Error during signup:', error);
    return { success: false, message: 'An error occurred during signup. Please try again.' };
  }
};

export const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string; user?: User }> => {
  try {
    const { email, password } = credentials;

    // Validate email
    if (!validateEmail(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    // Get user by email
    const user = await getUserByEmail(email) as any;
    if (!user) {
      return { success: false, message: 'No account found with this email address' };
    }

    // Verify password
    if (!user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return { success: false, message: 'Incorrect password' };
    }

    // Update last login time
    const updatedUser: User = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      lastLoginAt: new Date(),
    };

    await saveUser({ ...updatedUser, passwordHash: user.passwordHash } as any);
    await setCurrentUser(updatedUser);

    // Migrate any existing local items to this user (in case they added items while logged out)
    await migrateLocalItemsToUser(updatedUser.id);

    console.log('User logged in successfully:', updatedUser.email);
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, message: 'An error occurred during login. Please try again.' };
  }
};

export const logout = async (): Promise<void> => {
  try {
    await setCurrentUser(null);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return user !== null;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};
