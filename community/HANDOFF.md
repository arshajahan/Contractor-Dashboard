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

## v2 changes (Reviewer role, payments, closure)
- **Gate security removed.** Replaced by a third team role, **Reviewer**: view-only plus extras an administrator switches on (access logs, issue passes, invite contractors, check people out by hand, mark work completed). Needs a name, email, designation, properties and at least one extra.
- **Approvals.** Everyone, administrators included, decides only at their own department and level. An administrator can be given **force approve** in Team & roles; it skips remaining steps, needs a reason and is written to the history.
- **Approval timeline** (who, when, comment) on every request and on the pass PDF.
- **Paid permits.** Permit types can be fixed fee, per worker or per vehicle trip by weight band. After the last approval the request is **Payment pending**; the contractor pays online, an administrator can record cash or card. Invoices live in **Payments**. The pass and QR are issued after payment.
- **Passes** list shows active, upcoming, expired, revoked, suspended and completed. Anyone allowed can **Mark as completed**; permit types with a final inspection send it to Final inspections, closed by the departments chosen on that permit type.
- **Maintenance contracts** are created automatically when an AMC permit is approved (contractor chooses frequency and visits). No manual creation.
- **Time limits.** People still inside after their permitted hours are flagged on dashboards and in Access logs, with manual check-out.
- **Contractors.** Invite by email (existing accounts get access at once) or share the link (sign-ups wait for approval). Each company has an activity timeline. Only the trade licence is required; insurance removed.
- **Properties** only edit approval levels (units come from the property system). Email attachments, gate-app link privacy and joining fee removed. "Keep contractor link private" is now "Hide your community from other contractors".
