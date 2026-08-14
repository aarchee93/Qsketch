/**
 * Concepts Storage Utilities
 * Saves and retrieves user-created quantum concepts
 * Uses Supabase for cloud storage with localStorage fallback
 */

import { safeGetStorage, safeSetStorage } from './storageUtils';
import { supabase } from './supabaseClient';

const CONCEPTS_KEY = 'qsketch_concepts';

/**
 * Get current user ID from Supabase session
 * @returns {string|null} User ID or null if not authenticated
 */
const getUserId = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch (err) {
    console.error('Error getting user ID:', err);
    return null;
  }
};

/**
 * Initialize or get concepts
 * @returns {Promise<Array>} Array of concept objects
 */
export const initializeConcepts = async () => {
  const userId = await getUserId();

  // If not authenticated, use localStorage only
  if (!userId) {
    const existing = safeGetStorage(CONCEPTS_KEY, null);
    if (existing && Array.isArray(existing)) {
      return existing;
    }
    return [];
  }

  // Try to fetch from Supabase
  try {
    const { data, error } = await supabase
      .from('user_concepts')
      .select('concepts_data')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching concepts:', error);
    }

    if (data) {
      const concepts = JSON.parse(data.concepts_data);
      // Keep localStorage in sync
      safeSetStorage(CONCEPTS_KEY, concepts);
      return concepts;
    }

    // Create new record if doesn't exist
    const emptyConceptsData = JSON.stringify([]);
    await supabase.from('user_concepts').insert({
      user_id: userId,
      concepts_data: emptyConceptsData,
    });

    return [];
  } catch (err) {
    console.error('Error initializing concepts:', err);
    // Fallback to localStorage
    const existing = safeGetStorage(CONCEPTS_KEY, null);
    return existing && Array.isArray(existing) ? existing : [];
  }
};

/**
 * Add a new concept
 * @param {Object} newConcept - Concept object with title, description, content, etc.
 * @returns {Promise<{success: boolean, data: Object|null, error: string|null}>}
 */
export const addConcept = async (newConcept) => {
  try {
    const userId = await getUserId();
    const concepts = await initializeConcepts();

    const conceptWithId = {
      ...newConcept,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const updatedConcepts = [...concepts, conceptWithId];

    // Save to localStorage
    safeSetStorage(CONCEPTS_KEY, updatedConcepts);

    // Save to Supabase if authenticated
    if (userId) {
      const { error } = await supabase
        .from('user_concepts')
        .update({ concepts_data: JSON.stringify(updatedConcepts) })
        .eq('user_id', userId);

      if (error) {
        console.error('Error saving concept to Supabase:', error);
      }
    }

    return { success: true, data: conceptWithId, error: null };
  } catch (error) {
    console.error('Error adding concept:', error);
    return { success: false, data: null, error: error.message };
  }
};

/**
 * Delete a concept by ID
 * @param {string} conceptId - ID of concept to delete
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export const deleteConcept = async (conceptId) => {
  try {
    const userId = await getUserId();
    const concepts = await initializeConcepts();

    const updatedConcepts = concepts.filter(c => c.id !== conceptId);

    // Save to localStorage
    safeSetStorage(CONCEPTS_KEY, updatedConcepts);

    // Save to Supabase if authenticated
    if (userId) {
      const { error } = await supabase
        .from('user_concepts')
        .update({ concepts_data: JSON.stringify(updatedConcepts) })
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting concept from Supabase:', error);
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting concept:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a concept
 * @param {string} conceptId - ID of concept to update
 * @param {Object} updates - Fields to update
 * @returns {Promise<{success: boolean, data: Object|null, error: string|null}>}
 */
export const updateConcept = async (conceptId, updates) => {
  try {
    const userId = await getUserId();
    const concepts = await initializeConcepts();

    const updatedConcepts = concepts.map(c =>
      c.id === conceptId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    );

    // Save to localStorage
    safeSetStorage(CONCEPTS_KEY, updatedConcepts);

    // Save to Supabase if authenticated
    if (userId) {
      const { error } = await supabase
        .from('user_concepts')
        .update({ concepts_data: JSON.stringify(updatedConcepts) })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating concept in Supabase:', error);
      }
    }

    const updated = updatedConcepts.find(c => c.id === conceptId);
    return { success: true, data: updated, error: null };
  } catch (error) {
    console.error('Error updating concept:', error);
    return { success: false, data: null, error: error.message };
  }
};

/**
 * Get all concepts
 * @returns {Promise<Array>} Array of concept objects
 */
export const getAllConcepts = async () => {
  try {
    return await initializeConcepts();
  } catch (error) {
    console.error('Error getting all concepts:', error);
    return [];
  }
};

/**
 * Export concepts as JSON (for backup)
 * @returns {Promise<string|null>} JSON string or null on error
 */
export const exportConcepts = async () => {
  try {
    const concepts = await initializeConcepts();
    return JSON.stringify(
      {
        concepts,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  } catch (error) {
    console.error('Error exporting concepts:', error);
    return null;
  }
};

/**
 * Import concepts from JSON
 * @param {string} jsonString - JSON string to import
 * @returns {Promise<{success: boolean, count: number, error: string|null}>}
 */
export const importConcepts = async (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    const userId = await getUserId();
    let concepts = await initializeConcepts();

    if (data.concepts && Array.isArray(data.concepts)) {
      // Add imported concepts with new IDs
      const importedConcepts = data.concepts.map(c => ({
        ...c,
        id: crypto.randomUUID(),
        importedAt: new Date().toISOString(),
      }));

      concepts = [...concepts, ...importedConcepts];

      // Save to localStorage
      safeSetStorage(CONCEPTS_KEY, concepts);

      // Save to Supabase if authenticated
      if (userId) {
        const { error } = await supabase
          .from('user_concepts')
          .update({ concepts_data: JSON.stringify(concepts) })
          .eq('user_id', userId);

        if (error) {
          console.error('Error importing concepts to Supabase:', error);
        }
      }

      return { success: true, count: importedConcepts.length, error: null };
    }

    return { success: false, count: 0, error: 'Invalid import format' };
  } catch (error) {
    console.error('Error importing concepts:', error);
    return { success: false, count: 0, error: error.message };
  }
};
