import { onError } from '@apollo/client/link/error';

import { DhApplicationInsights } from "@energinet-datahub/dh/shared/util-application-insights";

export const errorHandler = (logger: DhApplicationInsights) => onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
        logger.trackException(new Error(message), 3);
    });
  }
});
