# UI Improvement Plan

## Direction

Give the SQL Query Assistant the feel of a calm developer tool: near-black canvas, graphite surfaces, high-contrast type, a restrained blue action color, and a small amber signal for explanation states. The interface should feel precise and considered without becoming visually busy.

## Review And Recommendations

### Layout

- Keep the single-screen flow: introduction, question control, then query and explanation outputs.
- Use one centered content rail with a readable maximum width so the page stays intentional on large monitors.
- Make the question control a distinct action band and keep the two outputs aligned as a comparison pair.
- Collapse the output pair before the controls become cramped; stack the action controls on narrow screens.

### Colors

- Replace the previous cream canvas with `#080a0b` and use graphite surfaces for separation without harsh white cards.
- Reserve blue for primary actions, focus indicators, and positive/status signals.
- Use amber for secondary labels and empty-state markers so meaning does not depend on a single hue.
- Keep borders subtle but visible, and use a darker code surface to distinguish executable-looking text from surrounding content.

### Typography

- Use Space Grotesk for interface and explanatory copy, with IBM Plex Mono for labels, metadata, and SQL.
- Establish a clear hierarchy: compact product chrome, a large but controlled page statement, then compact panel headings.
- Keep body copy readable with generous line height and avoid negative tracking that can reduce legibility.

### Spacing

- Use a consistent compact rhythm for controls and a more generous rhythm between the intro, controls, and outputs.
- Keep panels padded enough for scanning while preserving a dense tool-like footprint.
- Maintain stable minimum heights for output panels so selecting different questions does not move the surrounding layout.

### Accessibility

- Preserve the visible label and native select semantics for the business-question control.
- Keep polite live-region feedback for clipboard success and failure.
- Provide a high-contrast `:focus-visible` treatment for keyboard users.
- Keep the chevron decorative and pointer-transparent so it does not interfere with select interaction.
- Respect `prefers-reduced-motion` and do not use color as the only way to communicate state.

### Responsiveness

- Keep the content rail within 1180px and use a 960px breakpoint to stack the output panels.
- Use a 700px breakpoint to stack header/footer content and the question controls.
- Make the copy action full-width on mobile and let status text wrap without shrinking the control.
- Keep SQL horizontally scrollable and preserve comfortable panel padding at small widths.

## Implemented

- Replaced the light editorial palette with a black, graphite, blue, and amber system.
- Added a subtle technical grid background, stronger panel hierarchy, and restrained borders/shadows.
- Added Space Grotesk and IBM Plex Mono font families with responsive, non-fluid type sizes.
- Added a custom visual chevron while preserving the native accessible select.
- Added keyboard focus styling and reduced-motion handling.
- Updated the browser theme color to match the new canvas.

## Validation

- Production build passes after the visual change.
- Existing unit suite passes with 5 test groups.
- Live narrow-viewport check confirms the headline and stacked controls remain readable without overlap.
