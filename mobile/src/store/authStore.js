import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  restoreToken: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      if (token && user) {
        set({ token, user: JSON.parse(user) });
      }
    } catch (e) {
      console.error('Failed to restore token', e);
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Login failed', loading: false });
      return false;
    }
  },

  register: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      await authService.register(email, password, name);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Registration failed', loading: false });
      return false;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));
