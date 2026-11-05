import { createHash, timingSafeEqual } from 'node:crypto';
import { validateImagePrompt, readCloudflareImage } from '../../../lib/free-studio.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };
const MODEL = '@cf/black-forest-labs/flux-1-schnell';

function json(body, status = 200) {
  return Response.json(body, { status, headers: noStore });
}

function authorized(supplied, expected) {
  if (typeof supplied !== 'string' || supplied.length > 512 || !expected) return false;
  const one = createHash('sha256').update(supplied).digest();
  const two = createHash('sha256').update(expected).digest();
  return timingSafeEqual(one, two);
}

export async function POST(request) {
  // IMPORTANT: Cloudflare Workers Free rejects calls when the daily free
  // quota is exhausted. Never point this route at a paid Cloudflare plan
  // without reviewing costs first.
  const { CF_ACCOUNT_ID, CF_API_TOKEN, STUDIO_ACCESS_KEY, CLOUDFLARE_FREE_PLAN_CONFIRMED } = process.env;
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !STUDIO_ACCESS_KEY ||
      STUDIO_ACCESS_KEY.length < 16 || CLOUDFLARE_FREE_PLAN_CONFIRMED !== 'yes') {
    return json({ error: 'Free Image Studio is not configured yet. See docs/AI-MEDIA-STUDIO-FREE.md.' }, 503);
  }

  // Browser CSRF / cross-origin safeguard in addition to access-password protection.
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: 'Cross-origin requests are not allowed.' }, 403);
  }

  if (!authorized(request.headers.get('x-studio-access'), STUDIO_ACCESS_KEY)) {
    return json({ error: 'Studio access key is incorrect.' }, 401);
  }

  let body;
  try { body = await request.json(); } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }
  const prompt = validateImagePrompt(body?.prompt);
  if (!prompt) return json({ error: 'Write a prompt between 3 and 600 characters.' }, 400);

  // REST model endpoint verified against official Cloudflare documentation.
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(CF_ACCOUNT_ID)}/ai/run/${MODEL}`;
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, steps: 4 }),
      cache: 'no-store',
      signal: AbortSignal.timeout(55000),
    });
  } catch {
    return json({ error: 'Image service is temporarily unreachable.' }, 502);
  }
  if (!response.ok) {
    const status = response.status === 429 ? 429 : 502;
    return json({
      error: response.status === 429
        ? 'Cloudflare rate limit or free quota reached. Try again later.'
        : 'Cloudflare could not generate the image. Check the free plan and API token.',
    }, status);
  }
  let data;
  try { data = await response.json(); } catch {
    return json({ error: 'Unexpected image service response.' }, 502);
  }
  const image = readCloudflareImage(data);
  if (!image) return json({ error: 'The provider returned an unsupported image response.' }, 502);
  return json({ image, model: 'FLUX.1 Schnell', cost: 'Cloudflare Workers Free allocation' }, 200);
}
