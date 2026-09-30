# Cover artwork sources

Reproducible sources for the storefront cover art in `public/covers/`.

| File | Purpose |
|---|---|
| `career-positioning-ai-era-cover-base.png` | Text-free generated abstract composition (the only artwork element) |
| `build-career-cover.py` | Composites that composition onto a 4:5 ivory field and typesets the exact title/subtitle/credit |

Regenerate:

```bash
pip install pillow
python3 artwork/build-career-cover.py
```

Fonts (Playfair Display, Inter) are fetched at build time via
`npm pack @expo-google-fonts/playfair-display @expo-google-fonts/inter`.

The script asserts that the typeset subtitle never collides with the artwork,
that the paper field has no seam, and that margins stay inside ~8-9%.
