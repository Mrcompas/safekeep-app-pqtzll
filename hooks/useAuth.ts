
import { useState, useEffect, createContext, useContext } from 'react';
import { User, AuthState } from '../types/item';
import { getCurrentUser } from '../utils/storage';
import { login as authLogin, signup as authSignup, logout as authLogout, LoginCredentials, SignupCredentials } from '../utils/auth';

const AuthContext = createContext<{
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  signup: (credentials: SignupCredentials) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Always call hooks in the same order
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setAuthState({
          user,
          isAuthenticated: user !== null,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error loading user:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await authLogin(credentials);
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await authSignup(credentials);
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, message: 'An error occurred during signup' };
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshAuth = async () => {
    try {
      const user = await getCurrentUser();
      setAuthState({
        user,
        isAuthenticated: user !== null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  if (!context) {
    // Return the default implementation when context is not available
    return {
      authState,
      login,
      signup,
      logout,
      refreshAuth,
    };
  }
  
  return context;
};

export { AuthContext };
