import SketchButton from '../components/SketchButton';
import ConceptEditor from '../components/ConceptEditor';
import { PAGES } from '../constants/pages';

const CMSPage = ({ setPage, concepts, onAddConcept, onDeleteConcept }) => {
  return (
    <div className="p-4 md:p-8">
      <SketchButton className="mb-8" onClick={() => setPage(PAGES.LANDING)}>
        &larr; Back to Home
      </SketchButton>
      
      <h2 className="text-3xl font-extrabold text-center border-b-4 border-double border-black pb-4 mb-8">Concept Editor & Library</h2>
      
      <div className="max-w-3xl mx-auto">
        
        {/* RENDER THE EDITOR INTERFACE */}
        <ConceptEditor onSave={onAddConcept} />
        
        {/* RENDER DYNAMIC CONTENT */}
        <h3 className="text-2xl font-extrabold mb-4">Current Concepts</h3>
        <div className="space-y-10">
            {concepts.map((concept, index) => (
               <div key={concept.id} className={`p-5 border-2 border-black rounded-lg ${index % 2 === 0 ? 'bg-white' : 'bg-black text-white'} shadow-md`}>
                  <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                          <h3 className="text-2xl font-bold">{concept.title}</h3>
                          {concept.subTitle && <p className={`text-lg italic ${index % 2 === 0 ? 'text-gray-600' : 'text-gray-300'}`}>{concept.subTitle}</p>}
                      </div>
                      {/* DELETE BUTTON */}
                      <SketchButton 
                          onClick={() => onDeleteConcept(concept.id)}
                          variant={index % 2 === 0 ? 'inverted' : 'default'}
                          className="text-xs !py-1 !px-2 ml-4 flex-shrink-0"
                      >
                          Delete
                      </SketchButton>
                  </div>
                  
                  <hr className={`my-2 border-dashed ${index % 2 === 0 ? 'border-gray-400' : 'border-gray-600'}`} />
                  <p className={`mt-2 whitespace-pre-wrap ${index % 2 === 0 ? 'text-gray-700' : 'text-gray-200'}`}>
                     {concept.content}
                  </p>
               </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CMSPage;

