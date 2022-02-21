import { setupServer } from 'msw/node';

import { handlers } from '@energinet-datahub/dh/shared/util-msw';

// Setup requests interception using the given handlers.
export const server = setupServer(...handlers);
