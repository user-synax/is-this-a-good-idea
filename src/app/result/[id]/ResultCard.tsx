'use client';

import Link from 'next/link';

interface ResultCardProps {
  idea: {
    idea: string;
    verdict: string;
    reason: string;
    score: number;
  };
  colors: {
    bg: string;
    text: string;
    border: string;
  };
}

export default function ResultCard({ idea, colors }: ResultCardProps) {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div
      className="rounded-2xl p-8 shadow-2xl"
      style={{
        backgroundColor: 'var(--card)',
        border: `3px solid var(--border)`,
      }}
    >
      <div
        className="text-center py-6 px-4 rounded-xl mb-6"
        style={{
          backgroundColor: colors.bg,
          border: `2px solid ${colors.border}`,
        }}
      >
        <h1
          className="text-4xl font-bold"
          style={{
            color: colors.text,
            fontFamily: 'var(--font-bangers)',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          {idea.verdict}
        </h1>
      </div>

      <div className="mb-6">
        <p
          className="text-center text-xl mb-4 italic"
          style={{ color: 'var(--text)' }}
        >
          "{idea.idea}"
        </p>
        <p
          className="text-center text-lg"
          style={{ color: 'var(--muted)' }}
        >
          {idea.reason}
        </p>
      </div>

      <div className="text-center mb-8">
        <div
          className="inline-block px-6 py-3 rounded-lg"
          style={{
            backgroundColor: 'var(--surface)',
            border: `2px solid var(--accent)`,
          }}
        >
          <span
            className="text-3xl font-bold"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-bangers)' }}
          >
            {idea.score}/10
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href="/"
          className="flex-1 py-3 px-6 rounded-lg font-semibold text-center transition-all hover:opacity-90"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--bg)',
            fontFamily: 'var(--font-bangers)',
          }}
        >
          Judge Another Idea
        </Link>
        <button
          onClick={copyLink}
          className="flex-1 py-3 px-6 rounded-lg font-semibold transition-all hover:opacity-90"
          style={{
            backgroundColor: 'var(--surface)',
            color: 'var(--text)',
            border: `2px solid var(--border)`,
            fontFamily: 'var(--font-bangers)',
          }}
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}
