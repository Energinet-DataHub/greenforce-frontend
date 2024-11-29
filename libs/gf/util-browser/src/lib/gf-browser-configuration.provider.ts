import { makeEnvironmentProviders } from '@angular/core';

import { detectBaseHrefProvider } from './detect-base-href.provider';

export const browserConfigurationProviders = makeEnvironmentProviders([detectBaseHrefProvider]);
