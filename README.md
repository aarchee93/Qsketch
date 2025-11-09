# ⚛️ Qubit Sketchpad

**Qubit Sketchpad** is an interactive, browser-based quantum computing simulator and puzzle game, inspired by Google's Quantum AI Qubit Game. It allows users to visually manipulate 2-qubit state vectors, understand core quantum concepts (superposition, entanglement, collapse), and even manage their own educational content via a built-in CMS.

---

## ✨ Features

* **2-Qubit Free Simulator:** Apply fundamental quantum gates (Hadamard, Pauli-X, CNOT) to a two-qubit system starting at the $|00\rangle$ state.
* **Probabilistic Measurement:** Use the "Measure" function to observe **wavefunction collapse**, demonstrating the probabilistic nature of quantum mechanics.
* **Quantum Puzzle Solver:** Test your knowledge by solving levels that require reaching a specific target state within a limited number of moves.
* **📚 Built-in CMS (Concept Editor):** Add, view, and delete your own quantum concepts and notes, saved locally in your browser's storage.
* **Resource Library:** A curated list of external links for further learning.
* **Interactive UI:** A responsive, "doodley" aesthetic with audio feedback on button clicks.

---

## 🛠️ Technology Stack

* **Core:** The simulator logic is built on **JavaScript** using standard **Linear Algebra** (specifically 4x4 matrices for 2-qubit systems).
* **Frontend:** **React** (with Hooks: `useState`, `useCallback`, `useEffect`)
* **Styling:** **Tailwind CSS** (for the quick, utility-first styling and "doodley" visual effects).
* **Persistence:** **Browser `localStorage`** is used to save custom concepts added via the CMS.

---

## 🚀 Getting Started (Local Setup)

To run this project on your local machine, follow these steps:

### Prerequisites

You need **Node.js** and **npm** (or yarn) installed on your system.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/aarchee93/Qsketch.git](https://github.com/aarchee93/Qsketch.git)
    cd Qsketch
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Run the application:**
    ```bash
    npm start
    # or
    # yarn start
    ```

The application will open automatically in your browser, usually at `http://localhost:3000`.

---

## 🚪 Quantum Gates Implemented

The simulator and game utilize 4x4 matrices operating on a 4-element state vector $[\alpha_{00}, \alpha_{01}, \alpha_{10}, \alpha_{11}]^T$.

| Gate | Description | Matrix Notation |
| :--- | :--- | :--- |
| **Hadamard ($\mathbf{H_0}, \mathbf{H_1}$)** | Creates superposition on Qubit 0 or Qubit 1. | $\mathbf{H} \otimes \mathbf{I}$ or $\mathbf{I} \otimes \mathbf{H}$ |
| **Pauli-X ($\mathbf{X_0}, \mathbf{X_1}$)** | Flips the state (NOT gate) on Qubit 0 or Qubit 1. | $\mathbf{X} \otimes \mathbf{I}$ or $\mathbf{I} \otimes \mathbf{X}$ |
| **CNOT** | Controlled-NOT (Control Qubit 0, Target Qubit 1). Key for entanglement. | $\mathbf{CNOT}_{01}$ |

---

## 👤 Credits

* **Developer:** Aarchee 
* **Inspiration:** Google Quantum AI's Qubit Game.
