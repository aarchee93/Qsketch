/**
 * Game Progress Storage Utilities
 * Saves and retrieves player progress, stats, and achievements
 * Now uses Supabase for cloud storage with localStorage fallback
 */

import { safeGetStorage, safeSetStorage } from './storageUtils';
import { supabase } from './supabaseClient';

const GAME_PROGRESS_KEY = 'qsketch_game_progress';
const ACHIEVEMENTS_KEY = 'qsketch_achievements';

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
 * Initialize or get game progress
 */
export const initializeGameProgress = async () => {
  const userId = await getUserId();

  // If not authenticated, use localStorage only
  if (!userId) {
    const existing = safeGetStorage(GAME_PROGRESS_KEY, null);
    if (existing && typeof existing === 'object') {
      return existing;
    }

    const newProgress = {
      completedLevels: [],
      levelStats: {},
      totalGamesPlayed: 0,
      totalMoveCount: 0,
      startedAt: new Date().toISOString(),
    };

    safeSetStorage(GAME_PROGRESS_KEY, newProgress);
    return newProgress;
  }

  // Try to fetch from Supabase
  try {
    const { data, error } = await supabase
      .from('game_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching game progress:', error);
    }

    if (data) {
      return JSON.parse(data.progress_data);
    }

    // Create new progress if doesn't exist
    const newProgress = {
      completedLevels: [],
      levelStats: {},
      totalGamesPlayed: 0,
      totalMoveCount: 0,
      startedAt: new Date().toISOString(),
    };

    await supabase.from('game_progress').insert({
      user_id: userId,
      progress_data: JSON.stringify(newProgress),
    });

    return newProgress;
  } catch (err) {
    console.error('Error initializing game progress:', err);
    // Fallback to localStorage
    const existing = safeGetStorage(GAME_PROGRESS_KEY, null);
    if (existing && typeof existing === 'object') {
      return existing;
    }

    const newProgress = {
      completedLevels: [],
      levelStats: {},
      totalGamesPlayed: 0,
      totalMoveCount: 0,
      startedAt: new Date().toISOString(),
    };

    safeSetStorage(GAME_PROGRESS_KEY, newProgress);
    return newProgress;
  }
};

/**
 * Save level completion
 * @param {number} levelIndex - Index of completed level
 * @param {number} movesUsed - Number of moves taken
 * @param {number} timeSpent - Time spent in seconds
 * @param {boolean} usedUndo - Whether undo was used
 */
export const saveLevelCompletion = async (levelIndex, movesUsed, timeSpent, usedUndo) => {
  try {
    const userId = await getUserId();
    const progress = await initializeGameProgress();

    // Mark level as completed
    if (!progress.completedLevels.includes(levelIndex)) {
      progress.completedLevels.push(levelIndex);
    }

    // Store level statistics
    if (!progress.levelStats[levelIndex]) {
      progress.levelStats[levelIndex] = [];
    }

    progress.levelStats[levelIndex].push({
      movesUsed,
      timeSpent,
      usedUndo,
      completedAt: new Date().toISOString(),
    });

    // Update global stats
    progress.totalGamesPlayed += 1;
    progress.totalMoveCount += movesUsed;

    // Save to localStorage
    safeSetStorage(GAME_PROGRESS_KEY, progress);

    // Save to Supabase if authenticated
    if (userId) {
      const { error } = await supabase
        .from('game_progress')
        .update({ progress_data: JSON.stringify(progress) })
        .eq('user_id', userId);

      if (error) {
        console.error('Error saving level completion to Supabase:', error);
      }
    }

    return progress;
  } catch (error) {
    console.error('Error saving level completion:', error);
    return null;
  }
};

/**
 * Get level best stats (best moves, fastest time)
 * @param {number} levelIndex - Level index
 */
export const getLevelBestStats = async (levelIndex) => {
  try {
    const progress = await initializeGameProgress();
    const levelStats = progress.levelStats[levelIndex] || [];

    if (levelStats.length === 0) {
      return { completed: false, attempts: 0 };
    }

    const bestMoves = Math.min(...levelStats.map(s => s.movesUsed));
    const fastestTime = Math.min(...levelStats.map(s => s.timeSpent));
    const perfectAttempts = levelStats.filter(s => !s.usedUndo).length;

    return {
      completed: true,
      attempts: levelStats.length,
      bestMoves,
      fastestTime,
      perfectAttempts,
    };
  } catch (error) {
    console.error('Error getting level stats:', error);
    return { completed: false, attempts: 0 };
  }
};

/**
 * Save achievements
 * @param {string[]} newAchievementIds - Array of achievement IDs
 */
export const saveAchievements = async (newAchievementIds) => {
  try {
    const userId = await getUserId();
    const existing = safeGetStorage(ACHIEVEMENTS_KEY, []);
    const allAchievements = Array.from(new Set([...existing, ...newAchievementIds]));
    const trulyNew = newAchievementIds.filter((id) => !existing.includes(id));

    // Save to localStorage
    safeSetStorage(ACHIEVEMENTS_KEY, allAchievements);

    // Save to Supabase if authenticated
    if (userId) {
      const { error } = await supabase
        .from('user_achievements')
        .upsert(
          {
            user_id: userId,
            achievement_ids: allAchievements,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error('Error saving achievements to Supabase:', error);
      }
    }

    if (trulyNew.length > 0) {
      window.dispatchEvent(new CustomEvent('qsketch:achievement', { detail: { ids: trulyNew } }));
    }
    return allAchievements;
  } catch (error) {
    console.error('Error saving achievements:', error);
    return existing || [];
  }
};

/**
 * Get all achievements
 */
export const getAchievements = () => {
  try {
    return safeGetStorage(ACHIEVEMENTS_KEY, []);
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};

/**
 * Check if achievement is unlocked
 * @param {string} achievementId - Achievement ID
 */
export const isAchievementUnlocked = (achievementId) => {
  const achievements = getAchievements();
  return achievements.includes(achievementId);
};

/**
 * Get game summary stats
 */
export const getGameSummary = async () => {
  try {
    const progress = await initializeGameProgress();
    const achievements = getAchievements();

    return {
      completedLevels: progress.completedLevels.length,
      totalLevels: 11,
      totalGamesPlayed: progress.totalGamesPlayed,
      totalMoveCount: progress.totalMoveCount,
      averageMovesPerGame:
        progress.totalGamesPlayed > 0
          ? (progress.totalMoveCount / progress.totalGamesPlayed).toFixed(1)
          : 0,
      achievementsUnlocked: achievements.length,
      totalAchievements: 11,
      completionPercentage:
        progress.completedLevels.length > 0
          ? ((progress.completedLevels.length / 11) * 100).toFixed(0)
          : 0,
    };
  } catch (error) {
    console.error('Error getting game summary:', error);
    return {
      completedLevels: 0,
      totalLevels: 11,
      totalGamesPlayed: 0,
      totalMoveCount: 0,
      averageMovesPerGame: 0,
      achievementsUnlocked: 0,
      totalAchievements: 11,
      completionPercentage: 0,
    };
  }
};

/**
 * Reset all progress (for testing or user request)
 */
export const resetAllProgress = async () => {
  try {
    const userId = await getUserId();

    // Reset localStorage
    safeSetStorage(GAME_PROGRESS_KEY, {
      completedLevels: [],
      levelStats: {},
      totalGamesPlayed: 0,
      totalMoveCount: 0,
      startedAt: new Date().toISOString(),
    });
    safeSetStorage(ACHIEVEMENTS_KEY, []);

    // Reset in Supabase if authenticated
    if (userId) {
      await supabase
        .from('game_progress')
        .update({
          progress_data: JSON.stringify({
            completedLevels: [],
            levelStats: {},
            totalGamesPlayed: 0,
            totalMoveCount: 0,
            startedAt: new Date().toISOString(),
          }),
        })
        .eq('user_id', userId);

      await supabase
        .from('user_achievements')
        .update({ achievement_ids: [] })
        .eq('user_id', userId);
    }

    return true;
  } catch (error) {
    console.error('Error resetting progress:', error);
    return false;
  }
};

/**
 * Export game progress as JSON (for backup)
 */
export const exportGameProgress = async () => {
  try {
    const progress = await initializeGameProgress();
    const achievements = getAchievements();

    return JSON.stringify(
      {
        progress,
        achievements,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  } catch (error) {
    console.error('Error exporting progress:', error);
    return null;
  }
};

/**
 * Import game progress from JSON
 */
export const importGameProgress = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);

    if (data.progress) {
      safeSetStorage(GAME_PROGRESS_KEY, data.progress);
    }

    if (data.achievements) {
      safeSetStorage(ACHIEVEMENTS_KEY, data.achievements);
    }

    return true;
  } catch (error) {
    console.error('Error importing progress:', error);
    return false;
  }
};