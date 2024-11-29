import { makeEnvironmentProviders } from '@angular/core';
import { danishDatetimeProviders } from '../../../../configuration/watt-danish-datetime.providers';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { danishLocalProviders } from '@energinet-datahub/gf/globalization/configuration-danish-locale';

export const localizationProviders = makeEnvironmentProviders([
  danishLocalProviders,
  danishDatetimeProviders,
]);
