const CircuitDisplay = ({ circuit, title = "Circuit History", emptyMessage = "Start by applying a gate!" }) => (
  <div className="mt-6 p-4 border-2 border-black bg-white rounded-lg min-h-[100px] shadow-inner">
    <h3 className="text-xl font-extrabold mb-3">{title}</h3>
    <div className="flex flex-wrap gap-2 min-h-[40px]">
      {circuit.length === 0 ? (
        <p className="text-black italic">{emptyMessage}</p>
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