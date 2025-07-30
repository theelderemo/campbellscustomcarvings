// src/lib/actions.ts

import { supabase } from './supabase/client';
import { UserProfile } from './types';

/**
 * Check if the current user has admin role
 */
export async function checkAdminRole(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error || !userProfile) {
      return false;
    }

    return userProfile.role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !userProfile) {
      return null;
    }

    return userProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .upsert({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error || !userProfile) {
      console.error('Error upserting user profile:', error);
      return null;
    }

    return userProfile;
  } catch (error) {
    console.error('Error upserting user profile:', error);
    return null;
  }
}

/**
 * Sign up a new user and create their profile
 */
export async function signUpUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string,
  role: 'admin' | 'customer' = 'customer'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Create user profile with your schema structure
      const profileResult = await upsertUserProfile({
        user_id: data.user.id,
        email: data.user.email!,
        role,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      });

      if (!profileResult) {
        return { success: false, error: 'Failed to create user profile' };
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}


/**
 * Sign in user and check admin role
 */
export async function signInUser(email: string, password: string): Promise<{ success: boolean; isAdmin?: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      const isAdmin = await checkAdminRole();
      return { success: true, isAdmin };
    }

    return { success: false, error: 'Sign in failed' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}
