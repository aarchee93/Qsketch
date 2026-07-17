import { useState, useRef, useEffect } from 'react';
import SketchButton from '../components/SketchButton';
import { PAGES } from '../constants/pages';
import {
  LEARNING_CONTENT,
  LEARNING_PATH,
  DIFFICULTY_STYLES,
  getYouTubeId,
  PATH_TO_LESSON_ID,
} from "../constants/learningContent";

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

const ResourcesPage = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState("learn");
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedLessonId, setHighlightedLessonId] = useState(null);
  const lessonRefs = useRef({});

  const filteredContent = LEARNING_CONTENT[activeTab].filter(item => {
    const q = searchQuery.toLowerCase();
    const haystack = [item.title, item.term, item.description, item.definition, item.difficulty]
      .filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(q);
  });

  const jumpToLesson = (lessonId) => {
    setSearchQuery("");
    setActiveTab("learn");
    setHighlightedLessonId(lessonId);
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
      <SketchButton className="mb-8" onClick={() => setPage(PAGES.LANDING)}>
        &larr; Back to Home
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
            className="w-full border-2 border-black rounded-lg p-3 shadow-md"
          />
        </div>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-4">Learning Path</h3>
          <p className="text-sm text-gray-500 mb-3">Click a step to jump to that lesson</p>
          <div className="flex flex-wrap items-center gap-2">
            {LEARNING_PATH.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <button
                  onClick={() => jumpToLesson(PATH_TO_LESSON_ID[step.id])}
                  title={step.summary}
                  className="flex items-center gap-2 border-2 border-black rounded-full px-4 py-2 font-semibold hover:bg-black hover:text-white transition"
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
              <h4 className="text-xl font-semibold mb-2">No results</h4>
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
                    highlightedLessonId === item.id ? 'ring-4 ring-black bg-yellow-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <DifficultyBadge difficulty={item.difficulty} />
                    <span className="text-sm text-gray-500">{item.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed mb-5">{item.description}</p>
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
                      <SketchButton variant="outlined" onClick={() => setPage(PAGES.SIMULATOR)}>
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