import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Idea from '@/models/Idea';
import Link from 'next/link';
import ResultCard from './ResultCard';

async function getIdea(id: string) {
  try {
    await connectDB();
    const idea = await Idea.findById(id);
    if (!idea) return null;
    return JSON.parse(JSON.stringify(idea));
  } catch (error) {
    console.error('Error fetching idea:', error);
    return null;
  }
}

const verdictColors: Record<string, { bg: string; text: string; border: string }> = {
  'DEAD ON ARRIVAL': {
    bg: '#7f1d1d',
    text: '#fca5a5',
    border: '#991b1b',
  },
  'NEEDS WORK': {
    bg: '#92400e',
    text: '#fcd34d',
    border: '#b45309',
  },
  'ACTUALLY VIABLE': {
    bg: '#065f46',
    text: '#86efac',
    border: '#047857',
  },
  'SEND IT': {
    bg: '#c8854a',
    text: '#fef3c7',
    border: '#d97706',
  },
};

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idea = await getIdea(id);

  if (!idea) {
    notFound();
  }

  const colors = verdictColors[idea.verdict] || verdictColors['NEEDS WORK'];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-xl">
        <ResultCard idea={idea} colors={colors} />
      </div>
    </div>
  );
}
