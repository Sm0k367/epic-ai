import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          EPIC TECH AI
        </h1>
        
        <p className="text-2xl md:text-3xl mb-12 text-gray-300 font-light">
          Initialized. Ready for command.
        </p>

        <div className="mb-16">
          <button
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white text-xl font-semibold rounded-xl shadow-2xl shadow-blue-900/50 transform transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            onClick={() => setCount((prev) => prev + 1)}
          >
            Engage System — Clicks: {count}
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Press the button to test reactivity • Edit <code className="bg-gray-900 px-1.5 py-0.5 rounded">src/App.tsx</code> to begin building
        </p>
      </div>

      <footer className="absolute bottom-8 text-gray-600 text-sm">
        💯Epic Tech AI🔥™️ • Powered by the future
      </footer>
    </div>
  );
}

export default App;
