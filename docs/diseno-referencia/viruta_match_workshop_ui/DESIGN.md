---
name: Viruta Match Workshop UI
colors:
  surface: '#fbf9f3'
  surface-dim: '#dcdad4'
  surface-bright: '#fbf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ed'
  surface-container: '#f0eee8'
  surface-container-high: '#eae8e2'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c18'
  on-surface-variant: '#564338'
  inverse-surface: '#30312d'
  inverse-on-surface: '#f3f1eb'
  outline: '#897267'
  outline-variant: '#ddc1b3'
  surface-tint: '#9b4500'
  primary: '#903f00'
  on-primary: '#ffffff'
  primary-container: '#b45309'
  on-primary-container: '#fff1eb'
  inverse-primary: '#ffb68e'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#006347'
  on-tertiary: '#ffffff'
  tertiary-container: '#147e5d'
  on-tertiary-container: '#cbffe5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb68e'
  on-primary-fixed: '#331200'
  on-primary-fixed-variant: '#763300'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#97f5cc'
  tertiary-fixed-dim: '#7bd8b1'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#00513a'
  background: '#fbf9f3'
  on-background: '#1b1c18'
  surface-variant: '#e4e2dd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.375rem
    fontWeight: '700'
    lineHeight: 1.75rem
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  metric-display:
    fontFamily: JetBrains Mono
    fontSize: 1.875rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.03em
  metric-value:
    fontFamily: JetBrains Mono
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.02em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '700'
    lineHeight: 1rem
    letterSpacing: 0.06em
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.125rem
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered for timber yards, sawmills, and carpentry branch hubs operating across desktop terminals and ruggedized workshop tablets. The brand identity fuses the tactile warmth of raw lumber craftsmanship with the uncompromised precision of modern industrial inventory logistics.

### Personality & Emotional Tenor
- **Utilitarian & Grounded:** Pragmatic, rugged, and free of superficial ornament. Built to endure high-glare warehouse lighting, sawdust-covered screens, and rapid finger-taps from operators wearing work gloves.
- **Warm Architectural Craft:** Elevated by natural birch, amber resin, and oxidized steel tones, rejecting sterile enterprise gray in favor of a workshop-rooted aesthetic.
- **Decisive & Accurate:** High-contrast data density, unambiguous state transitions, and dimensional clarity that eliminate costly cutting and dispatch errors.

### Visual Style
The interface follows a **Warm Industrial Modernist** model:
- Crisp planar structure defined by fine architectural dividers rather than heavy drop shadows.
- Warm birch and sawdust tinted neutral surfaces (`#F8F6F0` to `#EBE7DF`) establishing a low-fatigue workspace.
- High-contrast charcoal slate anchor elements (`#0F172A`, `#1E293B`) anchoring primary toolbars, navigation rails, and terminal headers.
- Precision monospaced readouts for all physical units (thickness, width, length in mm), batch codes, and reservation timers.

## Colors

The color system establishes functional hierarchy tailored for branch store readability and workshop environmental factors.

### Core Swatches
- **Primary (`#B45309` Amber Timber):** Core brand action tone representing raw timber core and treated cedar. Used for active navigation tabs, focal confirmation triggers, and high-priority selectors. Accent variant `#D97706` applies to interactive hover states.
- **Secondary (`#1E293B` Cast Iron / Slate):** Industrial structural anchor. Used for primary typography, persistent toolbars, table headers, and structural borders. Dark terminal base is `#0F172A`.
- **Tertiary (`#047857` Spruce Forest):** Dedicated functional color for completed states: `DISPONIBLE`, `VALIDADO`, `RETIRADO`, and inventory stock confirmations.
- **Neutral Canvas (`#F8F6F0` Natural Birch):** Ultra-soft, low-glare surface tone mirroring fresh plywood and birch grain. Eliminates screen glare under fluorescent depot lighting while maintaining superior contrast against `#1E293B` text.

### Domain-Specific Status Tokens
- **State: Cargado / Borrador:** Slate neutral (`#475569` text on `#F1F5F9` background, `#CBD5E1` border).
- **State: Validado / Disponible / Concretado:** Emerald pine (`#065F46` text on `#ECFDF5` background, `#A7F3D0` border).
- **State: Pendiente / Reservado:** Warm amber ochre (`#92400E` text on `#FEF3C7` background, `#FDE68A` border).
- **State: Rechazado / Vencido / Defectuoso:** Crimson brick (`#991B1B` text on `#FEF2F2` background, `#FECACA` border).

### Functional Surfaces
- **App Canvas:** `#F8F6F0`
- **Surface Level 1 (Card / Modal Surface):** `#FFFFFF`
- **Surface Level 2 (Inset / Input Well / Stepper Track):** `#EFECE6`
- **Surface Level 3 (Selected Container):** `#FEF3C7`
- **Structural Dividing Line:** `#E2DDD5`
- **Focus Ring:** `#B45309` (3px outer ring with 1px white offset)

## Typography

The typographic hierarchy implements a high-legibility dual-font strategy tailored for workshop ergonomics:

1. **Plus Jakarta Sans (Interface & Narrative):** Provides large x-height, wide apertures, and clean geometric curves that remain readable at arm's length on tablet mounts. Used for headings, body copy, component labels, and status callouts.
2. **JetBrains Mono (Technical Dimensions & Timers):** Enforces tabular column alignment and tabular numbers across timber cuts, millimetric board measurements (e.g., `18mm × 1830mm × 2600mm`), inventory SKUs, and remaining reservation countdowns.

### Application Rules
- **Numerical Alignment:** All piece dimensions, volumetric calculations, stock counts, and prices must strictly use `JetBrains Mono` with tabular numeral figures enabled (`font-variant-numeric: tabular-nums`).
- **Domain State Tags:** Status tags must always render in `label-caps` (`0.75rem`, weight `700`, uppercase with `0.06em` letter spacing) to ensure instant visual identification at a distance.

## Layout & Spacing

This design system uses a fluid responsive grid built on an 8-point base module (with 4px micro-steps for tight badge and input alignments).

### Form Factor Behavior
- **Branch Desktop Terminals (>= 1280px):** 12-column grid with `margin-desktop: 2rem` and `gutter-desktop: 1.5rem`. Layout accommodates a persistent 280px left navigation rail, master-detail timber batch lists, and side-by-side dimension inspection panes.
- **Workshop Tablets Landscape (1024px - 1279px):** 8-column layout with `margin-tablet: 1.5rem` and `gutter: 1rem`. Master list condenses into an expandable drawer; split screen displays the active piece card and large quick-stepper keypad simultaneously.
- **Workshop Tablets Portrait & Rugged Handhelds (< 1023px):** 4-column layout with `margin: 1rem` and `gutter: 1rem`. Full-width single-column flow with pinned bottom action bars for immediate one-thumb operational confirmation.

### Ergonomic Touch Sizing
To accommodate touch operation in busy, dust-prone workshop conditions:
- **Primary Interactive Targets:** Minimum touch bounding box of `48px × 48px` (ideal `56px` height on numeric keypads and major buttons).
- **Control Gaps:** Minimum `space-sm` (8px) between touch targets to completely prevent accidental adjacent button hits.

## Elevation & Depth

To ensure clarity under direct industrial workshop luminaires, visual depth avoids weak blurred shadows. Instead, visual hierarchy relies on **tactile tonal layering** and **calibrated architectural hairline borders**.

### Depth Layers
- **Floor (Canvas):** `#F8F6F0` (Sawdust Birch base, completely flat).
- **Level 1 (Workshop Cards & Panels):** Pure white `#FFFFFF` with a crisp `1px solid #E2DDD5` perimeter line. Optional micro ambient shadow: `0 1px 3px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Active / Focus Items / Selected Boards):** `#FFFFFF` framed by a `2px solid #B45309` amber stroke, lifted by a warm directional shadow: `0 4px 12px -2px rgba(180, 83, 9, 0.12), 0 2px 4px -1px rgba(15, 23, 42, 0.06)`.
- **Level 3 (Modal Sheets, Touch Keypads, Camera Sheets):** Elevated above a 60% opacity `#0F172A` backdrop scrim. Panel styling features `#FFFFFF` background, `1px solid #CBD5E1`, and a structured drop shadow: `0 12px 28px -4px rgba(15, 23, 42, 0.18), 0 4px 8px -2px rgba(15, 23, 42, 0.08)`.
- **Recessed / Inset Layer (Measurement Wells & Stepper Backings):** `#EFECE6` with `inset 0 1px 2px rgba(15, 23, 42, 0.06)` to communicate physical containment.

## Shapes

The design system enforces a **Soft Utilitarian** corner profile (`roundedness: 1`), balancing industrial machine precision with comfortable ergonomic handling.

### Corner Token Scale
- **`rounded-sm` (2px):** Metric inline code tags, dimension markers, and table cells.
- **`rounded-base` (4px):** Standard buttons, numeric stepper buttons, form fields, and status badges.
- **`rounded-lg` (8px):** Timber product cards, camera viewport containers, modal dialog frames, and panel drawers.
- **`rounded-xl` (12px):** Main app layout containers, quick-access bottom sheets, and floating tool docks.
- **Pill Exception (`rounded-full`):** Board substrate material selectors (Melamina, MDF, Pino, Aglomerado, Terciado) to deliver immediate distinction between classification pills and actionable command buttons.

## Components

### 1. Buttons
- **Primary Action (Confirm / Validar / Guardar):** Solid `#B45309` amber fill, `#FFFFFF` text, `52px` tablet height (`44px` desktop). In hover/active: `#92400E`. Border-radius `4px`. Text in `Plus Jakarta Sans` semi-bold 16px.
- **Secondary Action (Cancel / Return):** Solid `#FFFFFF` fill with `1.5px solid #CBD5E1` border, `#1E293B` text. In hover: `#F1EFE9`.
- **Destructive Action (Rechazar / Descartar):** Solid `#FEF2F2` fill, `#991B1B` text, `1px solid #FECACA`. Active state transitions to `#DC2626` with `#FFFFFF` text.

### 2. Substrate Chips & Material Selectors
- **Purpose:** Quick-selection of raw lumber materials: *Melamina, MDF, Pino, Aglomerado, Terciado*.
- **Style:** Pill-shaped (`rounded-full`), `42px` touch height, horizontal flex row with swipe-scroll on mobile.
- **Inactive State:** `#FFFFFF` background, `1.5px solid #D1C9BE` border, `#475569` text.
- **Selected State:** `#1E293B` slate background, `#FFFFFF` text, bold weight, with an amber micro-indicator dot on the left.

### 3. Domain Status Badges
- **Format:** Tight rectangular capsule (`rounded-base`), uppercase `label-caps` typography, internal padding `4px 8px`.
- **States:**
  - `CARGADO`: `#F1F5F9` background, `#475569` text, `#CBD5E1` outline.
  - `VALIDADO`: `#ECFDF5` background, `#047857` text, `#A7F3D0` outline.
  - `DISPONIBLE`: `#D1FAE5` background, `#065F46` text, `#6EE7B7` outline with left green status pin.
  - `RESERVADO`: `#FEF3C7` background, `#B45309` text, `#FCD34D` outline with countdown timer icon.
  - `RECHAZADO`: `#FEF2F2` background, `#B91C1C` text, `#FCA5A5` outline.
  - `RETIRADO`: `#E2E8F0` background, `#334155` text, `#94A3B8` outline.

### 4. Timber Dimension Stepper & Measurement Inputs
- **Display:** Stacked container with label (e.g., `ESPESOR`, `ANCHO`, `LARGO`), recessed background (`#EFECE6`), and bold numbers rendered in `JetBrains Mono` (`24px`).
- **Controls:** Flanking `-` and `+` square touch buttons (`48px × 48px`), `#FFFFFF` surface, high-contrast `#1E293B` icons, engineered for single-tap adjustments of standard increments (+1mm, +10mm, +50mm).
- **Unit Signifier:** Static affix badge reading `mm` in `0.75rem` uppercase slate.

### 5. Piece Photo Capture Cards
- **Container:** White surface card, `rounded-lg`, with `1px solid #E2DDD5`.
- **Aspect Ratio:** Rigid `4:3` framing container with a dark slate preview frame (`#0F172A`).
- **Overlay:** High-contrast rule lines to guide lumber edge alignment. Includes a floating high-contrast camera trigger button (`56px` circle, `#B45309` fill, white camera glyph).
- **Defect Pinning:** Interactive red target markers (`#EF4444`) tap-to-place on the photo preview to flag knots, cracks, or edge chipping.

### 6. Pinned Tablet Action Bar
- **Position:** Fixed to the screen bottom on tablet/mobile views.
- **Surface:** `#0F172A` deep industrial slate with top edge `1px solid #334155`.
- **Content:** Left side displays piece summary (`Code + Material + Dimension`); right side presents split split action triggers: `RECHAZAR` (destructive secondary) and `CONFIRMAR INGRESO` (primary amber `#B45309`).