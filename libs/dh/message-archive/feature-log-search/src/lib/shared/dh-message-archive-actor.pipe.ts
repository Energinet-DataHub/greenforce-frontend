import { Pipe, PipeTransform } from '@angular/core';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

@Pipe({ name: 'actorName', standalone: true })
export class ActorNamePipe implements PipeTransform {
  transform(
    actorId: string | null | undefined,
    actors: WattDropdownOptions | null
  ): string | undefined {
    if (!actorId) return 'N/A';
    const actor = actors?.find((x) => x.value === actorId);
    return actor?.displayValue === actor?.value ? 'N/A' : actor?.displayValue;
  }
}
