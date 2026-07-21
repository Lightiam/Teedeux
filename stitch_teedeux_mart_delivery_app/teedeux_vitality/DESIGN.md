---
name: Teedeux Vitality
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#584238'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8c7166'
  outline-variant: '#e0c0b2'
  surface-tint: '#a04100'
  primary: '#9c3f00'
  on-primary: '#ffffff'
  primary-container: '#c45100'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb693'
  secondary: '#3b6934'
  on-secondary: '#ffffff'
  secondary-container: '#b9eeab'
  on-secondary-container: '#3f6d38'
  tertiary: '#765700'
  on-tertiary: '#ffffff'
  tertiary-container: '#956e00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#bcf0ae'
  secondary-fixed-dim: '#a1d494'
  on-secondary-fixed: '#002201'
  on-secondary-fixed-variant: '#23501e'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#fbbd07'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
  earth-clay: '#8B4513'
  savanna-sand: '#F9F4E8'
  chili-red: '#9E2A2B'
  lush-leaf: '#1E3F1B'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style

This design system is built to celebrate the richness of African grocery and logistics through a **Vibrant Modern** lens. The aesthetic bridges the gap between traditional marketplace energy and contemporary SaaS reliability. It targets urban professionals and families seeking authentic ingredients with the convenience of modern tech.

The visual style is characterized by:
- **High-Energy Warmth:** Utilizing a palette that evokes sun-ripened produce and rich soil.
- **Modern Professionalism:** Balanced layouts with generous whitespace to ensure the "delivery" aspect feels surgical and dependable.
- **Food-Centricity:** Using depth and scale to make product imagery the hero of every screen.
- **Tactile Reliability:** Subtle shadows and clear container definitions that provide a sense of physical security in the ordering process.

## Colors

The palette is rooted in the "Teedeux" identity—vibrant, warm, and appetizing.

- **Primary (Burnt Orange):** Represents energy, heat, and spice. It is the main action color for CTAs and progress indicators.
- **Secondary (Forest Green):** Represents freshness, organic growth, and the agricultural roots of the products. Used for success states and "fresh" badges.
- **Tertiary (Saffron Yellow):** Used sparingly for highlights, warnings, or to draw attention to special offers.
- **Neutrals:** We use a "Soft Ink" (#1A1A1A) for maximum legibility against "Savanna Sand" (#F9F4E8) backgrounds, avoiding pure white to maintain a warm, organic feel.

## Typography

The typography strategy pairs the precision of a modern grotesque with the technical clarity of a monospaced font to reflect "Mart + Delivery."

- **Primary Typeface (Hanken Grotesk):** Chosen for its sharp, contemporary geometry. It feels efficient for a logistics service while remaining friendly enough for a food brand. Headlines use heavy weights (700-800) to command attention.
- **Functional Typeface (JetBrains Mono):** Used for metadata, SKU numbers, weights (e.g., "1kg"), and delivery timestamps. This introduces a "logistics" flavor that balances the warmth of the primary colors.
- **Scaling:** On mobile, headline sizes are reduced by roughly 15-20% to prevent awkward text wrapping while maintaining impact.

## Layout & Spacing

This design system utilizes an **8px linear scale** to ensure mathematical harmony across all components.

- **Grid Model:** A 12-column fluid grid for desktop and a 4-column grid for mobile. 
- **The "Hero" Margin:** Use wide horizontal margins (40px+) on desktop to create a premium, editorial feel that avoids the "cluttered grocery" look.
- **Rhythm:** Vertical spacing between cards and sections should be generous (stack-lg) to allow product photography to breathe. Use smaller increments (stack-sm) for internal card details like price and weight.
- **Breakpoints:**
  - Mobile: 0 - 599px
  - Tablet: 600px - 1023px
  - Desktop: 1024px+

## Elevation & Depth

To evoke a modern, high-quality service, we use **Tonal Layers** combined with **Ambient Shadows**.

- **Surfaces:** The primary background is "Savanna Sand." Elevated elements like product cards use a pure white surface to "pop" forward.
- **Shadows:** Use extremely soft, low-opacity shadows with a hint of warmth. Instead of pure grey shadows, use a very desaturated version of the Primary color (#E36414 at 5-8% opacity) to maintain color harmony.
- **Depth Levels:**
  - **Level 0 (Flat):** Backgrounds and secondary sections.
  - **Level 1 (Raised):** Product cards, input fields.
  - **Level 2 (Floating):** Navigation bars, "Add to Cart" sticky bars, and dropdowns.
- **Interactions:** On hover, cards should slightly lift (increase shadow spread) to indicate interactivity.

## Shapes

The shape language is **Rounded (Level 2)**, striking a balance between the organic nature of food and the structural integrity of a modern app.

- **Base Corner Radius:** 8px (0.5rem) for most standard components like buttons and inputs.
- **Large Components:** Product cards and promotional banners use 16px (1rem) to feel more approachable and substantial.
- **Checkboxes/Small Tags:** Maintain a consistent 4px radius to ensure they feel precise.
- **Visual Motif:** Use perfect circles for notification badges and quantity adjusters to contrast against the soft-rectangle containers.

## Components

### Buttons
- **Primary:** Burnt Orange (#E36414) with White text. Bold weight. 
- **Secondary:** Lush Leaf (#1E3F1B) outline or solid for "Fresh/Organic" specific actions.
- **Ghost:** Savanna Sand background with Ink text for secondary navigation.

### Product Cards
- Cards must have a white background, 16px corner radius, and a 1px soft border (#E0E0E0).
- Product images should be high-resolution, centered, and have a consistent background removal or soft shadow.
- Price is displayed in Hanken Grotesk Bold; Weight/Size is displayed in JetBrains Mono.

### Input Fields
- Use a "Soft Savanna" fill with a bottom-border-only focus state in Burnt Orange. This creates a modern, less "boxy" feel for the checkout experience.

### Chips & Badges
- **Status Badges (In Stock/New):** Use Forest Green with 50% opacity backgrounds and 100% opacity text for a "glass" look.
- **Category Chips:** Pill-shaped, using a light tint of the primary color to indicate selection.

### Delivery Tracker
- A signature component using a dashed line in Forest Green with monospaced (JetBrains Mono) timestamping to emphasize technical reliability.