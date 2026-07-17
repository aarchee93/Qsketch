import SketchButton from '../components/SketchButton';
import { PAGES } from '../constants/pages';

const LandingPage = ({ setPage }) => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-12">

    {/* Hero Section */}
    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4">
      Q-SKETCH
    </h1>

    <div className="max-w-3xl">
      <p className="text-2xl font-semibold text-black italic mb-4">
        Learn Quantum Computing by Building Real Quantum Circuits
      </p>

      <p className="text-lg text-black leading-relaxed">
        Explore quantum computing through interactive simulations, challenges, and visual learning.
      </p>
    </div>

    {/* Navigation */}
    <div className="mt-12">
      <p className="text-sm uppercase tracking-[0.3em] text-black font-bold mb-6">
       Explore Q-Sketch
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">

        <SketchButton
          className="text-left px-6 py-5"
          onClick={() => setPage(PAGES.GAME)}
        >
          <div>
            <h3 className="text-xl font-bold">
              Quantum Challenge
            </h3>

            <p className="mt-2 text-sm opacity-80">
              Learn by solving quantum puzzles.
            </p>
          </div>
        </SketchButton>

        <SketchButton
          className="text-left px-6 py-5"
          variant="inverted"
          onClick={() => setPage(PAGES.SIMULATOR)}
        >
          <div>
            <h3 className="text-xl font-bold">
              Quantum Simulator
            </h3>

            <p className="mt-2 text-sm opacity-80">
             Build and test quantum circuits.
            </p>
          </div>
        </SketchButton>


        <SketchButton
          className="text-left px-6 py-5"
          variant="inverted"
          onClick={() => setPage(PAGES.RESOURCES)}
        >
          <div>
            <h3 className="text-xl font-bold">
              Quantum Learning Centre
            </h3>

            <p className="mt-2 text-sm opacity-80">
              Search, glossary, blogs, papers & videos in one place.
            </p>
          </div>
        </SketchButton>

        <SketchButton
          className="text-left px-6 py-5"
          onClick={() => setPage(PAGES.CMS)}
        >
          <div>
            <h3 className="text-xl font-bold">
              Concept Manager
            </h3>

            <p className="mt-2 text-sm opacity-80">
              Manage learning concepts.
            </p>
          </div>
        </SketchButton>

      </div>
    </div>

    {/* Learning Section */}

    <div className="mt-20 max-w-6xl w-full">

      <h2 className="text-4xl font-black mb-4">
        What You'll Learn
      </h2>

      <p className="text-black mb-10">
        Master the core principles of quantum computing through
        interactive visualization and experimentation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="border-2 border-black rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-3">
            Qubits
          </h3>

          <p className="text-black">
            Learn how quantum information is stored using qubits instead
            of classical bits.
          </p>
        </div>

        <div className="border-2 border-black rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-3">
            Superposition
          </h3>

          <p className="text-black">
            Understand how a qubit can exist in multiple states before
            measurement.
          </p>
        </div>

        <div className="border-2 border-black rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-3">
            Quantum Gates
          </h3>

          <p className="text-black">
            Apply quantum gates and observe how they transform quantum
            states.
          </p>
        </div>

        <div className="border-2 border-black rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-3">
            Entanglement
          </h3>

          <p className="text-black">
            Explore how two qubits become strongly connected using
            entanglement.
          </p>
        </div>

        <div className="border-2 border-black rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-3">
            Measurement
          </h3>

          <p className="text-black">
            Observe probability amplitudes, quantum measurement and wave
            function collapse.
          </p>
        </div>

        <div className="border-2 border-black rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-3">
            Hands-on Learning
          </h3>

          <p className="text-black">
            Reinforce concepts through simulations, guided challenges,
            and visual experimentation.
          </p>
        </div>

      </div>

    </div>
    {/* Bottom Call To Action */}

<div className="mt-20 text-center">

    <h2 className="text-3xl font-black mb-3">
        Ready to Start Learning?
    </h2>

    <p className="text-black mb-8 max-w-xl mx-auto">
        Build your first quantum circuit and explore how quantum gates work in real time.
    </p>

    <SketchButton
        variant="inverted"
        className="text-lg px-8 py-4"
        onClick={() => setPage(PAGES.SIMULATOR)}
    >
        Start Learning →
    </SketchButton>

</div>

  </div>
);

export default LandingPage;