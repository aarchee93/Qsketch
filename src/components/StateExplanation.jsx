const StateExplanation = ({ stateVector }) => {

    const probabilities = stateVector.map(value =>
        Math.round(value * value * 100)
    );

    const labels = ["|00⟩", "|01⟩", "|10⟩", "|11⟩"];

    const activeStates = probabilities
        .map((p, i) => ({ p, label: labels[i] }))
        .filter(state => state.p > 0);

    return (
        <div className="mt-6 border-2 border-black rounded-lg p-5 bg-white shadow-lg">

            <h3 className="text-2xl font-extrabold mb-4">
                Current Quantum State
            </h3>

            <div className="space-y-2">

                {activeStates.map((state) => (

                    <div key={state.label} className="flex justify-between">

                        <span>{state.label}</span>

                        <span>{state.p}%</span>

                    </div>

                ))}

            </div>

            <hr className="my-4 border-dashed border-black"/>

            <p className="text-black">

                The probability graph shows the likelihood of measuring each quantum state.

            </p>

        </div>
    );

};

export default StateExplanation;