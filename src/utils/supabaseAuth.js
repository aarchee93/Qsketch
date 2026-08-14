/**
 * Supabase Authentication Service
 * Handles user signup, login, logout, and session management
 */

import { supabase } from './supabaseClient';

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password (min 6 chars)
 * @returns {Promise<{success: boolean, data: object|null, error: string|null}>}
 */
export const signUp = async (email, password) => {
  try {
    if (!email || !password) {
      return { success: false, data: null, error: 'Hold up! Both email AND password need to be filled in.' };
    }

    if (password.length < 6) {
      return { success: false, data: null, error: 'Make your password stronger — at least 6 characters, please!' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, data: null, error: mapAuthError(error.message) };
    }

    return { success: true, data, error: null };
  } catch (err) {
    console.error('Sign up error:', err);
    return { success: false, data: null, error: mapAuthError(err.message) };
  }
};

/**
 * Sign in an existing user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, data: object|null, error: string|null}>}
 */
export const signIn = async (email, password) => {
  try {
    if (!email || !password) {
      return { success: false, data: null, error: 'Hold up! Both email AND password need to be filled in.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, data: null, error: mapAuthError(error.message) };
    }

    return { success: true, data, error: null };
  } catch (err) {
    console.error('Sign in error:', err);
    return { success: false, data: null, error: mapAuthError(err.message) };
  }
};

/**
 * Sign out the current user
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Sign out error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Get the current user session
 * @returns {Promise<{user: object|null, session: object|null, error: string|null}>}
 */
export const getCurrentSession = async () => {
  try {
    const {
      data: { user, session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    return { user, session, error: null };
  } catch (err) {
    console.error('Get session error:', err);
    return { user: null, session: null, error: err.message };
  }
};

/**
 * Listen to auth state changes
 * @param {function} callback - Function to call when auth state changes
 * @returns {function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session?.user ?? null, session);
  });

  return () => subscription?.unsubscribe();
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Map Supabase errors to friendly messages
 * @param {string} error - Error message from Supabase
 * @returns {string} User-friendly error message
 */
export const mapAuthError = (error) => {
  if (!error) return "An unexpected error occurred. Try again in a moment.";
  
  const errorLower = error.toLowerCase();
  
  // Invalid login credentials
  if (errorLower.includes('invalid login credentials') || errorLower.includes('wrong password')) {
    return "Email or password is off. Check both and try again.";
  }
  
  // Email already in use
  if (errorLower.includes('already registered') || errorLower.includes('user already exists')) {
    return "That email's already taken! Try logging in, or pick a new one.";
  }
  
  // User not found
  if (errorLower.includes('user not found') || errorLower.includes('no user found')) {
    return "Can't find that account. Create one first, or check the email.";
  }
  
  // Email not confirmed
  if (errorLower.includes('email not confirmed') || errorLower.includes('email_not_confirmed')) {
    return "Check your email and confirm your account before logging in.";
  }
  
  // Too many attempts
  if (errorLower.includes('too many requests') || errorLower.includes('rate limit')) {
    return "Too many attempts. Wait a moment and try again.";
  }
  
  // Return original error as fallback
  return error;
};

/**
 * Reset password for a user
 * @param {string} email - User email
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export const resetPassword = async (email) => {
  try {
    if (!email) {
      return { success: false, error: 'Psst... you forgot the email! That\'s how we find you.' };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return { success: false, error: mapAuthError(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Reset password error:', err);
    return { success: false, error: mapAuthError(err.message) };
  }
};
