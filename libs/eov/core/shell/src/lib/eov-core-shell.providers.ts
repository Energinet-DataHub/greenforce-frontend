
import { danishLocalProviders } from '@energinet-datahub/gf/configuration-danish-locale';
import { browserConfigurationProviders } from '@energinet-datahub/gf/util-browser';
import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';

export const eovCoreShellProviders = [
  browserConfigurationProviders,
  danishLocalProviders,
  danishDatetimeProviders,
];
