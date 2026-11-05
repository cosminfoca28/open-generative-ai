# Pre-installation security gate

This is a *triage checklist*, not a completed audit. Do not consider this fork hardened or safe for sensitive photos, personal accounts, or paid API credentials until the relevant code is reviewed and tested.

## Upstream items to review

1. **Studio history DOM injection / XSS**: https://github.com/Anil-matcha/Open-Generative-AI/issues/309
   - Inspect history rendering in `src/components/ImageStudio.js`, `VideoStudio.js`, `CinemaStudio.js`, `LipSyncStudio.js`.
   - Avoid unsanitized user-controlled strings in `innerHTML`. Prefer DOM element creation and `textContent`, safe property assignment and URL validation.
   - Review Electron `preload.js` IPC exposure, external-link handling and key storage.
   - Verify a fix with regression tests using harmless malformed data.
2. **Windows local image startup failure**: https://github.com/Anil-matcha/Open-Generative-AI/issues/356
   - Reported `sd-cli.exe` exit `0xC0000135`, potentially related to missing debug CRT libraries.
   - Validate executable provenance, release builds and hashes before bundling replacements.
3. **Third-party code**: `.gitmodules` specifies Vibe-Workflow, Open-Poe-AI and Open-AI-Design-Agent. Review their source, permissions and licensing. 
4. **Dependency review**: Inspect lockfile, `npm audit` and Electron/Next.js advisories; triage findings rather than blindly auto-fixing with breaking upgrades.
5. **Local execution**: Never expose a local inference HTTP/MCP server to the public internet without authentication, TLS and restricted permissions.
6. **Cloud usage**: Keep secrets out of Git, logs and browser storage where possible. Never turn on paid APIs without user authorization.

## Acceptance criteria before normal use

- [ ] Windows GPU/VRAM identified
- [ ] XSS sinks inspected and regression-tested
- [ ] Electron IPC and external URLs reviewed
- [ ] Windows local inference binary tested from verified build
- [ ] Submodules and dependencies reviewed
- [ ] A local no-secret image smoke test documented
- [ ] Cloud credentials and spend remain disabled by default
