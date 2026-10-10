# Import the redesign into Figma (editable)

This folder turns the HTML redesign into **editable Figma layers**: frames, text you can retype, vector icons, and colour styles. Nothing is uploaded anywhere. The plugin only runs inside your own Figma file.

## What you get

- **63 desktop screens** (1440 px wide) and **43 mobile screens** (390 px wide). That covers every page, every popup and confirmation, the community dropdown and menus, the dark mode, the All communities page, access states, document checks, the Sign terms step and community logos. The PDF pages and signatures come in as images.
- **56 colour styles** named `Buzzin/Light/…` and `Buzzin/Dark/…` (brand, text, borders, success, warning, error and the rest).
- Layers are named by role, for example `Button/primary – Submit request`, `Card`, `Field`, `Modal` and `Community dropdown`.

## Steps (about 5 minutes)

You need the **Figma desktop app**. Development plugins can't be loaded in the browser version.

1. Download this repo: on GitHub, choose **Code → Download ZIP**, then unzip it.
2. Open the Figma desktop app and create a new design file, or open an existing one.
3. Menu: **Plugins → Development → Import plugin from manifest…**
4. Choose `redesign/figma/manifest.json`.
5. Run it: **Plugins → Development → Buzzin redesign importer**.
6. Click **Choose buzzin-redesign-scenes.json** and pick the file from this folder.
7. Leave Desktop, Mobile and Colour styles ticked, then click **Import editable screens**.
8. Wait about 1–2 minutes. The screens appear in three sections on the current page.

Running it again adds another copy of the screens. Colour styles are updated, not duplicated.

## Good to know

- **Fonts:** the screens use Figtree, JetBrains Mono and Caveat, which are free Google fonts. Figma usually has them. If a font is missing, the plugin uses Inter instead.
- **Layout:** layers keep their exact position and size, but they are not Auto Layout components. Turn the pieces you reuse (buttons, inputs, cards) into components after importing.
- **Screens are a snapshot** of `redesign/index.html`. After you change the HTML, regenerate the scenes file with `node redesign/figma/tools/capture.js` (needs Node.js and `npm i playwright`).
