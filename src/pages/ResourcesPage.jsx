import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SketchButton from '../components/SketchButton';
import ResearchNote from '../components/ResearchNote';
import {
  LEARNING_CONTENT,
  LEARNING_PATH,
  DIFFICULTY_STYLES,
  getYouTubeId,
  PATH_TO_LESSON_ID,
  LESSON_GUIDED_CONFIG,
} from "../constants/learningContent";
import { isLessonComplete, markLessonComplete } from "../utils/resourceProgressUtils";

const TABS = [
  { key: "learn", label: "Learn" },
  { key: "glossary", label: "Glossary" },
  { key: "blogs", label: "Blogs" },
  { key: "papers", label: "Papers" },
  { key: "videos", label: "Videos" },
];

const DifficultyBadge = ({ difficulty }) => (
  <span className={`inline-block border-2 rounded-full px-3 py-1 text-xs font-bold ${DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES["All Levels"]}`}>
    {difficulty}
  </span>
);

const ResourcesPage = ({ deepLinkLessonId, onDeepLinkHandled, onTryInSimulator }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("learn");
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedLessonId, setHighlightedLessonId] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const lessonRefs = useRef({});

  // Wire up the deep-link from App (Simulator → Resources lesson jump).
  // Sets the tab to "learn", expands the target lesson, and scrolls to it.
  useEffect(() => {
    if (deepLinkLessonId) {
      setSearchQuery("");
      setActiveTab("learn");
      setSelectedDifficulty("All");
      setExpandedId(deepLinkLessonId);
      setHighlightedLessonId(deepLinkLessonId);
      onDeepLinkHandled?.();
    }
  }, [deepLinkLessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredContent = LEARNING_CONTENT[activeTab].filter(item => {
    const q = searchQuery.toLowerCase();
    const haystack = [item.title, item.term, item.description, item.definition, item.difficulty]
      .filter(Boolean).join(" ").toLowerCase();
    
    const matchesSearch = haystack.includes(q);
    const matchesDifficulty = selectedDifficulty === "All" || item.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  // Jumps to a lesson by ID: switches tab, expands, and scrolls.
  const jumpToLesson = (lessonId) => {
    setSearchQuery("");
    setActiveTab("learn");
    setSelectedDifficulty("All");
    setExpandedId(lessonId);
    setHighlightedLessonId(lessonId);
  };

  const toggleExpand = (itemId) => {
    const next = expandedId === itemId ? null : itemId;
    setExpandedId(next);
    if (next) markLessonComplete(itemId);
  };

  useEffect(() => {
    if (highlightedLessonId && activeTab === "learn") {
      const el = lessonRefs.current[highlightedLessonId];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      const timer = setTimeout(() => setHighlightedLessonId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedLessonId, activeTab]);

  return (
    <div className="p-4 md:p-8">
      <SketchButton className="mb-8" onClick={() => navigate(-1)}>
        &larr; Back
      </SketchButton>

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold border-b-4 border-double border-black pb-4">
            Quantum Learning Centre
          </h2>
          <p className="mt-4 text-gray-700">
            Learn Quantum Computing through structured lessons, a glossary, research papers, blogs and videos.
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quantum concepts..."
            className="w-full border-2 border-black rounded-lg p-3 shadow-[4px_4px_0_0_#000000]"
          />
        </div>

        {/* Difficulty Filter Pills */}
        {activeTab === "learn" && (
          <div className="mb-8">
            <h4 className="text-sm font-bold text-gray-600 mb-3">Filter by difficulty:</h4>
            <div className="flex flex-wrap gap-2">
              {["All", "Beginner", "Intermediate", "Advanced"].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`
                    px-4 py-2 rounded-full border-2 font-bold text-sm transition-all
                    ${selectedDifficulty === difficulty
                      ? 'border-black bg-black text-white shadow-[4px_4px_0_0_#000000]'
                      : 'border-black/30 bg-white text-black hover:border-black'
                    }
                  `}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        )}

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4">Learning Path</h3>
          <p className="text-sm text-gray-500 mb-3">Click a step to jump to that lesson</p>
          <div className="flex flex-wrap items-center gap-2">
            {LEARNING_PATH.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <button
                  onClick={() => jumpToLesson(PATH_TO_LESSON_ID[step.id])}
                  title={step.summary}
                  className="flex items-center gap-2 border-2 border-black rounded-full px-4 py-2 font-semibold bg-white text-black shadow-[4px_4px_0_0_#000000] hover:shadow-[2px_2px_0_0_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs font-bold">
                    {i + 1}
                  </span>
                  {step.title}
                </button>
                {i < LEARNING_PATH.length - 1 && <span className="text-xl font-bold">→</span>}
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-2 border-b-2 border-black pb-3 mb-6">
          {TABS.map(tab => (
            <SketchButton
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outlined"}
              onClick={() => { setActiveTab(tab.key); setSearchQuery(""); }}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-70">({LEARNING_CONTENT[tab.key].length})</span>
            </SketchButton>
          ))}
        </div>

        <section className="border-2 border-black rounded-xl p-8 min-h-[350px] shadow-md">
          <h3 className="text-2xl font-bold mb-6 capitalize">{activeTab}</h3>

          {filteredContent.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <h4 className="text-xl font-semibold mb-2">No matching resources.</h4>
              <p>Try a different search term, or clear the search box.</p>
            </div>
          ) : activeTab === "glossary" ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredContent.map(item => (
                <div key={item.id} className="border-2 border-black rounded-lg p-4">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h4 className="text-lg font-bold">{item.term}</h4>
                    <DifficultyBadge difficulty={item.difficulty} />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.definition}</p>
                </div>
              ))}
            </div>
          ) : activeTab === "videos" ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredContent.map(item => {
                const videoId = getYouTubeId(item.url);
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-2 border-black rounded-lg overflow-hidden shadow-[4px_4px_0_0_#000000] hover:shadow-[2px_2px_0_0_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
                  >
                    {videoId && (
                      <div className="relative">
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                          alt={item.title}
                          className="w-full aspect-video object-cover border-b-2 border-black"
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-14 h-14 rounded-full bg-black/70 flex items-center justify-center text-white text-2xl">▶</span>
                        </span>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <DifficultyBadge difficulty={item.difficulty} />
                        <span className="text-sm text-gray-500">{item.readTime}</span>
                      </div>
                      <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredContent.map((item) => (
                <div
                  key={item.id}
                  ref={activeTab === "learn" ? (el) => (lessonRefs.current[item.id] = el) : null}
                  className={`border-2 border-black rounded-lg p-5 transition-all ${
                    highlightedLessonId === item.id ? 'border-4 border-black shadow-[4px_4px_0_0_#000]' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <DifficultyBadge difficulty={item.difficulty} />
                    <span className="text-sm text-gray-500">{item.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    {item.title}
                    {activeTab === "learn" && isLessonComplete(item.id) && (
                      <span title="Lesson read" className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-black text-xs font-bold">✓</span>
                    )}
                  </h3>

                  {item.story ? (
  <>
    <button
      onClick={() => toggleExpand(item.id)}
      aria-expanded={expandedId === item.id}
      className="text-sm font-bold underline hover:no-underline mb-4"
    >
      {expandedId === item.id ? '▲ Show less' : '▼ Read full lesson'}
    </button>
    {expandedId === item.id && (
      <div className="space-y-4 mb-5">
        <section>
          <h4 className="font-extrabold text-sm uppercase tracking-wide text-gray-500 mb-1">📖 Story</h4>
          <p className="text-gray-700 leading-relaxed">{item.story}</p>
        </section>
        <section>
          <h4 className="font-extrabold text-sm uppercase tracking-wide text-gray-500 mb-1">🎓 Explanation</h4>
          <p className="text-gray-700 leading-relaxed">{item.explanation}</p>
        </section>
        <section>
          <h4 className="font-extrabold text-sm uppercase tracking-wide text-gray-500 mb-1">🧠 Technical Details</h4>
          <p className="text-gray-700 leading-relaxed">{item.technicalDetails}</p>
        </section>
        <section>
          <h4 className="font-extrabold text-sm uppercase tracking-wide text-gray-500 mb-1">🌍 Real World Applications</h4>
          <p className="text-gray-700 leading-relaxed">{item.realWorldApplications}</p>
        </section>
        {item.researchNote && <ResearchNote>{item.researchNote}</ResearchNote>}
      </div>
    )}
  </>
) : (
  <p className="text-gray-700 leading-relaxed mb-5">{item.description}</p>
)}

                  <div className="flex gap-3 flex-wrap">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 border-2 border-black shadow-[4px_4px_0_0_#000000] font-bold text-sm md:text-base transition-all duration-100 ease-out hover:shadow-[2px_2px_0_0_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] bg-white text-black"
                      >
                        Open Resource
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17L17 7M17 7H8M17 7V16" />
                        </svg>
                      </a>
                    )}
                    {activeTab === "learn" && (
                      <SketchButton
                        variant="outlined"
                        onClick={() => onTryInSimulator?.(LESSON_GUIDED_CONFIG[item.id] ?? null)}
                      >
                        Try in Simulator
                      </SketchButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default ResourcesPage;