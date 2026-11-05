# Shared AI-tool integration approach

## What GitHub does (and does not do)

GitHub hosts code and reviewed changes. It does **not** host the Windows desktop application automatically or provide an AI inference API by itself.

## Codex

Use the GitHub fork as the source repo. `AGENTS.md` contains task-level instructions. Codex may inspect/change code, prepare tests and PRs. It can run local inference only when executing on a compatible machine with access to the runtime/GPU.

## Claude Code

Clone the same fork and consult `CLAUDE.md` + `AGENTS.md`. Share changes via Git branches and PRs. Test any MCP adapter against a real running service.

## ChatGPT

Direct GitHub access helps with code management, not desktop control. For actual image/video generation from ChatGPT, a supported connector to a **reachable, authenticated service** would be needed. Do not assume that a localhost URL is reachable from ChatGPT, and don't expose local endpoints publicly without a secure bridge.

## Generation backends

- Local image: native desktop sd.cpp workflow, subject to hardware and Windows issue #356.
- Local video: Wan2GP or another compatible GPU backend, conditional on VRAM and model license.
- Cloud: Muapi.ai or other provider, subject to prices, quotas and explicit authorization.
- No Higgsfield dependency.

## Planned API/MCP capability contract (NOT IMPLEMENTED)

- `list_models`: list genuinely available local and/or user-authorized cloud models
- `create_image`: accepted prompt and model, returns task ID
- `create_video`: accepted request, returns task ID
- `get_job`: task status and errors
- `get_result`: completed media and metadata

Do not claim these endpoints exist in this fork today. First inspect upstream code and official protocol support. Require access control, spending guards, input validation and rate limiting for any new service.
