/**
 * Achievements/Badges System
 * Tracks user accomplishments and unlocks badges
 */

export const ACHIEVEMENTS = {
  // Beginner Achievements
  FIRST_STEP: {
    id: 'first_step',
    name: '👣 First Step',
    description: 'Complete your first level',
    icon: '👣',
    color: 'bg-blue-100',
  },
  LEVEL_COMPLETE_2: {
    id: 'level_complete_2',
    name: '🎯 Two Down',
    description: 'Complete 2 levels',
    icon: '🎯',
    color: 'bg-green-100',
  },

  // Skill Achievements
  SUPERPOSITION_MASTER: {
    id: 'superposition_master',
    name: '🌊 Superposition Master',
    description: 'Complete all superposition levels',
    icon: '🌊',
    color: 'bg-cyan-100',
  },
  ENTANGLEMENT_EXPERT: {
    id: 'entanglement_expert',
    name: '🔗 Entanglement Expert',
    description: 'Complete all entanglement levels',
    icon: '🔗',
    color: 'bg-purple-100',
  },

  // Performance Achievements
  SPEEDRUNNER: {
    id: 'speedrunner',
    name: '⚡ Speed Runner',
    description: 'Complete any level in less than 2 minutes',
    icon: '⚡',
    color: 'bg-yellow-100',
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: '💯 Perfect Score',
    description: 'Complete a level without using Undo',
    icon: '💯',
    color: 'bg-red-100',
  },
  EFFICIENT_CIRCUIT: {
    id: 'efficient_circuit',
    name: '🎪 Efficient Circuit',
    description: 'Complete a level using exactly half or fewer moves than the limit',
    icon: '🎪',
    color: 'bg-orange-100',
  },

  // Milestone Achievements
  HALFWAY_THERE: {
    id: 'halfway_there',
    name: '🏔️ Halfway There',
    description: 'Complete 5 levels',
    icon: '🏔️',
    color: 'bg-indigo-100',
  },
  QUANTUM_GURU: {
    id: 'quantum_guru',
    name: '🧙 Quantum Guru',
    description: 'Complete all 11 levels - You are a quantum master!',
    icon: '🧙',
    color: 'bg-pink-100',
  },

  // Challenge Achievements
  NO_MISTAKES: {
    id: 'no_mistakes',
    name: '🎭 No Mistakes',
    description: 'Complete 3 consecutive levels without using Undo',
    icon: '🎭',
    color: 'bg-rose-100',
  },
  EXPERT_CHALLENGER: {
    id: 'expert_challenger',
    name: '👑 Expert Challenger',
    description: 'Complete all Expert difficulty levels',
    icon: '👑',
    color: 'bg-amber-100',
  },
};

/**
 * Check if a level completion should unlock achievements
 * @param {number} levelIndex - Current level index
 * @param {number} movesUsed - Moves used to complete
 * @param {number} moveLimit - Max moves allowed
 * @param {boolean} usedUndo - Whether undo was used
 * @param {number[]} completedLevels - Array of completed level indices
 * @returns {string[]} - Array of unlocked achievement IDs
 */
export const checkAchievements = (
  levelIndex,
  movesUsed,
  moveLimit,
  usedUndo,
  completedLevels
) => {
  const unlockedAchievements = [];

  // First level complete
  if (completedLevels.length === 1) {
    unlockedAchievements.push(ACHIEVEMENTS.FIRST_STEP.id);
  }

  // 2 levels complete
  if (completedLevels.length === 2) {
    unlockedAchievements.push(ACHIEVEMENTS.LEVEL_COMPLETE_2.id);
  }

  // 5 levels complete (halfway)
  if (completedLevels.length === 5) {
    unlockedAchievements.push(ACHIEVEMENTS.HALFWAY_THERE.id);
  }

  // All 11 levels complete
  if (completedLevels.length === 11) {
    unlockedAchievements.push(ACHIEVEMENTS.QUANTUM_GURU.id);
  }

  // Superposition master (levels 3, 4, 5)
  const superpositionLevels = [2, 3, 4];
  if (superpositionLevels.every(idx => completedLevels.includes(idx))) {
    unlockedAchievements.push(ACHIEVEMENTS.SUPERPOSITION_MASTER.id);
  }

  // Entanglement expert (levels 6, 7, 8, 9)
  const entanglementLevels = [5, 6, 7, 8];
  if (entanglementLevels.every(idx => completedLevels.includes(idx))) {
    unlockedAchievements.push(ACHIEVEMENTS.ENTANGLEMENT_EXPERT.id);
  }

  // Expert challenger (levels 10, 11)
  const expertLevels = [9, 10];
  if (expertLevels.every(idx => completedLevels.includes(idx))) {
    unlockedAchievements.push(ACHIEVEMENTS.EXPERT_CHALLENGER.id);
  }

  // Perfect score (no undo used)
  if (!usedUndo) {
    unlockedAchievements.push(ACHIEVEMENTS.PERFECT_SCORE.id);
  }

  // Efficient circuit (half or fewer moves than limit)
  if (movesUsed <= Math.ceil(moveLimit / 2)) {
    unlockedAchievements.push(ACHIEVEMENTS.EFFICIENT_CIRCUIT.id);
  }

  // Speed runner (complete in less than 2 minutes) - tracked separately
  // Speedrunner is set when level time < 120 seconds

  return unlockedAchievements;
};

/**
 * Get all achievements with unlock status
 * @param {string[]} unlockedIds - Array of unlocked achievement IDs
 * @returns {object[]} - Achievement objects with unlocked status
 */

export const getAchievementsWithStatus = (unlockedIds) => {
  return Object.values(ACHIEVEMENTS).map(achievement => ({
    ...achievement,
    unlocked: unlockedIds.includes(achievement.id),
  }));
};