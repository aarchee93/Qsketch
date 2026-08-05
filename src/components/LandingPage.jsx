import { useEffect, useRef, useState } from 'react';
import { PAGES } from '../constants/pages';
import { playClickSound, playActionSound, playMeasureSound, playSuccessSound, playErrorSound } from '../utils/soundUtils';

const modules = [
  ['01', 'Quantum Simulator', 'Start with one qubit. Add a gate. Watch the result change in real time.', PAGES.SIMULATOR],
  ['02', 'Quantum Challenge', 'Build confidence by solving short visual puzzles, one idea at a time.', PAGES.GAME],
  ['03', 'Learning Centre', 'Clear lessons for the moments when you want the why behind the visual.', PAGES.RESOURCES],
  ['04', 'Concept Manager', 'Save the concepts you want to revisit as your understanding grows.', PAGES.CMS],
];

const concepts = [
  ['Qubit', 'qubit'],
  ['Superposition', 'superposition'],
  ['Entanglement', 'entanglement'],
  ['Gates', 'gates'],
  ['Measurement', 'measurement'],
];

const quizQuestion = {
  text: 'What happens when you pass a qubit through two Hadamard (H) gates in a row?',
  options: [
    { id: 'a', label: 'It returns back to its original state (|0⟩)', correct: true, explain: 'Correct! Quantum operations are reversible. Applying H twice cancels out superposition (H × H = I).' },
    { id: 'b', label: 'It stays in a permanent 50/50 superposition', correct: false, explain: 'Not quite! Applying H a second time interferes the state back to its original baseline state |0⟩.' },
    { id: 'c', label: 'It flips permanently to state |1⟩', correct: false, explain: 'Incorrect! An X gate flips |0⟩ to |1⟩, but two H gates interfere constructively back to |0⟩.' }
  ]
};

function QuantumField() {
  return <svg className="quantum-field" viewBox="0 0 920 920" aria-hidden="true">
    <defs>
      <radialGradient id="quantum-field-fade" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#111" stopOpacity=".20" />
        <stop offset="72%" stopColor="#111" stopOpacity=".055" />
        <stop offset="100%" stopColor="#111" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle className="field-haze" cx="460" cy="460" r="440" fill="url(#quantum-field-fade)" />
    <g className="field-orbits" fill="none">
      <circle cx="460" cy="460" r="278" />
      <ellipse cx="460" cy="460" rx="360" ry="142" />
      <ellipse cx="460" cy="460" rx="142" ry="360" />
      <ellipse cx="460" cy="460" rx="330" ry="190" transform="rotate(43 460 460)" />
    </g>
    <g className="field-web" fill="none">
      <path d="M229 328 359 216 574 248 694 404 628 617 411 700 224 562 229 328Z" />
      <path d="M229 328 460 460 574 248M359 216 460 460 694 404M224 562 460 460 628 617M411 700 460 460" />
      <path d="M359 216 411 700M229 328 628 617M574 248 224 562M694 404 411 700" />
    </g>
    <g className="field-nodes">
      <circle cx="229" cy="328" r="6" /><circle cx="359" cy="216" r="5" /><circle cx="574" cy="248" r="7" />
      <circle cx="694" cy="404" r="5" /><circle cx="628" cy="617" r="7" /><circle cx="411" cy="700" r="5" />
      <circle cx="224" cy="562" r="6" /><circle cx="460" cy="460" r="12" />
    </g>
  </svg>;
}

const LandingPage = ({ setPage }) => {
  const [demoStage, setDemoStage] = useState('start');
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [scrollAnimationReady, setScrollAnimationReady] = useState(false);
  const landingRef = useRef(null);

  useEffect(() => {
    const elements = landingRef.current?.querySelectorAll('.reveal-on-scroll') ?? [];
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    elements.forEach((element) => observer.observe(element));
    const frame = requestAnimationFrame(() => setScrollAnimationReady(true));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const applyHadamard = () => {
    playActionSound();
    setDemoStage('superposition');
  };

  const measure = () => {
    playMeasureSound();
    setDemoStage('measured');
  };

  const resetDemo = () => {
    setDemoStage('start');
  };

  const handleQuizSelect = (option) => {
    setSelectedQuizOption(option);
    if (option.correct) {
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  return (
    <div ref={landingRef} className={`qsketch-landing overflow-hidden ${scrollAnimationReady ? 'has-scroll-animations' : ''}`}>
      <div className="qsketch-atmosphere"><QuantumField /></div>

      <section className="landing-hero section-shell">
        <div className="hero-kicker">A visual quantum sketchpad</div>
        <div className="hero-sequence" aria-label="Quantum state animation">
          <span className="sequence-orb orb-a" />
          <span className="sequence-wire" />
          <span className="sequence-orb orb-b" />
          <span className="sequence-gate">H</span>
          <span className="sequence-wave" />
          <span className="sequence-collapse" />
        </div>
        <h1 className="hero-title">Q-SKETCH</h1>
        <p className="hero-statement">Build, Visualize, and Understand<br />Quantum Computing.</p>
        <p className="hero-caption">Don&apos;t just read about quantum computing — experience it! No background needed, start with simple visual experiments.</p>
        <button className="hero-action" onClick={() => { playClickSound(); document.getElementById('quick-demo')?.scrollIntoView({ behavior: 'smooth' }); }}>Try it in 30 seconds -&gt;</button>
        <a className="scroll-cue" href="#quantum-basics" onClick={() => playClickSound()}>Scroll to explore <span>↓</span></a>
      </section>

      <section id="quantum-basics" className="section-shell basics-section">
        <p className="eyebrow">01 / Start with the shift</p>
        <h2>What is quantum computing?</h2>
        <p className="section-intro quantum-explainer"><b>Quantum computers use qubits.</b> A normal bit is one clear answer: 0 or 1. A qubit can hold a blend of both until we measure it. Gates shape those possibilities into useful answers.</p>
        <div className="sketch-card-grid">
          <article className="sketch-card reveal-on-scroll"><span className="card-number">01</span><div className="bit-art">0 <i /> 1</div><h3>A bit chooses one answer</h3><p>Classical computers work with a definite 0 <em>or</em> 1.</p></article>
          <article className="sketch-card reveal-on-scroll"><span className="card-number">02</span><div className="qubit-art"><i /> <i /></div><h3>A qubit holds possibilities</h3><p>Before measurement, it can represent a mix of 0 <em>and</em> 1.</p></article>
          <article className="sketch-card reveal-on-scroll"><span className="card-number">03</span><div className="mini-circuit"><i>H</i><b /><i>X</i></div><h3>A circuit guides the result</h3><p>Gates change those possibilities before we measure them.</p></article>
        </div>
      </section>

      <section id="quick-demo" className="section-shell demo-section">
        <p className="eyebrow">02 / Your first quantum moment</p>
        <div className="demo-layout">
          <div>
            <h2>Try a quantum idea in 30 seconds.</h2>
            <p className="section-intro">No maths. No setup. Click H, then measure the qubit you changed.</p>
            <div className="demo-steps">
              <span className={`demo-step-pill ${demoStage === 'start' ? 'active-step' : demoStage !== 'start' ? 'completed-step' : ''}`}>
                1. Click H
              </span>
              <span className={`demo-step-pill ${demoStage === 'superposition' ? 'active-step' : demoStage === 'measured' ? 'completed-step' : ''}`}>
                2. See 50 / 50
              </span>
              <span className={`demo-step-pill ${demoStage === 'measured' ? 'active-step' : ''}`}>
                3. Click Measure
              </span>
            </div>
          </div>
          <div className={`mini-demo stage-${demoStage}`}>
            <div className="demo-topline">
              <span>1 QUBIT</span>
              <span>LIVE SKETCH</span>
            </div>
            <div className="demo-circuit">
              <span className="demo-state">{demoStage === 'measured' ? '|1⟩' : '|0⟩'}</span>
              <span className="demo-line" />
              <button className="demo-gate" onClick={applyHadamard} disabled={demoStage !== 'start'}>H</button>
              <span className="demo-line" />
              <span className="demo-measure">M</span>
            </div>

            <div className="probabilities">
              <div>
                <span className="prob-label">|0⟩</span>
                <span className="prob-bar zero" />
                <strong>{demoStage === 'start' ? '100%' : demoStage === 'measured' ? '0%' : '50%'}</strong>
              </div>
              <div>
                <span className="prob-label">|1⟩</span>
                <span className="prob-bar one" />
                <strong>{demoStage === 'measured' ? '100%' : demoStage === 'start' ? '0%' : '50%'}</strong>
              </div>
            </div>

            <button className="measure-button" onClick={measure} disabled={demoStage !== 'superposition'}>
              {demoStage === 'measured' ? 'Measured as |1⟩' : 'Measure →'}
            </button>

            {demoStage === 'start' && (
              <p className="demo-hint" aria-live="polite">
                👉 <b>Step 1:</b> Click the <b>H</b> gate. It puts the qubit into a 50 / 50 superposition between 0 and 1.
              </p>
            )}
            {demoStage === 'superposition' && (
              <p className="demo-hint" aria-live="polite">
                ✨ <b>Great job!</b> The qubit is now 50 / 50. 👉 <b>Step 2:</b> Click <b>Measure →</b> to collapse it into a single answer.
              </p>
            )}
            {demoStage === 'measured' && (
              <>
                <p className="demo-hint" aria-live="polite">
                  🎉 <b>Brilliant!</b> You just created superposition and performed a quantum measurement — you&apos;ve mastered the fundamental building block of quantum computing!
                </p>
                <button className="demo-reset" onClick={() => { playClickSound(); resetDemo(); }}>Try again</button>
              </>
            )}
          </div>
        </div>
        <p className="demo-note">This is exactly how you&apos;ll learn inside Q-SKETCH.</p>
      </section>

      <section className="section-shell journey-section">
        <p className="eyebrow">03 / Make it yours</p><h2>A learning journey that behaves like a circuit.</h2>
        <div className="journey-line">{['Learn', 'Visualize', 'Experiment', 'Challenge', 'Master'].map((step, index) => <div className="journey-node reveal-on-scroll" key={step}><span>{`0${index + 1}`}</span><b>{step}</b></div>)}</div>
      </section>

      <section className="section-shell modules-section">
        <p className="eyebrow">04 / Keep exploring</p><h2>Choose your next small step.</h2>
        <div className="module-grid">{modules.map(([number, title, description, page]) => <button key={title} className="module-card reveal-on-scroll" onClick={() => { playClickSound(); setPage(page); }}><span>{number}</span><div className="module-icon">{title === 'Quantum Simulator' ? '◌' : title === 'Quantum Challenge' ? '✦' : title === 'Learning Centre' ? '⌁' : '⊞'}</div><h3>{title}</h3><p>{description}</p><strong>Open module <i>→</i></strong></button>)}</div>
      </section>

      <section className="section-shell concepts-section">
        <p className="eyebrow">05 / Watch the rules move</p><h2>Interactive concepts, sketched out.</h2>
        <div className="concept-list">{concepts.map(([name, type], index) => <article className={`concept-row reveal-on-scroll concept-${type}`} key={name}><span>{`0${index + 1}`}</span><h3>{name}</h3><div className="concept-animation">{type === 'gates' ? <><i>H</i><i>X</i><i>Z</i></> : type === 'measurement' ? <><b className="wave-line">∿∿∿</b><b className="point">●</b></> : <><b /><b /></>}</div><p>{type === 'qubit' ? 'A single quantum state, pulsing with possibility.' : type === 'superposition' ? 'One state becomes two possible outcomes.' : type === 'entanglement' ? 'Two qubits share one connected story.' : type === 'gates' ? 'Operations travel through a circuit and change its state.' : 'A wave of possibilities resolves into one result.'}</p></article>)}</div>
      </section>

      <section className="section-shell quiz-section">
        <p className="eyebrow">06 / Test your quantum intuition</p>
        <h2>Quick Quantum Puzzle</h2>
        <div className="quiz-card reveal-on-scroll">
          <p className="quiz-question">{quizQuestion.text}</p>
          <div className="quiz-options">
            {quizQuestion.options.map((opt) => {
              const isSelected = selectedQuizOption?.id === opt.id;
              let btnClass = 'quiz-option-btn';
              if (isSelected) {
                btnClass += opt.correct ? ' selected-correct' : ' selected-wrong';
              }
              return (
                <button key={opt.id} className={btnClass} onClick={() => handleQuizSelect(opt)}>
                  <span className="quiz-option-letter">{opt.id.toUpperCase()}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
          {selectedQuizOption && (
            <div className={`quiz-feedback ${selectedQuizOption.correct ? 'is-correct' : ''}`}>
              {selectedQuizOption.explain}
            </div>
          )}
        </div>
      </section>

      <section className="final-cta section-shell">
        <p className="eyebrow">Your first line of quantum code is waiting</p>
        <h2>Ready to Build Your First Quantum Circuit?</h2>
        <button className="launch-button" onClick={() => { playClickSound(); setPage(PAGES.SIMULATOR); }}>Launch Simulator <span>→</span></button>
      </section>
    </div>
  );
};

export default LandingPage;
