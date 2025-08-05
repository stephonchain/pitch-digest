import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { YoutubeTranscript } from 'youtube-transcript';

type Data =
  | { markdown: string }
  | { error: string };

function toMMSS(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  try {
    const { url } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'bad_request' });
      return;
    }

    // 1) Fetch transcript (accepts either full URL or video ID)
    const items = await YoutubeTranscript.fetchTranscript(url);
    if (!items || items.length === 0) {
      res.status(404).json({ error: 'no_transcript_found' });
      return;
    }

    // Prepare a compact transcript with timestamps to help the model
    // Keep around ~5000 characters to avoid token bloat.
    let acc = '';
    for (const it of items) {
      const t = `[${toMMSS((it.offset || 0) / 1000)}] ${it.text}`;
      if ((acc + ' ' + t).length > 5000) break;
      acc += (acc ? ' ' : '') + t;
    }

    const prompt = `Tu es un assistant qui résume des vidéos YouTube en français.
Produis UNIQUEMENT du Markdown avec :
- 5 puces claires (•) résumant les idées principales
- Pour chaque puce, un timestamp entre parenthèses au format MM:SS
- Une ligne finale "Liens rapides :" suivie de 3 timestamps clés (MM:SS) avec un très court libellé

Si la source est incomplète, fais de ton mieux mais reste factuel.

Transcription partielle avec timecodes :
${acc}`;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const r = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        { role: 'system', content: 'Tu écris des résumés concis et utiles.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 400
    });

    const markdown = (r.choices?.[0]?.message?.content || '').trim();
    if (!markdown) {
      res.status(500).json({ error: 'empty_response' });
      return;
    }

    res.status(200).json({ markdown });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
}
