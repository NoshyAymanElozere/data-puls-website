# Styling & Theming

## Tailwind + CSS variables

Theme tokens defined in `src/app/index.css`:

```css
:root {
  --primary: ...;
  --main: ...;
}
.dark { ... }
```

Tailwind references tokens: `bg-primary`, `text-main`, `border-border`.

## cn() helper

`src/shared/utils/utils.ts` — merges Tailwind classes with `clsx` + `tailwind-merge`.

## Dark mode

`useTheme` hook toggles `light` / `dark` / `system` on `<html class>`.

AG Grid theme follows via `data-ag-theme-mode` attribute.

## Component variants

CVA used on `Button`, `Alert`, etc. Prefer variants over ad-hoc class strings.

## RTL

Arabic sets `dir="rtl"` on containers. Sidebar chevrons and grid pagination flip via `isRtl` checks.

## No CSS modules

All styling is Tailwind utility classes. No `.module.css` files.
