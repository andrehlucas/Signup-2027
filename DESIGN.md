---
name: Opus Virtual Offices
description: Clear, direct enrollment for virtual office services.
colors:
  brand-blue: "#36bff9"
  brand-blue-hover: "#2aa8e0"
  brand-blue-ink: "#006d91"
  action-charcoal: "#344054"
  action-charcoal-hover: "#263241"
  opus-red: "#ff1e27"
  page-gray: "#f9fafb"
  surface-white: "#ffffff"
  text-primary: "#101828"
  text-muted: "#475467"
  border-subtle: "#eaecf0"
  field-border: "hsl(214.3 31.8% 91.4%)"
typography:
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: "36px"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "28px"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.action-charcoal}"
    textColor: "{colors.surface-white}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.action-charcoal-hover}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.sm}"
  field:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "12px"
    height: "48px"
  signup-card:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "24px 32px"
  static-surface:
    backgroundColor: "{colors.surface-white}"
    border: "1px solid {colors.border-subtle}"
    rounded: "{rounded.lg}"
    elevation: "none"
---

# Design System: Opus Virtual Offices

## Overview

**Creative North Star: "The Guided Business Signup"**

The interface is a clear, professional path through a focused enrollment task. A centered form, visible step progress, and one prominent action keep attention on completing the current step. Inter typography and restrained neutral surfaces support quick scanning without competing with the form.

Neutral charcoal identifies primary actions across the enrollment flow. Brand Blue is reserved for the current progress segment, subtle selected outlines, and keyboard focus. The Opus logo anchors the white header; its red mark is a supporting brand detail rather than a recurring interface accent. Static surfaces are defined by fine borders, while elevation is reserved for transient menus and popovers.

**Key Characteristics:**
- Clear, direct form hierarchy
- Neutral surfaces and charcoal actions with restrained blue state cues
- Progress indicators make the multi-step flow visible
- Borders define static cards and fields; shadows belong to overlays

## Colors

The palette is built around white, cool gray, deep slate, and charcoal actions. Brand Blue is a limited interaction accent; Opus Red appears in the logo.

### Primary
- **Action Charcoal**: Primary buttons, paired with white text for strong contrast.
- **Action Charcoal Hover**: A slightly darker hover state for primary actions.
- **Brand Blue**: Current progress segment, subtle selected outlines, and keyboard focus.
- **Brand Blue Ink**: Readable active-step label and focus treatments on light surfaces.

### Secondary
- **Opus Red**: Logo detail. Keep it in the brand mark rather than promoting it to a competing action color.

### Neutral
- **Page Gray**: The main canvas behind the enrollment form.
- **Surface White**: Header, form card, fields, and progress markers.
- **Primary Ink**: Main headings and high-priority text.
- **Muted Slate**: Supporting labels and secondary text.
- **Subtle Rule**: Card borders and dividers.
- **Field Rule**: Input outlines and focus-adjacent boundaries.

## Typography

**Display Font:** Inter (with system sans-serif fallbacks)  
**Body Font:** Inter (with system sans-serif fallbacks)  
**Label/Mono Font:** No separate label or monospace family is used.

**Character:** A single sans-serif family keeps the experience direct and consistent. Strong, compact headings establish the task; regular body copy and medium-weight labels keep form details readable.

### Hierarchy
- **Headline** (bold): The enrollment heading, responsive from a compact mobile size to the desktop title scale.
- **Title** (semibold): Prominent actions and section headings.
- **Body** (regular): Instructions and longer explanatory text.
- **Label** (medium): Field labels, step names, and compact supporting information.
- **Small text** (regular or medium): Validation messages and secondary details; retain readable contrast.

## Layout

The signup screen uses a centered single-column composition. The logo sits in a full-width white header; the main heading and four-step progress indicator sit above a centered form card. The form card is constrained to a comfortable reading width, with wider desktop padding and tighter mobile padding.

Name fields sit side by side when space allows and stack on narrow screens. Persistent labels identify each field. The phone, email, company, and consent controls remain in a clear vertical sequence, ending in a full-width primary action. Progress uses four equal-width thin bars with their labels beneath, visible at every screen size. Preserve generous separation between the page heading, progress, and form.

## Elevation & Depth

The system is flat and border-led. The main signup card has a white surface and a fine outline without a resting shadow; fields use their own thin borders. Dropdowns and menus may lift above the page with a restrained shadow so their temporary, interactive state is clear.

### Shadow Vocabulary
- **Transient overlay:** Use the existing soft shadow treatment for dropdown menus and popovers, not for static form surfaces.

## Shapes

Fields and controls use compact, gently rounded corners. The main form card has a more generous rounded edge, while progress segments use thin bars with rounded ends. Borders stay thin and understated; avoid decorative clipping or oversized pill shapes.

## Components

### Buttons
- **Character:** Clear and direct; primary actions are easy to identify.
- **Primary:** Action Charcoal fill, white semibold text, compact rounded corners, and a generous full-width treatment for the main signup action.
- **Hover / Focus:** Darken to Action Charcoal Hover on hover. Keep a restrained blue focus ring and the keyboard interaction from the shared button component.
- **Secondary / Outline:** Use a light surface and thin neutral border where a secondary action is needed; do not give it the visual weight of the primary action.
- **Across enrollment routes:** Use the same charcoal fill with white text for primary controls. Secondary controls remain white with a fine neutral outline.

### Cards / Containers
- **Character:** Quiet and task-focused.
- **Corner Style:** Rounded more generously than fields.
- **Background:** White against the light-gray page canvas.
- **Shadow Strategy:** No resting shadow on the main form card; use a subtle border instead.
- **Border:** Fine neutral outline.
- **Internal Padding:** More spacious on desktop and reduced on mobile.
- **Route consistency:** Location, plan, add-on, checkout, and confirmation surfaces use the same flat white surface, subtle rule, and 12px corner. Selected package and add-on states use a thin blue-ink outline with a neutral fill rather than colored gradients.

### Inputs / Fields
- **Character:** Plain, readable, and easy to scan.
- **Style:** White fill, thin neutral border, compact rounded corners, and comfortable horizontal padding.
- **Focus:** Preserve the shared visible focus ring.
- **Error / Disabled:** Validation errors use a clear red border and message; disabled controls reduce emphasis and prevent interaction.

### Navigation
- **Style:** A centered logo in a simple white header with a thin divider below.
- **Progress:** Four equal-width, 4px-high rounded bars sit above left-aligned semibold labels. Brand Blue marks the current bar; completed bars use slate and upcoming bars use neutral gray. Completed steps support keyboard-accessible backward navigation; future steps are not interactive.
- **Responsive:** Use a wider single row on desktop and a two-column, two-row grid on phones. Keep every label on one line without truncation or horizontal scrolling.
- **Analytics:** Keep funnel charts and reporting data unchanged; reduce mobile header and KPI padding while retaining two KPI columns on compact viewports.

### Checkbox
- **Style:** A compact square control aligned with its consent copy.
- **State:** Keep the checked state distinct and preserve the associated label's readable hit area.

## Do's and Don'ts

### Do:
- **Do** use charcoal for primary actions and reserve Brand Blue for current progress, selected outlines, and focus.
- **Do** keep the logo centered in a clean white header.
- **Do** use fine borders to separate the static form card and fields from the page canvas.
- **Do** keep the step sequence visible while adapting its labels for narrow screens.

### Don't:
- **Don't** use Opus Red as a second primary action color; it is a logo accent in the current system.
- **Don't** add heavy shadows to static cards or form fields.
- **Don't** introduce decorative gradients, display fonts, or extra accent colors that are absent from the incumbent interface.
