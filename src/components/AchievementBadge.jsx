/**
 * Achievement Badge Display Component
 */
const AchievementBadge = ({ achievement, unlocked }) => {
  return (
    <div
      className={`
        p-4 rounded-lg border-2 border-black text-center transition-all duration-300
        ${unlocked 
          ? 'bg-white shadow-lg animate-badge-pop' 
          : 'bg-gray-200 opacity-50 grayscale'}
      `}
      title={achievement.description}
    >
      <div className="text-4xl mb-2">{achievement.icon}</div>
      <h4 className="font-bold text-sm">{achievement.name}</h4>
      <p className="text-xs mt-1 italic">{achievement.description}</p>
    </div>
  );
};

/**
 * Achievements Grid Display
 */
export const AchievementsGrid = ({ achievements }) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="w-full">
      <div className="mb-6 p-4 bg-white border-2 border-black rounded-lg">
        <h3 className="text-2xl font-extrabold mb-2">🏆 Achievements</h3>
        <p className="text-lg font-bold">
          {unlockedCount} / {totalCount} Unlocked
        </p>
        <div className="mt-2 bg-gray-200 rounded-full h-3 border border-black overflow-hidden">
          <div
            className="bg-black h-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {achievements.map(achievement => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            unlocked={achievement.unlocked}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Achievement Unlock Notification
 */
export const AchievementUnlock = ({ achievement, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-badge-pop pointer-events-auto">
        <div className={`bg-white border-4 border-black rounded-2xl p-8 max-w-sm text-center shadow-[8px_8px_0_0_#000000]`}>
          <div className="text-6xl mb-4">{achievement.icon}</div>
          <h2 className="text-2xl font-extrabold mb-2">🎉 Achievement Unlocked!</h2>
          <h3 className="text-xl font-bold mb-2">{achievement.name}</h3>
          <p className="text-sm mb-6">{achievement.description}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            Awesome!
          </button>
        </div>
      </div>
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
    </div>
  );
};

export default AchievementBadge;
