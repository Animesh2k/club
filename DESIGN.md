# Design System: High-End Editorial & Avant-Garde Heritage

## 1. Overview & Creative North Star

**Creative North Star: The Digital Altar**
This design system is a manifestation of "The Digital Altar"—a space where monolithic presence meets sophisticated heritage. It rejects the "standard app" aesthetic in favor of a dramatic, editorial experience. We treat the digital interface as a curated exhibition: every element is heavy with intent, every transition is cinematic, and the layout feels architectural rather than fluid.

By utilizing high-contrast typography scales and intentional asymmetry, we break the "template" look. We do not use borders to define space; we use light, shadow, and tonal shifts to carve functionality out of the obsidian void.

---

## 2. Colors & Tonal Architecture

Our palette is rooted in the juxtaposition of "Obsidian Void" and "Heritage Blood," punctuated by a hyper-modern lime accent.

### Color Tokens
- **Primary (`#ffb3ac`):** Used for critical brand expressions and high-intensity CTAs.
- **Primary-Container (`#8e1b1b`):** The deep "Blood" tone for large surfaces and velvet gradients.
- **Surface (`#131313`):** The "Obsidian Void"—our baseline atmosphere.
- **Surface-Container-Lowest (`#0e0e0e`):** For recessed areas or maximum depth.
- **Surface-Container-High (`#2a2a2a`):** For elevated elements and interactive cards.
- **Secondary (`#a6de2d`):** A lethal lime used sparingly for micro-interactions and wayfinding.

### The "No-Line" Rule
Prohibit the use of 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts. To separate a section, transition from `surface` to `surface-container-low`. Let negative space act as the structural "wall."

### Surface Hierarchy & Nesting
Treat the UI as physical layers. An inner container should always be one tier "higher" or "lower" than its parent to define its importance. 
*   *Example:* A `surface-container-lowest` card sitting on a `surface` background creates a "carved out" aesthetic.

### The "Glass & Gradient" Rule
- **Glassmorphism:** Floating elements (modals, dropdowns) must use semi-transparent surface colors with a `backdrop-blur` of **20px or greater**.
- **Velvet Gradients:** Use 135-degree linear gradients from `primary` to `primary-container` for CTAs to provide a tactile, premium depth that flat colors lack.

---

## 3. Typography

The typographic system is built on a "Power/Quiet/Tech" triad.

- **Display & Headline (Epilogue):** Monolithic and authoritative. Use tight letter-spacing (`-0.02em` to `-0.05em`) to create a block-like, editorial feel.
- **Body (Manrope):** Geometric and quiet. This is the workhorse. It must remain legible and airy to balance the dramatic Display scale.
- **Label (Space Grotesk):** Tech-forward wayfinding. Used for metadata, small caps, and navigation labels to ground the heritage feel in modern precision.

### Typographic Scale
- **Display-LG:** `3.5rem` / Epilogue (Tight tracking)
- **Headline-MD:** `1.75rem` / Epilogue
- **Body-LG:** `1rem` / Manrope
- **Label-MD:** `0.75rem` / Space Grotesk

---

## 4. Elevation & Depth

We eschew traditional Material Design shadows in favor of Tonal Layering and Ambient Light.

### The Layering Principle
Depth is achieved by "stacking" surface tokens. Place a `surface-container-high` element on a `surface` background to create a lift. The change in hex value provides all the "border" the eye needs.

### Ambient Shadows
If a floating effect is required (e.g., a primary action button), use an extra-diffused shadow.
- **Blur:** 40px+
- **Opacity:** 4% - 8%
- **Color:** Use a tinted version of `on-surface` (not pure black) to mimic natural light dispersion.

### The "Ghost Border" Fallback
If accessibility requirements demand a border, use a "Ghost Border": the `outline-variant` token at **15% opacity**. Never use 100% opaque, high-contrast strokes.

---

## 5. Components

### Buttons
- **Primary:** 135-degree Velvet Gradient (`primary` to `primary-container`). Small radius (`0.25rem`). White or high-contrast text.
- **Secondary:** Surface-Container-High background with no border. Text in `primary` or `secondary`.
- **Tertiary:** Text-only in `secondary` (lime) for high-visibility micro-actions.

### Cards & Lists
- **Cards:** No borders. Use `surface-container-low` or `surface-container-high`. 
- **Lists:** Do not use divider lines. Use vertical spacing (16px, 24px, or 32px) and subtle `background-color` shifts on hover to define list items.

### Input Fields
- **Styling:** Underline-only or subtle background shift to `surface-container-lowest`. 
- **States:** Focus state should trigger the `secondary` (lime) color for the label or a 1px ghost-border.

### Heritage Foil (Signature Component)
- Backgrounds should occasionally feature a "Heritage Foil" watermark—large-scale, low-opacity (2-3%) iconography or glyphs that appear and disappear as the user scrolls, creating a sense of hidden history.

---

## 6. Do’s and Don’ts

### Do:
- **Do** use grain and noise overlays on hero imagery to create a cinematic, tactile feel.
- **Do** use dramatic lighting in photography (Chiaroscuro) to match the "Obsidian Void."
- **Do** leverage sharp architecture; stick to radii between `0.125rem` and `0.375rem`.
- **Do** utilize intentional asymmetry. Align titles to the left and body text to a separate column for an editorial grid.

### Don’t:
- **Don’t** use bubbly, rounded corners (no radius over `0.75rem` except for pill-chips).
- **Don’t** center-align long passages of text. It breaks the editorial "Altar" aesthetic.
- **Don’t** use standard drop shadows. If it looks like a default browser shadow, it is a failure.
- **Don’t** use 1px solid borders to separate sections. Use the color palette to define the space.