import SketchButton from '../components/SketchButton';
import ConceptEditor from '../components/ConceptEditor';
import { PAGES } from '../constants/pages';
import { useState } from 'react';

const COLOR_MAP = {
    'yellow-50': 'bg-yellow-50',
    'blue-50': 'bg-blue-50',
    'purple-50': 'bg-purple-50',
    'green-50': 'bg-green-50',
    'red-50': 'bg-red-50',
    'orange-50': 'bg-orange-50',
    'white': 'bg-white',
};

// Renders **bold** markers as actual bold text
const renderFormattedText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
            ? <strong key={i}>{part.slice(2, -2)}</strong>
            : part
    );
};

const CMSPage = ({ setPage, concepts, onAddConcept, onDeleteConcept }) => {
  const [query, setQuery] = useState('');

  const filteredConcepts = query.trim()
    ? concepts.filter((c) =>
        c.title.toLowerCase().includes(query.trim().toLowerCase()) ||
        (c.subTitle || '').toLowerCase().includes(query.trim().toLowerCase())
      )
    : concepts;

  return (
    <div className="p-4 md:p-8">
      <SketchButton className="mb-8" onClick={() => setPage(PAGES.LANDING)}>
        &larr; Back to Home
      </SketchButton>
      
      <h2 className="text-3xl font-extrabold text-center border-b-4 border-double border-black pb-4 mb-8">Concept Editor & Library</h2>
      
      <div className="max-w-3xl mx-auto">
        
        {/* RENDER THE EDITOR INTERFACE */}
        <ConceptEditor
    onSave={onAddConcept}
    existingConcepts={concepts}
        />
        
        {/* RENDER DYNAMIC CONTENT */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-2xl font-extrabold">
                Research Library <span className="font-normal text-lg">({concepts.length})</span>
            </h3>
            {concepts.length > 0 && (
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search concepts..."
                    aria-label="Search concepts"
                    className="p-2 border-2 border-black rounded shadow-md bg-white text-black text-sm"
                />
            )}
        </div>
        <div className="space-y-10">

    {filteredConcepts.length === 0 ? (

        <div className="border-2 border-dashed border-black rounded-lg p-8 text-center">
            <h4 className="text-xl font-bold mb-2">
                {concepts.length === 0 ? "No concepts in your research library." : "No matches found."}
            </h4>
            <p className="text-black">
                {concepts.length === 0
                    ? "Add your first quantum concept to begin."
                    : `No concepts match "${query}".`}
            </p>
        </div>

    ) : (

        filteredConcepts.map((concept, index) => (
            <div
                key={concept.id}
                className={`p-5 border-4 border-black rounded-lg ${COLOR_MAP[concept.color] || 'bg-white'} shadow-[8px_8px_0_0_#000000] animate-bounce-in`}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold">
                            {concept.title}
                        </h3>

                        {concept.subTitle && (
                            <p className="text-lg italic text-black">
                                {concept.subTitle}
                            </p>
                        )}
                    </div>

                    <SketchButton
                        onClick={() => onDeleteConcept(concept.id)}
                        variant="inverted"
                        className="text-xs !py-1 !px-2 ml-4 flex-shrink-0"
                        aria-label={`Delete concept: ${concept.title}`}
                    >
                        Delete
                    </SketchButton>
                </div>

                <hr className="my-2 border-dashed border-black" />

                <p className="mt-2 whitespace-pre-wrap text-black">
                    {renderFormattedText(concept.content)}
                </p>
            </div>
        ))

    )}

</div>
      </div>
    </div>
  );
};

export default CMSPage;

