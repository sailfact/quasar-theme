# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A VS Code color theme extension (`quasar-theme`). No runtime code — the extension is
purely declarative: `package.json` `contributes.themes` points VS Code at a single
theme JSON file. There is no `main` entry point, no activation, no tests.

## Running / debugging

Press `F5` (launch config `Extension` in [.vscode/launch.json](.vscode/launch.json)) to open an
Extension Development Host with the theme loaded. Pick it via `Preferences: Color Theme`.
Edits to the theme JSON apply live in that window.

To inspect which TextMate scope a token has, run `Developer: Inspect Editor Tokens and Scopes`
in the dev host — that is how you find the right `scope` string before touching `tokenColors`.

## Two sources of truth — read before editing colors

Colors currently live in two files that are **not** in sync:

- [themes/Quasar-color-theme.json](themes/Quasar-color-theme.json) — the file VS Code actually loads.
  637 `colors` keys, 42 `tokenColors`, 26 `semanticTokenColors`. Hand-written, committed. **This is
  what ships.**
- [src/quasar.yml](src/quasar.yml) — an in-progress migration to a generated pipeline. Only 194
  `colors` keys and 27 `tokenColors` — a strict *subset* of the JSON (zero keys exist in the YAML
  that aren't in the JSON). Nothing consumes it yet.

**Consequence:** editing only `src/quasar.yml` changes nothing the user sees. To ship a color change
today, edit the JSON. If you also want the YAML source to stay honest, mirror the change there.
Do not assume the YAML can regenerate the JSON — it would drop 443 keys.

The YAML uses anchors for the palette under the `quasar:` key (`base`, `ui`, `ansi`) and references
them as `*RED`, `*BG`, etc. Add a new color by defining an anchor in `quasar.base`/`quasar.ui` and
aliasing it, rather than inlining a hex literal — that is the whole point of the YAML layer.

The shipped JSON has a trailing comma (end of the `colors` object, ~line 641). VS Code parses theme
files as JSONC so it loads fine, but strict `JSON.parse` fails on it. Don't "fix" it by reformatting
the whole file — that produces an unreviewable diff.

## Build scripts (currently broken)

[scripts/](scripts/) was copied from the Dracula theme repo and has **never been wired up**:

- `package.json` declares no `scripts` and no `dependencies`, yet the scripts require `js-yaml` and
  `tinycolor2`. There is no `node_modules`.
- [scripts/generate.js](scripts/generate.js) reads `src/dracula.yml` — that file does not exist
  (it's `src/quasar.yml`).
- `transformSoft` reads `theme.dracula.ansi` and `theme.dracula.brightOther`; the YAML's key is
  `quasar`, and it has no `brightOther` list.
- [scripts/build.js](scripts/build.js) writes `theme/quasar.json` and `theme/quasar-soft.json`, but
  `package.json` points at `themes/Quasar-color-theme.json` (different directory, different name).

So `node scripts/build.js` fails, and even if it ran, its output would not be the file that ships.
Adopting the pipeline means reconciling all four points above *and* backfilling the 443 missing keys
into the YAML. Treat that as a deliberate project, not an incidental fix.

`scripts/lint.js` scrapes https://code.visualstudio.com/api/references/theme-color at runtime and
warns about theme keys VS Code no longer supports plus keys the theme is missing. Useful, but it runs
against `generate()` output, so it is blocked by the same breakage.

## Packaging

`npm run package` (wraps `vsce package`) produces a ~20 KB VSIX with zero warnings. `npm run publish`
runs `vsce publish` — that needs a Personal Access Token for the `sailfact` publisher.

The extension has no build step. `package.json` `contributes.themes` points straight at the committed
theme JSON, so packaging is just a zip. `devDependencies` lists `@vscode/vsce` only; nothing else is
needed to ship.

`.vscodeignore` excludes `src/`, `scripts/`, `CLAUDE.md` and all of `images/` except `images/icon.png`
(a copy of the real 128x128 mark, which VS Code requires for the marketplace tile). Keep it that way —
without the `images/**` + `!images/icon.png` pair the VSIX balloons to 1.3 MB of unused art.

## Image filenames are wrong

Every file in [images/](images/) is named one slot off from its actual pixel dimensions:
`quasar-mark-16.png` is 128x128, `quasar-mark-256.png` is 16x16, `quasar-mark-512-ink.png` is 32x32,
and `quasar-mark-1024-ink.png` is not a mark at all — it's a 928x256 lockup. `quasar-mark-64.png` /
`quasar-mark-512.png` are both 512x512 duplicates, as are `quasar-mark-128.png` / `quasar-mark-1024.png`
at 1024x1024. Verify with `sips -g pixelWidth -g pixelHeight <file>` before trusting any of these names.

`README.md` is still the generated VS Code extension boilerplate — it does not describe Quasar.
`images/README.md` is not documentation, it's a stray inline SVG.
