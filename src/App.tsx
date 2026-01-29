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
        'Yo! 💯Epic Tech AI🔥™️ online and locked in. \n\nDrop your wildest music beat ideas, cyberpunk video concepts, digital art visions, NFT drops, lyrics, visuals — whatever’s burning. Let’s make fire 🔥',
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
      const systemPrompt = `You are 💯Epic Tech AI🔥™️ — an ultra-creative, high-energy genius assistant obsessed with:
- Music production (beats, melodies, lyrics, sound design)
- Video concepts (cinematography, storytelling, visuals, edits)
- Digital art (cyberpunk, neon, futuristic, glitch, 3D, surreal)
- NFTs, tech aesthetics, creative tech vibes

Always reply with 🔥 energy, use emojis when it fits, keep it punchy but go deep/detailed on ideas. Describe visuals with purple/cyan/neon language. Never boring — inspire, hype, create.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
          temperature: 0.9,
          max_tokens: 1024,
          stream: false, // we'll upgrade to true + typewriter in a future step
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const assistantReply = data.choices?.[0]?.message?.content?.trim() || 'No reply received 🔥';

      setMessages((prev) => [...prev, { role: 'assistant', content: assistantReply }]);
    } catch (err: any) {
      console.error('Groq error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `🔥 Damn, glitch in the matrix: ${err.message || 'Check your API key or network'}. Try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/60 to-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-purple-500/30 bg-black/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight gradient-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            💯Epic Tech AI🔥™️
          </h1>
          <span className="text-sm md:text-base text-cyan-400/80 font-medium">
            Powered by Groq • Llama 3.3 70B • Lightning Fast
          </span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-4xl mx-auto w-full space-y-6 pb-24">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[78%] p-4 rounded-2xl shadow-lg neon-glow ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600/90 to-cyan-600/90 rounded-br-none'
                  : 'bg-gray-900/80 border border-purple-500/40 rounded-bl-none backdrop-blur-md'
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
            <div className="bg-gray-900/70 border border-purple-500/40 px-6 py-4 rounded-2xl rounded-bl-none backdrop-blur-md neon-glow">
              <div className="flex gap-3">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input Footer */}
      <footer className="p-4 border-t border-purple-500/30 bg-black/70 backdrop-blur-md fixed bottom-0 left-0 right-0">
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
              placeholder="Drop your music idea, video concept, art vision... 🔥"
              rows={1}
              className="flex-1 resize-none p-4 bg-purple-950/50 border border-purple-500/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition min-h-[56px] max-h-40 overflow-y-auto"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-xl shadow-purple-600/40 transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
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
