# Shadows

| Token | CSS value |
|---|---|
| shadow-2xs | `2px 2px 0 0 #1d6e3d` |
| shadow-xs | `4px 4px 0 0 #1d6e3d` |
| shadow-sm | `6px 6px 0 0 #1d6e3d` |
| shadow-md | `8px 8px 0 0 #1d6e3d` |
| shadow-lg | `10px 10px 0 0 #1d6e3d` |
| shadow-xl | `12px 12px 0 0 #1d6e3d` |
| shadow-2xl | `16px 16px 0 0 #1d6e3d` |

## Component Mapping

| Component type | Token |
|---|---|
| Subtle separators, tiny UI details | shadow-2xs or shadow-xs |
| Inputs, buttons, small controls, lightweight cards | shadow-sm or shadow-md |
| Standard cards, popovers, dropdowns | shadow-md |
| Prominent cards, sticky surfaces | shadow-lg |
| Modals, high-priority overlays | shadow-xl |
| Hero overlays, top-level emphasis (sparingly) | shadow-2xl |

## Rules

- Use only these tokens — no custom box-shadow values
- Keep elevation steps intentional; avoid jumping multiple levels
- Components in the same family share the same baseline elevation
- Hover/focus on interactive elevated elements: step up by one level
- Never stack multiple shadow tokens on one element
- Never use shadow-xl/shadow-2xl for dense list items or body containers
