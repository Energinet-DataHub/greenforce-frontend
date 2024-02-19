# eo-globalization-assets-localization

## Generate translations

To avoid "magic-strings" for translations, we autogenerate a const for our translations based on the interface `TranslationKeys` placed in `./i18n/translation-keys.ts`

```sh
yarn nx run eo-globalization-assets-localization:generate-translation-keys
```

## Add new translations

- Add the new translation key to `./i18n/translation-keys.ts`
- Add the translation to `./i18n/da.ts`
- Add the translation to `./i18n/en.ts`
- [Generate a new version of the `translations.ts` (see Generate translations)](#generate-translations)
