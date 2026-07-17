export const LEARNING_CONTENT = {
  learn: [
    {
      id: 1,
      title: "What is a Qubit?",
      difficulty: "Beginner",
      readTime: "3 min",
      description: "Understand how a qubit differs from a classical bit and why it is the foundation of quantum computing."
    },
    {
      id: 2,
      title: "Superposition",
      difficulty: "Beginner",
      readTime: "5 min",
      description: "Learn how a qubit can exist in multiple states simultaneously and how measurement changes it."
    },
    {
      id: 3,
      title: "Quantum Gates",
      difficulty: "Intermediate",
      readTime: "6 min",
      description: "Explore Hadamard, Pauli-X and CNOT gates and understand how they manipulate quantum states."
    },
    {
      id: 4,
      title: "Entanglement & the CNOT Gate",
      difficulty: "Beginner",
      readTime: "5 min",
      description: "Explore how the CNOT gate wires two separate qubits into a single shared system. Learn how this creates interconnected states where changing one instantly dictates the outcome of the other, just like in our Bell State puzzles."
    },
    {
      id: 5,
      title: "Measurement & State Collapse",
      difficulty: "Beginner",
      readTime: "4 min",
      description: "Discover what happens behind the scenes when you hit the measure tool in the simulator. See how fuzzy quantum probabilities instantly lock into a definite 0 or 1 choice, wiping away the superposition state."
    },
    {
      id: 6,
      title: "Reading Quantum Circuit Diagrams",
      difficulty: "Intermediate",
      readTime: "5 min",
      description: "Master the visual language of horizontal grid lines, gate boxes, and target dots used in our app. Learn how operations sequence chronologically from left to right to build complex quantum programs."
    },
    {
      id: 7,
      title: "Interference & Negative Amplitudes",
      difficulty: "Intermediate",
      readTime: "6 min",
      description: "Dive into how real-valued amplitudes can have positive or negative signs that cancel each other out in the simulator. See how paths add together to enhance or completely erase the probability of measuring a state."
    },
    {
      id: 8,
      title: "The Bloch Sphere",
      difficulty: "Advanced",
      readTime: "7 min",
      description: "Look past our simulator's flat, real-valued amplitudes into the true 3D visual mapping of a qubit. Understand how complex numbers introduce continuous phase shifts and 3D rotations that go beyond our app's scope."
    },
    {
      id: 9,
      title: "Introduction to Quantum Algorithms",
      difficulty: "Advanced",
      readTime: "8 min",
      description: "Step beyond our 2-qubit setup to see how algorithms like Grover's Search and Deutsch-Jozsa perform computational speedups. Learn how scaling up quantum logic scales problem-solving power exponentially."
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

export const BASIC_TERMS = [
  { id: 1, term: "Qubit", definition: "The basic unit of quantum information; can represent 0, 1, or a superposition of both." },
  { id: 2, term: "Quantum State", definition: "A complete description of a qubit's condition, written as a vector of amplitudes." },
  { id: 3, term: "Ket Notation", definition: "The |0⟩ / |1⟩ style of writing quantum states, borrowed from Dirac notation." },
  { id: 4, term: "Superposition", definition: "A state that is a combination of |0⟩ and |1⟩ until measured." },
  { id: 5, term: "Entanglement", definition: "A correlation between qubits where measuring one instantly affects the other." },
  { id: 6, term: "Hadamard", definition: "A gate that puts a qubit into an equal superposition of |0⟩ and |1⟩." },
  { id: 7, term: "CNOT", definition: "A two-qubit gate that flips a target qubit only if the control qubit is |1⟩." },
  { id: 8, term: "Measurement", definition: "The act of observing a qubit, collapsing it into a single classical value." },
  { id: 9, term: "Bloch Sphere", definition: "A 3D sphere used to visualize a single qubit's state as a point on its surface." },
];

export const GATE_TO_LESSON_ID = {
  H0: 2,
  H1: 2,
  X0: 3,
  X1: 3,
  CNOT: 4,
};

// Extracts a YouTube video ID from a standard watch URL, for thumbnail display
export const getYouTubeId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
};

// Tailwind classes per difficulty level, used for badge coloring across all tabs
export const DIFFICULTY_STYLES = {
  Beginner: "bg-green-50 border-green-700 text-green-800",
  Intermediate: "bg-amber-50 border-amber-700 text-amber-800",
  Advanced: "bg-rose-50 border-rose-700 text-rose-800",
  "All Levels": "bg-gray-100 border-gray-600 text-gray-700",
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