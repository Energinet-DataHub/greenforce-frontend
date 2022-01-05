import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { MeteringPointType } from '@energinet-datahub/dh/shared/data-access-api';

@Pipe({
  name: 'isParent'
})
export class IsParentPipe implements PipeTransform {

  transform(value: MeteringPointType | undefined): boolean {
    if(value === MeteringPointType.E17 || value === MeteringPointType.E18 || value === MeteringPointType.E20)
    return true;
    return false;
  }

}

@NgModule({
  declarations: [IsParentPipe],
  exports: [IsParentPipe],
})
export class DhIsParentPipeScam {}
