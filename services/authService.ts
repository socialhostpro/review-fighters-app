
import { User, UserRole, UserProfile } from '../types';
import { mockUsers, mockUserProfiles } from '../data/mockData';

const FAKE_TOKEN_KEY = 'fake_auth_token';

// Simulates API delay
const delay = <T,>(ms: number, value?: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value as T), ms));

export const authService = {
  login: async (email: string, pass: string): Promise<User> => {
    console.log(`Attempting login for: ${email}`); // Keep pass out of logs
    await delay(500);
    const user = mockUsers.find(u => u.email === email); // Simplified: no password check for mock
    if (user) {
      localStorage.setItem(FAKE_TOKEN_KEY, JSON.stringify({ userId: user.id, email: user.email, role: user.role, name: user.name }));
      return user;
    }
    throw new Error('Invalid credentials');
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    console.log(`Attempting signup for: ${email}`);
    await delay(700);

    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email,
      name,
      role: UserRole.USER, // Default role for new signups
      // affiliateId and staffId are not set on initial user signup
    };
    mockUsers.push(newUser);

    // Create basic user profile
    const newUserProfile: UserProfile = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      address: '', // Initialize with empty or default values
      phone: '',
      zipCode: '',
      // Business fields and notes can be populated later through profile editing
    };
    mockUserProfiles.push(newUserProfile);

    console.log('New user created:', newUser);
    console.log('New user profile created:', newUserProfile);
    
    // Signup doesn't automatically log in. User needs to login separately.
    return newUser;
  },

  logout: async (): Promise<void> => {
    await delay(200);
    localStorage.removeItem(FAKE_TOKEN_KEY);
    console.log('User logged out');
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(100);
    const tokenData = localStorage.getItem(FAKE_TOKEN_KEY);
    if (tokenData) {
      try {
        const parsedData = JSON.parse(tokenData);
        // Find full user details from mock data if needed, or just use token data
        const user = mockUsers.find(u => u.id === parsedData.userId);
        return user || null; // Return full user object or null if not found
      } catch (e) {
        console.error("Error parsing token data", e);
        localStorage.removeItem(FAKE_TOKEN_KEY); // Clear corrupted token
        return null;
      }
    }
    return null;
  },
};