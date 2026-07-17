import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initializeGameProgress,
  saveLevelCompletion,
  getLevelBestStats,
  saveAchievements,
  getAchievements,
  isAchievementUnlocked,
  getGameSummary,
  resetAllProgress,
  exportGameProgress,
  importGameProgress,
} from './gameProgressUtils';

// Mock storageUtils
vi.mock('./storageUtils', () => ({
  safeGetStorage: vi.fn(),
  safeSetStorage: vi.fn(),
}));

import { safeGetStorage, safeSetStorage } from './storageUtils';

describe('gameProgressUtils', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Setup default mock behavior
    safeGetStorage.mockImplementation((key, defaultValue) => defaultValue);
    safeSetStorage.mockImplementation(() => true);
  });

  describe('initializeGameProgress', () => {
    it('should create new progress object if not exists', () => {
      safeGetStorage.mockReturnValueOnce(null);

      const progress = initializeGameProgress();

      expect(progress).toHaveProperty('completedLevels');
      expect(progress).toHaveProperty('levelStats');
      expect(progress).toHaveProperty('totalGamesPlayed');
      expect(progress).toHaveProperty('totalMoveCount');
      expect(progress).toHaveProperty('startedAt');
      expect(progress.completedLevels).toEqual([]);
      expect(progress.totalGamesPlayed).toBe(0);
      expect(progress.totalMoveCount).toBe(0);
    });

    it('should return existing progress if it exists', () => {
      const existingProgress = {
        completedLevels: [0, 1],
        levelStats: {},
        totalGamesPlayed: 2,
        totalMoveCount: 15,
        startedAt: '2024-01-01T00:00:00Z',
      };

      safeGetStorage.mockReturnValueOnce(existingProgress);

      const progress = initializeGameProgress();

      expect(progress).toEqual(existingProgress);
    });

    it('should call safeSetStorage when creating new progress', () => {
      safeGetStorage.mockReturnValueOnce(null);

      initializeGameProgress();

      expect(safeSetStorage).toHaveBeenCalled();
    });
  });

  describe('saveLevelCompletion', () => {
    it('should save level completion with stats', () => {
      const mockProgress = {
        completedLevels: [],
        levelStats: {},
        totalGamesPlayed: 0,
        totalMoveCount: 0,
        startedAt: new Date().toISOString(),
      };

      safeGetStorage.mockReturnValueOnce(mockProgress);

      saveLevelCompletion(0, 5, 120, false);

      expect(safeSetStorage).toHaveBeenCalled();
      const savedProgress = safeSetStorage.mock.calls[0][1];
      expect(savedProgress.completedLevels).toContain(0);
      expect(savedProgress.totalGamesPlayed).toBe(1);
      expect(savedProgress.totalMoveCount).toBe(5);
    });

    it('should not add level twice if completed again', () => {
      const mockProgress = {
        completedLevels: [0],
        levelStats: {
          0: [{ movesUsed: 5, timeSpent: 120, usedUndo: false, completedAt: new Date().toISOString() }],
        },
        totalGamesPlayed: 1,
        totalMoveCount: 5,
        startedAt: new Date().toISOString(),
      };

      safeGetStorage.mockReturnValueOnce(mockProgress);

      saveLevelCompletion(0, 4, 100, false);

      const savedProgress = safeSetStorage.mock.calls[0][1];
      expect(savedProgress.completedLevels.filter(l => l === 0).length).toBe(1);
    });

    it('should track multiple attempts on same level', () => {
      const mockProgress = {
        completedLevels: [0],
        levelStats: {
          0: [{ movesUsed: 5, timeSpent: 120, usedUndo: false, completedAt: new Date().toISOString() }],
        },
        totalGamesPlayed: 1,
        totalMoveCount: 5,
        startedAt: new Date().toISOString(),
      };

      safeGetStorage.mockReturnValueOnce(mockProgress);

      saveLevelCompletion(0, 4, 100, true);

      const savedProgress = safeSetStorage.mock.calls[0][1];
      expect(savedProgress.levelStats[0].length).toBe(2);
      expect(savedProgress.totalGamesPlayed).toBe(2);
    });

    it('should return null on error', () => {
      safeGetStorage.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const result = saveLevelCompletion(0, 5, 120, false);

      expect(result).toBeNull();
    });
  });

  describe('getLevelBestStats', () => {
    it('should return stats for completed level', () => {
      const mockProgress = {
        completedLevels: [0],
        levelStats: {
          0: [
            { movesUsed: 5, timeSpent: 120, usedUndo: false, completedAt: new Date().toISOString() },
            { movesUsed: 4, timeSpent: 100, usedUndo: true, completedAt: new Date().toISOString() },
          ],
        },
        totalGamesPlayed: 2,
        totalMoveCount: 9,
        startedAt: new Date().toISOString(),
      };

      safeGetStorage.mockReturnValueOnce(mockProgress);

      const stats = getLevelBestStats(0);

      expect(stats.completed).toBe(true);
      expect(stats.attempts).toBe(2);
      expect(stats.bestMoves).toBe(4);
      expect(stats.fastestTime).toBe(100);
      expect(stats.perfectAttempts).toBe(1);
    });

    it('should return not completed for uncompleted level', () => {
      const mockProgress = {
        completedLevels: [],
        levelStats: {},
        totalGamesPlayed: 0,
        totalMoveCount: 0,
        startedAt: new Date().toISOString(),
      };

      safeGetStorage.mockReturnValueOnce(mockProgress);

      const stats = getLevelBestStats(0);

      expect(stats.completed).toBe(false);
      expect(stats.attempts).toBe(0);
    });

    it('should handle single attempt', () => {
      const mockProgress = {
        completedLevels: [1],
        levelStats: {
          1: [{ movesUsed: 6, timeSpent: 150, usedUndo: false, completedAt: new Date().toISOString() }],
        },
        totalGamesPlayed: 1,
        totalMoveCount: 6,
        startedAt: new Date().toISOString(),
      };

      safeGetStorage.mockReturnValueOnce(mockProgress);

      const stats = getLevelBestStats(1);

      expect(stats.completed).toBe(true);
      expect(stats.attempts).toBe(1);
      expect(stats.bestMoves).toBe(6);
      expect(stats.fastestTime).toBe(150);
    });

    it('should return default on error', () => {
      safeGetStorage.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const stats = getLevelBestStats(0);

      expect(stats.completed).toBe(false);
      expect(stats.attempts).toBe(0);
    });
  });

  describe('saveAchievements', () => {
    it('should save new achievements', () => {
      safeGetStorage.mockReturnValueOnce([]);

      saveAchievements(['first_step', 'perfect_score']);

      const savedAchievements = safeSetStorage.mock.calls[0][1];
      expect(savedAchievements).toContain('first_step');
      expect(savedAchievements).toContain('perfect_score');
    });

    it('should merge with existing achievements', () => {
      safeGetStorage.mockReturnValueOnce(['first_step']);

      saveAchievements(['perfect_score', 'level_complete_2']);

      const savedAchievements = safeSetStorage.mock.calls[0][1];
      expect(savedAchievements.length).toBe(3);
      expect(savedAchievements).toContain('first_step');
      expect(savedAchievements).toContain('perfect_score');
      expect(savedAchievements).toContain('level_complete_2');
    });

    it('should not duplicate achievements', () => {
      safeGetStorage.mockReturnValueOnce(['first_step']);

      saveAchievements(['first_step', 'perfect_score']);

      const savedAchievements = safeSetStorage.mock.calls[0][1];
      expect(savedAchievements.length).toBe(2);
    });
  });

  describe('getAchievements', () => {
    it('should return achievements list', () => {
      const mockAchievements = ['first_step', 'perfect_score'];
      safeGetStorage.mockReturnValueOnce(mockAchievements);

      const achievements = getAchievements();

      expect(achievements).toEqual(mockAchievements);
    });

    it('should return empty array if none exist', () => {
      safeGetStorage.mockReturnValueOnce([]);

      const achievements = getAchievements();

      expect(achievements).toEqual([]);
    });

    it('should return default empty array on error', () => {
      safeGetStorage.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const achievements = getAchievements();

      expect(achievements).toEqual([]);
    });
  });

  describe('isAchievementUnlocked', () => {
    it('should return true if achievement is unlocked', () => {
      safeGetStorage.mockReturnValueOnce(['first_step', 'perfect_score']);

      const result = isAchievementUnlocked('first_step');

      expect(result).toBe(true);
    });

    it('should return false if achievement is not unlocked', () => {
      safeGetStorage.mockReturnValueOnce(['first_step']);

      const result = isAchievementUnlocked('perfect_score');

      expect(result).toBe(false);
    });

    it('should handle empty achievements list', () => {
      safeGetStorage.mockReturnValueOnce([]);

      const result = isAchievementUnlocked('first_step');

      expect(result).toBe(false);
    });
  });

  describe('getGameSummary', () => {
    it('should return complete summary', () => {
      const mockProgress = {
        completedLevels: [0, 1, 2],
        levelStats: {},
        totalGamesPlayed: 5,
        totalMoveCount: 35,
        startedAt: new Date().toISOString(),
      };

      // Mock both calls to safeGetStorage
      safeGetStorage.mockImplementation((key, defaultValue) => {
        if (key === 'qsketch_game_progress') {
          return mockProgress;
        } else if (key === 'qsketch_achievements') {
          return ['first_step', 'perfect_score'];
        }
        return defaultValue;
      });

      const summary = getGameSummary();

      expect(summary.completedLevels).toBe(3);
      expect(summary.totalLevels).toBe(11);
      expect(summary.totalGamesPlayed).toBe(5);
      expect(summary.totalMoveCount).toBe(35);
      expect(summary.averageMovesPerGame).toBe('7.0');
      expect(summary.achievementsUnlocked).toBe(2);
      expect(summary.totalAchievements).toBe(11);
      expect(summary.completionPercentage).toBe('27');
    });

    it('should calculate correct average moves', () => {
      const mockProgress = {
        completedLevels: [0],
        levelStats: {},
        totalGamesPlayed: 3,
        totalMoveCount: 15,
        startedAt: new Date().toISOString(),
      };

      safeGetStorage.mockImplementation((key, defaultValue) => {
        if (key === 'qsketch_game_progress') {
          return mockProgress;
        } else if (key === 'qsketch_achievements') {
          return [];
        }
        return defaultValue;
      });

      const summary = getGameSummary();

      expect(summary.averageMovesPerGame).toBe('5.0');
    });

    it('should handle zero games played', () => {
      const mockProgress = {
        completedLevels: [],
        levelStats: {},
        totalGamesPlayed: 0,
        totalMoveCount: 0,
        startedAt: new Date().toISOString(),
      };

      safeGetStorage.mockImplementation((key, defaultValue) => {
        if (key === 'qsketch_game_progress') {
          return mockProgress;
        } else if (key === 'qsketch_achievements') {
          return [];
        }
        return defaultValue;
      });

      const summary = getGameSummary();

      expect(summary.averageMovesPerGame).toBe(0);
      expect(summary.completionPercentage).toBe(0);
    });

    it('should return default on error', () => {
      safeGetStorage.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const summary = getGameSummary();

      expect(summary.completedLevels).toBe(0);
      expect(summary.totalGamesPlayed).toBe(0);
      expect(summary.achievementsUnlocked).toBe(0);
    });
  });

  describe('resetAllProgress', () => {
    it('should reset progress and achievements', () => {
      resetAllProgress();

      expect(safeSetStorage).toHaveBeenCalled();
      const calls = safeSetStorage.mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(2);
    });

    it('should return true on success', () => {
      const result = resetAllProgress();

      expect(result).toBe(true);
    });

    it('should return false on error', () => {
      safeSetStorage.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const result = resetAllProgress();

      expect(result).toBe(false);
    });
  });

  describe('exportGameProgress', () => {
    it('should export progress as JSON string', () => {
      const mockProgress = {
        completedLevels: [0],
        levelStats: {},
        totalGamesPlayed: 1,
        totalMoveCount: 5,
        startedAt: new Date().toISOString(),
      };

      safeGetStorage
        .mockReturnValueOnce(mockProgress)
        .mockReturnValueOnce(['first_step']);

      const exported = exportGameProgress();

      expect(typeof exported).toBe('string');
      const parsed = JSON.parse(exported);
      expect(parsed).toHaveProperty('progress');
      expect(parsed).toHaveProperty('achievements');
      expect(parsed).toHaveProperty('exportedAt');
    });

    it('should return null on error', () => {
      safeGetStorage.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const result = exportGameProgress();

      expect(result).toBeNull();
    });
  });

  describe('importGameProgress', () => {
    it('should import progress from JSON string', () => {
      const data = {
        progress: {
          completedLevels: [0, 1],
          levelStats: {},
          totalGamesPlayed: 2,
          totalMoveCount: 10,
          startedAt: new Date().toISOString(),
        },
        achievements: ['first_step', 'perfect_score'],
        exportedAt: new Date().toISOString(),
      };

      const result = importGameProgress(JSON.stringify(data));

      expect(result).toBe(true);
      expect(safeSetStorage).toHaveBeenCalled();
    });

    it('should return false for invalid JSON', () => {
      const result = importGameProgress('not valid json');

      expect(result).toBe(false);
    });

    it('should handle partial data', () => {
      const data = {
        progress: {
          completedLevels: [0],
          levelStats: {},
          totalGamesPlayed: 1,
          totalMoveCount: 5,
          startedAt: new Date().toISOString(),
        },
      };

      const result = importGameProgress(JSON.stringify(data));

      expect(result).toBe(true);
    });

    it('should return false on error', () => {
      safeSetStorage.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const data = {
        progress: {
          completedLevels: [0],
          levelStats: {},
          totalGamesPlayed: 1,
          totalMoveCount: 5,
          startedAt: new Date().toISOString(),
        },
        achievements: [],
      };

      const result = importGameProgress(JSON.stringify(data));

      expect(result).toBe(false);
    });
  });

  describe('integration tests', () => {
    it('should track progression through multiple levels', () => {
      const mockProgress = {
        completedLevels: [],
        levelStats: {},
        totalGamesPlayed: 0,
        totalMoveCount: 0,
        startedAt: new Date().toISOString(),
      };

      safeGetStorage.mockReturnValueOnce(mockProgress);

      // Simulate completing level 0
      saveLevelCompletion(0, 5, 120, false);
      
      const savedProgress = safeSetStorage.mock.calls[0][1];
      expect(savedProgress.completedLevels).toContain(0);
      expect(savedProgress.totalGamesPlayed).toBe(1);
    });

    it('should calculate statistics correctly over time', () => {
      const mockProgress = {
        completedLevels: [0, 1, 2],
        levelStats: {
          0: [{ movesUsed: 5, timeSpent: 120, usedUndo: false, completedAt: new Date().toISOString() }],
          1: [{ movesUsed: 6, timeSpent: 130, usedUndo: false, completedAt: new Date().toISOString() }],
          2: [{ movesUsed: 7, timeSpent: 140, usedUndo: true, completedAt: new Date().toISOString() }],
        },
        totalGamesPlayed: 3,
        totalMoveCount: 18,
        startedAt: new Date().toISOString(),
      };

      safeGetStorage.mockImplementation((key, defaultValue) => {
        if (key === 'qsketch_game_progress') {
          return mockProgress;
        } else if (key === 'qsketch_achievements') {
          return ['first_step', 'level_complete_2', 'halfway_there'];
        }
        return defaultValue;
      });

      const summary = getGameSummary();

      expect(summary.completedLevels).toBe(3);
      expect(summary.totalGamesPlayed).toBe(3);
      expect(summary.averageMovesPerGame).toBe('6.0');
      expect(summary.completionPercentage).toBe('27');
    });
  });
});
