# Buzzin contractor dashboard — redesigned locally

Start with **prototype.html**. Double-click it to open the interactive preview. Narrow the window to see the mobile app layout. The sample community is **Buzzin community** throughout.

## What is included

- 33 desktop screens, 33 mobile app screens, and 5 tablet examples.
- App-style mobile layout: compact app header, bottom navigation, scrollable content and fixed action bars.
- Materials: labelled + Add item, item count, multiple items, edit, remove and undo, quantity validation, and a None needed option.
- Early document checklist, named required/optional document cards, upload controls, and No expiry date with a disabled date field.
- Guided document pages, notes, signature drawing or typing, final review, submission notice, review status, changes requested and approval/QR placeholder.
- People, vehicles, company documents, account settings, visitor pass and final inspection design screens.

## Import to Figma — two options

**Quick visual import:** open the SVG/Mobile, SVG/Desktop or SVG/Tablet folder and drag the SVG files onto a Figma canvas. These are vector screen exports, not screenshots. Figma's SVG handling may convert text; use the native importer below for editable text.

**Native editable layers:** in the Figma desktop app, open your design file. Open Plugins > Development > Import plugin from manifest and select Figma-import/manifest.json. Run Buzzin — Import editable redesign. Choose figma-scenes.json, select Mobile, Desktop, Tablet or All, then click Import editable screens. The importer creates native text, frame and vector layers in the current page, alongside existing work. It also links navigation actions between imported screens. No Figma connector subscription or external network calls are used by this local importer.

This is a local development plugin. If your organization disallows development plugins, use the SVG import instead. Avoid importing repeatedly unless you want duplicate screen sets. The importer preserves visual geometry in nested frames; imported layers do not form a complete reusable Auto Layout component library.

## Preview behavior and limits

This is an interactive design prototype, not a production dashboard. It does not submit permits, send emails, verify IDs, issue QR codes, change passwords, upload to a server, or legally sign documents. The notice identifies it as a preview.

Draft fields, material items, no-expiry choices and sample signatures persist in this browser's local storage. File names persist; file bytes are not retained after closing the page. Previewing an uploaded file works only during the current session. All data and identities are fictional samples. The 10 MB limit and two-day notice period are illustrative; implementation must read actual community configuration.

The PDF flow is a design of filling designated fields and adding notes/signatures on multiple sample pages. It is not a full PDF editing engine. Actual source terms, document version storage, editable PDF fields, signature evidence, file storage, approval and QR generation need implementation.

Some secondary actions intentionally display a preview notice. Primary material editing, document expiry toggling, selection/upload validation, typed/drawn signature saving, page navigation, draft persistence and the sample submission flow are interactive. Review summaries include sample content and need to be connected to actual draft values in implementation.

## Implementation rules

- Document requirements and templates depend on both community and permit type; hide unnamed document slots.
- Persist an explicit no-expiry flag, rather than inventing a distant expiry date. Community rules control which document types allow it.
- Validate worker/vehicle documents against work dates, dependent property/unit selections, configured lead times, hours and restricted days.
- Save changes across pages. Show saving, saved and retryable failure states. Reconfirm signatures when signed content changes. Block duplicate submissions and unsaved or incomplete documents.
- Show community review acknowledgement after successful submission. Provide the configured community support email and the request reference. Do not invent contact details or a promised approval time.
- Support readable labels, keyboard navigation, contextual errors, accessible announcements and large touch targets.

## Research used

The existing live materials flow was checked: its add control was unlabelled and produced another item row. The redesign makes that action explicit and repeatable. Form guidance follows [W3C form accessibility guidance](https://www.w3.org/WAI/tutorials/forms/) and mobile navigation/grouping follows [Android's Material component guidance](https://developer.android.com/design/ui/mobile/guides/components/material-overview).

Previews/ contains rendered examples. SVG/ contains all exported views. figma-scenes.json and Figma-import/ are the editable import package. Long desktop screens scroll vertically; mobile frames keep the app viewport and use an internal scroll region.
