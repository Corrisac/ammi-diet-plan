# Ammi's Diet Plan

A one-page offline meal plan for a phone home screen. Shows one day at a time,
defaulting to today. Every meal is editable and edits are kept on the phone.

No build step, no framework, no npm, no server, no accounts. Six files:

| File | What it is |
| --- | --- |
| `index.html` | The whole app — markup, styles and script |
| `manifest.json` | Makes it installable to a home screen |
| `sw.js` | Cache-first service worker, so it works with no signal |
| `icon-192.png`, `icon-512.png` | Home-screen icons |
| `README.md` | This file |

Double-clicking `index.html` opens it and everything works except the offline
cache — service workers need `http(s)`, so that part only switches on once it's
hosted.

## It's live

**https://corrisac.github.io/ammi-diet-plan/**

Send that link over WhatsApp, then add it to her home screen (see below).

To publish updates, just `git push` — Pages rebuilds in under a minute.

<details>
<summary>How it was published, for reference</summary>

1. `git init && git add . && git commit -m "Ammi's diet plan"`
2. Create a new **public** repo and push to it:
   ```
   git remote add origin https://github.com/<user>/<repo>.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source: Deploy from a branch**, branch `main`,
   folder `/ (root)`. Save.
4. Wait about a minute for `https://<user>.github.io/<repo>/` to answer.

</details>

## Getting it onto her phone

1. Send the link over WhatsApp.
2. On her phone, add it to the home screen:
   - **iPhone:** Share button → *Add to Home Screen*
   - **Android:** the *Install app* prompt, or ⋮ menu → *Add to Home screen*

### The one thing that goes wrong on iPhone

**iOS only offers "Add to Home Screen" in Safari.** Tapping the link inside
WhatsApp opens WhatsApp's own browser, which has no such option, and she'll
conclude it's broken.

Tell her: open the link, then tap the ⋯ or compass icon in the corner and choose
**Open in Safari** first. Add it to the home screen from there.

Once it's on the home screen it opens full-screen with no browser bars, and
works with no signal, on a plane, or with mobile data off.

## Using it

- **Previous / Next** step one day back or forward. Swiping the meal list
  sideways does the same. **Back to today** appears once she's moved away.
- **Edit** turns the five meals into text boxes on the same screen. **Save
  changes** keeps them; **Cancel** throws them away.
- Edits belong to the **weekday**, not the date. Changing Wednesday's lunch
  changes it for every Wednesday. It's a repeating weekly plan.
- **Save a backup** downloads a `.json` file. **Restore from backup** reads one
  back. **Reset to original plan** puts the built-in plan back, after a confirm.

Everything lives in that one phone's browser storage. There's no account and no
sync, so a backup is the only way to move the plan to a new phone.

## Changing the built-in plan

Edit `DEFAULT_PLAN` near the top of the `<script>` block in `index.html`. That's
the plan new installs start from and the one **Reset to original plan** restores.
It does not touch a phone where she has already made her own edits.

## Shipping an update

Browsers cache the app aggressively — that's the point. After changing
`index.html`, bump `CACHE_VERSION` at the top of `sw.js`:

```js
const CACHE_VERSION = 'diet-plan-v2';
```

Without that bump, installed phones keep serving the old cached copy. Her saved
meals are stored separately from the cache and survive the update.

## Regenerating the icons

The PNGs are checked in, so nothing needs to run. They're a paper-white bowl on
enamel green with a turmeric mound — no text, because text is unreadable at
48px on a home screen. The mark stays inside the middle 80% of the canvas so
Android's maskable crop can't clip it.
