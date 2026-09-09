---
description: Review UI code for Vercel Web Interface Guidelines compliance
argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review these files for compliance: $ARGUMENTS

Read files, check against rules below. Output concise but comprehensive—sacrifice grammar for brevity. High signal-to-noise.

## Rules

### Accessibility

- Icon-only buttons need `aria-label`
- Form controls need `<label>` or `aria-label`
- Interactive elements need keyboard handlers (`onKeyDown`/`onKeyUp`)
- `<button>` for actions, `<a>`/`<Link>` for navigation (not `<div onClick>`)
- Images need `alt` (or `alt=""` if decorative)
- Decorative icons need `aria-hidden="true"`
- Async updates (toasts, validation) need `aria-live="polite"`
- Use semantic HTML (`<nav>`, `<main>`, `<aside>`, `<section>`) before ARIA
- Headings hierarchical `<h1>`–`<h6>`; include skip link for main content
- `scroll-margin-top` on heading anchors

### Focus States

- Interactive elements need visible focus: `focus-visible:ring-*` or equivalent
- Never `outline-none` / `outline: none` without focus replacement
- Use `:focus-visible` over `:focus` (avoid focus ring on click)
- Group focus with `:focus-within` for compound controls

### Forms

- Inputs need `autocomplete` and meaningful `name`
- Use correct `type` (`email`, `tel`, `url`, `number`) and `inputmode`
- Never block paste (`onPaste` + `preventDefault`)
- Labels clickable (`htmlFor` or wrapping control)
- Disable spellcheck on emails, codes, usernames (`spellCheck={false}`)
- Checkboxes/radios: label + control share single hit target (no dead zones)
- Submit button stays enabled until request starts; spinner during request
- Errors inline next to fields; focus first error on submit
- Placeholders end with `…` and show example pattern
- `autocomplete="off"` on non-auth fields to avoid password manager triggers
- Warn before navigation with unsaved changes (`beforeunload` or router guard)

### Animation

- Honor `prefers-reduced-motion` (provide reduced variant or disable)
- Animate `transform`/`opacity` only (compositor-friendly)
- Never `transition: all`—list properties explicitly
- Set correct `transform-origin`
- SVG: transforms on `<g>` wrapper with `transform-box: fill-box; transform-origin: center`
- Animations interruptible—respond to user input mid-animation

### Typography

- `…` not `...`
- Curly quotes `"` `"` not straight `"`
- Non-breaking spaces: `10 MB`, `Cmd K`, brand names
- Loading states end with `…`: `"Loading…"`, `"Saving…"`
- `font-variant-numeric: tabular-nums` for number columns/comparisons
- Use `text-wrap: balance` or `text-pretty` on headings (prevents widows)

### Content Handling

- Text containers handle long content: `truncate`, `line-clamp-*`, or `break-words`
- Flex children need `min-w-0` to allow text truncation
- Handle empty states—don't render broken UI for empty strings/arrays
- User-generated content: anticipate short, average, and very long inputs

### Images

- `<img>` needs explicit `width` and `height` (prevents CLS)
- Below-fold images: `loading="lazy"`
- Above-fold critical images: `priority` or `fetchpriority="high"`

### Performance

- Large lists (>50 items): virtualize (`virtua`, `content-visibility: auto`)
- No layout reads in render (`getBoundingClientRect`, `offsetHeight`, `offsetWidth`, `scrollTop`)
- Batch DOM reads/writes; avoid interleaving
- Prefer uncontrolled inputs; controlled inputs must be cheap per keystroke
- Add `<link rel="preconnect">` for CDN/asset domains
- Critical fonts: `<link rel="preload">` with `font-display: swap`

### Navigation & State

- URL reflects state—filters, tabs, pagination, expanded panels in query params
- Links use `<a>`/`<Link>` (Cmd/Ctrl+click, middle-click support)
- Deep-link all stateful UI (if uses `useState`, consider URL sync via nuqs or similar)
- Destructive actions need confirmation modal or undo window—never immediate

### Touch & Interaction

- `touch-action: manipulation` (prevents double-tap zoom delay)
- `-webkit-tap-highlight-color` set intentionally
- `overscroll-behavior: contain` in modals/drawers/sheets
- During drag: disable text selection, `inert` on dragged elements
- `autoFocus` sparingly—desktop only, single primary input; avoid on mobile

### Safe Areas & Layout

- Full-bleed layouts need `env(safe-area-inset-*)` for notches
- Avoid unwanted scrollbars: `overflow-x-hidden` on containers, fix content overflow
- Flex/grid over JS measurement for layout

### Dark Mode & Theming

- `color-scheme: dark` on `<html>` for dark themes (fixes scrollbar, inputs)
- `background-color` matches page background
- Native `<select>`, `<input>` appearance matches theme
- Avoid pure black `#000` backgrounds—use near-black (`#0a0a0a`, `#111`)
- Test with OS-level dark mode, not just class toggle

### Responsiveness

- Content reflows—no horizontal scroll on any viewport width
- Touch targets >= 44x44px (WCAG 2.5.8)
- Test at 320px, 768px, 1024px, 1440px minimum
- Media queries match breakpoints, not device names
- Images/videos scale with container, maintain aspect ratio

### Color & Contrast

- Text contrast >= 4.5:1 (AA), >= 7:1 (AAA) for body text
- Large text (18px+ bold / 24px+) contrast >= 3:1
- Don't rely on color alone to convey meaning
- Focus indicators contrast >= 3:1 against background

### Error Handling

- Error boundaries catch rendering errors—show recovery UI
- Network errors: retry button, clear message, no raw error dumps
- Loading + error + empty states for all async content
- Form validation: immediate on blur, summary on submit

### SEO & Meta

- `<title>` unique per page, descriptive
- `<meta name="description">` unique per page
- Open Graph / Twitter cards for shared pages
- Canonical URL to prevent duplicate content
- Structured data (JSON-LD) for rich results

## Output Format

```
[SEVERITY] file:line  issue
```

Severity: CRITICAL | HIGH | MEDIUM | LOW | INFO

Group by file. Sort by severity within file.

## Examples

```
[CRITICAL] Button.tsx:42  Icon-only button missing aria-label
[HIGH] Form.tsx:18       No autocomplete attribute on email input
[MEDIUM] Card.tsx:7       <div onClick> should be <button>
[LOW] Hero.tsx:23         Image missing explicit width/height
[INFO] Layout.tsx:1       Consider adding skip link
```
