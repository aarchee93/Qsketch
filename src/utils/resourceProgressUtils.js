/**
 * Resource/Lesson Progress Utilities
 * Tracks which "Learn" lessons the user has read, for checkmark display.
 */

import { safeGetStorage, safeSetStorage } from './storageUtils';

const COMPLETED_LESSONS_KEY = 'qsketch_completed_lessons';

export const getCompletedLessons = () => safeGetStorage(COMPLETED_LESSONS_KEY, []);

export const isLessonComplete = (lessonId) => getCompletedLessons().includes(lessonId);

export const markLessonComplete = (lessonId) => {
  const existing = getCompletedLessons();
  if (existing.includes(lessonId)) return existing;

  const updated = [...existing, lessonId];
  safeSetStorage(COMPLETED_LESSONS_KEY, updated);
  window.dispatchEvent(new CustomEvent('qsketch:lesson-complete', { detail: { lessonId, total: updated.length } }));
  return updated;
};