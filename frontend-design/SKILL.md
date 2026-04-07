---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Act as a world-class UI/UX designer. Use this skill when building web components, pages, artifacts, posters, or applications. Generates creative, polished code and UI design that avoids generic AI aesthetics, heavily relying on the Vibe Coder's Web Design Guide.
license: Complete terms in LICENSE.txt
---

This skill acts as your ultimate cheat sheet for web design, turning you into a world-class UI/UX designer. You must apply the following aesthetics, layouts, animations, navigations, and typography patterns when generating code for web interfaces.

# The Vibe Coder's Web Design Guide

Everything you need to know to build world-class web interfaces.

When designing, always combine 3 things: Aesthetic + Layout + Animation. Example: "Build a glassmorphism hero section (aesthetic) with a centered two-column layout (layout) where the cards fade in on scroll (animation)." That level of detail gets you great results.

## 1. Design Aesthetics
Design aesthetics are the visual language of a website — the overall 'vibe' and personality. Understanding these styles lets you create exactly what is needed.

### 1.1 Glassmorphism
**What it is:** Makes UI elements look like frosted glass — semi-transparent, blurred, with a subtle border.
**How it works:**
- `backdrop-filter: blur()`
- `background-color: rgba(255, 255, 255, 0.15)`
- A white border at 30% opacity and a subtle drop shadow.
- Needs a colorful, vibrant background (purple/blue/pink gradients, abstract blobs).
- **Prompt Example:** "Build a glassmorphism SaaS landing page. Use a vivid purple-to-blue gradient background (#667eea to #764ba2). Create 3 feature cards that look like frosted glass panels..."

### 1.2 Neumorphism (Soft UI)
**What it is:** Elements look like they are physically pushed out of or pressed into the background surface.
**How it works:**
- Dual `box-shadow` separated by a comma (dark shadow bottom-right, light shadow top-left).
- Background and element MUST share the exact same color.
- Best at low contrast. Ideal for dark mode control panels.
- **Prompt Example:** "Create a neumorphism music player dashboard on a #e0e5ec background. Build raised circular play/pause buttons using dual box-shadows..."

### 1.3 Brutalism
**What it is:** Intentionally raw, ugly-on-purpose, and anti-establishment.
**How it works:**
- Solid 2-4px black borders on everything.
- Backgrounds of pure yellow (#FFE600) or pure white.
- Text in bold black, system fonts like monospace.
- `transform: rotate(-1deg)` for tilted elements.
- No rounded corners, no gradients.
- **Prompt Example:** "Build a brutalist portfolio website with a pure white #FFFFFF background. Use bold black borders (3px solid #000) on every card and section..."

### 1.4 Minimalism
**What it is:** Content is the design. Generous whitespace, single typeface, monochromatic color palette, zero decoration.
**How it works:**
- Large padding and margins.
- A single font used at multiple weights (typographic hierarchy).
- Near-black text on near-white background.
- **Prompt Example:** "Design a minimalist photography portfolio homepage. Use #FAFAF9 as the background. Typography only: a single font family..."

### 1.5 Bento Grid
**What it is:** Inspired by a Japanese bento box — a grid of varied-size compartments.
**How it works:**
- CSS Grid with items spanning multiple columns/rows (`grid-column: span 2`, `grid-row: span 2`).
- Varied visual treatments (dark, light, gradient, or image backgrounds) on a dark/black page background.
- **Prompt Example:** "Build a bento grid feature section on a #0A0A0A (near-black) background. Create a responsive CSS Grid with 3 columns and auto rows..."

### 1.6 Dark Mode / Dark Luxury
**What it is:** Deep charcoal or near-black backgrounds to create a premium, sophisticated atmosphere.
**How it works:**
- Near-black background (`#0A0A0A` or `#0D0D1A`), not pure black.
- Cards are slightly lighter darks (`#111111`, `#1A1A2E`).
- A single accent color (electric blue, amber, soft purple).
- Thin borders at low opacity (`rgba(255,255,255,0.08)`).
- **Prompt Example:** "Build a dark luxury SaaS landing page. Background: #0D0D1A. Primary text: #F1F1EE. Accent color: electric blue #0066FF..."

### 1.7 Retro / Y2K
**What it is:** Nostalgia from the 90s/2000s internet — neon gradients, pixel art, bold typography, starfield backgrounds.
**How it works:**
- Hot pink (`#FF00FF`), cyan (`#00FFFF`), lime green (`#AAFF00`).
- Pixel or display fonts. Star/sparkle decorations. Chrome/metallic text effects.
- **Prompt Example:** "Create a Y2K-inspired portfolio website on a #0A0A0A background. Color palette: hot pink #FF1493, electric cyan #00E5FF, and neon lime #AAFF00..."

### 1.8 Claymorphism / 3D UI
**What it is:** UI elements look inflated, puffy, and three-dimensional (clay/rubber). Playful/friendly.
**How it works:**
- Multiple `box-shadow`s: a hard bottom one for depth, soft ambient glow.
- Candy colors (soft pastels or vivid saturated colors).
- High `border-radius` (24px+). Pressed animations on buttons.
- **Prompt Example:** "Design a claymorphism task management app UI on a soft #F0F4FF background. Create 3D-looking cards and buttons using multi-layer box-shadows..."


## 2. Scroll & Animation
Control how elements appear, move, and respond as the user scrolls.

### 2.1 Parallax Scrolling
**How it works:** Background moves slowly, foreground moves normally (`translateY` at a fraction of scroll distance).

### 2.2 Scroll-Triggered Animations
**How it works:** Use IntersectionObserver or AOS to reveal elements on scroll (`opacity: 0` to `1`, `translateY(40px)` to `0`). Use stagger for lists.

### 2.3 Horizontal Scroll Sections
**How it works:** Pin a section, and as user scrolls down, slide inner content left-to-right (using GSAP ScrollTrigger).

### 2.4 Sticky Sections / Pinning
**How it works:** `position: sticky; top: 0;` Keeps an element (like a phone mockup) fixed while the sibling column (features list) scrolls.

### 2.5 Text Reveal on Scroll
**How it works:** Split heading into words/characters, stagger animate them sliding up or fading in on scroll (SplitType.js + GSAP).

### 2.6 Scroll Progress Indicator
**How it works:** A bar at the top filling left-to-right based on scroll position (`transform: scaleX(progress)`).

### 2.7 Smooth Scroll / Lenis
**How it works:** Overrides native scroll with physics-based momentum (using the Lenis library).


## 3. Layouts
### 3.1 F-Pattern Layout
- Content placement based on eye-tracking. Left-aligned heavy content.

### 3.2 Hero + Feature Grid
- Bold H1 hero + 3-column feature grid below. Very common for SaaS.

### 3.3 Asymmetric / Split Layout
- Unequal space (e.g., 60/40), creating visual tension.

### 3.4 Masonry Layout
- Pinterest-style unequal height grid (`columns: 3`). Very common for images/galleries.

### 3.5 Full-Page Scroll Sections
- Snap scrolling 100vh sections (`scroll-snap-type: y mandatory`).

### 3.6 Sidebar + Content Layout
- Sticky/fixed sidebar (dashboard style) with main content area next to it.


## 4. Navigation
- **4.1 Sticky Navbar:** `position: sticky; top: 0`, transparent to frosted-glass on scroll.
- **4.2 Hamburger / Mobile Menu:** Fullscreen overlay or side drawer toggled via a 3-line icon that animates to an X.
- **4.3 Mega Menu:** Large absolute-positioned dropdowns with grids, featured panels, complex subcategories.
- **4.4 Dot Navigation:** Fixed right-side dots for full-page scroll sections.
- **4.5 Breadcrumbs:** Hierarchy links (Home > Category > Page) for deep sites.
- **4.6 Tab Navigation:** Clickable tabs swapping content panels, preferably with animated sliding indicators.


## 5. Typography & Color
### 5.1 Type Scale & Hierarchy
- Use a mathematical scale (e.g., `clamp(min, fluid, max)`). `letter-spacing` negative on large text.

### 5.2 Font Pairing
- Choose distinctive pairs (Editorial: Playfair Display + DM Sans; Modern: Clash Display + Satoshi; SaaS: Syne + Inter).

### 5.3 Color Theory: The 60-30-10 Rule
- 60% dominant neutral background, 30% secondary (cards), 10% accent (brand colored CTA).

### 5.4 Gradient Text
- `background: linear-gradient()`, `-webkit-background-clip: text`, `-webkit-text-fill-color: transparent`.

### 5.5 Display / Hero Typography
- Extra-large (`clamp(60px, 9vw, 120px)`), heavy text acting as the main visual instead of images.

### 5.6 Dark / Light Mode Toggle
- Use CSS properties (`--bg`, `--text`) updated via `data-theme` attribute (persisted in localStorage).


## 6. UI Patterns
- **6.1 Hero Section:** Headline, subheadline, primary CTA, social proof.
- **6.2 Pricing Table:** 3 columns, Pro tier highlighted with special borders/elevation.
- **6.3 Testimonials:** 3-column grid or dual-row infinite marquee.
- **6.4 Accordion / FAQ:** Expandable questions.
- **6.5 Modal / Dialog:** Centered overlay with backdrop blur, trapping focus.
- **6.6 Card Component:** Self-contained grouping block with hover lift (`translateY(-4px)`).

## Quick Reference: Prompting Vocabulary

- **For aesthetics**: glassmorphism / neumorphism / brutalism / minimalism / dark luxury / bento grid / claymorphism / Y2K
- **For feel**: premium / editorial / playful / corporate / warm / clean / bold / refined / futuristic
- **For layout**: hero + feature grid / bento / masonry / fullpage scroll / sidebar+content / split asymmetric
- **For animation**: scroll-triggered fade-up / parallax / sticky scroll / text reveal / horizontal scroll / smooth lenis
- **For navigation**: sticky frosted navbar / hamburger fullscreen / mega menu / dot navigation / tab navigation
- **For components**: pricing table with toggle / testimonial marquee / FAQ accordion / sticky scroll feature / hero section / card grid
- **For typography**: display headline / type scale / gradient text / font pairing / tight letter-spacing
- **For color**: 60-30-10 rule / near-black dark mode / single accent color / gradient background / monochromatic

**CRITICAL**: When asked to build a web interface, refer heavily to this document. Pick an AESTHETIC, LAYOUT, and ANIMATION style from this guide to make a truly world-class UI design. DO NOT generate generic outputs.
