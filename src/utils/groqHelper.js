// Groq API helper for Q-Bot responses

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const classifyQuestion = (question) => {
  const learningKeywords = ['what is', 'explain', 'how does', 'why', 'superposition', 'entanglement', 'qubit', 'measurement', 'gate', 'pauli', 'hadamard'];
  const circuitKeywords = ['state', 'gate', 'circuit', 'measurement', 'qubit', 'result', 'apply', 'current', 'my circuit'];
  
  const lowerQ = question.toLowerCase();
  
  if (learningKeywords.some(kw => lowerQ.includes(kw))) return 'learning';
  if (circuitKeywords.some(kw => lowerQ.includes(kw))) return 'circuit';
  return 'general';
};

export const buildPrompt = (question, contextData, type) => {
  let prompt = `You are Q-Bot, a friendly quantum computing buddy. You chat like a real person - casual, short, and helpful. NO fancy formatting, NO LaTeX, NO code blocks. Just simple chat.
Keep it super casual and brief (1-2 sentences max). Use emoji sometimes. Talk like you're texting a friend.`;

  // Add context about current page
  if (contextData?.page === 'simulator') {
    if (contextData.currentState) prompt += `\n\nTheir state right now: ${contextData.currentState}`;
    if (contextData.circuitGates?.length > 0) prompt += `\nGates they've used: ${contextData.circuitGates.join(', ')}`;
    if (contextData.measurementResult !== undefined) prompt += `\nLast measurement: ${contextData.measurementResult}`;
  } else if (contextData?.page === 'game') {
    if (contextData.gameLevel) prompt += `\n\nGame level: ${contextData.gameLevel}`;
    if (contextData.gameStatus) prompt += `\nGame status: ${contextData.gameStatus}`;
  }

  prompt += `\n\nThey asked: "${question}"`;
  prompt += `\n\nRespond like you're chatting with them. Keep it SHORT and CASUAL. No paragraphs. No fancy text.`;

  return prompt;
};

export const getGroqResponse = async (prompt) => {
  if (!GROQ_API_KEY) {
    return "Sorry, I need an API key to respond. Please set VITE_GROQ_API_KEY in your .env file.";
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error Status:', response.status);
      console.error('Groq API Error Body:', errorText);
      return "Sorry, I encountered an error. Please try again.";
    }

    const data = await response.json();
    return data.choices[0].message.content || "I couldn't generate a response. Try again!";
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return "Sorry, I'm having trouble connecting. Please try again.";
  }
};

// Predefined learning answers for common questions
export const learningAnswers = {
  superposition: "A qubit can be 0 and 1 at the same time! 🤯 That's superposition. The Hadamard gate creates it.",
  entanglement: "When two qubits get entangled, measuring one instantly affects the other. CNOT gates do this! 🔗",
  hadamard: "Hadamard creates superposition. It flips |0⟩ to (|0⟩+|1⟩)/√2 and |1⟩ to (|0⟩-|1⟩)/√2. Pretty cool!",
  paulix: "X gate is the NOT gate - it flips 0 to 1 and 1 to 0. Simple as that.",
  cnot: "CNOT is a 2-qubit gate. It flips the target if the control is 1. Great for entanglement!",
  measurement: "Measure to collapse the superposition to 0 or 1. After measuring, the state is no longer superposed.",
  qubit: "A qubit is like a bit but quantum - it can be 0, 1, or both at once! That's the magic ✨"
};

export const getQuickAnswer = (question) => {
  const lowerQ = question.toLowerCase();
  
  for (const [key, answer] of Object.entries(learningAnswers)) {
    if (lowerQ.includes(key)) {
      return answer;
    }
  }
  
  return null; // No quick answer found
};
