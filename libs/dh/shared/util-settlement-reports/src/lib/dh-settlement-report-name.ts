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
import { translate } from '@jsverse/transloco';

import { wattFormatDate } from '@energinet-datahub/watt/date';

import { DhSettlementReportPartial } from './dh-settlement-report-partial';

export function dhSettlementReportName(
  report: DhSettlementReportPartial,
  options: {
    withBaseName: boolean;
  } = { withBaseName: true }
): string {
  const baseTranslationPath = 'wholesale.settlementReports';

  const calculationPeriod = wattFormatDate(report.period, 'short');
  const calculationType = translate(
    `${baseTranslationPath}.calculationTypes.${report.calculationType}`
  );

  let name = '';

  if (options.withBaseName) {
    name += translate(`${baseTranslationPath}.downloadReport.baseName`) + ' - ';
  }

  name += calculationType;

  if (report.gridAreas.length === 1) {
    name += ` - ` + report.gridAreas[0];
  } else if (report.gridAreas.length > 1) {
    name += ` - ` + translate(`${baseTranslationPath}.downloadReport.multipleGridAreas`);
  }

  return `${name} - ${calculationPeriod}`;
}
