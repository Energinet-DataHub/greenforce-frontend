/**
 * NOTE: Keep in sync with ./_breakpoints.scss
 * NOTE: We don't use CSS Custom Properties for our breakpoints,
 * because they can't be used in media queries and we don't want those changed on the fly
 */
export enum WattBreakpoint {
  XSmall = '(max-width: 599.98px)',
  Small = '(min-width: 600px) and (max-width: 959.98px)',
  Medium = '(min-width: 960px) and (max-width: 1279.98px)',
  Large = '(min-width: 1280px) and (max-width: 1919.98px)',
  XLarge = '(min-width: 1920px)',
}
