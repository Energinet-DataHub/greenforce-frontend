import { translate } from '@ngneat/transloco';

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
