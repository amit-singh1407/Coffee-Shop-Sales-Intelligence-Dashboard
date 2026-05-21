import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Send, Sparkles, User, Coffee, HelpCircle, ArrowDown, Database, Terminal
} from 'lucide-react';
import { sendChatMessage } from '../services/api';

const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Welcome to the **BrewIntel AI Assistant**! I can query your retail database, run forecasting simulations, inspect daily anomaly alerts, or cluster customer behavioral habits in real-time.\n\nType in any business question or click one of the suggestions below to begin exploring!",
      table: null
    }
  ]);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const suggestions = [
    "Which product sells the most?",
    "What is the predicted revenue next month?",
    "Which store performs worst?",
    "Show me customer segments",
    "List recently detected anomalies",
    "Tell me about Hell's Kitchen performance"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const userMessageText = textToSend || query;
    if (!userMessageText.trim()) return;

    // Append User message
    setMessages(prev => [...prev, { sender: 'user', text: userMessageText, table: null }]);
    setQuery('');
    setLoading(true);

    try {
      const botResponse = await sendChatMessage(userMessageText);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: botResponse.answer, 
        table: botResponse.tableData 
      }]);
    } catch (err) {
      console.error('Failed to chat:', err);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "🚨 *Network connection failed.* I couldn't reach the backend server. Please verify the Flask engine is online.", 
        table: null 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Helper to format chatbot responses with bold markdown
  const renderMessageText = (text) => {
    return text.split('\n').map((line, idx) => {
      // Basic bold matching **bold**
      let formattedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const italicRegex = /\*(.*?)\*/g;
      
      formattedLine = formattedLine.replace(boldRegex, '<strong>$1</strong>');
      formattedLine = formattedLine.replace(italicRegex, '<em>$1</em>');
      
      return (
        <p 
          key={idx} 
          className="mb-2 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  return (
    <div className="h-[80vh] flex flex-col gap-6 animate-fade-in font-sans">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tight flex items-center gap-3">
          AI Data Chatbot
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Chat using natural language to query statistical aggregates and command machine learning operations.
        </p>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 glass-panel rounded-2xl flex flex-col md:flex-row overflow-hidden border-glassBorder">
        {/* Messages Feed */}
        <div className="flex-1 flex flex-col h-full bg-slate-950/20">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-4 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-md flex-shrink-0 ${
                  msg.sender === 'user' 
                    ? 'bg-brandSecondary/10 border-brandSecondary/20 text-brandSecondary' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
                </div>

                {/* Bubble Content */}
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl border text-sm shadow-md font-sans ${
                    msg.sender === 'user' 
                      ? 'bg-brandSecondary/10 border-brandSecondary/15 text-slate-100 rounded-tr-none' 
                      : 'bg-glassBg border-glassBorder text-slate-200 rounded-tl-none'
                  }`}>
                    {renderMessageText(msg.text)}
                  </div>

                  {/* Inline Table Payload */}
                  {msg.table && (
                    <div className="glass-panel rounded-xl overflow-hidden border-glassBorder max-w-md shadow-lg shadow-black/10">
                      <div className="bg-slate-900/60 p-2.5 border-b border-glassBorder flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Query Result Aggregates</span>
                      </div>
                      <div className="overflow-x-auto max-h-48 text-[11px]">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-white/[0.01] border-b border-glassBorder text-slate-500">
                              {Object.keys(msg.table[0]).map((key) => (
                                <th key={key} className="p-2 font-bold uppercase tracking-wider">{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-glassBorder text-slate-300 font-sans">
                            {msg.table.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-white/[0.01]">
                                {Object.values(row).map((val, cIdx) => (
                                  <td key={cIdx} className="p-2 font-semibold font-mono">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-4 mr-auto max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Coffee className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-glassBg border-glassBorder rounded-tl-none flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          {messages.length === 1 && (
            <div className="px-6 py-2 flex flex-wrap gap-2.5 max-w-3xl">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-glassBorder hover:border-slate-500/20 text-xs text-slate-400 hover:text-slate-200 tracking-wide font-sans transition-all duration-300 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brandSecondary" />
                  <span>{sug}</span>
                </button>
              ))}
            </div>
          )}

          {/* Form Input */}
          <div className="p-6 border-t border-glassBorder bg-white/[0.01] flex gap-3">
            <input
              type="text"
              placeholder="Ask me: 'Which product sells the most?' or 'Show forecast'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              className="flex-1 px-4 py-3.5 bg-black/35 border border-glassBorder rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-brandPrimary transition-colors disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !query.trim()}
              className="px-5 py-3.5 bg-gradient-to-r from-brandPrimary to-brandSecondary rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
