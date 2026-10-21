# NearCart — Design System & Color Guide 🎨

> **NearCart UI Design Specification**  
> Hyperlocal Marketplace Design System • Light-First Theme • Indigo × Emerald × Coral Palette  
> Version: 2.0 • Architecture: Vanilla CSS Tokens + CSS Modules

---

## 📑 Table of Contents

1. [Design Philosophy & Core Aesthetic](#1-design-philosophy--core-aesthetic)
2. [Color Palette & Tokens](#2-color-palette--tokens)
   - [Brand Primary: Deep Indigo](#brand-primary-deep-indigo)
   - [Brand Secondary: Fresh Emerald](#brand-secondary-fresh-emerald)
   - [Accent: Warm Coral & Rose](#accent-warm-coral--rose)
   - [Warning & Promo: Vibrant Amber](#warning--promo-vibrant-amber)
   - [Semantic Color Tokens](#semantic-color-tokens)
   - [Neutral Surfaces & Dark Mode Adaptation](#neutral-surfaces--dark-mode-adaptation)
   - [Signature Gradients](#signature-gradients)
3. [Typography Hierarchy](#3-typography-hierarchy)
4. [Spacing & 8-Point Grid System](#4-spacing--8-point-grid-system)
5. [Elevation, Shadows & Glassmorphism](#5-elevation-shadows--glassmorphism)
6. [Borders & Corner Radii](#6-borders--corner-radii)
7. [Motion, Timing & Keyframe Animations](#7-motion-timing--keyframe-animations)
8. [Component Design Specifications](#8-component-design-specifications)
9. [Layout Shells & Viewport Architecture](#9-layout-shells--viewport-architecture)
10. [Accessibility, Focus & Interaction Rules](#10-accessibility-focus--interaction-rules)

---

## 1. Design Philosophy & Core Aesthetic

NearCart is crafted to evoke the feeling of a **modern, trustworthy, high-speed neighborhood bazaar**. 

- **Light-First & Crisp**: Clean, high-legibility surfaces with deliberate white space so product imagery, store badges, and price comparisons pop immediately.
- **Vibrant Local Accents**: A tri-color harmony featuring **Deep Indigo** (structure, security, platform authority), **Fresh Emerald** (organic freshness, local trust, grocery vitality), and **Warm Coral** (promos, quick-action triggers, discounts, and urgency).
- **Glassmorphism & Depth**: Multi-stop soft layered shadows coupled with backdrop-blur glass panels (`backdrop-filter: blur(20px)`) that give modals, sticky navigation headers, and floating search bars an organic physical feel.
- **Haptic Micro-Interactions**: Expressive hover states (`translateY(-2px)`, scale down `0.975` on active press), smooth spring easings, and non-blocking skeleton shimmers for zero visual layout shifts (CLS).

All core variables are centralized in [`src/styles/variables.css`](file:///d:/nearCartUi/src/styles/variables.css) and applied across [`src/index.css`](file:///d:/nearCartUi/src/index.css) and modular component stylesheets.

---

## 2. Color Palette & Tokens

### Brand Primary: Deep Indigo
Indigo serves as the foundational brand anchor. Used for primary buttons, active navigation markers, key icons, and headers.

| CSS Variable | Hex Code | Visual Swatch | Typical Application |
|---|---|---|---|
| `--color-primary-50` | `#EEF2FF` | `rgb(238, 242, 255)` | Active item tint, badge background, subtle hover fill |
| `--color-primary-100` | `#E0E7FF` | `rgb(224, 231, 255)` | Border highlight, selection background |
| `--color-primary-200` | `#C7D2FE` | `rgb(199, 210, 254)` | Soft borders, focus ring glow |
| `--color-primary-300` | `#A5B4FC` | `rgb(165, 180, 252)` | Interactive borders on hover |
| `--color-primary-400` | `#818CF8` | `rgb(129, 140, 248)` | Sub-brand badges, dark mode accents |
| `--color-primary-500` | `#6366F1` | `rgb(99, 102, 241)` | Secondary CTAs, gradient mid-tones |
| `--color-primary-600` | `#4F46E5` | `rgb(79, 70, 229)` | **Primary Brand Color** (`--color-primary`), main CTA |
| `--color-primary-700` | `#4338CA` | `rgb(67, 56, 202)` | Button `:hover` state, pressed indicators |
| `--color-primary-800` | `#3730A3` | `rgb(55, 48, 163)` | High-contrast headers on light backgrounds |
| `--color-primary-900` | `#312E81` | `rgb(49, 46, 129)` | Deep branding accents |

```css
/* Quick Semantic Aliases */
--color-primary:       var(--color-primary-600); /* #4f46e5 */
--color-primary-dark:  var(--color-primary-700); /* #4338ca */
--color-primary-light: var(--color-primary-50);  /* #eef2ff */
```

---

### Brand Secondary: Fresh Emerald
Emerald reflects freshness, hyperlocal farm-to-table groceries, instant confirmation, and positive statuses.

| CSS Variable | Hex Code | Visual Swatch | Typical Application |
|---|---|---|---|
| `--color-emerald-50` | `#ECFDF5` | `rgb(236, 253, 245)` | Success badges, verified store backgrounds |
| `--color-emerald-100` | `#D1FAE5` | `rgb(209, 250, 229)` | Soft success borders |
| `--color-emerald-200` | `#A7F3D0` | `rgb(167, 243, 208)` | Active stage pill borders |
| `--color-emerald-300` | `#6EE7B7` | `rgb(110, 231, 183)` | Progress bar fillers |
| `--color-emerald-400` | `#34D399` | `rgb(52, 211, 153)` | Dark mode success text |
| `--color-emerald-500` | `#10B981` | `rgb(16, 185, 129)` | **Brand Secondary** (`--color-secondary`), stock status |
| `--color-emerald-600` | `#059669` | `rgb(5, 150, 105)` | Delivered status, positive order badges |
| `--color-emerald-700` | `#047857` | `rgb(4, 120, 87)` | Text color on light emerald badge background |

---

### Accent: Warm Coral & Rose
Coral creates urgency and delight without feeling punitive. Used for discounts, coupons, shopping cart counts, and special offers.

| CSS Variable | Hex Code | Typical Application |
|---|---|---|
| `--color-accent-50` | `#FFF1F2` | Promo discount ribbon background, error surface |
| `--color-accent-100` | `#FFE4E6` | Border for active promo codes |
| `--color-accent-200` | `#FECDD3` | Danger border outline |
| `--color-accent-300` | `#FDA4AF` | Price comparison difference indicators |
| `--color-accent-400` | `#FB7185` | Highlighted pill badges |
| `--color-accent-500` | `#F43F5E` | **Brand Accent** (`--color-accent`), Cart badges |
| `--color-accent-600` | `#E11D48` | Destructive action buttons, stock warnings |
| `--color-accent-700` | `#BE123C` | Error text on soft background |

---

### Warning & Promo: Vibrant Amber
Amber is reserved for customer review stars, pending verification workflows, delivery courier timeouts, and operational alerts.

| CSS Variable | Hex Code | Typical Application |
|---|---|---|
| `--color-amber-50` | `#FFFBEB` | Warning card background, courier alert banner |
| `--color-amber-100` | `#FEF3C7` | Rating tag fill, pending KYC chip |
| `--color-amber-400` | `#FBBF24` | Customer rating stars fill |
| `--color-amber-500` | `#F59E0B` | In-progress delivery milestones |
| `--color-amber-600` | `#D97706` | Warning status badge text |

---

### Semantic Color Tokens

| Semantic Role | Base Color | Background Tint | Text on Tint |
|---|---|---|---|
| **Success** | `--color-success: #059669` | `--color-success-bg: #ecfdf5` | `--color-success-text: #047857` |
| **Warning** | `--color-warning: #d97706` | `--color-warning-bg: #fffbeb` | `--color-warning-text: #b45309` |
| **Error / Danger** | `--color-error: #e11d48` | `--color-error-bg: #fff1f2` | `--color-error-text: #be123c` |
| **Info / Notice** | `--color-info: #4f46e5` | `--color-info-bg: #eef2ff` | `--color-info-text: #4338ca` |

---

### Neutral Surfaces & Dark Mode Adaptation

NearCart supports fluid Dark and Light modes using the root attribute `[data-theme="dark"]` synced via [`useTheme.js`](file:///d:/nearCartUi/src/hooks/useTheme.js).

| Role | Light Mode Value | Dark Mode (`[data-theme="dark"]`) | Description |
|---|---|---|---|
| `--color-bg` | `#F8F9FC` (Soft icy white) | `#0A0C15` (Deep space obsidian) | Base canvas background |
| `--color-bg-secondary` | `#F1F3F9` | `#0F1120` | Card headers, table header background |
| `--color-bg-tertiary` | `#E8EAF0` | `#161828` | Segmented controls, neutral chips |
| `--color-surface` | `#FFFFFF` (Pure white) | `#12152A` (Midnight blue-grey) | Cards, modals, dropdown panels |
| `--color-surface-hover` | `#F8F9FC` | `#1A1E35` | Interactive row/card hover |
| `--color-surface-raised` | `#FFFFFF` | `#1E2240` | Floating popovers & sticky headers |
| `--color-border` | `#E4E7EF` | `#1F2442` | Default subtle divider border |
| `--color-border-strong` | `#D0D5E3` | `#2A3056` | Form input and active container borders |
| `--color-text-primary` | `#0D0F1A` | `#F0F2FF` | High contrast primary text & headings |
| `--color-text-secondary` | `#4B5675` | `#8B95C9` | Body copy, descriptions, icon colors |
| `--color-text-tertiary` | `#9199B3` | `#4E597F` | Meta info, timestamps, placeholders |
| `--color-text-muted` | `#BEC4D6` | `#2D3558` | Disabled text, subtle icon lines |

---

### Signature Gradients

```css
/* Core Gradients defined in variables.css */
--gradient-primary:  linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);  /* Indigo to Violet */
--gradient-emerald:  linear-gradient(135deg, #059669 0%, #0d9488 100%);  /* Emerald to Teal */
--gradient-accent:   linear-gradient(135deg, #f43f5e 0%, #fb923c 100%);  /* Rose to Coral */
--gradient-hero:     linear-gradient(135deg, #f8f9fc 0%, #eef2ff 50%, #f0fdf4 100%);
--gradient-surface:  linear-gradient(160deg, #ffffff 0%, #f8f9fc 100%);
--gradient-sidebar:  linear-gradient(180deg, #0d0f1a 0%, #1a1d2e 100%);
```

---

## 3. Typography Hierarchy

NearCart combines **Plus Jakarta Sans** for prominent display headers and brand elements with **Inter** for dense UI tables, metrics, and body readability.

### Typeface Families
- **Display & Headings**: `'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif` (`--font-sans`)
- **Body & Controls**: `'Inter', system-ui, -apple-system, sans-serif` (`--font-body`)
- **Code & Numeric (OTP, Order IDs)**: `'JetBrains Mono', 'Fira Code', Consolas, monospace` (`--font-mono`)

### Type Scale

| Scale Token | Rem | Pixel Equivalent | Line Height | Letter Spacing | Typical Usage |
|---|---|---|---|---|---|
| `--text-2xs` | `0.625rem` | 10px | `1.2` | `0.025em` | Status badge tags, micro captions |
| `--text-xs` | `0.75rem` | 12px | `1.35` | `0` | Form hints, helper errors, timestamps |
| `--text-sm` | `0.8125rem` | 13px | `1.5` | `0` | Table data cells, secondary attributes |
| `--text-base` | `1.0rem` | 16px | `1.5` | `0` | Default body copy, form inputs, buttons |
| `--text-lg` | `1.125rem` | 18px | `1.35` | `-0.02em` | Section headers, card titles, large buttons |
| `--text-xl` | `1.25rem` | 20px | `1.35` | `-0.02em` | Modal titles, product card prices |
| `--text-2xl` | `1.5rem` | 24px | `1.2` | `-0.02em` | Page subheadings, stat numbers |
| `--text-3xl` | `1.875rem` | 30px | `1.2` | `-0.02em` | Dashboard primary KPI values |
| `--text-4xl` | `2.25rem` | 36px | `1.2` | `-0.04em` | Page main titles (h1) |
| `--text-5xl` | `3.0rem` | 48px | `1.1` | `-0.04em` | Landing hero headlines |
| `--text-6xl` | `3.75rem` | 60px | `1.0` | `-0.04em` | Marketing banners |

### Font Weights
- `300` (`--font-light`)
- `400` (`--font-regular`)
- `500` (`--font-medium`)
- `600` (`--font-semibold`) — *Default for buttons, nav links, badges*
- `700` (`--font-bold`) — *Default for headers, KPI totals*
- `800` (`--font-extrabold`)
- `900` (`--font-black`)

---

## 4. Spacing & 8-Point Grid System

Every layout, component margin, padding, and gap adheres to a clean mathematical 8px base rhythm (with 4px and 2px half-steps for micro alignments).

| Token | Pixels | Usage Example |
|---|---|---|
| `--space-px` | 1px | Fine borders, dividers |
| `--space-0-5` | 2px | Micro badge dots, tight icon gaps |
| `--space-1` | 4px | Tag padding, icon-to-label spacing |
| `--space-2` | 8px | Button inline gap, form label margin |
| `--space-3` | 12px | Compact card padding, dropdown item padding |
| `--space-4` | 16px | Standard button padding, form input spacing |
| `--space-5` | 20px | Navigation item margin, table cell padding |
| `--space-6` | 24px | Default Card internal padding, grid gaps |
| `--space-7` | 28px | Section sub-gap |
| `--space-8` | 32px | Layout gutters, dialog padding |
| `--space-10` | 40px | Section row separations |
| `--space-12` | 48px | Major dashboard grid block spacing |
| `--space-16` | 64px | Landing page section gaps |
| `--space-20` | 80px | Hero banner vertical spacing |

---

## 5. Elevation, Shadows & Glassmorphism

NearCart uses ultra-subtle, multi-layered ambient occlusions to simulate depth without muddy, heavy drop shadows.

### Standard Elevations
- `--shadow-xs`: `0 1px 2px rgba(13, 15, 26, 0.04)` — Subtle inputs, default buttons.
- `--shadow-sm`: `0 1px 4px rgba(13, 15, 26, 0.05), 0 2px 6px rgba(13, 15, 26, 0.03)` — Default Cards.
- `--shadow-md`: `0 4px 16px rgba(13, 15, 26, 0.07), 0 2px 6px rgba(13, 15, 26, 0.04)` — Hovered items, flyouts.
- `--shadow-lg`: `0 10px 32px rgba(13, 15, 26, 0.09), 0 4px 12px rgba(13, 15, 26, 0.05)` — Dropdowns, sticky carts.
- `--shadow-xl`: `0 20px 48px rgba(13, 15, 26, 0.12)` — Modals, drawer overlays.
- `--shadow-2xl`: `0 40px 80px rgba(13, 15, 26, 0.16)` — Critical checkout & payment dialogs.

### Colored Ambient Glows
- `--shadow-primary`: `0 8px 24px -4px rgba(79, 70, 229, 0.32), 0 2px 8px rgba(79, 70, 229, 0.12)`
- `--shadow-emerald`: `0 8px 24px -4px rgba(5, 150, 105, 0.28), 0 2px 8px rgba(5, 150, 105, 0.10)`
- `--shadow-accent`: `0 8px 24px -4px rgba(228, 29, 72, 0.28), 0 2px 8px rgba(228, 29, 72, 0.10)`

### Glassmorphism Utility (`.glass`)
```css
.glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

[data-theme="dark"] .glass {
  background: rgba(18, 21, 42, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

---

## 6. Borders & Corner Radii

Soft curves represent friendlier, accessible neighborhood shopping:

| Token | Value | Applied To |
|---|---|---|
| `--radius-xs` | `4px` | Tiny checkboxes, notification counters |
| `--radius-sm` | `6px` | Focus outlines, code snippets, tags |
| `--radius-md` | `10px` | Form inputs, table cells, small action buttons |
| `--radius-lg` | `14px` | Standard buttons, dialog popovers |
| `--radius-xl` | `18px` | Brand logos, feature cards |
| `--radius-2xl` | `24px` | Store product cards, modal windows |
| `--radius-3xl` | `32px` | Large hero search blocks |
| `--radius-full` | `9999px` | Avatars, pills, status badges, quantity steppers |

---

## 7. Motion, Timing & Keyframe Animations

Animations in NearCart are purposeful, fluid, and respect `prefers-reduced-motion: reduce`.

### Easings & Speeds
- `--ease-out-expo`: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy, modern entry)
- `--ease-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)` (tactile micro bounce)
- `--transition-fast`: `150ms var(--ease-out-expo)` — Button hover, link colors.
- `--transition-normal`: `250ms var(--ease-out-expo)` — Card lift, dropdown open.
- `--transition-slow`: `400ms var(--ease-out-expo)` — Page transitions, drawer slide.

### Keyframe Animations
- **Shimmer Loading** (`.shimmer`): Linear gradient sweep for skeleton cards.
- **Fade In Up** (`.animate-fade-in-up`): `translateY(16px)` to `0` for new listings.
- **Scale In** (`.animate-scale-in`): `scale(0.95)` to `1` for modals and alert dialogs.
- **Slide In Left** (`.animate-slide-left`): Drawer and notification flyouts.

---

## 8. Component Design Specifications

### 1. Button (`Button.jsx` / `Button.module.css`)
- **Variants**:
  - `primary`: Gradient indigo, white text, indigo glow shadow.
  - `emerald`: Gradient emerald, white text, emerald glow shadow.
  - `accent`: Gradient rose/coral, white text.
  - `outline`: Border `var(--color-border-strong)`, hover with `var(--color-primary-300)`.
  - `ghost`: Transparent background, hover fills `var(--color-bg-secondary)`.
  - `ghost-primary`: Light indigo background (`--color-primary-50`), indigo text.
  - `danger`: Light coral background, transforms to solid rose on hover.
- **Sizes**: `sm` (28px height), `md` (38px height), `lg` (46px height), `xl` (54px height).
- **Loading State**: Rotating circular white spinner with disabled pointer events.

### 2. Badge (`Badge.jsx` / `Badge.module.css`)
- **Semantic Status Types**: `success`, `warning`, `error`, `info`, `neutral`.
- **Anatomy**: Left status dot indicator (`.dot`), uppercase tracking label, pill border-radius (`--radius-full`).
- **Solid Badges**: `solid-primary`, `solid-emerald`, `solid-accent` used for discounts (e.g. `20% OFF`).

### 3. Card (`Card.jsx` / `Card.module.css`)
- **Variants**:
  - Standard: `background: var(--color-surface)`, 1px border.
  - `hoverable`: Elevates with `translateY(-3px)` and `--shadow-lg`.
  - `glass`: Translucent blur surface with semi-opaque border.
  - `flat`: Zero shadow, flat structural border.
- **Structure**: `CardHeader`, `CardTitle`, `CardSubtitle`, `CardBody`, `CardFooter`.

### 4. Input & Form Fields (`Input.jsx` / `Input.module.css`)
- **Labeling**: 13px bold sans-serif with red asterisk (`*`) for required fields.
- **Left & Right Icon Slots**: Clean 16px SVGs centered vertically.
- **State Feedback**: Focus creates a crisp 2px border in `--color-primary` with a 3px soft indigo outer halo.
- **Error Display**: Inline red message with alert icon and red input border.

### 5. Quantity Stepper (`QuantityStepper.jsx`)
- Compact pill containing decrement (`-`), bold numerical quantity, and increment (`+`).
- Automatically disables `-` or `+` when matching min/max inventory bounds.

---

## 9. Layout Shells & Viewport Architecture

NearCart uses structured responsive shells tailored to each role:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        NearCart Global Layout                          │
├───────────────────┬────────────────────────────────────────────────────┤
│   FIXED SIDEBAR   │                   MAIN CONTENT                     │
│      (260px)      │                                                    │
│                   │  ┌──────────────────────────────────────────────┐  │
│  • Brand Logo     │  │  Top Utility Header: Location / Search / Bell│  │
│  • Nav Links      │  └──────────────────────────────────────────────┘  │
│  • Active Badges  │                                                    │
│  • Role Pill      │  ┌──────────────────────────────────────────────┐  │
│  • Theme Toggle   │  │  Page Canvas: Grids, Tables, Stepper Flows   │  │
│  • User Profile   │  └──────────────────────────────────────────────┘  │
└───────────────────┴────────────────────────────────────────────────────┘
```

1. **Customer Shell** ([`CustomerLayout.jsx`](file:///d:/nearCartUi/src/layouts/CustomerLayout.jsx)):
   - Fixed Desktop Sidebar with store categories, orders, saved addresses, and live cart preview.
   - Sticky Top Bar with confirmed Pune delivery cluster (e.g., Baner, Aundh, Hinjewadi) and global product search.
   - Mobile View: Collapses sidebar into a bottom navigation bar with easy thumb reach.
2. **Dashboard Shell** ([`DashboardLayout.jsx`](file:///d:/nearCartUi/src/layouts/DashboardLayout.jsx)):
   - Shared desktop foundation for **Shop Owner**, **Delivery Partner**, and **Platform Admin**.
   - Collapsible desktop sidebar (260px expanded, 72px icon-only collapsed).
   - Sticky top breadcrumb bar with active role badge and notification center.
3. **Public Shell** ([`PublicLayout.jsx`](file:///d:/nearCartUi/src/layouts/PublicLayout.jsx)):
   - Clean landing page header, smooth transparent-to-glass transition on scroll.

---

## 10. Accessibility, Focus & Interaction Rules

- **Contrast Ratios**: All primary, body, and status text pairings pass WCAG AA standards (minimum 4.5:1 against their respective backgrounds).
- **Focus Rings**: `:focus-visible` defines an intentional `2px solid var(--color-primary)` with `2px offset`, ensuring keyboard navigation is obvious.
- **Motion Reduction**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- **Z-Index Layer Hierarchy**:
  - Base content: `0`
  - Sticky sub-bars: `20`
  - Fixed Sidebars & Topbar: `100` - `200`
  - Dropdowns & Popovers: `100` - `300`
  - Modal Overlays: `400`
  - Toast Notifications: `500`

---
*Created as part of the NearCart frontend architecture documentation.*
