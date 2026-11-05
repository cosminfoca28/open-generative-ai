# Free Image Studio — iPhone deployment

## What is implemented

- A mobile-first route at `/free-studio` within the existing Open Generative AI fork.
- Image generation via **Cloudflare Workers AI / FLUX.1 Schnell** on a Cloudflare **Workers Free** account.
- Cloudflare API credentials remain on the Next.js server (such as Netlify runtime), not in browser code.
- The generation endpoint requires a separate studio access password and an explicit Free-plan confirmation environment variable.
- A video information tab honestly states that free video generation is not yet implemented.
- Provider secrets, model weights, and sensitive files must not be committed to GitHub.

## Free versus paid

Cloudflare's current Workers Free allocation is **10,000 Neurons/day**, with requests rejected after the free allocation is used. This is a quota, **not unlimited generation**. Do **not** change the Cloudflare account to Workers Paid unless you explicitly accept that usage can incur costs. This app does not guarantee zero cost on a paid Cloudflare account.

Official references:
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers-ai/models/flux-1-schnell/
- https://developers.cloudflare.com/api/resources/ai/methods/run/

No free, unlimited, sustainable hosted video model has been verified for this implementation; the video tab is informational only.

## Setup — Cloudflare account and API token

1. Create/login to a Cloudflare account at https://dash.cloudflare.com.
2. Keep your **Workers plan Free**; check billing before proceeding.
3. Find the **account ID** in your Cloudflare dashboard.
4. Create a Cloudflare API token scoped only to **Workers AI Read** or **Workers AI Write** for this account, as required by the API.
5. Set a **different strong 24+ character studio password** for private access to the image generator.

## Set environment variables on the hosting service (Netlify)

Create the following as **secret runtime variables** (Functions + Builds scopes where applicable):

```
CF_ACCOUNT_ID=<your_32_character_Cloudflare_account_id>
CF_API_TOKEN=<private_Cloudflare_Workers_AI_API_token>
STUDIO_ACCESS_KEY=<strong_private_studio_password>
CLOUDFLARE_FREE_PLAN_CONFIRMED=yes
```

Never prefix any secret with `NEXT_PUBLIC_`; never put secrets in a `netlify.toml` file, a public GitHub file, or a prompt to an AI assistant.

**Deployment must be triggered after setting variables.** Runtime variables need a fresh deployment.

On Netlify, Next.js route handlers use server-side functions through the OpenNext adapter. Confirm it builds before sharing the address. Keep the original unsecured studio and any other routes out of public production until the known upstream history-rendering XSS report (#309) and session/API key handling are reviewed.

## Start on iPhone

After deploying the verified HTTPS version, open:

```
https://<your-host>/free-studio
```

Enter the private Studio Access Key when generating (do **not** enter the Cloudflare API token in the browser). The key is only held in page memory and is not saved locally by our page.

Then use **Safari > Share > Add to Home Screen**.

## Test checklist

- [ ] `node --test tests/freeStudio.test.mjs` passes
- [ ] Next.js production build passes
- [ ] HTTPS hosting works for `/free-studio`
- [ ] API rejects calls without a configured studio password (HTTP 503)
- [ ] API rejects unauthorized calls (HTTP 401)
- [ ] Correct password and Free-plan Cloudflare config successfully return a JPEG
- [ ] Generation fails safely when the daily Cloudflare free quota is exhausted
- [ ] Download/Save to Photos works on iPhone
- [ ] No provider tokens or credentials appear in client-side JS, logs or git
- [ ] Public sharing is restricted until repository security audit is complete

## Coordination with Claude

- Claude's existing PR #2 addresses **Netlify build only**. Do not overwrite that PR or edit `netlify.toml` on this branch.
- PR #1 adds Codex/Claude setup docs, PR #3 adds general mobile navigation. These can be reviewed independently.
- This free-studio route is intentionally **independent**, so Claude can test a Netlify deployment and GitHub PRs can be merged after review with fewer conflicts.
- Claude's next task: examine PR #2 alongside this branch, run `npm run setup`, `node --test tests/freeStudio.test.mjs`, `npm run build`, report failures and fix on a **separate task branch**. Audit upstream issue #309 before public deployment. Do not spend API credits or upload private media.
