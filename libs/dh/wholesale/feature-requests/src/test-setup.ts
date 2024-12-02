import 'jest-preset-angular/setup-jest';

import { setUpTestbed, setUpAngularTestingLibrary } from '@energinet-datahub/gf/test-util-staging';
import { addDomMatchers } from '@energinet-datahub/gf/test-util-matchers';
import { setupMSWServer } from '@energinet-datahub/gf/test-util-msw';
import { dhLocalApiEnvironment } from '@energinet-datahub/dh/shared/assets';
import { mocks } from '@energinet-datahub/dh/shared/data-access-mocks';

setupMSWServer(dhLocalApiEnvironment.apiBase, mocks);
addDomMatchers();
setUpTestbed();
setUpAngularTestingLibrary();
