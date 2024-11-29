import 'jest-preset-angular/setup-jest';

import { addDomMatchers } from '@energinet-datahub/gf/test-util-matchers';
import {
  setUpAngularTestingLibrary,
  setUpNgMocks,
  setUpTestbed,
} from '@energinet-datahub/gf/test-util-staging';

addDomMatchers();
setUpTestbed();
setUpAngularTestingLibrary();
setUpNgMocks();
