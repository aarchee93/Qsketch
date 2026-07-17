import { useState } from 'react';
import { DID_YOU_KNOW_FACTS } from '../constants/labFlavorText';

/**
 * A single random fact picked fresh on mount — no tracking, no storage.
 * Dismissible, and can be re-rolled for another random fact.
 */
const DidYouKnow = () => {
  const [factIndex, setFactIndex] = useState(() =>
    Math.floor(Math.random() * DID_YOU_KNOW_FACTS.length)
  );
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const reroll = () => {
    setFactIndex((prev) => {
      let next = Math.floor(Math.random() * DID_YOU_KNOW_FACTS.length);
      if (DID_YOU_KNOW_FACTS.length > 1) {
        while (next === prev) {
          next = Math.floor(Math.random() * DID_YOU_KNOW_FACTS.length);
        }
      }
      return next;
    });
  };

  return (
    <div className="mb-6 flex items-center gap-3 border-2 border-black bg-white rounded-lg pl-4 pr-2 py-2 shadow-[4px_4px_0_0_#000000] animate-bounce-up">
      <span className="text-lg leading-none shrink-0" aria-hidden="true">💡</span>
      <p className="flex-1 text-sm italic min-w-0">
        <strong className="not-italic font-extrabold">Did you know? </strong>
        {DID_YOU_KNOW_FACTS[factIndex]}
      </p>
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={reroll}
          className="text-xs font-bold px-2 py-1 border-2 border-black rounded hover:bg-black hover:text-white transition-colors whitespace-nowrap"
          aria-label="Show another fact"
        >
          🔄
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-xs font-bold px-2 py-1 border-2 border-black rounded text-black/60 hover:bg-black hover:text-white transition-colors whitespace-nowrap"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default DidYouKnow;
