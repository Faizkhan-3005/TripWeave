import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, Send, X, Bot, User, Loader2, Compass, DollarSign, Calendar } from 'lucide-react';
import { api } from '../../services/api';

interface AiChatWidgetProps {
  tripId?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiChatWidget: React.FC<AiChatWidgetProps> = ({ tripId }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hello! I'm **Tripweave Concierge**, powered by Google Gemini AI. Ask me anything about your destinations, dining spots, weather advisories, or budget trajectory!",
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await api.ai.chat({
        tripId,
        messages: newHistory,
        userMessage: textToSend,
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.reply || "I'm looking into that for your itinerary!" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Here are a few proactive recommendations: We recommend leaving a 2-hour buffer between check-in and scheduled activities, and opting for indoor cultural exhibits if precipitation occurs.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-black text-white hover:bg-zinc-800 active:scale-95 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all cursor-pointer border border-white/20 group hover:shadow-black/20"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-current animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <span className="text-xs font-black tracking-tight">Ask Tripweave AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[420px] h-[560px] bg-white rounded-[32px] shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#18181b] text-white p-4 px-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white">Tripweave Concierge</h3>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-violet-900/80 text-violet-200">
                    Gemini AI
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">Adaptive Tour Copilot &bull; Online</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-[#fafafa] border-b border-gray-100 p-2.5 px-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { label: '🍷 Best Dinner Spots', query: 'What are the top-rated local dining spots for this trip?' },
              { label: '💰 Budget Trajectory', query: 'Analyze my trip budget and daily allowance.' },
              { label: '🌦️ Weather Advisory', query: 'How does the weather forecast look and what should I pack?' },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-[10px] font-bold text-gray-600 hover:text-black hover:border-black transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fdfdfd]">
            {messages.map((m, idx) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                      isUser ? 'bg-black text-white' : 'bg-violet-100 text-violet-700'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                      isUser
                        ? 'bg-black text-white rounded-tr-xs'
                        : 'bg-[#f3f4f6] text-gray-800 rounded-tl-xs whitespace-pre-wrap'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-600" />
                <span>Thinking with Gemini...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about your itinerary or schedule..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#fafafa] focus:bg-white focus:border-black outline-none transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-black text-white hover:bg-zinc-800 disabled:opacity-30 transition-all cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
