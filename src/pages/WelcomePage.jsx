import { useState, useRef, useEffect } from 'react';
import { playClickSound } from '../utils/soundUtils';
import SketchButton from '../components/SketchButton';

function QuantumField() {
  return (
    <svg className="quantum-field" viewBox="0 0 920 920" aria-hidden="true">
      <defs>
        <radialGradient id="quantum-welcome-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#111" stopOpacity=".20" />
          <stop offset="72%" stopColor="#111" stopOpacity=".055" />
          <stop offset="100%" stopColor="#111" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="field-haze" cx="460" cy="460" r="440" fill="url(#quantum-welcome-fade)" />
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
        <circle cx="229" cy="328" r="6" />
        <circle cx="359" cy="216" r="5" />
        <circle cx="574" cy="248" r="7" />
        <circle cx="694" cy="404" r="5" />
        <circle cx="628" cy="617" r="7" />
        <circle cx="411" cy="700" r="5" />
        <circle cx="224" cy="562" r="6" />
        <circle cx="460" cy="460" r="12" />
      </g>
    </svg>
  );
}

const WelcomePage = ({ onGuestPlay, onSignIn }) => {
  const [scrollAnimationReady, setScrollAnimationReady] = useState(false);
  const welcomeRef = useRef(null);

  useEffect(() => {
    const elements = welcomeRef.current?.querySelectorAll('.reveal-on-scroll') ?? [];
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.target.classList.toggle('is-visible', entry.isIntersecting)
        );
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    elements.forEach((element) => observer.observe(element));
    const frame = requestAnimationFrame(() => setScrollAnimationReady(true));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={welcomeRef}
      className={`qsketch-landing overflow-hidden min-h-screen flex flex-col justify-center ${
        scrollAnimationReady ? 'has-scroll-animations' : ''
      }`}
    >
      <div className="qsketch-atmosphere">
        <QuantumField />
      </div>

      <section className="landing-hero section-shell">
        <div className="hero-kicker">Welcome to Quantum Learning</div>

        <h1 className="hero-title animate-fade-in">Q-SKETCH</h1>

        <p className="hero-statement">Build, Visualize, and Understand<br />Quantum Computing.</p>

        <p className="hero-caption">
          Whether you're exploring as a guest or committing to your learning journey, Q-SKETCH adapts to you.
        </p>

        {/* Action Buttons */}
        <div className="welcome-actions mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
          {/* Guest Play Button */}
          <button
            onClick={() => {
              playClickSound();
              onGuestPlay();
            }}
            className="px-8 py-4 bg-white border-2 border-black rounded-lg font-bold text-lg transition-all hover:bg-black hover:text-white hover:shadow-[6px_6px_0_0_#000] active:scale-95"
            title="Play without saving progress"
          >
            👾 Play as Guest
          </button>

          {/* Divider */}
          <div className="hidden sm:block text-black/40 text-2xl">or</div>
          <div className="sm:hidden text-black/40">━━━━</div>

          {/* Sign In Button */}
          <button
            onClick={() => {
              playClickSound();
              onSignIn();
            }}
            className="px-8 py-4 bg-black text-white border-2 border-black rounded-lg font-bold text-lg transition-all hover:bg-white hover:text-black hover:shadow-[6px_6px_0_0_#000] active:scale-95"
            title="Sign in to save your progress"
          >
            🔐 Sign In
          </button>
        </div>

        {/* Info Text */}
        <div className="mt-8 max-w-lg mx-auto text-center animate-fade-in">
          <p className="text-sm text-black/70">
            <strong>Guest mode:</strong> Explore all features freely—your progress won't be saved after you close your browser.
          </p>
          <p className="text-sm text-black/70 mt-2">
            <strong>Sign in:</strong> Keep your progress, achievements, and concepts saved forever.
          </p>
        </div>

        {/* Scroll indicator */}
        <a
          className="scroll-cue"
          href="#why-qsketch"
          onClick={() => {
            playClickSound();
            document.getElementById('why-qsketch')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Learn more <span>↓</span>
        </a>
      </section>

      {/* Why Q-SKETCH Section */}
      <section id="why-qsketch" className="section-shell py-20">
        <p className="eyebrow text-center">Why choose Q-SKETCH?</p>
        <h2 className="text-center mb-12">Learn Quantum by Doing</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="sketch-card reveal-on-scroll">
            <span className="card-number">01</span>
            <h3>Visual First</h3>
            <p>
              See quantum circuits and states come alive. No heavy math required — just intuition and experimentation.
            </p>
          </div>

          <div className="sketch-card reveal-on-scroll">
            <span className="card-number">02</span>
            <h3>Hands-On Labs</h3>
            <p>
              Build circuits in real-time, measure qubits, and watch probabilities change. Learn by experimenting.
            </p>
          </div>

          <div className="sketch-card reveal-on-scroll">
            <span className="card-number">03</span>
            <h3>Structured Path</h3>
            <p>
              Start with basics, progress through challenges, unlock achievements, and master quantum concepts step by step.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-shell py-20 border-t-2 border-black">
        <p className="eyebrow text-center">Inside Q-SKETCH</p>
        <h2 className="text-center mb-12">Your Quantum Playground</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="reveal-on-scroll">
            <h3 className="text-2xl font-bold mb-3">◌ Quantum Simulator</h3>
            <p className="text-black/70">
              Start with one qubit, add gates, watch the state change in real-time. Fully interactive and visual.
            </p>
          </div>

          <div className="reveal-on-scroll">
            <h3 className="text-2xl font-bold mb-3">✦ Quantum Challenge</h3>
            <p className="text-black/70">
              Solve visual puzzles to build confidence. Progress through levels, unlock achievements, master the concepts.
            </p>
          </div>

          <div className="reveal-on-scroll">
            <h3 className="text-2xl font-bold mb-3">⌁ Learning Centre</h3>
            <p className="text-black/70">
              Clear lessons, glossary, research papers, and videos. Learn the why behind the visual anytime.
            </p>
          </div>

          <div className="reveal-on-scroll">
            <h3 className="text-2xl font-bold mb-3">⊞ Concept Manager</h3>
            <p className="text-black/70">
              Save concepts you want to revisit. Build your personal knowledge base as you learn.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta section-shell">
        <p className="eyebrow">Your quantum journey awaits</p>
        <h2>Ready to Get Started?</h2>

        <div className="welcome-actions mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => {
              playClickSound();
              onGuestPlay();
            }}
            className="px-6 py-3 bg-white border-2 border-black rounded-lg font-bold transition-all hover:bg-black hover:text-white"
          >
            Play as Guest
          </button>

          <button
            onClick={() => {
              playClickSound();
              onSignIn();
            }}
            className="px-6 py-3 bg-black text-white border-2 border-black rounded-lg font-bold transition-all hover:bg-white hover:text-black"
          >
            Sign In Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;
