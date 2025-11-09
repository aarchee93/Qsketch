// Circuit History Display Component
const CircuitDisplay = ({ circuit }) => (
  <div className="mt-6 p-4 border-2 border-black bg-white rounded-lg min-h-[100px] shadow-inner">
    <h3 className="text-xl font-extrabold mb-3">Circuit History</h3>
    <div className="flex flex-wrap gap-2 min-h-[40px]">
      {circuit.length === 0 ? (
        <p className="text-gray-500 italic">Start by applying a gate!</p>
      ) : (
        circuit.map((gate, index) => (
          <span key={index} className="px-3 py-1 bg-black text-white rounded-full text-sm font-mono shadow-md">
            {gate}
          </span>
        ))
      )}
    </div>
  </div>
);

export default CircuitDisplay;

