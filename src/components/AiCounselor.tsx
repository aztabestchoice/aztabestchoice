import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { Sparkles, Send, Brain, ShieldCheck, ArrowRight, User as UserIcon, RotateCcw } from 'lucide-react';

interface AiCounselorProps {
  currentUser: User;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const QUICK_PROMPTS = [
  'Bagaimana tips lulus Tes Koran Pauli/Kraepelin?',
  'Apa rahasia menghadapi Tes EPPS & Kepribadian?',
  'Tips melatih fokus kognitif verbal analogi?',
  'Bagaimana cara mengatasi grogi saat tes kesamaptaan jasmani?'
];

export default function AiCounselor({ currentUser }: AiCounselorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Halo **${currentUser.name}**! Saya adalah **AI Konselor & Mentor Psikotes TNI-POLRI** dari Bimbel Azta Best Choice Madiun. 🇮🇩\n\nSaya diprogram khusus untuk mendampingi persiapan karir Taruna/Taruni Anda. \n\nBagian mana dari **Psikotes (Kecerdasan, Kepribadian, atau Sikap Kerja)** yang ingin Anda ulas atau tanyakan hari ini? Silakan pilih dari saran tombol cepat di bawah atau ketik langsung keluhan Anda!`
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessageToGemini = async (promptText: string) => {
    if (!promptText.trim()) return;

    // Append user message
    const updatedMessages = [...messages, { role: 'user', text: promptText } as Message];
    setMessages(updatedMessages);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tanya-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: promptText,
          chatHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi pelayan server.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.text }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: `**Maaf, terjadi kesalahan teknis.**\n\nTidak dapat memproses sambungan ke pelayan AI di server. Pastikan server berjalan dan parameter **GEMINI_API_KEY** disetel dengan benar di sekretariat rahasia kustom.` 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageToGemini(inputVal);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: `Halo **${currentUser.name}**! Obrolan telah diatur ulang. Ada materi psikotes TNI-POLRI, BUMN, atau PTN yang ingin Anda bahas kembali bersama saya?`
      }
    ]);
  };

  // Custom JSX line formatter that parses basic markdown formatting (bullets, bold, paragraphs)
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-2.5 font-sans break-words leading-relaxed text-slate-800 text-xs sm:text-sm">
        {lines.map((line, idx) => {
          let currentLine = line.trim();
          
          // Check if bullet point
          const isBullet = currentLine.startsWith('* ') || currentLine.startsWith('- ');
          if (isBullet) {
            currentLine = currentLine.substring(2);
          }

          // Simple bold formatting parser (**text** -> strong)
          const parts = currentLine.split('**');
          const formattedLine = parts.map((part, pIdx) => {
            if (pIdx % 2 === 1) {
              return <strong key={pIdx} className="font-extrabold text-slate-900">{part}</strong>;
            }
            return part;
          });

          if (isBullet) {
            return (
              <ul key={idx} className="list-disc list-inside pl-3 space-y-1 my-0.5">
                <li className="text-gray-700">{formattedLine}</li>
              </ul>
            );
          }

          if (line.trim() === '') {
            return <div key={idx} className="h-2 pointer-events-none" />;
          }

          return <p key={idx} className="leading-relaxed">{formattedLine}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-150 rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col justify-between h-[600px] text-left" id="ai-counselor-screen">
      
      {/* Header Info */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-inner">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-sans font-extrabold text-sm sm:text-base text-slate-905 flex items-center gap-1">
              <span>Ruang Tanya AI Konselor</span>
              <span className="px-1.5 py-0.2 bg-amber-400 text-emerald-950 font-mono font-black text-[8px] uppercase tracking-wider rounded">TNI-POLRI</span>
            </h3>
            <p className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Didukung Asisten Inteligensia Azta Madiun</span>
            </p>
          </div>
        </div>

        <button 
          onClick={handleClearChat}
          className="p-1 px-2.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg text-[10px] text-gray-500 font-bold flex items-center space-x-1 transition-colors cursor-pointer"
          title="Atur Ulang Obrolan"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bersihkan Obrolan</span>
        </button>
      </div>

      {/* Chat Messages Log Area */}
      <div className="flex-1 overflow-y-auto px-1 sm:px-2 py-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div 
              key={idx} 
              className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Profile/Robot Bubble Icon */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${
                isUser 
                  ? 'bg-slate-900 border-slate-900 text-white' 
                  : 'bg-emerald-800 border-emerald-800 text-amber-300'
              }`}>
                {isUser ? (
                  <UserIcon className="w-4 h-4" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
              </div>

              {/* Message text bubble wrapper */}
              <div className={`p-4 rounded-3xl ${
                isUser 
                  ? 'bg-slate-100 text-slate-800 rounded-tr-none' 
                  : 'bg-emerald-50/40 border border-emerald-200/50 text-slate-900 rounded-tl-none'
              }`}>
                {renderMessageContent(m.text)}
              </div>
            </div>
          );
        })}

        {/* Loading/Typing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 max-w-[85%] mr-auto animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-emerald-855 text-amber-300 border border-emerald-800/20 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="bg-emerald-50/20 border border-emerald-200/30 p-4 rounded-3xl rounded-tl-none flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips Selector */}
      {messages.length === 1 && (
        <div className="mt-2 text-left space-y-1.5 shrink-0" id="chat-quickchips-dock">
          <span className="text-[9px] font-black text-gray-400 block font-mono">BANTUAN OBROLAN CEPAT:</span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => sendMessageToGemini(prompt)}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-[10px] sm:text-xs text-slate-700 hover:text-emerald-950 font-medium rounded-full transition-all text-left cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form submit toolbar input */}
      <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2 shrink-0 border-t border-gray-100 pt-3" id="ai-chat-inputform">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Tanyakan materi psikotes atau bimbingan TNI-POLRI Anda di sini..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:border-emerald-800 disabled:bg-gray-100 bg-slate-50 font-medium"
        />

        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          className="p-3.5 bg-emerald-800 hover:bg-emerald-900 text-white disabled:bg-gray-250 disabled:cursor-not-allowed rounded-2xl transition-all shadow-md transform active:scale-95 flex items-center justify-center cursor-pointer flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
