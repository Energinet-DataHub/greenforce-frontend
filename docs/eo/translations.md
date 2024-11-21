# Translation Guide

## Overview

The application uses Transloco for internationalization (i18n) with type-safe translations and URL-based language selection.

## Supported Languages

- Danish (default)
- English

## Implementation Details

### Core Configuration

- Route configuration: `libs/eo/core/shell/src/lib/eo-core-shell.routes.ts`
- Transloco provider: `libs/eo/core/shell/src/lib/eo-core-shell.providers.ts`

### Translation Files

- Danish: `libs/eo/core/globalization/assets-localization/i18n/da.ts`
- English: `libs/eo/core/globalization/assets-localization/i18n/en.ts`

### Type-Safe Implementation

Custom loader location:
`libs/gf/globalization/data-access-localization/src/lib/transloco-typed-loader.service.ts`

### Language Selection Logic

- URL parameter (primary)
- Browser language (fallback)
- Danish (default)

## Developer Guide

- Adding New Translations
- Import translation type definitions: `import { translations } from '@energinet-datahub/eo/translations';`
- Follow the guide in: libs/eo/core/globalization/assets-localization/readme.md

### Usage Examples

```ts
import { translations } from '@energinet-datahub/eo/translations';

// Example usage
const message = translate(translations.someKey);
```

#### In Templates

```html
<!-- Basic translation -->
{{ translations.someKey | transloco }}

<!-- With parameters -->
{{ translations.keyWithParams | transloco:{ param: value } }}

<!-- Dynamic keys -->
<span [translate]="translations.dynamicKey">
```

## Best Practices

### Type Safety

- Always use imported translation keys
- Avoid magic strings
- Leverage TypeScript for validation

### Structure

- Group related translations
- Use consistent naming
- Keep translations organized by feature

### Maintenance

- Keep translations up to date
- Review unused translations
- Validate all supported languages
