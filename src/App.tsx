import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Yo! 💯Epic Tech AI🔥™️ online. Hit me with music ideas, video concepts, digital art prompts — whatever’s burning in your mind. Let’s create 🔥',
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
      const systemPrompt = `You are 💯Epic Tech AI🔥™️ — a wildly creative assistant specialized in music production, video concepts, digital art, NFTs, visuals, beats, lyrics, storytelling, and futuristic tech vibes. 
Always respond with high energy, emojis, short punchy lines when it fits, but go deep and detailed on creative ideas. Use purple/cyan/neon aesthetic language when describing visuals. Never be boring.`;

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
          stream: false, // set to true later for real streaming
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantReply = data.choices[0].message.content;

      setMessages((prev) => [...prev, { role: 'assistant', content: assistantReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Damn, something broke on my end 🔥 Try again or check console.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-purple-500/30 bg-black/60 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            💯Epic Tech AI🔥™️
          </h1>
          <span className="text-sm text-cyan-400/80">Powered by Groq • Llama 3.3 70B</span>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-4xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-6 flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 rounded-br-none'
                  : 'bg-gray-900/70 border border-purple-500/40 rounded-bl-none backdrop-blur-sm'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="bg-gray-900/70 border border-purple-500/40 p-4 rounded-2xl rounded-bl-none backdrop-blur-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer className="p-4 border-t border-purple-500/30 bg-black/60 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Drop a beat idea, video concept, art prompt... 🔥"
              className="flex-1 p-4 bg-purple-950/50 border border-purple-500/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transform transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
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
