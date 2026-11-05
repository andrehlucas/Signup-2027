---
name: Opus Virtual Offices
description: Clear, direct enrollment for virtual office services.
colors:
  brand-blue: "#36bff9"
  brand-blue-hover: "#2aa8e0"
  brand-blue-ink: "#006d91"
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
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.text-primary}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.brand-blue-hover}"
    textColor: "{colors.text-primary}"
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
---

# Design System: Opus Virtual Offices

## Overview

**Creative North Star: "The Guided Business Signup"**

The interface is a clear, professional path through a focused enrollment task. A centered form, visible step progress, and one prominent action keep attention on completing the current step. Inter typography and restrained neutral surfaces support quick scanning without competing with the form.

Brand Blue identifies active progress and primary actions. The Opus logo anchors the white header; its red mark is a supporting brand detail rather than a recurring interface accent. Static surfaces are defined by fine borders, while elevation is reserved for transient menus and popovers.

**Key Characteristics:**
- Clear, direct form hierarchy
- Professional neutral surfaces with a focused blue action color
- Progress indicators make the multi-step flow visible
- Borders define static cards and fields; shadows belong to overlays

## Colors

The palette is built around Brand Blue and a quiet range of white, cool gray, and deep slate; Opus Red appears in the logo.

### Primary
- **Brand Blue**: Primary buttons, links, the active progress step, and completed progress markers.
- **Brand Blue Hover**: Hover state for primary actions.
- **Brand Blue Ink**: Readable blue links, active progress labels, and outline markers on light surfaces. Keep dark Primary Ink text on the light Brand Blue button fill for sufficient contrast.

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

Name fields sit side by side when space allows and stack on narrow screens. Persistent labels identify each field. The phone, email, company, and consent controls remain in a clear vertical sequence, ending in a full-width primary action. Progress labels are visible on wider screens; smaller screens show numbered markers and a compact current-step summary. Preserve generous separation between the page heading, progress, and form.

## Elevation & Depth

The system is flat and border-led. The main signup card has a white surface and a fine outline without a resting shadow; fields use their own thin borders. Dropdowns and menus may lift above the page with a restrained shadow so their temporary, interactive state is clear.

### Shadow Vocabulary
- **Transient overlay:** Use the existing soft shadow treatment for dropdown menus and popovers, not for static form surfaces.

## Shapes

Fields and controls use compact, gently rounded corners. The main form card has a more generous rounded edge, while progress markers are circular. Borders stay thin and understated; avoid decorative clipping or oversized pill shapes except where the component is inherently circular.

## Components

### Buttons
- **Character:** Clear and direct; primary actions are easy to identify.
- **Primary:** Brand Blue fill, Primary Ink semibold text, compact rounded corners, and a generous full-width treatment for the main signup action.
- **Hover / Focus:** Darken to Brand Blue Hover on hover. Keep the visible focus ring and keyboard interaction from the shared button component.
- **Secondary / Outline:** Use a light surface and thin neutral border where a secondary action is needed; do not give it the visual weight of the primary action.

### Cards / Containers
- **Character:** Quiet and task-focused.
- **Corner Style:** Rounded more generously than fields.
- **Background:** White against the light-gray page canvas.
- **Shadow Strategy:** No resting shadow on the main form card; use a subtle border instead.
- **Border:** Fine neutral outline.
- **Internal Padding:** More spacious on desktop and reduced on mobile.

### Inputs / Fields
- **Character:** Plain, readable, and easy to scan.
- **Style:** White fill, thin neutral border, compact rounded corners, and comfortable horizontal padding.
- **Focus:** Preserve the shared visible focus ring.
- **Error / Disabled:** Validation errors use a clear red border and message; disabled controls reduce emphasis and prevent interaction.

### Navigation
- **Style:** A centered logo in a simple white header with a thin divider below.
- **Progress:** Four numbered circular markers connect in a horizontal sequence. Brand Blue marks the current and completed steps; neutral outlines and text mark upcoming steps.
- **Mobile:** Keep the numbered markers visible and show the current step name and total step count beneath them.

### Checkbox
- **Style:** A compact square control aligned with its consent copy.
- **State:** Keep the checked state distinct and preserve the associated label's readable hit area.

## Do's and Don'ts

### Do:
- **Do** use Brand Blue consistently for the primary action and active or completed progress.
- **Do** keep the captured signup color consistent; the shared blue utility is close but not identical.
- **Do** keep the logo centered in a clean white header.
- **Do** use fine borders to separate the static form card and fields from the page canvas.
- **Do** keep the step sequence visible while adapting its labels for narrow screens.

### Don't:
- **Don't** use Opus Red as a second primary action color; it is a logo accent in the current system.
- **Don't** add heavy shadows to static cards or form fields.
- **Don't** introduce decorative gradients, display fonts, or extra accent colors that are absent from the incumbent interface.
