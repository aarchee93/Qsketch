export const LEARNING_CONTENT = {
  learn: [
    {
      id: 1,
      title: "What is a Qubit?",
      difficulty: "Beginner",
      readTime: "3 min",
      description: "Understand how a qubit differs from a classical bit and why it is the foundation of quantum computing.",
      story: "Imagine an old-fashioned light switch that can only be fully off or fully on — that's a classical bit. Now imagine a dimmer switch, spinning freely, capable of resting anywhere between off and on until the moment someone glances at it — and the instant they do, it snaps to one setting or the other. That in-between spinning is the strange life of a qubit.",
      explanation: "A classical bit is always definitely 0 or definitely 1. A qubit can be in a combination of both — described by two numbers (amplitudes) whose squares give the probability of measuring 0 or 1. Until it's measured, both possibilities are 'live' at once.",
      technicalDetails: "A qubit's state is a vector [α, β] where α² + β² = 1. α² is the probability of measuring |0⟩, β² is the probability of measuring |1⟩. In this simulator, two qubits combine into a 4-entry vector over the basis |00⟩, |01⟩, |10⟩, |11⟩.",
      realWorldApplications: "IBM, Google, and IonQ all build physical qubits from different hardware — superconducting circuits, trapped ions, and photons — but they all obey this same superposition math.",
      researchNote: "A qubit isn't 'a bit that is both 0 and 1' — it's a bit whose future measurement outcome is genuinely undetermined until observed.",
    },
    {
      id: 2,
      title: "Superposition",
      difficulty: "Beginner",
      readTime: "5 min",
      description: "Learn how a qubit can exist in multiple states simultaneously and how measurement changes it.",
      story: "Imagine spinning a coin on a table instead of flipping it. While it's spinning, it isn't heads or tails — it's genuinely both, blurred together. The moment you slap your hand down on it, the spin stops and you get one definite answer. Applying a Hadamard gate is like starting that spin; measuring is like slapping your hand down.",
      explanation: "Superposition means a qubit's state is a weighted combination of |0⟩ and |1⟩ rather than one or the other. The Hadamard (H) gate is the standard tool for creating an equal, 50/50 superposition from a definite state.",
      technicalDetails: "H sends |0⟩ → (|0⟩ + |1⟩)/√2 and |1⟩ → (|0⟩ − |1⟩)/√2. Squaring either amplitude (1/√2)² gives exactly 0.5 — a 50% chance of each outcome, which is exactly what the probability graph shows after applying H0 or H1 in the simulator.",
      realWorldApplications: "Superposition is what lets quantum computers explore many possible answers to a problem at once, instead of one at a time like a classical computer.",
      researchNote: "Applying H twice returns the qubit to its original basis state — the two 50/50 spreads interfere and cancel back to a definite value.",
    },
    {
      id: 3,
      title: "Quantum Gates",
      difficulty: "Intermediate",
      readTime: "6 min",
      description: "Explore Hadamard, Pauli-X and CNOT gates and understand how they manipulate quantum states.",
      story: "Think of gates as tools on a workbench. Pauli-X is a simple lever that flips a switch. Hadamard is that spinning-coin trick. CNOT is a linked pair of switches, where flipping one only flips the other if the first one is already 'on'. Every experiment in the simulator is just these three tools, used in different orders.",
      explanation: "A quantum gate is a reversible operation that transforms a qubit's amplitudes. Pauli-X flips |0⟩ and |1⟩ like a classical NOT gate. Hadamard creates superposition. CNOT links two qubits so one's value can flip the other's.",
      technicalDetails: "Each gate is represented as a matrix that multiplies the current state vector. For a 2-qubit system, single-qubit gates are built with the tensor product against the Identity matrix (e.g. X0 = X ⊗ I) so they only affect their target qubit.",
      realWorldApplications: "Real quantum hardware implements these same logical gates using microwave pulses (superconducting qubits) or laser pulses (trapped ions) — the matrix math is identical to what runs in this simulator.",
      researchNote: "Unlike most classical logic gates, quantum gates must be reversible — you can always run them backward to recover the original state.",
    },
    {
      id: 4,
      title: "Entanglement & the CNOT Gate",
      difficulty: "Beginner",
      readTime: "5 min",
      description: "Explore how the CNOT gate wires two separate qubits into a single shared system. Learn how this creates interconnected states where changing one instantly dictates the outcome of the other, just like in our Bell State puzzles.",
      story: "Imagine two coins that, no matter how far apart you carry them, always land the same way when flipped — always both heads, or always both tails, never mixed. Neither coin 'decided' in advance; the link only becomes real the instant one of them is observed. That's entanglement.",
      explanation: "Entanglement is a correlation between qubits so strong that they can no longer be described independently. The CNOT gate, applied to a qubit already in superposition, is the standard way to create it — producing a Bell state like (|00⟩ + |11⟩)/√2.",
      technicalDetails: "CNOT flips the target qubit only when the control qubit is |1⟩. Applying H0 then CNOT to |00⟩ produces (|00⟩ + |11⟩)/√2 — measuring either qubit instantly tells you the other's value, even though each qubit's individual probability still looks like a coin flip.",
      realWorldApplications: "Entanglement underlies quantum teleportation protocols, quantum key distribution for secure communication, and error-correction schemes used in today's quantum hardware.",
      researchNote: "Entangled qubits are correlated, not communicating — no information travels faster than light when one is measured.",
    },
    {
      id: 5,
      title: "Measurement & State Collapse",
      difficulty: "Beginner",
      readTime: "4 min",
      description: "Discover what happens behind the scenes when you hit the measure tool in the simulator. See how fuzzy quantum probabilities instantly lock into a definite 0 or 1 choice, wiping away the superposition state.",
      story: "Picture a fog of possibilities hovering over the circuit. The instant you 'observe' it — hit measure — the fog instantly condenses into a single raindrop landing in one spot. You can't rewind and see where else it might have landed; that experiment is over.",
      explanation: "Before measurement, a qubit's state is a mix of possibilities. Measurement forces it to 'choose' one classical outcome, with a likelihood set by the squared amplitude of each basis state. After that, the superposition is gone.",
      technicalDetails: "The probability of each basis state is |amplitude|². The simulator picks an outcome weighted by these probabilities, then updates the state vector to have 100% probability on that single outcome — this is the 'collapse'.",
      realWorldApplications: "Measurement is the step that turns a quantum computation into a classical, readable answer — every quantum algorithm ends with a measurement step to extract a result.",
      researchNote: "Measurement is probabilistic but not random noise — the probabilities are fixed exactly by the state's amplitudes, and repeating the same experiment many times reproduces those odds precisely.",
    },
    {
      id: 6,
      title: "Reading Quantum Circuit Diagrams",
      difficulty: "Intermediate",
      readTime: "5 min",
      description: "Master the visual language of horizontal grid lines, gate boxes, and target dots used in our app. Learn how operations sequence chronologically from left to right to build complex quantum programs.",
      story: "A circuit diagram is like sheet music for qubits — each horizontal line is a 'wire' carrying one qubit through time, and every box or symbol you see is an instruction to play as you read left to right.",
      explanation: "Each horizontal wire represents one qubit's journey through the circuit. Gates are drawn as boxes (or symbols) placed on the wire(s) they act on, in the order they're applied, reading left to right.",
      technicalDetails: "In this simulator's diagram, Q0 and Q1 are the two wires. Single-qubit gates (H, X) appear as labeled boxes on one wire. CNOT is drawn as a filled control dot on the control wire connected by a vertical line to a ⊕ target symbol on the other wire.",
      realWorldApplications: "This same visual notation is used across the industry — IBM Quantum Composer, Qiskit, and academic papers all draw circuits the same way, so once you can read this simulator's diagram, you can read theirs too.",
      researchNote: "Circuit diagrams show sequence, not physical wires — the horizontal lines represent time flowing forward, not actual hardware connections.",
    },
    {
      id: 7,
      title: "Interference & Negative Amplitudes",
      difficulty: "Intermediate",
      readTime: "6 min",
      description: "Dive into how real-valued amplitudes can have positive or negative signs that cancel each other out in the simulator. See how paths add together to enhance or completely erase the probability of measuring a state.",
      story: "Think of two ripples spreading across a pond. Where two crests meet, the wave gets taller — constructive interference. Where a crest meets a trough, they cancel out flat — destructive interference. Quantum amplitudes ripple the same way, and quantum algorithms are engineered to make wrong answers cancel out like that flat spot.",
      explanation: "Amplitudes aren't just probabilities — they carry a sign (or, more generally, a phase) that can add together or cancel. This interference is what makes quantum computing more than 'trying every possibility at once' — it lets algorithms boost correct answers and suppress wrong ones.",
      technicalDetails: "In this simulator, the bar chart shows a minus badge on any basis state with a negative amplitude. Two paths reaching the same basis state with opposite signs will partially or fully cancel when added, even though each path's probability alone looked non-zero.",
      realWorldApplications: "Interference is the core mechanism behind speedups in algorithms like Grover's search and the Deutsch-Jozsa algorithm — they're carefully designed so wrong answers destructively interfere.",
      researchNote: "A negative amplitude does not mean a 'negative probability' — probabilities always come from squaring the amplitude, so they stay positive; the sign only matters when amplitudes combine.",
    },
    {
      id: 8,
      title: "The Bloch Sphere",
      difficulty: "Advanced",
      readTime: "7 min",
      description: "Look past our simulator's flat, real-valued amplitudes into the true 3D visual mapping of a qubit. Understand how complex numbers introduce continuous phase shifts and 3D rotations that go beyond our app's scope.",
      story: "Picture a globe where the North Pole is a definite |0⟩ and the South Pole is a definite |1⟩. Every other point on the sphere's surface is some valid superposition. This simulator only ever shows you points along one great circle of that globe — the real, no-complex-phase slice — but the full qubit picture is the entire sphere.",
      explanation: "The Bloch sphere is a 3D geometric picture of a single qubit's state, where any pure state corresponds to a point on the sphere's surface. Gates become rotations of that point around different axes.",
      technicalDetails: "A general qubit state is α|0⟩ + β|1⟩ where α and β are complex numbers. This simulator restricts amplitudes to real numbers (positive or negative), which corresponds to one great circle of the Bloch sphere rather than its full surface — complex phase adds the third dimension.",
      realWorldApplications: "Physicists and hardware engineers use Bloch sphere diagrams constantly to reason about pulse sequences and gate errors on real quantum devices.",
      researchNote: "Global phase (rotating the whole state by the same complex factor) moves a point nowhere on the Bloch sphere — it's mathematically present but has zero effect on any measurement.",
    },
    {
      id: 9,
      title: "Introduction to Quantum Algorithms",
      difficulty: "Advanced",
      readTime: "8 min",
      description: "Step beyond our 2-qubit setup to see how algorithms like Grover's Search and Deutsch-Jozsa perform computational speedups. Learn how scaling up quantum logic scales problem-solving power exponentially.",
      story: "This simulator's 2-qubit playground is a single page of a much bigger book. Real quantum algorithms stack dozens or hundreds of qubits and carefully sequenced gates so that superposition and interference do the heavy lifting — checking many possibilities at once, then letting the wrong ones cancel out.",
      explanation: "A quantum algorithm is a specific circuit — a sequence of gates — engineered to solve a problem faster than the best known classical method, using superposition to explore possibilities and interference to filter out wrong ones before measurement.",
      technicalDetails: "Two landmark examples: Grover's algorithm gives a quadratic speedup for unstructured search (√N steps instead of N). Shor's algorithm factors large numbers exponentially faster than known classical algorithms, threatening RSA-style encryption.",
      realWorldApplications: "These algorithms are the reason governments and companies are racing to build larger quantum computers — and why 'post-quantum cryptography' is already being deployed to prepare for Shor's algorithm at scale.",
      researchNote: "Adding one more qubit doubles the size of the state vector needed to describe the system — this exponential growth is both where quantum computing gets its power and why simulating large circuits classically is so hard.",
    }
  ],

  glossary: [
    { id: 1, term: "Qubit", definition: "The basic unit of quantum information; can represent 0, 1, or a superposition of both.", difficulty: "Beginner" },
    { id: 2, term: "Superposition", definition: "A qubit state that is a combination of |0⟩ and |1⟩ until measured.", difficulty: "Beginner" },
    { id: 3, term: "Entanglement", definition: "A correlation between qubits where measuring one instantly determines the other's state.", difficulty: "Intermediate" },
    { id: 4, term: "Bloch Sphere", definition: "A geometric way to visualize a single qubit's state as a point on a sphere.", difficulty: "Advanced" },
    { id: 10, term: "Pauli-X", definition: "A quantum gate that maps the state 0 to 1 and vice versa, acting as the quantum equivalent of a classical NOT bit-flip.", difficulty: "Beginner" },
    { id: 11, term: "Basis State", definition: "One of the fixed standard reference states, specifically state 0 or state 1, that forms the foundation of a qubit's computational space.", difficulty: "Beginner" },
    { id: 12, term: "Probability Amplitude", definition: "A real or complex number associated with a quantum state whose square determines the exact probability of measuring a specific outcome.", difficulty: "Beginner" },
    { id: 13, term: "Quantum Circuit", definition: "A visual model or sequence of quantum operations, wires, and gates designed to perform a specific quantum computational task.", difficulty: "Beginner" },
    { id: 14, term: "Qubit Register", definition: "A collection of multiple qubits treated as a single cohesive unit to store and manipulate quantum information simultaneously.", difficulty: "Beginner" },
    { id: 15, term: "Bit Flip", definition: "The process of changing a quantum state completely from 0 to 1 or 1 to 0, often implemented using a Pauli-X gate.", difficulty: "Beginner" },
    { id: 16, term: "Unitary Operation", definition: "A reversible mathematical operation or gate that alters a quantum state while keeping the total probability equal to exactly one.", difficulty: "Intermediate" },
    { id: 17, term: "Global Phase", definition: "An identical phase factor applied to all states in a superposition that changes the underlying mathematical expression but has no measurable effect on the final probabilities.", difficulty: "Intermediate" },
    { id: 18, term: "No-Cloning Theorem", definition: "A fundamental law of quantum mechanics stating that it is physically impossible to create an identical, independent copy of an arbitrary unknown quantum state.", difficulty: "Intermediate" },
    { id: 19, term: "Decoherence", definition: "The loss of quantum behavior and superposition due to an isolated system interacting and becoming entangled with its surrounding environment.", difficulty: "Intermediate" },
    { id: 20, term: "Bra-Ket Notation", definition: "The standard mathematical framework using angle brackets and vertical bars to represent quantum vectors and their inner products cleanly.", difficulty: "Intermediate" },
    { id: 21, term: "Density Matrix", definition: "An advanced mathematical matrix used to describe the statistical state of a quantum system, handling both pure quantum states and mixed classical probabilities.", difficulty: "Advanced" },
    { id: 22, term: "Quantum Error Correction", definition: "A suite of advanced protocols that protect fragile quantum information from environmental noise and decoherence by distributing one logical qubit across multiple physical qubits.", difficulty: "Advanced" },
    { id: 23, term: "Phase Gate", definition: "A type of quantum gate that rotates the phase of a qubit state without altering its measurement probabilities, requiring complex numbers to fully represent.", difficulty: "Advanced" },
    { id: 24, term: "Quantum Supremacy", definition: "The theoretical or experimental milestone where a programmable quantum device successfully solves a specific problem that is practically impossible for any classical supercomputer.", difficulty: "Advanced" }
  ],

  blogs: [
    { id: 1, title: "Google's Quantum AI Blog", difficulty: "All Levels", readTime: "Varies", description: "Updates and educational articles from Google Quantum AI.", url: "https://quantumai.google/blog" },
    { id: 4, title: "Microsoft Azure Quantum Blog", difficulty: "Intermediate", readTime: "Varies", description: "Covers corporate milestones, developer updates for quantum toolkits, and research breakthroughs in fault-tolerant, topological qubit development.", url: "https://azure.microsoft.com/en-us/blog/quantum/product/azure-quantum/" },
    { id: 5, title: "Scott Aaronson's Shtetl-Optimized", difficulty: "Advanced", readTime: "Varies", description: "A highly regarded, thought-provoking commentary blog focusing on computational complexity theory, quantum supremacy milestones, and the limits of quantum algorithms.", url: "https://scottaaronson.blog/" },
    { id: 6, title: "Quantinuum Blog", difficulty: "Intermediate", readTime: "Varies", description: "Provides commercial and scientific updates on trapped-ion quantum hardware developments, industrial applications, and quantum error correction software stacks.", url: "https://www.quantinuum.com/news/blog" },
    { id: 7, title: "Quantum Computing Report", difficulty: "Beginner", readTime: "Varies", description: "An accessible, comprehensive news hub tracking commercial developments, market players, hardware milestones, and industry trends across the global quantum ecosystem.", url: "https://quantumcomputingreport.com/news/" }
  ],

  papers: [
    { id: 1, title: "Qiskit Textbook", difficulty: "Intermediate", readTime: "Varies", description: "Comprehensive open-source textbook on quantum computing.", url: "https://qiskit.org/textbook/preface.html" },
    { id: 3, title: "From Cbits to Qbits: Teaching Computer Scientists Quantum Mechanics", difficulty: "Intermediate", readTime: "25 min", description: "A foundational pedagogical paper that strips away dense physics jargon to introduce quantum mechanics and quantum circuits strictly through linear algebra and vectors.", url: "https://arxiv.org/abs/quant-ph/0207118" },
    { id: 4, title: "Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer", difficulty: "Advanced", readTime: "60 min", description: "Peter Shor's revolutionary paper outlining the period-finding quantum algorithm that can efficiently break public-key cryptographic infrastructure like RSA.", url: "https://arxiv.org/abs/quant-ph/9508027" },
    { id: 5, title: "A fast quantum mechanical algorithm for database search", difficulty: "Advanced", readTime: "45 min", description: "Lov Grover's original publication introducing amplitude amplification to achieve a quadratic speedup when searching through unstructured data spaces.", url: "https://arxiv.org/abs/quant-ph/9605043" }
  ],

  videos: [
    { id: 2, title: "How Does a Quantum Computer Work?", difficulty: "Beginner", readTime: "7 min", description: "A highly intuitive, visual explanation of qubit mechanics, showing how superposition and interacting spins create massive computational workspaces.", url: "https://www.youtube.com/watch?v=g_IaVepNDT4" },
    { id: 3, title: "Hello World | Coding with Qiskit 1.x | Programming on Quantum Computers", difficulty: "Intermediate", readTime: "11 min", description: "A practical developer-centric guide focused on installing standard open-source tools and building a foundational two-qubit Bell state.", url: "https://www.youtube.com/watch?v=93-zLTppFZw" },
    { id: 4, title: "Quantum Computing for Computer Scientists", difficulty: "Intermediate", readTime: "132 min", description: "An in-depth, accessible presentation using matrices and vectors to unpack quantum gates, superposition, and the mechanics of basic algorithms without hand-wavy metaphors.", url: "https://www.youtube.com/watch?v=F_Riqjdh2oM" },
    { id: 5, title: "Lecture 24: Entanglement: QComputing, EPR, and Bell's Theorem", difficulty: "Advanced", readTime: "76 min", description: "An authentic MIT physics lecture introducing formal definitions of multi-qubit entanglement, the Deutsch-Jozsa algorithm, and the foundations of non-locality tests.", url: "https://www.youtube.com/watch?v=awpnsGl08bc" }
  ],
};

export const LEARNING_PATH = [
  { id: 1, title: "Bit", summary: "The basic unit of classical information — always exactly 0 or 1." },
  { id: 2, title: "Qubit", summary: "The quantum version of a bit — can be 0, 1, or a mix of both at once." },
  { id: 3, title: "Superposition", summary: "A qubit existing in a combination of states until it's measured." },
  { id: 4, title: "Quantum Gates", summary: "Operations like Hadamard and CNOT that transform a qubit's state." },
  { id: 5, title: "Entanglement", summary: "A strong correlation between qubits, even when measured separately." },
  { id: 6, title: "Measurement", summary: "Collapsing a superposition into one definite classical outcome." },
  { id: 7, title: "Algorithms", summary: "Chaining gates into circuits to solve problems faster than classically possible." },
];

// BASIC_TERMS was unused — removed (audit LOW #32)

export const GATE_TO_LESSON_ID = {
  H0: 2,
  H1: 2,
  X0: 3,
  X1: 3,
  CNOT: 4,
};

// Dummy video links per gate — swap for real recordings post-submission.
export const GATE_VIDEOS = {
  H0: "#",
  H1: "#",
  X0: "#",
  X1: "#",
  CNOT: "#",
};

// Unified guided config — one source of truth for both the guide cards
// (GATE_GUIDED_CONFIG) and ResourcesPage lessons (LESSON_GUIDED_CONFIG).
// Each config now also carries a `steps` array for the GuidedStepper
// component, which walks the user through the experiment one action at a time.
export const GATE_GUIDED_CONFIG = {
  H0: {
    allowedGates: ["H0"],
    instruction: "Click Hadamard (Q0) to create superposition.",
    steps: [
      {
        instruction: "Click 'Hadamard (Q0)' in the gate panel on the left.",
        expectAction: "H0",
        observation: "Q0 is in superposition — the bars show 50% for |00⟩ and 50% for |10⟩.",
      },
    ],
  },
  H1: {
    allowedGates: ["H1"],
    instruction: "Click Hadamard (Q1) to create superposition.",
    steps: [
      {
        instruction: "Click 'Hadamard (Q1)' to put Q1 into superposition.",
        expectAction: "H1",
        observation: "Q1 is in superposition — equal probability of |00⟩ and |01⟩.",
      },
    ],
  },
  X0: {
    allowedGates: ["X0"],
    instruction: "Click Pauli-X (Q0) to flip the qubit.",
    steps: [
      {
        instruction: "Click 'Pauli-X (Q0)' to flip Q0 from |0⟩ to |1⟩.",
        expectAction: "X0",
        observation: "Q0 flipped — the bar moved from |00⟩ to |10⟩.",
      },
    ],
  },
  X1: {
    allowedGates: ["X1"],
    instruction: "Click Pauli-X (Q1) to flip the qubit.",
    steps: [
      {
        instruction: "Click 'Pauli-X (Q1)' to flip Q1.",
        expectAction: "X1",
        observation: "Q1 flipped — the bar moved from |00⟩ to |01⟩.",
      },
    ],
  },
  CNOT: {
    allowedGates: ["H0", "CNOT"],
    instruction: "Click Hadamard (Q0), then CNOT, to entangle both qubits.",
    steps: [
      {
        instruction: "Step 1 — Click 'Hadamard (Q0)' to put Q0 into superposition.",
        expectAction: "H0",
        observation: "Q0 is in superposition. Now the circuit is ready for entanglement.",
      },
      {
        instruction: "Step 2 — Click 'CNOT (Q0 → Q1)' to entangle both qubits.",
        expectAction: "CNOT",
        observation: "The qubits are entangled! Only |00⟩ and |11⟩ have probability — they are perfectly correlated.",
      },
    ],
  },
};

export const LESSON_GUIDED_CONFIG = {
  2: GATE_GUIDED_CONFIG.H0,
  3: { allowedGates: ["H0","X0"], instruction: "Try Hadamard, then Pauli-X, and compare the results." },
  4: GATE_GUIDED_CONFIG.CNOT,
};

// Extracts a YouTube video ID from a standard watch URL, for thumbnail display
export const getYouTubeId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
};

// Tailwind classes per difficulty level — B&W sketch style, no colour
export const DIFFICULTY_STYLES = {
  Beginner:     "bg-white border-black text-black",
  Intermediate: "bg-white border-black text-black font-extrabold",
  Advanced:     "bg-black border-black text-white",
  "All Levels": "bg-white border-black text-black",
};

export const PATH_TO_LESSON_ID = {
  1: 1, // Bit -> What is a Qubit?
  2: 1, // Qubit -> What is a Qubit?
  3: 2, // Superposition -> Superposition
  4: 3, // Quantum Gates -> Quantum Gates
  5: 4, // Entanglement -> Entanglement & the CNOT Gate
  6: 5, // Measurement -> Measurement & State Collapse
  7: 9, // Algorithms -> Introduction to Quantum Algorithms
};