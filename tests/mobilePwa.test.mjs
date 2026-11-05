import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('manifest declares a standalone mobile studio', () => {
  const manifest = JSON.parse(readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'));
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, '/studio');
  assert.ok(manifest.icons.some((icon) => icon.src.endsWith('.svg')));
});

test('root layout wires manifest and mobile viewport', () => {
  const layout = readFileSync(new URL('../app/layout.js', import.meta.url), 'utf8');
  assert.match(layout, /manifest:\s*'\/manifest\.webmanifest'/);
  assert.match(layout, /viewportFit:\s*'cover'/);
});

test('mobile navigation is part of the studio shell', () => {
  const shell = readFileSync(new URL('../components/StandaloneShell.js', import.meta.url), 'utf8');
  assert.match(shell, /MobileBottomNav/);
  assert.match(shell, /onSelect=\{handleTabChange\}/);
});

test('mobile navigation has accessible buttons for key tools', () => {
  const component = readFileSync(new URL('../components/MobileBottomNav.js', import.meta.url), 'utf8');
  for (const id of ['image', 'video', 'cinema', 'workflows']) {
    assert.ok(component.includes(`id: '${id}'`));
  }
  assert.match(component, /aria-current=/);
});
