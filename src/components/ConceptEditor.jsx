import { useState, useEffect } from 'react';
import SketchButton from './SketchButton';
import { validateStringInput } from '../utils/validationUtils';
import {
    TITLE_MAX_LENGTH,
    CONTENT_MAX_LENGTH
} from "../constants/defaultValues";

const CONCEPT_COLORS = [
    { value: 'white', swatch: 'bg-white' },
    { value: 'yellow-50', swatch: 'bg-yellow-50' },
    { value: 'blue-50', swatch: 'bg-blue-50' },
    { value: 'purple-50', swatch: 'bg-purple-50' },
    { value: 'green-50', swatch: 'bg-green-50' },
    { value: 'red-50', swatch: 'bg-red-50' },
    { value: 'orange-50', swatch: 'bg-orange-50' },
];

// Concept Editor Component (The CMS Interface)
const ConceptEditor = ({ onSave, existingConcepts = [] }) => {
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [color, setColor] = useState('white');

useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
    }, 3000);

    return () => clearTimeout(timer);
}, [message]);

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            if (isSaving) return;

            setIsSaving(true);

            // Validate title
            const titleValidation = validateStringInput(title, TITLE_MAX_LENGTH);
            if (!titleValidation.valid) {
                setMessage(titleValidation.error);
                setMessageType("error");
                setIsSaving(false);
                return;
            }

            // Validate subtitle (optional)
            const subtitleValidation = validateStringInput(subTitle || '', TITLE_MAX_LENGTH);
            const cleanSubtitle = subTitle ? subtitleValidation.cleaned : '';

            // Validate content
            const contentValidation = validateStringInput(content, CONTENT_MAX_LENGTH);
            if (!contentValidation.valid) {
                setMessage(contentValidation.error);
                setMessageType("error");
                setIsSaving(false);
                return;
            }

            const cleanTitle = titleValidation.cleaned;
            const cleanContent = contentValidation.cleaned;

            // Check for duplicates
            const duplicate = existingConcepts.some(
                concept => concept.title.trim().toLowerCase() === cleanTitle.toLowerCase()
            );

            if (duplicate) {
                setMessage("A concept with this title already exists.");
                setMessageType("error");
                setIsSaving(false);
                return;
            }

            // All validations passed
            onSave({
                title: cleanTitle,
                subTitle: cleanSubtitle,
                content: cleanContent,
                color
            });

            setTitle("");
            setSubTitle("");
            setContent("");
            setColor("white");
            setMessage("Concept saved successfully.");
            setMessageType("success");
            setIsSaving(false);
        } catch (error) {
            console.error('Error saving concept:', error);
            setMessage("An error occurred while saving. Please try again.");
            setMessageType("error");
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 border-4 border-dashed border-black rounded-xl bg-white mb-10 shadow-inner">
            <h3 className="text-2xl font-extrabold mb-4 border-b-2 border-black pb-2 text-center">🧠 Add New Concept (CMS Interface)</h3>
            {message && (
    <div
        className={`mb-4 p-3 rounded border-2 text-sm font-medium ${
            messageType === "success"
                ? "border-black bg-white text-black"
                : "border-black bg-gray-200 text-black"
        }`}
    >
        {message}
    </div>
)}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="concept-title" className="block text-sm font-bold mb-1">
                        Title
                    </label>
                    <input
                        id="concept-title"
                        type="text"
                        placeholder="e.g., 7. Phase Gate"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setMessage("");
                        }}
                        className="w-full p-2 border-2 border-black rounded shadow-[4px_4px_0_0_#000000] bg-white text-black"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="concept-subtitle" className="block text-sm font-bold mb-1">
                        Subtitle <span className="font-normal">(optional)</span>
                    </label>
                    <input
                        id="concept-subtitle"
                        type="text"
                        placeholder="Optional"
                        value={subTitle}
                        onChange={(e) => {
                            setSubTitle(e.target.value);
                            setMessage("");
                        }}
                        className="w-full p-2 border-2 border-black rounded shadow-[4px_4px_0_0_#000000] bg-white text-black"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="concept-content" className="block text-sm font-bold mb-1">
                    Detailed Explanation
                </label>
                <textarea
                    id="concept-content"
                    placeholder="Explain the concept..."
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        setMessage("");
                    }}
                    rows="4"
                    className="w-full p-2 border-2 border-black rounded shadow-[4px_4px_0_0_#000000] bg-white text-black"
                    required
                />
            </div>

            <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-bold mr-1">Color:</span>
                {CONCEPT_COLORS.map((c) => (
                    <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(c.value)}
                        aria-label={`Set concept color to ${c.value.replace('-50', '')}`}
                        aria-pressed={color === c.value}
                        className={`w-7 h-7 rounded-full border-2 border-black ${c.swatch} ${
                            color === c.value ? 'shadow-[3px_3px_0_0_#000000]' : ''
                        }`}
                    />
                ))}
            </div>
            
            <div className="flex items-center justify-end">
                <SketchButton
    type="submit"
    variant="inverted"
    disabled={isSaving}
>
                   {isSaving ? "Saving..." : "Save Concept"}
                </SketchButton>
            </div>
        </form>
    );
};

export default ConceptEditor;

