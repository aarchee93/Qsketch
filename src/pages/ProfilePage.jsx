import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import SketchButton from '../components/SketchButton';
import AnimatedNumber from '../components/AnimatedNumber';
import { playSuccessSound, playErrorSound } from '../utils/soundUtils';
import { signOut } from '../utils/supabaseAuth';
import { getGameSummary } from '../utils/gameProgressUtils';
import { resetAllProgress, exportGameProgress } from '../utils/gameProgressUtils';
import { getAllConcepts, exportConcepts } from '../utils/supabaseConceptsUtils';
import { LEARNING_PATH, PATH_TO_LESSON_ID } from '../constants/learningContent';
import { isLessonComplete } from '../utils/resourceProgressUtils';
// Import PNG assets
import profileAvatarPng from '../assets/profile-avatar.png';
import trophyPng from '../assets/achievement-trophy.png';
import notebookPng from '../assets/concepts-notebook.png';
import controllerPng from '../assets/game-controller.png';
import trashPng from '../assets/danger-trash.png';
import exportDataPng from '../assets/export-data.png';
import quantumFocusPng from '../assets/quantum-focus.png';

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
    <div className="p-4 md:p-6 max-w-5xl mx-auto min-h-screen animate-fade-in">
      {/* Decorative Doodles */}
      <style>{`
        @keyframes float { 
          0%, 100% { transform: translateY(0px) rotate(0deg); } 
          50% { transform: translateY(-15px) rotate(5deg); } 
        }
        @keyframes float-reverse { 
          0%, 100% { transform: translateY(0px) rotate(0deg); } 
          50% { transform: translateY(15px) rotate(-5deg); } 
        }
        @keyframes sketch-draw {
          0% { stroke-dashoffset: 1000; opacity: 0; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        .float-animation { animation: float 4s ease-in-out infinite; }
        .float-reverse-animation { animation: float-reverse 5s ease-in-out infinite; }
        .sketch-doodle { 
          position: absolute; 
          opacity: 0.15;
          pointer-events: none;
        }
        .profile-section {
          position: relative;
          border: 3px solid #000;
          border-radius: 12px;
          background: #fff;
          box-shadow: 6px 6px 0px #000;
          transition: all 0.3s ease;
        }
        .profile-section:hover {
          transform: translateY(-3px);
          box-shadow: 8px 8px 0px #000;
        }
        .stat-card {
          border: 2px solid #000;
          border-radius: 8px;
          background: #fff;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent);
          transition: left 0.5s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 3px 3px 0px #000;
          border-color: #000;
        }
        .stat-card:hover::before {
          left: 100%;
        }
        .avatar-circle {
          width: 120px;
          height: 120px;
          border: 4px solid #000;
          border-radius: 50%;
          overflow: hidden;
          background: #fff;
          box-shadow: 4px 4px 0px #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-box {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #000;
          border-radius: 6px;
          background: #fff;
          transition: all 0.2s ease;
        }
        .stat-card:hover .icon-box {
          transform: scale(1.15) rotate(5deg);
          background: #000;
          filter: invert(1);
        }
      `}</style>

      {/* Back Button */}
      <div className="relative mb-4">
        <SketchButton onClick={() => navigate(-1)} className="mb-4">
          ← Back
        </SketchButton>
      </div>

      {/* Main Profile Card */}
      <section className="profile-section p-6 md:p-8 relative">
        {/* Background Doodle */}
        <svg className="sketch-doodle float-reverse-animation" style={{bottom: '20px', right: '30px', zIndex: 0}} width="100" height="100" viewBox="0 0 100 100">
          <path d="M20 50 Q30 30 50 20 Q70 30 80 50 Q70 70 50 80 Q30 70 20 50" stroke="#000" strokeWidth="2" fill="none" opacity="0.3"/>
          <circle cx="50" cy="50" r="3" fill="#000" opacity="0.3"/>
        </svg>

        {/* Profile Header with Avatar */}
        <div className="mb-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            {/* Avatar Circle */}
            <div className="avatar-circle flex-shrink-0">
              <img src={profileAvatarPng} alt="User Avatar" className="w-full h-full object-cover" />
            </div>

            {/* Header Text */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl font-extrabold mb-2 text-black drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">My Profile</h1>
              <p className="text-xl text-black/70 font-semibold mb-4">Manage your quantum learning journey</p>
              
              {/* Account Information */}
              <div className="stat-card p-4 border-2 border-black rounded-lg bg-white/80 w-full">
                <h3 className="text-sm font-bold text-black/60 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  Account Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-bold text-black/70">Email</span>
                    <span className="font-mono text-sm text-black/60">{user?.email}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-bold text-black/70">User ID</span>
                    <span className="font-mono text-xs text-black/50">{user?.id?.slice(0, 12)}...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Quantum Journey - With PNG Icons */}
        <div className="mb-6 p-5 border-3 border-black rounded-lg bg-white/90 relative z-10">
          <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10.59l4.24 4.24-1.41 1.41L11 13V6h2v6.59z"/></svg>
            Your Quantum Journey
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Member Since */}
            <div className="stat-card p-4 border-2 border-black rounded-lg">
              <div className="flex justify-center mb-2">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-black">{userStats.joinDate}</div>
                <div className="text-xs font-semibold text-black/60">Member Since</div>
              </div>
            </div>

            {/* Total Playtime */}
            <div className="stat-card p-4 border-2 border-black rounded-lg">
              <div className="flex justify-center mb-2">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M11 17h2v-5h-2v5zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-black"><AnimatedNumber value={userStats.totalPlaytime} />m</div>
                <div className="text-xs font-semibold text-black/60">Total Playtime</div>
              </div>
            </div>

            {/* Day Streak */}
            <div className="stat-card p-4 border-2 border-black rounded-lg">
              <div className="flex justify-center mb-2">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h12v6h2V2c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v6h2V2zm12 16H6v-4H4v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4h-2v4zm-2-8H8v2h8v-2z"/></svg>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-black"><AnimatedNumber value={userStats.streakDays} /></div>
                <div className="text-xs font-semibold text-black/60">Day Streak</div>
              </div>
            </div>

            {/* Favorite Gate */}
            <div className="stat-card p-4 border-2 border-black rounded-lg">
              <div className="flex justify-center mb-2">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-14a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z"/></svg>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-black">{userStats.favoriteGate}</div>
                <div className="text-xs font-semibold text-black/60">Current Focus</div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Progress - With PNG Icons */}
        {gameSummary && (
          <div className="mb-6 p-5 border-3 border-black rounded-lg bg-white/90 relative z-10">
            <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/></svg>
              Learning Progress
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* Levels Completed */}
              <div className="stat-card p-4 border-2 border-black rounded-lg">
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h12v2H6V4zm1 7h10v2H7v-2zm11 6H6v2h12v-2z"/></svg>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-black"><AnimatedNumber value={gameSummary.completedLevels} /></div>
                  <div className="text-xs font-semibold text-black/60">Levels Completed</div>
                </div>
              </div>

              {/* Achievements */}
              <div className="stat-card p-4 border-2 border-black rounded-lg">
                <div className="flex justify-center mb-2">
                  <img src={trophyPng} alt="Trophy" className="w-8 h-8 object-contain" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-black"><AnimatedNumber value={gameSummary.achievementsUnlocked} /></div>
                  <div className="text-xs font-semibold text-black/60">Achievements</div>
                </div>
              </div>

              {/* Games Played */}
              <div className="stat-card p-4 border-2 border-black rounded-lg">
                <div className="flex justify-center mb-2">
                  <img src={controllerPng} alt="Controller" className="w-8 h-8 object-contain" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-black"><AnimatedNumber value={gameSummary.totalGamesPlayed} /></div>
                  <div className="text-xs font-semibold text-black/60">Games Played</div>
                </div>
              </div>

              {/* Avg Moves */}
              <div className="stat-card p-4 border-2 border-black rounded-lg">
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm9 4h-7v2h7V7zm7 0h-5v2h5V7zM3 15h2v2H3v-2zm4 0h10v2H7v-2zm12 0h2v2h-2v-2zM3 11h18v2H3v-2z"/></svg>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-black"><AnimatedNumber value={gameSummary.averageMovesPerGame} /></div>
                  <div className="text-xs font-semibold text-black/60">Avg Moves</div>
                </div>
              </div>

              {/* Completion */}
              <div className="stat-card p-4 border-2 border-black rounded-lg">
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-black"><AnimatedNumber value={gameSummary.completionPercentage} />%</div>
                  <div className="text-xs font-semibold text-black/60">Complete</div>
                </div>
              </div>

              {/* Concepts Saved */}
              <div className="stat-card p-4 border-2 border-black rounded-lg">
                <div className="flex justify-center mb-2">
                  <img src={notebookPng} alt="Notebook" className="w-8 h-8 object-contain" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-black"><AnimatedNumber value={conceptsCount} /></div>
                  <div className="text-xs font-semibold text-black/60">Concepts Saved</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learning Path Progress */}
        <div className="mb-6 p-5 border-3 border-black rounded-lg bg-white/90 relative z-10">
          <h2 className="text-2xl font-bold text-black mb-3 flex items-center gap-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 4h2v14h-2zm4-2h2v16h-2z"/></svg>
            Learning Path Progress
          </h2>
          <p className="text-xs text-black/60 mb-4 font-semibold">✓ = Lesson read. Direct updates based on your progress.</p>
          <div className="space-y-3">
            {LEARNING_PATH.map((step, idx) => {
              const lessonId = PATH_TO_LESSON_ID[step.id];
              const isComplete = isLessonComplete(lessonId);
              const progress = Math.floor(((idx + (isComplete ? 1 : 0)) / LEARNING_PATH.length) * 100);
              return (
                <div key={step.id} className="space-y-1 stat-card p-3 border-2 border-black rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full font-bold text-sm flex-shrink-0 border-2 ${
                      isComplete 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white border-black text-black'
                    }`}>
                      {isComplete ? '✓' : step.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-black text-sm">{step.title}</div>
                      <div className="text-xs text-black/60 truncate">{step.summary}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0 ${
                      isComplete 
                        ? 'bg-black text-white' 
                        : 'bg-black/10 text-black/60'
                    }`}>
                      {isComplete ? 'Done' : 'Not started'}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="ml-9 h-2 bg-black/10 rounded-full overflow-hidden border-2 border-black/20">
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
        <div className="mb-6 p-5 border-3 border-black rounded-lg bg-white/90 relative z-10">
          <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
            <img src={exportDataPng} alt="Export" className="w-6 h-6 object-contain" />
            Data Management
          </h2>
          <div className="space-y-3">
            <div className="flex gap-2 flex-col sm:flex-row">
              <SketchButton
                onClick={handleExportGameProgress}
                disabled={isExporting}
                className="flex-1 text-sm font-bold"
              >
                ⬇ Export Game Progress
              </SketchButton>
              <SketchButton
                onClick={handleExportConcepts}
                disabled={isExporting}
                className="flex-1 text-sm font-bold"
              >
                ⬇ Export Concepts
              </SketchButton>
            </div>
            <p className="text-xs text-black/60 italic">
              Download your data as JSON files. Perfect for backup or transferring between devices.
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mb-6 p-5 border-3 border-red-600 rounded-lg bg-red-50 relative z-10">
          <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-3">
            <img src={trashPng} alt="Trash" className="w-6 h-6 object-contain" />
            Danger Zone
          </h2>

          {!showResetConfirm ? (
            <div>
              <p className="text-sm text-red-700 mb-3 font-semibold">This will permanently delete all your progress.</p>
              <SketchButton
                onClick={() => setShowResetConfirm(true)}
                className="!bg-red-600 !text-white hover:!bg-red-700 !border-red-600 w-full font-bold py-2 text-sm"
              >
                🗑 Reset All Progress
              </SketchButton>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-bold text-red-700 text-sm leading-relaxed">
                Are you absolutely sure? This will delete all game progress, achievements, and completed levels. This cannot be undone!
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

        {/* Session/Logout */}
        <div className="p-5 border-3 border-black rounded-lg bg-white/90 relative z-10">
          <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
            Session
          </h2>
          <SketchButton
            onClick={handleLogout}
            variant="inverted"
            className="w-full font-extrabold text-sm py-3"
          >
            🚪 Logout
          </SketchButton>
          <p className="text-xs text-black/60 italic mt-3">
            You can log back in anytime with your email and password.
          </p>
        </div>
      </section>

      {/* Bottom Decorative Doodle */}
      <svg className="sketch-doodle float-animation mx-auto mt-8" width="80" height="80" viewBox="0 0 80 80">
        <g opacity="0.2">
          <circle cx="40" cy="40" r="30" stroke="#000" strokeWidth="1.5" fill="none"/>
          <path d="M40 15 L45 35 L65 40 L45 45 L40 65 L35 45 L15 40 L35 35 Z" stroke="#000" strokeWidth="1.5" fill="none"/>
        </g>
      </svg>
    </div>
  );
};

export default ProfilePage;
