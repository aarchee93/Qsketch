/**
 * Safe localStorage utility with fallback to in-memory storage
 */

const IN_MEMORY_STORAGE = {};

/**
 * Safely retrieve item from localStorage with fallback
 * @param {string} key - Storage key
 * @param {any} defaultValue - Fallback value if not found
 * @returns {any} - Retrieved value or default
 */
export const safeGetStorage = (key, defaultValue = null) => {
  try {
    // Test if localStorage is available
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);

    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    try {
      return JSON.parse(item);
    } catch (e) {
      console.warn(`Failed to parse localStorage item "${key}":`, e);
      return defaultValue;
    }
  } catch (e) {
    console.warn('localStorage unavailable, using in-memory fallback:', e);
    return IN_MEMORY_STORAGE[key] || defaultValue;
  }
};

/**
 * Safely set item in localStorage with fallback
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} - Success status
 */
export const safeSetStorage = (key, value) => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);

    localStorage.setItem(key, JSON.stringify(value));
    // Also update in-memory storage as backup
    IN_MEMORY_STORAGE[key] = value;
    return true;
  } catch (e) {
    console.warn('Failed to set localStorage, using in-memory storage:', e);
    // Fallback to in-memory storage
    IN_MEMORY_STORAGE[key] = value;
    return false;
  }
};

/**
 * Safely remove item from both storages
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
export const safeRemoveStorage = (key) => {
  try {
    localStorage.removeItem(key);
    delete IN_MEMORY_STORAGE[key];
    return true;
  } catch (e) {
    console.warn('Failed to remove localStorage item:', e);
    delete IN_MEMORY_STORAGE[key];
    return false;
  }
};

/**
 * Clear all in-memory storage
 */
export const clearInMemoryStorage = () => {
  Object.keys(IN_MEMORY_STORAGE).forEach(key => {
    delete IN_MEMORY_STORAGE[key];
  });
};
