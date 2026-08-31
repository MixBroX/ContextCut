import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { text, model } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text input is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured in environment variables' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const selectedModel = model || 'gemini-3.1-flash-lite';

    const prompt = `
Analyze the following unstructured client notes or project specifications. Return ONLY a valid JSON object (no markdown code blocks, just raw JSON) matching this exact schema:
{
  "summary": "Short 2-sentence executive summary",
  "userStories": ["Story 1", "Story 2"],
  "techStack": ["Tech 1", "Tech 2"],
  "edgeCases": ["Risk 1", "Risk 2"]
}

Unstructured input:
${text}
    `.trim();

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
    });

    const rawText = response.text || '';
    
    // Clean up potential markdown formatting if the model included it
    let jsonString = rawText.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse JSON from Gemini response:', rawText);
      return NextResponse.json(
        { error: 'Failed to parse structured output from model', raw: rawText },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
