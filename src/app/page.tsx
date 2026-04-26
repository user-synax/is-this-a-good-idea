'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface FeedItem {
  id: string;
  idea: string;
  verdict: string;
  reason: string;
  score: number;
}

const verdictColors: Record<string, { bg: string; text: string }> = {
  'DEAD ON ARRIVAL': { bg: '#7f1d1d', text: '#fca5a5' },
  'NEEDS WORK': { bg: '#92400e', text: '#fcd34d' },
  'ACTUALLY VIABLE': { bg: '#065f46', text: '#86efac' },
  'SEND IT': { bg: '#c8854a', text: '#fef3c7' },
};

export default function Home() {
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'shame' | 'fame'>('all');
  const router = useRouter();

  const fetchFeed = async () => {
    try {
      const filter = activeTab === 'all' ? '' : activeTab;
      const response = await fetch(`/api/feed?filter=${filter}`);
      const data = await response.json();
      setFeed(data);
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/judge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();
      if (data.id) {
        router.push(`/result/${data.id}`);
      }
    } catch (error) {
      console.error('Error submitting idea:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <nav className="w-full max-w-xl flex justify-center py-6">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 hover:opacity-90"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--text)',
            border: '2px solid var(--border)',
            fontFamily: 'var(--font-bangers)',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          start on github
        </a>
      </nav>
      <div className="w-full max-w-xl flex-1 flex flex-col justify-center">
        <motion.h1 
          className="text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, filter: 'blur(20px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ 
            color: 'var(--text)',
            fontFamily: 'var(--font-bangers)',
            textShadow: '0 4px 8px rgba(245, 230, 208, 0.3), 0 8px 16px rgba(245, 230, 208, 0.2)',
          }}
        >
          Is This A Good Idea?
        </motion.h1>
        <p className="text-center mb-8 text-lg" style={{ color: 'var(--muted)' }}>
          Paste your idea. Get a brutal honest verdict.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your idea in one line..."
            disabled={isLoading}
            className="w-full p-4 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--text)',
              border: `1px solid var(--border)`,
              fontFamily: 'var(--font-sans)',
            }}
          />
          
          <button
            type="submit"
            disabled={isLoading || !idea.trim()}
            className="w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all hover:scale-105 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--text)',
              border: '2px solid var(--border)',
              fontFamily: 'var(--font-bangers)',
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                thinking...
              </span>
            ) : (
              'Judge It'
            )}
          </button>
        </form>

        <div className="mt-12 w-full">
          <div className="flex gap-2 mb-4">
            {(['all', 'shame', 'fame'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: activeTab === tab ? 'var(--accent)' : 'var(--surface)',
                  color: 'var(--text)',
                  border: `2px solid var(--border)`,
                  fontFamily: 'var(--font-bangers)',
                }}
              >
                {tab === 'all' ? 'All' : tab === 'shame' ? 'Hall of Shame' : 'Hall of Fame'}
              </button>
            ))}
          </div>

          <div
            className="space-y-3 max-h-96 overflow-y-auto pr-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--accent) var(--surface)',
            }}
          >
            {feed.length === 0 ? (
              <p className="text-center" style={{ color: 'var(--muted)' }}>
                No ideas yet. Be the first!
              </p>
            ) : (
              feed.map((item) => {
                const colors = verdictColors[item.verdict] || verdictColors['NEEDS WORK'];
                return (
                  <Link
                    key={item.id}
                    href={`/result/${item.id}`}
                    className="block p-4 rounded-lg transition-all hover:scale-[1.02] hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: `2px solid var(--border)`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm mb-2 truncate"
                          style={{ color: 'var(--text)' }}
                        >
                          {item.idea}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-1 rounded text-xs font-bold"
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                              fontFamily: 'var(--font-bangers)',
                            }}
                          >
                            {item.verdict}
                          </span>
                          <span
                            className="text-sm font-bold"
                            style={{ color: 'var(--accent)', fontFamily: 'var(--font-bangers)' }}
                          >
                            {item.score}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
