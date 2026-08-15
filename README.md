# React + Vite Portfolio Migration

This project migrates the supplied static portfolio page to React + Vite while preserving its original visual design and interactions.

## Run

```bash
npm install
npm run dev
npm run build
```

## Structure

- `src/pages` — page routes
- `src/components` — UI sections and interactive components
- `src/hooks` — particles, typing, Three.js and GSAP effects
- `src/data` — portfolio content
- `src/styles` — migrated styling
- `public/assets` — supplied images/icons

React Router is configured with `/` as the portfolio route and a fallback back to `/`.

## Notes

The supplied archive did not contain `assets/music.mp3` or `assets/resume.pdf`, even though the original HTML referenced them. The migrated UI keeps both features and handles the missing music asset without crashing; add those original files to `public/assets` to restore the media/download files.

No API/backend functionality was added. ESLint is intentionally not configured or used.
