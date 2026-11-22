# BAYTO LLC Website

One-page static site for **BAYTO LLC** — research, data analysis, and AI consulting. Built for GitHub Pages (no backend, no build step).

## Structure

```
Bayto_LLC/
├── index.html          # Markup & content
├── css/
│   └── styles.css      # Design tokens, layout, components
├── js/
│   ├── app.js          # Entry point
│   ├── nav.js          # Menu, sticky CTA, section highlight
│   ├── form.js         # Web3Forms inquiry submit
│   ├── animations.js   # Scroll reveals & card tilt
│   └── hero3d.js       # Three.js data-network hero
├── assets/
│   ├── logo.svg
│   └── favicon.svg
└── README.md
```

## Local preview

ES modules need a local server (not `file://`):

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Open `http://localhost:8080`.

## Inquiry form (Web3Forms)

1. Create a free key at [web3forms.com](https://web3forms.com).
2. In `index.html`, replace `YOUR_ACCESS_KEY` with your key:

```html
<input type="hidden" name="access_key" value="your-real-key" />
```

Inquiries go to the email you registered with Web3Forms.

## Deploy on GitHub Pages (automatic)

This repo uses `.github/workflows/static.yml`. Every push to `main` republishes the site.

### Site URL

`https://aronkg.github.io/Bayto_LLC/`

### Redeploy after changes

1. Commit and push to `main`.
2. Open **Actions** → wait for **Deploy static content to Pages** to finish (green check).
3. Hard-refresh the live site (`Ctrl+Shift+R`).

Manual deploy: **Actions → Deploy static content to Pages → Run workflow**.

## Stack

| Piece        | Choice                                      |
| ------------ | ------------------------------------------- |
| Markup       | Semantic HTML                               |
| Style        | Vanilla CSS (tokens + sections)             |
| Motion       | CSS scroll reveals + pointer tilt           |
| 3D hero      | Three.js (CDN, import map)                  |
| Form         | Web3Forms                                   |
| Hosting      | GitHub Pages                                |

## Accessibility

- Skip link, focus styles, semantic landmarks
- Contrast tuned for dark navy + teal accent
- `prefers-reduced-motion`: static hero, no tilt, instant reveals
