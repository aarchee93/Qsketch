import { useState } from 'react';
import SketchButton from './SketchButton';

// Concept Editor Component (The CMS Interface)
const ConceptEditor = ({ onSave }) => {
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !content) return;

        // No color needed in black/white theme, just use alternating pattern
        onSave({ title, subTitle, content, color: 'white' });

        // Reset form
        setTitle('');
        setSubTitle('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 border-4 border-dashed border-black rounded-xl bg-white mb-10 shadow-inner">
            <h3 className="text-2xl font-extrabold mb-4 border-b-2 border-black pb-2 text-center">🧠 Add New Concept (CMS Interface)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input 
                    type="text" 
                    placeholder="Title (e.g., 7. Phase Gate)" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-2 border-2 border-black rounded shadow-md bg-white text-black"
                    required
                />
                <input 
                    type="text" 
                    placeholder="Subtitle (Optional)" 
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    className="p-2 border-2 border-black rounded shadow-md bg-white text-black"
                />
            </div>
            
            <textarea
                placeholder="Detailed Explanation..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
                className="w-full p-2 border-2 border-black rounded shadow-md mb-4 bg-white text-black"
                required
            />
            
            <div className="flex items-center justify-end">
                <SketchButton type="submit" variant="inverted">
                    Save Concept to Database
                </SketchButton>
            </div>
        </form>
    );
};

export default ConceptEditor;

