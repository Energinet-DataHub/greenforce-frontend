# B2C Custom Layouts

## Prerequisite

Before getting started, read the documentation at Microsoft to get familiar with the fundamentals of how custom layouts in B2C work: [Customize the user interface with HTML templates in Azure Active Directory B2C](https://docs.microsoft.com/en-us/azure/active-directory-b2c/customize-ui-with-html?pivots=b2c-user-flow).

## Files

- `login-unified.html` - custom login layout
- `signup-unified.html` - custom sign up layout
- `self-asserted.html` - custom reset password layout

## Getting started

The custom layouts are static HTML pages with vanilla CSS. Styles for inputs etc., are manually ported as the Design System is not used here.

### Simulate content inserted by B2C `#api`

Go to the live page and inspect the page with Dev Tools. Find the `#api` element, copy its `outerHTML` and insert it into the custom layout you want to change to simulate what Microsoft inserts into the DOM.

### Working with translations

Microsoft automatically adds `lang` attribute to `<html>`, which is why this is not included in the static pages. To see the translated texts add `lang="en"` or `lang="da"` to `<html>` (otherwise the text will be hidden).

Translations should have the `imprint` class and `imprint-<LANGUAGE>` class, example:

- `<h1 class="imprint imprint-en">English text</h1>`
- `<h1 class="imprint imprint-da">Dansk tekst</h1>`
