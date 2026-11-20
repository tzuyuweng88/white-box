# White Box

An interactive prototype that helps high school students explore values, think through AI dilemmas, and create a personal AI Values Guide.

[Open the live prototype](https://white-box-values-studio.tzuyu8888.chatgpt.site/)

![Sarah thinking and writing beside her laptop](public/sarah-hero.webp)

## Run the project

Install Node.js 22 LTS and npm, then open a terminal inside this folder.

```bash
npm ci
npm run dev
```

Open the local address printed in the terminal. Use the local server to run the app. Opening index.html directly does not run the React application.

```bash
npm run build
npm run preview
```

The build command checks TypeScript and produces the website in dist/. The preview command serves that build.

## What you can explore

- Six values with distinct explanations, examples, and reflection questions.
- A Values Board with up to five editable values, drag handles, and accessible reorder buttons.
- Three dilemmas with action choices, value identification, competing considerations, and consequences for each listed choice.
- Reconsidering a decision and comparing a contextual ranking with the earlier board order.
- Reflections, optional guideline revisions, and history across repeated dilemma attempts.
- A guide designer with poster, desktop, and phone formats, plus PNG, PDF, and print controls.
- Accessibility preferences, reflection deletion, and demo reset.

Sarah is a fictional Grade 10 demo persona. The starter Respect entry is labeled “Demo example” in the interface.

## Work with Claude

Start with [CLAUDE.md](CLAUDE.md) and [the project handoff](docs/project-handoff.md). Open this folder in Claude Code, or upload the collaboration ZIP to a Claude conversation that supports file attachments. The archive contains the same source, images, content, and documentation as this repository.

Suggested starting message

> I’m working with classmates on White Box, an AI literacy prototype. Read README.md, CLAUDE.md, and docs/project-handoff.md, then inspect the relevant source. Our requested change is [describe the change]. Implement it, run npm run build, and check the affected flow. Preserve saved browser data, optional guideline revision, contextual rankings, and reflection privacy. Explain what changed and how you verified it.

## Content, data, and images

| File | Purpose |
| --- | --- |
| src/content.ts | Six values, three scenario stories, choices, specific consequences, and responsible AI basics |
| src/state.ts | State types, fictional starter data, persistence key, and attempt creation |
| data/demo-learning-state.json | Portable reference copy of the fictional starter state |
| docs/data-and-assets.md | Data model, persistence behavior, and image provenance |
| public/sarah-hero.webp | Generated illustration used on the home screen |
| public/sarah-avatar.webp | Avatar derived from the home illustration |
| docs/original-project-brief.txt | Original requested scope and storyboard descriptions |
| docs/manual-checks.md | Checklist for checking changes through the interface |

The repository contains fictional demo examples. Each visitor’s work is stored in that visitor’s browser using LocalStorage. Browser-entered reflections are outside the source files and collaboration archive.

## Code structure

React 18, TypeScript, Vite 5, Tailwind CSS 3, Lucide React, html-to-image, and jsPDF. Fonts are installed locally through Fontsource.

- src/main.tsx contains navigation and most pages.
- src/Dilemma.tsx implements the shared eight-step dilemma experience.
- src/Designer.tsx implements the live editor and browser exports.
- src/ui.tsx holds shared interface components.
- src/style.css defines the visual system, responsive layouts, and print styles.

Navigation uses URL hashes. The current build expects hosting at a domain’s root. A GitHub Pages project URL requires adapting Vite’s base path and root-relative image URLs before deployment. The shared live prototype is hosted through ChatGPT Sites.

## Collaborate through GitHub

Clone this repository or download its ZIP, then create a branch for your work. Commit relevant changes and open a pull request. Classmates can fork the public repository and propose changes, or the owner can invite them as collaborators.

Run npm run build and relevant checks in docs/manual-checks.md before submitting changes. Publishing changes to the live prototype is a separate step from pushing to GitHub.

The original storyboard file was unavailable when this handoff was packaged. The original brief describes its screens. The live app and included images provide visual references.
