import 'jest-preset-angular/setup-jest';

import {
  setUpTestbed,
  setUpAngularTestingLibrary,
} from '@energinet-datahub/gf/test-util-staging';
import { addDomMatchers } from '@energinet-datahub/gf/test-util-matchers';

addDomMatchers();
setUpTestbed();
setUpAngularTestingLibrary();
