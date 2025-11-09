import SketchButton from '../components/SketchButton';
import { PAGES } from '../constants/pages';

const LandingPage = ({ setPage }) => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
    <h2 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter">Q-SKETCH</h2>
    <p className="text-xl md:text-2xl font-semibold mb-10 text-gray-700 italic">
      Your Interactive Quantum Mechanics and Computing Playground
    </p>
    <div className="space-y-4 md:space-y-0 md:flex md:space-x-6">
      <SketchButton className="w-full md:w-auto text-lg" onClick={() => setPage(PAGES.GAME)}>
        Play Quantum Puzzle
      </SketchButton>
      <SketchButton className="w-full md:w-auto text-lg" variant="inverted" onClick={() => setPage(PAGES.SIMULATOR)}>
        Open Free Simulator
      </SketchButton>
      <SketchButton className="w-full md:w-auto text-lg" onClick={() => setPage(PAGES.CMS)}>
        Add Your Concepts
      </SketchButton>
      <SketchButton className="w-full md:w-auto text-lg" variant="inverted" onClick={() => setPage(PAGES.RESOURCES)}>
        Resource Library
      </SketchButton>
    </div>
  </div>
);

export default LandingPage;

