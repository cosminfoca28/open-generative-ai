# Windows setup — AI Media Studio fork

Repository: https://github.com/cosminfoca28/open-generative-ai  
Original project: https://github.com/Anil-matcha/Open-Generative-AI

## Status

The GitHub fork contains source code. **This guide does not mean the Windows app is installed or tested.** Target machine: Windows, 8 GB RAM, GPU not yet known.

## 1. Diagnose the actual laptop (read-only)

Open PowerShell. Run the bundled script after reviewing it:

```powershell
Set-Location <PATH-TO-CLONED-REPO>
powershell -NoProfile -File .\scripts\check-windows-hardware.ps1
```

Look for GPU name and **dedicated video memory**. Windows system RAM (8 GB) is not the same as GPU VRAM. Do not enable local video until compatibility is confirmed.

## 2. Clone your fork with submodules

Install Git and Node.js (an appropriate supported LTS release). After reviewing prerequisites:

```powershell
git clone --recurse-submodules https://github.com/cosminfoca28/open-generative-ai.git
cd open-generative-ai
git remote add upstream https://github.com/Anil-matcha/Open-Generative-AI.git
git fetch upstream
git submodule status
```

To test the setup branch before merging:

```powershell
git fetch origin
git switch setup/ai-media-studio
```

If you cloned before the branch existed, use `git fetch origin` first. Never run an unknown command just because it is in a repository: inspect scripts and dependencies.

## 3. Installation after code and dependency review

The **upstream** `package.json` currently lists:

```powershell
npm run setup
npm run electron:dev
```

`setup` updates submodules, installs npm packages and builds workspaces. `electron:dev` builds the Vite UI and starts Electron. Those commands should run **only after** inspecting the dependencies and reviewing known security reports. No installation has been executed in this GitHub-only setup.

## 4. Image-first test

If hardware and Windows local engine are compatible:

1. Launch desktop UI.
2. Open Settings > Local Models.
3. Install the supported local inference engine only from verified official sources.
4. Try a lightweight Stable Diffusion 1.5-family model, e.g. Dreamshaper 8 (subject to official model license).
5. Choose Image Studio > Local.
6. Generate a 512x512 image with conservative steps; log success/failure and memory use.

Windows local image inference has a known reported startup issue: https://github.com/Anil-matcha/Open-Generative-AI/issues/356 . Do not apply random binary replacements from comments without provenance/security checks.

## 5. Video

Local video needs suitable GPU acceleration and enough VRAM; 8 GB of system RAM by itself is insufficient evidence. Wan2GP can be configured later after hardware checks. Cloud providers such as Muapi may charge per generation.

## 6. Keep the fork up to date

Use a separate branch to review upstream changes:

```powershell
git fetch upstream
git switch main
git merge --ff-only upstream/main
```

Use `--ff-only` only when your local `main` has no diverging commits. If it fails, stop and inspect the histories; do not force push. Bring tested changes into your feature branches through reviewed PRs.
