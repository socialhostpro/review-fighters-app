import { User, UserRole, UserProfile } from '../types';
import { mockUsers, mockUserProfiles } from '../data/mockData';
import { ConvexReactClient } from 'convex/react';
import { api } from '../convex/_generated/api';
import convex from '../convex';
import { emailService } from './emailService';

const FAKE_TOKEN_KEY = 'fake_auth_token';

// Simulates API delay
const delay = <T,>(ms: number, value?: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value as T), ms));

export const authService = {
  login: async (email: string, pass: string): Promise<User> => {
    console.log(`Attempting login for: ${email}`); // Keep pass out of logs
    console.log('Convex client URL:', (convex as any)._address); // Debug Convex URL
    await delay(500);
    
    try {
      // Use Convex to find user by email
      console.log('Querying Convex for user by email...');
      const user = await convex.query(api.auth.getUserByEmail, { email });
      console.log('Convex query result:', user);
      
      if (user) {
        localStorage.setItem(FAKE_TOKEN_KEY, JSON.stringify({ userId: user._id, email: user.email, role: user.role, name: user.name }));
        return {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          affiliateId: user.affiliateId,
          staffId: user.staffId,
          salesId: user.salesId,
        };
      }
      console.log('No user found in Convex, throwing error');
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    console.log(`Attempting signup for: ${email}`);
    await delay(700);

    try {
      // Use Convex to create new user
      const userId = await convex.mutation(api.auth.createUser, {
        email,
        name,
        role: UserRole.USER,
      });

      const newUser: User = {
        id: userId,
        email,
        name,
        role: UserRole.USER,
      };

      console.log('New user created:', newUser);
      return newUser;
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        throw new Error('An account with this email already exists.');
      }
      throw error;
    }
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
        // Use Convex to get current user details
        const user = await convex.query(api.auth.getUserById, { userId: parsedData.userId });
        if (user) {
          return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
            affiliateId: user.affiliateId,
            staffId: user.staffId,
            salesId: user.salesId,
          };
        }
      } catch (e) {
        console.error("Error parsing token data", e);
        localStorage.removeItem(FAKE_TOKEN_KEY); // Clear corrupted token
        return null;
      }
    }
    return null;
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      // Check if user exists
      const user = await convex.query(api.auth.getUserByEmail, { email });
      if (!user) {
        throw new Error('No account found with this email address');
      }

      // Generate a reset token (in production, this would be a secure token)
      const resetToken = btoa(email + '_' + Date.now());

      // Store the reset token in Convex (in production, this would be hashed)
      await convex.mutation(api.auth.storeResetToken, {
        userId: user._id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      });

      // Send reset email
      await emailService.sendPasswordResetEmail(user.name, email, resetToken);
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      // Verify token and get user (in production, this would verify a hashed token)
      const resetInfo = await convex.query(api.auth.verifyResetToken, { token });
      if (!resetInfo) {
        throw new Error('Invalid or expired reset token');
      }

      // Update password in Convex
      await convex.mutation(api.auth.updatePassword, {
        userId: resetInfo.userId,
        newPassword
      });

      // Invalidate the used token
      await convex.mutation(api.auth.invalidateResetToken, { token });
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
    try {
      // Verify current password
      const isValid = await convex.query(api.auth.verifyPassword, {
        userId,
        password: currentPassword
      });

      if (!isValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      await convex.mutation(api.auth.updatePassword, {
        userId,
        newPassword
      });
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  }
};