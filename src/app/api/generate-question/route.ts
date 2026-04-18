import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const systemPrompt = `You are a strict MCQ question generator for a Pakistan Army AMC (Army Medical Corps) Initial Test preparation platform. Generate exactly one question in valid JSON format with no additional text, no markdown, no code blocks — only raw JSON.

Format: {"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":0,"explanation":"..."}

Rules:
- "correct" is the zero-based index of the correct option (0, 1, 2, or 3)
- All four options must be distinct and plausible
- The question must be fresh, specific, and educationally accurate
- The explanation must be concise (one sentence)
- No emojis anywhere
- For non-verbal tests: describe the visual pattern clearly in text since visuals cannot be rendered
- For academic tests: align with FSc and MDCAT syllabus
- Return only raw JSON, nothing else`;

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const { testType, topic, previousQuestions } = await request.json();

    if (!testType || !topic) {
      return NextResponse.json(
        { error: 'testType and topic are required' },
        { status: 400 }
      );
    }

    const validTestTypes = ['verbal', 'nonverbal', 'academic'];
    if (!validTestTypes.includes(testType)) {
      return NextResponse.json(
        { error: 'Invalid testType provided' },
        { status: 400 }
      );
    }

    let userPrompt = '';

    if (testType === 'verbal') {
      userPrompt = `Generate one verbal intelligence MCQ for the topic: ${topic}. Topics include Synonyms, Antonyms, Analogies, Sentence Completion, Odd One Out. Make it appropriate for an intelligent Pakistani army candidate at matriculation/FSc level.`;
    } else if (testType === 'nonverbal') {
      userPrompt = `Generate one non-verbal intelligence MCQ for the topic: ${topic}. Topics include Pattern Series, Matrix Reasoning, Mirror Images, Paper Folding, Figure Classification. Since visuals cannot be rendered, describe the pattern clearly in text form. Make it suitable for a Pakistan Army intelligence test.`;
    } else if (testType === 'academic') {
      const subjectMap: Record<string, string> = {
        Biology: 'FSc and MDCAT level Biology',
        Chemistry: 'FSc and MDCAT level Chemistry',
        Physics: 'FSc and MDCAT level Physics',
      };
      const subjectDesc = subjectMap[topic] || topic;
      userPrompt = `Generate one academic MCQ from ${subjectDesc}. The question must be at FSc or MDCAT difficulty level, factually accurate, and relevant to Pakistani curriculum for army medical candidates.`;
    }

    if (previousQuestions && previousQuestions.length > 0) {
      userPrompt += ` Do NOT repeat any of these previously asked questions: ${previousQuestions.slice(-10).join(' | ')}`;
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(userPrompt);
    const response = result.response;

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No candidates in Gemini response. Content may have been blocked by safety filters.');
    }

    const rawText = response.text().trim();

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse JSON from Gemini response');
      }
      parsed = JSON.parse(jsonMatch[0]);
    }

    if (
      typeof parsed.question !== 'string' ||
      !Array.isArray(parsed.options) ||
      parsed.options.length !== 4 ||
      typeof parsed.correct !== 'number' ||
      typeof parsed.explanation !== 'string'
    ) {
      throw new Error('Invalid question format from Gemini');
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { error: 'Failed to generate question. Please try again.' },
      { status: 500 }
    );
  }
}
