import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import SketchButton from '../components/SketchButton';
import AnimatedNumber from '../components/AnimatedNumber';
import { playSuccessSound, playErrorSound } from '../utils/soundUtils';
import { getGameSummary } from '../utils/gameProgressUtils';
import { resetAllProgress, exportGameProgress } from '../utils/gameProgressUtils';
import { getAllConcepts, exportConcepts } from '../utils/supabaseConceptsUtils';
import { LEARNING_PATH, PATH_TO_LESSON_ID } from '../constants/learningContent';
import { isLessonComplete } from '../utils/resourceProgressUtils';

const ProfilePage = ({ user }) => {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [gameSummary, setGameSummary] = useState(null);
  const [conceptsCount, setConceptsCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [userStats, setUserStats] = useState({
    joinDate: new Date(user?.created_at || new Date()).toLocaleDateString(),
    lastLoginDate: new Date().toLocaleDateString(),
    totalPlaytime: 0,
    streakDays: 0,
    favoriteGate: 'Hadamard (H)',
  });

  useEffect(() => {
    getGameSummary().then(summary => {
      setGameSummary(summary);
      setUserStats(prev => ({
        ...prev,
        totalPlaytime: Math.round(summary.totalGamesPlayed * 2),
      }));
    });

    getAllConcepts().then(concepts => {
      setConceptsCount(concepts.length);
    });
  }, []);

  const handleExportGameProgress = async () => {
    setIsExporting(true);
    try {
      const json = await exportGameProgress();
      if (json) {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qsketch-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Game progress exported successfully!', 'success');
        playSuccessSound();
      }
    } catch (err) {
      console.error('Error exporting progress:', err);
      showToast('Failed to export progress', 'error');
      playErrorSound();
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportConcepts = async () => {
    setIsExporting(true);
    try {
      const json = await exportConcepts();
      if (json) {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qsketch-concepts-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Concepts exported successfully!', 'success');
        playSuccessSound();
      }
    } catch (err) {
      console.error('Error exporting concepts:', err);
      showToast('Failed to export concepts', 'error');
      playErrorSound();
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetProgress = async () => {
    const success = await resetAllProgress();
    if (success) {
      setGameSummary({
        completedLevels: 0,
        totalLevels: 11,
        totalGamesPlayed: 0,
        totalMoveCount: 0,
        averageMovesPerGame: 0,
        achievementsUnlocked: 0,
        totalAchievements: 11,
        completionPercentage: 0,
      });
      showToast('All progress reset successfully', 'success');
      playSuccessSound();
    } else {
      showToast('Failed to reset progress', 'error');
      playErrorSound();
    }
    setShowResetConfirm(false);
  };

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      playSuccessSound();
      showToast('Logged out successfully', 'success');
      setTimeout(() => navigate('/auth'), 1000);
    } else {
      playErrorSound();
      showToast(`Logout failed: ${result.error}`, 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto min-h-screen animate-fade-in">
      <div className="mb-6">
        <SketchButton onClick={() => navigate(-1)} className="mb-4">
          ← Back
        </SketchButton>
      </div>

      <section className="bg-white p-6 md:p-8 border-4 border-solid border-black rounded-xl shadow-[8px_8px_0_0_#000000] profile-card-animated">
        <h1 className="text-4xl font-extrabold mb-1">My Profile</h1>
        <p className="text-lg text-black/60 mb-6">Manage your quantum learning journey</p>

        {/* User Info */}
        <div className="mb-5 p-5 bg-white/60 border border-black/10 shadow-sm rounded-lg profile-card-animated">
          <h2 className="text-lg font-bold tracking-tight text-black/80 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Account Information
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Email:</span>
              <span className="font-mono text-black/70">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">User ID:</span>
              <span className="font-mono text-xs text-black/50">{user?.id?.slice(0, 12)}...</span>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="mb-5 p-5 bg-white/60 border border-black/10 shadow-sm rounded-lg profile-card-animated">
          <h2 className="text-lg font-bold tracking-tight text-black/80 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10.59l4.24 4.24-1.41 1.41L11 13V6h2v6.59z"/>
            </svg>
            Your Quantum Journey
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div style={{ animationDelay: '0ms' }} className="border border-black/10 p-3 rounded-lg text-center bg-white hover:border-black/30 hover:shadow-[3px_3px_0_0_#000000] hover:-translate-y-0.5 transition-all duration-100">
              <div className="text-xl font-bold">{userStats.joinDate}</div>
              <div className="text-xs font-semibold text-black/60">Member Since</div>
            </div>
            <div style={{ animationDelay: '60ms' }} className="border border-black/10 p-3 rounded-lg text-center bg-white hover:border-black/30 hover:shadow-[3px_3px_0_0_#000000] hover:-translate-y-0.5 transition-all duration-100">
              <div className="text-xl font-bold"><AnimatedNumber value={userStats.totalPlaytime} />m</div>
              <div className="text-xs font-semibold text-black/60">Total Playtime</div>
            </div>
            <div style={{ animationDelay: '120ms' }} className="border border-black/10 p-3 rounded-lg text-center bg-white hover:border-black/30 hover:shadow-[3px_3px_0_0_#000000] hover:-translate-y-0.5 transition-all duration-100">
              <div className="text-xl font-bold"><AnimatedNumber value={userStats.streakDays} /></div>
              <div className="text-xs font-semibold text-black/60">Day Streak</div>
            </div>
            <div style={{ animationDelay: '180ms' }} className="border border-black/10 p-3 rounded-lg text-center bg-white hover:border-black/30 hover:shadow-[3px_3px_0_0_#000000] hover:-translate-y-0.5 transition-all duration-100 sm:col-span-2 lg:col-span-1">
              <svg className="w-6 h-6 mx-auto text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-14a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z"/>
              </svg>
              <div className="text-xs font-semibold text-black/60 mt-1">{userStats.favoriteGate}</div>
            </div>
          </div>
        </div>

        {/* Learning Progress Summary */}
        {gameSummary && (
          <div className="mb-5 p-5 bg-white/60 border border-black/10 shadow-sm rounded-lg profile-card-animated">
            <h2 className="text-lg font-bold tracking-tight text-black/80 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/>
              </svg>
              Learning Progress
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div style={{ animationDelay: '240ms' }} className="border border-black/10 p-3 rounded-lg text-center bg-white hover:border-black/30 hover:shadow-[3px_3px_0_0_#000000] hover:-translate-y-0.5 transition-all duration-100">
                <div className="text-xl font-bold"><AnimatedNumber value={gameSummary.completedLevels} /></div>
                <div className="text-xs font-semibold text-black/60">Levels Completed</div>
              </div>
              <div style={{ animationDelay: '300ms' }} className="border border-black/10 p-3 rounded-lg text-center bg-white hover:border-black/30 hover:shadow-[3px_3px_0_0_#000000] hover:-translate-y-0.5 transition-all duration-100">
                <div className="text-xl font-bold"><AnimatedNumber value={gameSummary.achievementsUnlocked} /></div>
                <div className="text-xs font-semibold text-black/60">Achievements</div>
              </div>
              <div style={{ animationDelay: '360ms' }} className="border border-black/10 p-3 rounded-lg text-center bg-white hover:border-black/30 hover:shadow-[3px_3px_0_0_#000000] hover:-translate-y-0.5 transition-all duration-100">
                <div className="text-xl font-bold"><AnimatedNumber value={gameSummary.totalGamesPlayed} /></div>
                <div className="text-xs font-semibold text-black/60">Games Played</div>
              </div>
              <div style={{ animationDelay: '420ms' }} className="border border-black/10 p-3 rounded-lg text-center bg-white hover:border-black/30 hover:shadow-[3px_3px_0_0_#000000] hover:-translate-y-0.5 transition-all duration-100">
                <div className="text-xl font-bold"><AnimatedNumber value={gameSummary.averageMovesPerGame} /></div>
                <div className="text-xs font-semibold text-black/60">Avg Moves</div>
              </div>
              <div style={{ animationDelay: '480ms' }} className="border border-black/10 p-3 rounded-lg text-center bg-white hover:border-black/30 hover:shadow-[3px_3px_0_0_#000000] hover:-translate-y-0.5 transition-all duration-100">
                <div className="text-xl font-bold"><AnimatedNumber value={gameSummary.completionPercentage} />%</div>
                <div className="text-xs font-semibold text-black/60">Complete</div>
              </div>
              <div style={{ animationDelay: '540ms' }} className="border border-black/10 p-3 rounded-lg text-center bg-white hover:border-black/30 hover:shadow-[3px_3px_0_0_#000000] hover:-translate-y-0.5 transition-all duration-100">
                <div className="text-xl font-bold"><AnimatedNumber value={conceptsCount} /></div>
                <div className="text-xs font-semibold text-black/60">Concepts Saved</div>
              </div>
            </div>
          </div>
        )}

        {/* Learning Path Status */}
        <div className="mb-5 p-5 bg-white/60 border border-black/10 shadow-sm rounded-lg profile-card-animated">
          <h2 className="text-lg font-bold tracking-tight text-black/80 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 4h2v14h-2zm4-2h2v16h-2z"/>
            </svg>
            Learning Path Progress
          </h2>
          <p className="text-xs text-black/60 mb-3">✓ = Lesson read. Direct updates based on your progress.</p>
          <div className="space-y-3">
            {LEARNING_PATH.map((step, idx) => {
              const lessonId = PATH_TO_LESSON_ID[step.id];
              const isComplete = isLessonComplete(lessonId);
              // Calculate progress: completed steps / total steps * 100
              const progress = Math.floor(((idx + (isComplete ? 1 : 0)) / LEARNING_PATH.length) * 100);
              return (
                <div key={step.id} style={{ animationDelay: `${600 + idx * 40}ms` }} className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm ${
                      isComplete 
                        ? 'bg-black text-white' 
                        : 'bg-white border-2 border-black text-black'
                    }`}>
                      {isComplete ? '✓' : step.id}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-black text-sm">{step.title}</div>
                      <div className="text-xs text-black/60">{step.summary}</div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-black/10 rounded">
                      {isComplete ? 'Done' : 'Not started'}
                    </span>
                  </div>
                  {/* Animated Progress Bar */}
                  <div className="ml-9 h-1.5 bg-black/10 rounded-full overflow-hidden border border-black/20">
                    <div 
                      className="h-full bg-black rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Management */}
        <div className="mb-5 p-5 bg-white/60 border border-black/10 shadow-sm rounded-lg profile-card-animated">
          <h2 className="text-lg font-bold tracking-tight text-black/80 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
            </svg>
            Data Management
          </h2>
          <div className="space-y-2">
            <div className="flex gap-2 flex-col sm:flex-row">
              <SketchButton
                onClick={handleExportGameProgress}
                disabled={isExporting}
                className="flex-1 text-sm"
              >
                Export Game Progress
              </SketchButton>
              <SketchButton
                onClick={handleExportConcepts}
                disabled={isExporting}
                className="flex-1 text-sm"
              >
                Export Concepts
              </SketchButton>
            </div>
            <p className="text-xs text-black/60 italic">
              Download your data as JSON files. You can use these for backup or transfer to another device.
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mb-5 p-5 bg-white border-2 border-red-500 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg className="absolute w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <pattern id="danger-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="#ff0000" opacity="0.3" />
                  <path d="M 20 0 L 40 20 L 20 40 L 0 20 Z" fill="none" stroke="#ff0000" strokeWidth="0.5" opacity="0.2" />
                </pattern>
              </defs>
              <rect width="400" height="200" fill="url(#danger-pattern)" />
            </svg>
          </div>

          <div className="relative z-10">
            <h2 className="text-lg font-bold tracking-tight mb-3 text-black flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
              Danger Zone
            </h2>

            {!showResetConfirm ? (
              <SketchButton
                onClick={() => setShowResetConfirm(true)}
                className="!bg-red-600 !text-white hover:!bg-red-700 !border-red-600 w-full sm:w-auto font-bold py-2 text-sm"
              >
                Reset All Progress
              </SketchButton>
            ) : (
              <div className="space-y-3">
                <p className="font-semibold text-black text-sm leading-relaxed">
                  Are you sure? This will delete all your game progress, achievements, and completed levels. This cannot be undone.
                </p>
                <div className="flex gap-2 flex-col sm:flex-row">
                  <SketchButton
                    onClick={handleResetProgress}
                    className="!bg-red-600 !text-white hover:!bg-red-700 !border-red-600 flex-1 font-bold py-2 text-sm"
                  >
                    Yes, Delete Everything
                  </SketchButton>
                  <SketchButton
                    onClick={() => setShowResetConfirm(false)}
                    variant="outlined"
                    className="flex-1 font-bold py-2 text-sm"
                  >
                    Cancel
                  </SketchButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="p-5 bg-white/60 border border-black/10 shadow-sm rounded-lg profile-card-animated">
          <h2 className="text-lg font-bold tracking-tight text-black/80 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Session
          </h2>
          <SketchButton
            onClick={handleLogout}
            variant="inverted"
            className="w-full font-extrabold text-sm"
          >
            Logout
          </SketchButton>
          <p className="text-xs text-black/60 italic mt-2">
            You'll be able to log back in anytime with your email and password.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
