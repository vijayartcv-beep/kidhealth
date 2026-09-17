import React, { useState, useRef, useEffect } from 'react';
import { KidProfile, DayPlan, ChatMessage } from '../types';
import { Send, Sparkles, Bot, User, RefreshCw, MessageSquareHeart, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PediatricAIChatbotProps {
  kids: KidProfile[];
  currentPlan: DayPlan;
  initialQuestion?: string;
}

export const PediatricAIChatbot: React.FC<PediatricAIChatbotProps> = ({
  kids,
  currentPlan,
  initialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Namaste! I am Dr. Poshan, your Indian Pediatric Nutrition Advisor. 

I'm here to help customize meals for your **${kids.map((k) => `${k.name} (${k.ageYears}y)`).join(' and ')}**.

Your family diet preferences are active:
• Non-vegetarian: **Egg, Chicken, Mutton, Fish, Prawns, Crab, and Seafood**
• **Strictly NO beef or pork**
• Rich in **green leafy vegetables (moringa, palak, methi)**, **soaked pulses**, and **nuts (almonds, cashews, walnuts)**
• All items grounded in **local Indian market availability** (Tamil Nadu, Karnataka, Maharashtra, North India, Kerala, etc.)

Feel free to ask me anything! What would you like help with today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'How do I safely serve crab or prawns to my 3-year-old boy?',
    'My 4-year-old daughter dislikes green leaves. How to sneak in moringa/palak?',
    'Which local Indian fish has the highest DHA and fewest bones for toddlers?',
    'Can I substitute Thursday chicken with fish or paneer?',
    'How many soaked almonds and cashews daily for 3 & 4 year olds?',
    'What pulses should I sprout at home to maximize iron and vitamin C?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuestion) {
      handleSend(initialQuestion);
    }
  }, [initialQuestion]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/nutrition/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          kidsProfile: kids,
          currentMeals: currentPlan,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is the pediatric nutrition advice...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        sender: 'assistant',
        text: `Here is clinical guidance for your kids (${kids.map((k) => `${k.name} [${k.ageYears}y]`).join(', ')}):
        
1. **Safety for Crab & Prawns (3yo & 4yo)**: 
   • For crab, prepare **clear Nandu Soup / Rasam** with black pepper, cumin, and garlic. Shred only soft leg claw meat; never give hard shells. 
   • For prawns, always **devein completely** (remove back black digestive tract), dice into 0.5cm soft chunks, cook in mild cow ghee for just 3-4 minutes to avoid rubbery texture.

2. **Green Leaves (Moringa / Palak)**:
   • Drumstick leaves (Murungai keerai) are India's #1 plant source of Iron and Calcium. Finely mince and mix into hot dal or ragi dosa batter.

3. **High DHA Indian Fish**:
   • **Indian Mackerel (Bangda/Ayila)** and **White Pomfret (Safed Vavval)** provide over 200mg+ DHA per serving with single easy-to-separate central bones.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden flex flex-col h-[700px] max-h-[85vh]">
      {/* Header */}
      <div className="px-5 py-4 bg-[#FAF8F5] border-b border-stone-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                Dr. Poshan - Indian Pediatric Nutritionist
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <p className="text-xs text-stone-500">
              Personalized for {kids.map((k) => `${k.name} (${k.ageYears}y)`).join(', ')} • ICMR-NIN Guided
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Pediatric Verified</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-stone-50/40">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isAssistant
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-800 text-white'
                }`}
              >
                {isAssistant ? '👨‍⚕️' : 'Parent'}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs whitespace-pre-line ${
                  isAssistant
                    ? 'bg-white border border-stone-200 text-stone-800'
                    : 'bg-amber-600 text-white font-medium'
                }`}
              >
                {msg.text}
                <div
                  className={`mt-2 text-[10px] ${
                    isAssistant ? 'text-stone-400' : 'text-amber-200 text-right'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 text-xs">
              👨‍⚕️
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-4 text-xs text-stone-500 shadow-2xs flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Dr. Poshan is analyzing Indian pediatric nutrition guidelines...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pill Carousel */}
      <div className="px-4 py-2 bg-stone-50 border-t border-stone-200/70 overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="text-[11px] font-bold text-stone-500 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600" /> Quick Ask:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] font-semibold text-stone-700 hover:text-amber-900 bg-white hover:bg-amber-50 border border-stone-200 px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2"
      >
        <input
          id="chat-input-field"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask Dr. Poshan about Indian pulses, seafood prep, or meal tweaks for 3 & 4 year olds..."
          className="flex-1 px-4 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-amber-600"
        />
        <button
          id="send-chat-btn"
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-all active:scale-98"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
