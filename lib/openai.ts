import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDigest(transcript: string, videoTitle: string): Promise<string> {
  const prompt = `
You are an expert at creating concise, actionable summaries of business content. 

Please summarize this YouTube video transcript into exactly 5 bullet points. Each bullet point should:
- Include a timestamp in (MM:SS) format at the beginning
- Capture a key insight, strategy, or important point
- Be concise but specific enough to be valuable

After the 5 bullets, add a "Quick links:" section with exactly 3 key timestamps that highlight the most important moments.

Video Title: ${videoTitle}

Transcript: ${transcript}

Format your response exactly like this:

• (MM:SS) [Key insight or point]
• (MM:SS) [Key insight or point]  
• (MM:SS) [Key insight or point]
• (MM:SS) [Key insight or point]
• (MM:SS) [Key insight or point]

**Quick links:**
• (MM:SS) [Brief description]
• (MM:SS) [Brief description]  
• (MM:SS) [Brief description]
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert business content summarizer. Always follow the exact format requested and provide actionable insights."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 1000,
    temperature: 0.3,
  });

  return completion.choices[0]?.message?.content || "Failed to generate summary";
}