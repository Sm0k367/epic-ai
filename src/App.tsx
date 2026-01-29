import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Yo! 💯Epic Tech AI🔥™️ locked in.\n\nMusic beats, video concepts, digital art, cyber visuals, lyrics — drop whatever fire you got. Let’s create 🔥',
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

    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const systemPrompt = `You are 💯Epic Tech AI🔥™️ — high-energy creative genius for:
- music production, beats, lyrics
- video concepts, visuals, storytelling
- digital art, NFTs, cyberpunk/neon aesthetics

Reply with 🔥 energy, emojis, punchy lines or deep ideas. Use purple/cyan/neon language for visuals. Never boring.`;

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
            ...messages.map(m => ({ role: m.role, content: m.content })),
            userMessage,
          ],
          temperature: 0.9,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) throw new Error('Groq API error');

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'No response 🔥';

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: '🔥 Connection issue — check API key or try again' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/60 to-black text-white flex flex-col">
      <header className="p-4 border-b border-purple-500/30 bg-black/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            💯Epic Tech AI🔥™️
          </h1>
          <span className="text-cyan-400/80">Groq • Llama 3.3 70B</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-4xl mx-auto w-full space-y-6 pb-32">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 rounded-br-none'
                : 'bg-gray-900/70 border border-purple-500/40 rounded-bl-none backdrop-blur-sm'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-900/70 border border-purple-500/40 px-5 py-4 rounded-2xl rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-purple-500/30 bg-black/70 backdrop-blur-md fixed bottom-0 left-0 right-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Music idea, video concept, art prompt... 🔥"
              className="flex-1 p-4 bg-purple-950/50 border border-purple-500/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-bold hover:scale-105 transition disabled:opacity-50"
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
