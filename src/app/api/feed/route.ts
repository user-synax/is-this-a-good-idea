import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Idea from '@/models/Idea';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter');

    await connectDB();

    let query = {};
    if (filter === 'shame') {
      query = { verdict: 'DEAD ON ARRIVAL' };
    } else if (filter === 'fame') {
      query = { verdict: 'SEND IT' };
    }

    const ideas = await Idea.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(
      ideas.map((idea) => ({
        id: idea._id.toString(),
        idea: idea.idea,
        verdict: idea.verdict,
        reason: idea.reason,
        score: idea.score,
      }))
    );
  } catch (error) {
    console.error('Error in feed API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
