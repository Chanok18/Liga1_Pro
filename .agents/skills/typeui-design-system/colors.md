# Color Tokens


## Background Tokens

### Neutral
| Token | Light | Dark |
|---|---|---|
| neutral-primary-soft | #FFFDF7 | #101828 |
| neutral-primary | #FFFDF7 | #030712 |
| neutral-primary-medium | #FFFBF0 | #1E2939 |
| neutral-primary-strong | #FFF8E8 | #333E4F |
| neutral-secondary-soft | #FEF9EE | #101828 |
| neutral-secondary | #FEF9EE | #030712 |
| neutral-secondary-medium | #FEF5E4 | #1E2939 |
| neutral-secondary-strong | #FEF0D8 | #333E4F |
| neutral-tertiary-soft | #FDF3E0 | #101828 |
| neutral-tertiary | #FDF0D8 | #1E2939 |
| neutral-tertiary-medium | #FBECC8 | #333E4F |
| neutral-quaternary | #F8E4B8 | #333E4F |
| quaternary-medium | #F5DCA8 | #4A5565 |
| gray | #E8D5BC | #4A5565 |

### Brand
| Token | Light | Dark |
|---|---|---|
| brand-softer | #EDFBF2 | #0C2F18 |
| brand-soft | #C8F0D5 | #144D28 |
| brand | #1F7B45 | #2A9D58 |
| brand-medium | #A3E4B8 | #144D28 |
| brand-strong | #18633A | #1F7B45 |

### Status
| Token | Light | Dark |
|---|---|---|
| success-soft | #ECFDF5 | #002C22 |
| success | #007A55 | #009966 |
| success-medium | #D0FAE5 | #004F3B |
| success-strong | #006045 | #007A55 |
| danger-soft | #FEF0F2 | #4D0218 |
| danger | #C70036 | #C70036 |
| danger-medium | #FFE4E6 | #8B0836 |
| danger-strong | #A50036 | #A50036 |
| warning-soft | #FFF7ED | #7C2D12 |
| warning | #F97316 | #F97316 |
| warning-medium | #FFEDD5 | #7C2D12 |
| warning-strong | #C2410C | #C2410C |

### Button Glint (CSS custom properties, used for the glint box-shadow effect)
| Variable | Light | Dark |
|---|---|---|
| `--color-1-400` | rgba(255,255,255,0.30) | rgba(255,255,255,0.15) |
| `--color-1-700` | rgba(29,110,61,0.20) | rgba(29,110,61,0.35) |

### Utility
| Token | Light | Dark |
|---|---|---|
| dark | #1A1A1A | #1A1A1A |
| dark-strong | #0D0D0D | #333333 |
| disabled | #FDF3E0 | #1F2937 |

### Accent
| Token | Value (same both modes) |
|---|---|
| purple | #A855F7 |
| sky | #0EA5E9 |
| teal | #0D9488 |
| pink | #DB2777 |
| cyan | #06B6D4 |
| fuchsia | #C026D3 |
| indigo | #4F46E5 |
| orange | #FB923C |

## Text Color Tokens

### Base
| Token | Light | Dark |
|---|---|---|
| white | #FFFFFF | #FFFFFF |
| black | #1A1A1A | #1A1A1A |
| heading | #1A1A1A | #FFFFFF |
| body | #4B5563 | #9CA3AF |
| body-subtle | #6B7280 | #9CA3AF |

### Brand
| Token | Light | Dark |
|---|---|---|
| fg-brand-subtle | #A3E4B8 | #144D28 |
| fg-brand | #1F7B45 | #4CC973 |
| fg-brand-strong | #18633A | #A3E4B8 |

### Status
| Token | Light | Dark |
|---|---|---|
| fg-success | #047857 | #065F46 |
| fg-success-strong | #065F46 | #10B981 |
| fg-danger | #BE123C | #F43F5E |
| fg-danger-strong | #881337 | #F87171 |
| fg-warning-subtle | #EA580C | #F97316 |
| fg-warning | #7C2D12 | #FBBF24 |
| fg-disabled | #9CA3AF | #6B7280 |

### Informational / Accent
| Token | Light | Dark |
|---|---|---|
| fg-yellow | #FACC15 | #FACC15 |
| fg-info | #312E81 | #93C5FD |
| fg-purple | #9333EA | #A855F7 |
| fg-purple-strong | #7E3AF2 | #DDD6FE |
| fg-cyan | #0891B2 | #06B6D4 |
| fg-indigo | #4F46E5 | #4F46E5 |
| fg-pink | #DB2777 | #DB2777 |
| fg-lime | #65A30D | #84CC16 |

## Border Color Tokens

| Token | Light | Dark |
|---|---|---|
| border-dark | #1A1A1A | #4B5563 |
| border-buffer | #FFFDF7 | #030712 |
| border-buffer-medium | #FFFDF7 | #1F2937 |
| border-buffer-strong | #FFF8E8 | #374151 |
| border-muted | #FEF9EE | #111827 |
| border-light-subtle | #FDF3E0 | #111827 |
| border-light | #FBECC8 | #1F2937 |
| border-light-medium | #F5DCA8 | #374151 |
| border-default-subtle | #E8DCC8 | #111827 |
| border-default | #D4C4AA | #1F2937 |
| border-default-medium | #C8B898 | #374151 |
| border-default-strong | #B5A882 | #4B5563 |
| border-success-subtle | #A7F3D0 | #064E3B |
| border-success | #047857 | #065F46 |
| border-danger-subtle | #FECDD3 | #881337 |
| border-danger | #BE123C | #BE123C |
| border-warning-subtle | #FED7AA | #7C2D12 |
| border-warning | #EA580C | #F97316 |
| border-brand-subtle | #A3E4B8 | #144D28 |
| border-brand-light | #2A9D58 | #2A9D58 |
| border-brand | #1F7B45 | #4CC973 |
| border-dark-subtle | #333333 | #374151 |
| border-purple | #A855F7 | #A855F7 |
| border-orange | #FB923C | #FB923C |

## Semantic Usage Rules

- Page/section backgrounds: Use bold accent colors (brand, purple, sky, teal, pink, orange, indigo, fuchsia) for all main content sections. Cycle through them so no two adjacent sections share the same color. Reserve neutral backgrounds (neutral-primary-soft, neutral-secondary-soft) only for nav/header and footer areas.
- On colorful section backgrounds: headings use white text, body copy uses white or rgba(255,255,255,0.85) for readability.
- Primary buttons: brand background
- Cards and buttons on colorful backgrounds: use white (#FFFFFF) borders so the hard-edge shadow is clearly visible.
- CTA links on colorful backgrounds: white text, underline, hover → no underline
- Default borders on neutral backgrounds: border-default
- Status borders match intent: success → border-success, danger → border-danger, warning → border-warning
- Disabled: disabled background + fg-disabled text

## Prohibited

- No raw hex/rgb values in component code — always use design tokens
- No brand text color for long-form paragraphs
- No plain white, grey, or beige backgrounds for main content sections — all content sections must use bold accent colors
- No manual light/dark value swapping — let the CSS custom properties handle it
