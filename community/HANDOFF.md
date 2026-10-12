# Community dashboards: handoff

Three standalone design previews (open the files in `dist/`, no server needed):

| File | Who | Access |
|---|---|---|
| `buzzin-admin.html` | Community admin | Everything, including settings, team, properties, reports |
| `buzzin-approver.html` | Approver | Only requests at their department and level, for their assigned properties; logs only if allowed |
| `buzzin-events.html` | Events manager | Separate event workspace (own data store) |

Source is in `src/`; `python3 build.py` rebuilds `dist/`. Figma scenes: `figma/` (see its README).

## Naming cleanup (old → new)
| Before | Now |
|---|---|
| Work permit "event" mixed into permits | Events is its own workspace and file |
| Admin / Manager / Approver mix | **Administrator** and **Approver** only |
| Stage / level wording | **Approval step** = department + level |
| Closure | **Final inspection**; "Close work" is the final action |
| AMC | **Maintenance contracts** |
| Security accounts | **Gate security** (guards using the gate app) |
| Employees | **Workers** |
| Tolerance (events) | **Check-in window** |

## Rules built into the prototype
- Approval path = permit type's departments × each property's levels, snapshotted per request.
- Approvers decide only at their own step and property; others are read-only. Out-of-scope requests and admin pages show "not available for your role".
- Approving needs the three checks ticked. Reject and Request changes need a reason (10+ characters). Warnings (expiring IDs, restricted days, limits) never block.
- Final approval issues a pass with a QR. Admins can approve all remaining steps at once.
- Every destructive or outward action has a confirmation popup.

## To port
Data lives in `wp-data.js` / `ev-data.js` (shape of your API). Page functions are `p…` in `wp-*.js` and `ev-pages.js`. Auth, email, PDF storage, QR issuing and payments are mocked.
