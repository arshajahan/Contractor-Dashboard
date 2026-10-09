# Redesign handoff

Open `redesign/index.html` in a browser (double-click works). Everything is sample data saved in your browser only. Add `#settings`, `#permits` etc. to the URL to jump to a screen.

Files:
- `styles.css`: all design tokens (colours, radius, shadows) are at the top in `:root`, with dark-mode values below them. Copy these first.
- `app.js`: screens, sample data and behaviour. Each screen is one function (`pHome`, `pPermits`, `pSettings` …).

## Design rules

| Thing | Rule |
|---|---|
| Buttons | 36px tall (small: 30px), 8px radius, 14px semibold. Only one amber (primary) button per area. Secondary = white with border. Ghost = text only. Danger = red. |
| Inputs | 38px tall, 8px radius, label above, hint or error below. Required fields marked with a red `*`. |
| Cards | 12px radius, 1px border, very light shadow. Header / body / footer sections. |
| Status | Pills with a dot: grey Draft, blue Under review, amber Changes requested, green Approved, red Expired. |
| Font | Figtree (UI), JetBrains Mono (references like BZ-1048). |
| Confirmation | Every submit, delete, remove, cancel, sign-out and security change opens a confirmation popup. Deletes show an Undo toast. |

## Navigation (kept from the live portal)

Passes: Overview, Authorized passes, Request pass · Resources: Employees, Vehicles, Settings · Support: Help & contact.
Community picker is now a **searchable dropdown** in the top bar (with "Request access" and "Manage communities").

## Settings: every live field is kept

| Live portal (vpm.buzz-in.co/#/settings) | Redesign |
|---|---|
| Company Details: Company name*, TRN (8–15 digits), Trade Licence* (file + delete), Trade Licence Expiry Date, Logo (+ delete) | Settings › Company & billing › Company details (same fields; delete now asks to confirm; expiry is required and reminds 30 days ahead) |
| Billing Information: Legal Name*, Address Line 1*, Address Line 2, Country*, State*, City*, Postal Code* | Settings › Company & billing › Billing information (State list depends on Country, City list depends on State) |
| Change Password: Password*, Confirm Password* | Settings › Password & security (adds Current password, strength meter, rules, show/hide, confirm popup) |
| Update Your Profile: Name*, Email Address*, Phone Number | Settings › My profile (same fields, plus photo, job title, language, time zone, date format) |
| Separate "Save Changes" button per card | One sticky "Unsaved changes · Discard · Save" bar; leaving the page with unsaved changes asks first |

New settings sections: Company documents (insurance, VAT certificate… with expiry status), Team members (invite, roles, remove), Communities (switch, leave, request access), Notifications (email / SMS / in-portal per event), Two-step verification, Signed-in devices, Deactivate account.

## Old prototype screen → new location

| ChatGPT prototype | Redesign |
|---|---|
| home | Overview: KPIs, draft, recent passes, upcoming work, expiring documents |
| permits, filters | Authorized passes: status tabs, search, filter drawer, row action menu |
| type, permitChecklist | Request pass + "Before you start" checklist popup |
| details, validation, unit | Work details step (unit picker is a searchable multi-select) |
| materials, addMaterial | Materials step + Add/Edit item popup, remove with Undo |
| workvehicles, personnel | Vehicles step, Workers step (expired IDs/registrations are blocked) |
| documents, documentsNoExpiry | Documents step (upload, replace, remove, expiry or "No expiry date") |
| pdf, sign, pdfSaved | Fill & sign step + signature popup (draw or type) |
| review, submitted | Review & submit → confirmation popup → Request submitted |
| pending, approved, changes | Pass detail page (status timeline, QR, documents, "Update and resubmit") |
| people, addPerson | Employees + Add/Edit employee popup |
| vehicles, addVehicle | Vehicles + Add/Edit vehicle popup |
| settings, password | Settings (see above) |
| community | Community dropdown in the top bar |
| help, completion, visitor, menu | Help & contact, Final inspection, Visitor pass, mobile "More" drawer |

## Confirmation popups

Submit request · Resubmit after changes · Submit visitor pass · Send inspection request (warns if checklist incomplete) · Send message to community · Delete draft · Start new request when a draft exists · Duplicate (replaces draft) · Withdraw request / Cancel pass (with reason) · Remove material / employee / vehicle / uploaded file / logo / signature / company document / team member · Change team role · Save company details · Change email · Change password · Turn 2-step verification on/off · Sign out device / all devices · Sign out · Switch community during a request · Leave community (type LEAVE) · Withdraw access request · Deactivate account (type DEACTIVATE) · Discard unsaved changes · Leave page with unsaved changes · Share QR codes.
