import type { MaskitoOptions } from '@maskito/core';
import { maskitoDateTimeOptionsGenerator, maskitoWithPlaceholder } from '@maskito/kit';

const PLACEHOLDER = 'dd-mm-yyyy, hh:mm';

const dateOptions = maskitoDateTimeOptionsGenerator({
  dateMode: 'dd/mm/yyyy',
  timeMode: 'HH:MM',
  dateSeparator: '-',
});

const { plugins, ...placeholderOptions } = maskitoWithPlaceholder(PLACEHOLDER);

export default {
  ...dateOptions,
  plugins: plugins.concat(dateOptions.plugins || []),
  preprocessors: [...placeholderOptions.preprocessors, ...dateOptions.preprocessors],
  postprocessors: [...dateOptions.postprocessors, ...placeholderOptions.postprocessors],
} satisfies Required<MaskitoOptions>;
