import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateImagePrompt, readCloudflareImage } from '../lib/free-studio.mjs';

test('prompt validation rejects invalid prompts', () => {
  assert.equal(validateImagePrompt(null), null);
  assert.equal(validateImagePrompt('a'), null);
  assert.equal(validateImagePrompt(' x  '), null);
  assert.equal(validateImagePrompt('a'.repeat(601)), null);
  assert.equal(validateImagePrompt('  sky at sunrise '), 'sky at sunrise');
});

test('image helper validates base64 shape', () => {
  assert.equal(readCloudflareImage({ result: { image: 'no' } }), null);
  assert.equal(readCloudflareImage({ result: { image: '!' .repeat(120) } }), null);
  const image = 'a'.repeat(120);
  assert.equal(readCloudflareImage({ result: { image } }), `data:image/jpeg;base64,${image}`);
});

test('server endpoint has credential and free-plan guardrails', () => {
  const src = readFileSync(new URL('../app/api/free-image/route.js', import.meta.url), 'utf8');
  assert.match(src, /CLOUDFLARE_FREE_PLAN_CONFIRMED/);
  assert.match(src, /STUDIO_ACCESS_KEY/);
  assert.match(src, /timingSafeEqual/);
  assert.match(src, /steps: 4/);
  assert.doesNotMatch(src, /NEXT_PUBLIC_/);
});

test('mobile creator does not request Muapi or show fake video generation', () => {
  const src = readFileSync(new URL('../app/free-studio/FreeStudioClient.js', import.meta.url), 'utf8');
  assert.match(src, /\/api\/free-image/);
  assert.match(src, /Video is coming next/);
  assert.doesNotMatch(src, /muapi\.ai\/api/);
});

test('manifest is standalone and points to the free studio', () => {
  const file = readFileSync(new URL('../public/free-studio.webmanifest', import.meta.url), 'utf8');
  const manifest = JSON.parse(file);
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, '/free-studio');
});

test('host can isolate legacy studio during security review', () => {
  const src = readFileSync(new URL('../middleware.js', import.meta.url), 'utf8');
  assert.match(src, /FREE_STUDIO_ONLY/);
  assert.match(src, /api\/free-image/);
  assert.match(src, /NextResponse\.redirect/);
});
