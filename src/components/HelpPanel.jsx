import { useState, useEffect, useRef } from 'react';
import { ACHIEVEMENTS } from '../constants/achievements';
import qbotLauncherPng from '../assets/qbot-launcher.png';
import qbotMascotPng from '../assets/qbot-mascot.png';
import iconStateInfo from '../assets/icon-state-info.svg';
import iconCircuitHelp from '../assets/icon-circuit-help.svg';
import iconConcepts from '../assets/icon-concepts.svg';
import iconAskMe from '../assets/icon-ask-me.svg';
import { classifyQuestion, buildPrompt, getGroqResponse, getQuickAnswer } from '../utils/groqHelper';

const HelpPanel = ({ 
  onTryInSimulator,
  currentPage = 'simulator',
  quantumState = '|00⟩',
  circuitGates = [],
  measurementResult = null,
  lastAction = null,
  gameLevel = null,
  gameStatus = null,
  challenge = null
}) => {
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'state', 'circuit', 'concepts', 'ask'
  const [messages, setMessages] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [mood, setMood] = useState('idle');
  const [loading, setLoading] = useState(false);
  const bubbleTimer = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // React to achievements
  useEffect(() => {
    const onAchievement = (e) => {
      const id = e.detail?.ids?.[0];
      const achievement = Object.values(ACHIEVEMENTS).find((a) => a.id === id);
      setMood('excited');
      clearTimeout(bubbleTimer.current);
      bubbleTimer.current = setTimeout(() => setMood('idle'), 3000);
    };

    window.addEventListener('qsketch:achievement', onAchievement);
    return () => {
      window.removeEventListener('qsketch:achievement', onAchievement);
      clearTimeout(bubbleTimer.current);
    };
  }, []);

  // Auto-focus input after messages change
  useEffect(() => {
    if (currentView !== 'menu' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, currentView]);

  const contextData = {
    page: currentPage,
    quantumState,
    circuitGates,
    measurementResult,
    lastAction,
    gameLevel,
    gameStatus,
    challenge
  };

  const close = () => {
    setOpen(false);
    setCurrentView('menu');
    setMessages([]);
    setUserQuestion('');
    setMood('idle');
  };

  const backToMenu = () => {
    setCurrentView('menu');
    setMessages([]);
    setUserQuestion('');
  };

  const openPanel = () => {
    setOpen(true);
    setCurrentView('menu');
    setMood('excited');
  };

  const addMessage = (type, text) => {
    setMessages(prev => [...prev, {
      type,
      text,
      id: prev.length,
      timestamp: new Date()
    }]);
  };

  const handleStateInfo = async () => {
    setCurrentView('state');
    setMood('excited');
    
    // Show initial message
    const gateNames = Array.isArray(circuitGates) 
      ? circuitGates.map(g => {
          if (!g) return null;
          return typeof g === 'string' ? g : (g.gate || null);
        }).filter(Boolean)
      : [];
    
    setMessages([
      { type: 'bot', text: 'Analyzing your quantum state...', id: 0 }
    ]);

    // Get AI explanation
    const question = `My current quantum state is ${quantumState}. ${gateNames.length > 0 ? `I've applied these gates: ${gateNames.join(', ')}.` : 'No gates applied yet.'} ${measurementResult !== null ? `My last measurement was: ${measurementResult}.` : ''} Please explain what this state means, what will happen if I measure, and what I can do next.`;
    const prompt = buildPrompt(question, contextData, 'state');
    
    setLoading(true);
    try {
      const response = await getGroqResponse(prompt);
      setMessages(prev => [...prev, { type: 'bot', text: response, id: prev.length }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, I encountered an error. Please try again.', id: prev.length }]);
    }
    setLoading(false);
  };



  const handleCircuitHelp = async () => {
    setCurrentView('circuit');
    setMessages([{ type: 'bot', text: 'Analyzing your circuit...', id: 0 }]);
    setMood('excited');
    
    const gateNames = Array.isArray(circuitGates)
      ? circuitGates.map(g => {
          if (!g) return null;
          return typeof g === 'string' ? g : (g.gate || null);
        }).filter(Boolean)
      : [];
    const question = `Explain my quantum circuit. I have these gates: ${gateNames.length > 0 ? gateNames.join(', ') : 'none yet'}. What do I need to understand?`;
    const prompt = buildPrompt(question, contextData, 'circuit');
    
    try {
      const response = await getGroqResponse(prompt);
      setMessages(prev => [...prev, { type: 'bot', text: response, id: prev.length }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, I encountered an error. Try again!', id: prev.length }]);
    }
    setLoading(false);
  };

  const handleConcepts = async () => {
    setCurrentView('concepts');
    setMessages([{ type: 'bot', text: 'Teaching mode activated...', id: 0 }]);
    setMood('excited');
    
    const question = currentPage === 'game' 
      ? `What quantum concepts should I learn for level ${gameLevel}?`
      : 'What are the key quantum computing concepts I should understand?';
    
    const prompt = buildPrompt(question, contextData, 'learning');
    
    try {
      const response = await getGroqResponse(prompt);
      setMessages(prev => [...prev, { type: 'bot', text: response, id: prev.length }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, I encountered an error. Try again!', id: prev.length }]);
    }
    setLoading(false);
  };

  const handleAskQuestion = async (e) => {
    e?.preventDefault();
    
    if (!userQuestion.trim() || loading) return;

    const question = userQuestion;
    setUserQuestion('');
    setCurrentView('ask');
    addMessage('user', question);
    setLoading(true);
    addMessage('bot', 'Thinking...');
    setMood('idle');

    try {
      const quickAnswer = getQuickAnswer(question);
      if (quickAnswer) {
        setMessages(prev => prev.slice(0, -1));
        addMessage('bot', quickAnswer);
        setMood('excited');
      } else {
        const type = classifyQuestion(question);
        const prompt = buildPrompt(question, contextData, type);
        const response = await getGroqResponse(prompt);
        setMessages(prev => prev.slice(0, -1));
        addMessage('bot', response);
        setMood('excited');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.slice(0, -1));
      addMessage('bot', 'Sorry, I encountered an error. Please try again.');
    }

    setLoading(false);
    setTimeout(() => setMood('idle'), 2000);
  };

  return (
    <>
      <style>{`
        /* Animations (same as before) */
        @keyframes mascot-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes mascot-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .mascot-floating { animation: mascot-float 3s ease-in-out infinite; }
        .mascot-bounce-hover:hover { animation: mascot-bounce 0.6s ease-in-out; }
        @keyframes chat-slide-up { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .chat-enter { animation: chat-slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes button-pop-in { 0% { transform: scale(0.8) translateY(10px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        .button-stagger-1 { animation: button-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s forwards; opacity: 0; }
        .button-stagger-2 { animation: button-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s forwards; opacity: 0; }
        .button-stagger-3 { animation: button-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s forwards; opacity: 0; }
        .button-stagger-4 { animation: button-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s forwards; opacity: 0; }
        @keyframes message-pop { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        .message-enter { animation: message-pop 0.3s ease-out forwards; }
        .feature-button { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .feature-button:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); }
        .feature-button:active { transform: translateY(-1px) scale(0.98); }
        .input-field { transition: all 0.3s ease; }
        .input-field:focus { box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1); transform: scale(1.02); }
        .send-button { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .send-button:hover { transform: rotate(8deg) scale(1.08); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); }
        .send-button:active { transform: rotate(4deg) scale(0.95); }
        @keyframes mascot-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        .mascot-breathing { animation: mascot-breathe 3s ease-in-out infinite; }
        @keyframes panel-scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .panel-enter { animation: panel-scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes header-slide-down { 0% { transform: translateY(-10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .header-enter { animation: header-slide-down 0.3s ease-out 0.1s forwards; opacity: 0; }
        @keyframes input-slide-up { 0% { transform: translateY(10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .input-enter { animation: input-slide-up 0.3s ease-out 0.3s forwards; opacity: 0; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; display: inline-block; }
      `}</style>

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
        <button
          onClick={openPanel}
          className="mascot-floating w-20 h-20 rounded-full border-2 border-black bg-white shadow-[3px_3px_0_0_#000000] flex items-center justify-center hover:shadow-[5px_5px_0_0_#000000] transition-all mascot-bounce-hover overflow-hidden"
          aria-label="Open Q-Bot help"
          title="Click me!"
        >
          <img src={qbotLauncherPng} alt="Q-Bot" className="w-full h-full object-cover" />
        </button>
        <div className="text-xs font-bold text-center text-gray-700 whitespace-nowrap">
          Click me!
        </div>
      </div>
      
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-32 right-6 z-40 flex flex-col items-end">
          {/* Mascot - Always visible */}
          <div className="w-40 -mb-0.4 relative z-10 mascot-breathing">
            <img src={qbotMascotPng} alt="Q-Bot Mascot" className="w-full h-auto object-contain" />
          </div>

          {/* Chat Panel - Fixed Size, Compact */}
          <div className="w-80 border-2 border-black rounded-2xl bg-white shadow-[6px_6px_0_0_#000000] overflow-hidden flex flex-col h-[480px] panel-enter">
            
            {/* Header */}
            <div className="border-b-2 border-black bg-gray-50 p-4 flex items-center justify-between header-enter">
              <div className="flex items-center gap-2 flex-1">
                {currentView !== 'menu' && (
                  <button
                    onClick={backToMenu}
                    aria-label="Back to menu"
                    className="font-extrabold text-lg hover:text-gray-600 transition-colors"
                    title="Back to options"
                  >
                    ←
                  </button>
                )}
                <div>
                  <h3 className="font-extrabold text-sm leading-tight">Q-Bot</h3>
                  <p className="text-xs text-gray-600">Online · Ready to help</p>
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Close Q-Bot"
                className="font-extrabold text-lg hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* MENU VIEW - 4 Feature Buttons */}
            {currentView === 'menu' && (
              <div className="flex-1 bg-white p-6 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <p className="font-bold text-lg">Hi! I'm Q-Bot</p>
                  <p className="text-sm text-gray-600">How can I help you?</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleStateInfo}
                    disabled={loading}
                    className="feature-button button-stagger-1 border-2 border-black rounded-lg p-4 bg-white hover:bg-gray-50 disabled:opacity-50 text-center font-bold text-sm h-28 flex flex-col justify-center items-center gap-2"
                  >
                    <img src={iconStateInfo} alt="State Info" className="w-8 h-8" />
                    <div>
                      <div className="text-sm font-bold">State Info</div>
                      <div className="text-[10px] font-normal text-gray-600">Check state</div>
                    </div>
                  </button>

                  <button
                    onClick={handleCircuitHelp}
                    disabled={loading}
                    className="feature-button button-stagger-2 border-2 border-black rounded-lg p-4 bg-white hover:bg-gray-50 disabled:opacity-50 text-center font-bold text-sm h-28 flex flex-col justify-center items-center gap-2"
                  >
                    <img src={iconCircuitHelp} alt="Circuit Help" className="w-8 h-8" />
                    <div>
                      <div className="text-sm font-bold">Circuit Help</div>
                      <div className="text-[10px] font-normal text-gray-600">Understand gates</div>
                    </div>
                  </button>

                  <button
                    onClick={handleConcepts}
                    disabled={loading}
                    className="feature-button button-stagger-3 border-2 border-black rounded-lg p-4 bg-white hover:bg-gray-50 disabled:opacity-50 text-center font-bold text-sm h-28 flex flex-col justify-center items-center gap-2"
                  >
                    <img src={iconConcepts} alt="Concepts" className="w-8 h-8" />
                    <div>
                      <div className="text-sm font-bold">Concepts</div>
                      <div className="text-[10px] font-normal text-gray-600">Learn quantum</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentView('ask')}
                    disabled={loading}
                    className="feature-button button-stagger-4 border-2 border-black rounded-lg p-4 bg-white hover:bg-gray-50 disabled:opacity-50 text-center font-bold text-sm h-28 flex flex-col justify-center items-center gap-2"
                  >
                    <img src={iconAskMe} alt="Ask Me" className="w-8 h-8" />
                    <div>
                      <div className="text-sm font-bold">Ask Me</div>
                      <div className="text-[10px] font-normal text-gray-600">Your questions</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* CHAT VIEW - Messages + Input */}
            {currentView !== 'menu' && (
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white">
                  {messages.map((msg) => (
                    <div key={msg.id} className="message-enter">
                      {msg.type === 'bot' ? (
                        <div className="bg-gray-100 border-2 border-black rounded-lg px-3 py-2 text-xs font-medium text-gray-800">
                          {msg.text}
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <div className="bg-black text-white border-2 border-black rounded-lg px-3 py-2 text-xs font-medium max-w-xs break-words">
                            {msg.text}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Always at bottom for ALL views */}
                <form onSubmit={handleAskQuestion} className="border-t-2 border-black bg-gray-50 p-2 flex gap-2 input-enter flex-shrink-0">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    disabled={loading}
                    placeholder="Ask more..."
                    className="input-field flex-1 border-2 border-black rounded-lg px-3 py-2 text-xs font-medium placeholder-gray-400 focus:outline-none focus:border-black disabled:bg-gray-200"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={loading || !userQuestion.trim()}
                    className="send-button bg-black border-2 border-black rounded-lg px-3 py-2 text-white font-extrabold disabled:opacity-50"
                  >
                    {loading ? <span className="spinner">⟳</span> : '→'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HelpPanel;
