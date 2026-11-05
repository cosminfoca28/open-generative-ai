'use client';

import { useState } from 'react';

const EXAMPLES = [
  { title: 'Travel', prompt: 'Photorealistic Mediterranean coastline near Paphos at golden hour, limestone cliffs, turquoise sea, natural light, professional travel photography, no text or logos' },
  { title: 'Product', prompt: 'Premium studio product photography of a generic travel dog bed in a modern car, realistic materials, soft natural shadows, clean commercial composition, no text or logos' },
];

export default function FreeStudioClient() {
  const [tab, setTab] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [generating, setGenerating] = useState(false);
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  async function generate(event) {
    event.preventDefault();
    if (generating) return;
    setGenerating(true);
    setError('');
    setImage('');
    try {
      const response = await fetch('/api/free-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-studio-access': accessKey,
        },
        body: JSON.stringify({ prompt }),
        cache: 'no-store',
      });
      const body = await response.json();
      if (!response.ok || !body.image) throw new Error(body.error || 'Image generation unavailable.');
      setImage(body.image);
    } catch (err) {
      setError(err.message || 'Could not create this image.');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="fs-app">
      <div className="fs-frame">
        <header className="fs-header">
          <div className="fs-brand">
            <span className="fs-symbol" aria-hidden="true">✦</span>
            <div><strong>AI Media Studio</strong><span>Creative studio · Free mode</span></div>
          </div>
          <span className="fs-chip">PRIVATE BETA</span>
        </header>

        <div className="fs-heading">
          <span className="fs-overline">YOUR CREATIVE WORKSPACE</span>
          <h1>Create something <em>extraordinary.</em></h1>
          <p>Generate images from your iPhone using Cloudflare's daily free allocation. No MuAPI key required.</p>
        </div>

        <div className="fs-tabs" role="tablist" aria-label="Studio mode">
          <button type="button" role="tab" aria-selected={tab === 'image'} className={tab === 'image' ? 'fs-tab active' : 'fs-tab'} onClick={() => setTab('image')}>✦ Images</button>
          <button type="button" role="tab" aria-selected={tab === 'video'} className={tab === 'video' ? 'fs-tab active' : 'fs-tab'} onClick={() => setTab('video')}>▷ Video</button>
        </div>

        {tab === 'image' ? (
          <section className="fs-workspace" aria-label="Free image creator">
            <div className="fs-output">
              {image ? (
                <img src={image} alt="Generated image based on your prompt" className="fs-generated" />
              ) : (
                <div className="fs-empty">
                  <span className="fs-placeholder" aria-hidden="true">✳</span>
                  <strong>Your canvas awaits</strong>
                  <span>Write a prompt below and generate an image</span>
                </div>
              )}
            </div>
            {image && (
              <div className="fs-result-actions">
                <a className="fs-download" href={image} download="ai-media-studio.jpg">Download image ↓</a>
                <span>On iPhone, you can also open the image and use Share → Save Image.</span>
              </div>
            )}

            <form className="fs-form" onSubmit={generate}>
              <div className="fs-field-header"><label htmlFor="fs-prompt">Image description</label><span>{prompt.length}/600</span></div>
              <textarea id="fs-prompt" rows={4} maxLength={600} minLength={3} required value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe the image you want to create..." />
              <div className="fs-examples">
                {EXAMPLES.map((example) => <button key={example.title} type="button" onClick={() => setPrompt(example.prompt)}>{example.title} ↗</button>)}
              </div>
              <label htmlFor="fs-key">Studio access password</label>
              <input id="fs-key" type="password" autoComplete="off" placeholder="Your private studio password" value={accessKey} onChange={(event) => setAccessKey(event.target.value)} required />
              <div className="fs-model"><span>MODEL</span><strong>FLUX.1 Schnell</strong><small>Cloudflare Free tier · 4 steps</small></div>
              <button type="submit" className="fs-generate" disabled={generating || prompt.trim().length < 3 || !accessKey}>{generating ? 'Generating your image…' : '✦ Generate image'}</button>
              {error && <p className="fs-error" role="alert">{error}</p>}
            </form>
          </section>
        ) : (
          <section className="fs-video-state">
            <span className="fs-placeholder" aria-hidden="true">▷</span>
            <h2>Video is coming next</h2>
            <p>We haven't verified a sustainable, zero-cost cloud video backend. We won't silently charge you for Kling, Veo, Sora or MuAPI.</p>
            <button type="button" onClick={() => setTab('image')}>Create a free image instead</button>
          </section>
        )}

        <footer className="fs-footer"><span>Free allocation is limited daily; generation stops when the provider quota is reached.</span><a href="https://github.com/cosminfoca28/open-generative-ai" target="_blank" rel="noopener noreferrer">Source code ↗</a></footer>
      </div>
    </main>
  );
}
