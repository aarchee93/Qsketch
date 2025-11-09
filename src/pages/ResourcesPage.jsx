import SketchButton from '../components/SketchButton';
import { PAGES } from '../constants/pages';
import { EXTERNAL_RESOURCES } from '../constants/externalResources';

const ResourcesPage = ({ setPage }) => (
  <div className="p-4 md:p-8">
    <SketchButton className="mb-8" onClick={() => setPage(PAGES.LANDING)}>
      &larr; Back to Home
    </SketchButton>
    
    <h2 className="text-3xl font-extrabold text-center border-b-4 border-double border-black pb-4 mb-8">Resource Library</h2>
    
    <div className="max-w-3xl mx-auto space-y-6">
      <p className="text-center italic text-lg text-gray-700">
          Curated links to deepen your understanding of quantum mechanics and computing.
      </p>

      {EXTERNAL_RESOURCES.map((resource, index) => (
        <a 
          key={index}
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block p-5 border-2 border-black rounded-lg shadow-[4px_4px_0_0_#000000] hover:shadow-[2px_2px_0_0_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 ease-out ${index % 2 === 0 ? 'bg-white text-black' : 'bg-black text-white'}`}
        >
          <h3 className="text-xl font-bold underline">{resource.name} &rarr;</h3>
          <p className={`mt-1 ${index % 2 === 0 ? 'text-gray-700' : 'text-gray-300'}`}>{resource.description}</p>
        </a>
      ))}
    </div>
  </div>
);

export default ResourcesPage;

