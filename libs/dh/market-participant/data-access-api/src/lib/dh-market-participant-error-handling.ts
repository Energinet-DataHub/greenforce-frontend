import { flatten, translate } from '@ngneat/transloco';

import { ApiError, ApiErrorDescriptor } from '@energinet-datahub/dh/shared/domain/graphql';

export type ApiErrorCollection = Pick<ApiError, 'apiErrors'>;

export const readApiErrorResponse = (errors: ApiErrorCollection[]) => {
  return errors
    .flatMap((error) => error.apiErrors)
    .map(translateApiError)
    .join(' ');
};

const translateApiError = (errorDescriptor: ApiErrorDescriptor) => {
  const translationKey = `marketParticipant.${errorDescriptor.code}`;
  const translation = translate(
    translationKey,
    flatten(translateArgs(errorDescriptor.args, translationKey))
  );
  return translationKey === translation
    ? translate(`marketParticipant.market_participant.error_fallback`, {
        message: errorDescriptor.message,
      })
    : translation;
};

const translateArgs = (args: Record<string, string>, code: string) =>
  Object.entries(args).reduce((acc, [key, value]) => {
    const translationPath = code.split('.');
    translationPath.pop();
    const translationKey = `${translationPath.join('.')}.args.${key}.${value}`;
    const translation = translate(translationKey);
    return { ...acc, [key]: translationKey === translation ? translationKey : translation };
  }, {});
