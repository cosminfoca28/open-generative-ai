import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isSameHostRequest } from '../lib/free-studio-origin.mjs';

test('same-host check accepts the public host behind a proxy', () => {
  assert.equal(isSameHostRequest('https://studio.example.app', {
    forwardedHost: 'studio.example.app', host: 'internal:8080', url: 'http://internal:8080/api/free-image',
  }), true);
  assert.equal(isSameHostRequest('https://studio.example.app', {
    host: 'studio.example.app', url: 'https://studio.example.app/api/free-image',
  }), true);
});

test('same-host check rejects other sites and malformed origins', () => {
  const req = { host: 'studio.example.app', url: 'https://studio.example.app/api/free-image' };
  assert.equal(isSameHostRequest('https://evil.example', req), false);
  assert.equal(isSameHostRequest('https://studio.example.app.evil.example', req), false);
  assert.equal(isSameHostRequest('null', req), false);
  assert.equal(isSameHostRequest('not a url', req), false);
});

test('free-only mode is fail-closed (only FREE_STUDIO_ONLY=no opens legacy routes)', () => {
  const src = readFileSync(new URL('../middleware.js', import.meta.url), 'utf8');
  assert.match(src, /process\.env\.FREE_STUDIO_ONLY !== 'no'/);
  assert.doesNotMatch(src, /FREE_STUDIO_ONLY === 'yes'/);
});

test('API route uses the shared same-host check and never a public env var', () => {
  const src = readFileSync(new URL('../app/api/free-image/route.js', import.meta.url), 'utf8');
  assert.match(src, /isSameHostRequest/);
  assert.doesNotMatch(src, /NEXT_PUBLIC_/);
});

test('iPhone home-screen icon is a PNG and is reachable in free-only mode', () => {
  const png = readFileSync(new URL('../public/apple-touch-icon.png', import.meta.url));
  assert.deepEqual([...png.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47]);
  const mw = readFileSync(new URL('../middleware.js', import.meta.url), 'utf8');
  assert.match(mw, /apple-touch-icon\.png/);
});

test('iPhone save uses the share sheet without fetching data: URLs (blocked by CSP)', () => {
  const src = readFileSync(new URL('../app/free-studio/FreeStudioClient.js', import.meta.url), 'utf8');
  assert.match(src, /navigator\.share\(\{ files:/);
  assert.match(src, /navigator\.canShare/);
  assert.doesNotMatch(src, /fetch\(image\)/);
  assert.match(src, /autoComplete="current-password"/);
});
