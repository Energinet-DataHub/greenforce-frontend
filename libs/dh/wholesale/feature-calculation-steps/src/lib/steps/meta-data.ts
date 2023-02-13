import { WattDescriptionListGroups } from "@energinet-datahub/watt/description-list";
import { DhDatePipe } from "@energinet-datahub/dh/shared/ui-date-time";
import { combineLatest, map, Observable } from "rxjs";
import { Translation } from "@ngneat/transloco";
import { BatchDto, GridAreaDto, ProcessStepResultDto } from "@energinet-datahub/dh/shared/domain";
import { WattBadgeType } from "@energinet-datahub/watt/badge";

export function mapMetaData(translations$: Observable<Translation>, processStepResults$: Observable<ProcessStepResultDto | undefined>, vm$: Observable<{
  batch: BatchDto & {
      statusType: WattBadgeType;
  };
  gridArea: GridAreaDto;
}>): Observable<WattDescriptionListGroups> {
  return combineLatest([
    translations$,
    processStepResults$,
    vm$,
  ]).pipe(
    map(([translations, processStepResults, vm]) => {
      const datePipe = new DhDatePipe();

      return [
        {
          term: translations['wholesale.processStepResults.meteringPointType'],
          description:
            translations[
              'wholesale.processStepResults.processStepMeteringPointType.' +
                processStepResults?.processStepMeteringPointType
            ],
        },
        {
          term: translations['wholesale.processStepResults.calculationPeriod'],
          description: `${datePipe.transform(
            vm.batch?.periodStart
          )} - ${datePipe.transform(vm.batch?.periodEnd)}`,
        },
        {
          term: translations['wholesale.processStepResults.sum'],
          description: `${processStepResults?.sum} kWh`,
          forceNewRow: true,
        },
        {
          term: translations['wholesale.processStepResults.min'],
          description: `${processStepResults?.min} kWh`,
        },
        {
          term: translations['wholesale.processStepResults.max'],
          description: `${processStepResults?.max} kWh`,
        },
      ];
    })
  );
}
