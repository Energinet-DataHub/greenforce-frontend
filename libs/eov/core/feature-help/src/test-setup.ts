import 'jest-preset-angular/setup-jest';

import { setUpTestbed, setUpAngularTestingLibrary } from '@energinet-datahub/gf/test-util-staging';
import { addDomMatchers } from '@energinet-datahub/gf/test-util-matchers';
import { setupMSWServer } from '@energinet-datahub/gf/test-util-msw';
import { eovLocalApiEnvironment } from '@energinet-datahub/eov/shared/assets';
import { mocks } from '@energinet-datahub/eov/shared/data-access-mocks';

setupMSWServer(eovLocalApiEnvironment.apiBase, mocks);
addDomMatchers();
setUpTestbed();
setUpAngularTestingLibrary();
