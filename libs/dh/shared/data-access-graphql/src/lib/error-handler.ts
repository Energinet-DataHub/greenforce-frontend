import { onError } from '@apollo/client/link/error';

import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';
import { translate } from '@ngneat/transloco';
import { GraphQLError } from 'graphql';

export const errorHandler = (logger: DhApplicationInsights) =>
  onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, extensions }) => {
        logger.trackException(
          new Error(extensions ? (extensions['details'] as string) || message : message),
          3
        );
      });
    }
  });

export const parseGraphQLErrorResponse = (errorResponse: readonly GraphQLError[]) => {
  return errorResponse
    .map((x) => {
      const translationKey = `graphQLErrors.${x.name.toLowerCase()}`;
      const translation = translate(translationKey);
      return translation === translationKey ? x.message : translation;
    })
    .join(' ');
};
