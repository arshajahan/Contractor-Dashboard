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

New settings sections: Company documents (insurance, VAT certificate… with expiry status), Communities (switch, leave, request access), Notifications (email / SMS / in-portal per event), Two-step verification, Deactivate account. (No Team members or signed-in devices sections.)

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
| pdf, sign, pdfSaved | Sign terms step: the community's own PDF with tick boxes, then name, position and a drawn or uploaded signature (see below) |
| review, submitted | Review & submit → confirmation popup → Request submitted |
| pending, approved, changes | Pass detail page (status timeline, QR, documents, "Update and resubmit") |
| people, addPerson | Employees + Add/Edit employee popup |
| vehicles, addVehicle | Vehicles + Add/Edit vehicle popup |
| settings, password | Settings (see above) |
| community | Community dropdown in the top bar |
| help, completion, visitor, menu | Help & contact, Final inspection, Visitor pass, mobile "More" drawer |

## Community terms PDF (new)

**Community admin side** (`#admin-forms`, or account menu › Community admin view):
1. Upload the community's terms / guidelines as a PDF.
2. Click next to each clause to place a tick box. Drag to move, arrow keys to nudge, Delete to remove. Each box has a label, Required on/off and a size.
3. Choose where the signature goes: bottom of the last page, or a new last page.
4. Choose which permit types need it, then **Publish**. Each publish is a new version. Contractors who haven't submitted yet sign the new version. Submitted requests keep the version they signed.

**Contractor side** (step 6, "Sign terms"):
- The PDF is shown page by page with the tick boxes on top. Every required box must be ticked. Missing ones turn red.
- Then the contractor enters their full name and position, adds a signature by **drawing** or **uploading a PNG/JPG** (there is no typed signature), and confirms they are authorised to sign. Uploaded images get their white background removed automatically, which can be switched off.
- **Download signed PDF** produces the real file: ticks drawn into each box, plus a block at the bottom with company, name, position, date and signature, and a reference line (date, boxes ticked, version, request reference).

Implementation notes: store each form's PDF, field positions as % of page size, and published version snapshots. Store the signed PDF (or the inputs to regenerate it) with the submitted request. The prototype uses pdf.js to show the PDF and pdf-lib to stamp it (both in `redesign/vendor/`). The sample PDF is in `redesign/samples/`.

## Company logo

- Accepts PNG (including transparent), JPG, SVG and WebP, up to 5 MB. It is resized to at most 480 px on its longest side.
- It always shows inside a fixed tile with `object-fit: contain`, so wide, tall and square logos fit without cropping or stretching. Tiles are 176 × 84 px in Settings and 52 × 36 px in the sidebar.
- **Background:** the tile is dark for white or light logos on a transparent background, and light for everything else. The average brightness of the visible pixels decides. The contractor can override it with Light or Dark. Store `{ image, tone, bg }`.
- With no logo, the company initials are shown.

## Community logo (co-branding)

- Each community has its own logo, uploaded by community staff on the admin side under **Community profile**. The same rules apply as for company logos: any image type, shown contained, automatic light or dark background, with an override.
- Contractors see it at the top of the sidebar, as the logo only with no Buzzin wordmark and no name, because the name is in the top bar. It also shows in the community dropdown in the top bar and in the community list. It changes when they switch community.
- Communities without a logo show their initials.

## Expiry rule

- **Expired** documents (worker ID, vehicle registration, uploaded permit documents) block the request.
- Documents **close to expiry** (within 30 days, or ending before the work ends) never block. The contractor sees a warning with the number of days left: the community may reject the permit, so please upload an updated document if you have one. The warning appears on the Vehicles, Workers, Documents and Review steps as soon as an item is selected.
- Pressing **Continue** on those steps opens a popup that lists each item and its days left, with **OK, continue** or **Stay and update**. The submit confirmation repeats the list.
- An expired trade licence or required company document blocks submission, with a link to Settings.

## Confirmation popups

Submit request · Resubmit after changes · Submit visitor pass · Send inspection request (warns if checklist incomplete) · Send message to community · Delete draft · Start new request when a draft exists · Duplicate (replaces draft) · Withdraw request / Cancel pass (with reason) · Remove material / employee / vehicle / uploaded file / logo / signature / company document · Save company details · Change email · Change password · Turn 2-step verification on/off · Sign out · Switch community during a request · Leave community (type LEAVE) · Withdraw access request · Deactivate account (type DEACTIVATE) · Discard unsaved changes · Leave page with unsaved changes · Share QR codes. · Admin: delete tick box · replace PDF · publish version · delete form. · Continue with documents close to expiry.
