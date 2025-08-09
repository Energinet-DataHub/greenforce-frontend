//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { NotificationType } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  BasePaths,
  ESettSubPaths,
  getPath,
  MarketParticipantSubPaths,
  ReportsSubPaths,
} from '@energinet-datahub/dh/core/routing';

import { DhNotification } from './dh-notification';

export function dhGetRouteByType({ notificationType, relatedToId }: DhNotification): string[] {
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
        getPath<BasePaths>('reports'),
        getPath<ReportsSubPaths>('settlements'),
        getPath<ReportsSubPaths>('settlement-reports'),
      ];
    case NotificationType.ActorCredentialsExpiring:
    case NotificationType.ActorConsolidationScheduled:
      return [
        rootPath,
        getPath<BasePaths>('market-participant'),
        getPath<MarketParticipantSubPaths>('actors'),
      ];
    case NotificationType.GridLossValidationError:
      if (relatedToId) {
        return [rootPath, getPath<BasePaths>('metering-point'), relatedToId];
      }
      return [rootPath];
    default:
      return [rootPath];
  }
}
