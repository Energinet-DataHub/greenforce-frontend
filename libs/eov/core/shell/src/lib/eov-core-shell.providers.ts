
import { eovAuthorizationInterceptorProvider } from '@energinet-datahub/eov/shared/services';
import { danishLocalProviders } from '@energinet-datahub/gf/configuration-danish-locale';
import { browserConfigurationProviders } from '@energinet-datahub/gf/util-browser';
import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';
import { WattModalService } from '@energinet-datahub/watt/modal';

export const eovCoreShellProviders = [
  browserConfigurationProviders,
  danishLocalProviders,
  danishDatetimeProviders,
  eovAuthorizationInterceptorProvider,
  WattModalService,
];
