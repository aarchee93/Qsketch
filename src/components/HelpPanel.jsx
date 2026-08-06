import { useState, useEffect, useRef } from 'react';
import SketchButton from './SketchButton';
import { GATE_INFO } from '../constants/gateInfo';
import { GATE_VIDEOS, GATE_GUIDED_CONFIG } from '../constants/learningContent';
import { ACHIEVEMENTS } from '../constants/achievements';
import MascotCharacter from './MascotCharacter';

const GATE_NAMES = {
  H0: 'Hadamard (Q0)',
  H1: 'Hadamard (Q1)',
  X0: 'Pauli-X (Q0)',
  X1: 'Pauli-X (Q1)',
  CNOT: 'CNOT (Q0 → Q1)',
};
const GATE_LIST = Object.keys(GATE_NAMES);
const GATE_MOOD = { H0: 'wink', H1: 'wink', X0: 'excited', X1: 'excited', CNOT: 'excited' };
const GATE_SYMBOL = { H0: 'H', H1: 'H', X0: 'X', X1: 'X', CNOT: '⊕' };

// Rule-based gate helper, fronted by "The Nucleus" mascot — no AI/backend, nothing flaky in a demo.
// Flow: closed dot -> click -> mascot jumps out + asks -> gate options fan out -> click gate -> reaction + info.
const HelpPanel = ({ onTryInSimulator }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [bubble, setBubble] = useState(null);
  const [mood, setMood] = useState('idle');
  const [reacting, setReacting] = useState(false);
  const bubbleTimer = useRef(null);

  const showBubble = (text, ms, moodValue = 'idle') => {
    clearTimeout(bubbleTimer.current);
    setBubble(text);
    setMood(moodValue);
    bubbleTimer.current = setTimeout(() => setBubble(null), ms);
  };

  // React to milestones fired elsewhere (achievements, lesson completions) even while closed.
  useEffect(() => {
    const onAchievement = (e) => {
      const id = e.detail?.ids?.[0];
      const achievement = Object.values(ACHIEVEMENTS).find((a) => a.id === id);
      showBubble(achievement ? `${achievement.icon} Unlocked: ${achievement.name}!` : '🎉 Achievement unlocked!', 5000, 'excited');
    };
    const onLesson = () => showBubble('📘 Nice, one more lesson done!', 4000, 'excited');

    window.addEventListener('qsketch:achievement', onAchievement);
    window.addEventListener('qsketch:lesson-complete', onLesson);
    return () => {
      window.removeEventListener('qsketch:achievement', onAchievement);
      window.removeEventListener('qsketch:lesson-complete', onLesson);
      clearTimeout(bubbleTimer.current);
    };
  }, []);

  const filtered = GATE_LIST.filter((id) => GATE_NAMES[id].toLowerCase().includes(query.toLowerCase()));

  const close = () => { setOpen(false); setSelected(null); setQuery(''); setVideoOpen(false); setMood('idle'); setBubble(null); };

  const openPanel = () => {
    setOpen(true);
    showBubble('Hey! Which gate do you want to study?', 4000, 'idle');
  };

  const pickGate = (id) => {
    setReacting(true);
    setMood(GATE_MOOD[id] || 'excited');
    showBubble('Ooh, good one! Here we go →', 2200, GATE_MOOD[id] || 'excited');
    setTimeout(() => { setSelected(id); setReacting(false); }, 380);
  };

  return (
    <>
      <style>{`
        @keyframes mascot-idle-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes mascot-jump-out {
          0% { transform: scale(.2) translateY(40px); opacity: 0; }
          55% { transform: scale(1.15) translateY(-14px); opacity: 1; }
          75% { transform: scale(.92) translateY(4px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes mascot-react {
          0%,100% { transform: scale(1) rotate(0deg); }
          30% { transform: scale(1.25) rotate(-8deg); }
          60% { transform: scale(1.1) rotate(6deg); }
        }
        @keyframes bubble-pop { 0% { transform: scale(.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes option-fan-in {
          0% { transform: translateY(10px) scale(.85); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes badge-pop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .badge-float { animation: badge-pop .3s ease-out both; }
        @keyframes spin-a { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-b { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .mascot-ring-a { transform-origin: 50px 50px; animation: spin-a 5s linear infinite; }
        .mascot-ring-b { transform-origin: 50px 50px; animation: spin-b 3.5s linear infinite; }
        .mascot-idle { animation: mascot-idle-bounce 2.4s ease-in-out infinite; }
        @keyframes mascot-point-wave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-6deg); } }
        .mascot-point { transform-origin: 78px 76px; animation: mascot-point-wave 1.4s ease-in-out infinite; }
        .mascot-jumped { animation: mascot-jump-out .5s cubic-bezier(.34,1.56,.64,1) both; }
        .mascot-reacting { animation: mascot-react .38s ease-in-out; }
        .bubble-pop { animation: bubble-pop .2s ease-out both; }
        .option-fan { animation: option-fan-in .3s ease-out both; }
      `}</style>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {bubble && !open && (
          <div className="bubble-pop max-w-[220px] border-2 border-black rounded-xl bg-white shadow-[3px_3px_0_0_#000000] px-3 py-2 text-xs font-bold text-right">
            {bubble}
          </div>
        )}
        {!open && (
          <button
            onClick={openPanel}
            aria-label="Need help with gates?"
            title="Need help with gates?"
            className="mascot-idle bg-transparent border-0 p-0 leading-none"
          >
            <MascotCharacter mood={mood} size={56} />
          </button>
        )}
      </div>

      {open && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
          {/* Mascot itself — jumps out on open, does a little react animation on gate pick */}
          <div className={`flex items-end gap-2 ${reacting ? 'mascot-reacting' : 'mascot-jumped'}`}>
            {bubble && (
              <div className="bubble-pop max-w-[200px] border-2 border-black rounded-xl bg-white shadow-[3px_3px_0_0_#000000] px-3 py-2 text-xs font-bold">
                {bubble}
              </div>
            )}
            <div className="shrink-0">
              <MascotCharacter mood={mood} size={72} pointing={!selected} />
            </div>
          </div>

          <div className="w-80 max-h-[65vh] overflow-y-auto border-2 border-black rounded-xl bg-white shadow-[6px_6px_0_0_#000000] p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-extrabold">{selected ? GATE_NAMES[selected] : 'Pick a gate'}</h4>
              <button onClick={close} aria-label="Close help panel" className="font-extrabold px-2">✕</button>
            </div>

            {!selected ? (
              <>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search gates..."
                  className="w-full border-2 border-black rounded-lg p-2 mb-3 text-sm"
                />
                <div className="flex flex-wrap justify-center gap-4 py-2">
                  {filtered.map((id, i) => (
                    <button
                      key={id}
                      onClick={() => pickGate(id)}
                      style={{ animationDelay: `${i * 80}ms` }}
                      className="badge-float w-16 h-16 rounded-full border-2 border-black bg-white shadow-[3px_3px_0_0_#000000] flex flex-col items-center justify-center font-extrabold hover:bg-black hover:text-white transition-colors"
                      title={GATE_NAMES[id]}
                    >
                      <span className="text-lg leading-none">{GATE_SYMBOL[id]}</span>
                      <span className="text-[9px] leading-none mt-1 px-1 text-center">{GATE_NAMES[id].split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
                {filtered.length === 0 && <p className="text-sm text-gray-500 text-center">No gates match.</p>}
              </>
            ) : (
              <div className="space-y-3 option-fan">
                <button onClick={() => { setSelected(null); setMood('idle'); }} className="text-xs font-bold underline hover:no-underline">
                  &larr; Back to gates
                </button>
                <p className="text-sm text-gray-700">{GATE_INFO[selected]}</p>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setVideoOpen(true)}
                    className="text-sm font-bold underline hover:no-underline text-left"
                  >
                    ▶ Play video
                  </button>
                  <SketchButton
                    variant="outlined"
                    onClick={() => { onTryInSimulator(GATE_GUIDED_CONFIG[selected]); close(); }}
                  >
                    Try in Simulator
                  </SketchButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="w-full max-w-xl border-2 border-black rounded-xl bg-white shadow-[6px_6px_0_0_#000000] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MascotCharacter mood="idle" size={28} />
                <h5 className="font-extrabold">{GATE_NAMES[selected]} — video</h5>
              </div>
              <button onClick={() => setVideoOpen(false)} aria-label="Close video" className="font-extrabold px-2">✕</button>
            </div>
            <div className="w-full aspect-video border-2 border-black rounded-lg overflow-hidden">
              {GATE_VIDEOS[selected] && GATE_VIDEOS[selected] !== '#' ? (
                <video src={GATE_VIDEOS[selected]} controls autoPlay className="w-full h-full bg-black" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-sm text-gray-500 text-center px-4">
                  Video coming soon — link not yet added for this gate.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpPanel;