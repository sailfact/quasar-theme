# Quasar

A dark theme for out of space. Three variants, one palette.

| Variant | Editor background | Accent for types |
| --- | --- | --- |
| **Quasar** | `#1e2436` | mauve `#c98ba0` |
| **Quasar Dark** | `#14141c` | mauve `#c98ba0` |
| **Quasar Ink** | `#0a0a10` | cyan `#8cc5cc` |

Pick one via `Preferences: Color Theme`.

## Recommended settings

The theme colours everything it can, but a few VS Code defaults suppress colours the
theme actually defines. These four are worth setting — without them, keys Quasar ships
simply don't render:

```jsonc
{
  // Default is 4.5, which makes VS Code rewrite the theme's 16 ANSI colours.
  "terminal.integrated.minimumContrastRatio": 1,
  // Otherwise editorBracketHighlight.foreground1-6 render nothing.
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",
  // The theme sets both a line-highlight background and border.
  "editor.renderLineHighlight": "all",
  // A native title bar ignores titleBar.* on Linux and Windows.
  "window.titleBarStyle": "custom"
}
```

The rest is taste rather than theme — included for anyone who wants the look the
screenshots were taken with:

```jsonc
{
  "editor.fontFamily": "'JetBrains Mono', ui-monospace, monospace",
  "editor.fontSize": 13,
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.6,
  "editor.letterSpacing": 0.2,
  "editor.cursorBlinking": "solid",
  "editor.cursorWidth": 2,
  "editor.renderWhitespace": "boundary",
  "editor.stickyScroll.enabled": true,
  "terminal.integrated.fontFamily": "'JetBrains Mono', monospace",
  "terminal.integrated.fontSize": 12,
  "terminal.integrated.lineHeight": 1.4,
  "terminal.integrated.cursorStyle": "block",
  "workbench.tree.indent": 14,
  "workbench.list.smoothScrolling": true,
  "workbench.editor.tabSizing": "shrink"
}
```

Quasar deliberately does **not** ship these as `configurationDefaults`. That contribution
point applies when the extension is *installed*, not when the theme is *selected* — so it
would change the fonts of people who install Quasar and then use something else.

`editor.semanticHighlighting.enabled` is not needed: all three theme files declare
`"semanticHighlighting": true` themselves.

## Development

Colours live in [src/quasar.yml](src/quasar.yml) — one shared structure plus three
palettes. The files in `themes/` are generated and gitignored; never edit them directly.

```bash
npm install
npm run build     # src/quasar.yml -> themes/*.json
npm run verify    # round-trip the generated output against themes/
npm run lint      # compare against the VS Code theme-color reference
npm run package   # build + vsce package
```

A value written as `$ROLE` in `colors`, `tokenColors` or `semanticTokenColors` resolves
per variant from `palettes` at the top of the file; a literal `'#rrggbb'` is shared by all
three. Change a role once and every key bound to it moves together. A `~` value omits the
key from that variant.

Press `F5` to open an Extension Development Host with the themes loaded. To find the
TextMate scope behind a token, run `Developer: Inspect Editor Tokens and Scopes` there.

## License

MIT — see [LICENSE](LICENSE).
