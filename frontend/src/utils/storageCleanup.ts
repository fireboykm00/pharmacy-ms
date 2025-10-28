/**
 * Utility to clean up localStorage and handle invalid values
 */

// List of all auth-related keys
const AUTH_STORAGE_KEYS = ['token', 'user', 'tokenTimestamp'];

/**
 * Validates if a localStorage value is valid (not "undefined", "null", or empty)
 */
export const isValidStorageValue = (value: string | null): boolean => {
  if (!value) return false;
  if (value === 'undefined' || value === 'null') return false;
  return true;
};

/**
 * Safely get item from localStorage with validation
 */
export const safeGetItem = (key: string): string | null => {
  try {
    const value = localStorage.getItem(key);
    return isValidStorageValue(value) ? value : null;
  } catch (error) {
    console.error(`Error getting localStorage item "${key}":`, error);
    return null;
  }
};

/**
 * Safely set item to localStorage
 */
export const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting localStorage item "${key}":`, error);
    return false;
  }
};

/**
 * Safely remove item from localStorage
 */
export const safeRemoveItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage item "${key}":`, error);
    return false;
  }
};

/**
 * Clean up invalid localStorage entries
 * This should be called on app initialization
 */
export const cleanupInvalidStorage = (): void => {
  console.log('Running localStorage cleanup...');
  
  AUTH_STORAGE_KEYS.forEach(key => {
    const value = localStorage.getItem(key);
    
    if (value && !isValidStorageValue(value)) {
      console.log(`Removing invalid localStorage key: ${key} (value: ${value})`);
      safeRemoveItem(key);
    }
  });
  
  // Also check for any orphaned keys that might exist
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && AUTH_STORAGE_KEYS.includes(key)) {
        const value = localStorage.getItem(key);
        if (!isValidStorageValue(value)) {
          console.log(`Removing invalid orphaned key: ${key}`);
          safeRemoveItem(key);
        }
      }
    }
  } catch (error) {
    console.error('Error during storage cleanup:', error);
  }
  
  console.log('localStorage cleanup completed');
};

/**
 * Clear all auth-related storage
 */
export const clearAuthStorage = (): void => {
  console.log('Clearing all auth storage...');
  AUTH_STORAGE_KEYS.forEach(key => safeRemoveItem(key));
};
