import { useEffect, useRef } from 'react';

/**
 * Small scrolling "lab console" ticker — makes the app feel like a running
 * machine reacting to you, rather than a static form. Purely visual, no
 * storage: the log lives in component state and disappears on refresh.
 */
const LabConsole = ({ entries }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="mt-6 border-2 border-black bg-black text-green-400 rounded-lg shadow-lg overflow-hidden font-mono text-xs md:text-sm">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-green-900 bg-black">
        <span className="flex items-center gap-2 text-green-500 font-bold tracking-wide">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          LAB CONSOLE
        </span>
        <span className="text-green-700">live</span>
      </div>
      <div ref={scrollRef} className="px-3 py-2 h-28 overflow-y-auto space-y-1" aria-live="polite" aria-atomic="false">
        <span className="sr-only">Lab console activity log</span>
        {entries.map((entry) => (
          <div key={entry.id} className="animate-fade-in whitespace-pre-wrap break-words">
            <span className="text-green-700">{'>'}</span> {entry.text}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-green-700 mr-1">{'>'}</span>
          <span className="inline-block w-2 h-4 bg-green-400 animate-pulse" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default LabConsole;
