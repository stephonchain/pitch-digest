import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [md, setMd] = useState('');

  async function handleSummarize() {
    setLoading(true);
    setMd('');
    try {
      const r = await fetch('/api/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const j = await r.json();
      if (j.markdown) setMd(j.markdown);
      else setMd(`Erreur: ${j.error || 'inconnue'}`);
    } catch (e) {
      setMd('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Pitch Digest</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Collez une URL YouTube. Vous obtiendrez un résumé en 5 points avec timestamps.
      </p>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://youtu.be/… ou https://www.youtube.com/watch?v=…"
        style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc' }}
      />
      <button
        onClick={handleSummarize}
        disabled={!url || loading}
        style={{ marginTop: 12, width: '100%', padding: 12, borderRadius: 8, background: 'black', color: 'white', border: 'none' }}
      >
        {loading ? 'Analyse en cours…' : 'Résumer la vidéo'}
      </button>

      {md && (
        <div style={{ marginTop: 24, whiteSpace: 'pre-wrap', background: '#f8f8f8', padding: 16, borderRadius: 8 }}>
          {md}
        </div>
      )}

      <footer style={{ marginTop: 32, fontSize: 12, color: '#777' }}>
        Astuce : utilisez des vidéos avec sous-titres. Ce prototype n’enregistre aucune donnée.
      </footer>
    </main>
  );
}
