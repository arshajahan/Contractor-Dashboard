# Figma import (community dashboards and contractor)
Figma desktop → Plugins → Development → Import plugin from manifest → `community/figma/manifest.json`. Run it and choose one scenes file per run:

| File | Screens |
|---|---|
| `buzzin-admin-scenes.json` | 124 |
| `buzzin-approver-scenes.json` | 34 |
| `buzzin-reviewer-scenes.json` | 20 |
| `buzzin-redesign-scenes.json` (contractor, in `redesign/figma/`) | 105 |
| `buzzin-events-scenes.json` (separate events workspace, not in the Android app) | 46 |

Each file has desktop and mobile frames, popups and a dark-mode screen.
Regenerate after changes: `python3 community/build.py && node community/figma/tools/capture.js` (contractor: `node redesign/figma/tools/capture.js`).
