# AI Media Studio — coding-agent instructions

This repository is a fork of [Anil-matcha/Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI), licensed MIT. Preserve upstream attribution and LICENSE.

## Goal
Develop a maintainable personal AI image/video studio for Windows, with future Codex, Claude Code and optional ChatGPT integrations. Do not depend on Higgsfield. Prefer local, free inference when compatible, and never promise that premium cloud models are free.

## Repository facts
- Root `package.json` version is 2.0.0 with Next.js, Vite and Electron scripts.
- This repo uses three Git submodules declared in `.gitmodules`.
- Upstream is NOT your deployment: GitHub hosts source code, not a running inference service.
- Cloud model calls may require Muapi credentials and credits.
- The target user has Windows with 8 GB of system RAM and an **unknown GPU**. Never assume dedicated VRAM.

## Safety rules
1. Audit before execution. Known upstream reports include XSS in studio history (issue #309) and Windows sd.cpp engine launch failure (issue #356). Verify current code and any fixes, do not assume either is resolved.
2. Do not run unreviewed installers, downloaded executables, or unknown scripts silently.
3. No API spending or deployment without explicit user approval. Do not create paid cloud resources.
4. Do not commit API keys, `.env` files, credentials, prompts containing private data, model weights, media outputs, or customer assets.
5. Changes go to a task branch and a reviewable pull request; avoid direct pushes to `main`.
6. Never remove copyright/license attribution; check third-party model and submodule licenses independently.
7. Do not present a working remote MCP/ChatGPT integration until tested end-to-end, authenticated, and securely hosted.
8. Work stepwise and report verification evidence, blockers and exact files changed.

## First tasks
- Inspect `README.md`, `package.json`, `.gitmodules`, `src/components`, `electron` and local model docs.
- Confirm OS/GPU/RAM with `scripts/check-windows-hardware.ps1` on the actual Windows PC; don't claim to inspect the owner's PC from a remote GitHub session.
- Review XSS sinks and Windows local engine issue before using personal media or real API credentials.
- Prefer a lightweight local image test before any local video test.
- Check official docs and upstream changes before making API/MCP adapters.

## Relevant docs
- `docs/AI-MEDIA-STUDIO-WINDOWS.md`
- `docs/AI-MEDIA-STUDIO-SECURITY.md`
- `docs/AI-MEDIA-STUDIO-INTEGRATIONS.md`
