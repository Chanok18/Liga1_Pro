# Cards

> Dependencies: `colors.md`, `radius.md`, `shadows.md`, `typography.md`

## Core Specs

- **Background:** A bold accent color that contrasts with the parent section's background — never white, grey, or beige. Use accent tokens (brand, purple, sky, teal, pink, orange, indigo, fuchsia) or dark. The card background must be a different color from its parent section.
- **Border:** 2px solid white (#FFFFFF) — white borders ensure the hard-edge shadow remains visible on colorful backgrounds
- **Radius:** 16px (base)
- **Shadow:** shadow-md
- **Text:** White for headings and body text inside cards (since all card backgrounds are dark/saturated)

## Card Heading

- Desktop: 20px, font-heading, white color
- Mobile: 16px, font-heading, white color
- Never skip heading levels — the page hierarchy must logically arrive at the card heading level.

## States

### Static Card (no interactivity)
- Background: a bold accent color (different from parent section)
- Border: 2px solid white (#FFFFFF)
- Radius: 16px
- Shadow: shadow-md
- No hover styles. Non-interactive cards must NOT have hover background changes.

### Interactive Card (clickable)
- Same base styles as static card
- Hover: opacity-90 or a slightly lighter/darker shade of the card's accent color
- Transition: opacity or colors
- Cursor: pointer

## Rules

- Background: always a bold accent color — NEVER white, grey, beige, or any neutral background
- Border: 2px solid white (#FFFFFF) — always white to ensure shadow visibility on colored backgrounds
- Radius: 16px
- Shadow: shadow-md
- All text inside cards: white or white/90 for body, white for headings
- Interactive hover: opacity-90 or subtle shade shift
- Non-interactive: no hover styles
