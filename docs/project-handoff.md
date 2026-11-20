# Project handoff

White Box helps students aged approximately 14–16 develop their own reasoning about AI use. Sarah, a fictional Grade 10 student, explores six values and applies them in three dilemmas. The central artifact is an editable AI Values Guide.

## Design

The storyboard uses warm off-white surfaces, lavender accents, rounded cards, a persistent desktop sidebar, and a student profile. The implementation uses DM Sans Variable for the interface and Instrument Serif for large headings.

| Value | Color | Icon |
| --- | --- | --- |
| Honesty | #FFE7A3 | Star |
| Independence | #DDEED9 | Sprout |
| Fairness | #DCEBFA | Scale |
| Privacy | #E9DDF8 | Shield |
| Respect | #F8DDDC | Heart |
| Responsibility | #FBE3D0 | Lightbulb |

## Experience

Students save a definition, AI-use guideline, and reflection for a value. Their board holds up to five selected values. They can edit, remove, replace, and reorder them.

The dilemmas are The Group Project, A Convincing AI Answer, and A Friend’s Photo. Each uses the same steps.

1. Read the scenario.
2. Choose an action or write another idea.
3. Identify relevant values.
4. Explore two competing considerations.
5. Consider benefits, concerns, another person’s perspective, and factual constraints.
6. Keep or reconsider the decision.
7. Rank board values for this situation and compare with the previous order.
8. Reflect and optionally revise a saved guideline.

Custom responses receive scenario-specific prompts to inspect the student’s own plan. The app uses authored content and browser logic. It has no AI API integration.

## Educational references

The original brief names these resources as educational grounding. They are also linked from the Lessons page.

- https://craft.stanford.edu/resource/what-principles-should-guide-ethical-use-of-ai/
- https://hai.stanford.edu/education/k-12

The prototype makes no Stanford endorsement claim.

## Current limitations

The prototype uses fictional data and browser-local persistence. Different visitors and browsers have separate progress. The original brief is broader than some implemented details, so review it alongside the current app when assessing completeness.

There is no automated test suite or browser-state migration system. Saved state is parsed from LocalStorage and the current app expects the existing shape.

Exports use rasterized browser content. PDF text is part of the rendered guide image. Physical printing has not been verified. The original implementation was checked through the complete three-dilemma flow and on desktop and mobile layouts.

The original storyboard attachment could not be found at packaging time. Its screen descriptions remain in the original brief.
