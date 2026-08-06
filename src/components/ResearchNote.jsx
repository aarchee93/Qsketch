/**
 * Notebook-styled "Research Note" callout — the handwritten-margin-note
 * feel referenced throughout the app's lab/notebook aesthetic.
 * Usage: <ResearchNote>Applying H twice returns the qubit to its original basis.</ResearchNote>
 */
const ResearchNote = ({ children, className = '' }) => (
  <div
    className={`relative my-6 p-4 pl-5 border-2 border-black bg-white rounded-lg shadow-[3px_3px_0_0_#000000] -rotate-1 ${className}`}
  >
    <span
      className="absolute -top-3 left-4 bg-white px-2 text-sm font-extrabold font-handwritten"
      aria-hidden="true"
    >
      📝 Research Note
    </span>
    <p className="font-handwritten text-lg leading-snug pt-1">{children}</p>
  </div>
);

export default ResearchNote;
