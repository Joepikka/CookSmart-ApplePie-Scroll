# CookSmart website

React + Vite + TypeScript + Tailwind adaptation of the supplied dental landing-page design. The Flutter app and APK are separate and were not modified by this redesign.

## Run

Use `npm install`, then `npm run dev`. The preview runs at http://127.0.0.1:5173. `npm run build` produces `dist`.

## Delivered

- Three sections: image mosaic hero, searchable recipe collection, weekend baking feature.
- 13,463 imported complete recipes with local photos, plus ten original curated recipe previews. See DATASET.md for the import, storage, and validation details.
- Search by dish or key ingredient; categories; browser-local favorites with empty states.
- Accessible native recipe dialog, responsive navigation, reduced-motion handling, image failure state, custom favicon, first-visit splash.
- External publisher images remain remotely hosted; they are attributed beside recipes. Hero photo is by Hugo Aitken on Unsplash: https://unsplash.com/photos/PqYvDBwpXpU . Recipe sources are stored per entry in src/recipes.json.

## Scope

This is a searchable recipe library, separate from the Flutter Gemini recipe generator. The old HTML mockups remain under public for reference. Imported recipes include their supplied ingredients and full instructions. The original ten curated previews link to publisher instructions.

## Review findings in the previous app

- Home and saved cards used picsum URLs, which did not guarantee food or a matching dish.
- The home screen had one hard-coded featured recipe.
- Saved recipes were four mock cards named Recipe Name 1–4.
- Those cards opened the same default sample recipe.
- Home search and category pills did not filter a recipe collection.

## Validation — 2026-09-15

- TypeScript and production build passed.
- Browser verified chicken ingredient search returns two relevant recipes; Breakfast returns pancakes.
- Recipe detail dialog opened with the correct source URL and content.
- Saving survived refresh; collection filtering and removing the test favorite produced the correct empty state.
- Mobile checked at 390 × 844, including menu and hero; normal desktop/tablet preview also inspected.

## Hosting status

Registration initially returned an uncertain transport failure. A subsequent Sites list/get confirmed the existing CookSmart project. Its exact ID is persisted in .openai/hosting.json; do not create another Site.

No version was published. During the task, the Sites plugin files disappeared from the configured cache. The required hosting skill and build/packaging scripts could not be found by a hidden/unignored search of the plugin cache. Resume publishing for the existing registered project once the plugin files are restored. Local preview remains the deliverable.
