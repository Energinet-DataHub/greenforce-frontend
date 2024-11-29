import { NotificationType } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  BasePaths,
  ESettSubPaths,
  getPath,
  MarketParticipantSubPaths,
  WholesaleSubPaths,
} from '@energinet-datahub/dh/core/routing';

import { DhNotification } from './dh-notification';

export function dhGetRouteByType({ notificationType }: DhNotification): string[] {
  const rootPath = '/';

  switch (notificationType) {
    case NotificationType.BalanceResponsibilityValidationFailed:
    case NotificationType.BalanceResponsibilityActorUnrecognized:
    case NotificationType.NewBalanceResponsibilityReceived:
      return [rootPath, getPath<BasePaths>('esett'), getPath<ESettSubPaths>('balance-responsible')];
    case NotificationType.MeteringGridAreaIsImbalanced:
      return [
        rootPath,
        getPath<BasePaths>('esett'),
        getPath<ESettSubPaths>('metering-gridarea-imbalance'),
      ];
    case NotificationType.SettlementReportReadyForDownload:
    case NotificationType.SettlementReportFailed:
      return [
        rootPath,
        getPath<BasePaths>('wholesale'),
        getPath<WholesaleSubPaths>('settlement-reports'),
      ];
    case NotificationType.ActorCredentialsExpiring:
      return [
        rootPath,
        getPath<BasePaths>('market-participant'),
        getPath<MarketParticipantSubPaths>('actors'),
      ];
    default:
      return [rootPath];
  }
}
