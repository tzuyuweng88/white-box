# Data and assets

## Learning content

src/content.ts contains all six values and three scenarios, including four listed actions, a custom-idea response, and five corresponding consequence sets for each scenario.

src/state.ts contains the fictional starter state. data/demo-learning-state.json is a portable reference copy and is not loaded automatically by the app.

## Browser state

LocalStorage key is white-box-learning-v1.

| Field | Contents |
| --- | --- |
| board | Up to five entries with value ID, definition, guideline, reflection, update date, and optional demo marker |
| explored | IDs of values visited |
| drafts | One active attempt per scenario |
| history | Completed attempts, choices, reflections, rankings, dates, and optional before/after value revision |
| design | Format, theme, background, font, icons, sticker, arrangement, and independent display order |
| settings | Larger text, reduced motion, and high contrast preferences |

Completed attempts are appended to history. Contextual rankings affect the board only through the student’s explicit action.

Deleting a reflection clears its written reflection fields and optional revision history while retaining the decision and ranking. Reset Demo restores the fictional starter state.

This package contains source-defined fictional examples. It does not capture browser storage or personal work entered in the live prototype.

## Images and fonts

public/sarah-hero.webp is an AI-generated illustration created for this prototype. It depicts fictional Sarah beside a laptop and notebook. public/sarah-avatar.webp is a crop derived from that illustration.

The original storyboard image was supplied by the project owner. Its file was unavailable when this collaboration package was created. The original brief retains the screen descriptions.

DM Sans Variable and Instrument Serif are bundled through Fontsource packages. Lucide React supplies interface icons. Dependency licenses are available in the installed packages.

## Excluded material

The public handoff excludes account-specific hosting configuration, Git history, installed packages, build output, and local credentials. The live app is hosted at the URL in README.md. Pushing source to GitHub provides a collaboration repository. Hosting changes require a further deployment.
