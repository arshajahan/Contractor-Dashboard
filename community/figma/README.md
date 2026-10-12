# Figma import (community dashboards)
Same steps as the contractor import: Figma desktop → Plugins → Development → Import plugin from manifest → `community/figma/manifest.json`. Run it and choose one scenes file per run:
`buzzin-admin-scenes.json` (86 screens), `buzzin-approver-scenes.json` (33), `buzzin-events-scenes.json` (46). Each has desktop and mobile frames, popups and a dark-mode screen.
Regenerate after changes: `python3 community/build.py && node community/figma/tools/capture.js`.
