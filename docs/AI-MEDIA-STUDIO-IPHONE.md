# iPhone / mobile version — implementation status

## Goal

Access our **own** fork of Open Generative AI through Safari on an iPhone, add it to the home screen, navigate Image, Video, Cinema and Workflows easily, and use an appropriately configured generation backend.

## Implementation in this branch

- Existing Next.js browser studio retained at `/studio`.
- Mobile bottom navigation with four quick tool entries and "More".
- PWA manifest and monochrome app icon.
- iOS safe-area / dynamic viewport styling.
- Apple standalone web app metadata.
- No paid API calls enabled and no image/video inference backend modified.

## Important limitations

1. **A GitHub repository is not a live website.** The website must first be built and deployed to a suitable host over HTTPS, and any server API routes must be supported.
2. An iPhone cannot run the heavyweight desktop inference engines bundled for Electron/Windows. Image/video generation will need a **remote provider** or a separate GPU server.
3. Cloud generation with Muapi or similar may consume paid credits. Do not add an API key unless you accept the cost and trust the security posture.
4. The project has upstream security report #309 about unsanitized studio history and issue #356 about Windows local inference. Review these and the web studio package before public launch.
5. A Safari Home Screen shortcut is **not** an App Store app. It can feel app-like but requires an HTTPS site and an internet connection for generation.
6. The new mobile navigation and PWA metadata have **not yet been verified on a real iPhone**.
7. Safari may require a square raster PNG for the best Home Screen icon; a fallback SVG manifest icon is currently included. Add checked PNG assets before launch.
8. Installing from Safari: open the verified HTTPS website in Safari > Share > Add to Home Screen.

## Deployment preparation

- Prefer a private/password-protected staging environment first.
- Verify Next.js `app/api` handlers and all `packages` submodules are supported by the deployment platform.
- Run the full build and mobile browser tests (portrait, keyboard, file upload, model selection, download, storage and session behavior).
- Fix/review any security findings prior to a publicly accessible deploy.
- Keep secrets server-side; avoid shipping provider keys to frontend source bundles.
- Only after this, set `/studio` as the mobile entry point and share the live URL.

## Acceptance tests

- [ ] CI dependency/build check passes
- [ ] No critical unmitigated security issue is exposed
- [ ] iPhone Safari loads /studio without horizontal page overflow
- [ ] Bottom navigation selects Image, Video, Cinema, Workflows; More opens original drawer
- [ ] Safe-area inset is respected on iPhone with home indicator
- [ ] File upload from iOS Photos works
- [ ] Image/video generation completes through an authorized backend (if configured)
- [ ] No hidden cloud charges
- [ ] Share > Add to Home Screen opens standalone app
