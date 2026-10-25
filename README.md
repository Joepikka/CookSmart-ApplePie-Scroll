# CookSmart — Apple Pie Scroll

A standalone React/Vite recipe website with an apple-pie canvas sequence driven by GSAP ScrollTrigger. This README describes the source in this repository rather than inheriting the original CookSmart delivery report.

## CookSmart version map

| Repository | Documented role |
| --- | --- |
| [CookSmart](https://github.com/Joepikka/CookSmart) | Original searchable recipe-library website. Its README and DATASET.md document 13,463 imported recipes plus ten curated previews. |
| [CookSmart-ApplePie](https://github.com/Joepikka/CookSmart-ApplePie) | Independent apple-pie animation variant. Its own README describes 96 desktop / 84 mobile frames. |
| [CookSmart-ApplePie-Scroll](https://github.com/Joepikka/CookSmart-ApplePie-Scroll) | This repository: the source configures 84 desktop / 72 mobile frames and a three-chapter ingredients-to-pie experience. |

Each repository is a separate variant. No preferred replacement or shared automatic synchronization is established by this map, and the other repositories were not modified.

## Current implementation

- [src/KitchenStory.tsx](src/KitchenStory.tsx) selects desktop or mobile at 767px, preloads the selected WebP sequence and draws a scroll-driven canvas.
- Frame paths are `public/kitchen-scroll/desktop/frame001.webp` onward and the corresponding `mobile/` sequence. Each variant has a poster.
- Reduced-motion or data-saver preferences use a static poster and recipe action. Loading failure also falls back to a static view.
- [src/App.tsx](src/App.tsx) provides recipe search/categories, browser-local saved IDs, recipe dialogs and archive retry feedback.
- [src/recipes.json](src/recipes.json) supplies the bundled curated entries.

## Recipe archive limitation

The application requests `/dataset/index.json` and optional `/dataset/details/{chunk}.json`. At the reviewed commit, `public/` contains the favicon and kitchen-scroll assets, but no dataset directory. The source includes a visible archive-load error and retry action.

Do not infer that the original 13,463-recipe archive ships in this repository merely because its previous README repeated the original project's description. Recipe completeness and deployment need their own asset and browser checks. The original project's [DATASET.md](https://github.com/Joepikka/CookSmart/blob/main/DATASET.md) documents that separate import; it does not install assets here.

## Develop and build

```powershell
npm ci
npm run dev
npm run build
npm run preview
```

The development server defaults to http://127.0.0.1:5173/. The build runs TypeScript checking and Vite via [package.json](package.json).

[vite.config.ts](vite.config.ts) sets the GitHub Pages base to `/CookSmart-ApplePie-Scroll/` only when `GITHUB_PAGES=true` is in the build environment. The archive fetch URLs in App.tsx remain origin-root paths, so verify archive routing separately before claiming a complete Pages deployment.

## Verification scope

README-only change, based on source inspection on 25 October 2026 at commit `4d1e6280318cd593787071f93ca3e30c8e2026e3`. No build, frame download, browser animation, recipe import or live deployment was run in this documentation pass. No published URL is asserted.
