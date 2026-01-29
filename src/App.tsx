import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Yo! 💯Epic Tech AI🔥™️ locked in. Drop music beats, video visuals, digital art concepts, NFT ideas — whatever fire you got. Let’s build something crazy 🔥',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const systemPrompt = `You are 💯Epic Tech AI🔥™️ — ultra-creative genius focused on music production, video directing, digital art, visuals, beats, lyrics, storytelling, futuristic tech, NFTs and cyber vibes.
Respond with high energy, emojis when it fits, short punchy lines or deep detailed ideas depending on the vibe. Use purple/cyan/neon language when describing visuals or aesthetics. Never boring, always inspiring.`;

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
          ],
          temperature: 0.85,
          max_tokens: 1200,
          stream: false, // change to true later when we add streaming
        }),
      });

      if (!res.ok) {
        throw new Error(`Groq error ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'No response received 🔥';

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '🔥 Connection glitch. Check your API key or try again in a sec.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/80 to-black text-white flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 border-b border-purple-500/30 bg-black/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            💯Epic Tech AI🔥™️
          </h1>
          <span className="text-sm md:text-base text-cyan-400/80 font-medium">
            Groq · Llama 3.3 70B · Lightning Fast
          </span>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-4xl mx-auto w-full space-y-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[78%] p-4 rounded-2xl shadow-lg ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600/90 to-cyan-600/90 rounded-br-none'
                  : 'bg-gray-900/70 border border-purple-500/50 rounded-bl-none backdrop-blur-md'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed text-[15px] md:text-base">
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-900/70 border border-purple-500/40 px-5 py-4 rounded-2xl rounded-bl-none backdrop-blur-md">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input area */}
      <footer className="p-4 border-t border-purple-500/30 bg-black/70 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your music idea, video concept, art prompt... 🔥"
              rows={1}
              className="flex-1 resize-none p-4 bg-purple-950/60 border border-purple-500/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition min-h-[56px] max-h-40 overflow-y-auto"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-xl shadow-purple-600/30 transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
            >
              SEND
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}

export default App;
