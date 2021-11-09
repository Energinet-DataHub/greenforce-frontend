import 'jest-preset-angular/setup-jest';

import { addNgModuleMatchers } from '@energinet-datahub/gf/test-util-matchers';
import { setUpTestbed } from '@energinet-datahub/gf/test-util-staging';

addNgModuleMatchers();

setUpTestbed();
