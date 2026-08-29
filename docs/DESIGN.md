---
name: Global Assembly Blue
colors:
  surface: '#f8fafb'
  surface-dim: '#d8dadb'
  surface-bright: '#f8fafb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f5'
  surface-container: '#eceeef'
  surface-container-high: '#e6e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3f484d'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#eff1f2'
  outline: '#6f787e'
  outline-variant: '#bec8ce'
  surface-tint: '#006685'
  primary: '#005e7a'
  on-primary: '#ffffff'
  primary-container: '#00789b'
  on-primary-container: '#e6f5ff'
  inverse-primary: '#7cd1f8'
  secondary: '#006a68'
  on-secondary: '#ffffff'
  secondary-container: '#72f7f3'
  on-secondary-container: '#00706e'
  tertiary: '#45596d'
  on-tertiary: '#ffffff'
  tertiary-container: '#5d7186'
  on-tertiary-container: '#edf4ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bee9ff'
  primary-fixed-dim: '#7cd1f8'
  on-primary-fixed: '#001f2a'
  on-primary-fixed-variant: '#004d65'
  secondary-fixed: '#72f7f3'
  secondary-fixed-dim: '#50dad7'
  on-secondary-fixed: '#00201f'
  on-secondary-fixed-variant: '#00504e'
  tertiary-fixed: '#d0e5fd'
  tertiary-fixed-dim: '#b4c9e0'
  on-tertiary-fixed: '#071d2f'
  on-tertiary-fixed-variant: '#35495c'
  background: '#f8fafb'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  section-gap: 5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is engineered for the **SDG 2030 Youth Parliament**, targeting international delegates, government officials, and youth leaders. The brand personality is **authoritative yet accessible**, projecting the gravity of global policy-making with the energy of youth participation.

The visual direction follows a **Corporate Modern** style, characterized by:
- **Clarity & Precision:** Clean layouts with generous whitespace to handle dense informational content.
- **Dynamic Geometric Motifs:** Utilizing the diagonal shearing and circular masking seen in the reference images to add a sense of forward momentum.
- **Institutional Trust:** A structured grid and systematic typography that reflects the organized nature of a parliamentary body.
- **Subtle Layering:** Minimal use of soft shadows and tonal containers to create a sense of professional depth without decorative excess.

## Colors

This design system uses a palette rooted in institutional blues and vibrant teals, directly inspired by the Sustainable Development Goals (SDG) aesthetic.

- **Primary Blue (#00789B):** The core brand color, used for primary actions, headers, and key branding elements. It signifies stability and international cooperation.
- **Secondary Teal (#2CC1BE):** A high-energy accent used for progress indicators, secondary buttons, and decorative UI elements.
- **Deep Navy (#102537):** Used for navigation bars and high-contrast text to provide a sophisticated anchor to the bright palette.
- **Functional Grays:** A range of cool grays (from #F8FAFB for backgrounds to #4A5568 for subtext) maintains a clean, digital-first feel.

Color application should prioritize accessibility, ensuring high contrast for all informational text.

## Typography

The typography strategy focuses on high legibility and a modern, technical edge.

- **Headlines:** Use **Hanken Grotesk** in Bold or Extra Bold. Its sharp, contemporary apertures provide a clean "tech-forward" parliamentary look. Headlines should be set with tight letter-spacing to appear impactful.
- **Body Text:** **Inter** is utilized for its exceptional readability in both dense paragraphs and UI labels. It scales perfectly from small captions to large introductory text.
- **Technical Labels:** **JetBrains Mono** is used sparingly for dates, counters (like the conference countdown), and metadata to evoke a sense of precision and data-driven policy.
- **Case Styling:** Use All-Caps for section headers and primary navigation items to mimic the formal presentation of parliamentary documents.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **single-column stack** for mobile.

- **Rhythm:** A 4px/8px baseline grid ensures consistent vertical rhythm.
- **Sectioning:** Use large vertical gaps (80px to 120px) between major content blocks to ensure the "Clean/Professional" aesthetic is maintained through whitespace.
- **Alignment:** Content should be primarily left-aligned to mirror the reading pattern of official reports.
- **Asymmetry:** Incorporate "broken" grid elements, such as images that bleed off-side or diagonal background containers, to distinguish the UI from a standard corporate site.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** rather than heavy shadows.

- **Level 0 (Base):** Neutral Light (#F8FAFB) for the main page background.
- **Level 1 (Cards):** Pure White (#FFFFFF) surfaces with a very soft, diffused shadow (0px 4px 20px rgba(0, 120, 155, 0.05)) to create a subtle lift.
- **Level 2 (Interactive):** Elements like "Batafsil" (Detail) buttons use a slight 1px border (#E2E8F0) to define boundaries without adding visual weight.
- **Glassmorphism:** Used exclusively for over-image content (e.g., hero labels or countdown timers). Use a 12px backdrop-blur and 80% opacity on white or primary blue backgrounds to maintain legibility over complex photography.

## Shapes

The shape language is **Soft (0.25rem/4px)** for standard components like input fields and buttons, maintaining a professional and crisp appearance.

However, a **Signature Shape** is introduced for large containers and hero sections: 
- **The "Parliament Arc":** Large images or hero banners should feature a single heavily rounded corner (top-right or bottom-left at 100px+) to create a unique brand identifier that feels inclusive and non-aggressive.
- **Iconography:** Use linear, medium-stroke icons that match the primary color palette.

## Components

### Buttons
- **Primary:** Filled Primary Blue (#00789B) with white text. 4px border radius. Hover state: darken to #005A75.
- **Secondary (Ghost):** 2px border in Primary Blue or White, with matching text. No fill. 
- **Action Link:** Text-only with a trailing chevron (e.g., "Batafsil >"), using the Primary Blue or Secondary Teal.

### Cards
- **News/Media Cards:** White background, Level 1 shadow. Images should have 0px top radius and 4px bottom radius to match the container. Headlines within cards use `headline-sm`.

### Accordions (FAQ)
- Use thin separators (#E2E8F0).
- Trigger icons (Plus/Minus) should be housed in a soft-teal circular background (#E6FFFA).

### Inputs & Selects
- 1px border (#CBD5E0) with 4px radius. 
- Focus state: 2px border in Primary Blue with a subtle outer glow.

### Progress & Status
- Use the Secondary Teal (#2CC1BE) for all progress bars and "active" status indicators to provide a distinct visual cue away from the primary branding.