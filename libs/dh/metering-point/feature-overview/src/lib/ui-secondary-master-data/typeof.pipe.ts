import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeof'
})
export class TypeofPipe implements PipeTransform {

  transform(value: any): any {
    return typeof value;
  }

}

@NgModule({
  declarations: [
    TypeofPipe
  ],
  exports: [
    TypeofPipe
  ]
})
export class TypeOfModule {}