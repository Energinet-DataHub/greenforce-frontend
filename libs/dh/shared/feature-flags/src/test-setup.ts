import 'jest-preset-angular/setup-jest';

import { addDomMatchers } from '@energinet-datahub/gf/test-util-matchers';
import { setUpTestbed } from '@energinet-datahub/gf/test-util-staging';

addDomMatchers();
setUpTestbed();
