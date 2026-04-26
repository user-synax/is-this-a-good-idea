import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import connectDB from '@/lib/mongodb';
import Idea from '@/models/Idea';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json();

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json(
        { error: 'Idea is required and must be a string' },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a brutally honest startup/idea critic. 
          Respond ONLY in raw JSON, no markdown, no backticks, nothing else:
          {"verdict":"DEAD ON ARRIVAL" or "NEEDS WORK" or "ACTUALLY VIABLE" or "SEND IT","reason":"one punchy sentence max 15 words","score":1-10}`,
        },
        { role: 'user', content: idea },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in Groq response');
    }
    const raw = content.trim();
    let parsed;
    
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      // Try to extract JSON from the response if Groq added extra text
      const jsonMatch = raw.match(/\{[^}]+\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse Groq response as JSON');
      }
    }

    const { verdict, reason, score } = parsed;

    // Connect to MongoDB
    await connectDB();

    // Save to MongoDB
    const savedIdea = await Idea.create({
      idea,
      verdict,
      reason,
      score,
      createdAt: new Date(),
    });

    return NextResponse.json({
      id: savedIdea._id.toString(),
      verdict,
      reason,
      score,
    });
  } catch (error) {
    console.error('Error in judge API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
