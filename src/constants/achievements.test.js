import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkAchievements, getAchievementsWithStatus, ACHIEVEMENTS } from './achievements';

describe('achievements', () => {
  describe('checkAchievements', () => {
    it('should unlock FIRST_STEP when completing first level', () => {
      const unlocked = checkAchievements(0, 5, 10, false, [0]);
      expect(unlocked).toContain(ACHIEVEMENTS.FIRST_STEP.id);
    });

    it('should unlock LEVEL_COMPLETE_2 when completing 2 levels', () => {
      const unlocked = checkAchievements(1, 5, 10, false, [0, 1]);
      expect(unlocked).toContain(ACHIEVEMENTS.LEVEL_COMPLETE_2.id);
    });

    it('should unlock HALFWAY_THERE when completing 5 levels', () => {
      const unlocked = checkAchievements(4, 5, 10, false, [0, 1, 2, 3, 4]);
      expect(unlocked).toContain(ACHIEVEMENTS.HALFWAY_THERE.id);
    });

    it('should unlock QUANTUM_GURU when completing all 11 levels', () => {
      const allLevels = Array.from({ length: 11 }, (_, i) => i);
      const unlocked = checkAchievements(10, 5, 10, false, allLevels);
      expect(unlocked).toContain(ACHIEVEMENTS.QUANTUM_GURU.id);
    });

    it('should unlock SUPERPOSITION_MASTER when completing levels 3, 4, 5', () => {
      const unlocked = checkAchievements(4, 5, 10, false, [2, 3, 4]);
      expect(unlocked).toContain(ACHIEVEMENTS.SUPERPOSITION_MASTER.id);
    });

    it('should not unlock SUPERPOSITION_MASTER if missing one level', () => {
      const unlocked = checkAchievements(3, 5, 10, false, [2, 3]);
      expect(unlocked).not.toContain(ACHIEVEMENTS.SUPERPOSITION_MASTER.id);
    });

    it('should unlock ENTANGLEMENT_EXPERT when completing entanglement levels', () => {
      const unlocked = checkAchievements(8, 5, 10, false, [5, 6, 7, 8]);
      expect(unlocked).toContain(ACHIEVEMENTS.ENTANGLEMENT_EXPERT.id);
    });

    it('should unlock EXPERT_CHALLENGER when completing expert levels', () => {
      const unlocked = checkAchievements(10, 5, 10, false, [9, 10]);
      expect(unlocked).toContain(ACHIEVEMENTS.EXPERT_CHALLENGER.id);
    });

    it('should unlock PERFECT_SCORE when not using undo', () => {
      const unlocked = checkAchievements(0, 5, 10, false, [0]);
      expect(unlocked).toContain(ACHIEVEMENTS.PERFECT_SCORE.id);
    });

    it('should not unlock PERFECT_SCORE when using undo', () => {
      const unlocked = checkAchievements(0, 5, 10, true, [0]);
      expect(unlocked).not.toContain(ACHIEVEMENTS.PERFECT_SCORE.id);
    });

    it('should unlock EFFICIENT_CIRCUIT when using half or fewer moves', () => {
      // 5 moves out of 10 limit = half
      const unlocked = checkAchievements(0, 5, 10, false, [0]);
      expect(unlocked).toContain(ACHIEVEMENTS.EFFICIENT_CIRCUIT.id);
    });

    it('should not unlock EFFICIENT_CIRCUIT when using more than half moves', () => {
      // 6 moves out of 10 limit = more than half
      const unlocked = checkAchievements(0, 6, 10, false, [0]);
      expect(unlocked).not.toContain(ACHIEVEMENTS.EFFICIENT_CIRCUIT.id);
    });

    it('should handle empty completed levels array', () => {
      const unlocked = checkAchievements(0, 5, 10, false, []);
      expect(unlocked).not.toContain(ACHIEVEMENTS.FIRST_STEP.id);
    });

    it('should unlock multiple achievements in one level', () => {
      const unlocked = checkAchievements(0, 5, 10, false, [0]);
      expect(unlocked.length).toBeGreaterThan(0);
      expect(unlocked).toContain(ACHIEVEMENTS.FIRST_STEP.id);
      expect(unlocked).toContain(ACHIEVEMENTS.PERFECT_SCORE.id);
      expect(unlocked).toContain(ACHIEVEMENTS.EFFICIENT_CIRCUIT.id);
    });

    it('should handle odd move limits', () => {
      // 3 moves out of 5 limit = Math.ceil(5/2) = 3, should unlock
      const unlocked = checkAchievements(0, 3, 5, false, [0]);
      expect(unlocked).toContain(ACHIEVEMENTS.EFFICIENT_CIRCUIT.id);

      // 4 moves out of 5 limit = 4 > Math.ceil(5/2) = 3, should not unlock
      const unlocked2 = checkAchievements(0, 4, 5, false, [0]);
      expect(unlocked2).not.toContain(ACHIEVEMENTS.EFFICIENT_CIRCUIT.id);
    });
  });

  describe('getAchievementsWithStatus', () => {
    it('should return all achievements with unlocked status', () => {
      const achievements = getAchievementsWithStatus(['first_step']);
      expect(achievements.length).toBe(11);
      expect(achievements[0]).toHaveProperty('unlocked');
    });

    it('should mark unlocked achievements correctly', () => {
      const achievements = getAchievementsWithStatus([
        ACHIEVEMENTS.FIRST_STEP.id,
        ACHIEVEMENTS.PERFECT_SCORE.id,
      ]);
      
      const firstStep = achievements.find(a => a.id === ACHIEVEMENTS.FIRST_STEP.id);
      expect(firstStep.unlocked).toBe(true);
    });

    it('should mark locked achievements correctly', () => {
      const achievements = getAchievementsWithStatus([]);
      
      achievements.forEach(achievement => {
        expect(achievement.unlocked).toBe(false);
      });
    });

    it('should preserve achievement properties', () => {
      const achievements = getAchievementsWithStatus([ACHIEVEMENTS.FIRST_STEP.id]);
      const firstStep = achievements.find(a => a.id === ACHIEVEMENTS.FIRST_STEP.id);
      
      expect(firstStep.name).toBeDefined();
      expect(firstStep.description).toBeDefined();
      expect(firstStep.icon).toBeDefined();
      expect(firstStep.color).toBeDefined();
    });

    it('should handle empty achievement list', () => {
      const achievements = getAchievementsWithStatus([]);
      expect(achievements.length).toBe(11);
      expect(achievements.every(a => !a.unlocked)).toBe(true);
    });

    it('should ignore invalid achievement IDs', () => {
      const achievements = getAchievementsWithStatus(['invalid_id']);
      expect(achievements.every(a => !a.unlocked)).toBe(true);
    });
  });

  describe('ACHIEVEMENTS object', () => {
    it('should have 11 total achievements', () => {
      const count = Object.keys(ACHIEVEMENTS).length;
      expect(count).toBe(11);
    });

    it('should have required properties for each achievement', () => {
      Object.values(ACHIEVEMENTS).forEach(achievement => {
        expect(achievement).toHaveProperty('id');
        expect(achievement).toHaveProperty('name');
        expect(achievement).toHaveProperty('description');
        expect(achievement).toHaveProperty('icon');
        expect(achievement).toHaveProperty('color');
      });
    });

    it('should have unique IDs', () => {
      const ids = Object.values(ACHIEVEMENTS).map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have unique names', () => {
      const names = Object.values(ACHIEVEMENTS).map(a => a.name);
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });

    it('should have valid Tailwind color classes', () => {
      Object.values(ACHIEVEMENTS).forEach(achievement => {
        expect(achievement.color).toMatch(/^bg-/);
      });
    });
  });

  describe('achievement unlock scenarios', () => {
    it('should handle complete game progression', () => {
      const progressions = [
        { levels: [0], achievements: [ACHIEVEMENTS.FIRST_STEP.id] },
        { levels: [0, 1], achievements: [ACHIEVEMENTS.LEVEL_COMPLETE_2.id] },
        { levels: [0, 1, 2, 3, 4], achievements: [ACHIEVEMENTS.HALFWAY_THERE.id] },
      ];

      progressions.forEach(({ levels, achievements: expectedAchievements }) => {
        const unlocked = checkAchievements(
          levels[levels.length - 1],
          5,
          10,
          false,
          levels
        );

        expectedAchievements.forEach(ach => {
          expect(unlocked).toContain(ach);
        });
      });
    });

    it('should unlock skill-based achievements correctly', () => {
      // Superposition master
      const superpositionLevels = [2, 3, 4];
      const unlockedSuper = checkAchievements(4, 5, 10, false, superpositionLevels);
      expect(unlockedSuper).toContain(ACHIEVEMENTS.SUPERPOSITION_MASTER.id);

      // Entanglement expert
      const entanglementLevels = [5, 6, 7, 8];
      const unlockedEnt = checkAchievements(8, 5, 10, false, entanglementLevels);
      expect(unlockedEnt).toContain(ACHIEVEMENTS.ENTANGLEMENT_EXPERT.id);
    });
  });
});
