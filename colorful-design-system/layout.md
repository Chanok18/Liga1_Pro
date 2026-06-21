# Layout & Spacing

## Spacing Rhythm

Base unit: **8px**. All spacing values should be multiples of 8px.

| Context | Value |
|---|---|
| Section vertical padding | 96px |
| Section header → content | 48px or 64px |
| Heading → paragraph | 16px |
| Container horizontal padding | 24px |
| Flex/grid row gap | 16px |
| Card grid gap | 24px |
| Wide component grid gap | 32px |
| Column layout gap | 48px |

## Container

Standard section container: max-width 1152px, centered, 24px horizontal padding.

Every major section wraps content in this container.

## Content Composition Order

Inside each section, follow this order:
1. Heading (`h1`–`h3`)
2. Leading paragraph
3. Normal paragraph(s)
4. Lists, CTA links, or component grids

## Section Pattern

Each section has:
- 96px vertical padding
- A bold, vibrant background color from the accent palette — sections should cycle through colors like brand (#1F7B45), purple (#A855F7), pink (#DB2777), sky (#0EA5E9), orange (#FB923C), teal (#0D9488), indigo (#4F46E5), fuchsia (#C026D3). No two adjacent sections should share the same background color.
- On colorful backgrounds, use white text for headings and white/white-alpha for body copy to ensure contrast.
- A centered container (max-width 1152px, 24px horizontal padding)
- A section header area with 48px bottom margin
- Section content below
- Neutral backgrounds (neutral-primary-soft, neutral-secondary-soft) are reserved for the nav/header and footer only — all main content sections must use bold accent colors.

## Motion & Animation

- Prefer CSS-native: `transition`, `animation`, `@keyframes`. Use Motion library only when CSS cannot achieve the behavior.
- Prioritize high-impact orchestrated moments over scattered micro-interactions. A single well-sequenced page-load animation using staggered `animation-delay` delivers more perceived quality than many isolated effects.
- Reserve scroll-triggered and hover transitions for moments that reinforce hierarchy or reward attention.

## Backgrounds & Visual Depth

- Default to bold, saturated accent-color backgrounds for all main content sections. Never use flat white, grey, or plain beige for content sections.
- Apply contextual treatments — bold color blocks, hard-edge shadows, playful geometric patterns, layered transparencies, chunky borders — that align with the neo-brutalist brand aesthetic.
- On colorful section backgrounds, all child cards and buttons must use white (#FFFFFF) borders so the hard-edge shadow (dark green #1d6e3d) remains clearly visible.
- Every decorative element must serve a compositional purpose (depth, separation, or emphasis). No purely ornamental effects competing with content.

## Must

- All sections: consistent 96px vertical padding
- All containers: max-width 1152px, centered, 24px horizontal padding
- Section headers: 48px or 64px bottom margin
- Consistent vertical rhythm, no crowded sections
- Layouts readable and properly spaced on both desktop and mobile
