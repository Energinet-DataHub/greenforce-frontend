# `phone-metadata.json`

Custom-built metadata bundle for [`libphonenumber-js`](https://gitlab.com/catamphetamine/libphonenumber-js) used by `WattPhoneFieldComponent`. The component imports from `libphonenumber-js/core` (no built-in metadata) and passes this file at call time:

```ts
import { isValidPhoneNumber, type CountryCode, type MetadataJson } from 'libphonenumber-js/core';
import phoneMetadataJson from './phone-metadata.json';
const phoneMetadata = phoneMetadataJson as unknown as MetadataJson;
```

## Why

The default `libphonenumber-js/min/metadata` bundle covers every country in the E.164 directory and weighs roughly 83 KB. The DataHub phone field is only ever used to capture phone numbers for market participants in the Nordics, UK, DE, FI, PL, NL and CH, so the rest of the metadata is dead weight. Shipping a hand-picked subset reduces the lazy chunk that pulls `libphonenumber-js` in by roughly 75 KB.

## Currently supported countries

`DK, SE, NO, GB, DE, FI, PL, NL, CH`

This must stay in sync with the country list in `WattPhoneFieldComponent.countries` (the flag dropdown) and with `shared.countries` in the DataHub transloco files. If a country is added here but missing from either of the other two, the UI will accept a number the user cannot actually pick from the dropdown, or the flag will render without a translated label.

## How to update

The file is committed to the repo (not generated at build time). Regenerate it with:

```bash
bunx libphonenumber-metadata-generator \
  libs/watt/package/phone-field/phone-metadata.json \
  --countries DK,SE,NO,GB,DE,FI,PL,NL,CH
```

Commit the updated JSON along with any code or translation changes. The generator downloads the upstream `PhoneNumberMetadata.xml` at runtime, so it needs network access.

### Adding a new country

1. Append the ISO 3166-1 alpha-2 code to the `--countries` list above and run the regeneration command.
2. Add the country to the `countries` array in `watt-phone-field.component.ts`.
3. Add a translation entry under `shared.countries.<CODE>` in the DataHub transloco files (`libs/dh/globalization/assets-localization/src/assets/i18n/*.json`). `DhPhoneFieldIntlService` in `configuration-watt-translation` also needs the new code wired up so the dropdown label stays localised.
4. Verify the phone field renders and validates the new country in a browser.

### Refreshing to the latest upstream data

Re-run the regeneration command without changing the country list. The tool prints the upstream metadata version and changelog so you can spot meaningful changes before committing.

## What the file contains

A JSON object with three top-level keys:

- `version`: the `libphonenumber-metadata-generator` format version. Different values indicate a breaking change in the structure; bump `libphonenumber-js` and regenerate if that ever happens.
- `country_calling_codes`: map of calling code (`45`, `46`, ...) to the list of country codes that share it.
- `countries`: per-country validation rules, formatting patterns, and example numbers.

Do not hand-edit this file. Always regenerate.

## Compatibility

The committed file currently uses `"version": 4`, which matches `libphonenumber-js@^1.10.0`. When bumping the `libphonenumber-js` dependency in `package.json`, regenerate the metadata and confirm the version key still matches what the installed `libphonenumber-js` expects. A mismatch will throw at runtime inside `isValidPhoneNumber`.
