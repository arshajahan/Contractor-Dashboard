# Buzzin Work Permit (Android app, design build)

One Android app for two kinds of account. Every screen is in, with dummy data. Nothing talks to a server.

| Sign in as | Email | Password | What you get |
|---|---|---|---|
| Contractor | alex@samplecontracting.ae | Contractor@123 | Contractor portal: communities, passes, request wizard, workers, vehicles, documents, signed terms, settings |
| Community admin | maya.khan@buzzin-community.example | Admin@123 | Full community workspace: review, passes, contractors, properties, reports, team, gate security, all settings |
| Community approver | omar.siddiqui@buzzin-community.example | Approver@123 | Only requests at Security · Level 1 for Buzzin offices |
| Community approver | daniel.okoro@buzzin-community.example | Approver@123 | Security · Level 2, plus access logs |
| Community approver | priya.rao@buzzin-community.example | Approver@123 | Operations · Level 1 |

The community account's **role** (admin or approver) comes from the account, so admin-only pages (settings, team, properties, reports) are not shown to approvers. The events module is not included.

## Get the APK
- **GitHub Actions (no setup):** Actions → "Buzzin Work Permit APK" → Run workflow → download `buzzin-work-permit-debug-apk`.
- **Android Studio:** open the `android/` folder, wait for Gradle sync, press Run.
- **Command line:** `cd android && ./gradlew assembleDebug` → `app/build/outputs/apk/debug/app-debug.apk` (needs the Android SDK).

## How it is built
The screens are web pages shown in an Android WebView (`android/.../MainActivity.kt`), bundled in `android/app/src/main/assets/www` and served from a local https address, so it works offline. Android Back closes popups first, then steps back through screens. Files can be picked from the phone, and generated PDFs are saved to Downloads.

Rebuild the bundled screens after editing `../redesign` (contractor) or `../community/src` (community): `python3 build.py`. To try it in a phone-size browser without Android, open `android/app/src/main/assets/www/index.html`.

## Not included yet
Real sign-in, a server, push notifications, camera capture (file picker only), and a release signing key.
