# Working on White Box

White Box is a student-facing AI literacy prototype. Read README.md and docs/project-handoff.md before making changes.

## Run and verify

Use Node.js 22 LTS and npm. Run npm ci, npm run dev, and npm run build. The build checks TypeScript and produces a Vite static build. The repository currently has no automated test suite. Use docs/manual-checks.md for verification appropriate to the requested change.

## Code map

- src/main.tsx handles hash navigation, shell, value forms, board, guide, history, and settings.
- src/content.ts is the source of truth for educational content.
- src/state.ts defines browser state, demo seed, attempt creation, and reordering.
- src/Dilemma.tsx provides the shared eight-step scenario flow.
- src/Designer.tsx provides poster customization and PNG/PDF exports.
- src/ui.tsx contains shared controls and accessible ordering controls.
- src/style.css provides visual, responsive, accessibility, and print rules.
- public/ contains the illustration and avatar.

## Educational behavior

Students choose their personal definitions and guidelines. Support uncertainty, perspective-taking, reconsideration, and optional revisions. Each scenario needs consequences that respond to the selected action.

Use accurate guidance about checking AI claims, consent, privacy, and school rules. Preserve the absence of moral scores, leaderboards, and right/wrong grading for nuanced choices.

The board holds up to five values. Replacement requires an explicit choice. Dilemma rankings stay separate from the overall board order until the student explicitly applies them. Retrying a dilemma preserves earlier completed attempts.

## State and exports

The LocalStorage key is white-box-learning-v1. Existing saved states may be present in visitors’ browsers. Preserve compatibility or implement a deliberate migration when changing the state shape.

Personal definitions and guidelines must agree across the board, guide, editor, and exports. Private reflection history stays outside guide exports. Demo data is fictional and should remain identifiable.

Keep data/demo-learning-state.json aligned with the seed in src/state.ts when changing the starter data. The app uses the TypeScript seed at runtime.

## Scope and hosting

The app is a browser-only prototype with local persistence. Add a backend, account system, or external data collection when requested by the project owner.

The original brief is historical reference material. It describes requested behavior and may exceed or differ from the implementation. Inspect current source and follow the current user’s request when deciding what to change.

The current host serves the project at the domain root. Vite base configuration and image paths need attention before using a GitHub Pages repository subpath. Hosting credentials and account-specific deployment identifiers are excluded from this handoff.
